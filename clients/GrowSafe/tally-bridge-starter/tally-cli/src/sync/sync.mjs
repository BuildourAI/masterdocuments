/**
 * Data flowing out of Tally: dataset exports, change detection by alter ids, deletion detection by
 * GUID diff, incremental sync to sinks, and a polling watcher that emits change events.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import http from 'node:http';
import https from 'node:https';
import { TallyCliError } from '../core/errors.mjs';
import { F } from '../core/tdl.mjs';
import { toCsv } from '../cli/output.mjs';
import { MASTER_SPECS } from '../domain/masters.mjs';
import { HEADER_FIELDS, INVENTORY_FIELDS, wholePeriod, voucherTypes, statusOf } from '../domain/vouchers/read.mjs';
import { targetCompany } from '../domain/company.mjs';
import { outstanding, stockSummary, trialBalance } from '../domain/reports.mjs';
import { period } from '../domain/common.mjs';

const ENTRY = [
  { key: 'guid', method: 'Guid' },
  { key: 'date', method: 'Date', type: 'date' },
  { key: 'voucherType', method: 'VoucherTypeName' },
  { key: 'number', method: 'VoucherNumber' },
  { key: 'ledger', method: 'LedgerName' },
  { key: 'amount', method: 'Amount', type: 'amount' },
  { key: 'isParty', method: 'IsPartyLedger', type: 'logical' },
];
const BILL = [
  { key: 'guid', method: 'Guid' },
  { key: 'date', method: 'Date', type: 'date' },
  { key: 'ledger', method: 'LedgerName' },
  { key: 'bill', method: 'Name' },
  { key: 'billType', method: 'BillType' },
  { key: 'amount', method: 'Amount', type: 'amount' },
  { key: 'creditDays', expr: '$$Number:$BillCreditPeriod', type: 'number' },
];
const BANK = [
  { key: 'guid', method: 'Guid' },
  { key: 'date', method: 'Date', type: 'date' },
  { key: 'ledger', method: 'LedgerName' },
  { key: 'transactionType', method: 'TransactionType' },
  { key: 'instrumentNumber', method: 'InstrumentNumber' },
  { key: 'instrumentDate', method: 'InstrumentDate', type: 'date' },
  { key: 'amount', method: 'Amount', type: 'amount' },
  { key: 'bankersDate', method: 'BankersDate', type: 'date' },
];
const COST = [
  { key: 'guid', method: 'Guid' },
  { key: 'date', method: 'Date', type: 'date' },
  { key: 'ledger', method: 'LedgerName' },
  { key: 'category', method: 'Category' },
  { key: 'costCentre', method: 'Name' },
  { key: 'amount', method: 'Amount', type: 'amount' },
];

const MASTER_DATASETS = { ledgers: 'ledger', groups: 'group', items: 'item', 'stock-groups': 'stock-group', 'stock-categories': 'stock-category', units: 'unit', godowns: 'godown', 'cost-centres': 'cost-centre', 'cost-categories': 'cost-category', 'voucher-types': 'voucher-type', currencies: 'currency' };
const VOUCHER_DATASETS = {
  vouchers: { route: [], fields: HEADER_FIELDS },
  entries: { route: ['AllLedgerEntries'], fields: ENTRY },
  inventory: { route: ['AllInventoryEntries'], fields: [{ key: 'date', method: 'Date', type: 'date' }, { key: 'voucherType', method: 'VoucherTypeName' }, { key: 'number', method: 'VoucherNumber' }, ...INVENTORY_FIELDS] },
  bills: { route: ['AllLedgerEntries', 'BillAllocations'], fields: BILL },
  bank: { route: ['AllLedgerEntries', 'BankAllocations'], fields: BANK },
  'cost-allocations': { route: ['AllLedgerEntries', 'CategoryAllocations', 'CostCentreAllocations'], fields: COST },
};
export const DATASETS = [...Object.keys(MASTER_DATASETS), ...Object.keys(VOUCHER_DATASETS), 'receivables', 'payables', 'stock', 'trial-balance'];

/** Flatten typed values (qty/rate objects, sided amounts) for files. */
function flatRow(r) {
  const o = {};
  for (const [k, v] of Object.entries(r)) {
    if (v && typeof v === 'object' && 'qty' in v && 'unit' in v) {
      o[k] = v.qty;
      o[`${k}Unit`] = v.unit;
    } else if (v && typeof v === 'object' && 'rate' in v && 'per' in v) {
      o[k] = v.rate;
      o[`${k}Per`] = v.per;
    } else o[k] = v;
  }
  return o;
}

