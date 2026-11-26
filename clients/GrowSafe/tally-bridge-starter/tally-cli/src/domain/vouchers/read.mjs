/**
 * Reading vouchers: list (header + amounts) and get (full detail in the same JSON shape that
 * "voucher create" accepts, so a read voucher can be edited and re-posted).
 */
import { TallyCliError } from '../../core/errors.mjs';
import { F, tdlString } from '../../core/tdl.mjs';
import { roundMoney } from '../../core/amounts.mjs';
import { today, addDays } from '../../core/dates.mjs';
import { norm, period, companyBooksFrom } from '../common.mjs';

export const HEADER_FIELDS = [
  { key: 'guid', method: 'Guid' },
  { key: 'masterId', method: 'MasterId', type: 'number' },
  { key: 'alterId', method: 'AlterId', type: 'number' },
  { key: 'date', method: 'Date', type: 'date' },
  { key: 'voucherType', method: 'VoucherTypeName' },
  { key: 'number', method: 'VoucherNumber' },
  { key: 'reference', method: 'Reference' },
  { key: 'referenceDate', method: 'ReferenceDate', type: 'date' },
  { key: 'narration', method: 'Narration' },
  { key: 'party', method: 'PartyLedgerName' },
  { key: 'placeOfSupply', method: 'PlaceOfSupply' },
  { key: 'isInvoice', method: 'IsInvoice', type: 'logical' },
  { key: 'isOptional', method: 'IsOptional', type: 'logical' },
  { key: 'isCancelled', method: 'IsCancelled', type: 'logical' },
  { key: 'view', method: 'PersistedView' },
  { key: 'irnAckNo', method: 'IRNAckNo' },
  { key: 'irn', method: 'IRN' },
];

const ENTRY_FIELDS = [
  { key: 'guid', method: 'Guid' },
  { key: 'ledger', method: 'LedgerName' },
  { key: 'amount', method: 'Amount', type: 'amount' },
  { key: 'isParty', method: 'IsPartyLedger', type: 'logical' },
];

const BILL_FIELDS = [
  { key: 'guid', method: 'Guid' },
  { key: 'ledger', method: 'LedgerName' },
  { key: 'name', method: 'Name' },
  { key: 'billType', method: 'BillType' },
  { key: 'amount', method: 'Amount', type: 'amount' },
  { key: 'creditDays', expr: '$$Number:$BillCreditPeriod', type: 'number' },
];

const BANK_FIELDS = [
  { key: 'guid', method: 'Guid' },
  { key: 'ledger', method: 'LedgerName' },
  { key: 'transactionType', method: 'TransactionType' },
  { key: 'instrumentNumber', method: 'InstrumentNumber' },
  { key: 'instrumentDate', method: 'InstrumentDate', type: 'date' },
  { key: 'bankName', method: 'BankName' },
  { key: 'amount', method: 'Amount', type: 'amount' },
  { key: 'bankersDate', method: 'BankersDate', type: 'date' },
];

const COST_FIELDS = [
  { key: 'guid', method: 'Guid' },
  { key: 'ledger', method: 'LedgerName' },
  { key: 'category', method: 'Category' },
  { key: 'name', method: 'Name' },
  { key: 'amount', method: 'Amount', type: 'amount' },
];

export const INVENTORY_FIELDS = [
  { key: 'guid', method: 'Guid' },
  { key: 'item', method: 'StockItemName' },
  { key: 'qty', method: 'ActualQty', type: 'qty' },
  { key: 'billedQty', method: 'BilledQty', type: 'qty' },
  { key: 'rate', method: 'Rate', type: 'rate' },
  { key: 'amount', method: 'Amount', type: 'amount' },
  { key: 'discount', method: 'Discount', type: 'number' },
  { key: 'inward', method: 'IsDeemedPositive', type: 'logical' },
];

const BATCH_FIELDS = [
  { key: 'guid', method: 'Guid' },
  { key: 'item', method: 'StockItemName' },
  { key: 'godown', method: 'GodownName' },
  { key: 'destination', method: 'DestinationGodownName' },
  { key: 'batch', method: 'BatchName' },
  { key: 'qty', method: 'ActualQty', type: 'qty' },
  { key: 'amount', method: 'Amount', type: 'amount' },
  { key: 'orderNo', method: 'OrderNo' },
  { key: 'dueDate', method: 'OrderDueDate', type: 'date' },
  { key: 'inward', method: 'IsDeemedPositive', type: 'logical' },
];

const ALLOC_FIELDS = [
  { key: 'guid', method: 'Guid' },
  { key: 'item', method: 'StockItemName' },
  { key: 'ledger', method: 'LedgerName' },
  { key: 'amount', method: 'Amount', type: 'amount' },
];

