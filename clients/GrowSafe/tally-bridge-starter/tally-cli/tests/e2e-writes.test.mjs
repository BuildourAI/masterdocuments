import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeSite, tally, writeJson } from './helpers.mjs';

test('receipt with bill settlement, duplicate protection by idempotency key', async () => {
  const site = makeSite();
  const before = await tally(site, 'party', 'bills', 'Alpha Hardware Stores');
  const oldest = before.data.bills.find((b) => b.ref === 'OB/25-26/118');
  const r = await tally(site, 'post', 'receipt', '--party', 'Alpha Hardware Stores', '--amount', '50000', '--against', 'OB/25-26/118', '--mode', 'neft', '--instrument-number', 'UTR1', '--date', '2026-11-24', '--idempotency-key', 'bank-1');
  assert.equal(r.code, 0, r.out + r.err);
  assert.equal(r.data.verified, true);
  const again = await tally(site, 'post', 'receipt', '--party', 'Alpha Hardware Stores', '--amount', '50000', '--against', 'OB/25-26/118', '--mode', 'neft', '--instrument-number', 'UTR1', '--date', '2026-11-24', '--idempotency-key', 'bank-1');
  assert.equal(again.data.duplicate, true);
  const after = await tally(site, 'party', 'bills', 'Alpha Hardware Stores');
  assert.equal(after.data.bills.find((b) => b.ref === 'OB/25-26/118').amount, oldest.amount - 50000);
  const other = await tally(site, 'post', 'receipt', '--party', 'Alpha Hardware Stores', '--amount', '1', '--on-account', '--date', '2026-11-24', '--idempotency-key', 'bank-1');
  assert.equal(other.error.code, 'E_CONFLICT');
});

test('bill-wise party without bills is refused with a clear hint', async () => {
  const site = makeSite();
  const r = await tally(site, 'post', 'receipt', '--party', 'Alpha Hardware Stores', '--amount', '100', '--date', '2026-11-24');
  assert.equal(r.code, 5);
  assert.match(r.error.hint, /--against|--auto-allocate/);
});

test('GST sales invoice: validation, automatic IGST, round off, read back', async () => {
  const site = makeSite();
  const inv = { kind: 'sales', date: '2026-11-24', number: 'SI/26-27/0101', party: 'City Lights Traders', items: [{ item: 'MCB 32A Double Pole', qty: 20, rate: 520, ledger: 'Sales GST 18%' }, { item: 'LED Bulb 9W', qty: 33, rate: 95.5, ledger: 'Sales GST 12%' }], taxes: 'auto', roundOff: 'auto' };
  const v = await tally(site, 'voucher', 'validate', '--input', writeJson(site, 'inv.json', inv));
  assert.equal(v.code, 0, v.out);
  assert.equal(v.data.summary.gst.interState, true);
  const total = v.data.summary.total;
  assert.equal(total, Math.round(total));
  const p = await tally(site, 'voucher', 'create', '--input', writeJson(site, 'inv.json', { ...inv, expectedTotal: total }));
  assert.equal(p.code, 0, p.out);
  const g = await tally(site, 'voucher', 'get', '--master-id', String(p.data.masterId));
  assert.equal(g.data.total, total);
  assert.ok(g.data.ledgers.some((l) => l.ledger === 'Output IGST'));
  const bills = await tally(site, 'party', 'bills', 'City Lights Traders');
  assert.ok(bills.data.bills.some((b) => b.ref === 'SI/26-27/0101' && b.amount === total));
});

test('validation reports every problem at once with suggestions', async () => {
  const site = makeSite();
  const bad = { kind: 'sales', date: '2026-11-31', party: 'City Lights', items: [{ item: 'MCB 32A', qty: -1, rate: 0, ledger: 'Sales 18' }], expectedTotal: 5 };
  const r = await tally(site, 'voucher', 'validate', '--input', writeJson(site, 'bad.json', bad));
  assert.equal(r.code, 5);
  const paths = r.error.details.problems.map((p) => p.path);
  for (const want of ['date', 'party', 'items[0].item', 'items[0].qty', 'items[0].rate', 'items[0].ledger']) assert.ok(paths.includes(want), `missing ${want} in ${paths}`);
  assert.ok(r.error.details.problems.find((p) => p.path === 'party').suggestions.includes('City Lights Traders'));
});