/**
 * Export a dataset. Voucher datasets are read month by month.
 * @returns {Promise<{dataset: string, rows: object[], period?: object}>}
 */
export async function exportDataset(ctx, dataset, input) {
  if (MASTER_DATASETS[dataset]) {
    const spec = MASTER_SPECS[MASTER_DATASETS[dataset]];
    const filters = input.sinceAlterId ? [F.alterIdAbove(input.sinceAlterId)] : [];
    const rows = await ctx.client.rows({ collection: { type: spec.tally, filters }, fields: spec.fields }, { to: input.to });
    return { dataset, rows: input.raw ? rows.map(flatRow) : rows.map(spec.shape) };
  }
  if (VOUCHER_DATASETS[dataset]) {
    const d = VOUCHER_DATASETS[dataset];
    const p = input.sinceAlterId ? await wholePeriod(ctx) : await period(ctx, input);
    const filters = [];
    if (!input.includeCancelled) filters.push(F.notCancelled());
    if (!input.includeOptional && dataset !== 'vouchers') filters.push(F.notOptional());
    if (input.sinceAlterId) filters.push(F.alterIdAbove(input.sinceAlterId));
    const rows = await ctx.client.rows({ collection: { type: 'Voucher', route: d.route, filters }, fields: d.fields }, { from: p.from, to: p.to, chunk: true, onWindow: input.onWindow });
    const vt = dataset === 'vouchers' ? await voucherTypes(ctx) : null;
    return { dataset, period: p, rows: rows.map((r) => (vt ? { ...flatRow(r), baseType: vt.base(r.voucherType), status: statusOf(r) } : flatRow(r))) };
  }
  if (dataset === 'receivables' || dataset === 'payables') {
    const r = await outstanding(ctx, dataset === 'receivables' ? 'receivable' : 'payable', { asOf: input.to });
    return { dataset, rows: r.bills };
  }
  if (dataset === 'stock') {
    const r = await stockSummary(ctx, input);
    return { dataset, period: r.period, rows: r.rows.map((x) => ({ item: x.item, group: x.group, unit: x.unit, openingQty: x.opening.qty, openingValue: x.opening.value, inwardQty: x.inward.qty, inwardValue: x.inward.value, outwardQty: x.outward.qty, outwardValue: x.outward.value, closingQty: x.closing.qty, closingValue: x.closing.value })) };
  }
  if (dataset === 'trial-balance') {
    const r = await trialBalance(ctx, input);
    return { dataset, period: r.period, rows: r.rows };
  }
  throw new TallyCliError('E_INPUT', `Unknown dataset "${dataset}".`, { hint: `Datasets: ${DATASETS.join(', ')}` });
}

export function formatRows(rows, format) {
  if (format === 'csv') return toCsv(rows);
  if (format === 'ndjson') return rows.map((r) => JSON.stringify(r)).join('\n') + (rows.length ? '\n' : '');
  return JSON.stringify(rows, null, 2) + '\n';
}

// ---------------------------------------------------------------- change detection

export async function companyCounters(ctx) {
  const c = await targetCompany(ctx);
  return { company: c.name, altMstId: c.altMstId, altVchId: c.altVchId };
}

