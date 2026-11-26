import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeSite, tally } from './helpers.mjs';

const site = makeSite();

test('doctor reports a healthy simulated connection', async () => {
  const r = await tally(site, 'doctor', '--no-network');
  assert.equal(r.code, 0, r.err);
  assert.equal(r.data.healthy, true);
  assert.ok(r.data.checks.some((c) => c.check === 'Unicode' && c.status === 'pass'));
});

test('company list and info', async () => {
  const r = await tally(site, 'company', 'list');
  assert.equal(r.data[0].name, 'Sample Traders Pvt Ltd');
  const i = await tally(site, 'company', 'info');
  assert.equal(i.data.period.from, '2026-04-01');
});

test('masters: list under a group, get with suggestions, search', async () => {
  const l = await tally(site, 'ledger', 'list', '--under', 'Sundry Debtors');
  assert.equal(l.code, 0);
  assert.ok(l.data.length >= 6);
  assert.ok(l.data.every((x) => x.primaryGroup === 'Sundry Debtors'));
  const g = await tally(site, 'ledger', 'get', 'alpha hardware');
  assert.equal(g.code, 7);
  assert.deepEqual(g.error.details.suggestions.slice(0, 1), ['Alpha Hardware Stores']);
  const ok = await tally(site, 'ledger', 'get', 'ALPHA  hardware stores');
  assert.equal(ok.data.gstin, '27AAFCA1111A1ZN');
  const s = await tally(site, 'item', 'search', 'wire');
  assert.ok(s.data.length >= 2);
});

test('trial balance totals agree (ledgers plus opening stock)', async () => {
  const r = await tally(site, 'report', 'trial-balance', '--to', '2026-11-30', '--level', 'group');
  assert.equal(r.code, 0);
  assert.equal(r.data.totals.difference, 0);
  assert.equal(r.data.totals.periodDebit, r.data.totals.periodCredit);
});

test('balance sheet balances', async () => {
  const r = await tally(site, 'report', 'balance-sheet', '--as-of', '2026-11-30');
  assert.equal(r.code, 0);
  assert.ok(Math.abs(r.data.totals.difference) < 1, JSON.stringify(r.data.totals));
});

test('receivables: pending bills add up to debtor balances', async () => {
  const r = await tally(site, 'report', 'receivables', '--as-of', '2026-11-30');
  const ledgers = await tally(site, 'ledger', 'list', '--under', 'Sundry Debtors', '--as-of', '2026-11-30');
  const balances = Object.fromEntries(ledgers.data.map((l) => [l.name, l.closingBalance.side === 'Dr' ? l.closingBalance.amount : -l.closingBalance.amount]));
  for (const p of r.data.parties) assert.ok(Math.abs(p.total - balances[p.party]) < 0.01, `${p.party}: bills ${p.total} vs ledger ${balances[p.party]}`);
  const bucketSum = Object.values(r.data.totals.buckets).reduce((s, x) => s + x, 0);
  assert.ok(Math.abs(bucketSum - r.data.totals.total) < 0.01);
});

test('ledger statement running balance ends at the closing balance', async () => {
  const r = await tally(site, 'report', 'ledger', 'Alpha Hardware Stores', '--from', '2026-04-01', '--to', '2026-11-30');
  const ledger = await tally(site, 'ledger', 'get', 'Alpha Hardware Stores', '--as-of', '2026-11-30');
  assert.deepEqual(r.data.closing, ledger.data.closingBalance);
  assert.ok(r.data.lines.length > 3);
});

test('voucher list, get and find', async () => {
  const l = await tally(site, 'voucher', 'list', '--type', 'Sales', '--from', '2026-10-01', '--to', '2026-10-31');
  assert.ok(l.data.count > 0);
  assert.ok(l.data.vouchers.every((v) => v.baseType === 'Sales'));
  const v = l.data.vouchers[0];
  const g = await tally(site, 'voucher', 'get', '--master-id', String(v.masterId));
  assert.equal(g.data.total, v.total);
  assert.ok(g.data.items.length > 0);
  assert.ok(g.data.ledgers.find((x) => x.isParty).bills.length === 1);
  const f = await tally(site, 'voucher', 'find', '--date', v.date, '--amount', String(v.total));
  assert.ok(f.data.vouchers.some((x) => x.masterId === v.masterId));
});

test('registers, stock, godowns, orders, GST checks', async () => {
  const s = await tally(site, 'report', 'sales-register', '--from', '2026-04-01', '--to', '2026-11-30');
  for (const r of s.data.rows) assert.ok(Math.abs(r.taxable + r.cgst + r.sgst + r.igst + r.cess + r.roundOff - r.total) < 0.01);
  assert.ok((await tally(site, 'report', 'stock-summary')).data.rows.length > 0);
  const gd = await tally(site, 'report', 'godown-summary', '--godown', 'Pune Warehouse');
  assert.equal(gd.data.rows[0].qty, 20);
  const o = await tally(site, 'report', 'orders-pending');
  assert.equal(o.data.rows[0].pending, 50);
  const gst = await tally(site, 'gst', 'party-gstins');
  assert.equal(gst.data.withProblems, 0);
  const hsn = await tally(site, 'gst', 'hsn-summary', '--from', '2026-04-01', '--to', '2026-11-30');
  assert.ok(hsn.data.rows.length > 3);
});

test('escape hatches: collection query, native export, function, built-in report', async () => {
  const q = await tally(site, 'query', 'collection', 'Ledger', '--fields', 'Name,ClosingBalance:amount', '--child-of', 'Bank Accounts');
  assert.equal(q.data[0].Name, 'Bank of Example - Current A/c');
  const n = await tally(site, 'query', 'native', 'Voucher', '--from', '2026-04-02', '--to', '2026-04-02');
  assert.ok(n.data.length >= 1 && n.data[0].type === 'VOUCHER');
  const f = await tally(site, 'query', 'function', '$$SystemPeriodFrom');
  assert.equal(f.data.result, '1-Apr-2026');
  const tb = await tally(site, 'report', 'run', 'Trial Balance', '--to', '2026-11-30');
  assert.ok(JSON.stringify(tb.data).includes('DSPACCNAME'));
});

test('unknown parameters and commands are explained', async () => {
  const r = await tally(site, 'ledger', 'list', '--undr', 'x');
  assert.equal(r.code, 5);
  assert.match(r.error.hint, /under/);
  const u = await tally(site, 'ledgr', 'list');
  assert.equal(u.code, 2);
});

test('read-only mode by default refuses writes', async () => {
  const ro = makeSite({ writeMode: 'off' });
  const r = await tally(ro, 'post', 'contra', '--from', 'Cash', '--to', 'Bank of Example - Current A/c', '--amount', '10');
  assert.equal(r.code, 6);
  assert.equal(r.error.code, 'E_POLICY');
  const dry = await tally(ro, 'post', 'contra', '--from', 'Cash', '--to', 'Bank of Example - Current A/c', '--amount', '10', '--dry-run');
  assert.equal(dry.code, 0);
  assert.equal(dry.data.sent, false);
});