test('signed amounts are rejected; debits must equal credits', async () => {
  const site = makeSite();
  const neg = await tally(site, 'voucher', 'validate', '--input', writeJson(site, 'j.json', { kind: 'journal', date: '2026-11-24', entries: [{ ledger: 'Salaries', debit: -5 }, { ledger: 'Cash', credit: 5 }] }));
  assert.equal(neg.code, 5);
  const unbalanced = await tally(site, 'voucher', 'validate', '--input', writeJson(site, 'j.json', { kind: 'journal', date: '2026-11-24', entries: [{ ledger: 'Salaries', debit: 5 }, { ledger: 'Cash', credit: 4 }] }));
  assert.match(unbalanced.error.message, /do not match/);
});

test('optional write mode creates optional vouchers that stay out of balances', async () => {
  const site = makeSite({ writeMode: 'optional', allowDestructive: false });
  const cash = async () => (await tally(site, 'ledger', 'get', 'Cash', '--as-of', '2026-11-30')).data.closingBalance.amount;
  const before = await cash();
  const r = await tally(site, 'post', 'contra', '--from', 'Bank of Example - Current A/c', '--to', 'Cash', '--amount', '1000', '--date', '2026-11-24');
  assert.equal(r.code, 0, r.out);
  assert.equal(r.data.optional, true);
  assert.equal(await cash(), before);
  const reg = await tally(site, 'voucher', 'regularise', '--master-id', String(r.data.masterId), '--yes');
  assert.equal(reg.error.code, 'E_POLICY');
});

test('update, cancel, delete and undo with guards', async () => {
  const site = makeSite();
  const r = await tally(site, 'post', 'journal', '--debit', 'Salaries', '--credit', 'Second Bank - OD A/c', '--amount', '1234', '--date', '2026-11-24', '--narration', 'first');
  const id = String(r.data.masterId);
  const noYes = await tally(site, 'voucher', 'update', '--master-id', id, '--narration', 'second');
  assert.equal(noYes.error.code, 'E_POLICY');
  const stale = await tally(site, 'voucher', 'update', '--master-id', id, '--narration', 'second', '--yes', '--if-alter-id', '1');
  assert.equal(stale.error.code, 'E_CONFLICT');
  const up = await tally(site, 'voucher', 'update', '--master-id', id, '--narration', 'second', '--yes');
  assert.equal(up.data.after.narration, 'second');
  assert.equal(up.data.after.total, 1234);
  const undo = await tally(site, 'voucher', 'undo', '--audit-seq', String(up.data.auditSeq), '--yes');
  assert.equal(undo.code, 0, undo.out);
  assert.equal((await tally(site, 'voucher', 'get', '--master-id', id)).data.narration, 'first');
  const c = await tally(site, 'voucher', 'cancel', '--master-id', id, '--reason', 'test', '--yes');
  assert.equal(c.data.cancelled, true);
  assert.equal((await tally(site, 'voucher', 'get', '--master-id', id)).data.status, 'cancelled');
  const d = await tally(site, 'voucher', 'delete', '--master-id', id, '--yes');
  assert.equal(d.data.deleted, true);
  const back = await tally(site, 'voucher', 'undo', '--audit-seq', String(d.data.auditSeq), '--yes');
  assert.equal(back.data.created, true);
  const audit = await tally(site, 'audit', 'verify');
  assert.equal(audit.data.ok, true);
});

test('destructive actions need allowDestructive', async () => {
  const site = makeSite({ allowDestructive: false });
  const r = await tally(site, 'post', 'journal', '--debit', 'Salaries', '--credit', 'Cash', '--amount', '10', '--date', '2026-11-24');
  const d = await tally(site, 'voucher', 'delete', '--master-id', String(r.data.masterId), '--yes');
  assert.equal(d.error.code, 'E_POLICY');
});

