/**
 * Money, quantities and rates.
 * Money is held as integer paise internally so totals never drift. Inputs with more decimals
 * than allowed are rejected rather than silently rounded.
 */
import { TallyCliError } from './errors.mjs';

/** Parse a money value (number or string, optional commas, optional Dr/Cr suffix) into paise. */
export function toPaise(value, { field = 'amount', decimals = 2, allowNegative = false } = {}) {
  if (value === undefined || value === null || value === '') {
    throw new TallyCliError('E_INPUT', `${field} is missing.`);
  }
  let s = typeof value === 'number' ? numberToPlain(value) : String(value).trim().replace(/,/g, '').replace(/^₹\s*/, '');
  let negative = false;
  if (/\s*(dr|cr)$/i.test(s)) {
    negative = /dr$/i.test(s);
    s = s.replace(/\s*(dr|cr)$/i, '');
  }
  if (s.startsWith('(-)')) {
    negative = !negative;
    s = s.slice(3);
  }
  if (s.startsWith('-')) {
    negative = !negative;
    s = s.slice(1);
  } else if (s.startsWith('+')) s = s.slice(1);
  if (!/^\d+(\.\d+)?$/.test(s)) {
    throw new TallyCliError('E_INPUT', `${field} "${value}" is not a number.`);
  }
  const [whole, frac = ''] = s.split('.');
  if (frac.replace(/0+$/, '').length > decimals) {
    throw new TallyCliError('E_INPUT', `${field} ${value} has more than ${decimals} decimal places.`, {
      hint: 'Round the amount yourself before sending; the tool never rounds money silently.',
    });
  }
  const paise = Number(whole) * 100 + Number((frac + '00').slice(0, 2));
  if (!Number.isSafeInteger(paise)) throw new TallyCliError('E_INPUT', `${field} ${value} is too large.`);
  if (negative && !allowNegative) {
    throw new TallyCliError('E_INPUT', `${field} must be positive (got ${value}).`, {
      hint: 'Amounts are always positive; say which side with "debit"/"credit" (or "side": "Dr"/"Cr").',
    });
  }
  return negative ? -paise : paise;
}

function numberToPlain(n) {
  if (!Number.isFinite(n)) throw new TallyCliError('E_INPUT', `Invalid number ${n}.`);
  // Avoid exponent notation and binary noise like 0.30000000000000004
  const s = n.toFixed(6).replace(/\.?0+$/, '');
  return s === '-0' ? '0' : s;
}

/** Paise -> rupees number (2 decimals). */
export const fromPaise = (p) => Math.round(p) / 100;

/** Paise -> fixed string "1234.50" (Tally amount format, unsigned). */
export const paiseToString = (p) => {
  const neg = p < 0;
  const a = Math.abs(Math.round(p));
  return `${neg ? '-' : ''}${Math.floor(a / 100)}.${String(a % 100).padStart(2, '0')}`;
};

/** Round a rupee number to paise (for values computed from Tally data, not for inputs). */
export const roundMoney = (n) => Math.round((Number(n) || 0) * 100) / 100;

/**
 * Parse an amount coming back from Tally (lenient). Debit amounts are negative in Tally XML.
 * Handles "1234.00", "-1234.00", "(-)1234.00", "1,234.00 Dr", "₹ 1,234.00", "" (0).
 */
