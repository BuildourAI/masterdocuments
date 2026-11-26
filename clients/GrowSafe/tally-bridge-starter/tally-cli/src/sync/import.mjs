/**
 * Bulk import of vouchers and masters from JSON, NDJSON or CSV.
 * Without --commit nothing is written: every record is validated and the plan is reported.
 * With --commit each record is posted with an idempotency key, so re-running after a failure resumes
 * safely (records already posted are skipped).
 *
 * CSV needs a mapping (JSON file) in one of two forms:
 *   Row = one operation:  {"op": "post.receipt", "columns": {"party": "Customer", "amount": "Amount", "date": "Date", "against": "Invoice"}, "defaults": {"bank": "HDFC Bank"}}
 *   Rows grouped into vouchers: {"group": "Invoice No", "voucher": {"kind": "sales", "date": "Date", "party": "Customer", "number": "Invoice No"},
 *                                "item": {"item": "Item", "qty": "Qty", "rate": "Rate", "ledger": "Sales Ledger"}, "defaults": {"taxes": "auto"}}
 */
import path from 'node:path';
import { TallyCliError } from '../core/errors.mjs';
import { readText, parseJson } from '../core/textio.mjs';
import { csvObjects } from '../io/csv.mjs';
import { getOp } from '../ops/registry.mjs';
import { validateInput } from '../ops/schema.mjs';
import { prepare, postVoucher, fingerprint } from '../domain/vouchers/post.mjs';
import { writeMaster, ensureMaster, MASTER_INPUTS } from '../domain/masters.mjs';

const num = (v) => {
  if (v === undefined || v === null || v === '') return undefined;
  const n = Number(String(v).replace(/[,₹\s]/g, ''));
  return Number.isFinite(n) ? n : v;
};

function pickFields(row, map) {
  const out = {};
  for (const [field, col] of Object.entries(map || {})) {
    if (col === undefined || col === null) continue;
    const v = typeof col === 'object' && col.value !== undefined ? col.value : row[col];
    if (v !== undefined && v !== '') out[field] = v;
  }
  return out;
}

const NUMERIC = new Set(['qty', 'rate', 'amount', 'discountPct', 'gstRate', 'expectedTotal', 'creditDays', 'taxRate']);
function coerceNumbers(o) {
  for (const k of Object.keys(o)) if (NUMERIC.has(k)) o[k] = num(o[k]);
  return o;
}

