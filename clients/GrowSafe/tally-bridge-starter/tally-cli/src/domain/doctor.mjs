/**
 * "tally doctor": a guided connection check with a remedy for every failure.
 */
import os from 'node:os';
import net from 'node:net';
import fs from 'node:fs';
import { listCompanies, probeLicence, booksPeriod } from './company.mjs';
import { norm } from './common.mjs';
import { fromTally } from '../core/dates.mjs';

const PASS = 'pass';
const WARN = 'warn';
const FAIL = 'fail';

function tcpProbe(host, port, timeoutMs = 800) {
  return new Promise((resolve) => {
    const s = net.connect({ host, port });
    const done = (v) => {
      s.destroy();
      resolve(v);
    };
    s.setTimeout(timeoutMs, () => done(false));
    s.once('connect', () => done(true));
    s.once('error', () => done(false));
  });
}

export async function runDoctor(ctx, { network = true } = {}) {
  const checks = [];
  const add = (check, status, detail, hint) => checks.push({ check, status, detail, ...(hint ? { hint } : {}) });
  const cfg = ctx.config;
  const p = ctx.profile;

  add('Node.js', PASS, `version ${process.versions.node} on ${process.platform} ${process.arch}`);
  if (cfg.exists) add('Config file', PASS, `${cfg.file} (profile "${cfg.profileName}")`);
  else add('Config file', WARN, `none found; using defaults (${p.url})`, 'Run "tally init" to create tally.config.json.');
  add('Write mode', PASS, `${p.writeMode}${p.writeMode === 'optional' ? ' (vouchers land as optional, for review in Tally)' : ''}; masters ${p.allowMasterWrites ? 'allowed' : 'not allowed'}; alter/cancel/delete ${p.allowDestructive ? 'allowed' : 'not allowed'}`);
  try {
    fs.mkdirSync(cfg.stateDir, { recursive: true });
    fs.accessSync(cfg.stateDir, fs.constants.W_OK);
    add('State folder', PASS, cfg.stateDir);
  } catch (err) {
    add('State folder', FAIL, `${cfg.stateDir}: ${err.message}`, 'The audit log and sync state need a writable folder. Move the tool to a folder you can write to.');
  }

  // Connection
  let companies = null;
  const t0 = Date.now();
  try {
    companies = await listCompanies(ctx);
    add('Tally gateway', PASS, `${ctx.transport.url} answered in ${Date.now() - t0} ms`);
  } catch (err) {
    add('Tally gateway', FAIL, err.message, err.hint);
    return summarise(checks);
  }

  if (!companies.length) {
    add('Companies', FAIL, 'Tally answered but no company is open.', 'Open the company in Tally (F3 / Alt+F3: Select Company).');
    return summarise(checks);
  }
  const active = companies.find((c) => c.active);
  add('Companies', PASS, `${companies.length} open: ${companies.map((c) => c.name + (c.active ? ' (active)' : '')).join(', ')}`);
  if (p.company) {
    const hit = companies.find((c) => norm(c.name) === norm(p.company));
    if (!hit) add('Target company', FAIL, `"${p.company}" is not open.`, 'Open it in Tally or fix "company" in the profile.');
    else if (p.companyGuid && hit.guid && p.companyGuid !== hit.guid) add('Target company', FAIL, `"${hit.name}" is open but its id differs from the one pinned in the profile.`, 'A different data folder or a restored copy may be open. Re-run "tally init" if this is intended.');
    else add('Target company', PASS, `"${hit.name}"${hit.active ? '' : ' (open, not active: requests name it explicitly)'}`);
  } else if (companies.length > 1) add('Target company', WARN, `no company set; requests go to the active one ("${active?.name}")`, 'Set "company" in the profile so a different active company never receives data.');
  else add('Target company', PASS, `"${companies[0].name}" (only open company)`);

  // Encoding round trip
  try {
    const sample = 'Rs ₹ नमस्ते ગુજરાતી';
    const rows = await ctx.client.rows({ collection: { type: 'Company', filters: ['$$IsEqual:$Name:##SVCurrentCompany'] }, fields: [{ key: 'v', expr: `"${sample}"` }] }, { company: null });
    if (rows[0]?.v === sample) add('Unicode', PASS, 'rupee sign and Indian scripts survive the round trip');
    else add('Unicode', WARN, `sent "${sample}", got "${rows[0]?.v}"`, 'Try --encoding utf16 (default) or utf8 and compare.');
  } catch (err) {
    add('Unicode', WARN, `check failed: ${err.message}`);
  }

  // Inline report support (everything curated depends on it)
  try {
    const rows = await ctx.client.rows({ collection: { type: 'Ledger' }, fields: [{ key: 'name', method: 'Name' }] });
    add('Inline reports', PASS, `ledger list via inline TDL: ${rows.length} ledgers`);
  } catch (err) {
    add('Inline reports', FAIL, err.message, 'Curated reads need inline TDL reports. Send the output of "tally doctor --verbose" and the files from --record <folder> to your integrator.');
  }

  const lic = await probeLicence(ctx);
  add('Tally product', lic.product ? PASS : WARN, lic.product ? `${lic.product}${lic.edition ? ', ' + lic.edition : ''}${lic.serialNumber ? ', serial ' + lic.serialNumber : ''}` : 'could not read version details');
  if (lic.educationalMode) add('Licence mode', WARN, 'Educational mode', 'Vouchers can only be dated the 1st, 2nd or last day of a month, and reports are limited. Fine for rehearsals.');
  const period = await booksPeriod(ctx);
  if (period.from) add('Books period', PASS, `${fromTally(period.from)} to ${fromTally(period.to)}`);

  // Network exposure of Tally's own port (it has no password)
  if (network && ctx.transport.name === 'http') {
    try {
      const port = Number(new URL(ctx.transport.url).port || 9000);
      const exposed = [];
      for (const list of Object.values(os.networkInterfaces())) {
        for (const a of list || []) {
          if (a.internal || a.family !== 'IPv4') continue;
          if (await tcpProbe(a.address, port)) exposed.push(a.address);
        }
      }
      if (exposed.length) add('Network exposure', WARN, `Tally's port ${port} is reachable on ${exposed.join(', ')}`, 'Anyone on this network can read and write the books through it (it has no password). Block the port in Windows Firewall for other machines, and use "tally serve" (token protected) for remote access.');
      else add('Network exposure', PASS, `port ${port} is not reachable from other network addresses of this PC`);
    } catch {
      /* ignore */
    }
  }
  return summarise(checks);
}

function summarise(checks) {
  const fails = checks.filter((c) => c.status === FAIL).length;
  const warns = checks.filter((c) => c.status === WARN).length;
  return { healthy: fails === 0, fails, warnings: warns, checks };
}
