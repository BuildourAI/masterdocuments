/**
 * Setup and administration: init, selftest, tokens, audit, integration snippets, bank reconciliation.
 */
import crypto from 'node:crypto';
import path from 'node:path';
import os from 'node:os';
import { defineOp, DESTRUCTIVE_PARAMS, PERIOD_PARAMS } from './registry.mjs';
import { createContext } from './context.mjs';
import { saveConfig, readConfigFile, TOOL_ROOT, WRITE_MODES } from '../core/config.mjs';
import { TallyCliError } from '../core/errors.mjs';
import { listCompanies } from '../domain/company.mjs';
import { runSelftest } from '../domain/selftest.mjs';
import { unreconciled, matchStatement, setBankDate, bankEntries } from '../domain/bank.mjs';
import { readText } from '../core/textio.mjs';
import { norm } from '../domain/common.mjs';
import { postVoucher } from '../domain/vouchers/post.mjs';

defineOp({
  id: 'init',
  kind: 'local',
  summary: 'Create or update a profile in tally.config.json: connect, pick the company, detect GST and bank ledgers, choose the write mode.',
  description:
    'Non-interactive: everything can be given as flags, which is how an AI agent should run it. Writes stay off unless --write-mode is given. The company id is pinned so a different company with the same name is never written to by mistake.',
  input: {
    properties: {
      url: { type: 'string', description: 'Tally gateway URL (default http://127.0.0.1:9000).' },
      company: { type: 'string', description: 'Company to target (default: the only / active open company).' },
      profile: { type: 'string', default: 'default', description: 'Profile name to create or update.' },
      writeMode: { type: 'string', enum: WRITE_MODES, default: 'off', description: 'off = read only; optional = vouchers land as optional for review; on = full writes.' },
      allowDestructive: { type: 'boolean', default: false, description: 'Allow alter, cancel and delete (still needs --yes each time).' },
      allowMasterWrites: { type: 'boolean', description: 'Allow creating/changing ledgers and items (default: true when write mode is on).' },
      companyState: { type: 'string', description: 'Company GST state (default: read from Tally).' },
      configPath: { type: 'string', description: 'Where to write the config (default: tally.config.json next to the tool).' },
      makeDefault: { type: 'boolean', default: true },
      force: { type: 'boolean', description: 'Overwrite an existing profile of the same name.' },
    },
  },
  examples: ['init --company "Sample Traders Pvt Ltd"', 'init --url http://127.0.0.1:9000 --profile main --write-mode optional', 'init --url sim:demo.json --profile demo --write-mode on --allow-destructive'],
  mcp: false,
  remote: false,
  run: async (ctx, i) => {
    const file = path.resolve(i.configPath || (ctx.config.exists ? ctx.config.file : path.join(TOOL_ROOT, 'tally.config.json')));
    const raw = readConfigFile(file) || {};
    raw.profiles = raw.profiles || {};
    if (raw.profiles[i.profile] && !i.force) {
      const existing = raw.profiles[i.profile];
      if (i.writeMode !== (existing.writeMode || 'off') || i.url || i.company) {
        throw new TallyCliError('E_CONFLICT', `Profile "${i.profile}" already exists in ${file}.`, { hint: 'Add --force to overwrite it, or choose another --profile name.' });
      }
    }
    const url = i.url || raw.profiles[i.profile]?.url || 'http://127.0.0.1:9000';
    const probe = createContext({ frontend: 'cli', overrides: { url, company: null }, configPath: file, profile: Object.keys(raw.profiles).length && raw.profiles[i.profile] ? i.profile : undefined, log: ctx.log });
    probe.profile.company = null;
    let companies;
    try {
      companies = await listCompanies(probe);
    } catch (err) {
      throw new TallyCliError(err.code || 'E_CONNECT', `Cannot read companies from ${url}: ${err.message}`, { hint: err.hint });
    }
    if (!companies.length) throw new TallyCliError('E_TALLY', 'No company is open in Tally.', { hint: 'Open the company in Tally, then run init again.' });
    let company;
    if (i.company) {
      company = companies.find((c) => norm(c.name) === norm(i.company));
      if (!company) throw new TallyCliError('E_NOT_FOUND', `Company "${i.company}" is not open.`, { hint: `Open: ${companies.map((c) => c.name).join(', ')}` });
    } else if (companies.length === 1) company = companies[0];
    else throw new TallyCliError('E_INPUT', `Several companies are open: ${companies.map((c) => c.name).join(', ')}.`, { hint: 'Pass --company "<name>".' });

    probe.profile.company = company.name;
    const ledgers = await probe.client.rows({ collection: { type: 'Ledger' }, fields: [{ key: 'name', method: 'Name' }, { key: 'parent', method: 'Parent' }, { key: 'head', method: 'GSTDutyHead' }, { key: 'pg', method: '_PrimaryGroup' }] });
    const find = (re, extra = () => true) => ledgers.find((l) => re.test(l.name) && extra(l))?.name || null;
    const isTax = (l) => /duties/i.test(String(l.pg)) || !!l.head;
    const tax = (dir, head, re) => find(new RegExp(`(${dir}).*(${re})|(${re}).*(${dir})`, 'i'), isTax) || null;
    const gstLedgers = {
      output: { cgst: tax('output|sales', 'cgst', 'cgst|central'), sgst: tax('output|sales', 'sgst', 'sgst|utgst|state'), igst: tax('output|sales', 'igst', 'igst|integrated') },
      input: { cgst: tax('input|purchase', 'cgst', 'cgst|central'), sgst: tax('input|purchase', 'sgst', 'sgst|utgst|state'), igst: tax('input|purchase', 'igst', 'igst|integrated') },
    };
    if (!gstLedgers.output.cgst && !gstLedgers.input.cgst) {
      const generic = { cgst: find(/\bcgst\b|central tax/i, isTax), sgst: find(/\b(sgst|utgst)\b|state tax/i, isTax), igst: find(/\bigst\b|integrated tax/i, isTax) };
      gstLedgers.output = generic;
      gstLedgers.input = generic;
    }
    const banks = ledgers.filter((l) => /^bank accounts$/i.test(String(l.pg).trim()));
    const profile = {
      ...(raw.profiles[i.profile] || {}),
      url,
      company: company.name,
      companyGuid: company.guid || null,
      writeMode: i.writeMode,
      allowDestructive: !!i.allowDestructive,
      ...(i.allowMasterWrites !== undefined ? { allowMasterWrites: i.allowMasterWrites } : {}),
      gst: { companyState: i.companyState || company.state || null, ledgers: gstLedgers },
      roundOffLedger: find(/round/i),
      defaultBankLedger: banks.length === 1 ? banks[0].name : raw.profiles[i.profile]?.defaultBankLedger || null,
    };
    raw.profiles[i.profile] = profile;
    if (i.makeDefault || !raw.defaultProfile) raw.defaultProfile = i.profile;
    saveConfig(file, raw);
    const missing = [];
    if (!profile.gst.companyState) missing.push('gst.companyState (needed for automatic GST)');
    if (!profile.roundOffLedger) missing.push('roundOffLedger');
    if (!profile.defaultBankLedger) missing.push(`defaultBankLedger (${banks.length} bank ledgers: ${banks.map((b) => b.name).join(', ') || 'none'})`);
    return {
      file,
      profile: i.profile,
      settings: profile,
      openCompanies: companies.map((c) => c.name),
      fillInByHand: missing,
      next: ['tally doctor', 'tally selftest', i.writeMode === 'off' ? 'Writes are off. When ready: tally init --profile ' + i.profile + ' --write-mode optional --force' : 'tally selftest --write --confirm-company "<test company>" (on a test company)'],
    };
  },
});

