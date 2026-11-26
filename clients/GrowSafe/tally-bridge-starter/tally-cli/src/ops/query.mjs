/**
 * Escape hatches: anything Tally's gateway supports that has no curated command.
 */
import { defineOp } from './registry.mjs';
import { exportCollection, commonVars } from '../core/envelope.mjs';
import { parseXml, nodeToJson, findFirst, elementChildren, prettyXml, el, tag } from '../core/xml.mjs';
import { checkExportReply, parseImportReply } from '../core/client.mjs';
import { TallyCliError } from '../core/errors.mjs';
import { tdlString } from '../core/tdl.mjs';
import { readText } from '../core/textio.mjs';

function parseTdlNodes(text) {
  if (!text) return [];
  const root = parseXml(`<X>${text}</X>`);
  return elementChildren(root);
}

defineOp({
  id: 'query.collection',
  kind: 'read',
  summary: 'Run an ad-hoc collection query: any object type, chosen fields, filters, period.',
  description:
    'Builds an inline report over a Tally collection and returns one row per object. Fields are Tally method names (Name, Parent, ClosingBalance, ...) optionally with a type suffix: "ClosingBalance:amount", "Date:date", "IsOptional:logical", "ActualQty:qty". Use --route to descend into sub-collections, e.g. --type Voucher --route AllLedgerEntries,BillAllocations.',
  input: {
    properties: {
      type: { type: 'string', description: 'Collection type: Ledger, Group, StockItem, Voucher, Bill, Company, CostCentre, Godown, ...' },
      fields: { type: 'array', items: { type: 'string' }, default: ['Name'], description: 'Method names, optionally "Method:type" (text|amount|date|logical|number|qty|rate|parent), or "key=formula:type".' },
      filter: { type: 'array', items: { type: 'string' }, description: 'TDL filter formulas (all must be true).' },
      route: { type: 'array', items: { type: 'string' }, description: 'Sub-collection path, e.g. AllLedgerEntries,BillAllocations.' },
      childOf: { type: 'string', description: 'Only direct children of this group/parent.' },
      belongsTo: { type: 'boolean', description: 'With childOf: include all descendants.' },
      from: { type: 'date' },
      to: { type: 'date' },
      limit: { type: 'integer', minimum: 1 },
    },
    required: ['type'],
  },
  positional: ['type'],
  examples: ['query collection Ledger --fields Name,Parent,ClosingBalance:amount --child-of "Bank Accounts"', 'query collection Voucher --fields Date:date,VoucherNumber,Narration --from 2026-04-01 --to 2026-04-30 --filter "$$IsEqual:$VoucherTypeName:\\"Sales\\""'],
  tier: 'hatch',
  run: async (ctx, i) => {
    const fields = i.fields.map((f, idx) => {
      const m = /^([A-Za-z_][\w]*)=(.+?)(?::(text|amount|date|logical|number|qty|rate|parent))?$/.exec(f);
      if (m) return { key: m[1], expr: m[2], type: m[3] || 'text' };
      const [method, type = 'text'] = f.split(':');
      return { key: method || `f${idx + 1}`, method, type };
    });
    const rows = await ctx.client.rows({ collection: { type: i.type, route: i.route || [], filters: i.filter || [], childOf: i.childOf, belongsTo: i.belongsTo }, fields }, { from: i.from, to: i.to });
    return i.limit ? rows.slice(0, i.limit) : rows;
  },
});

