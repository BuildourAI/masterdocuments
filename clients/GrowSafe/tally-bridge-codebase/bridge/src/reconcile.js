// Daily check: Tally's ledger closing balances against the balances computed from the copied vouchers.
// Differences are recorded and shown; nothing is ever corrected automatically.
import { findAll, text, toNumber } from './xml.js';
import { must } from './supabase.js';
import { resolveCompany } from './reader.js';

export async function reconcileLedgers(tally, sb, cfgCompany) {
  const company = await resolveCompany(tally, sb, cfgCompany);
  const tree = await tally.exportCollection({
    id: 'GSLedgerBalances', type: 'Ledger', fetch: ['GUID', 'NAME', 'CLOSINGBALANCE'], company: company.name,
    fromDate: cfgCompany.booksFrom || company.books_from || undefined, toDate: new Date().toISOString().slice(0, 10)
  });
  const tallyBal = new Map(findAll(tree, 'LEDGER').map((l) => [text(l.GUID), { name: (text(l.NAME) || l['@NAME'] || '').trim(), closing: toNumber(l.CLOSINGBALANCE) }]));
  const appRows = await must(sb.from('v_tally_ledger_balance').select('ledger_guid, name, computed_closing').eq('company_guid', company.guid), 'read computed balances');
  const diffs = [];
  for (const r of appRows) {
    const t = tallyBal.get(r.ledger_guid);
    if (!t) continue;
    const d = Math.round((Number(r.computed_closing) - t.closing) * 100) / 100;
    if (Math.abs(d) > 0.5) diffs.push({ ledger: r.name, tally: t.closing, app: Number(r.computed_closing), difference: d });
  }
  diffs.sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference));
  await must(sb.from('bridge_reconciliations').insert({
    company_guid: company.guid, kind: 'ledger_balances', mismatches: diffs.length,
    details: { checked: appRows.length, top: diffs.slice(0, 25) }
  }), 'save reconciliation');
  return { checked: appRows.length, mismatches: diffs.length };
}
