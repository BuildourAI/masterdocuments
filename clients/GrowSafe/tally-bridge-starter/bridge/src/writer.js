// Supabase -> Tally, through tally-cli. Only rows a person APPROVED in the app.
// Ledgers are created; vouchers go in as OPTIONAL (tally-cli's profile is in "optional" write mode).
// Every row: claimed first (never sent twice by the bridge), skipped if Tally already has it, sent with an
// idempotency key (never posted twice by tally-cli), and Tally's answer recorded. Nothing is retried blindly.
import { EXIT } from './tallycli.js';
import { writeTag } from './map.js';
import { resolveCompany } from './reader.js';
import { log } from './config.js';

// Queue object_type (the Tally voucher type) -> tally-cli voucher kind.
export const KINDS = { Sales: 'sales', Receipt: 'receipt', Payment: 'payment', 'Credit Note': 'credit-note', 'Debit Note': 'debit-note' };

/** The voucher JSON tally-cli receives: the approved payload, plus our tag in the narration. */
export function voucherForTally(row) {
  const kind = KINDS[row.object_type];
  if (!kind) throw Object.assign(new Error(`voucher type "${row.object_type}" is not one the bridge writes`), { permanent: true });
  const p = { ...row.payload };
  if (p.kind && p.kind !== kind) throw Object.assign(new Error(`payload kind "${p.kind}" does not match "${row.object_type}"`), { permanent: true });
  p.kind = kind;
  delete p.idempotencyKey;
  const tag = writeTag(row.id);
  p.narration = p.narration ? `${p.narration} ${tag}` : tag;
  return p;
}

export function outcomeFromError(err) {
  // 3: Tally could not be reached, so nothing was sent: put it back in the queue for the next round.
  if (err.exitCode === EXIT.unreachable) return { status: 'approved', error: `Tally not reachable, will retry: ${err.message}` };
  // 8: sent, but the result is unknown and tally-cli could not find it in Tally: a person checks first.
  if (err.exitCode === EXIT.unknownOutcome || err.code === 'E_NO_REPLY' || err.exitCode === null) {
    return { status: 'check_in_tally', error: `${err.message}${err.hint ? ` (${err.hint})` : ''}` };
  }
  // Everything else (invalid, refused by Tally, not allowed, conflict): Tally's or tally-cli's exact reason.
  const problems = err.details?.problems?.map((p) => `${p.path}: ${p.message}`).join('; ');
  return { status: 'failed', error: problems || err.message, response: { code: err.code, hint: err.hint || null } };
}

export async function writeCompany(cli, store, cfg, c) {
  const w = cfg.write || {};
  if (!w.enabled) return { skipped: 'write is switched off in config.json' };
  if (!c.isTestCompany && !w.allowLiveCompanies) return { skipped: `live company "${c.name}": write-back not yet allowed (write.allowLiveCompanies is false)` };
  const company = await resolveCompany(cli, store, c);

  const rows = await store.rpc('bridge_claim_writebacks', {
    p_company_guid: company.guid,
    p_master_types: w.masters || [],
    p_voucher_types: w.voucherTypes || [],
    p_limit: w.maxPerRun || 20,
  }) || [];

  const results = [];
  for (const row of rows) {
    let outcome;
    try {
      if (row.kind === 'voucher') {
        const already = await store.rpc('bridge_voucher_by_tag', { p_company_guid: company.guid, p_tag: row.id });
        if (already) {
          outcome = { status: already.is_optional ? 'in_tally_optional' : 'converted', response: { note: 'already in Tally; not sent again', guid: already.guid } };
        } else {
          const r = await cli.createVoucher(c.profile, voucherForTally(row), `gsos:${row.id}`);
          outcome = { status: 'sent', response: { masterId: r.masterId ?? null, guid: r.guid ?? null, number: r.number ?? null, optional: r.optional ?? null, duplicate: !!r.duplicate } };
        }
      } else if (row.kind === 'master' && row.object_type === 'Ledger') {
        const r = await cli.createLedger(c.profile, row.payload);
        outcome = { status: 'sent', response: { guid: r.record?.guid ?? null, tally: r.tally ?? null } };
      } else {
        outcome = { status: 'failed', error: `not supported yet: ${row.kind} ${row.object_type}` };
      }
    } catch (err) {
      outcome = err.permanent ? { status: 'failed', error: err.message } : outcomeFromError(err);
    }
    await store.rpc('bridge_writeback_result', { p_id: row.id, p_status: outcome.status, p_error: outcome.error || null, p_response: outcome.response || null });
    log(outcome.status === 'failed' || outcome.status === 'check_in_tally' ? 'warn' : 'info', `writeback ${row.id} ${row.kind}/${row.object_type}: ${outcome.status}`, outcome.error ? { error: outcome.error } : undefined);
    results.push({ id: row.id, ...outcome });
  }
  return { company: company.name, written: results.length, results };
}
