// Supabase -> Tally. Only rows a person has APPROVED in the app. Masters are created; vouchers go in as OPTIONAL.
// Safety order for every row: claim it (so it is never sent twice), check every name against the Tally copy,
// skip it if Tally already has it, send it, record Tally's exact answer. Nothing is retried blindly.
import { buildLedgerCreate, buildOptionalVoucher, validateVoucherPayload } from './xml.js';
import { must } from './supabase.js';
import { resolveCompany } from './reader.js';
import { log } from './config.js';

async function namesExist(sb, table, companyGuid, names) {
  const wanted = [...new Set(names.filter(Boolean))];
  if (wanted.length === 0) return [];
  const rows = await must(sb.from(table).select('name').eq('company_guid', companyGuid).in('name', wanted), `check ${table}`);
  const have = new Set(rows.map((r) => r.name));
  return wanted.filter((n) => !have.has(n));
}

export async function checkVoucherNames(sb, companyGuid, p) {
  const problems = validateVoucherPayload(p);
  const ledgers = [p.partyLedger, ...(p.ledgerEntries || []).map((e) => e.ledger), ...(p.inventoryEntries || []).map((e) => e.salesLedger)];
  for (const n of await namesExist(sb, 'tally_ledgers', companyGuid, ledgers)) problems.push(`ledger not in Tally: ${n}`);
  for (const n of await namesExist(sb, 'tally_stock_items', companyGuid, (p.inventoryEntries || []).map((e) => e.item))) problems.push(`stock item not in Tally: ${n}`);
  for (const n of await namesExist(sb, 'tally_godowns', companyGuid, (p.inventoryEntries || []).map((e) => e.godown))) problems.push(`godown not in Tally: ${n}`);
  for (const n of await namesExist(sb, 'tally_voucher_types', companyGuid, [p.voucherType])) problems.push(`voucher type not in Tally: ${n}`);
  for (const n of await namesExist(sb, 'tally_cost_centres', companyGuid, (p.ledgerEntries || []).map((e) => e.costCentre))) problems.push(`cost centre not in Tally: ${n}`);
  return problems;
}

export async function checkLedgerCreate(sb, companyGuid, p) {
  const problems = [];
  if (!p?.name) problems.push('ledger name missing');
  if (!p?.parent) problems.push('parent group missing');
  if (p?.gstin && !/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(p.gstin)) problems.push(`GSTIN looks wrong: ${p.gstin}`);
  if (p?.name) {
    const exists = await must(sb.from('tally_ledgers').select('guid').eq('company_guid', companyGuid).eq('name', p.name).limit(1), 'check ledger');
    if (exists.length) problems.push(`a ledger named "${p.name}" already exists in Tally`);
  }
  if (p?.parent) for (const n of await namesExist(sb, 'tally_groups', companyGuid, [p.parent])) problems.push(`group not in Tally: ${n}`);
  return problems;
}

export async function writeCompany(tally, sb, cfg, cfgCompany) {
  const w = cfg.write || {};
  if (!w.enabled) return { skipped: 'write is switched off in config.json' };
  if (!cfgCompany.isTestCompany && !w.allowLiveCompanies) return { skipped: `live company "${cfgCompany.name}": write-back not yet allowed (write.allowLiveCompanies is false)` };
  const company = await resolveCompany(tally, sb, cfgCompany);

  const rows = await must(sb.rpc('bridge_claim_writebacks', {
    p_company_guid: company.guid,
    p_master_types: w.masters || [],
    p_voucher_types: w.voucherTypes || [],
    p_limit: w.maxPerRun || 20
  }), 'claim writebacks');

  const results = [];
  for (const row of rows) {
    let outcome;
    try {
      if (row.kind === 'voucher') {
        const already = await must(sb.from('tally_vouchers').select('guid, is_optional').eq('company_guid', company.guid).eq('app_tag', row.id).limit(1), 'check already in Tally');
        if (already.length) {
          outcome = { status: already[0].is_optional ? 'in_tally_optional' : 'converted', note: 'already in Tally; not sent again' };
        } else {
          const problems = await checkVoucherNames(sb, company.guid, row.payload);
          if (problems.length) outcome = { status: 'failed', error: problems.join('; ') };
          else {
            const res = await tally.importXml(buildOptionalVoucher(company.name, row.id, row.payload));
            outcome = res.ok ? { status: 'sent', response: res } : { status: 'failed', error: res.lineErrors.join('; ') || `Tally created ${res.created}, errors ${res.errors}`, response: res };
          }
        }
      } else if (row.kind === 'master' && row.object_type === 'Ledger') {
        const problems = await checkLedgerCreate(sb, company.guid, row.payload);
        if (problems.length) outcome = { status: 'failed', error: problems.join('; ') };
        else {
          const res = await tally.importXml(buildLedgerCreate(company.name, row.payload));
          outcome = res.ok ? { status: 'sent', response: res } : { status: 'failed', error: res.lineErrors.join('; ') || `Tally created ${res.created}, errors ${res.errors}`, response: res };
        }
      } else {
        outcome = { status: 'failed', error: `not supported yet: ${row.kind} ${row.object_type}` };
      }
    } catch (err) {
      // Unknown result (for example a timeout): do NOT resend automatically. A person checks Tally first.
      outcome = { status: 'check_in_tally', error: String(err.message || err) };
    }
    await must(sb.rpc('bridge_writeback_result', {
      p_id: row.id, p_status: outcome.status, p_error: outcome.error || null,
      p_response: outcome.response ? { ...outcome.response, raw: undefined } : (outcome.note ? { note: outcome.note } : null)
    }), 'record writeback result');
    log(outcome.status === 'failed' ? 'warn' : 'info', `writeback ${row.id} ${row.kind}/${row.object_type}: ${outcome.status}`, outcome.error ? { error: outcome.error } : undefined);
    results.push({ id: row.id, ...outcome });
  }
  return { company: company.name, written: results.length, results };
}