export function parseTallyAmount(value) {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return roundMoney(value);
  let s = String(value).replace(/\u0004/g, '').trim();
  if (!s) return 0;
  // Forex amounts may look like "$ 100.00 @ ₹ 83.00/$ = ₹ 8300.00": take the final home-currency value
  if (s.includes('=')) s = s.split('=').pop().trim();
  s = s.replace(/[₹,\s]/g, '').replace(/^[^\d(+-]+/, '');
  let sign = 1;
  if (/dr$/i.test(s)) {
    sign = -1;
    s = s.slice(0, -2);
  } else if (/cr$/i.test(s)) s = s.slice(0, -2);
  if (s.startsWith('(-)')) {
    sign = -sign;
    s = s.slice(3);
  }
  const n = parseFloat(s);
  return Number.isFinite(n) ? roundMoney(sign * n) : 0;
}

/** Parse a Tally quantity string like " 10 Nos" or "-2.5 Kgs" or "10 Box = 120 Nos". */
export function parseQty(value) {
  if (value === undefined || value === null) return { qty: 0, unit: '' };
  if (typeof value === 'number') return { qty: value, unit: '' };
  const s = String(value).replace(/\u0004/g, '').trim();
  if (!s) return { qty: 0, unit: '' };
  const first = s.split('=')[0].trim();
  const m = /^(\(-\)|-)?\s*([\d,]*\.?\d+)\s*(.*)$/.exec(first);
  if (!m) return { qty: 0, unit: first };
  const n = parseFloat(m[2].replace(/,/g, ''));
  return { qty: m[1] ? -n : n, unit: m[3].trim() };
}

/** Parse a Tally rate like "1000.00/Nos" -> {rate, per}. */
export function parseRate(value) {
  if (value === undefined || value === null || value === '') return { rate: 0, per: '' };
  if (typeof value === 'number') return { rate: value, per: '' };
  const s = String(value).replace(/\u0004/g, '').replace(/[₹,]/g, '').trim();
  const [r, per = ''] = s.split('/');
  const n = parseFloat(r);
  return { rate: Number.isFinite(n) ? n : 0, per: per.trim() };
}

/** Format a quantity for Tally: " 10 Nos" (Tally's own exports have a leading space). */
export function formatQty(qty, unit) {
  return ` ${trimNum(qty)}${unit ? ' ' + unit : ''}`;
}

/** Format a rate for Tally: "1000.00/Nos". */
export function formatRate(rate, per) {
  return `${trimNum(rate, 2)}${per ? '/' + per : ''}`;
}

function trimNum(n, minDecimals = 0) {
  const s = Number(n).toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
  if (minDecimals && !s.includes('.')) return `${s}.${'0'.repeat(minDecimals)}`;
  if (minDecimals) {
    const [w, f] = s.split('.');
    return `${w}.${f.padEnd(minDecimals, '0')}`;
  }
  return s;
}

/** Validate a quantity input (positive number, limited decimals). */
export function toQty(value, { field = 'qty', decimals = 4 } = {}) {
  const n = typeof value === 'number' ? value : Number(String(value ?? '').replace(/,/g, ''));
  if (!Number.isFinite(n) || n <= 0) throw new TallyCliError('E_INPUT', `${field} must be a positive number (got ${value}).`);
  const frac = (String(n).split('.')[1] || '').length;
  if (frac > decimals) throw new TallyCliError('E_INPUT', `${field} ${value} has more than ${decimals} decimal places.`);
  return n;
}

/** Indian digit grouping for display: 12,34,567.89 */
export function formatInr(n, { decimals = 2 } = {}) {
  const neg = n < 0;
  const [w, f] = Math.abs(Number(n) || 0)
    .toFixed(decimals)
    .split('.');
  let head = w;
  let grouped = '';
  if (head.length > 3) {
    grouped = ',' + head.slice(-3);
    head = head.slice(0, -3);
    while (head.length > 2) {
      grouped = ',' + head.slice(-2) + grouped;
      head = head.slice(0, -2);
    }
  }
  return `${neg ? '-' : ''}${head}${grouped}${f ? '.' + f : ''}`;
}

/** Signed Tally amount (debit negative) -> {amount, side}. */
export function toSided(signed) {
  const v = roundMoney(signed);
  if (v === 0) return { amount: 0, side: null };
  return { amount: Math.abs(v), side: v < 0 ? 'Dr' : 'Cr' };
}

/** {amount, side} -> signed Tally amount (debit negative). */
export function fromSided({ amount, side }) {
  const s = String(side || '').toLowerCase();
  if (!['dr', 'cr', 'debit', 'credit'].includes(s)) {
    throw new TallyCliError('E_INPUT', `side must be "Dr" or "Cr" (got ${side}).`);
  }
  return s.startsWith('d') ? -Math.abs(amount) : Math.abs(amount);
}
