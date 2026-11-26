/**
 * Long-running front-ends (mcp, serve, relay, watch, simulate) and data flows (export, import, sync, changes).
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { defineOp, PERIOD_PARAMS } from './registry.mjs';
import { createContext } from './context.mjs';
import { serveStdio } from '../frontends/mcp.mjs';
import { createHttpServer } from '../frontends/http.mjs';
import { runRelay } from '../frontends/relay.mjs';
import { createSimServer, loadSimulator } from '../sim/server.mjs';
import { DATASETS, exportDataset, formatRows, changesSince, currentGuids, diffGuids, syncOnce, syncState, saveSyncState, companyCounters, deliver, watchLoop } from '../sync/sync.mjs';
import { loadRecords, runImport } from '../sync/import.mjs';
import { readText, parseJson, writeFileSafe } from '../core/textio.mjs';
import { TallyCliError } from '../core/errors.mjs';

/** A fresh context per request for servers, inheriting how this process was started. */
function contextFactory(ctx, frontend) {
  const base = { configPath: ctx.config.file, profile: ctx.profileName, frontend, log: ctx.log };
  const overrides = { url: ctx.profile.url, company: ctx.profile.company, timeoutMs: ctx.profile.timeoutMs, encoding: ctx.profile.encoding };
  return () => createContext({ ...base, overrides });
}

const versionOf = () => {
  try {
    return JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
  } catch {
    return '0.0.0';
  }
};

defineOp({
  id: 'mcp',
  kind: 'local',
  summary: 'Run as an MCP tool server on stdio (for Claude Desktop, Claude Code and other MCP clients).',
  description: 'Exposes operations as tools, limited by the profile\'s "frontends.mcp" ceiling (read by default). --toolset all exposes every operation; "core" exposes the main ones plus generic find/run tools. "tally integrate" prints the client configuration.',
  input: { properties: { toolset: { type: 'string', enum: ['core', 'all'], description: 'Default from mcp.toolset in the config (core).' } } },
  examples: ['mcp', 'mcp --profile main --toolset all'],
  mcp: false,
  remote: false,
  run: async (ctx, i) => {
    const toolset = i.toolset || ctx.config.mcp.toolset || 'core';
    await serveStdio({ makeCtx: contextFactory(ctx, 'mcp'), toolset, maxChars: ctx.config.mcp.maxChars || 40000, version: versionOf() });
    return { __stream: true, exitCode: 0 };
  },
});

defineOp({
  id: 'serve',
  kind: 'local',
  summary: 'Run the local HTTP API (token protected, this PC only by default) for n8n, Make or a backend.',
  input: {
    properties: {
      port: { type: 'integer', description: 'Default from http.port (8765).' },
      host: { type: 'string', description: 'Default 127.0.0.1. Binding to another address needs --allow-network.' },
      allowNetwork: { type: 'boolean', description: 'Allow binding to a non-loopback address (put it behind a firewall or tunnel).' },
    },
  },
  examples: ['serve', 'serve --port 8800'],
  mcp: false,
  remote: false,
  run: async (ctx, i) => {
    const cfg = { ...ctx.config, http: { ...ctx.config.http, ...(i.port ? { port: i.port } : {}), ...(i.host ? { host: i.host } : {}) } };
    const loopback = ['127.0.0.1', 'localhost', '::1'].includes(cfg.http.host);
    if (!loopback && !i.allowNetwork) throw new TallyCliError('E_POLICY', `Refusing to listen on ${cfg.http.host} without --allow-network.`, { hint: 'The API stays on this PC by default. Use a tunnel or reverse proxy for remote access.' });
    if (!(cfg.http.tokens || []).length) ctx.warn('No tokens yet: every request will be refused. Create one with "tally token create <name>".');
    const makeCtx = contextFactory(ctx, 'http');
    const log = (m) => process.stderr.write(`[tally serve] ${m}\n`);
    const server = createHttpServer({ makeCtx: () => makeCtx(), config: cfg, log });
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(cfg.http.port, cfg.http.host, () => {
        log(`listening on http://${cfg.http.host}:${cfg.http.port} (profile ${ctx.profileName}, ceiling "${ctx.profile.frontends?.http || 'read'}")`);
        resolve();
      });
    });
    await new Promise((resolve) => {
      const stop = () => server.close(resolve);
      process.once('SIGINT', stop);
      process.once('SIGTERM', stop);
    });
    return { __stream: true, exitCode: 0 };
  },
});

