/**
 * The voucher input model: normalisation and validation.
 *
 * Conventions that keep callers (often AI systems) out of accounting trouble:
 *  - Amounts are always positive. The side is the field name ("debit"/"credit") or follows from the kind.
 *  - Dates are ISO (YYYY-MM-DD). Quantity, unit and rate are separate fields.
 *  - Names must exist in Tally (matched ignoring case and extra spaces; corrected to Tally's spelling).
 *  - Money is integer paise inside; more decimals than allowed is an error, never silently rounded.
 *  - Every problem found is reported at once, so a caller can fix everything in one go.
 */
import { TallyCliError, suggest } from '../../core/errors.mjs';
import { toPaise, fromPaise, toQty } from '../../core/amounts.mjs';
import { parseDate } from '../../core/dates.mjs';
import { KINDS, KIND_NAMES, opposite, BILL_TYPES, BANK_MODES, kindForBase } from './kinds.mjs';
import { voucherTypes } from './read.mjs';
import { norm } from '../common.mjs';
import { splitGst, findState } from '../gst.mjs';
import { listCompanies } from '../company.mjs';

const MODEL_KEYS = new Set([
  'kind',
  'voucherType',
  'date',
  'number',
  'reference',
  'narration',
  'party',
  'placeOfSupply',
  'entries',
  'items',
  'ledgers',
  'charges',
  'taxes',
  'roundOff',
  'expectedTotal',
  'bills',
  'consumed',
  'produced',
  'optional',
  'idempotencyKey',
  'raw',
  'salesLedger',
  'purchaseLedger',
  'godown',
  'orderNo',
  'dueDate',
  // read-model fields tolerated on input so a fetched voucher can be edited and re-posted
  'masterId',
  'guid',
  'alterId',
  'baseType',
  'status',
  'view',
  'total',
]);
const ENTRY_KEYS = new Set(['ledger', 'debit', 'credit', 'bills', 'bank', 'costCentres', 'isParty', 'raw']);
const ITEM_KEYS = new Set(['item', 'qty', 'unit', 'rate', 'per', 'discountPct', 'amount', 'ledger', 'godown', 'destinationGodown', 'batch', 'orderNo', 'dueDate', 'gstRate', 'direction', 'raw']);
const CHARGE_KEYS = new Set(['ledger', 'amount', 'deduct', 'gstRate', 'raw']);

/** qty x rate x (1 - discount%) in paise, computed exactly with integers and rounded half up. */
export function lineAmountPaise(qty, rate, discPct = 0) {
  const q = BigInt(Math.round(qty * 1e4));
  const r = BigInt(Math.round(rate * 1e4));
  const d = BigInt(Math.round((100 - discPct) * 100)); // basis points kept
  const num = q * r * d; // scale 1e4 * 1e4 * 1e4, in rupees
  const den = 10n ** 10n; // to paise: / 1e12 * 100
  return Number((num * 2n + den) / (2n * den));
}

/** Reference data from Tally used for validation, memoised per invocation. */
export async function refData(ctx) {
  return ctx.memo('refdata', async () => {
    const [ledgers, items, godowns, vt] = [
      await ctx.client.rows({
        collection: { type: 'Ledger' },
        fields: [
          { key: 'name', method: 'Name' },
          { key: 'parent', method: 'Parent', type: 'parent' },
          { key: 'billWise', method: 'IsBillWiseOn', type: 'logical' },
          { key: 'state', method: 'LedStateName' },
          { key: 'creditDays', expr: '$$Number:$BillCreditPeriod', type: 'number' },
          { key: 'primaryGroup', method: '_PrimaryGroup' },
        ],
      }),
      await ctx.client.rows({
        collection: { type: 'StockItem' },
        fields: [
          { key: 'name', method: 'Name' },
          { key: 'unit', expr: 'if $$IsEqual:$BaseUnits:$$SysName:NotApplicable then "" else $BaseUnits' },
          { key: 'gstRate', method: 'InfGSTIGSTRate', type: 'number' },
        ],
      }),
      await ctx.client.rows({ collection: { type: 'Godown' }, fields: [{ key: 'name', method: 'Name' }] }),
      await voucherTypes(ctx),
    ];
    const map = (rows) => new Map(rows.map((r) => [norm(r.name), r]));
    return { ledgers: map(ledgers), ledgerNames: ledgers.map((l) => l.name), items: map(items), itemNames: items.map((i) => i.name), godowns: map(godowns), godownNames: godowns.map((g) => g.name), vt };
  });
}

