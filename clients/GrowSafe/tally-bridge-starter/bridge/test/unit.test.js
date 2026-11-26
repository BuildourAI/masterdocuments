// Offline tests: no Tally, no database.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { signed, masterRow, assembleVouchers, extractWriteTag, financialYears, monthsBetween } from '../src/map.js';
import { voucherForTally, outcomeFromError } from '../src/writer.js';
import { TallyCliError, EXIT } from '../src/tallycli.js';

test('balances: debit negative, credit positive', () => {
  assert.equal(signed({ amount: 100, side: 'Dr' }), -100);
  assert.equal(signed({ amount: 100, side: 'Cr' }), 100);
  assert.equal(signed({ amount: 0, side: null }), 0);
  assert.equal(signed(null), 0);
});

test('ledger row keeps GST and contact details', () => {
  const r = masterRow('ledgers', { name: 'Sharma Agro', group: 'MP Dealers', primaryGroup: 'Sundry Debtors', openingBalance: { amount: 500, side: 'Dr' }, closingBalance: { amount: 900, side: 'Dr' }, gstin: '23AAFCA1111A1ZV', contact: { phone: '98', email: 'a@b' }, billWise: true, creditDays: 30, guid: 'g', masterId: 1, alterId: 2 });
  assert.equal(r.parent, 'MP Dealers');
  assert.equal(r.opening_balance, -500);
  assert.equal(r.mobile, '98');
  assert.equal(r.credit_days, 30);
});

test('vouchers are joined with their lines, bills, cost centres and batches', () => {
  const [v] = assembleVouchers({
    vouchers: [{ guid: 'v1', masterId: 1, alterId: 5, date: '2026-11-25', voucherType: 'Sales', baseType: 'Sales', number: 'S1', party: 'A', narration: 'x [GSOS:abc-123]', isOptional: true }],
    entries: [{ guid: 'v1', ledger: 'A', amount: -1120, isParty: true }, { guid: 'v1', ledger: 'Output IGST', amount: 120 }],
    bills: [{ guid: 'v1', ledger: 'A', bill: 'APP-1', billType: 'New Ref', amount: -1120, creditDays: 30 }],
    costs: [],
    inventory: [{ guid: 'v1', item: 'Bio Gold 1L', qty: 10, qtyUnit: 'Ltr', rate: 100, amount: 1000, inward: false }],
    batches: [{ Guid: 'v1', StockItemName: 'Bio Gold 1L', GodownName: 'Main', BatchName: 'B1', ActualQty: { qty: 10, unit: 'Ltr' }, Amount: 1000 }],
  });
  assert.equal(v.app_tag, 'abc-123');
  assert.equal(v.base_type, 'Sales');
  assert.equal(v.ledger_entries[0].bill_refs[0].name, 'APP-1');
  assert.equal(v.inventory_entries[0].godown, 'Main');
  assert.equal(v.inventory_entries[0].batches[0].batch, 'B1');
  assert.equal(extractWriteTag('no tag'), null);
});

test('first load goes one financial year at a time', () => {
  assert.deepEqual(financialYears('2021-04-01', '2023-06-30'), [['2021-04-01', '2022-03-31'], ['2022-04-01', '2023-03-31'], ['2023-04-01', '2023-06-30']]);
  assert.deepEqual(financialYears('2022-01-15', '2022-05-01'), [['2022-01-15', '2022-03-31'], ['2022-04-01', '2022-05-01']]);
  assert.equal(monthsBetween('2026-04-01', '2026-06-15').length, 3);
});

test('voucher sent to tally-cli: kind from the voucher type, tag in the narration', () => {
  const v = voucherForTally({ id: 'q1', object_type: 'Credit Note', payload: { party: 'A', narration: 'Return', idempotencyKey: 'x' } });
  assert.equal(v.kind, 'credit-note');
  assert.equal(v.narration, 'Return [GSOS:q1]');
  assert.equal(v.idempotencyKey, undefined);
  assert.throws(() => voucherForTally({ id: 'q2', object_type: 'Journal', payload: {} }), /not one the bridge writes/);
  assert.throws(() => voucherForTally({ id: 'q3', object_type: 'Sales', payload: { kind: 'receipt' } }), /does not match/);
});

test('what happens after an error: retry, check by a person, or failed with the reason', () => {
  assert.equal(outcomeFromError(new TallyCliError('down', { exitCode: EXIT.unreachable })).status, 'approved');
  assert.equal(outcomeFromError(new TallyCliError('lost', { exitCode: EXIT.unknownOutcome })).status, 'check_in_tally');
  const f = outcomeFromError(new TallyCliError('bad', { exitCode: EXIT.invalid, details: { problems: [{ path: 'party', message: 'no such ledger' }] } }));
  assert.equal(f.status, 'failed');
  assert.equal(f.error, 'party: no such ledger');
});