defineOp({
  id: 'selftest',
  kind: 'read',
  summary: 'Probe this Tally for every behaviour the tool relies on, save the results, print a report. --write adds write tests (test company only).',
  input: {
    properties: {
      write: { type: 'boolean', description: 'Also run write tests (creates and removes test records).' },
      confirmCompany: { type: 'string', description: 'Required with --write: the target company name, typed out.' },
      noSave: { type: 'boolean', description: 'Do not store the results.' },
    },
  },
  examples: ['selftest', 'selftest --write --confirm-company "Test Company"'],
  mcp: false,
  remote: false,
  run: (ctx, i) => {
    if (i.write && ctx.frontend !== 'cli') throw new TallyCliError('E_POLICY', 'selftest --write is only available on the command line.');
    return runSelftest(ctx, i);
  },
});

// ---------- tokens for the HTTP API ----------

function updateRaw(ctx, fn) {
  const raw = readConfigFile(ctx.config.file) || {};
  fn(raw);
  saveConfig(ctx.config.file, raw);
  return raw;
}

defineOp({
  id: 'token.create',
  kind: 'local',
  summary: 'Create an access token for the local HTTP API (shown once; only its hash is stored).',
  input: { properties: { name: { type: 'string', description: 'Who uses it, e.g. "n8n".' }, scope: { type: 'string', enum: ['read', 'write', 'destructive'], default: 'read' } }, required: ['name'] },
  positional: ['name'],
  examples: ['token create n8n --scope read', 'token create backoffice --scope write'],
  mcp: false,
  remote: false,
  run: async (ctx, i) => {
    const token = `tc_${crypto.randomBytes(24).toString('base64url')}`;
    const id = crypto.randomBytes(4).toString('hex');
    updateRaw(ctx, (raw) => {
      raw.http = raw.http || {};
      raw.http.tokens = raw.http.tokens || [];
      raw.http.tokens.push({ id, name: i.name, scope: i.scope, hash: crypto.createHash('sha256').update(token).digest('hex'), createdAt: new Date().toISOString() });
    });
    return { id, name: i.name, scope: i.scope, token, note: 'Copy the token now; it is not shown again. Send it as "Authorization: Bearer <token>".' };
  },
});

