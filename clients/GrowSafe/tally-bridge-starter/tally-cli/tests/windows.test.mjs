import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { render } from '../src/cli/output.mjs';
import { parseArgs } from '../src/cli/args.mjs';
import '../src/ops/index.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('piped JSON on Windows is ASCII-escaped so console code pages cannot garble it', () => {
  const env = { ok: true, data: { party: 'शर्मा ₹' }, meta: {} };
  const win = render(env, 'json', { platform: 'win32', piped: true });
  assert.ok(/^[\x00-\x7f]*$/.test(win));
  assert.deepEqual(JSON.parse(win), env);
  assert.match(render(env, 'json', { platform: 'linux', piped: true }), /शर्मा/);
});

test('launchers: tally.cmd quotes its own path and prefers a bundled runtime', () => {
  const cmd = fs.readFileSync(path.join(root, 'tally.cmd'), 'utf8');
  assert.match(cmd, /"%~dp0runtime\\node\.exe" "%~dp0bin\\tally\.mjs" %\*/);
  assert.match(cmd, /node "%~dp0bin\\tally\.mjs" %\*/);
  assert.match(fs.readFileSync(path.join(root, '.gitattributes'), 'utf8'), /\*\.cmd text eol=crlf/);
});

test('argument parsing: quoted names with spaces, --flag=value, booleans, --no-flag', () => {
  const p = parseArgs(['ledger', 'get', 'Bank of Example - Current A/c', '--as-of=2026-11-30']);
  assert.equal(p.opId, 'ledger.get');
  assert.equal(p.input.name, 'Bank of Example - Current A/c');
  assert.equal(p.input.asOf, '2026-11-30');
  const b = parseArgs(['report', 'receivables', '--detail', 'false', '--with-contacts']);
  assert.equal(b.input.detail, 'false');
  assert.equal(b.input.withContacts, true);
  const n = parseArgs(['report', 'receivables', '--no-detail']);
  assert.equal(n.input.detail, false);
  const arr = parseArgs(['post', 'receipt', '--against', 'A,B', '--against', 'C']);
  assert.deepEqual(arr.input.against, ['A', 'B', 'C']);
  const g = parseArgs(['--profile', 'x', 'status', '--json']);
  assert.equal(g.opId, 'status');
  assert.equal(g.flags.profile, 'x');
  assert.equal(g.flags.json, true);
});