defineOp({
  id: 'query.native',
  kind: 'read',
  summary: 'Export a collection in Tally\'s native XML (as JSON), e.g. full vouchers or masters with all fields.',
  input: {
    properties: {
      type: { type: 'string', description: 'Collection type (Voucher, Ledger, ...).' },
      fetch: { type: 'array', items: { type: 'string' }, default: ['*'], description: 'Methods to fetch; "*" for all native fields.' },
      filter: { type: 'array', items: { type: 'string' } },
      from: { type: 'date' },
      to: { type: 'date' },
      xml: { type: 'boolean', description: 'Return the raw XML text instead of JSON.' },
    },
    required: ['type'],
  },
  positional: ['type'],
  examples: ['query native Voucher --from 2026-04-01 --to 2026-04-01 --filter "$$IsEqual:$VoucherTypeName:\\"Sales\\""'],
  tier: 'hatch',
  run: async (ctx, i) => {
    const filters = i.filter || [];
    const tdl = [
      el('COLLECTION', { NAME: 'TCNative', ISINITIALIZE: 'Yes' }, tag('TYPE', i.type), i.fetch.map((f) => tag('NATIVEMETHOD', f)), filters.length ? tag('FILTER', filters.map((_, k) => `TCNF${k + 1}`).join(',')) : null),
      ...filters.map((f, k) => el('SYSTEM', { TYPE: 'Formulae', NAME: `TCNF${k + 1}` }, f)),
    ];
    const xml = exportCollection({ id: 'TCNative', vars: commonVars({ company: ctx.profile.company, from: i.from, to: i.to }), tdl });
    const reply = await ctx.client.sendRaw(xml);
    const root = parseXml(reply.text);
    checkExportReply(root);
    if (i.xml) return { __raw: prettyXml(reply.text), xml: reply.text };
    const coll = findFirst(root, 'COLLECTION') || findFirst(root, 'DATA') || root;
    return elementChildren(coll).map((n) => ({ type: n.name, ...nodeToJson(n) }));
  },
});

defineOp({
  id: 'query.object',
  kind: 'read',
  summary: 'Export one object by type and identifier (Name by default).',
  input: {
    properties: {
      type: { type: 'string', description: 'Object type, e.g. Ledger, StockItem, Group, Voucher.' },
      id: { type: 'string', description: 'Identifier value.' },
      idType: { type: 'string', default: 'Name', description: 'Identifier type: Name, MasterID, GUID.' },
      fetch: { type: 'array', items: { type: 'string' } },
    },
    required: ['type', 'id'],
  },
  positional: ['type', 'id'],
  examples: ['query object Ledger "Cash" --fetch Name,ClosingBalance'],
  tier: 'hatch',
  run: async (ctx, i) => nodeToJson(await ctx.client.object(i.type, i.id, { idType: i.idType, fetch: i.fetch || [] })),
});

defineOp({
  id: 'query.function',
  kind: 'read',
  summary: 'Evaluate a TDL function ($$Name) with parameters and return its result.',
  input: { properties: { name: { type: 'string', description: 'Function, e.g. $$SystemPeriodFrom or $$NumStockItems.' }, params: { type: 'array', items: { type: 'string' } } }, required: ['name'] },
  positional: ['name'],
  examples: ['query function $$SystemPeriodTo', 'query function $$NumStockItems'],
  tier: 'hatch',
  remote: false,
  run: async (ctx, i) => ({ function: i.name, result: await ctx.client.func(i.name, i.params || []) }),
});

defineOp({
  id: 'query.formula',
  kind: 'read',
  summary: 'Evaluate any TDL formula for one object (or the company), e.g. a computed balance.',
  input: {
    properties: {
      formula: { type: 'string', description: 'TDL formula, e.g. $ClosingBalance:Ledger:"Cash".' },
      type: { type: 'string', default: 'Company', description: 'Collection type to evaluate in.' },
      name: { type: 'string', description: 'Object name (default: the active company).' },
      as: { type: 'string', enum: ['text', 'amount', 'date', 'logical', 'number', 'qty', 'rate'], default: 'text' },
      to: { type: 'date', description: 'As-of date for balances.' },
    },
    required: ['formula'],
  },
  positional: ['formula'],
  examples: ['query formula "$ClosingBalance:Ledger:\\"Cash\\"" --as amount'],
  tier: 'hatch',
  run: async (ctx, i) => {
    const filters = i.name ? [`$$IsEqual:$Name:${tdlString(i.name)}`] : i.type === 'Company' ? ['$$IsEqual:$Name:##SVCurrentCompany'] : [];
    const rows = await ctx.client.rows({ collection: { type: i.type, filters }, fields: [{ key: 'value', expr: i.formula, type: i.as }] }, { to: i.to, company: i.type === 'Company' ? null : undefined });
    return { formula: i.formula, value: rows.length ? rows[0].value : null, rows: rows.length };
  },
});