/** Vouchers and masters altered after the given alter ids. */
export async function changesSince(ctx, { altVchId = 0, altMstId = 0, masters = true }) {
  const out = { vouchers: [], masters: [] };
  const p = await wholePeriod(ctx);
  const vt = await voucherTypes(ctx);
  const rows = await ctx.client.rows({ collection: { type: 'Voucher', filters: [F.alterIdAbove(altVchId)] }, fields: HEADER_FIELDS }, { from: p.from, to: p.to, chunk: true });
  out.vouchers = rows.map((h) => ({ masterId: h.masterId, alterId: h.alterId, guid: h.guid, date: h.date, voucherType: h.voucherType, baseType: vt.base(h.voucherType), number: h.number || null, party: h.party || null, status: statusOf(h) }));
  if (masters) {
    for (const [type, spec] of Object.entries(MASTER_SPECS)) {
      if (type === 'currency') continue;
      const m = await ctx.client.rows({ collection: { type: spec.tally, filters: [F.alterIdAbove(altMstId)] }, fields: [{ key: 'name', method: type === 'unit' ? 'Symbol' : 'Name' }, { key: 'alterId', method: 'AlterId', type: 'number' }, { key: 'guid', method: 'Guid' }] });
      for (const r of m) out.masters.push({ type, name: r.name, alterId: r.alterId, guid: r.guid });
    }
  }
  return out;
}

/** GUIDs of all vouchers (and optionally masters) for deletion detection. */
export async function currentGuids(ctx, { masters = true } = {}) {
  const p = await wholePeriod(ctx);
  const v = await ctx.client.rows({ collection: { type: 'Voucher' }, fields: [{ key: 'guid', method: 'Guid' }, { key: 'masterId', method: 'MasterId', type: 'number' }, { key: 'voucherType', method: 'VoucherTypeName' }, { key: 'number', method: 'VoucherNumber' }, { key: 'date', method: 'Date', type: 'date' }] }, { from: p.from, to: p.to, chunk: true });
  const m = [];
  if (masters) {
    for (const [type, spec] of Object.entries(MASTER_SPECS)) {
      if (type === 'currency') continue;
      const rows = await ctx.client.rows({ collection: { type: spec.tally }, fields: [{ key: 'guid', method: 'Guid' }, { key: 'name', method: type === 'unit' ? 'Symbol' : 'Name' }] });
      for (const r of rows) m.push({ type, ...r });
    }
  }
  return { vouchers: v, masters: m };
}

export function diffGuids(prev, cur) {
  const curV = new Set(cur.vouchers.map((x) => x.guid));
  const curM = new Set(cur.masters.map((x) => x.guid));
  return {
    vouchers: (prev?.vouchers || []).filter((x) => !curV.has(x.guid)),
    masters: (prev?.masters || []).filter((x) => !curM.has(x.guid)),
  };
}

// ---------------------------------------------------------------- sinks

/**
 * Deliver events/rows to a sink: "-" (stdout), a file (.ndjson/.json/.csv; appended for ndjson),
 * a directory (one file per dataset/batch), or an http(s) URL (POST JSON, HMAC-signed when a secret is given).
 */
