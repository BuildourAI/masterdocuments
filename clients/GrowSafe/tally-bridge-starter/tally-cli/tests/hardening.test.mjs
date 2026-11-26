import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import { makeSite, tally } from './helpers.mjs';
import '../src/ops/index.mjs';
import { invoke } from '../src/ops/invoke.mjs';
import { createContext } from '../src/ops/context.mjs';
import { createSimTransport } from '../src/core/transport.mjs';
import { TallyCliError } from '../src/core/errors.mjs';

test('writes refuse a company whose pinned id differs, and profiles without a company', async () => {
  const wrong = makeSite({ companyGuid: 'not-the-real-id' });
  const r = await tally(wrong, 'post', 'journal', '--debit', 'Salaries', '--credit', 'Cash', '--amount', '5', '--date', '2026-11-24');
  assert.equal(r.error.code, 'E_CONFLICT', JSON.stringify(r.error));
  const none = makeSite({ company: null });
  const n = await tally(none, 'post', 'journal', '--debit', 'Salaries', '--credit', 'Cash', '--amount', '5', '--date', '2026-11-24');
  assert.equal(n.error.code, 'E_CONFIG');
  const ok = makeSite({ companyGuid: 'a1b2c3d4-0000-4000-8000-00000000c0de' });
  assert.equal((await tally(ok, 'post', 'journal', '--debit', 'Salaries', '--credit', 'Cash', '--amount', '5', '--date', '2026-11-24')).code, 0);
});

/** A simulator transport whose replies to imports are lost: "apply" decides whether Tally received it first. */
function lossyContext(site, { apply }) {
  const sim = createSimTransport(path.join(site, 'books.json'));
  let armed = true;
  const transport = {
    ...sim,
    name: 'lossy',
    async send(body, opts) {
      if (armed && /<TALLYREQUEST>Import<\/TALLYREQUEST>/.test(body) && /<VOUCHER /.test(body)) {
        armed = false;
        if (apply) await sim.send(body, opts);
        throw new TallyCliError('E_TIMEOUT', 'Tally did not answer within 120 s.', { details: { sent: true } });
      }
      return sim.send(body, opts);
    },
  };
  return () => createContext({ frontend: 'cli', configPath: path.join(site, 'tally.config.json'), env: {}, transport });
}

const journal = (key, extra = {}) => ({ debit: 'Salaries', credit: 'Cash', amount: 321, date: '2026-11-24', narration: 'lost reply test', idempotencyKey: key, ...extra });

test('lost reply after Tally applied the import: recovered, and a retry posts nothing', async () => {
  const site = makeSite();
  const ctx = lossyContext(site, { apply: true });
  const r = await invoke('post.journal', journal('lost-1'), ctx());
  assert.equal(r.ok, true, JSON.stringify(r.error));
  assert.equal(r.data.recovered, true);
  const again = await invoke('post.journal', journal('lost-1'), ctx());
  assert.equal(again.data.duplicate, true);
  const f = await tally(site, 'voucher', 'find', '--date', '2026-11-24', '--amount', '321');
  assert.equal(f.data.count, 1);
});

test('lost request: unknown outcome, retries refuse to resend until forceResend, which posts once', async () => {
  const site = makeSite();
  const ctx = lossyContext(site, { apply: false });
  const r = await invoke('post.journal', journal('lost-2'), ctx());
  assert.equal(r.error.code, 'E_INDETERMINATE');
  const retry = await invoke('post.journal', journal('lost-2'), ctx());
  assert.equal(retry.error.code, 'E_INDETERMINATE');
  assert.equal((await tally(site, 'voucher', 'find', '--date', '2026-11-24', '--amount', '321')).data.count, 0);
  const forced = await tally(site, 'post', 'journal', '--debit', 'Salaries', '--credit', 'Cash', '--amount', '321', '--date', '2026-11-24', '--narration', 'lost reply test', '--idempotency-key', 'lost-2', '--force-resend');
  assert.equal(forced.data.created, true, JSON.stringify(forced.error));
  const again = await tally(site, 'post', 'journal', '--debit', 'Salaries', '--credit', 'Cash', '--amount', '321', '--date', '2026-11-24', '--narration', 'lost reply test', '--idempotency-key', 'lost-2', '--force-resend');
  assert.equal(again.data.duplicate, true);
  assert.equal((await tally(site, 'voucher', 'find', '--date', '2026-11-24', '--amount', '321')).data.count, 1);
  assert.ok(fs.existsSync(path.join(site, '.tally', 'audit.jsonl')));
});

test('forceResend is ignored from remote front-ends', async () => {
  const site = makeSite({ frontends: { http: 'write' } });
  const ctx = lossyContext(site, { apply: false });
  assert.equal((await invoke('post.journal', journal('lost-3'), ctx())).error.code, 'E_INDETERMINATE');
  const remote = createContext({ frontend: 'http', configPath: path.join(site, 'tally.config.json'), env: {} });
  const r = await invoke('post.journal', journal('lost-3', { forceResend: true }), remote);
  assert.equal(r.error.code, 'E_INDETERMINATE');
});

test('vouchers with an e-invoice acknowledgement cannot be cancelled', async () => {
  const site = makeSite();
  const { writeJson } = await import('./helpers.mjs');
  const v = { kind: 'journal', date: '2026-11-24', narration: 'einv', raw: { voucher: { IRNACKNO: '112410000001' } }, entries: [{ ledger: 'Salaries', debit: 5 }, { ledger: 'Cash', credit: 5 }] };
  const c = await tally(site, 'voucher', 'create', '--input', writeJson(site, 'e.json', v));
  assert.equal(c.code, 0, JSON.stringify(c.error));
  const r = await tally(site, 'voucher', 'cancel', '--master-id', String(c.data.masterId), '--yes');
  assert.equal(r.error.code, 'E_POLICY');
});

test('optional mode refuses when the self-test found optional vouchers affect balances', async () => {
  const site = makeSite({ writeMode: 'optional' });
  const { saveCapabilities } = await import('../src/core/capabilities.mjs');
  const { StateStore, scopeKey } = await import('../src/core/state.mjs');
  saveCapabilities(new StateStore(path.join(site, '.tally')), scopeKey('test', 'Sample Traders Pvt Ltd'), { 'import.optionalStaysOut': false }, []);
  const r = await tally(site, 'post', 'journal', '--debit', 'Salaries', '--credit', 'Cash', '--amount', '5', '--date', '2026-11-24');
  assert.equal(r.error.code, 'E_POLICY');
});