class Problems {
  constructor() {
    this.list = [];
  }
  add(path, message, extra) {
    this.list.push({ path, message, ...(extra || {}) });
  }
  try(path, fn) {
    try {
      return fn();
    } catch (err) {
      this.add(path, err.message, err.details?.suggestions ? { suggestions: err.details.suggestions } : undefined);
      return undefined;
    }
  }
  throwIfAny() {
    if (!this.list.length) return;
    const first = this.list[0];
    throw new TallyCliError('E_VALIDATION', this.list.length === 1 ? `${first.path}: ${first.message}` : `${this.list.length} problems in the voucher; first: ${first.path}: ${first.message}`, {
      details: { problems: this.list },
      hint: 'Fix every listed problem and send again. "tally ledger search <text>" / "tally item search <text>" give exact names.',
    });
  }
}

function resolveName(map, names, name, what) {
  const hit = map.get(norm(name));
  if (hit) return hit.name;
  const s = suggest(name, names, 5);
  const e = new TallyCliError('E_NOT_FOUND', `${what} "${name}" does not exist in Tally${s.length ? `; did you mean ${s.map((x) => `"${x}"`).join(', ')}?` : '.'}`);
  e.details = { suggestions: s };
  throw e;
}

function checkKeys(obj, allowed, path, P) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    P.add(path, 'must be an object');
    return false;
  }
  for (const k of Object.keys(obj)) {
    if (!allowed.has(k)) {
      const s = suggest(k, [...allowed], 2);
      P.add(`${path}.${k}`, `unknown field${s.length ? ` (did you mean "${s[0]}"?)` : ''}`);
    }
  }
  return true;
}

function sideAmount(e, path, P, decimals) {
  const hasD = e.debit !== undefined && e.debit !== null;
  const hasC = e.credit !== undefined && e.credit !== null;
  if (hasD === hasC) {
    P.add(path, 'give exactly one of "debit" or "credit" (a positive amount)');
    return null;
  }
  const paise = P.try(`${path}.${hasD ? 'debit' : 'credit'}`, () => toPaise(hasD ? e.debit : e.credit, { field: hasD ? 'debit' : 'credit', decimals }));
  if (paise === undefined) return null;
  if (paise === 0) P.add(path, 'amount is zero');
  return { side: hasD ? 'debit' : 'credit', paise };
}

function normaliseBills(bills, entryPaise, path, P, decimals) {
  if (bills === undefined || bills === null) return undefined;
  if (bills === 'on-account' || bills === 'onAccount') return [{ type: 'on-account', ref: '', paise: entryPaise }];
  if (!Array.isArray(bills)) {
    P.add(path, 'must be a list of {type, ref, amount} or "on-account"');
    return undefined;
  }
  const out = bills.map((b, i) => {
    const p = `${path}[${i}]`;
    const type = String(b.type || 'new').toLowerCase();
    if (!BILL_TYPES[type]) P.add(`${p}.type`, `must be one of ${Object.keys(BILL_TYPES).join(', ')}`);
    if (type !== 'on-account' && !b.ref) P.add(`${p}.ref`, 'bill reference is required (except for on-account)');
    const paise = b.amount === undefined && bills.length === 1 ? entryPaise : P.try(`${p}.amount`, () => toPaise(b.amount, { field: 'amount', decimals }));
    return { type, ref: b.ref ? String(b.ref) : '', paise: paise || 0, creditDays: b.creditDays ? Number(b.creditDays) : undefined };
  });
  const total = out.reduce((s, b) => s + b.paise, 0);
  if (total !== entryPaise) P.add(path, `bill amounts add up to ${fromPaise(total)} but the entry is ${fromPaise(entryPaise)}`);
  return out;
}

