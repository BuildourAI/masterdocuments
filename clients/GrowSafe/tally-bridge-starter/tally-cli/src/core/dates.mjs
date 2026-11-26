/**
 * Dates. Everything inside the tool is an ISO calendar date string "YYYY-MM-DD" (no time, no zone).
 * Tally wants "YYYYMMDD" inside voucher bodies and "1-Apr-2026" in static variables.
 * "Today" is computed from local calendar fields: in India, UTC is still yesterday until 05:30.
 */
import { TallyCliError } from './errors.mjs';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_INDEX = Object.fromEntries(MONTHS.map((m, i) => [m.toLowerCase(), i + 1]));

const pad = (n, w = 2) => String(n).padStart(w, '0');

export function isValidYmd(y, m, d) {
  if (!(y >= 1900 && y <= 2200 && m >= 1 && m <= 12 && d >= 1)) return false;
  return d <= daysInMonth(y, m);
}

export function daysInMonth(y, m) {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

const iso = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;

/** Local "today" as ISO. `now` may be injected for tests. */
export function today(now = new Date()) {
  return iso(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

/**
 * Parse a user- or Tally-supplied date into ISO. Accepts:
 *   2026-04-01, 20260401, 01-04-2026, 1/4/2026, 1-Apr-2026, 01-Apr-26, today, yesterday, tomorrow
 * Day-first for numeric dates with separators (Indian convention). Returns null for empty input.
 */
export function parseDate(input, { field = 'date', now } = {}) {
  if (input === undefined || input === null) return null;
  const s = String(input).trim();
  if (!s) return null;
  const lower = s.toLowerCase();
  if (lower === 'today') return today(now);
  if (lower === 'yesterday') return addDays(today(now), -1);
  if (lower === 'tomorrow') return addDays(today(now), 1);
  let m;
  let y;
  let mo;
  let d;
  if ((m = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ].*)?$/.exec(s))) [y, mo, d] = [+m[1], +m[2], +m[3]];
  else if ((m = /^(\d{4})(\d{2})(\d{2})$/.exec(s))) [y, mo, d] = [+m[1], +m[2], +m[3]];
  else if ((m = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})$/.exec(s))) [d, mo, y] = [+m[1], +m[2], +m[3]];
  else if ((m = /^(\d{1,2})[-\s/]([A-Za-z]{3,9})[-\s/,]+(\d{2,4})$/.exec(s))) {
    d = +m[1];
    mo = MONTH_INDEX[m[2].slice(0, 3).toLowerCase()];
    y = +m[3];
  } else if ((m = /^([A-Za-z]{3,9})\s+(\d{1,2}),?\s+(\d{4})$/.exec(s))) {
    mo = MONTH_INDEX[m[1].slice(0, 3).toLowerCase()];
    d = +m[2];
    y = +m[3];
  }
  if (y !== undefined && y < 100) y += 2000;
  if (y === undefined || !isValidYmd(y, mo, d)) {
    throw new TallyCliError('E_INPUT', `Invalid ${field}: "${s}".`, {
      hint: 'Use YYYY-MM-DD (for example 2026-04-01). DD-MM-YYYY and 1-Apr-2026 are also accepted.',
    });
  }
  return iso(y, mo, d);
}

/** Lenient parse for values coming back from Tally: returns null instead of throwing. */
export function fromTally(value) {
  try {
    return parseDate(value);
  } catch {
    return null;
  }
}

const split = (isoDate) => isoDate.split('-').map(Number);

/** ISO -> "YYYYMMDD" (voucher body format). */
export function toTallyBody(isoDate) {
  return isoDate.replace(/-/g, '');
}

/** ISO -> "1-Apr-2026" (static variable and attribute format). */
export function toTallyVar(isoDate) {
  const [y, m, d] = split(isoDate);
  return `${d}-${MONTHS[m - 1]}-${y}`;
}

export function addDays(isoDate, n) {
  const [y, m, d] = split(isoDate);
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return iso(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate());
}

/** Whole days from a to b (b - a). */
export function diffDays(a, b) {
  const [y1, m1, d1] = split(a);
  const [y2, m2, d2] = split(b);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
}

export const compareDates = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/** Indian financial year containing a date: April to March. */
export function fyOf(isoDate) {
  const [y, m] = split(isoDate);
  const start = m >= 4 ? y : y - 1;
  return { from: `${start}-04-01`, to: `${start + 1}-03-31`, label: `${start}-${String(start + 1).slice(2)}` };
}

/** Parse "2026-27", "2026-2027", "FY27" or "current"/"previous" into a period. */
export function parseFy(spec, now) {
  const s = String(spec).trim().toLowerCase();
  if (s === 'current' || s === 'this') return fyOf(today(now));
  if (s === 'previous' || s === 'last') return fyOf(addDays(fyOf(today(now)).from, -1));
  let m;
  if ((m = /^(\d{4})\s*[-/]\s*(\d{2}|\d{4})$/.exec(s))) {
    const y = +m[1];
    return fyOf(`${y}-04-01`);
  }
  if ((m = /^fy\s*(\d{2}|\d{4})$/.exec(s))) {
    let end = +m[1];
    if (end < 100) end += 2000;
    return fyOf(`${end - 1}-04-01`);
  }
  throw new TallyCliError('E_INPUT', `Invalid financial year "${spec}".`, { hint: 'Use 2026-27, FY27, current or previous.' });
}

/** Month windows covering [from, to], used to split large exports. */
export function monthWindows(from, to) {
  const out = [];
  let cur = from;
  while (cur <= to) {
    const [y, m] = split(cur);
    const end = iso(y, m, daysInMonth(y, m));
    out.push({ from: cur, to: end < to ? end : to });
    cur = addDays(end, 1);
  }
  return out;
}

/** Split a window into two halves (for adaptive chunking). */
export function halveWindow({ from, to }) {
  const days = diffDays(from, to);
  if (days < 1) return null;
  const mid = addDays(from, Math.floor(days / 2));
  return [
    { from, to: mid },
    { from: addDays(mid, 1), to },
  ];
}

export function isLastDayOfMonth(isoDate) {
  const [y, m, d] = split(isoDate);
  return d === daysInMonth(y, m);
}

/** Educational mode of Tally only accepts vouchers dated the 1st, 2nd or last day of a month. */
export function allowedInEducationalMode(isoDate) {
  const d = split(isoDate)[2];
  return d === 1 || d === 2 || isLastDayOfMonth(isoDate);
}

/**
 * Resolve --from/--to/--fy/--as-of style inputs into a period, defaulting to the current FY to date.
 * @returns {{from: string, to: string}}
 */
export function resolvePeriod({ from, to, fy, asOf } = {}, { booksFrom, now } = {}) {
  if (fy) {
    const p = parseFy(fy, now);
    return { from: from ? parseDate(from, { field: 'from' }) : p.from, to: to ? parseDate(to, { field: 'to' }) : p.to };
  }
  const t = parseDate(to ?? asOf, { field: 'to', now }) || today(now);
  let f = parseDate(from, { field: 'from', now });
  if (!f) {
    f = fyOf(t).from;
    if (booksFrom && booksFrom > f && booksFrom <= t) f = booksFrom;
  }
  if (f > t) throw new TallyCliError('E_INPUT', `--from (${f}) is after --to (${t}).`);
  return { from: f, to: t };
}