const BILL_TYPES = { 'new ref': 'new', 'agst ref': 'against', advance: 'advance', 'on account': 'on-account' };

/** Voucher types with their base type, memoised. */
export async function voucherTypes(ctx) {
  return ctx.memo('vouchertypes', async () => {
    const rows = await ctx.client.rows({ collection: { type: 'VoucherType' }, fields: [{ key: 'name', method: 'Name' }, { key: 'parent', method: 'Parent' }] });
    const byName = new Map(rows.map((r) => [norm(r.name), r]));
    const base = (name) => {
      let cur = byName.get(norm(name));
      for (let i = 0; i < 20 && cur; i++) {
        if (!cur.parent || norm(cur.parent) === norm(cur.name)) return cur.name;
        const next = byName.get(norm(cur.parent));
        if (!next) return cur.parent;
        cur = next;
      }
      return cur ? cur.name : name;
    };
    return { list: rows.map((r) => ({ name: r.name, baseType: base(r.name) })), base, names: rows.map((r) => r.name) };
  });
}

export const statusOf = (h) => (h.isCancelled ? 'cancelled' : h.isOptional ? 'optional' : 'regular');

function statusFilters(status) {
  if (status === 'regular') return [F.notCancelled(), F.notOptional()];
  if (status === 'optional') return ['$IsOptional', F.notCancelled()];
  if (status === 'cancelled') return ['$IsCancelled'];
  if (status === 'active') return [F.notCancelled()];
  return [];
}

/** Whole-books period used when looking a voucher up by id without a date. */
export async function wholePeriod(ctx) {
  const from = (await companyBooksFrom(ctx)) || '2000-04-01';
  return { from, to: addDays(today(), 400) };
}

/**
 * List vouchers with totals.
 * @param {{from?, to?, fy?, type?, party?, ledger?, number?, status?, limit?, search?}} input
 */
export async function listVouchers(ctx, input) {
  const p = await period(ctx, input);
  const vt = await voucherTypes(ctx);
  const filters = statusFilters(input.status || 'active');
  let baseFilter = null;
  if (input.type) {
    const exact = vt.names.find((n) => norm(n) === norm(input.type));
    if (!exact) {
      const bases = new Set(vt.list.map((t) => norm(t.baseType)));
      if (!bases.has(norm(input.type))) throw new TallyCliError('E_NOT_FOUND', `Voucher type "${input.type}" does not exist.`, { hint: `Known types: ${vt.names.join(', ')}` });
    }
    const children = vt.list.filter((t) => norm(t.baseType) === norm(input.type) && norm(t.name) !== norm(input.type));
    if (exact && !children.length) filters.push(F.voucherType(exact));
    else baseFilter = norm(input.type);
  }
  if (input.party) filters.push(`$$IsEqual:$PartyLedgerName:${tdlString(input.party)}`);
  if (input.number) filters.push(`$$IsEqual:$VoucherNumber:${tdlString(input.number)}`);
  const chunk = { from: p.from, to: p.to, chunk: true };
  let headers = await ctx.client.rows({ collection: { type: 'Voucher', filters }, fields: HEADER_FIELDS }, chunk);
  if (baseFilter) headers = headers.filter((h) => norm(vt.base(h.voucherType)) === baseFilter || norm(h.voucherType) === baseFilter);
  const entries = await ctx.client.rows({ collection: { type: 'Voucher', route: ['AllLedgerEntries'], filters }, fields: ENTRY_FIELDS }, chunk);
  const byGuid = groupBy(entries, 'guid');
  let out = headers.map((h) => summarise(h, byGuid.get(h.guid) || [], vt));
  if (input.ledger) {
    const l = norm(input.ledger);
    out = out.filter((v) => (byGuid.get(v.guid) || []).some((e) => norm(e.ledger) === l));
  }
  if (input.search) {
    const q = norm(input.search);
    out = out.filter((v) => [v.number, v.party, v.narration, v.reference].some((x) => norm(x).includes(q)));
  }
  out.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.masterId - b.masterId));
  const total = roundMoney(out.filter((v) => v.status === 'regular').reduce((s, v) => s + v.total, 0));
  return { period: p, count: out.length, totalOfRegular: total, vouchers: input.limit ? out.slice(-input.limit) : out };
}

function summarise(h, entries, vt) {
  const partyEntry = entries.find((e) => e.isParty) || (h.party ? entries.find((e) => norm(e.ledger) === norm(h.party)) : null);
  const debits = roundMoney(entries.filter((e) => e.amount < 0).reduce((s, e) => s - e.amount, 0));
  return {
    date: h.date,
    voucherType: h.voucherType,
    baseType: vt.base(h.voucherType),
    number: h.number || null,
    party: h.party || null,
    total: partyEntry ? Math.abs(partyEntry.amount) : debits,
    narration: h.narration || null,
    reference: h.reference || null,
    status: statusOf(h),
    masterId: h.masterId,
    guid: h.guid,
    alterId: h.alterId,
  };
}

