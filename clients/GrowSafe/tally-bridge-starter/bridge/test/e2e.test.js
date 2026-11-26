// End to end, with no real Tally and no Supabase: tally-cli's Tally simulator on a local port, and the
// bridge migration on an in-memory Postgres. Runs the same code the Tally server runs.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { TallyCli } from '../src/tallycli.js';
import { syncCompany, detectDeletions } from '../src/reader.js';
import { writeCompany } from '../src/writer.js';
import { reconcileLedgers } from '../src/reconcile.js';
import { makeDb, PgStore, approve, statusOf } from '../testkit/pgstore.js';

const COMPANY = 'Sample Traders Pvt Ltd';
const VOUCHER_TYPES = ['Sales', 'Receipt', 'Payment', 'Credit Note', 'Debit Note'];
let sim, tmp, cli, db, store, cfg, company, guid;

const freePort = () => new Promise((res) => { const s = net.createServer(); s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => res(p)); }); });
const q = async (sql, params) => (await db.query(sql, params)).rows;

before(async () => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gsb-e2e-'));
  const port = await freePort();
  cli = new TallyCli({ configPath: path.join(tmp, 'tally.config.json') });
  sim = spawn(process.execPath, [cli.entry, 'simulate', '--port', String(port), '--state', path.join(tmp, 'books.json')], { stdio: 'ignore' });
  const url = `http://127.0.0.1:${port}`;
  for (let i = 0; ; i++) {
    try { await cli.run(null, ['company', 'list', '--url', url]); break; } catch (e) { if (i > 50) throw e; await new Promise((r) => setTimeout(r, 100)); }
  }
  // The bridge's profile: Optional vouchers only, ledgers allowed, GrowSafe's five voucher types, a key on every voucher.
  await cli.run(null, ['init', '--url', url, '--profile', 'gs', '--write-mode', 'optional', '--allow-master-writes', '--config-path', cli.configPath]);
  // The accountant (converts Optional vouchers in Tally) and an admin (deletes a voucher), to act out what people do in Tally.
  await cli.run(null, ['init', '--url', url, '--profile', 'accountant', '--write-mode', 'on', '--no-make-default', '--config-path', cli.configPath]);
  await cli.run(null, ['init', '--url', url, '--profile', 'admin', '--write-mode', 'on', '--allow-destructive', '--no-make-default', '--config-path', cli.configPath]);
  const tc = JSON.parse(fs.readFileSync(cli.configPath, 'utf8'));
  Object.assign(tc.profiles.gs, { allowedVoucherTypes: VOUCHER_TYPES, requireIdempotencyKey: true, maxAmount: 1000000 });
  tc.profiles.down = { ...tc.profiles.gs, url: `http://127.0.0.1:${await freePort()}` }; // nothing listens there
  fs.writeFileSync(cli.configPath, JSON.stringify(tc, null, 2));

  db = await makeDb();
  store = new PgStore(db);
  company = { name: COMPANY, profile: 'gs', isTestCompany: true, booksFrom: '2026-04-01' };
  cfg = { write: { enabled: true, allowLiveCompanies: false, masters: ['Ledger'], voucherTypes: VOUCHER_TYPES, maxPerRun: 20 } };
});

after(() => { sim?.kill(); if (tmp) fs.rmSync(tmp, { recursive: true, force: true }); });

test('first load: every master and voucher arrives, and balances match Tally', async () => {
  const run = await syncCompany(cli, store, company);
  assert.equal(run.status, 'ok');
  guid = run.company_guid;
  const tallyVouchers = await cli.exportRows('gs', 'vouchers', { from: '2026-04-01', to: '2027-03-31' });
  const tallyLedgers = await cli.exportRows('gs', 'ledgers', {});
  assert.equal(Number((await q('select count(*) n from tally_vouchers where company_guid = $1', [guid]))[0].n), tallyVouchers.length);
  assert.equal(Number((await q('select count(*) n from tally_ledgers'))[0].n), tallyLedgers.length);
  assert.ok(Number((await q('select count(*) n from tally_ledger_entries'))[0].n) > tallyVouchers.length);
  assert.ok(Number((await q('select count(*) n from tally_inventory_entries'))[0].n) > 0);
  assert.ok(Number((await q(`select count(*) n from tally_inventory_entries where godown is not null`))[0].n) > 0, 'godown from batch allocations');
  const rec = await reconcileLedgers(cli, store, company);
  assert.ok(rec.checked >= 20);
  assert.equal(rec.mismatches, 0, JSON.stringify(rec.top));
});

