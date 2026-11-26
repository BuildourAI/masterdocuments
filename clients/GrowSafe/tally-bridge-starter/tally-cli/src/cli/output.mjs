/**
 * Output rendering. Programs get a stable JSON envelope on stdout; people get tables.
 *   json    {ok, data, meta} or {ok:false, error, meta}   (default when stdout is not a terminal)
 *   table   readable text                                  (default on a terminal)
 *   csv / ndjson   rows only, for spreadsheets and pipelines
 * On Windows, piped JSON is ASCII-escaped so a console code page can never garble names.
 */
import { formatInr } from '../core/amounts.mjs';

export function chooseFormat(flags, stream = process.stdout) {
  if (flags.format) return flags.format;
  if (flags.json) return 'json';
  if (flags.table) return 'table';
  if (flags.csv) return 'csv';
  if (flags.ndjson) return 'ndjson';
  return stream.isTTY ? 'table' : 'json';
}

export function asciiJson(text) {
  return text.replace(/[\u007f-￿]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
}

/** Find the main row list inside a data payload, if there is one. */
export function rowsOf(data) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    for (const k of ['rows', 'items', 'parties', 'bills', 'vouchers', 'entries', 'lines', 'results', 'checks']) if (Array.isArray(data[k])) return data[k];
  }
  return null;
}

function flatten(obj, prefix = '', out = {}, human = true) {
  for (const [k, v] of Object.entries(obj || {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      if (human && 'amount' in v && 'side' in v && Object.keys(v).length === 2) out[key] = v.amount ? `${formatInr(v.amount)} ${v.side}` : '0';
      else flatten(v, key, out, human);
    } else if (Array.isArray(v)) out[key] = v.length && typeof v[0] !== 'object' ? v.join('; ') : v.length ? `[${v.length}]` : '';
    else out[key] = v;
  }
  return out;
}

function csvCell(v) {
  if (v === null || v === undefined) return '';
  const s = String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(rows) {
  const flat = rows.map((r) => (r && typeof r === 'object' ? flatten(r, '', {}, false) : { value: r }));
  const cols = [];
  for (const r of flat) for (const k of Object.keys(r)) if (!cols.includes(k)) cols.push(k);
  return [cols.map(csvCell).join(','), ...flat.map((r) => cols.map((c) => csvCell(r[c])).join(','))].join('\r\n') + '\r\n';
}

function fmtCell(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'number') return Number.isInteger(v) ? String(v) : formatInr(v);
  if (typeof v === 'boolean') return v ? 'yes' : 'no';
  return String(v);
}

export function table(rows, { maxWidth = 48, maxCols = 9 } = {}) {
  if (!rows.length) return '(no rows)\n';
  const flat = rows.map((r) => (r && typeof r === 'object' ? flatten(r) : { value: r }));
  let cols = [];
  for (const r of flat) for (const k of Object.keys(r)) if (!cols.includes(k)) cols.push(k);
  cols = cols.filter((c) => flat.some((r) => r[c] !== null && r[c] !== undefined && r[c] !== '' && r[c] !== false)).filter((c) => !/^(guid|masterId|alterId)$/.test(c));
  if (cols.length > maxCols) cols = cols.slice(0, maxCols);
  const cells = flat.map((r) => cols.map((c) => fmtCell(r[c]).slice(0, maxWidth)));
  const widths = cols.map((c, i) => Math.max(c.length, ...cells.map((row) => row[i].length)));
  const numeric = cols.map((c, i) => flat.every((r) => r[c] === undefined || r[c] === null || typeof r[c] === 'number' || /^-?[\d,]+(\.\d+)?( Dr| Cr)?$/.test(String(fmtCell(r[c])))));
  const line = (vals) => vals.map((v, i) => (numeric[i] ? v.padStart(widths[i]) : v.padEnd(widths[i]))).join('  ').trimEnd();
  return [line(cols), widths.map((w) => '-'.repeat(w)).join('  '), ...cells.map(line)].join('\n') + `\n(${rows.length} row${rows.length === 1 ? '' : 's'})\n`;
}

function describe(data, indent = '') {
  if (data === null || data === undefined) return `${indent}(nothing)\n`;
  if (typeof data !== 'object') return `${indent}${fmtCell(data)}\n`;
  if (Array.isArray(data)) return data.length && typeof data[0] !== 'object' ? data.map((d) => `${indent}${fmtCell(d)}\n`).join('') : table(data);
  let out = '';
  const rows = rowsOf(data);
  for (const [k, v] of Object.entries(data)) {
    if (rows && v === rows) continue;
    if (k === 'xml' && typeof v === 'string') {
      out += `${indent}xml:\n${v}\n`;
      continue;
    }
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      if ('amount' in v && 'side' in v) out += `${indent}${k}: ${v.amount ? formatInr(v.amount) + ' ' + v.side : '0'}\n`;
      else out += `${indent}${k}:\n${describe(v, indent + '  ')}`;
    } else if (Array.isArray(v)) {
      if (!v.length) out += `${indent}${k}: (none)\n`;
      else if (typeof v[0] !== 'object') out += `${indent}${k}: ${v.join(', ')}\n`;
      else out += `${indent}${k}:\n${table(v)
        .split('\n')
        .map((l) => (l ? indent + '  ' + l : l))
        .join('\n')}`;
    } else out += `${indent}${k}: ${fmtCell(v)}\n`;
  }
  if (rows) out += table(rows);
  return out;
}

/** Render an envelope to a string for the chosen format. */
export function render(env, format, { platform = process.platform, piped = !process.stdout.isTTY, pretty = false } = {}) {
  if (format === 'json') {
    const text = JSON.stringify(env, null, pretty || !piped ? 2 : 0);
    return (platform === 'win32' && piped ? asciiJson(text) : text) + '\n';
  }
  if (!env.ok) return '';
  const rows = rowsOf(env.data);
  if (format === 'csv') return toCsv(rows || [env.data]);
  if (format === 'ndjson') {
    const text = (rows || [env.data]).map((r) => JSON.stringify(r)).join('\n') + '\n';
    return platform === 'win32' && piped ? asciiJson(text) : text;
  }
  return describe(env.data);
}

/** Human error text for stderr. */
export function renderError(env) {
  const e = env.error || {};
  let s = `Error [${e.code}]: ${e.message}\n`;
  if (e.hint) s += `Hint: ${e.hint}\n`;
  if (e.details && e.details.suggestions && e.details.suggestions.length) s += `Suggestions: ${e.details.suggestions.join(' | ')}\n`;
  return s;
}

export function renderWarnings(env) {
  return (env.meta?.warnings || []).map((w) => `Warning: ${w}\n`).join('');
}
