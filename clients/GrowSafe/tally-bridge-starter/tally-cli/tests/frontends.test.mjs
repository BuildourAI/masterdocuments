import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { PassThrough } from 'node:stream';
import { makeSite, tally } from './helpers.mjs';
import '../src/ops/index.mjs';
import { serveStdio, capText } from '../src/frontends/mcp.mjs';
import { createHttpServer } from '../src/frontends/http.mjs';
import { runRelay, verifyJob, jobSignature } from '../src/frontends/relay.mjs';
import { createContext } from '../src/ops/context.mjs';
import { createSimServer, loadSimulator } from '../src/sim/server.mjs';
import { createHttpTransport } from '../src/core/transport.mjs';
import { TallyClient } from '../src/core/client.mjs';
import { createHub } from '../examples/relay-hub.mjs';
import { listOps } from '../src/ops/registry.mjs';
import { commandsMarkdown } from '../src/ops/setup.mjs';

const ctxFor = (site, frontend) => () => createContext({ frontend, configPath: path.join(site, 'tally.config.json'), env: {} });

async function mcpExchange(site, messages, toolset = 'core') {
  const input = new PassThrough();
  const output = new PassThrough();
  let text = '';
  output.on('data', (c) => (text += c));
  const done = serveStdio({ makeCtx: ctxFor(site, 'mcp'), toolset, input, output, version: 'test', log: () => {} });
  for (const m of messages) input.write(JSON.stringify(m) + '\n');
  input.end();
  await done;
  return text
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((l) => JSON.parse(l));
}

test('MCP legacy handshake, tool list respects the read ceiling, tool calls', async () => {
  const site = makeSite();
  const res = await mcpExchange(site, [
    { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 't', version: '1' } } },
    { jsonrpc: '2.0', method: 'notifications/initialized' },
    { jsonrpc: '2.0', id: 2, method: 'tools/list' },
    { jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'ledger_get', arguments: { name: 'Cash' } } },
    { jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'tally_run_write', arguments: { op: 'post.contra', input: {} } } },
    { jsonrpc: '2.0', id: 5, method: 'ping' },
    { jsonrpc: '2.0', id: 6, method: 'nope' },
  ]);
  assert.equal(res.length, 6);
  assert.equal(res[0].result.protocolVersion, '2025-06-18');
  const names = res[1].result.tools.map((t) => t.name);
  assert.ok(names.includes('report_receivables'));
  assert.ok(!names.includes('post_receipt'), 'write tools hidden under the read ceiling');
  assert.ok(!names.includes('tally_run_write'));
  assert.equal(res[2].result.isError, false);
  assert.equal(JSON.parse(res[2].result.content[0].text).data.name, 'Cash');
  assert.equal(res[3].error.code, -32602);
  assert.deepEqual(res[4].result, {});
  assert.equal(res[5].error.code, -32601);
});

test('MCP modern stateless requests and version errors', async () => {
  const site = makeSite({ frontends: { mcp: 'write' } });
  const meta = { 'io.modelcontextprotocol/protocolVersion': '2026-07-28' };
  const res = await mcpExchange(
    site,
    [
      { jsonrpc: '2.0', id: 'd', method: 'server/discover', params: { _meta: meta } },
      { jsonrpc: '2.0', id: 'l', method: 'tools/list', params: { _meta: meta } },
      { jsonrpc: '2.0', id: 'c', method: 'tools/call', params: { _meta: meta, name: 'post_contra', arguments: { from: 'Cash', to: 'Bank of Example - Current A/c', amount: 5, date: '2026-11-24', dryRun: true } } },
      { jsonrpc: '2.0', id: 'v', method: 'tools/list', params: { _meta: { 'io.modelcontextprotocol/protocolVersion': '1900-01-01' } } },
    ],
    'all',
  );
  assert.ok(res[0].result.supportedVersions.includes('2026-07-28'));
  assert.equal(res[0].result.resultType, 'complete');
  assert.ok(res[1].result.ttlMs > 0 && res[1].result.cacheScope);
  assert.ok(res[1].result.tools.some((t) => t.name === 'post_contra' && t.annotations.destructiveHint === false));
  assert.equal(res[2].result.isError, false);
  assert.equal(JSON.parse(res[2].result.content[0].text).data.dryRun, true);
  assert.equal(res[3].error.code, -32022);
});

test('MCP results are capped for the model context', () => {
  const big = { rows: Array.from({ length: 5000 }, (_, i) => ({ i, name: 'x'.repeat(30) })) };
  const t = capText(big, 40000);
  assert.ok(t.length <= 40000);
  assert.ok(JSON.parse(t).truncated.total === 5000);
});