export async function deliver(sink, payload, { secret, format, name = 'batch', stdout = process.stdout } = {}) {
  if (!sink || sink === '-') {
    stdout.write(Array.isArray(payload) ? payload.map((p) => JSON.stringify(p)).join('\n') + (payload.length ? '\n' : '') : JSON.stringify(payload) + '\n');
    return { delivered: Array.isArray(payload) ? payload.length : 1, to: 'stdout' };
  }
  if (/^https?:\/\//i.test(sink)) {
    const body = JSON.stringify(payload);
    const ts = String(Math.floor(Date.now() / 1000));
    const headers = { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), 'X-Tally-Timestamp': ts };
    if (secret) headers['X-Tally-Signature'] = `sha256=${crypto.createHmac('sha256', secret).update(`${ts}.${body}`).digest('hex')}`;
    const res = await post(sink, body, headers);
    if (res.status < 200 || res.status >= 300) throw new TallyCliError('E_CONNECT', `Sink ${sink} answered HTTP ${res.status}.`, { details: res.text.slice(0, 300) });
    return { delivered: Array.isArray(payload) ? payload.length : 1, to: sink };
  }
  const isDir = sink.endsWith('/') || sink.endsWith('\\') || (fs.existsSync(sink) && fs.statSync(sink).isDirectory());
  const rows = Array.isArray(payload) ? payload : [payload];
  if (isDir) {
    fs.mkdirSync(sink, { recursive: true });
    const ext = format || 'ndjson';
    const f = path.join(sink, `${name}.${ext}`);
    fs.writeFileSync(f, formatRows(rows, ext));
    return { delivered: rows.length, to: f };
  }
  fs.mkdirSync(path.dirname(path.resolve(sink)), { recursive: true });
  const ext = format || (sink.endsWith('.csv') ? 'csv' : sink.endsWith('.json') ? 'json' : 'ndjson');
  if (ext === 'ndjson') fs.appendFileSync(sink, formatRows(rows, 'ndjson'));
  else fs.writeFileSync(sink, formatRows(rows, ext));
  return { delivered: rows.length, to: sink };
}

function post(urlStr, body, headers) {
  const url = new URL(urlStr);
  const lib = url.protocol === 'https:' ? https : http;
  return new Promise((resolve, reject) => {
    const req = lib.request(url, { method: 'POST', headers, timeout: 30000 }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, text: Buffer.concat(chunks).toString('utf8') }));
    });
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', reject);
    req.end(body);
  });
}

// ---------------------------------------------------------------- incremental sync

const SYNC_FILE = 'sync.json';

export function syncState(ctx) {
  return ctx.state.read(SYNC_FILE, {})[ctx.scope] || null;
}

export function saveSyncState(ctx, value) {
  ctx.state.update(SYNC_FILE, (all) => {
    if (value === null) delete all[ctx.scope];
    else all[ctx.scope] = value;
    return all;
  });
}

/**
 * One sync pass: send everything changed since the stored cursor (full export on first run) to the sink.
 * The cursor moves only after every batch was delivered.
 */
export async function syncOnce(ctx, input) {
  const cur = await companyCounters(ctx);
  const prev = syncState(ctx);
  const first = !prev;
  const datasets = input.datasets && input.datasets.length ? input.datasets : ['ledgers', 'groups', 'items', 'vouchers', 'entries', 'inventory', 'bills'];
  const summary = { first, from: prev ? { altMstId: prev.altMstId, altVchId: prev.altVchId } : null, to: { altMstId: cur.altMstId, altVchId: cur.altVchId }, batches: [] };
  if (prev && prev.altMstId === cur.altMstId && prev.altVchId === cur.altVchId && !input.detectDeletions) {
    summary.unchanged = true;
    return summary;
  }
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  for (const ds of datasets) {
    const isMaster = !!MASTER_DATASETS[ds];
    const since = first ? 0 : isMaster ? prev.altMstId : prev.altVchId;
    if (!first && (isMaster ? since === cur.altMstId : since === cur.altVchId) && !['receivables', 'payables', 'stock', 'trial-balance'].includes(ds)) continue;
    const opts = first ? { from: input.from, to: input.to, fy: input.fy } : { sinceAlterId: since };
    if (['receivables', 'payables', 'stock', 'trial-balance'].includes(ds)) delete opts.sinceAlterId;
    const r = await exportDataset(ctx, ds, { ...opts, includeOptional: true, includeCancelled: !first });
    if (!r.rows.length) continue;
    const res = await deliver(input.sink, input.sink && /^https?:/i.test(input.sink) ? { dataset: ds, company: cur.company, incremental: !first, rows: r.rows } : r.rows, { secret: input.secret, format: input.format, name: `${ds}-${stamp}`, stdout: input.stdout });
    summary.batches.push({ dataset: ds, rows: r.rows.length, to: res.to });
  }
  if (input.detectDeletions) {
    const guids = await currentGuids(ctx);
    const snapFile = `guids-${crypto.createHash('sha1').update(ctx.scope).digest('hex').slice(0, 10)}.json`;
    const snapshot = ctx.state.read(snapFile, null);
    if (snapshot) {
      const gone = diffGuids(snapshot, guids);
      if (gone.vouchers.length || gone.masters.length) {
        const events = [...gone.vouchers.map((v) => ({ type: 'voucher.deleted', ...v })), ...gone.masters.map((m) => ({ type: 'master.deleted', ...m }))];
        const res = await deliver(input.sink, input.sink && /^https?:/i.test(input.sink) ? { dataset: 'deletions', company: cur.company, rows: events } : events, { secret: input.secret, format: input.format, name: `deletions-${stamp}`, stdout: input.stdout });
        summary.batches.push({ dataset: 'deletions', rows: events.length, to: res.to });
      }
    }
    ctx.state.write(snapFile, guids);
  }
  saveSyncState(ctx, { altMstId: cur.altMstId, altVchId: cur.altVchId, at: new Date().toISOString(), company: cur.company });
  return summary;
}

