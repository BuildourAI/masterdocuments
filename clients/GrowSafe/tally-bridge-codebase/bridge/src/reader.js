// Tally -> Supabase. Incremental by Tally's AlterID: only new or changed masters and vouchers.
// Deleted vouchers are found by comparing the list of voucher GUIDs per financial year.
import { MASTER_SPECS, VOUCHER_FETCH, masterRows, voucherRows } from './normalize.js';
import { findAll, text } from './xml.js';
import { must, chunks } from './supabase.js';
import { log } from './config.js';

const MASTER_ORDER = ['Group', 'Ledger', 'CostCentre', 'StockGroup', 'StockItem', 'Unit', 'Godown', 'VoucherType'];

export async function resolveCompany(tally, sb, cfgCompany) {
  const companies = await tally.listCompanies();
  const found = companies.find((c) => c.name.toLowerCase() === cfgCompany.name.toLowerCase());
  if (!found) throw new Error(`Company "${cfgCompany.name}" is not open in TallyPrime. Open companies: ${companies.map((c) => c.name).join(', ') || 'none'}`);
  await must(sb.from('tally_companies').upsert({
    guid: found.guid, name: found.name, books_from: found.books_from,
    is_test_company: !!cfgCompany.isTestCompany, last_seen_at: new Date().toISOString()
  }, { onConflict: 'guid' }), 'save company');
  return found;
}

async function getState(sb, companyGuid) {
  const rows = await must(sb.from('bridge_sync_state').select('kind, last_alter_id').eq('company_guid', companyGuid), 'read sync state');
  return Object.fromEntries(rows.map((r) => [r.kind, Number(r.last_alter_id)]));
}

async function setState(sb, companyGuid, kind, lastAlterId) {
  await must(sb.from('bridge_sync_state').upsert({
    company_guid: companyGuid, kind, last_alter_id: lastAlterId, updated_at: new Date().toISOString()
  }, { onConflict: 'company_guid,kind' }), `save sync state ${kind}`);
}

function monthsBetween(fromIso, toIso) {
  const out = [];
  const d = new Date(`${fromIso.slice(0, 7)}-01T00:00:00Z`);
  const end = new Date(`${toIso}T00:00:00Z`);
  while (d <= end) {
    const start = d.toISOString().slice(0, 10);
    const next = new Date(d); next.setUTCMonth(next.getUTCMonth() + 1);
    const last = new Date(next); last.setUTCDate(0);
    out.push([start, last.toISOString().slice(0, 10)]);
    d.setUTCMonth(d.getUTCMonth() + 1);
  }
  return out;
}

function today() { return new Date().toISOString().slice(0, 10); }
function farFuture() { const d = new Date(); d.setUTCFullYear(d.getUTCFullYear() + 1); return d.toISOString().slice(0, 10); }

async function saveVouchers(sb, companyGuid, vouchers) {
  let saved = 0;
  for (const part of chunks(vouchers, 200)) {
    await must(sb.rpc('bridge_upsert_vouchers', { p_company_guid: companyGuid, p_rows: part }), 'save vouchers');
    saved += part.length;
  }
  return saved;
}

