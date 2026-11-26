import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { makeSite, tally, writeJson } from './helpers.mjs';
import '../src/ops/index.mjs';
import { invoke } from '../src/ops/invoke.mjs';
import { createContext } from '../src/ops/context.mjs';
import { lineAmountPaise } from '../src/domain/vouchers/model.mjs';

const httpCtx = (site) => createContext({ frontend: 'http', configPath: path.join(site, 'tally.config.json'), env: {} });

test('undo cannot be repeated and is tied to its company', async () => {
  const site = makeSite();
  const r = await tally(site, 'post', 'journal', '--debit', 'Salaries', '--credit', 'Cash', '--amount', '10', '--date', '2026-11-24');
  const d = await tally(site, 'voucher', 'delete', '--master-id', String(r.data.masterId), '--yes');
  const other = await tally(site, 'voucher', 'undo', '--audit-seq', String(d.data.auditSeq), '--yes', '--company', 'Other Co');
  assert.equal(other.error.code, 'E_POLICY');
  const u1 = await tally(site, 'voucher', 'undo', '--audit-seq', String(d.data.auditSeq), '--yes');
  assert.equal(u1.data.created, true);
  const u2 = await tally(site, 'voucher', 'undo', '--audit-seq', String(d.data.auditSeq), '--yes');
  assert.equal(u2.error.code, 'E_CONFLICT');
});

test('concurrent posts with the same idempotency key create one voucher', async () => {
  const site = makeSite();
  const args = ['post', 'journal', '--debit', 'Salaries', '--credit', 'Cash', '--amount', '77', '--date', '2026-11-24', '--idempotency-key', 'same-key'];
  const res = await Promise.all([tally(site, ...args), tally(site, ...args), tally(site, ...args)]);
  assert.equal(res.filter((r) => r.data?.created === true).length, 1, JSON.stringify(res.map((r) => r.data || r.error)));
  const found = await tally(site, 'voucher', 'find', '--date', '2026-11-24', '--amount', '77');
  assert.equal(found.data.count, 1);
});

test('credit and debit notes reverse output and input GST respectively', async () => {
  const site = makeSite();
  const cn = await tally(site, 'voucher', 'validate', '--input', path.join(process.cwd(), 'templates/vouchers/credit-note.json'));
  const ledgers = cn.data.summary.lines.map((l) => l.ledger).filter(Boolean);
  assert.ok(ledgers.includes('Output CGST') && !ledgers.some((l) => /^Input/.test(l)), ledgers.join(','));
  assert.ok(cn.data.summary.lines.find((l) => l.ledger === 'Output CGST').debit > 0);
  const dn = await tally(site, 'voucher', 'validate', '--input', path.join(process.cwd(), 'templates/vouchers/debit-note.json'));
  assert.ok(dn.data.summary.lines.find((l) => l.ledger === 'Input CGST').credit > 0);
});

test('remote front-ends cannot write files or run write self-tests', async () => {
  const site = makeSite();
  const e = await invoke('export', { dataset: 'ledgers', file: path.join(site, 'tally.config.json') }, httpCtx(site));
  assert.equal(e.error.code, 'E_POLICY');
  const s = await invoke('selftest', { write: true, confirmCompany: 'Sample Traders Pvt Ltd' }, httpCtx(site));
  assert.equal(s.error.code, 'E_POLICY');
});

test('alter, cancel and delete respect lock date, amount cap and allowed types', async () => {
  const site = makeSite({ lockBefore: '2026-06-01', maxAmount: 1000, allowedVoucherTypes: ['Journal'] });
  const sales = await tally(site, 'voucher', 'list', '--type', 'Sales', '--from', '2026-04-01', '--to', '2026-04-30');
  const id = String(sales.data.vouchers[0].masterId);
  for (const args of [['update', '--narration', 'x'], ['cancel'], ['delete']]) {
    const r = await tally(site, 'voucher', args[0], '--master-id', id, ...args.slice(1), '--yes');
    assert.equal(r.error?.code, 'E_POLICY', `${args[0]}: ${JSON.stringify(r.data || r.error)}`);
  }
});

test('changing an opening balance needs allowDestructive and --yes', async () => {
  const site = makeSite({ allowDestructive: false });
  const r = await tally(site, 'ledger', 'update', 'Cash', '--input', writeJson(site, 'ob.json', { openingBalance: { amount: 1, side: 'Dr' } }));
  assert.equal(r.error.code, 'E_POLICY');
});

test('updating invoice items recomputes GST', async () => {
  const site = makeSite();
  const s = await tally(site, 'voucher', 'list', '--type', 'Sales', '--from', '2026-04-01', '--to', '2026-04-30');
  const v = (await tally(site, 'voucher', 'get', '--master-id', String(s.data.vouchers[0].masterId))).data;
  const item = { ...v.items[0], qty: 1 };
  delete item.amount;
  const r = await tally(site, 'voucher', 'update', '--master-id', String(v.masterId), '--input', writeJson(site, 'ch.json', { items: [item] }), '--yes');
  assert.equal(r.code, 0, JSON.stringify(r.error));
  const taxed = r.data.after.ledgers.filter((l) => /GST/.test(l.ledger)).reduce((t, l) => t + (l.credit || 0), 0);
  const rate = item.ledger.includes('12') ? 0.12 : 0.18;
  assert.ok(Math.abs(taxed - item.rate * rate) < 0.02, `tax ${taxed} for taxable ${item.rate}`);
});

test('party statements exclude orders and other non-accounting vouchers', async () => {
  const site = makeSite();
  const st = await tally(site, 'party', 'statement', 'Deccan Builders', '--from', '2026-04-01', '--to', '2026-11-30');
  const l = await tally(site, 'ledger', 'get', 'Deccan Builders', '--as-of', '2026-11-30');
  assert.deepEqual(st.data.closing, l.data.closingBalance);
});

test('stock journals are verified on read-back; line amounts round exactly', async () => {
  const site = makeSite();
  const r = await tally(site, 'post', 'stock-journal', '--item', 'LED Bulb 9W', '--qty', '10', '--rate', '62', '--from-godown', 'Main Location', '--to-godown', 'Pune Warehouse', '--date', '2026-11-24');
  assert.equal(r.data.verified, true);
  assert.equal(lineAmountPaise(1, 1.005), 101);
  assert.equal(lineAmountPaise(3, 33.3333), 10000);
  assert.equal(lineAmountPaise(100, 95, 5), 902500);
});