test('limits: lock date, amount cap, allowed voucher types', async () => {
  const site = makeSite({ lockBefore: '2026-10-01', maxAmount: 5000, allowedVoucherTypes: ['Journal', 'Receipt'] });
  const locked = await tally(site, 'post', 'journal', '--debit', 'Salaries', '--credit', 'Cash', '--amount', '10', '--date', '2026-09-30');
  assert.match(locked.error.message, /lock date/);
  const big = await tally(site, 'post', 'journal', '--debit', 'Salaries', '--credit', 'Cash', '--amount', '6000', '--date', '2026-11-24');
  assert.match(big.error.message, /exceeds/);
  const type = await tally(site, 'post', 'contra', '--from', 'Cash', '--to', 'Bank of Example - Current A/c', '--amount', '10', '--date', '2026-11-24');
  assert.match(type.error.message, /allowedVoucherTypes/);
});

test('masters: create, conflict, ensure, update, rename, delete', async () => {
  const site = makeSite();
  const c = await tally(site, 'ledger', 'create', 'New Customer Pvt Ltd', '--group', 'sundry debtors', '--gstin', '27AAPFU0939F1ZV', '--state', 'Maharashtra', '--bill-wise', '--credit-days', '30', '--email', 'a@b.example');
  assert.equal(c.code, 0, c.out);
  assert.equal(c.data.record.group, 'Sundry Debtors');
  assert.equal(c.data.record.gstin, '27AAPFU0939F1ZV');
  const dup = await tally(site, 'ledger', 'create', 'new customer pvt ltd', '--group', 'Sundry Debtors');
  assert.equal(dup.error.code, 'E_CONFLICT');
  const e = await tally(site, 'ledger', 'ensure', 'New Customer Pvt Ltd', '--group', 'Sundry Creditors');
  assert.equal(e.data.existed, true);
  assert.equal(e.data.differences[0].field, 'group');
  const u = await tally(site, 'ledger', 'update', 'New Customer Pvt Ltd', '--credit-days', '45', '--new-name', 'Renamed Customer');
  assert.equal(u.data.record.creditDays, 45);
  assert.equal(u.data.name, 'Renamed Customer');
  const d = await tally(site, 'ledger', 'delete', 'Renamed Customer', '--yes');
  assert.equal(d.data.action, 'delete');
  const inUse = await tally(site, 'ledger', 'delete', 'Cash', '--yes');
  assert.equal(inUse.error.code, 'E_TALLY');
  const unit = await tally(site, 'unit', 'create', 'Pcs', '--formal-name', 'Pieces', '--decimals', '0');
  assert.equal(unit.code, 0, unit.out);
  const item = await tally(site, 'item', 'create', 'Widget A', '--unit', 'pcs', '--group', 'Switchgear', '--hsn', '84719000', '--gst-rate', '18');
  assert.equal(item.data.record.unit, 'Pcs');
  assert.equal(item.data.record.hsn, '84719000');
  assert.equal(item.data.record.gstRate, 18);
});

test('prepare and commit: exactly the approved plan, once', async () => {
  const site = makeSite();
  const p = await tally(site, 'voucher', 'prepare', '--input', writeJson(site, 'j.json', { kind: 'journal', date: '2026-11-24', narration: 'approved', entries: [{ ledger: 'Salaries', debit: 99 }, { ledger: 'Cash', credit: 99 }] }));
  assert.ok(p.data.planId);
  const c1 = await tally(site, 'voucher', 'commit', '--plan-id', p.data.planId);
  assert.equal(c1.data.created, true);
  const c2 = await tally(site, 'voucher', 'commit', '--plan-id', p.data.planId);
  assert.equal(c2.data.duplicate, true);
});

test('stock journal transfer moves stock between godowns', async () => {
  const site = makeSite();
  const r = await tally(site, 'post', 'stock-journal', '--item', 'LED Bulb 9W', '--qty', '10', '--rate', '62', '--from-godown', 'Main Location', '--to-godown', 'Pune Warehouse', '--date', '2026-11-24');
  assert.equal(r.code, 0, r.out);
  const g = await tally(site, 'report', 'godown-summary', '--godown', 'Pune Warehouse', '--item', 'LED Bulb 9W');
  assert.equal(g.data.rows[0].qty, 10);
});