test('incremental: a second sync with no change reads no vouchers', async () => {
  const run = await syncCompany(cli, store, company);
  assert.equal(run.details.vouchers, 0);
  assert.equal(run.details.ledgers, 0);
});

test('payment reminders: unpaid bills per dealer, how late, the dealer mobile number and salesperson', async () => {
  const bills = await cli.exportRows('gs', 'receivables', { to: new Date().toISOString().slice(0, 10) });
  assert.equal(Number((await q(`select count(*) n from tally_outstanding where kind = 'receivable'`))[0].n), bills.length);
  const debtors = (await q(`select guid from tally_groups where name = 'Sundry Debtors'`))[0].guid;
  await q(`insert into app_salesperson_groups values ($1, $2, $3)`, ['00000000-0000-0000-0000-000000000001', guid, debtors]);
  const alpha = (await q(`select * from v_dealer_outstanding where dealer = 'Alpha Hardware Stores'`))[0];
  const expected = bills.filter((b) => b.party === 'Alpha Hardware Stores' && !b.isAdvance).reduce((t, b) => t + b.amount, 0);
  assert.equal(Number(alpha.outstanding), expected);
  assert.ok(Number(alpha.overdue) > 0 && alpha.max_overdue_days > 0);
  assert.ok(alpha.mobile, 'mobile number from the Tally ledger');
  assert.deepEqual(alpha.salespeople, ['00000000-0000-0000-0000-000000000001']);
});

const payloads = {
  ledger: { name: 'Sharma Agro Bhopal', group: 'Sundry Debtors', gstin: '23AAFCA1111A1ZV', gstRegistrationType: 'Regular', state: 'Madhya Pradesh', billWise: true, creditDays: 30 },
  Sales: { date: '2026-11-25', party: 'Alpha Hardware Stores', narration: 'App order', items: [{ item: 'LED Bulb 9W', qty: 10, rate: 95, ledger: 'Sales GST 12%' }], taxes: 'auto', roundOff: 'auto', bills: [{ type: 'new', ref: 'APP-0001' }] },
  Receipt: { date: '2026-11-25', party: 'Alpha Hardware Stores', entries: [{ ledger: 'Bank of Example - Current A/c', debit: 5000 }, { ledger: 'Alpha Hardware Stores', credit: 5000, bills: 'on-account' }] },
  Payment: { date: '2026-11-25', party: 'Prime Cables Ltd', entries: [{ ledger: 'Prime Cables Ltd', debit: 2500, bills: 'on-account' }, { ledger: 'Bank of Example - Current A/c', credit: 2500 }] },
  'Credit Note': { date: '2026-11-25', party: 'Alpha Hardware Stores', items: [{ item: 'LED Bulb 9W', qty: 2, rate: 95, ledger: 'Sales GST 12%' }], taxes: 'auto', bills: 'on-account' },
  'Debit Note': { date: '2026-11-25', party: 'Prime Cables Ltd', items: [{ item: 'Copper Wire 1.5 sqmm (90 m)', qty: 1, rate: 1180, ledger: 'Purchase GST 18%' }], taxes: 'auto', bills: 'on-account' },
};
const ids = {};

test('write-back: an approved ledger and all five voucher types go into Tally, vouchers as Optional', async () => {
  ids.ledger = await approve(db, guid, 'master', 'Ledger', payloads.ledger);
  for (const t of VOUCHER_TYPES) ids[t] = await approve(db, guid, 'voucher', t, payloads[t]);
  ids.badName = await approve(db, guid, 'voucher', 'Sales', { ...payloads.Sales, party: 'No Such Dealer', bills: [{ type: 'new', ref: 'APP-0002' }] });
  ids.draftOnly = (await q(`insert into bridge_writeback_queue(company_guid, kind, object_type, payload) values ($1, 'voucher', 'Sales', '{}'::jsonb) returning id`, [guid]))[0].id;

  const out = await writeCompany(cli, store, cfg, company);
  assert.equal(out.written, 7, 'the draft that nobody approved is never picked up');
  assert.equal((await statusOf(db, ids.ledger)).status, 'sent');
  for (const t of VOUCHER_TYPES) {
    const s = await statusOf(db, ids[t]);
    assert.equal(s.status, 'sent', `${t}: ${s.error}`);
    assert.equal(s.tally_response.optional, true, `${t} must be Optional`);
  }
  const bad = await statusOf(db, ids.badName);
  assert.equal(bad.status, 'failed');
  assert.match(bad.error, /No Such Dealer/);
  assert.equal((await statusOf(db, ids.draftOnly)).status, 'draft');
});