test('HTTP API: token, scope, origin, catalogue', async () => {
  const site = makeSite({ frontends: { http: 'write' } });
  const tok = await tally(site, 'token', 'create', 'test', '--scope', 'read');
  const token = tok.data.token;
  const ctx = ctxFor(site, 'http')();
  const server = createHttpServer({ makeCtx: ctxFor(site, 'http'), config: { ...ctx.config, http: { ...ctx.config.http, port: 0 } } });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  server.close.bind(server);
  const call = async (p, body, headers = {}) => {
    const res = await fetch(`http://127.0.0.1:${port}${p}`, { method: body === undefined ? 'GET' : 'POST', headers: { 'Content-Type': 'application/json', Host: `127.0.0.1:${port}`, ...headers }, body: body === undefined ? undefined : JSON.stringify(body) });
    return { status: res.status, body: await res.json() };
  };
  try {
    ctx.config.http.port = port;
    assert.equal((await call('/health')).status, 200);
    assert.equal((await call('/v1/ops/status', {})).status, 401);
    const auth = { Authorization: `Bearer ${token}` };
    const ok = await call('/v1/ops/ledger.get', { name: 'Cash' }, auth);
    assert.equal(ok.status, 200);
    assert.equal(ok.body.data.name, 'Cash');
    assert.equal((await call('/v1/ops/post.contra', {}, auth)).status, 403);
    assert.equal((await call('/v1/ops/raw', {}, auth)).status, 404);
    assert.equal((await call('/v1/ops/status', {}, { ...auth, Origin: 'http://evil.example' })).status, 403);
    const bad = await call('/v1/ops/ledger.get', { nme: 'Cash' }, auth);
    assert.equal(bad.status, 400);
    const cat = await call('/v1/ops', undefined, auth);
    assert.ok(cat.body.data.every((o) => ['read', 'local'].includes(o.kind)));
  } finally {
    server.close();
  }
});

test('relay: signed jobs through the example hub, allowlist enforced, tampering rejected', async () => {
  const secret = 'test-secret';
  const hub = createHub({ secret });
  await new Promise((r) => hub.listen(0, '127.0.0.1', r));
  const port = hub.address().port;
  const site = makeSite({}, { relay: { url: `http://127.0.0.1:${port}`, secret, agentId: 'pc1', pollMs: 0 } });
  const enqueue = async (op, input) => (await (await fetch(`http://127.0.0.1:${port}/enqueue`, { method: 'POST', headers: { Authorization: `Bearer ${secret}` }, body: JSON.stringify({ op, input }) })).json()).id;
  const status = async (id) => (await fetch(`http://127.0.0.1:${port}/jobs/${id}`, { headers: { Authorization: `Bearer ${secret}` } })).json();
  try {
    const a = await enqueue('ledger.get', { name: 'Cash' });
    const b = await enqueue('post.contra', { from: 'Cash', to: 'Bank of Example - Current A/c', amount: 1 });
    const ctx = ctxFor(site, 'relay')();
    await runRelay({ config: ctx.config, makeCtx: ctxFor(site, 'relay'), state: ctx.state, log: () => {}, once: true });
    await runRelay({ config: ctx.config, makeCtx: ctxFor(site, 'relay'), state: ctx.state, log: () => {}, once: true });
    const ra = await status(a);
    assert.equal(ra.result.ok, true);
    assert.equal(ra.result.data.name, 'Cash');
    const rb = await status(b);
    assert.equal(rb.result.ok, false);
    assert.match(rb.result.error.message, /relay.allow/);
  } finally {
    hub.close();
  }
  const job = { id: 'j1', op: 'status', input: {}, expiresAt: new Date(Date.now() + 60000).toISOString() };
  job.signature = jobSignature(secret, job);
  assert.doesNotThrow(() => verifyJob(job, { secret, allow: ['status'] }));
  assert.throws(() => verifyJob({ ...job, input: { x: 1 } }, { secret, allow: ['status'] }), /signature/);
  assert.throws(() => verifyJob({ ...job, expiresAt: '2000-01-01T00:00:00Z', signature: jobSignature(secret, { ...job, expiresAt: '2000-01-01T00:00:00Z' }) }, { secret, allow: ['status'] }), /expired/);
});

test('HTTP transport talks UTF-16 to the simulator server like to Tally', async () => {
  const sim = loadSimulator({});
  const server = createSimServer(sim);
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const url = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const encoding of ['utf16', 'utf8']) {
      const client = new TallyClient({ transport: createHttpTransport({ url, encoding }), profile: { company: 'Sample Traders Pvt Ltd' } });
      const rows = await client.rows({ collection: { type: 'Company' }, fields: [{ key: 'v', expr: '"₹ नमस्ते"' }] });
      assert.equal(rows[0].v, '₹ नमस्ते');
    }
    const refused = createHttpTransport({ url: 'http://127.0.0.1:1', connectTimeoutMs: 500 });
    await assert.rejects(refused.send('<ENVELOPE/>'), (e) => e.code === 'E_CONNECT' && e.details.sent === false);
  } finally {
    server.close();
  }
});

test('docs/COMMANDS.md is up to date with the registry', () => {
  const file = new URL('../docs/COMMANDS.md', import.meta.url);
  const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  assert.equal(current, commandsMarkdown(listOps()), 'Run: node bin/tally.mjs ops --markdown --out docs/COMMANDS.md');
});

test('registry: every op has a summary, valid examples, and unique tool names', () => {
  const names = new Set();
  for (const op of listOps()) {
    assert.ok(op.summary && op.summary.length > 10, op.id);
    const tn = op.id.replace(/[.-]/g, '_');
    assert.ok(!names.has(tn), `duplicate tool name ${tn}`);
    names.add(tn);
    for (const ex of op.examples || []) assert.ok(ex.startsWith(op.id.split('.')[0]), `${op.id}: example "${ex}"`);
  }
  assert.ok(crypto);
});