function normaliseCostCentres(cc, entryPaise, path, P, decimals) {
  if (!cc) return undefined;
  if (!Array.isArray(cc)) {
    P.add(path, 'must be a list of {category?, name, amount}');
    return undefined;
  }
  const out = cc.map((c, i) => ({ category: c.category || 'Primary Cost Category', name: String(c.name || ''), paise: c.amount === undefined && cc.length === 1 ? entryPaise : P.try(`${path}[${i}].amount`, () => toPaise(c.amount, { field: 'amount', decimals })) || 0 }));
  const total = out.reduce((s, c) => s + c.paise, 0);
  if (total !== entryPaise) P.add(path, `cost centre amounts add up to ${fromPaise(total)} but the entry is ${fromPaise(entryPaise)}`);
  return out;
}

function normaliseBank(bank, path, P, date) {
  if (!bank) return undefined;
  const mode = String(bank.mode || bank.transactionType || 'others').toLowerCase();
  const transactionType = BANK_MODES[mode] || bank.transactionType || null;
  if (!transactionType) P.add(`${path}.mode`, `unknown mode; use one of ${Object.keys(BANK_MODES).join(', ')}, or give transactionType`);
  return {
    transactionType,
    transferMode: ['neft', 'rtgs', 'imps'].includes(mode) ? mode.toUpperCase() : undefined,
    instrumentNumber: bank.instrumentNumber || bank.utr || bank.chequeNumber || undefined,
    instrumentDate: bank.instrumentDate ? P.try(`${path}.instrumentDate`, () => parseDate(bank.instrumentDate, { field: 'instrumentDate' })) : date,
    bankName: bank.bankName || undefined,
    upiId: bank.upiId || undefined,
    bankersDate: bank.bankersDate ? P.try(`${path}.bankersDate`, () => parseDate(bank.bankersDate, { field: 'bankersDate' })) : undefined,
  };
}

/**
 * Normalise and validate a voucher input. Returns a plan (paise amounts, canonical names).
 * @param {any} ctx
 * @param {any} input
 * @param {{forAlter?: boolean}} [opts]
 */