defineOp({
  id: 'relay',
  kind: 'local',
  summary: 'Connect out to a relay hub and run signed jobs from a cloud AI system (no inbound port needed).',
  input: { properties: { once: { type: 'boolean', description: 'Handle at most one poll and exit (for testing).' } } },
  examples: ['relay', 'relay --once'],
  mcp: false,
  remote: false,
  run: async (ctx, i) => {
    const log = (m) => process.stderr.write(`[tally relay] ${m}\n`);
    const ac = new AbortController();
    process.once('SIGINT', () => ac.abort());
    process.once('SIGTERM', () => ac.abort());
    await runRelay({ config: ctx.config, makeCtx: contextFactory(ctx, 'relay'), state: ctx.state, log, once: i.once, signal: ac.signal });
    return { __stream: true, exitCode: 0 };
  },
});

defineOp({
  id: 'simulate',
  kind: 'local',
  summary: 'Run a Tally simulator on a port (fictional demo company) for demos, rehearsals and testing integrations.',
  input: {
    properties: {
      port: { type: 'integer', default: 9000 },
      state: { type: 'string', description: 'JSON file to keep the simulated books between runs.' },
      empty: { type: 'boolean', description: 'Start with an empty company instead of the demo data.' },
      educational: { type: 'boolean', description: 'Behave like Educational mode (date restrictions).' },
      delayMs: { type: 'integer', default: 0, description: 'Add latency to every reply.' },
      seed: { type: 'integer', default: 42 },
    },
  },
  examples: ['simulate --port 9000 --state demo-books.json', 'simulate --empty --port 9100'],
  mcp: false,
  remote: false,
  run: async (ctx, i) => {
    const sim = loadSimulator({ state: i.state, empty: i.empty, educational: i.educational, seed: i.seed });
    const log = (m) => process.stderr.write(`[tally simulate] ${m}\n`);
    const server = createSimServer(sim, { state: i.state, delayMs: i.delayMs, log: ctx.log === undefined ? () => {} : () => {} });
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(i.port, '127.0.0.1', () => resolve());
    });
    log(`simulating "${sim.store.company.name}" on http://127.0.0.1:${i.port} (not real Tally). Point a profile at it: tally init --url http://127.0.0.1:${i.port}`);
    await new Promise((resolve) => {
      const stop = () => server.close(resolve);
      process.once('SIGINT', stop);
      process.once('SIGTERM', stop);
    });
    return { __stream: true, exitCode: 0 };
  },
});

// ---------- export / import ----------

defineOp({
  id: 'export',
  kind: 'read',
  summary: `Export a dataset to JSON, NDJSON or CSV (${DATASETS.join(', ')}).`,
  input: {
    properties: {
      dataset: { type: 'string', enum: DATASETS },
      ...PERIOD_PARAMS,
      format: { type: 'string', enum: ['json', 'ndjson', 'csv'], default: 'json' },
      file: { type: 'string', localPath: true, description: 'Write to this file (default: print).' },
      includeOptional: { type: 'boolean' },
      includeCancelled: { type: 'boolean' },
      sinceAlterId: { type: 'integer', description: 'Only records altered after this alter id (incremental).' },
      raw: { type: 'boolean', description: 'For masters: Tally field names instead of the friendly shape.' },
    },
    required: ['dataset'],
  },
  positional: ['dataset'],
  examples: ['export vouchers --fy current --format csv --file vouchers.csv', 'export entries --from 2026-04-01 --to 2026-06-30 --format ndjson --file entries.ndjson', 'export ledgers --format csv'],
  run: async (ctx, i) => {
    const r = await exportDataset(ctx, i.dataset, { ...i, onWindow: (w, n) => ctx.log(`exported ${w.from}..${w.to}: ${n} rows`) });
    if (i.file) {
      writeFileSafe(path.resolve(i.file), formatRows(r.rows, i.format));
      return { dataset: i.dataset, rows: r.rows.length, file: path.resolve(i.file), period: r.period };
    }
    if (i.format !== 'json') return { __raw: formatRows(r.rows, i.format), rows: r.rows };
    return { dataset: i.dataset, period: r.period, count: r.rows.length, rows: r.rows };
  },
});

