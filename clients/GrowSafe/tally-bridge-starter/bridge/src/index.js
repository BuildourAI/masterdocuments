// GrowSafe Tally Bridge. Runs on the Tally server only.
//   node src/index.js test        read-only: is Tally answering, which companies, does Supabase answer
//   node src/index.js sync-once   one incremental sync of every company in config.json
//   node src/index.js deletions   find vouchers deleted in Tally
//   node src/index.js reconcile   compare ledger balances, Tally against the app
//   node src/index.js write-once  send approved items (only if write.enabled, test companies first)
//   node src/index.js run         keep running: sync, write, reconcile on the schedule in config.json
import { loadEnv, loadConfig, log } from './config.js';
import { Tally } from './tally.js';
import { connect, must } from './supabase.js';
import { syncCompany, detectDeletions } from './reader.js';
import { writeCompany } from './writer.js';
import { reconcileLedgers } from './reconcile.js';

loadEnv();
const cfg = loadConfig();
const tally = new Tally(cfg.tally);
const cmd = process.argv[2] || 'test';

async function forEachCompany(label, fn) {
  for (const c of cfg.companies) {
    try {
      const out = await fn(c);
      log('info', `${label} ${c.name}`, out);
    } catch (err) {
      log('error', `${label} ${c.name} failed: ${err.message || err}`);
    }
  }
}

async function test() {
  const sb = connect();
  const companies = await tally.listCompanies();
  log('info', `Tally is answering. Open companies: ${companies.map((c) => c.name).join(', ') || 'none'}`);
  for (const c of cfg.companies) {
    const ok = companies.some((x) => x.name.toLowerCase() === c.name.toLowerCase());
    log(ok ? 'info' : 'warn', `config company "${c.name}": ${ok ? 'found in Tally' : 'NOT open in Tally'}`);
  }
  await must(sb.from('bridge_sync_state').select('company_guid').limit(1), 'Supabase check');
  await sb.from('bridge_sync_runs').insert({
    kind: 'test', status: 'ok', started_at: new Date().toISOString(), finished_at: new Date().toISOString(),
    details: { tallyCompanies: companies.map((c) => c.name), configCompanies: cfg.companies.map((c) => c.name) }
  });
  log('info', 'Supabase is answering. Test result saved to bridge_sync_runs. Nothing was written into Tally.');
}

async function run() {
  const sb = connect();
  const readEvery = (cfg.read?.everyMinutes || 5) * 60_000;
  const writeEvery = (cfg.write?.everyMinutes || 2) * 60_000;
  const delEvery = (cfg.read?.deletionCheckEveryHours || 24) * 3_600_000;
  let lastRead = 0, lastWrite = 0, lastDel = 0, lastReconcileDay = '';
  log('info', 'Bridge running. Press Ctrl+C to stop.');
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const now = Date.now();
    if (now - lastRead >= readEvery) { lastRead = now; await forEachCompany('sync', (c) => syncCompany(tally, sb, c)); }
    if (cfg.write?.enabled && now - lastWrite >= writeEvery) { lastWrite = now; await forEachCompany('write', (c) => writeCompany(tally, sb, cfg, c)); }
    if (now - lastDel >= delEvery) { lastDel = now; await forEachCompany('deletions', (c) => detectDeletions(tally, sb, c)); }
    const day = new Date().toISOString().slice(0, 10);
    if (day !== lastReconcileDay && new Date().getHours() >= (cfg.read?.reconcileAtHour ?? 7)) {
      lastReconcileDay = day;
      await forEachCompany('reconcile', (c) => reconcileLedgers(tally, sb, c));
    }
    await new Promise((r) => setTimeout(r, 30_000));
  }
}

const commands = {
  test,
  'sync-once': async () => { const sb = connect(); await forEachCompany('sync', (c) => syncCompany(tally, sb, c)); },
  deletions: async () => { const sb = connect(); await forEachCompany('deletions', (c) => detectDeletions(tally, sb, c)); },
  reconcile: async () => { const sb = connect(); await forEachCompany('reconcile', (c) => reconcileLedgers(tally, sb, c)); },
  'write-once': async () => { const sb = connect(); await forEachCompany('write', (c) => writeCompany(tally, sb, cfg, c)); },
  run
};

if (!commands[cmd]) {
  console.log(`Unknown command "${cmd}". Use one of: ${Object.keys(commands).join(', ')}`);
  process.exit(1);
}
commands[cmd]().catch((err) => { log('error', err.message || String(err)); process.exit(1); });