export async function normaliseVoucher(ctx, input, opts = {}) {
  const P = new Problems();
  if (!checkKeys(input, MODEL_KEYS, 'voucher', P)) P.throwIfAny();
  const ref = await refData(ctx);
  const decimals = ctx.profile.decimals ?? 2;

  // Kind and voucher type
  let kind = input.kind ? String(input.kind).toLowerCase() : null;
  let voucherType = input.voucherType || null;
  if (kind && !KINDS[kind]) P.add('kind', `unknown kind; use one of ${KIND_NAMES.join(', ')}`);
  if (voucherType) voucherType = P.try('voucherType', () => resolveName(new Map(ref.vt.names.map((n) => [norm(n), { name: n }])), ref.vt.names, voucherType, 'Voucher type'));
  const baseType = voucherType ? ref.vt.base(voucherType) : kind && KINDS[kind] ? KINDS[kind].base : null;
  if (!kind && baseType) kind = kindForBase(baseType);
  if (!kind) {
    if (input.items || input.consumed) P.add('kind', 'say which kind of voucher this is (e.g. "sales", "purchase", "stock-journal")');
    else kind = 'journal';
  }
  if (kind && KINDS[kind] && voucherType && baseType && kindForBase(baseType) && kindForBase(baseType) !== kind) {
    P.add('voucherType', `"${voucherType}" is a ${baseType} type, which does not match kind "${kind}"`);
  }
  if (!voucherType && kind && KINDS[kind]) {
    const def = KINDS[kind].base;
    voucherType = ref.vt.names.find((n) => norm(n) === norm(def)) || null;
    if (!voucherType) P.add('voucherType', `no voucher type named "${def}" in this company; pass voucherType`);
  }
  const spec = KINDS[kind] || KINDS.journal;
  const date = P.try('date', () => {
    const d = parseDate(input.date, { field: 'date' });
    if (!d) throw new Error('date is required (YYYY-MM-DD)');
    return d;
  });
  const reference = typeof input.reference === 'string' ? { number: input.reference } : input.reference ? { number: input.reference.number, date: input.reference.date ? P.try('reference.date', () => parseDate(input.reference.date, { field: 'reference.date' })) : undefined } : undefined;
  const plan = {
    kind,
    shape: spec.shape,
    voucherType,
    baseType: baseType || spec.base,
    date,
    number: input.number ? String(input.number) : undefined,
    reference,
    narration: input.narration || undefined,
    party: undefined,
    placeOfSupply: undefined,
    optional: !!input.optional,
    entries: [],
    items: [],
    raw: input.raw || undefined,
  };
  const resolveLedger = (name, path) => P.try(path, () => resolveName(ref.ledgers, ref.ledgerNames, name, 'Ledger'));
  const resolveItem = (name, path) => P.try(path, () => resolveName(ref.items, ref.itemNames, name, 'Stock item'));
  const resolveGodown = (name, path) => P.try(path, () => resolveName(ref.godowns, ref.godownNames, name, 'Godown'));

  if (input.party) plan.party = resolveLedger(input.party, 'party');

  if (spec.shape === 'accounting') {
    if (!Array.isArray(input.entries) || input.entries.length < 2) P.add('entries', 'an accounting voucher needs at least two entries [{ledger, debit|credit}]');
    (input.entries || []).forEach((e, i) => {
      const path = `entries[${i}]`;
      if (!checkKeys(e, ENTRY_KEYS, path, P)) return;
      const ledger = resolveLedger(e.ledger, `${path}.ledger`);
      const sa = sideAmount(e, path, P, decimals);
      if (!ledger || !sa) return;
      const info = ref.ledgers.get(norm(ledger));
      const entry = { ledger, side: sa.side, paise: sa.paise, isParty: !!e.isParty || (plan.party && norm(plan.party) === norm(ledger)) };
      entry.bills = normaliseBills(e.bills, sa.paise, `${path}.bills`, P, decimals);
      if (info?.billWise && !entry.bills && !opts.forAlter) {
        P.add(`${path}.bills`, `"${ledger}" keeps bill-wise details: add "bills" (e.g. [{"type":"against","ref":"INV-101","amount":${fromPaise(sa.paise)}}]) or "bills": "on-account"`);
      }
      entry.bank = normaliseBank(e.bank, `${path}.bank`, P, date);
      entry.costCentres = normaliseCostCentres(e.costCentres, sa.paise, `${path}.costCentres`, P, decimals);
      entry.raw = e.raw;
      plan.entries.push(entry);
    });
    if (!plan.party && (kind === 'receipt' || kind === 'payment')) {
      const partyEntry = plan.entries.find((e) => e.bills || /debtor|creditor/i.test(ref.ledgers.get(norm(e.ledger))?.primaryGroup || ''));
      if (partyEntry) {
        plan.party = partyEntry.ledger;
        partyEntry.isParty = true;
      }
    }
  } else if (spec.shape === 'invoice') {
    await normaliseInvoice(ctx, input, plan, spec, ref, P, { resolveLedger, resolveItem, resolveGodown, decimals, opts });
  } else if (spec.shape === 'stock') {
    normaliseStock(input, plan, ref, P, { resolveItem, resolveGodown, decimals });
  }

  // Balance check
  const dr = plan.entries.filter((e) => e.side === 'debit').reduce((s, e) => s + e.paise, 0) + plan.items.filter((it) => it.side === 'debit').reduce((s, it) => s + it.paise, 0);
  const cr = plan.entries.filter((e) => e.side === 'credit').reduce((s, e) => s + e.paise, 0) + plan.items.filter((it) => it.side === 'credit').reduce((s, it) => s + it.paise, 0);
  plan.totals = { debit: dr, credit: cr };
  if (spec.shape !== 'stock' && dr !== cr && !P.list.length) P.add('voucher', `debits (${fromPaise(dr)}) and credits (${fromPaise(cr)}) do not match; difference ${fromPaise(dr - cr)}`);
  const partyEntry = plan.entries.find((e) => e.isParty);
  plan.listTotal = spec.shape === 'stock' ? undefined : partyEntry ? partyEntry.paise : dr;
  plan.total = spec.shape === 'invoice' ? plan.partyPaise : spec.shape === 'stock' ? plan.items.filter((i) => i.direction === 'out').reduce((s, i) => s + i.paise, 0) : dr;
  if (input.expectedTotal !== undefined && plan.total !== undefined) {
    const exp = P.try('expectedTotal', () => toPaise(input.expectedTotal, { field: 'expectedTotal', decimals }));
    if (exp !== undefined && exp !== plan.total) P.add('expectedTotal', `computed total is ${fromPaise(plan.total)}, not ${fromPaise(exp)}`, { computed: fromPaise(plan.total) });
  }
  P.throwIfAny();
  return plan;
}