defineOp({
  id: 'import.vouchers',
  mcp: false,
  kind: 'write',
  summary: 'Import vouchers from JSON/NDJSON (voucher objects) or CSV (+ mapping). Validates only, unless --commit. Safe to re-run.',
  input: {
    properties: {
      file: { type: 'string', localPath: true, description: 'Input file (.json, .ndjson or .csv).' },
      map: { type: 'string', localPath: true, description: 'Mapping file for CSV (see docs/INTEGRATION.md).' },
      commit: { type: 'boolean', description: 'Actually post. Without it nothing is written.' },
      stopOnError: { type: 'boolean' },
      limit: { type: 'integer', minimum: 1, description: 'Only the first N records.' },
      forceResend: { type: 'boolean', description: 'Resend records whose earlier attempt had an unknown outcome (only after checking Tally).' },
    },
    required: ['file'],
  },
  positional: ['file'],
  examples: ['import vouchers invoices.json', 'import vouchers receipts.csv --map templates/import/receipts-map.json --commit'],
  remote: false,
  run: async (ctx, i) => {
    const mapping = i.map ? parseJson(await readText(i.map), 'mapping file') : undefined;
    const records = await loadRecords(i.file, { type: 'vouchers', mapping });
    if (i.commit) ctx.policy.assertWritesEnabled('import.vouchers');
    return runImport(ctx, records, { commit: !!i.commit, stopOnError: i.stopOnError, limit: i.limit, forceResend: i.forceResend });
  },
});

defineOp({
  id: 'import.masters',
  mcp: false,
  kind: 'write',
  summary: 'Import masters (ledgers, items, ...) from JSON ([{type, ...fields}]) or CSV (+ mapping with "type" and "columns"). Creates missing ones only.',
  input: {
    properties: {
      file: { type: 'string', localPath: true },
      map: { type: 'string', localPath: true },
      commit: { type: 'boolean' },
      stopOnError: { type: 'boolean' },
      limit: { type: 'integer', minimum: 1 },
    },
    required: ['file'],
  },
  positional: ['file'],
  examples: ['import masters customers.csv --map templates/import/ledgers-map.json', 'import masters items.json --commit'],
  remote: false,
  run: async (ctx, i) => {
    const mapping = i.map ? parseJson(await readText(i.map), 'mapping file') : undefined;
    const records = await loadRecords(i.file, { type: 'masters', mapping });
    if (i.commit) ctx.policy.assertMasterWrites('import.masters');
    return runImport(ctx, records, { commit: !!i.commit, stopOnError: i.stopOnError, limit: i.limit });
  },
});

// ---------- change detection and sync ----------

defineOp({
  id: 'changes.list',
  kind: 'read',
  summary: 'Vouchers and masters created or altered since given alter ids (default: since the last sync).',
  input: { properties: { sinceVoucherAlterId: { type: 'integer' }, sinceMasterAlterId: { type: 'integer' }, masters: { type: 'boolean', default: true } } },
  examples: ['changes list --since-voucher-alter-id 4500'],
  run: async (ctx, i) => {
    const st = syncState(ctx) || {};
    const altVchId = i.sinceVoucherAlterId ?? st.altVchId ?? 0;
    const altMstId = i.sinceMasterAlterId ?? st.altMstId ?? 0;
    const cur = await companyCounters(ctx);
    const ch = await changesSince(ctx, { altVchId, altMstId, masters: i.masters });
    return { since: { altVchId, altMstId }, now: { altVchId: cur.altVchId, altMstId: cur.altMstId }, vouchers: ch.vouchers, masters: ch.masters };
  },
});

