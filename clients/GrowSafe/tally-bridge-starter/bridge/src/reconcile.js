// Daily check: Tally's ledger closing balances against the balances computed from the copied vouchers.
// Differences are recorded and shown; nothing is ever corrected automatically.
import { signed } from './map.js';
import { resolveCompany } from './reader.js';

export async function reconcileLedgers(cli, store, c) {
  const company = await resolveCompany(cli, store, c);
  const tally = new Map((await cli.exportRows(c.profile, 'ledgers', {})).map((l) => [l.guid, { name: l.name, closing: signed(l.closingBalance) }]));
  const app = await store.rpc('bridge_ledger_balances', { p_company_guid: company.guid }) || [];
  const diffs = [];
  let checked = 0;
  for (const r of app) {
    const t = tally.get(r.ledger_guid);
    if (!t) continue;
    checked += 1;
    const d = Math.round((Number(r.computed_closing) - t.closing) * 100) / 100;
    if (Math.abs(d) > 0.5) diffs.push({ ledger: r.name, tally: t.closing, app: Number(r.computed_closing), difference: d });
  }
  diffs.sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference));
  await store.rpc('bridge_log', { p_table: 'bridge_reconciliations', p_row: { company_guid: company.guid, kind: 'ledger_balances', mismatches: diffs.length, details: { checked, top: diffs.slice(0, 25) } } });
  return { checked, mismatches: diffs.length, top: diffs.slice(0, 5) };
}