async function companyState(ctx) {
  if (ctx.profile.gst?.companyState) return ctx.profile.gst.companyState;
  return ctx.memo('companystate', async () => {
    const rows = await listCompanies(ctx);
    const want = ctx.profile.company;
    const c = want ? rows.find((r) => norm(r.name) === norm(want)) : rows.find((r) => r.active) || rows[0];
    return c?.state || null;
  });
}

async function normaliseInvoice(ctx, input, plan, spec, ref, P, h) {
  const { resolveLedger, resolveItem, resolveGodown, decimals, opts } = h;
  const partySide = spec.partySide;
  const itemSide = opposite(partySide);
  if (!plan.party) P.add('party', 'party ledger is required for this kind of voucher');
  const partyInfo = plan.party ? ref.ledgers.get(norm(plan.party)) : null;
  const defaultLedger = input[spec.ledgerKey];
  const items = input.items || [];
  const charges = input.charges || [];
  if (!items.length && !charges.length && !Array.isArray(input.ledgers)) P.add('items', 'give items [{item, qty, rate, ledger}] (or charges for a service invoice)');
  const taxable = [];
  items.forEach((it, i) => {
    const path = `items[${i}]`;
    if (!checkKeys(it, ITEM_KEYS, path, P)) return;
    const item = resolveItem(it.item, `${path}.item`);
    const info = item ? ref.items.get(norm(item)) : null;
    const qty = P.try(`${path}.qty`, () => toQty(it.qty, { field: 'qty' }));
    const unit = it.unit || info?.unit || '';
    if (it.unit && info?.unit && norm(it.unit) !== norm(info.unit)) P.add(`${path}.unit`, `item "${item}" is kept in "${info.unit}", not "${it.unit}"`);
    const rate = Number(it.rate);
    if (!Number.isFinite(rate) || rate <= 0) P.add(`${path}.rate`, 'rate must be a positive number (the price is always given by the caller)');
    if (Number.isFinite(rate) && (String(rate).split('.')[1] || '').length > 4) P.add(`${path}.rate`, 'rate has more than 4 decimal places');
    const disc = it.discountPct ? Number(it.discountPct) : 0;
    if (!(disc >= 0 && disc < 100)) P.add(`${path}.discountPct`, 'must be between 0 and 100');
    let paise;
    if (qty && Number.isFinite(rate)) {
      paise = lineAmountPaise(qty, rate, disc);
      if (it.amount !== undefined) {
        const given = P.try(`${path}.amount`, () => toPaise(it.amount, { field: 'amount', decimals }));
        if (given !== undefined && Math.abs(given - paise) > 1) P.add(`${path}.amount`, `qty x rate${disc ? ' less discount' : ''} is ${fromPaise(paise)}, not ${fromPaise(given)}`);
        else if (given !== undefined) paise = given;
      }
    }
    const ledgerName = it.ledger || defaultLedger;
    const ledger = ledgerName ? resolveLedger(ledgerName, `${path}.ledger`) : null;
    if (!ledgerName && !spec.order) P.add(`${path}.ledger`, `which ${spec.taxDir === 'output' ? 'sales' : 'purchase'} ledger? (or set "${spec.ledgerKey}" for all items)`);
    const godownName = it.godown || input.godown;
    const godown = godownName ? resolveGodown(godownName, `${path}.godown`) : ref.godownNames.find((g) => norm(g) === 'main location') || null;
    const gstRate = it.gstRate !== undefined ? Number(it.gstRate) : info?.gstRate || 0;
    const orderNo = it.orderNo || input.orderNo || (spec.order ? plan.number || undefined : undefined);
    const dueDate = it.dueDate || input.dueDate ? P.try(`${path}.dueDate`, () => parseDate(it.dueDate || input.dueDate, { field: 'dueDate' })) : undefined;
    if (paise === undefined || !item) return;
    plan.items.push({ item, qty, unit, rate, per: it.per || unit, discountPct: disc || undefined, paise, ledger, godown, batch: it.batch || undefined, orderNo, dueDate, side: itemSide, direction: spec.stock, gstRate, raw: it.raw });
    taxable.push({ taxable: paise, rate: gstRate });
  });
  // Charges: added to the invoice (same side as items) unless "deduct" (discount allowed/received).
  charges.forEach((c, i) => {
    const path = `charges[${i}]`;
    if (!checkKeys(c, CHARGE_KEYS, path, P)) return;
    const ledger = resolveLedger(c.ledger, `${path}.ledger`);
    const paise = P.try(`${path}.amount`, () => toPaise(c.amount, { field: 'amount', decimals }));
    if (!ledger || paise === undefined) return;
    plan.entries.push({ ledger, side: c.deduct ? partySide : itemSide, paise, raw: c.raw, kind: 'charge' });
    if (c.gstRate) taxable.push({ taxable: c.deduct ? -paise : paise, rate: Number(c.gstRate) });
  });
  // Pre-built ledger lines (from a fetched voucher being re-posted)
  if (Array.isArray(input.ledgers)) {
    input.ledgers.forEach((e, i) => {
      const path = `ledgers[${i}]`;
      if (!checkKeys(e, ENTRY_KEYS, path, P)) return;
      if (e.isParty || (plan.party && norm(e.ledger) === norm(plan.party))) return; // party line is rebuilt
      const ledger = resolveLedger(e.ledger, `${path}.ledger`);
      const sa = sideAmount(e, path, P, decimals);
      if (ledger && sa) plan.entries.push({ ledger, side: sa.side, paise: sa.paise, raw: e.raw, kind: 'ledger' });
    });
  }
  // Taxes
  const taxes = input.taxes === undefined ? (Array.isArray(input.ledgers) ? 'none' : taxable.some((t) => t.rate) ? 'auto' : 'none') : input.taxes;
  if (taxes === 'auto') {
    const cfg = ctx.profile.gst || {};
    const cs = await companyState(ctx);
    const pos = input.placeOfSupply || partyInfo?.state || null;
    const r = P.try('taxes', () =>
      splitGst({ lines: taxable, companyState: cs, placeOfSupply: pos, ledgers: autoTaxLedgers(cfg.ledgers || {}, ref, spec.taxDir), byRate: cfg.byRate || {} }),
    );
    if (r) {
      plan.placeOfSupply = r.placeOfSupply;
      for (const t of r.taxes) {
        const ledger = resolveLedger(t.ledger, 'taxes');
        if (ledger && t.amount) plan.entries.push({ ledger, side: t.amount > 0 ? itemSide : partySide, paise: Math.abs(t.amount), kind: 'tax' });
      }
      plan.gst = { interState: r.interState, placeOfSupply: r.placeOfSupply };
    }
  } else if (Array.isArray(taxes)) {
    taxes.forEach((t, i) => {
      const ledger = resolveLedger(t.ledger, `taxes[${i}].ledger`);
      const paise = P.try(`taxes[${i}].amount`, () => toPaise(t.amount, { field: 'amount', decimals }));
      if (ledger && paise) plan.entries.push({ ledger, side: itemSide, paise, kind: 'tax' });
    });
  } else if (taxes !== 'none') P.add('taxes', 'must be "auto", "none" or a list of {ledger, amount}');
  if (input.placeOfSupply && !plan.placeOfSupply) {
    const st = findState(input.placeOfSupply);
    plan.placeOfSupply = st ? st.name : input.placeOfSupply;
  }
  // Round off
  const signedTotal = () => plan.items.reduce((s, it) => s + it.paise, 0) + plan.entries.reduce((s, e) => s + (e.side === itemSide ? e.paise : -e.paise), 0);
  if (input.roundOff) {
    const ro = input.roundOff === 'auto' ? { amount: 'auto' } : input.roundOff;
    const ledgerName = ro.ledger || ctx.profile.roundOffLedger || ref.ledgerNames.find((n) => /round/i.test(n));
    const ledger = ledgerName ? resolveLedger(ledgerName, 'roundOff.ledger') : P.add('roundOff.ledger', 'no round-off ledger: pass roundOff.ledger or set roundOffLedger in the profile');
    let delta;
    if (ro.amount === 'auto') {
      const t = signedTotal();
      delta = Math.round(t / 100) * 100 - t;
    } else delta = P.try('roundOff.amount', () => toPaise(ro.amount, { field: 'roundOff.amount', decimals, allowNegative: true }));
    if (ledger && delta) plan.entries.push({ ledger, side: delta > 0 ? itemSide : partySide, paise: Math.abs(delta), kind: 'roundoff' });
  }
  const total = signedTotal();
  if (total <= 0 && !P.list.length) P.add('voucher', `the invoice total works out to ${fromPaise(total)}`);
  plan.partyPaise = total;
  // Party line with bills
  if (plan.party) {
    let bills = input.bills;
    if (bills === undefined) {
      const fromLedgers = Array.isArray(input.ledgers) ? input.ledgers.find((e) => e.isParty || norm(e.ledger) === norm(plan.party))?.bills : undefined;
      if (fromLedgers) bills = fromLedgers;
      else if (partyInfo?.billWise && !spec.order) {
        if (plan.number) bills = [{ type: 'new', ref: plan.number, amount: fromPaise(total), creditDays: partyInfo.creditDays || undefined }];
        else if (!opts.forAlter) P.add('bills', `"${plan.party}" keeps bill-wise details: give "number" (used as the bill reference) or "bills" (e.g. [{"type":"new","ref":"INV-101"}])`);
      }
    }
    const party = { ledger: plan.party, side: partySide, paise: total, isParty: true, kind: 'party' };
    party.bills = normaliseBills(bills, total, 'bills', P, decimals);
    plan.entries.unshift(party);
  }
}

