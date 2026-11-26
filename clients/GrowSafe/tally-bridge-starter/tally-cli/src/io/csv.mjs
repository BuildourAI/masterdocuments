/**
 * CSV reading (RFC 4180 style: quotes, embedded commas and newlines, CRLF), with delimiter sniffing.
 */
export function parseCsv(text, { delimiter } = {}) {
  const src = String(text).replace(/^﻿/, '');
  const d = delimiter || sniffDelimiter(src);
  const rows = [];
  let row = [];
  let field = '';
  let q = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (q) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else q = false;
      } else field += c;
      continue;
    }
    if (c === '"' && field === '') q = true;
    else if (c === d) {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && src[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      if (row.some((x) => x !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((x) => x !== '')) rows.push(row);
  return rows;
}

function sniffDelimiter(src) {
  const first = src.split(/\r?\n/, 1)[0] || '';
  const counts = [',', ';', '\t', '|'].map((d) => [d, first.split(d).length]);
  counts.sort((a, b) => b[1] - a[1]);
  return counts[0][1] > 1 ? counts[0][0] : ',';
}

/** Rows to objects using the first row as headers (trimmed). */
export function csvObjects(text, opts) {
  const rows = parseCsv(text, opts);
  if (!rows.length) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((r) => Object.fromEntries(headers.map((h, i) => [h, (r[i] ?? '').trim()])));
}

/** Find a column by candidate names (case-insensitive, ignoring spaces and punctuation). */
export function pickColumn(headers, candidates) {
  const n = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const hs = headers.map((h) => [h, n(h)]);
  for (const c of candidates) {
    const hit = hs.find(([, k]) => k === n(c));
    if (hit) return hit[0];
  }
  for (const c of candidates) {
    const hit = hs.find(([, k]) => k.includes(n(c)));
    if (hit) return hit[0];
  }
  return null;
}