/** Turn input text into records: [{label, kind: 'op'|'voucher'|'master', op?, input}] */
export async function loadRecords(file, { type = 'vouchers', mapping } = {}) {
  const text = await readText(file);
  const base = path.basename(file);
  if (/\.csv$/i.test(file) || (mapping && !/^\s*[[{]/.test(text))) {
    if (!mapping) throw new TallyCliError('E_INPUT', 'CSV import needs a mapping file (--map map.json).', { hint: 'See docs/INTEGRATION.md (Bulk import) for the mapping format; templates/import/ has examples.' });
    const rows = csvObjects(text);
    if (mapping.op) {
      return rows.map((r, i) => ({ label: `${base}:row ${i + 2}`, kind: 'op', op: mapping.op, input: coerceNumbers({ ...(mapping.defaults || {}), ...pickFields(r, mapping.columns) }), key: mapping.key && r[mapping.key] ? `col:${r[mapping.key]}` : undefined }));
    }
    if (type === 'masters') {
      return rows.map((r, i) => ({ label: `${base}:row ${i + 2}`, kind: 'master', masterType: mapping.type, input: coerceNumbers({ ...(mapping.defaults || {}), ...pickFields(r, mapping.columns) }) }));
    }
    if (!mapping.group || !mapping.voucher) throw new TallyCliError('E_INPUT', 'Mapping must have "op" + "columns", or "group" + "voucher" (+ "item"/"entry").');
    const groups = new Map();
    rows.forEach((r, i) => {
      const k = r[mapping.group];
      if (!k) throw new TallyCliError('E_INPUT', `Row ${i + 2}: empty "${mapping.group}".`);
      if (!groups.has(k)) groups.set(k, { first: i + 2, rows: [] });
      groups.get(k).rows.push(r);
    });
    return [...groups.entries()].map(([k, g]) => {
      const v = { ...(mapping.defaults || {}), ...pickFields(g.rows[0], mapping.voucher) };
      if (mapping.item) v.items = g.rows.map((r) => coerceNumbers(pickFields(r, mapping.item)));
      if (mapping.entry) v.entries = g.rows.map((r) => coerceNumbers(pickFields(r, mapping.entry)));
      coerceNumbers(v);
      return { label: `${base}:${k} (row ${g.first})`, kind: 'voucher', input: v, key: `group:${k}` };
    });
  }
  const data = parseJson(text, file, { ndjson: /\.ndjson$/i.test(file) });
  const list = Array.isArray(data) ? data : data.records || data.vouchers || data.masters || [data];
  if (type === 'masters') return list.map((m, i) => ({ label: `${base}:#${i + 1}`, kind: 'master', masterType: m.type, input: Object.fromEntries(Object.entries(m).filter(([k]) => k !== 'type')) }));
  return list.map((v, i) => (v.op ? { label: `${base}:#${i + 1}`, kind: 'op', op: v.op, input: v.input || {} } : { label: `${base}:#${i + 1}`, kind: 'voucher', input: v }));
}

/**
 * Give every record a stable idempotency key that does not depend on file name or row position:
 * an explicit key column / idempotencyKey when present, else the content fingerprint, plus the
 * occurrence number among identical records (so two genuinely identical rows are both posted once).
 */
export function assignKeys(records) {
  const seen = new Map();
  for (const r of records) {
    if (r.kind === 'master') continue;
    const base = r.input?.idempotencyKey ? null : r.key || `fp:${fingerprint({ op: r.op || 'voucher', ...r.input })}`;
    if (!base) continue;
    const n = (seen.get(base) || 0) + 1;
    seen.set(base, n);
    r.key = n === 1 ? base : `${base}#${n}`;
  }
  return records;
}

/**
 * Validate or commit records.
 * @param {{commit?: boolean, stopOnError?: boolean, limit?: number}} opts
 */
export async function runImport(ctx, records, { commit = false, stopOnError = false, limit, forceResend = false } = {}) {
  const todo = assignKeys(limit ? records.slice(0, limit) : records);
  if (commit) ctx.policy.checkRunSize(todo.length, 'import');
  const results = [];
  for (const r of todo) {
    try {
      let res;
      if (r.kind === 'op') {
        const op = getOp(r.op);
        if (!op) throw new TallyCliError('E_INPUT', `Unknown operation "${r.op}" in mapping.`);
        if (!['write', 'read'].includes(op.kind)) throw new TallyCliError('E_POLICY', `${r.op} cannot be used for import.`);
        const input = { ...r.input };
        if (op.input?.properties?.idempotencyKey && !input.idempotencyKey) input.idempotencyKey = `import:${r.key}`;
        if (op.input?.properties?.dryRun) input.dryRun = !commit;
        if (forceResend && op.input?.properties?.forceResend) input.forceResend = true;
        res = await op.run(ctx, validateInput(op, input, { fromCli: true }));
      } else if (r.kind === 'master') {
        const type = r.masterType || 'ledger';
        if (!MASTER_INPUTS[type]) throw new TallyCliError('E_INPUT', `Unknown master type "${type}".`);
        res = commit ? await ensureMaster(ctx, type, r.input) : await writeMaster(ctx, type, 'create', { ...r.input, dryRun: true }).catch((err) => (err.code === 'E_CONFLICT' ? { exists: true } : Promise.reject(err)));
      } else {
        const input = { ...r.input, idempotencyKey: r.input.idempotencyKey || `import:${r.key}`, ...(forceResend ? { forceResend: true } : {}) };
        if (commit) res = await postVoucher(ctx, input, { op: 'import.vouchers' });
        else {
          const p = await prepare(ctx, input);
          res = { valid: true, summary: { voucherType: p.summary.voucherType, date: p.summary.date, number: p.summary.number, party: p.summary.party, total: p.summary.total } };
        }
      }
      results.push({ record: r.label, ok: true, ...(res?.masterId ? { masterId: res.masterId } : {}), ...(res?.duplicate ? { skipped: 'already posted' } : {}), ...(res?.exists ? { skipped: 'exists' } : {}), ...(res?.existed ? { skipped: 'exists' } : {}), ...(res?.summary ? { summary: res.summary } : {}) });
    } catch (err) {
      results.push({ record: r.label, ok: false, error: err.message, code: err.code, ...(err.details?.problems ? { problems: err.details.problems } : {}) });
      if (stopOnError) break;
    }
  }
  const ok = results.filter((x) => x.ok).length;
  return { mode: commit ? 'commit' : 'validate', total: todo.length, ok, failed: results.length - ok, skipped: results.filter((x) => x.skipped).length, results, next: commit ? undefined : 'Nothing was written. Fix any failures, then run again with --commit.' };
}