function groupBy(rows, k) {
  const m = new Map();
  for (const r of rows) {
    if (!m.has(r[k])) m.set(r[k], []);
    m.get(r[k]).push(r);
  }
  return m;
}

/**
 * Resolve the filter and period for one voucher identified by masterId, guid, or type+number(+date).
 */
async function locate(ctx, { masterId, guid, type, number, date }) {
  if (masterId) return { filters: [F.masterId(masterId)], ...(date ? { from: date, to: date } : await wholePeriod(ctx)) };
  if (guid) return { filters: [`$$IsEqual:$Guid:${tdlString(guid)}`], ...(date ? { from: date, to: date } : await wholePeriod(ctx)) };
  if (number) {
    const filters = [`$$IsEqual:$VoucherNumber:${tdlString(number)}`];
    if (type) filters.push(F.voucherType(type));
    return { filters, ...(date ? { from: date, to: date } : await wholePeriod(ctx)) };
  }
  throw new TallyCliError('E_INPUT', 'Identify the voucher with --master-id, --guid, or --number (with --type, optionally --date).');
}

/** Get one voucher in full. */
export async function getVoucher(ctx, ident) {
  const loc = await locate(ctx, ident);
  const opts = { from: loc.from, to: loc.to };
  const headers = await ctx.client.rows({ collection: { type: 'Voucher', filters: loc.filters }, fields: HEADER_FIELDS }, opts);
  if (!headers.length) throw new TallyCliError('E_NOT_FOUND', 'No voucher matches.', { hint: 'Check the master id / number and type. "tally voucher find" can search by party, amount and date.' });
  if (headers.length > 1) {
    throw new TallyCliError('E_CONFLICT', `${headers.length} vouchers match; be more specific.`, {
      details: headers.map((h) => ({ date: h.date, voucherType: h.voucherType, number: h.number, masterId: h.masterId })),
      hint: 'Use --master-id, or add --type and --date.',
    });
  }
  const h = headers[0];
  const one = { filters: [F.masterId(h.masterId)], from: h.date, to: h.date };
  const get = (route, fields) => ctx.client.rows({ collection: { type: 'Voucher', route, filters: one.filters }, fields }, { from: one.from, to: one.to });
  const [all, ledgerOnly, bills, bank, cost, inv, batches, allocs] = [
    await get(['AllLedgerEntries'], ENTRY_FIELDS),
    await get(['LedgerEntries'], ENTRY_FIELDS),
    await get(['AllLedgerEntries', 'BillAllocations'], BILL_FIELDS),
    await get(['AllLedgerEntries', 'BankAllocations'], BANK_FIELDS),
    await get(['AllLedgerEntries', 'CategoryAllocations', 'CostCentreAllocations'], COST_FIELDS),
    await get(['AllInventoryEntries'], INVENTORY_FIELDS),
    await get(['AllInventoryEntries', 'BatchAllocations'], BATCH_FIELDS),
    await get(['AllInventoryEntries', 'AccountingAllocations'], ALLOC_FIELDS),
  ];
  const vt = await voucherTypes(ctx);
  return assembleVoucher(h, { all, ledgerOnly, bills, bank, cost, inv, batches, allocs }, vt);
}

