// GrowSafe Tally Bridge. Runs on the Tally server only, next to the tally-cli folder.
//   node src/index.js test        read-only: tally-cli doctor for each company, and is Supabase answering
//   node src/index.js sync-once   one incremental sync of every company in config.json
//   node src/index.js deletions   find vouchers deleted in Tally
//   node src/index.js reconcile   compare ledger balances, Tally against the app
//   node src/index.js write-once  send approved items (only if write.enabled; test companies first)
//   node src/index.js run         keep running: sync, write, reconcile on the schedule in config.json
import { loadEnv, loadConfig, log } from './config.js';
import { TallyCli } from './tallycli.js';
import { SupabaseStore } from './store.js';
import { syncCompany, detectDeletions } from './reader.js';
import { writeCompany } from './writer.js';
import { reconcileLedgers } from './reconcile.js';

loadEnv();
const cfg = loadConfig();
const cli = new TallyCli(cfg.tallyCli || {});
const cmd = process.argv[2] || 'test';

async function forEachCompany(label, fn) {
  let failed = 0;
  for (const c of cfg.companies) {
    try {
      log('info', `${label} ${c.name}`, await fn(c));
    } catch (err) {
      failed += 1;
      log('error', `${label} ${c.name} failed: ${err.message || err}${err.hint ? ` (${err.hint})` : ''}`);
    }
  }
  return failed;
}

async function test() {
  for (const c of cfg.companies) {
    const d = await cli.doctor(c.profile);
    for (const k of d.checks) log(k.status === 'pass' ? 'info' : 'warn', `[${c.profile}] ${k.check}: ${k.status} ${k.detail || ''}${k.hint ? ` (${k.hint})` : ''}`);
    const list = await cli.companies(c.profile);
    const ok = list.some((x) => x.name.toLowerCase() === c.name.toLowerCase());
    log(ok ? 'info' : 'warn', `config company "${c.name}": ${ok ? 'open in Tally' : 'NOT open in Tally'}`);
  }
  const store = new SupabaseStore();
  await store.rpc('bridge_log', { p_table: 'bridge_sync_runs', p_row: { kind: 'test', status: 'ok', started_at: new Date().toISOString(), finished_at: new Date().toISOString(), details: { companies: cfg.companies.map((c) => c.name) } } });
  log('info', 'Supabase is answering; the test is recorded in bridge_sync_runs. Nothing was written into Tally.');
}

async function run() {
  const store = new SupabaseStore();
  const readEvery = (cfg.read?.everyMinutes || 5) * 60_000;
  const writeEvery = (cfg.write?.everyMinutes || 2) * 60_000;
  const delEvery = (cfg.read?.deletionCheckEveryHours || 24) * 3_600_000;
  let lastRead = 0, lastWrite = 0, lastDel = 0, lastReconcileDay = '';
  log('info', 'Bridge running. Press Ctrl+C to stop.');
  for (;;) {
    const now = Date.now();
    if (now - lastRead >= readEvery) { lastRead = now; await forEachCompany('sync', (c) => syncCompany(cli, store, c)); }
    if (cfg.write?.enabled && now - lastWrite >= writeEvery) { lastWrite = now; await forEachCompany('write', (c) => writeCompany(cli, store, cfg, c)); }
    if (now - lastDel >= delEvery) { lastDel = now; await forEachCompany('deletions', (c) => detectDeletions(cli, store, c)); }
    const day = new Date().toISOString().slice(0, 10);
    if (day !== lastReconcileDay && new Date().getHours() >= (cfg.read?.reconcileAtHour ?? 7)) {
      lastReconcileDay = day;
      await forEachCompany('reconcile', (c) => reconcileLedgers(cli, store, c));
    }
    await new Promise((r) => setTimeout(r, 30_000));
  }
}

const once = (label, fn) => async () => { const store = new SupabaseStore(); if (await forEachCompany(label, (c) => fn(store, c))) process.exitCode = 1; };
const commands = {
  test,
  'sync-once': once('sync', (s, c) => syncCompany(cli, s, c)),
  deletions: once('deletions', (s, c) => detectDeletions(cli, s, c)),
  reconcile: once('reconcile', (s, c) => reconcileLedgers(cli, s, c)),
  'write-once': once('write', (s, c) => writeCompany(cli, s, cfg, c)),
  run,
};

if (!commands[cmd]) {
  console.log(`Unknown command "${cmd}". Use one of: ${Object.keys(commands).join(', ')}`);
  process.exit(1);
}
commands[cmd]().catch((err) => { log('error', err.message || String(err)); process.exit(1); });