defineOp({
  id: 'token.list',
  kind: 'local',
  summary: 'List HTTP API tokens (without the secrets).',
  mcp: false,
  remote: false,
  run: async (ctx) => (ctx.config.http.tokens || []).map((t) => ({ id: t.id, name: t.name, scope: t.scope, createdAt: t.createdAt })),
});

defineOp({
  id: 'token.revoke',
  kind: 'local',
  summary: 'Revoke an HTTP API token by id or name.',
  input: { properties: { id: { type: 'string' } }, required: ['id'] },
  positional: ['id'],
  mcp: false,
  remote: false,
  run: async (ctx, i) => {
    let removed = 0;
    updateRaw(ctx, (raw) => {
      const before = (raw.http?.tokens || []).length;
      raw.http.tokens = (raw.http?.tokens || []).filter((t) => t.id !== i.id && t.name !== i.id);
      removed = before - raw.http.tokens.length;
    });
    return { removed };
  },
});

// ---------- audit ----------

defineOp({
  id: 'audit.list',
  kind: 'local',
  summary: 'Recent writes from the audit log (who, what, outcome, Tally ids).',
  input: { properties: { limit: { type: 'integer', default: 20, minimum: 1 }, op: { type: 'string', description: 'Only this operation (prefix match).' }, outcome: { type: 'string', enum: ['ok', 'rejected', 'error', 'unknown'] } } },
  examples: ['audit list', 'audit list --op voucher --limit 50'],
  run: async (ctx, i) => {
    let recs = ctx.audit.all();
    if (i.op) recs = recs.filter((r) => String(r.op || '').startsWith(i.op));
    if (i.outcome) recs = recs.filter((r) => r.outcome === i.outcome);
    return recs.slice(-i.limit).map((r) => ({ seq: r.seq, at: r.at, op: r.op, frontend: r.frontend, profile: r.profile, company: r.company, outcome: r.outcome, created: r.result?.created, altered: r.result?.altered, deleted: r.result?.deleted, cancelled: r.result?.cancelled, lastVchId: r.result?.lastVchId || null, error: r.error?.message || r.result?.lineErrors?.[0] || null }));
  },
});

defineOp({
  id: 'audit.show',
  kind: 'local',
  summary: 'Full audit record: input, request XML, Tally reply, before-image.',
  input: { properties: { seq: { type: 'integer' } }, required: ['seq'] },
  positional: ['seq'],
  run: async (ctx, i) => {
    const r = ctx.audit.all().find((x) => x.seq === i.seq);
    if (!r) throw new TallyCliError('E_NOT_FOUND', `No audit record ${i.seq}.`);
    return r;
  },
});

