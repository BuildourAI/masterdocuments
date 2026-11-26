import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeSite, tally } from './helpers.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = makeSite();

for (const f of fs.readdirSync(path.join(root, 'templates/vouchers'))) {
  test(`template ${f} validates against the demo company`, async () => {
    const r = await tally(site, 'voucher', 'validate', '--input', path.join(root, 'templates/vouchers', f));
    assert.equal(r.code, 0, JSON.stringify(r.error, null, 1));
  });
}

test('import templates validate', async () => {
  const t = (...a) => tally(site, 'import', ...a);
  const rec = await t('vouchers', path.join(root, 'templates/import/receipts.csv'), '--map', path.join(root, 'templates/import/receipts-map.json'));
  assert.equal(rec.data.failed, 0, JSON.stringify(rec.data.results));
  const sales = await t('vouchers', path.join(root, 'templates/import/sales-lines.csv'), '--map', path.join(root, 'templates/import/sales-map.json'));
  assert.equal(sales.data.total, 2);
  assert.equal(sales.data.failed, 0, JSON.stringify(sales.data.results));
  const led = await t('masters', path.join(root, 'templates/import/ledgers.csv'), '--map', path.join(root, 'templates/import/ledgers-map.json'));
  assert.equal(led.data.failed, 0, JSON.stringify(led.data.results));
  const m = await t('masters', path.join(root, 'templates/masters/masters.json'), '--commit');
  assert.equal(m.data.failed, 0, JSON.stringify(m.data.results));
});

test('statement sample matches book entries', async () => {
  const r = await tally(site, 'bank', 'match', 'Bank of Example - Current A/c', path.join(root, 'templates/statement-sample.csv'));
  assert.equal(r.code, 0, r.out);
  assert.ok(r.data.matched.length >= 1);
});
