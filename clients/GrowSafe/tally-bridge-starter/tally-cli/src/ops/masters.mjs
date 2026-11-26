/**
 * Master operations: list / get / search / create / update / ensure / delete for each master type,
 * plus a generic "master" family for any Tally master type not modelled here.
 */
import { defineOp, WRITE_PARAMS, DESTRUCTIVE_PARAMS } from './registry.mjs';
import { MASTER_SPECS, MASTER_INPUTS, listMasters, getMaster, writeMaster, ensureMaster, genericMasterXml } from '../domain/masters.mjs';
import { auditedImport, dryRunResult } from '../domain/common.mjs';
import { importData } from '../core/envelope.mjs';
import { flatReport } from '../core/tdl.mjs';
import { F } from '../core/tdl.mjs';
import { nodeToJson } from '../core/xml.mjs';

const WRITABLE = ['group', 'ledger', 'item', 'stock-group', 'stock-category', 'unit', 'godown', 'cost-centre', 'cost-category'];
const TREE = { ledger: 'group', group: 'group', item: 'stock-group', 'stock-group': 'stock-group', godown: 'godown', 'cost-centre': 'cost-centre', 'stock-category': 'stock-category' };

for (const [type, spec] of Object.entries(MASTER_SPECS)) {
  const label = spec.label.toLowerCase();
  const plural = type === 'currency' ? 'currencies' : `${label}s`;
  const listProps = {
    search: { type: 'string', description: `Text to match against ${label} names${type === 'ledger' ? ', aliases and GSTINs' : ''}.` },
    limit: { type: 'integer', minimum: 1, description: 'Return at most this many rows.' },
  };
  if (TREE[type]) listProps.under = { type: 'string', description: `Only ${plural} under this ${TREE[type] === 'group' ? 'group' : TREE[type].replace('-', ' ')} (any depth).` };
  if (type === 'ledger' || type === 'group' || type === 'item') listProps.asOf = { type: 'date', description: 'Balances as of this date (default: today).' };

  defineOp({
    id: `${type}.list`,
    kind: 'read',
    summary: `List ${plural}${type === 'ledger' ? ' with group, balances, GSTIN and contact details' : ''}.`,
    input: { properties: listProps },
    examples: type === 'ledger' ? ['ledger list --under "Sundry Debtors"', 'ledger list --search hdfc --limit 5'] : [`${type} list`],
    tier: ['ledger', 'item', 'group'].includes(type) ? 'core' : 'extended',
    run: (ctx, i) => listMasters(ctx, type, i),
  });

  defineOp({
    id: `${type}.get`,
    kind: 'read',
    summary: `Get one ${label} by exact name (suggests close matches when not found).`,
    input: {
      properties: {
        name: { type: 'string', description: `${spec.label} name.` },
        asOf: { type: 'date', description: 'Balances as of this date.' },
        native: { type: 'boolean', description: 'Also return the object as Tally exports it (all fields).' },
      },
      required: ['name'],
    },
    positional: ['name'],
    examples: [`${type} get "${type === 'ledger' ? 'Cash' : 'Main Location'}"`],
    tier: ['ledger', 'item'].includes(type) ? 'core' : 'extended',
    run: async (ctx, i) => {
      const rec = await getMaster(ctx, type, i.name, i);
      if (i.native) {
        try {
          const obj = await ctx.client.object(spec.tally, rec.name ?? rec.symbol);
          rec.native = nodeToJson(obj);
        } catch (err) {
          rec.native = null;
          ctx.warn(`Native export failed: ${err.message}`);
        }
      }
      return rec;
    },
  });

  if (['ledger', 'item', 'group'].includes(type)) {
    defineOp({
      id: `${type}.search`,
      kind: 'read',
      summary: `Find ${plural} by partial or misspelt name (use before writing to get exact names).`,
      input: { properties: { query: { type: 'string', description: 'Text to search for.' }, limit: { type: 'integer', default: 10, minimum: 1 } }, required: ['query'] },
      positional: ['query'],
      examples: [`${type} search ${type === 'ledger' ? 'alpha' : type === 'item' ? 'wire' : 'debtors'}`],
      run: async (ctx, i) => {
        const rows = await listMasters(ctx, type, { search: i.query, limit: i.limit });
        return rows.map((r) => ({ name: r.name, group: r.group ?? r.parent ?? null, ...(type === 'ledger' ? { gstin: r.gstin, closingBalance: r.closingBalance } : {}), ...(type === 'item' ? { unit: r.unit, hsn: r.hsn } : {}) }));
      },
    });
  }

  if (!WRITABLE.includes(type)) continue;
  const props = MASTER_INPUTS[type];

  defineOp({
    id: `${type}.create`,
    kind: 'write',
    summary: `Create a ${label}. Fails if it already exists (use ensure for create-if-missing).`,
    input: { properties: { ...props, ...WRITE_PARAMS }, required: ['name'] },
    positional: ['name'],
    inputKey: null,
    examples:
      type === 'ledger'
        ? ['ledger create "New Customer Pvt Ltd" --group "Sundry Debtors" --gstin 27AAAAA0000A1Z5 --state Maharashtra --bill-wise --credit-days 30', 'ledger create --input ledger.json --dry-run']
        : type === 'item'
          ? ['item create "Widget A" --unit Nos --hsn 84719000 --gst-rate 18']
          : [`${type} create "Example"`],
    tier: ['ledger', 'item'].includes(type) ? 'core' : 'extended',
    run: (ctx, i) => writeMaster(ctx, type, 'create', i),
  });

  defineOp({
    id: `${type}.update`,
    kind: 'write',
    summary: `Change fields of an existing ${label} (only the fields given are sent). Use --new-name to rename.`,
    input: { properties: { ...props, newName: { type: 'string', description: 'Rename to this.' }, yes: { type: 'boolean', description: 'Confirm changing an opening balance (also needs allowDestructive).' }, ...WRITE_PARAMS }, required: ['name'] },
    positional: ['name'],
    examples: type === 'ledger' ? ['ledger update "Alpha Hardware Stores" --credit-days 45 --email accounts@alpha.example'] : [`${type} update "Example" --new-name "Example 2"`],
    tier: ['ledger', 'item'].includes(type) ? 'core' : 'extended',
    run: (ctx, i) => writeMaster(ctx, type, 'update', i),
  });

  defineOp({
    id: `${type}.ensure`,
    kind: 'write',
    summary: `Create the ${label} if it does not exist; if it exists, report differences without changing it.`,
    input: { properties: { ...props, ...WRITE_PARAMS }, required: ['name'] },
    positional: ['name'],
    examples: [`${type} ensure "Example"${type === 'ledger' ? ' --group "Sundry Debtors"' : ''}`],
    tier: ['ledger', 'item'].includes(type) ? 'core' : 'extended',
    run: (ctx, i) => ensureMaster(ctx, type, i),
  });

  defineOp({
    id: `${type}.delete`,
    kind: 'destructive',
    summary: `Delete a ${label} (Tally refuses if it is in use).`,
    input: { properties: { name: { type: 'string' }, ...DESTRUCTIVE_PARAMS }, required: ['name'] },
    positional: ['name'],
    examples: [`${type} delete "Example" --yes`],
    tier: 'extended',
    run: (ctx, i) => writeMaster(ctx, type, 'delete', i),
  });
}