/** Build the read model from row sets (exported for tests). */
export function assembleVoucher(h, rows, vt) {
  const sideOf = (amount) => (amount < 0 ? { debit: roundMoney(-amount) } : { credit: roundMoney(amount) });
  const takeBy = (list, ledger) => {
    const out = [];
    for (let i = 0; i < list.length; i++) if (norm(list[i].ledger) === norm(ledger) && !list[i]._used) {
      list[i]._used = true;
      out.push(list[i]);
    }
    return out;
  };
  const billRows = rows.bills.map((b) => ({ ...b }));
  const bankRows = rows.bank.map((b) => ({ ...b }));
  const costRows = rows.cost.map((b) => ({ ...b }));
  const mkEntry = (e) => {
    const out = { ledger: e.ledger, ...sideOf(e.amount) };
    if (e.isParty || (h.party && norm(e.ledger) === norm(h.party))) out.isParty = true;
    const bills = takeBy(billRows, e.ledger).map((b) => ({ type: BILL_TYPES[norm(b.billType)] || b.billType || 'new', ref: b.name || null, amount: Math.abs(b.amount), ...(b.creditDays ? { creditDays: b.creditDays } : {}) }));
    if (bills.length) out.bills = bills;
    const bank = takeBy(bankRows, e.ledger);
    if (bank.length) {
      const b = bank[0];
      out.bank = { transactionType: b.transactionType || null, instrumentNumber: b.instrumentNumber || null, instrumentDate: b.instrumentDate, bankName: b.bankName || null, bankersDate: b.bankersDate };
    }
    const cc = takeBy(costRows, e.ledger).map((c) => ({ category: c.category || null, name: c.name, amount: Math.abs(c.amount) }));
    if (cc.length) out.costCentres = cc;
    return out;
  };
  const items = [];
  const batchRows = rows.batches.map((b) => ({ ...b }));
  const allocRows = rows.allocs.map((a) => ({ ...a }));
  for (const it of rows.inv) {
    const b = batchRows.find((x) => !x._used && norm(x.item) === norm(it.item));
    if (b) b._used = true;
    const a = allocRows.find((x) => !x._used && norm(x.item) === norm(it.item));
    if (a) a._used = true;
    items.push({
      item: it.item,
      qty: Math.abs(it.qty.qty || it.billedQty.qty),
      unit: it.qty.unit || it.billedQty.unit || null,
      rate: it.rate.rate || null,
      per: it.rate.per || null,
      amount: Math.abs(it.amount),
      ...(it.discount ? { discountPct: it.discount } : {}),
      direction: it.inward ? 'in' : 'out',
      godown: b?.godown || null,
      ...(b?.destination ? { destinationGodown: b.destination } : {}),
      batch: b?.batch && !/primary batch/i.test(b.batch) ? b.batch : null,
      ...(b?.orderNo && !/not applicable/i.test(b.orderNo) ? { orderNo: b.orderNo, dueDate: b.dueDate } : {}),
      ledger: a?.ledger || null,
    });
  }
  const base = vt.base(h.voucherType);
  const isInvoiceShape = items.length > 0 && rows.inv.length > 0 && ['Sales', 'Purchase', 'Credit Note', 'Debit Note', 'Sales Order', 'Purchase Order', 'Delivery Note', 'Receipt Note'].includes(base);
  const entriesAll = rows.all.map(mkEntry);
  const v = {
    masterId: h.masterId,
    guid: h.guid,
    alterId: h.alterId,
    date: h.date,
    voucherType: h.voucherType,
    baseType: base,
    number: h.number || null,
    reference: h.reference ? { number: h.reference, date: h.referenceDate } : null,
    narration: h.narration || null,
    party: h.party || null,
    placeOfSupply: h.placeOfSupply || null,
    status: statusOf(h),
    view: h.view || null,
    ...(h.irnAckNo ? { irnAckNo: h.irnAckNo } : {}),
    ...(h.irn ? { irn: h.irn } : {}),
  };
  if (isInvoiceShape) {
    // Invoice: party/tax/charge lines come from LedgerEntries (or AllLedgerEntries minus item allocations)
    const itemLedgers = new Map();
    for (const it of items) if (it.ledger) itemLedgers.set(norm(it.ledger), (itemLedgers.get(norm(it.ledger)) || 0) + it.amount);
    let lines = rows.ledgerOnly.length ? rows.ledgerOnly : rows.all.filter((e) => !itemLedgers.has(norm(e.ledger)));
    billRows.forEach((b) => delete b._used);
    bankRows.forEach((b) => delete b._used);
    costRows.forEach((b) => delete b._used);
    lines = lines.map(mkEntry);
    v.items = items;
    v.ledgers = lines;
    const party = lines.find((l) => l.isParty);
    v.total = party ? party.debit || party.credit : roundMoney(items.reduce((s, i) => s + i.amount, 0));
  } else {
    v.entries = entriesAll;
    if (items.length) v.items = items;
    v.total = entriesAll.length ? roundMoney(entriesAll.reduce((s, e) => s + (e.debit || 0), 0)) : roundMoney(items.filter((i) => i.direction === 'out').reduce((s, i) => s + i.amount, 0));
  }
  return v;
}

/** Find vouchers by loose criteria (duplicate probe before posting). */
export async function findVouchers(ctx, input) {
  const date = input.date;
  const from = input.from || (date ? addDays(date, -(input.days ?? 0)) : undefined);
  const to = input.to || (date ? addDays(date, input.days ?? 0) : undefined);
  const res = await listVouchers(ctx, { from, to, type: input.type, party: input.party, number: input.number, status: input.status || 'all' });
  let rows = res.vouchers;
  if (input.amount !== undefined) rows = rows.filter((v) => Math.abs(v.total - Number(input.amount)) < 0.005);
  if (input.reference) rows = rows.filter((v) => norm(v.reference) === norm(input.reference));
  if (input.narration) rows = rows.filter((v) => norm(v.narration).includes(norm(input.narration)));
  return { period: res.period, count: rows.length, vouchers: rows };
}