test('the next sync confirms them: ledger in Tally, vouchers in Tally as Optional', async () => {
  const run = await syncCompany(cli, store, company);
  assert.ok(run.details.vouchers >= 5);
  assert.equal((await statusOf(db, ids.ledger)).status, 'in_tally');
  for (const t of VOUCHER_TYPES) assert.equal((await statusOf(db, ids[t])).status, 'in_tally_optional', t);
  const v = await q('select is_optional, narration from tally_vouchers where app_tag = $1', [ids.Sales]);
  assert.equal(v.length, 1);
  assert.equal(v[0].is_optional, true);
  assert.match(v[0].narration, /\[GSOS:/);
  // Optional vouchers stay out of balances: still no mismatch.
  assert.equal((await reconcileLedgers(cli, store, company)).mismatches, 0);
});

test('the accountant converts one in Tally; the app shows it converted', async () => {
  const masterId = (await q('select master_id from tally_vouchers where app_tag = $1', [ids.Sales]))[0].master_id;
  await cli.run('accountant', ['voucher', 'regularise', '--master-id', String(masterId), '--yes']);
  await syncCompany(cli, store, company);
  assert.equal((await statusOf(db, ids.Sales)).status, 'converted');
  assert.equal((await reconcileLedgers(cli, store, company)).mismatches, 0);
});

test('never twice: a row sent again is recognised by its tag, and tally-cli refuses a repeated key', async () => {
  const before = (await cli.exportRows('gs', 'vouchers', { from: '2026-11-01', to: '2026-11-30' })).length;
  await q(`update bridge_writeback_queue set status = 'approved' where id = $1`, [ids.Receipt]); // as if a crash re-queued it
  await writeCompany(cli, store, cfg, company);
  assert.equal((await statusOf(db, ids.Receipt)).status, 'in_tally_optional');
  const again = await cli.createVoucher('gs', { kind: 'payment', ...payloads.Payment, narration: `[GSOS:${ids.Payment}]` }, `gsos:${ids.Payment}`);
  assert.equal(again.duplicate, true);
  assert.equal((await cli.exportRows('gs', 'vouchers', { from: '2026-11-01', to: '2026-11-30' })).length, before);
});

test('safety switches: writing off, live company, Tally unreachable', async () => {
  const id = await approve(db, guid, 'voucher', 'Receipt', { ...payloads.Receipt, entries: payloads.Receipt.entries.map((e) => ({ ...e, ...(e.debit ? { debit: 700 } : { credit: 700 }) })) });
  assert.deepEqual(await writeCompany(cli, store, { write: { ...cfg.write, enabled: false } }, company), { skipped: 'write is switched off in config.json' });
  assert.match((await writeCompany(cli, store, cfg, { ...company, isTestCompany: false })).skipped, /live company/);
  assert.equal((await statusOf(db, id)).status, 'approved');
  // Tally not reachable: nothing was sent, so the row goes back to the queue.
  await assert.rejects(writeCompany(cli, store, cfg, { ...company, profile: 'down' }));
  assert.equal((await statusOf(db, id)).status, 'approved');
});

test('a voucher deleted in Tally is marked deleted', async () => {
  const v = (await q(`select guid, master_id from tally_vouchers where voucher_type = 'Journal' and not is_optional and not is_deleted limit 1`))[0];
  await cli.run('admin', ['voucher', 'delete', '--master-id', String(v.master_id), '--yes']);
  const r = await detectDeletions(cli, store, company);
  assert.equal(r.marked, 1);
  assert.equal(r.mismatches, 0);
  assert.equal((await q('select is_deleted from tally_vouchers where guid = $1', [v.guid]))[0].is_deleted, true);
});