defineOp({
  id: 'audit.verify',
  kind: 'local',
  summary: 'Check that the audit log has not been edited (hash chain).',
  run: async (ctx) => ctx.audit.verify(),
});

// ---------- integration snippets ----------

defineOp({
  id: 'integrate',
  kind: 'local',
  summary: 'Print ready-to-paste settings for Claude Desktop, Claude Code, HTTP clients (n8n, Make, backends) and the relay.',
  input: { properties: { target: { type: 'string', enum: ['all', 'claude-desktop', 'claude-code', 'http', 'relay'], default: 'all' }, profile: { type: 'string', description: 'Profile the tool server should use.' } } },
  examples: ['integrate --target claude-desktop', 'integrate --target http'],
  mcp: false,
  remote: false,
  run: async (ctx, i) => {
    const bin = path.join(TOOL_ROOT, 'bin', 'tally.mjs');
    const node = process.execPath;
    const prof = i.profile || ctx.profileName;
    const args = [bin, 'mcp', '--profile', prof];
    if (ctx.config.exists) args.push('--config', ctx.config.file);
    const desktopPath = process.platform === 'win32' ? path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), 'Claude', 'claude_desktop_config.json') : process.platform === 'darwin' ? path.join(os.homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json') : path.join(os.homedir(), '.config', 'Claude', 'claude_desktop_config.json');
    const q = (s) => (/[\s"]/.test(s) ? `"${s.replace(/"/g, '\\"')}"` : s);
    const out = {};
    if (i.target === 'all' || i.target === 'claude-desktop') out.claudeDesktop = { file: desktopPath, merge: { mcpServers: { tally: { command: node, args } } }, note: 'Add the "tally" entry under "mcpServers" in that file, then restart Claude Desktop.' };
    if (i.target === 'all' || i.target === 'claude-code') out.claudeCode = { command: `claude mcp add tally --scope user -- ${[node, ...args].map(q).join(' ')}`, note: 'Run once in a terminal; "claude mcp list" shows it.' };
    if (i.target === 'all' || i.target === 'http') {
      out.http = {
        start: `node ${q(bin)} serve --profile ${prof}`,
        token: `node ${q(bin)} token create my-app --scope read`,
        example: `curl -s -X POST http://${ctx.config.http.host}:${ctx.config.http.port}/v1/ops/report.receivables -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d "{\\"withContacts\\":true}"`,
        catalogue: `GET http://${ctx.config.http.host}:${ctx.config.http.port}/v1/ops`,
      };
    }
    if (i.target === 'all' || i.target === 'relay') out.relay = { start: `node ${q(bin)} relay --profile ${prof}`, config: { relay: { url: 'https://your-hub.example.com', secret: '<shared secret>', allow: ['report.*', 'ledger.list', 'party.*'] } }, note: 'See docs/INTEGRATION.md for the job format; examples/relay-hub.mjs is a reference hub.' };
    return out;
  },
});

// ---------- bank reconciliation ----------

defineOp({
  id: 'bank.entries',
  kind: 'read',
  summary: 'Bank book lines of a bank ledger with instrument numbers and bank (clearing) dates.',
  input: { properties: { ledger: { type: 'string' }, ...PERIOD_PARAMS }, required: ['ledger'] },
  positional: ['ledger'],
  examples: ['bank entries "Bank of Example - Current A/c" --from 2026-11-01'],
  run: (ctx, i) => bankEntries(ctx, i),
});

defineOp({
  id: 'bank.unreconciled',
  kind: 'read',
  summary: 'Bank book lines not yet reconciled (no bank date).',
  input: { properties: { ledger: { type: 'string' }, ...PERIOD_PARAMS }, required: ['ledger'] },
  positional: ['ledger'],
  examples: ['bank unreconciled "Bank of Example - Current A/c"'],
  run: (ctx, i) => unreconciled(ctx, i),
});

defineOp({
  id: 'bank.match',
  kind: 'read',
  summary: 'Match a bank statement (CSV/JSON) with unreconciled book lines; list unmatched lines with suggested parties.',
  input: {
    properties: {
      ledger: { type: 'string' },
      statement: { type: 'string', localPath: true, description: 'Statement file (CSV with Date, Narration, Ref, Withdrawal, Deposit columns; or JSON lines).' },
      statementText: { type: 'string', description: 'Statement contents inline (for tool calls).' },
      toleranceDays: { type: 'integer', default: 7, minimum: 0 },
      from: { type: 'date' },
      to: { type: 'date' },
    },
    required: ['ledger'],
  },
  positional: ['ledger', 'statement'],
  examples: ['bank match "Bank of Example - Current A/c" statement-nov.csv'],
  run: async (ctx, i) => {
    const text = i.statementText ?? (i.statement ? await readText(i.statement) : null);
    if (!text) throw new TallyCliError('E_INPUT', 'Give a statement file (or statementText).');
    return matchStatement(ctx, i, text);
  },
});

defineOp({
  id: 'bank.set-date',
  kind: 'destructive',
  summary: 'Set the bank (clearing) date on a voucher\'s bank line, i.e. mark it reconciled.',
  input: { properties: { masterId: { type: 'integer' }, bankDate: { type: 'date' }, ledger: { type: 'string', description: 'Bank ledger, if the voucher has several bank lines.' }, ifAlterId: { type: 'integer' }, ...DESTRUCTIVE_PARAMS }, required: ['masterId', 'bankDate'] },
  examples: ['bank set-date --master-id 245 --bank-date 2026-11-25 --yes'],
  run: (ctx, i) => setBankDate(ctx, i),
});

defineOp({
  id: 'bank.post-receipts',
  kind: 'write',
  summary: 'Post receipts (or payments) for statement lines in one go, each with a stable idempotency key.',
  input: {
    properties: {
      ledger: { type: 'string', description: 'Bank ledger.' },
      lines: { type: 'array', description: 'Lines [{date, amount, party, direction: "in"|"out", reference, against?: ["REF"], autoAllocate?: true, onAccount?: true, narration?}].' },
      dryRun: { type: 'boolean' },
      forceResend: { type: 'boolean', description: 'Resend lines whose earlier attempt had an unknown outcome (only after checking Tally).' },
    },
    required: ['ledger', 'lines'],
  },
  inputKey: 'lines',
  examples: ['bank post-receipts --ledger "Bank of Example - Current A/c" --input lines.json --dry-run'],
  run: async (ctx, i) => {
    ctx.policy.checkRunSize(i.lines.length, 'bank.post-receipts');
    const results = [];
    for (const [n, l] of i.lines.entries()) {
      const kind = l.direction === 'out' ? 'payment' : 'receipt';
      try {
        const { getOp } = await import('./registry.mjs');
        const op = getOp(`post.${kind}`);
        const input = { party: l.party, amount: l.amount, bank: i.ledger, date: l.date, reference: l.reference, narration: l.narration || l.description, against: l.against, autoAllocate: l.autoAllocate, onAccount: l.onAccount, mode: l.mode, instrumentNumber: l.reference, idempotencyKey: l.idempotencyKey || `bank:${norm(i.ledger)}:${l.date}:${l.amount}:${l.reference || n}`, forceResend: i.forceResend, dryRun: i.dryRun };
        for (const k of Object.keys(input)) if (input[k] === undefined) delete input[k];
        const { validateInput } = await import('./schema.mjs');
        const r = await op.run(ctx, validateInput(op, input, { fromCli: true }));
        results.push({ line: n + 1, ok: true, party: l.party, amount: l.amount, masterId: r.masterId || null, duplicate: !!r.duplicate, dryRun: !!r.dryRun });
      } catch (err) {
        results.push({ line: n + 1, ok: false, party: l.party, amount: l.amount, error: err.message, hint: err.hint });
      }
    }
    return { posted: results.filter((r) => r.ok && !r.dryRun && !r.duplicate).length, failed: results.filter((r) => !r.ok).length, results };
  },
});

export { postVoucher };