defineOp({
  id: 'report.run',
  kind: 'read',
  summary: 'Export any built-in Tally report by its exact name (raw structure), e.g. "Bills Receivable", "Day Book".',
  input: {
    properties: {
      name: { type: 'string', description: 'Report name as Tally knows it.' },
      from: { type: 'date' },
      to: { type: 'date' },
      vars: { type: 'object', description: 'Extra static variables, e.g. {"LEDGERNAME": "Cash", "EXPLODEFLAG": "Yes"}.' },
      xml: { type: 'boolean', description: 'Return the XML text instead of JSON.' },
    },
    required: ['name'],
  },
  positional: ['name'],
  examples: ['report run "Trial Balance" --to 2026-11-30', 'report run "Ledger Vouchers" --vars \'{"LEDGERNAME":"Cash"}\''],
  tier: 'hatch',
  run: async (ctx, i) => {
    const root = await ctx.client.report(i.name, { from: i.from, to: i.to, vars: i.vars || {} });
    if (i.xml) return { __raw: prettyXml(ctx.client.last.reply), xml: ctx.client.last.reply };
    return { report: i.name, data: nodeToJson(root) };
  },
});

defineOp({
  id: 'raw',
  kind: 'unsafe',
  summary: 'Send any request body (XML, or JSON for TallyPrime 7+) to Tally and return the reply. Command line only.',
  description:
    'For anything not covered by a command. Import and Execute requests are refused unless writes are on (writeMode "on") and --yes is given; they are audited. JSON requests need --header entries (tallyrequest, type, id, version) as documented for TallyPrime 7.',
  input: {
    properties: {
      file: { type: 'string', localPath: true, description: 'File with the request body ("-" for stdin).' },
      body: { type: 'string', description: 'Request body inline (prefer --file).' },
      header: { type: 'array', items: { type: 'string' }, description: 'Extra HTTP headers "Name: value" (repeatable).' },
      contentType: { type: 'string', description: 'Override Content-Type (e.g. application/json).' },
      yes: { type: 'boolean', description: 'Confirm sending an Import/Execute request.' },
      dryRun: { type: 'boolean' },
    },
  },
  positional: ['file'],
  examples: ['raw templates/raw/list-companies.xml', 'raw request.json --content-type application/json --header "tallyrequest: Export" --header "type: Collection" --header "id: List of Ledgers" --header "version: 1"'],
  tier: 'hatch',
  remote: false,
  mcp: false,
  run: async (ctx, i) => {
    const body = i.body ?? (i.file ? await readText(i.file) : null);
    if (!body) throw new TallyCliError('E_INPUT', 'Give a request file (or --body).');
    const headers = {};
    for (const h of i.header || []) {
      const k = h.indexOf(':');
      if (k > 0) headers[h.slice(0, k).trim()] = h.slice(k + 1).trim();
    }
    const isWrite = /<TALLYREQUEST>\s*(Import|Execute|Import Data)/i.test(body) || /^(import|execute)$/i.test(headers.tallyrequest || '');
    if (isWrite) {
      if (i.dryRun) return { dryRun: true, sent: false, write: true, body };
      ctx.policy.assertWritesEnabled('raw');
      if (ctx.profile.writeMode !== 'on' || !i.yes) throw new TallyCliError('E_POLICY', 'raw Import/Execute requests need writeMode "on" and --yes.', { hint: 'Prefer the curated commands, which validate and verify writes.' });
    } else if (i.dryRun) return { dryRun: true, sent: false, write: false, body };
    const reply = await ctx.client.sendRaw(body, { headers, contentType: i.contentType, encoding: i.contentType && /json/i.test(i.contentType) ? 'utf8' : undefined });
    let parsed = null;
    if (isWrite && /^\s*</.test(reply.text)) {
      try {
        parsed = parseImportReply(reply.text);
      } catch {
        parsed = null;
      }
      ctx.audit.append({ op: 'raw', profile: ctx.profileName, company: ctx.profile.company, frontend: ctx.frontend, input: { file: i.file }, outcome: parsed?.ok ? 'ok' : 'unknown', request: body, reply: reply.text });
    }
    return { __raw: reply.text, status: reply.status, bytes: reply.bytes, ms: reply.ms, reply: reply.text, importResult: parsed ? { ...parsed, request: undefined, reply: undefined } : undefined };
  },
});

defineOp({
  id: 'xml.parse',
  kind: 'local',
  summary: 'Parse a Tally XML file into JSON (offline; no Tally needed).',
  input: { properties: { file: { type: 'string', localPath: true } }, required: ['file'] },
  positional: ['file'],
  examples: ['xml parse reply.xml'],
  tier: 'hatch',
  remote: false,
  mcp: false,
  run: async (ctx, i) => nodeToJson(parseXml(await readText(i.file), { allowFragment: true })),
});