export async function syncCompany(tally, sb, cfgCompany) {
  const run = { kind: 'sync', started_at: new Date().toISOString(), details: {} };
  const company = await resolveCompany(tally, sb, cfgCompany);
  run.company_guid = company.guid;
  const state = await getState(sb, company.guid);
  try {
    // 1. Masters, parents before children.
    for (const type of MASTER_ORDER) {
      const spec = MASTER_SPECS[type];
      const last = state[`master:${type}`] || 0;
      const tree = await tally.exportCollection({
        id: `GS${type}`, type, fetch: spec.fetch, company: company.name,
        filter: last > 0 ? `$AlterID > ${last}` : undefined
      });
      const rows = masterRows(tree, type, company.guid);
      for (const part of chunks(rows, 500)) {
        await must(sb.from(spec.table).upsert(part, { onConflict: 'company_guid,guid' }), `save ${type}`);
      }
      const maxAlter = rows.reduce((m, r) => Math.max(m, r.alter_id), last);
      if (maxAlter > last) await setState(sb, company.guid, `master:${type}`, maxAlter);
      run.details[type] = rows.length;
    }

    // 2. Vouchers. First load: month by month from the start of the books. Afterwards: only AlterID > last.
    const last = state['vouchers'] || 0;
    let maxAlter = last;
    let count = 0;
    if (last === 0) {
      const from = cfgCompany.booksFrom || company.books_from || '2020-04-01';
      for (const [s, e] of monthsBetween(from, today())) {
        const tree = await tally.exportCollection({ id: 'GSVouchers', type: 'Voucher', fetch: VOUCHER_FETCH, company: company.name, fromDate: s, toDate: e });
        const vouchers = voucherRows(tree, company.guid);
        count += await saveVouchers(sb, company.guid, vouchers);
        maxAlter = vouchers.reduce((m, v) => Math.max(m, v.alter_id), maxAlter);
        log('info', `first load ${company.name} ${s.slice(0, 7)}: ${vouchers.length} vouchers`);
      }
    } else {
      const tree = await tally.exportCollection({
        id: 'GSVouchers', type: 'Voucher', fetch: VOUCHER_FETCH, company: company.name,
        fromDate: cfgCompany.booksFrom || company.books_from || '2020-04-01', toDate: farFuture(),
        filter: `$AlterID > ${last}`
      });
      const vouchers = voucherRows(tree, company.guid);
      count += await saveVouchers(sb, company.guid, vouchers);
      maxAlter = vouchers.reduce((m, v) => Math.max(m, v.alter_id), maxAlter);
    }
    if (maxAlter > last) await setState(sb, company.guid, 'vouchers', maxAlter);
    run.details.vouchers = count;

    // 3. Close the loop on anything the app wrote into Tally.
    const confirmed = await must(sb.rpc('bridge_confirm_writebacks', { p_company_guid: company.guid }), 'confirm writebacks');
    run.details.confirmed = confirmed;
    run.status = 'ok';
  } catch (err) {
    run.status = 'error';
    run.error = String(err.message || err);
    throw err;
  } finally {
    run.finished_at = new Date().toISOString();
    await sb.from('bridge_sync_runs').insert(run);
  }
  return run;
}

// Vouchers deleted in Tally do not show up in an AlterID sync. Compare GUID lists month by month.
export async function detectDeletions(tally, sb, cfgCompany) {
  const company = await resolveCompany(tally, sb, cfgCompany);
  const from = cfgCompany.booksFrom || company.books_from || '2020-04-01';
  let marked = 0;
  const countsByMonth = {};
  for (const [s, e] of monthsBetween(from, today())) {
    const tree = await tally.exportCollection({ id: 'GSVoucherGuids', type: 'Voucher', fetch: ['GUID'], company: company.name, fromDate: s, toDate: e });
    const inTally = new Set(findAll(tree, 'VOUCHER').map((v) => text(v.GUID)).filter(Boolean));
    const mirror = await must(sb.from('tally_vouchers').select('guid').eq('company_guid', company.guid).eq('is_deleted', false).gte('date', s).lte('date', e), 'read mirror guids');
    const missing = mirror.map((r) => r.guid).filter((g) => !inTally.has(g));
    if (missing.length) {
      await must(sb.rpc('bridge_mark_deleted', { p_company_guid: company.guid, p_guids: missing }), 'mark deleted');
      marked += missing.length;
    }
    countsByMonth[s.slice(0, 7)] = { tally: inTally.size, app: mirror.length - missing.length };
  }
  await sb.from('bridge_reconciliations').insert({
    company_guid: company.guid, kind: 'voucher_counts',
    mismatches: Object.values(countsByMonth).filter((c) => c.tally !== c.app).length,
    details: { countsByMonth, markedDeleted: marked }
  });
  return { marked };
}
