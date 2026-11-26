/**
 * GST helpers: state codes, GSTIN validation (format + checksum), intra/inter-state tax split.
 */
import { TallyCliError } from '../core/errors.mjs';

export const STATES = {
  '01': 'Jammu and Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  10: 'Bihar',
  11: 'Sikkim',
  12: 'Arunachal Pradesh',
  13: 'Nagaland',
  14: 'Manipur',
  15: 'Mizoram',
  16: 'Tripura',
  17: 'Meghalaya',
  18: 'Assam',
  19: 'West Bengal',
  20: 'Jharkhand',
  21: 'Odisha',
  22: 'Chhattisgarh',
  23: 'Madhya Pradesh',
  24: 'Gujarat',
  26: 'Dadra and Nagar Haveli and Daman and Diu',
  27: 'Maharashtra',
  28: 'Andhra Pradesh (Old)',
  29: 'Karnataka',
  30: 'Goa',
  31: 'Lakshadweep',
  32: 'Kerala',
  33: 'Tamil Nadu',
  34: 'Puducherry',
  35: 'Andaman and Nicobar Islands',
  36: 'Telangana',
  37: 'Andhra Pradesh',
  38: 'Ladakh',
  97: 'Other Territory',
  99: 'Centre Jurisdiction',
};

const ALIASES = { orissa: 'Odisha', pondicherry: 'Puducherry', 'new delhi': 'Delhi', 'nct of delhi': 'Delhi', 'jammu & kashmir': 'Jammu and Kashmir', 'andaman & nicobar islands': 'Andaman and Nicobar Islands' };

export function stateList() {
  return Object.entries(STATES).map(([code, name]) => ({ code: String(code).padStart(2, '0'), name }));
}

/** Normalise a state name or code into {code, name}, or null. */
export function findState(input) {
  if (input === undefined || input === null || input === '') return null;
  const s = String(input).trim();
  if (/^\d{1,2}$/.test(s)) {
    const code = s.padStart(2, '0');
    const name = STATES[code] ?? STATES[Number(code)];
    return name ? { code, name } : null;
  }
  const l = s.toLowerCase();
  const name = ALIASES[l] || Object.values(STATES).find((n) => n.toLowerCase() === l);
  if (!name) return null;
  const code = Object.keys(STATES).find((k) => STATES[k] === name);
  return { code: String(code).padStart(2, '0'), name };
}

const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** GSTIN check character over the first 14 characters (mod 36, alternating weights 1 and 2). */
export function gstinCheckChar(first14) {
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    const v = CHARS.indexOf(first14[i]);
    if (v < 0) return null;
    const p = v * (i % 2 === 0 ? 1 : 2);
    sum += Math.floor(p / 36) + (p % 36);
  }
  return CHARS[(36 - (sum % 36)) % 36];
}

/** Validate a GSTIN; returns {valid, gstin, state, pan, problems[]}. */
export function checkGstin(input) {
  const gstin = String(input ?? '')
    .trim()
    .toUpperCase();
  const problems = [];
  if (!/^[0-9]{2}[A-Z0-9]{10}[0-9A-Z]Z[0-9A-Z]$/.test(gstin)) {
    if (gstin.length !== 15) problems.push(`must be 15 characters (has ${gstin.length})`);
    else problems.push('format must be 2-digit state code, 10-character PAN, entity code, "Z", check character');
  }
  const code = gstin.slice(0, 2);
  const state = STATES[code] ?? STATES[Number(code)];
  if (!state) problems.push(`unknown state code ${code}`);
  const pan = gstin.slice(2, 12);
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) problems.push('characters 3-12 are not a valid PAN');
  if (gstin.length === 15 && /^[0-9A-Z]{15}$/.test(gstin)) {
    const expected = gstinCheckChar(gstin.slice(0, 14));
    if (expected !== gstin[14]) problems.push(`check character should be ${expected}`);
  }
  return { valid: problems.length === 0, gstin, stateCode: code, state: state || null, pan, problems };
}

/**
 * Work out tax lines for an invoice.
 * @param {{lines: {taxable: number, rate: number}[], companyState: string, partyState?: string, placeOfSupply?: string,
 *   ledgers: {cgst?: string, sgst?: string, igst?: string}, byRate?: Record<string, {cgst?: string, sgst?: string, igst?: string}>}} p
 *  taxable in paise; rate in percent
 * @returns {{interState: boolean, taxes: {ledger: string, amount: number, head: string, rate: number}[]}} amounts in paise
 */
export function splitGst({ lines, companyState, partyState, placeOfSupply, ledgers = {}, byRate = {} }) {
  const company = findState(companyState);
  const pos = findState(placeOfSupply || partyState);
  if (!company) throw new TallyCliError('E_INPUT', 'The company state is not known, so CGST/SGST vs IGST cannot be decided.', { hint: 'Set gst.companyState in the profile (for example "Maharashtra"), or pass taxes explicitly.' });
  if (!pos) throw new TallyCliError('E_INPUT', 'The place of supply is not known.', { hint: 'Pass "placeOfSupply" (state name or code) or make sure the party ledger has a state.' });
  const interState = company.code !== pos.code;
  const byRateTotals = new Map();
  for (const l of lines) {
    if (!l.rate) continue;
    byRateTotals.set(l.rate, (byRateTotals.get(l.rate) || 0) + l.taxable);
  }
  const taxes = [];
  const pick = (rate, head) => {
    const r = byRate[String(rate)] || byRate[String(Number(rate))] || {};
    const name = r[head] || ledgers[head];
    if (!name) {
      throw new TallyCliError('E_INPUT', `No ledger configured for ${head.toUpperCase()} at ${rate}%.`, { hint: `Set gst.ledgers.${head} (or gst.byRate["${rate}"].${head}) in the profile, or pass taxes explicitly.` });
    }
    return name;
  };
  for (const [rate, taxable] of [...byRateTotals.entries()].sort((a, b) => a[0] - b[0])) {
    if (interState) {
      taxes.push({ ledger: pick(rate, 'igst'), head: 'IGST', rate, amount: Math.round((taxable * rate) / 100) });
    } else {
      const half = Math.round((taxable * rate) / 200);
      taxes.push({ ledger: pick(rate, 'cgst'), head: 'CGST', rate: rate / 2, amount: half });
      taxes.push({ ledger: pick(rate, 'sgst'), head: 'SGST', rate: rate / 2, amount: half });
    }
  }
  // Merge lines that hit the same ledger (single CGST ledger for all rates)
  const merged = new Map();
  for (const t of taxes) {
    const m = merged.get(t.ledger);
    if (m) m.amount += t.amount;
    else merged.set(t.ledger, { ...t });
  }
  return { interState, companyState: company.name, placeOfSupply: pos.name, taxes: [...merged.values()] };
}