// ---------- generic masters (any Tally master type) ----------

defineOp({
  id: 'master.list',
  kind: 'read',
  summary: 'List objects of any Tally master type (e.g. Budget, PriceLevel, AttendanceType, PayHead) with chosen fields.',
  input: {
    properties: {
      type: { type: 'string', description: 'Tally collection type, e.g. "Budget", "Employee", "PayHead", "StockItem".' },
      fields: { type: 'array', items: { type: 'string' }, default: ['Name', 'Parent'], description: 'Tally method names to return.' },
      filter: { type: 'string', description: 'Optional TDL filter formula, e.g. $$IsEqual:$Parent:"Sundry Debtors".' },
      limit: { type: 'integer', minimum: 1 },
    },
    required: ['type'],
  },
  positional: ['type'],
  examples: ['master list Budget', 'master list Ledger --fields Name,Parent,ClosingBalance --filter "$$IsEqual:$Parent:\\"Bank Accounts\\""'],
  tier: 'hatch',
  run: async (ctx, i) => {
    const fields = i.fields.map((f) => ({ key: f, method: f, type: /balance|value|amount/i.test(f) ? 'amount' : /date$/i.test(f) ? 'date' : 'text' }));
    const rows = await ctx.client.rows({ collection: { type: i.type, filters: i.filter ? [i.filter] : [] }, fields });
    return i.limit ? rows.slice(0, i.limit) : rows;
  },
});