defineOp({
  id: 'changes.deleted',
  kind: 'read',
  summary: 'Detect deleted vouchers and masters by comparing with the previous snapshot of ids (first run takes the snapshot).',
  input: { properties: { masters: { type: 'boolean', default: true } } },
  examples: ['changes deleted'],
  run: async (ctx, i) => {
    const file = `guids-${crypto.createHash('sha1').update(ctx.scope).digest('hex').slice(0, 10)}.json`;
    const prev = ctx.state.read(file, null);
    const cur = await currentGuids(ctx, { masters: i.masters });
    ctx.state.write(file, cur);
    if (!prev) return { snapshot: 'taken', vouchers: cur.vouchers.length, masters: cur.masters.length, deleted: { vouchers: [], masters: [] } };
    return { snapshot: 'compared', deleted: diffGuids(prev, cur) };
  },
});

defineOp({
  id: 'sync.status',
  kind: 'read',
  summary: 'Where the incremental sync cursor stands versus Tally\'s current alter ids.',
  examples: ['sync status'],
  run: async (ctx) => {
    const st = syncState(ctx);
    const cur = await companyCounters(ctx);
    return { cursor: st, tally: cur, pending: !st || st.altMstId !== cur.altMstId || st.altVchId !== cur.altVchId };
  },
});

defineOp({
  id: 'sync.run',
  mcp: false,
  kind: 'read',
  summary: 'Send everything changed since the last run (everything on the first run) to a sink: folder, file, URL or stdout.',
  input: {
    properties: {
      sink: { type: 'string', localPath: true, description: 'Folder (ends with /), file (.ndjson/.json/.csv), http(s) URL, or "-" for stdout.' },
      datasets: { type: 'array', items: { type: 'string', enum: DATASETS }, description: 'Default: ledgers, groups, items, vouchers, entries, inventory, bills.' },
      format: { type: 'string', enum: ['ndjson', 'json', 'csv'] },
      secret: { type: 'string', description: 'HMAC secret for signing HTTP deliveries (X-Tally-Signature).' },
      detectDeletions: { type: 'boolean' },
      ...PERIOD_PARAMS,
    },
    required: ['sink'],
  },
  examples: ['sync run --sink exports/', 'sync run --sink https://example.com/hooks/tally --secret $SECRET'],
  remote: false,
  run: async (ctx, i) => syncOnce(ctx, { ...i, secret: i.secret || ctx.config.raw.webhookSecret }),
});

defineOp({
  id: 'sync.reset',
  kind: 'local',
  summary: 'Forget the sync cursor (the next "sync run" exports everything again).',
  examples: ['sync reset'],
  run: async (ctx) => {
    saveSyncState(ctx, null);
    return { reset: true };
  },
});

defineOp({
  id: 'watch',
  kind: 'read',
  summary: 'Poll Tally and emit change events (new/altered vouchers and masters, optional deletions) to stdout, a file or a webhook.',
  input: {
    properties: {
      interval: { type: 'integer', default: 30, minimum: 2, description: 'Seconds between checks.' },
      sink: { type: 'string', description: 'Default stdout (NDJSON). File path or http(s) URL.' },
      secret: { type: 'string', description: 'HMAC secret for webhook signatures.' },
      detectDeletions: { type: 'boolean', description: 'Also report deletions (reads all ids each time; slower).' },
      fromNow: { type: 'boolean', description: 'Ignore changes made before starting.' },
      once: { type: 'boolean', description: 'Check once and exit.' },
    },
  },
  examples: ['watch', 'watch --sink https://example.com/hooks/tally --secret $SECRET --interval 60'],
  remote: false,
  mcp: false,
  run: async (ctx, i) => {
    const log = (m) => process.stderr.write(`[tally watch] ${m}\n`);
    const ac = new AbortController();
    if (!i.once) {
      process.once('SIGINT', () => ac.abort());
      process.once('SIGTERM', () => ac.abort());
    }
    let count = 0;
    const cursor = await watchLoop(ctx, i, {
      log,
      signal: ac.signal,
      onEvent: async (events) => {
        count += events.length;
        await deliver(i.sink || '-', events, { secret: i.secret || ctx.config.raw.webhookSecret, stdout: ctx.io?.stdout });
      },
    });
    if (i.once) return { events: count, cursor };
    return { __stream: true, exitCode: 0 };
  },
});