test('bulk import from CSV with a mapping: validate, commit, resume', async () => {
  const site = makeSite();
  const fs = await import('node:fs');
  const path = await import('node:path');
  fs.writeFileSync(path.join(site, 'r.csv'), 'Date,Customer,Amount,UTR\n24-11-2026,Deccan Builders,1000,U1\n24-11-2026,No Such Party,5,U2\n');
  writeJson(site, 'map.json', { op: 'post.receipt', columns: { date: 'Date', party: 'Customer', amount: 'Amount', instrumentNumber: 'UTR' }, defaults: { autoAllocate: true, mode: 'neft' } });
  const v = await tally(site, 'import', 'vouchers', path.join(site, 'r.csv'), '--map', path.join(site, 'map.json'));
  assert.equal(v.data.ok, 1);
  assert.equal(v.data.failed, 1);
  const c = await tally(site, 'import', 'vouchers', path.join(site, 'r.csv'), '--map', path.join(site, 'map.json'), '--commit');
  assert.equal(c.data.ok, 1);
  const again = await tally(site, 'import', 'vouchers', path.join(site, 'r.csv'), '--map', path.join(site, 'map.json'), '--commit');
  assert.equal(again.data.results[0].skipped, 'already posted');
});

test('sync: full then incremental, and the change feed', async () => {
  const site = makeSite();
  const path = await import('node:path');
  const out = path.join(site, 'out') + path.sep;
  const s1 = await tally(site, 'sync', 'run', '--sink', out);
  assert.equal(s1.data.first, true);
  const s2 = await tally(site, 'sync', 'run', '--sink', out);
  assert.equal(s2.data.unchanged, true);
  await tally(site, 'post', 'journal', '--debit', 'Salaries', '--credit', 'Cash', '--amount', '10', '--date', '2026-11-24');
  const ch = await tally(site, 'changes', 'list');
  assert.equal(ch.data.vouchers.length, 1);
  const s3 = await tally(site, 'sync', 'run', '--sink', out);
  assert.deepEqual(s3.data.batches.map((b) => [b.dataset, b.rows]).filter(([d]) => d === 'vouchers'), [['vouchers', 1]]);
});

test('bank: unreconciled lines, statement match, set bank date', async () => {
  const site = makeSite();
  const u = await tally(site, 'bank', 'unreconciled', 'Bank of Example - Current A/c');
  assert.ok(u.data.count > 0);
  const line = u.data.rows[0];
  const fs = await import('node:fs');
  const path = await import('node:path');
  fs.writeFileSync(path.join(site, 'st.csv'), `Date,Narration,Chq/Ref No,Withdrawal Amt,Deposit Amt\n${line.date},NEFT ${line.instrument || ''},${line.instrument || ''},${line.withdrawal || ''},${line.deposit || ''}\n05-11-2026,NEFT FROM DECCAN BUILDERS,X9,,777\n`);
  const m = await tally(site, 'bank', 'match', 'Bank of Example - Current A/c', path.join(site, 'st.csv'));
  assert.equal(m.data.matched.length, 1);
  assert.equal(m.data.unmatchedStatement[0].suggestedParty, 'Deccan Builders');
  const s = await tally(site, 'bank', 'set-date', '--master-id', String(line.masterId), '--bank-date', m.data.matched[0].bankDate, '--yes');
  assert.equal(s.code, 0, s.out);
  const u2 = await tally(site, 'bank', 'unreconciled', 'Bank of Example - Current A/c');
  assert.equal(u2.data.count, u.data.count - 1);
});

test('selftest records capabilities', async () => {
  const site = makeSite();
  const r = await tally(site, 'selftest', '--write', '--confirm-company', 'Sample Traders Pvt Ltd');
  assert.equal(r.data.ok, true, JSON.stringify(r.data.checks.filter((c) => c.status === 'fail')));
  const caps = await tally(site, 'capabilities');
  assert.ok(caps.data.testedAt);
});