defineOp({
  id: 'master.get',
  kind: 'read',
  summary: 'Export any master object exactly as Tally holds it (all fields), by type and name.',
  input: { properties: { type: { type: 'string' }, name: { type: 'string' }, fetch: { type: 'array', items: { type: 'string' } } }, required: ['type', 'name'] },
  positional: ['type', 'name'],
  examples: ['master get Ledger "Cash"'],
  tier: 'hatch',
  run: async (ctx, i) => nodeToJson(await ctx.client.object(i.type, i.name, { fetch: i.fetch || [] })),
});

defineOp({
  id: 'master.upsert',
  kind: 'write',
  summary: 'Create or alter any master type with raw Tally tags (for types without a dedicated command).',
  input: {
    properties: {
      type: { type: 'string', description: 'Tally object tag, e.g. "BUDGET", "PRICELEVEL", "LEDGER".' },
      name: { type: 'string' },
      action: { type: 'string', enum: ['Create', 'Alter'], default: 'Create' },
      newName: { type: 'string' },
      tags: { type: 'object', description: 'Tags to send, e.g. {"PARENT": "Primary"}. Lists: {"ADDRESS.LIST": {"ADDRESS": ["l1", "l2"]}}.' },
      ...WRITE_PARAMS,
    },
    required: ['type', 'name'],
  },
  inputKey: 'tags',
  examples: ['master upsert BUDGET "FY Budget" --input budget-tags.json --dry-run'],
  tier: 'hatch',
  run: async (ctx, i) => {
    if (!i.dryRun) ctx.policy.assertMasterWrites('master.upsert');
    const node = genericMasterXml(i.type, i.action, i.name, i.tags, i.newName);
    if (i.dryRun) return dryRunResult(importData({ id: 'All Masters', vars: { SVCURRENTCOMPANY: ctx.profile.company }, messages: [node] }));
    const r = await auditedImport(ctx, { op: 'master.upsert', id: 'All Masters', messages: [node], input: i, expect: i.action === 'Create' ? 'created' : 'altered' });
    return { type: i.type, name: i.newName || i.name, tally: { created: r.created, altered: r.altered, ignored: r.ignored, combined: r.combined }, auditSeq: r.auditSeq };
  },
});

defineOp({
  id: 'master.delete',
  kind: 'destructive',
  summary: 'Delete any master object by type and name.',
  input: { properties: { type: { type: 'string' }, name: { type: 'string' }, ...DESTRUCTIVE_PARAMS }, required: ['type', 'name'] },
  positional: ['type', 'name'],
  examples: ['master delete BUDGET "Old Budget" --yes'],
  tier: 'hatch',
  run: async (ctx, i) => {
    const node = genericMasterXml(i.type, 'Delete', i.name);
    if (i.dryRun) return dryRunResult(importData({ id: 'All Masters', vars: { SVCURRENTCOMPANY: ctx.profile.company }, messages: [node] }));
    const r = await auditedImport(ctx, { op: 'master.delete', id: 'All Masters', messages: [node], input: i, expect: 'deleted' });
    return { type: i.type, name: i.name, deleted: r.deleted, auditSeq: r.auditSeq };
  },
});

export { flatReport, F };