/** Pick output/input tax ledgers: configured names first, then common names found in the company. */
function autoTaxLedgers(cfgAll, ref, direction) {
  const cfg = cfgAll[direction] || (cfgAll.output || cfgAll.input ? {} : cfgAll);
  const find = (head) => {
    if (cfg[head]) return cfg[head];
    const names = ref.ledgerNames;
    const prefer = names.find((n) => new RegExp(`\\b${direction}\\b.*\\b${head}\\b|\\b${head}\\b.*\\b${direction}\\b`, 'i').test(n));
    if (prefer) return prefer;
    return names.find((n) => new RegExp(`^${head}$`, 'i').test(n.trim())) || null;
  };
  return { cgst: find('cgst'), sgst: find('sgst') || find('utgst'), igst: find('igst'), cess: find('cess') };
}

function normaliseStock(input, plan, ref, P, h) {
  const { resolveItem, resolveGodown, decimals } = h;
  const side = (list, dir, key) => {
    (list || []).forEach((it, i) => {
      const path = `${key}[${i}]`;
      if (!checkKeys(it, ITEM_KEYS, path, P)) return;
      const item = resolveItem(it.item, `${path}.item`);
      const info = item ? ref.items.get(norm(item)) : null;
      const qty = P.try(`${path}.qty`, () => toQty(it.qty, { field: 'qty' }));
      const rate = Number(it.rate ?? 0);
      if (!Number.isFinite(rate) || rate < 0) P.add(`${path}.rate`, 'rate must be zero or positive');
      const godown = it.godown ? resolveGodown(it.godown, `${path}.godown`) : ref.godownNames.find((g) => norm(g) === 'main location') || null;
      const paise = it.amount !== undefined ? P.try(`${path}.amount`, () => toPaise(it.amount, { field: 'amount', decimals })) : qty && Number.isFinite(rate) ? lineAmountPaise(qty, rate) : undefined;
      if (!item || !qty || paise === undefined) return;
      plan.items.push({ item, qty, unit: it.unit || info?.unit || '', rate, per: it.unit || info?.unit || '', paise, godown, batch: it.batch, direction: dir, side: dir === 'out' ? 'credit' : 'debit', raw: it.raw });
    });
  };
  side(input.consumed, 'out', 'consumed');
  side(input.produced, 'in', 'produced');
  if (!plan.items.length) P.add('consumed', 'a stock journal needs consumed and/or produced items');
}