/**
 * Poll for changes and emit events until stopped.
 * Events: {type: "voucher.changed"|"master.changed"|"voucher.deleted"|"master.deleted", at, ...details}
 */
export async function watchLoop(ctx, input, { log, signal, onEvent }) {
  const file = 'watch.json';
  const load = () => ctx.state.read(file, {})[ctx.scope] || null;
  const save = (v) =>
    ctx.state.update(file, (all) => {
      all[ctx.scope] = v;
      return all;
    });
  let cursor = load();
  if (!cursor || input.fromNow) {
    const c = await companyCounters(ctx);
    cursor = { altMstId: c.altMstId, altVchId: c.altVchId };
    save(cursor);
    log(`watch: starting from alter ids masters=${cursor.altMstId} vouchers=${cursor.altVchId}`);
  }
  const intervalMs = Math.max(2, input.interval || 30) * 1000;
  let guidSnapshot = input.detectDeletions ? await currentGuids(ctx, { masters: true }) : null;
  for (;;) {
    if (signal?.aborted) return cursor;
    try {
      ctx.cache.clear();
      const c = await companyCounters(ctx);
      if (c.altMstId !== cursor.altMstId || c.altVchId !== cursor.altVchId) {
        const ch = await changesSince(ctx, { altVchId: cursor.altVchId, altMstId: cursor.altMstId, masters: c.altMstId !== cursor.altMstId });
        const at = new Date().toISOString();
        const events = [...ch.vouchers.map((v) => ({ type: 'voucher.changed', at, company: c.company, ...v })), ...ch.masters.map((m) => ({ type: 'master.changed', at, company: c.company, ...m }))];
        if (guidSnapshot) {
          const now = await currentGuids(ctx);
          const gone = diffGuids(guidSnapshot, now);
          events.push(...gone.vouchers.map((v) => ({ type: 'voucher.deleted', at, company: c.company, ...v })), ...gone.masters.map((m) => ({ type: 'master.deleted', at, company: c.company, ...m })));
          guidSnapshot = now;
        }
        if (events.length) await onEvent(events);
        cursor = { altMstId: c.altMstId, altVchId: c.altVchId };
        save(cursor);
      }
    } catch (err) {
      log(`watch: ${err.code || ''} ${err.message}`);
    }
    if (input.once) return cursor;
    await new Promise((r) => {
      const t = setTimeout(r, intervalMs);
      signal?.addEventListener?.('abort', () => {
        clearTimeout(t);
        r();
      });
    });
  }
}
