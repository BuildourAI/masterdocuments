/**
 * Reports built from flat exports, so they do not depend on the screen layout of Tally's own reports.
 * Amount conventions in outputs: balances are {amount, side: "Dr"|"Cr"}; movements are debit/credit columns.
 */
import { TallyCliError } from '../core/errors.mjs';
import { toSided, roundMoney } from '../core/amounts.mjs';
import { addDays, diffDays, today } from '../core/dates.mjs';
import { F, tdlString } from '../core/tdl.mjs';
import { norm, period, companyBooksFrom, resolveIn } from './common.mjs';
import { masterNames, underFn, resolveMaster } from './masters.mjs';
import { voucherTypes, HEADER_FIELDS, INVENTORY_FIELDS, statusOf } from './vouchers/read.mjs';
import { checkGstin, findState } from './gst.mjs';

const LEDGER_TB_FIELDS = [
  { key: 'name', method: 'Name' },
  { key: 'parent', method: 'Parent', type: 'parent' },
  { key: 'closing', method: 'ClosingBalance', type: 'amount' },
  { key: 'dr', method: 'DebitTotals', type: 'amount' },
  { key: 'cr', method: 'CreditTotals', type: 'amount' },
  { key: 'isRevenue', method: 'IsRevenue', type: 'logical' },
];

const GROUP_FIELDS = [
  { key: 'name', method: 'Name' },
  { key: 'parent', method: 'Parent', type: 'parent' },
  { key: 'isRevenue', method: 'IsRevenue', type: 'logical' },
  { key: 'isDeemedPositive', method: 'IsDeemedPositive', type: 'logical' },
  { key: 'affectsGrossProfit', method: 'AffectsGrossProfit', type: 'logical' },
];

const sum = (rows, f) => roundMoney(rows.reduce((s, r) => s + (typeof f === 'function' ? f(r) : r[f]) || 0, 0));

/** Ledger balances for a period: opening at from, debits, credits, closing at to (signed, debit negative). */
async function ledgerPeriod(ctx, p) {
  const rows = await ctx.client.rows({ collection: { type: 'Ledger' }, fields: LEDGER_TB_FIELDS }, { from: p.from, to: p.to });
  return rows.map((r) => {
    const dr = Math.abs(r.dr);
    const cr = Math.abs(r.cr);
    const opening = roundMoney(r.closing - cr + dr);
    return { name: r.name, parent: r.parent, isRevenue: r.isRevenue, opening, dr: roundMoney(dr), cr: roundMoney(cr), closing: r.closing };
  });
}

async function groupTree(ctx) {
  return ctx.memo('grouptree', async () => {
    const groups = await ctx.client.rows({ collection: { type: 'Group' }, fields: GROUP_FIELDS });
    const byName = new Map(groups.map((g) => [norm(g.name), g]));
    const primaryOf = (name) => {
      let g = byName.get(norm(name));
      for (let i = 0; i < 60 && g; i++) {
        if (!g.parent) return g;
        g = byName.get(norm(g.parent)) || g;
        if (!g.parent) return g;
      }
      return g;
    };
    return { groups, byName, primaryOf };
  });
}

const natureOf = (g) => (!g ? null : g.isRevenue ? (g.isDeemedPositive ? 'expense' : 'income') : g.isDeemedPositive ? 'asset' : 'liability');

export async function trialBalance(ctx, input) {
  const p = await period(ctx, input);
  const ledgers = await ledgerPeriod(ctx, p);
  const tree = await groupTree(ctx);
  let rows = ledgers.filter((l) => l.opening || l.dr || l.cr || l.closing);
  if (input.group) {
    const g = resolveIn(
      tree.groups.map((x) => x.name),
      input.group,
      'Group',
    );
    const isUnder = underFn(tree.groups, g);
    rows = rows.filter((l) => isUnder(l.parent));
  }
  const level = input.level || 'ledger';
  let out;
  if (level === 'group') {
    const by = new Map();
    for (const l of rows) {
      const pg = tree.primaryOf(l.parent);
      const k = pg ? pg.name : l.parent || '(none)';
      const t = by.get(k) || { group: k, nature: natureOf(pg), opening: 0, dr: 0, cr: 0, closing: 0 };
      t.opening += l.opening;
      t.dr += l.dr;
      t.cr += l.cr;
      t.closing += l.closing;
      by.set(k, t);
    }
    out = [...by.values()].map((t) => ({ group: t.group, nature: t.nature, opening: toSided(t.opening), debit: roundMoney(t.dr), credit: roundMoney(t.cr), closing: toSided(t.closing) }));
  } else {
    out = rows.map((l) => {
      const pg = tree.primaryOf(l.parent);
      return { ledger: l.name, group: l.parent, primaryGroup: pg?.name || null, opening: toSided(l.opening), debit: l.dr, credit: l.cr, closing: toSided(l.closing) };
    });
  }
  const closingDr = sum(rows.filter((l) => l.closing < 0), (l) => -l.closing);
  const closingCr = sum(rows.filter((l) => l.closing > 0), (l) => l.closing);
  // Opening stock sits in stock items, not ledgers; Tally shows it in the trial balance.
  const stock = await stockTotals(ctx, p).catch(() => null);
  const totals = { closingDebit: closingDr, closingCredit: closingCr, periodDebit: sum(rows, 'dr'), periodCredit: sum(rows, 'cr') };
  if (stock) {
    totals.openingStock = stock.opening;
    totals.closingStock = stock.closing;
  }
  const diff = roundMoney(closingDr + (stock ? stock.opening : 0) - closingCr);
  totals.difference = diff;
  if (Math.abs(diff) >= 1 && !input.group) ctx.warn(`Trial balance differs by ${diff} (ledger closing balances plus opening stock). Tally would show this as "Difference in opening balances" if the books themselves are unbalanced.`);
  return { period: p, level, totals, rows: out };
}

async function stockTotals(ctx, p) {
  const rows = await ctx.client.rows(
    {
      collection: { type: 'StockItem' },
      fields: [
        { key: 'ov', method: 'OpeningValue', type: 'amount' },
        { key: 'cv', method: 'ClosingValue', type: 'amount' },
      ],
    },
    { from: p.from, to: p.to },
  );
  return { opening: sum(rows, (r) => Math.abs(r.ov)), closing: sum(rows, (r) => Math.abs(r.cv)) };
}

export async function profitLoss(ctx, input) {
  const p = await period(ctx, input);
  const ledgers = await ledgerPeriod(ctx, p);
  const tree = await groupTree(ctx);
  const stock = await stockTotals(ctx, p);
  const sections = new Map();
  for (const l of ledgers) {
    const pg = tree.primaryOf(l.parent);
    if (!pg || !pg.isRevenue) continue;
    const net = roundMoney(l.cr - l.dr); // credit positive = income
    if (!net) continue;
    const s = sections.get(pg.name) || { group: pg.name, nature: natureOf(pg), trading: !!pg.affectsGrossProfit, amount: 0, ledgers: [] };
    s.amount = roundMoney(s.amount + net);
    s.ledgers.push({ ledger: l.name, amount: Math.abs(net), side: net >= 0 ? 'Cr' : 'Dr' });
    sections.set(pg.name, s);
  }
  const list = [...sections.values()];
  const tradingNet = sum(
    list.filter((s) => s.trading),
    'amount',
  );
  const grossProfit = roundMoney(tradingNet + stock.closing - stock.opening);
  const indirectNet = sum(
    list.filter((s) => !s.trading),
    'amount',
  );
  const netProfit = roundMoney(grossProfit + indirectNet);
  return {
    period: p,
    openingStock: stock.opening,
    closingStock: stock.closing,
    grossProfit,
    netProfit,
    result: netProfit >= 0 ? 'profit' : 'loss',
    sections: list.map((s) => ({ group: s.group, nature: s.nature, trading: s.trading, amount: Math.abs(s.amount), side: s.amount >= 0 ? 'Cr' : 'Dr', ledgers: s.ledgers })),
    note: 'Computed from ledger movements in the period and stock values; compare with Tally\'s own P&L when in doubt (stock valuation methods can differ).',
  };
}

export async function balanceSheet(ctx, input) {
  const asOf = input.asOf || input.to || today();
  const booksFrom = (await companyBooksFrom(ctx)) || null;
  const p = await period(ctx, { to: asOf, from: input.from });
  const ledgers = await ledgerPeriod(ctx, p);
  const tree = await groupTree(ctx);
  const pl = await profitLoss(ctx, { from: p.from, to: p.to });
  const sides = { liabilities: new Map(), assets: new Map() };
  let plOpening = 0;
  for (const l of ledgers) {
    const pg = tree.primaryOf(l.parent);
    if (norm(l.name) === 'profit & loss a/c') {
      plOpening = l.opening;
      continue;
    }
    if (!pg || pg.isRevenue) continue;
    const side = pg.isDeemedPositive ? 'assets' : 'liabilities';
    const bal = side === 'assets' ? -l.closing : l.closing;
    if (!bal) continue;
    const m = sides[side];
    const s = m.get(pg.name) || { group: pg.name, amount: 0, ledgers: [] };
    s.amount = roundMoney(s.amount + bal);
    s.ledgers.push({ ledger: l.name, group: l.parent, amount: roundMoney(bal) });
    m.set(pg.name, s);
  }
  const stockGroup = sides.assets.get('Current Assets') || { group: 'Current Assets', amount: 0, ledgers: [] };
  stockGroup.amount = roundMoney(stockGroup.amount + pl.closingStock);
  stockGroup.ledgers.push({ ledger: 'Closing Stock', group: 'Stock-in-Hand', amount: pl.closingStock });
  sides.assets.set('Current Assets', stockGroup);
  const plBalance = roundMoney(plOpening + pl.netProfit);
  const liab = [...sides.liabilities.values()];
  const assets = [...sides.assets.values()];
  liab.push({ group: 'Profit & Loss A/c', amount: plBalance, ledgers: [{ ledger: 'Opening balance', amount: roundMoney(plOpening) }, { ledger: 'Current period', amount: pl.netProfit }] });
  const totalL = sum(liab, 'amount');
  const totalA = sum(assets, 'amount');
  const diff = roundMoney(totalA - totalL);
  if (Math.abs(diff) >= 1) ctx.warn(`Balance sheet differs by ${diff}. Usual causes: opening balances that do not tally in Tally, or a books period starting before the chosen "from".`);
  return { asOf: p.to, periodFrom: p.from, booksFrom, liabilities: liab, assets, totals: { liabilities: totalL, assets: totalA, difference: diff } };
}

export async function groupSummary(ctx, input) {
  const p = await period(ctx, input);
  const tree = await groupTree(ctx);
  const ledgers = await ledgerPeriod(ctx, p);
  const target = input.group ? resolveIn(tree.groups.map((g) => g.name), input.group, 'Group') : null;
  const isUnderOf = (name) => underFn(tree.groups, name);
  const children = tree.groups.filter((g) => (target ? norm(g.parent) === norm(target) : !g.parent));
  const rows = [];
  for (const g of children) {
    const under = isUnderOf(g.name);
    const ls = ledgers.filter((l) => under(l.parent));
    const closing = sum(ls, 'closing');
    if (!closing && !sum(ls, 'dr') && !sum(ls, 'cr') && !input.all) continue;
    rows.push({ name: g.name, kind: 'group', opening: toSided(sum(ls, 'opening')), debit: sum(ls, 'dr'), credit: sum(ls, 'cr'), closing: toSided(closing) });
  }
  if (target) {
    for (const l of ledgers.filter((x) => norm(x.parent) === norm(target))) {
      if (!l.closing && !l.dr && !l.cr && !input.all) continue;
      rows.push({ name: l.name, kind: 'ledger', opening: toSided(l.opening), debit: l.dr, credit: l.cr, closing: toSided(l.closing) });
    }
  }
  return { period: p, group: target || 'Primary', rows };
}

// ---------------------------------------------------------------- outstanding / ageing

const BILL_FIELDS = [
  { key: 'party', method: 'Parent' },
  { key: 'ref', method: 'Name' },
  { key: 'date', method: 'BillDate', type: 'date' },
  { key: 'amount', method: 'ClosingBalance', type: 'amount' },
  { key: 'overdueDays', method: '_OverDueDays', type: 'number' },
];

export function parseBuckets(spec) {
  const edges = String(spec || '30,60,90,180')
    .split(',')
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => Number.isFinite(n) && n > 0)
    .sort((a, b) => a - b);
  const labels = [];
  let prev = 0;
  for (const e of edges) {
    labels.push({ label: `${prev}-${e}`, max: e });
    prev = e + 1;
  }
  labels.push({ label: `${edges.length ? edges[edges.length - 1] + 1 : 0}+`, max: Infinity });
  return labels;
}

/**
 * Pending bills with ageing.
 * @param {'receivable'|'payable'} kind
 */
export async function outstanding(ctx, kind, input) {
  const asOf = input.asOf || today();
  const group = kind === 'receivable' ? 'Sundry Debtors' : 'Sundry Creditors';
  const filters = [`$$IsEqual:($_PrimaryGroup:Group:($Parent:Ledger:$Parent)):${tdlString(group)}`];
  if (input.party) {
    const party = await resolveMaster(ctx, 'ledger', input.party);
    filters.push(`$$IsEqual:$Parent:${tdlString(party)}`);
  }
  const rows = await ctx.client.rows({ collection: { type: 'Bill', filters }, fields: BILL_FIELDS }, { to: asOf });
  const buckets = parseBuckets(input.buckets);
  const by = input.ageBy || 'bill-date';
  const bills = rows
    .map((b) => {
      // Receivables are debit (negative in Tally); payables credit. Normalise so "amount" is what is owed.
      const owed = kind === 'receivable' ? -b.amount : b.amount;
      const age = b.date ? diffDays(b.date, asOf) : null;
      const dueDate = b.date && b.overdueDays !== undefined && age !== null ? addDays(asOf, -b.overdueDays) : null;
      const basis = by === 'due-date' ? b.overdueDays : age;
      const bucket = basis === null ? 'unknown' : (buckets.find((x) => basis <= x.max) || buckets[buckets.length - 1]).label;
      return { party: b.party, ref: b.ref || '(on account)', date: b.date, amount: roundMoney(owed), ageDays: age, overdueDays: b.overdueDays || 0, dueDate: b.overdueDays > 0 ? dueDate : null, bucket, isAdvance: owed < 0 };
    })
    .filter((b) => Math.abs(b.amount) >= 0.005);
  if (input.minDays) bills.splice(0, bills.length, ...bills.filter((b) => (by === 'due-date' ? b.overdueDays : b.ageDays) >= input.minDays));
  if (input.group) {
    const groups = await masterNames(ctx, 'group');
    const ledgers = await masterNames(ctx, 'ledger');
    const canonical = resolveIn(groups.map((g) => g.name), input.group, 'Group');
    const isUnder = underFn(groups, canonical);
    const parentOf = new Map(ledgers.map((l) => [norm(l.name), l.parent]));
    bills.splice(0, bills.length, ...bills.filter((b) => isUnder(parentOf.get(norm(b.party)))));
  }
  const parties = new Map();
  for (const b of bills) {
    const p = parties.get(b.party) || { party: b.party, total: 0, overdue: 0, oldestDays: 0, bills: 0, buckets: Object.fromEntries(buckets.map((x) => [x.label, 0])) };
    p.total = roundMoney(p.total + b.amount);
    if (b.overdueDays > 0) p.overdue = roundMoney(p.overdue + b.amount);
    p.oldestDays = Math.max(p.oldestDays, b.ageDays || 0);
    p.bills++;
    if (b.bucket in p.buckets) p.buckets[b.bucket] = roundMoney(p.buckets[b.bucket] + b.amount);
    parties.set(b.party, p);
  }
  let partyRows = [...parties.values()].sort((a, b) => b.total - a.total);
  if (input.withContacts) {
    const ledgerRows = await ctx.client.rows({
      collection: { type: 'Ledger' },
      fields: [
        { key: 'name', method: 'Name' },
        { key: 'email', method: 'Email' },
        { key: 'mobile', method: 'LedgerMobile' },
        { key: 'contact', method: 'LedgerContact' },
        { key: 'creditDays', expr: '$$Number:$BillCreditPeriod', type: 'number' },
        { key: 'gstin', expr: 'if $$IsEmpty:$PartyGSTIN then $LedGSTRegDetails[Last].GSTIN else $PartyGSTIN' },
      ],
    });
    const byName = new Map(ledgerRows.map((l) => [norm(l.name), l]));
    partyRows = partyRows.map((p) => {
      const l = byName.get(norm(p.party)) || {};
      return { ...p, contact: { person: l.contact || null, phone: l.mobile || null, email: l.email || null }, creditDays: l.creditDays || 0, gstin: l.gstin || null };
    });
  }
  const totals = { total: sum(bills, 'amount'), overdue: sum(bills.filter((b) => b.overdueDays > 0), 'amount'), parties: partyRows.length, bills: bills.length, buckets: Object.fromEntries(buckets.map((x) => [x.label, sum(bills.filter((b) => b.bucket === x.label), 'amount')])) };
  const result = { kind, asOf, ageBy: by, totals, parties: partyRows };
  if (input.detail !== false) result.bills = bills.sort((a, b) => (a.party < b.party ? -1 : a.party > b.party ? 1 : (a.date || '') < (b.date || '') ? -1 : 1));
  return result;
}

// ---------------------------------------------------------------- statements and registers

const ENTRY_ROW_FIELDS = [
  { key: 'guid', method: 'Guid' },
  { key: 'masterId', method: 'MasterId', type: 'number' },
  { key: 'date', method: 'Date', type: 'date' },
  { key: 'voucherType', method: 'VoucherTypeName' },
  { key: 'number', method: 'VoucherNumber' },
  { key: 'narration', method: 'Narration' },
  { key: 'reference', method: 'Reference' },
  { key: 'ledger', method: 'LedgerName' },
  { key: 'amount', method: 'Amount', type: 'amount' },
];

/** Entries of regular vouchers in a period (all ledgers), chunked by month. */
async function periodEntries(ctx, p) {
  return ctx.client.rows({ collection: { type: 'Voucher', route: ['AllLedgerEntries'], filters: [F.notCancelled(), F.notOptional(), 'NOT $$IsOrderVch:$VoucherTypeName', 'NOT $$IsInventoryVch:$VoucherTypeName'] }, fields: ENTRY_ROW_FIELDS }, { from: p.from, to: p.to, chunk: true });
}

/** Ledger statement with running balance (works for parties, banks, cash, any ledger). */
export async function ledgerStatement(ctx, input) {
  const ledger = await resolveMaster(ctx, 'ledger', input.ledger);
  const p = await period(ctx, input);
  const openRows = await ctx.client.rows({ collection: { type: 'Ledger', filters: [F.eq('Name', ledger)] }, fields: [{ key: 'closing', method: 'ClosingBalance', type: 'amount' }] }, { to: addDays(p.from, -1) });
  let balance = openRows.length ? openRows[0].closing : 0;
  const booksFrom = await companyBooksFrom(ctx);
  if (booksFrom && p.from <= booksFrom) {
    const ob = await ctx.client.rows({ collection: { type: 'Ledger', filters: [F.eq('Name', ledger)] }, fields: [{ key: 'opening', method: 'OpeningBalance', type: 'amount' }] });
    balance = ob.length ? ob[0].opening : balance;
  }
  const opening = balance;
  const entries = await periodEntries(ctx, p);
  const byGuid = new Map();
  for (const e of entries) {
    if (!byGuid.has(e.guid)) byGuid.set(e.guid, []);
    byGuid.get(e.guid).push(e);
  }
  const lines = [];
  for (const list of byGuid.values()) {
    const mine = list.filter((e) => norm(e.ledger) === norm(ledger));
    if (!mine.length) continue;
    const amount = roundMoney(mine.reduce((s, e) => s + e.amount, 0));
    const others = list.filter((e) => norm(e.ledger) !== norm(ledger));
    const counter = others.filter((e) => Math.sign(e.amount) !== Math.sign(amount)).map((e) => e.ledger);
    const h = mine[0];
    lines.push({ date: h.date, voucherType: h.voucherType, number: h.number || null, particulars: [...new Set(counter.length ? counter : others.map((e) => e.ledger))].join(', ') || null, debit: amount < 0 ? -amount : 0, credit: amount > 0 ? amount : 0, narration: h.narration || null, reference: h.reference || null, masterId: h.masterId, _amount: amount });
  }
  lines.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.masterId - b.masterId));
  for (const l of lines) {
    balance = roundMoney(balance + l._amount);
    l.balance = toSided(balance);
    delete l._amount;
  }
  return { ledger, period: p, opening: toSided(opening), totals: { debit: sum(lines, 'debit'), credit: sum(lines, 'credit') }, closing: toSided(balance), lines };
}

export async function cashBankSummary(ctx, input) {
  const p = await period(ctx, input);
  const groups = await masterNames(ctx, 'group');
  const ledgers = await ledgerPeriod(ctx, p);
  const isCash = underFn(groups, 'Cash-in-Hand');
  const isBank = underFn(groups, 'Bank Accounts');
  const isOd = underFn(groups, 'Bank OD A/c');
  const rows = ledgers
    .filter((l) => isCash(l.parent) || isBank(l.parent) || isOd(l.parent))
    .map((l) => ({ ledger: l.name, kind: isCash(l.parent) ? 'cash' : isOd(l.parent) ? 'bank-od' : 'bank', opening: toSided(l.opening), debit: l.dr, credit: l.cr, closing: toSided(l.closing) }));
  return { period: p, rows };
}

/** Classify ledgers for registers: tax head, revenue, round-off. */
export async function ledgerClasses(ctx) {
  return ctx.memo('ledgerclasses', async () => {
    const rows = await ctx.client.rows({
      collection: { type: 'Ledger' },
      fields: [
        { key: 'name', method: 'Name' },
        { key: 'parent', method: 'Parent', type: 'parent' },
        { key: 'dutyHead', method: 'GSTDutyHead' },
        { key: 'isRevenue', method: 'IsRevenue', type: 'logical' },
        { key: 'gstin', expr: 'if $$IsEmpty:$PartyGSTIN then $LedGSTRegDetails[Last].GSTIN else $PartyGSTIN' },
        { key: 'state', method: 'LedStateName' },
      ],
    });
    const cfg = ctx.profile.gst?.ledgers || {};
    const byName = new Map();
    for (const r of rows) {
      let head = null;
      const dh = norm(r.dutyHead);
      const n = norm(r.name);
      if (dh.includes('central') || n === norm(cfg.cgst)) head = 'cgst';
      else if (dh.includes('state') || dh.includes('ut tax') || n === norm(cfg.sgst)) head = 'sgst';
      else if (dh.includes('integrated') || n === norm(cfg.igst)) head = 'igst';
      else if (dh.includes('cess') || n === norm(cfg.cess)) head = 'cess';
      else if (!dh && norm(r.parent) === 'duties & taxes') {
        if (/\bcgst\b|central/.test(n)) head = 'cgst';
        else if (/\bsgst\b|\butgst\b|state/.test(n)) head = 'sgst';
        else if (/\bigst\b|integrated/.test(n)) head = 'igst';
        else if (/cess/.test(n)) head = 'cess';
      }
      const roundOff = n === norm(ctx.profile.roundOffLedger) || /round/.test(n);
      byName.set(n, { ...r, head, roundOff });
    }
    return byName;
  });
}

/** Sales or purchase register with GST split. */
export async function register(ctx, kind, input) {
  const p = await period(ctx, input);
  const vt = await voucherTypes(ctx);
  const bases = kind === 'sales' ? ['Sales', ...(input.includeNotes ? ['Credit Note'] : [])] : ['Purchase', ...(input.includeNotes ? ['Debit Note'] : [])];
  const types = vt.list.filter((t) => bases.includes(t.baseType)).map((t) => t.name);
  if (!types.length) return { period: p, rows: [] };
  const typeFilter = types.map((t) => `$$IsEqual:$VoucherTypeName:${tdlString(t)}`).join(' OR ');
  const filters = [F.notCancelled(), F.notOptional(), `(${typeFilter})`];
  const headers = await ctx.client.rows({ collection: { type: 'Voucher', filters }, fields: HEADER_FIELDS }, { from: p.from, to: p.to, chunk: true });
  const entries = await ctx.client.rows({ collection: { type: 'Voucher', route: ['AllLedgerEntries'], filters }, fields: [{ key: 'guid', method: 'Guid' }, { key: 'ledger', method: 'LedgerName' }, { key: 'amount', method: 'Amount', type: 'amount' }, { key: 'isParty', method: 'IsPartyLedger', type: 'logical' }] }, { from: p.from, to: p.to, chunk: true });
  const classes = await ledgerClasses(ctx);
  const byGuid = new Map();
  for (const e of entries) {
    if (!byGuid.has(e.guid)) byGuid.set(e.guid, []);
    byGuid.get(e.guid).push(e);
  }
  const rows = headers.map((h) => {
    const es = byGuid.get(h.guid) || [];
    const party = es.find((e) => e.isParty) || es.find((e) => norm(e.ledger) === norm(h.party));
    const total = party ? Math.abs(party.amount) : 0;
    const sign = vt.base(h.voucherType) === 'Credit Note' || vt.base(h.voucherType) === 'Debit Note' ? -1 : 1;
    const t = { cgst: 0, sgst: 0, igst: 0, cess: 0, roundOff: 0 };
    for (const e of es) {
      if (e === party) continue;
      const c = classes.get(norm(e.ledger));
      const amt = Math.abs(e.amount) * (Math.sign(e.amount) === Math.sign(party ? -party.amount : 1) ? 1 : -1);
      if (c?.head) t[c.head] += amt;
      else if (c?.roundOff) t.roundOff += amt;
    }
    const tax = t.cgst + t.sgst + t.igst + t.cess;
    const partyInfo = classes.get(norm(h.party)) || {};
    return {
      date: h.date,
      voucherType: h.voucherType,
      number: h.number || null,
      reference: h.reference || null,
      party: h.party || null,
      gstin: partyInfo.gstin || null,
      placeOfSupply: h.placeOfSupply || partyInfo.state || null,
      taxable: roundMoney(sign * (total - tax - t.roundOff)),
      cgst: roundMoney(sign * t.cgst),
      sgst: roundMoney(sign * t.sgst),
      igst: roundMoney(sign * t.igst),
      cess: roundMoney(sign * t.cess),
      roundOff: roundMoney(sign * t.roundOff),
      total: roundMoney(sign * total),
      masterId: h.masterId,
    };
  });
  rows.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.masterId - b.masterId));
  const totals = Object.fromEntries(['taxable', 'cgst', 'sgst', 'igst', 'cess', 'roundOff', 'total'].map((k) => [k, sum(rows, k)]));
  return { kind, period: p, count: rows.length, totals, rows };
}

/** HSN-wise summary of sales or purchase items. */
export async function hsnSummary(ctx, input) {
  const p = await period(ctx, input);
  const vt = await voucherTypes(ctx);
  const kind = input.kind || 'sales';
  const bases = kind === 'sales' ? ['Sales'] : ['Purchase'];
  const types = vt.list.filter((t) => bases.includes(t.baseType)).map((t) => t.name);
  const filters = [F.notCancelled(), F.notOptional(), `(${types.map((t) => `$$IsEqual:$VoucherTypeName:${tdlString(t)}`).join(' OR ')})`];
  const inv = await ctx.client.rows({ collection: { type: 'Voucher', route: ['AllInventoryEntries'], filters }, fields: INVENTORY_FIELDS }, { from: p.from, to: p.to, chunk: true });
  const items = await ctx.client.rows({
    collection: { type: 'StockItem' },
    fields: [
      { key: 'name', method: 'Name' },
      { key: 'hsn', method: 'InfGSTHSNCode' },
      { key: 'rate', method: 'InfGSTIGSTRate', type: 'number' },
    ],
  });
  const info = new Map(items.map((i) => [norm(i.name), i]));
  const groups = new Map();
  for (const r of inv) {
    const i = info.get(norm(r.item)) || {};
    const k = `${i.hsn || '(no HSN)'}|${i.rate || 0}|${r.qty.unit}`;
    const g = groups.get(k) || { hsn: i.hsn || null, gstRate: i.rate || 0, unit: r.qty.unit || null, qty: 0, taxable: 0, items: new Set() };
    g.qty += Math.abs(r.qty.qty);
    g.taxable += Math.abs(r.amount);
    g.items.add(r.item);
    groups.set(k, g);
  }
  const rows = [...groups.values()].map((g) => ({ hsn: g.hsn, gstRate: g.gstRate, unit: g.unit, qty: roundMoney(g.qty), taxable: roundMoney(g.taxable), estimatedTax: roundMoney((g.taxable * g.gstRate) / 100), items: [...g.items] }));
  rows.sort((a, b) => String(a.hsn).localeCompare(String(b.hsn)));
  if (rows.some((r) => !r.hsn)) ctx.warn('Some items have no HSN code in Tally.');
  return { kind, period: p, rows, note: 'Item values only; taxes are estimated from item GST rates. Use the register for actual tax booked.' };
}

export async function partyGstins(ctx, input) {
  const classes = await ledgerClasses(ctx);
  const groups = await masterNames(ctx, 'group');
  const isDebtor = underFn(groups, 'Sundry Debtors');
  const isCreditor = underFn(groups, 'Sundry Creditors');
  const out = [];
  for (const l of classes.values()) {
    const debtor = isDebtor(l.parent);
    const creditor = isCreditor(l.parent);
    if (!debtor && !creditor) continue;
    const row = { party: l.name, kind: debtor ? 'customer' : 'supplier', gstin: l.gstin || null, state: l.state || null, valid: null, problems: [] };
    if (l.gstin) {
      const c = checkGstin(l.gstin);
      row.valid = c.valid;
      row.problems = c.problems;
      const st = findState(l.state);
      if (st && c.stateCode !== st.code) row.problems.push(`GSTIN state ${c.stateCode} (${c.state}) differs from ledger state ${st.name}`);
    } else row.problems.push('no GSTIN');
    out.push(row);
  }
  const filtered = input.problemsOnly ? out.filter((r) => r.problems.length) : out;
  return { count: filtered.length, withProblems: out.filter((r) => r.problems.length).length, rows: filtered };
}

export async function taxLedgers(ctx, input) {
  const p = await period(ctx, input);
  const classes = await ledgerClasses(ctx);
  const ledgers = await ledgerPeriod(ctx, p);
  const rows = ledgers
    .filter((l) => classes.get(norm(l.name))?.head)
    .map((l) => ({ ledger: l.name, head: classes.get(norm(l.name)).head.toUpperCase(), opening: toSided(l.opening), debit: l.dr, credit: l.cr, closing: toSided(l.closing) }));
  return { period: p, rows };
}

// ---------------------------------------------------------------- inventory

export async function stockSummary(ctx, input) {
  const p = await period(ctx, input);
  const rows = await ctx.client.rows(
    {
      collection: { type: 'StockItem' },
      fields: [
        { key: 'name', method: 'Name' },
        { key: 'parent', method: 'Parent', type: 'parent' },
        { key: 'oq', method: 'OpeningBalance', type: 'qty' },
        { key: 'ov', method: 'OpeningValue', type: 'amount' },
        { key: 'iq', method: 'InwardQuantity', type: 'qty' },
        { key: 'iv', method: 'InwardValue', type: 'amount' },
        { key: 'xq', method: 'OutwardQuantity', type: 'qty' },
        { key: 'xv', method: 'OutwardValue', type: 'amount' },
        { key: 'cq', method: 'ClosingBalance', type: 'qty' },
        { key: 'cv', method: 'ClosingValue', type: 'amount' },
        { key: 'cr', method: 'ClosingRate', type: 'rate' },
      ],
    },
    { from: p.from, to: p.to },
  );
  let list = rows;
  if (input.under) {
    const tree = await masterNames(ctx, 'stock-group');
    const g = resolveIn(tree.map((t) => t.name), input.under, 'Stock group');
    const isUnder = underFn(tree, g);
    list = list.filter((r) => isUnder(r.parent));
  }
  const out = list
    .map((r) => ({ item: r.name, group: r.parent || null, unit: r.cq.unit || r.oq.unit || null, opening: { qty: r.oq.qty, value: Math.abs(r.ov) }, inward: { qty: r.iq.qty, value: Math.abs(r.iv) }, outward: { qty: r.xq.qty, value: Math.abs(r.xv) }, closing: { qty: r.cq.qty, value: Math.abs(r.cv), rate: r.cr.rate } }))
    .filter((r) => input.all || r.opening.qty || r.inward.qty || r.outward.qty || r.closing.qty);
  const negative = out.filter((r) => r.closing.qty < 0).map((r) => r.item);
  if (negative.length) ctx.warn(`Negative closing stock: ${negative.join(', ')}`);
  return { period: p, totals: { opening: sum(out, (r) => r.opening.value), inward: sum(out, (r) => r.inward.value), outward: sum(out, (r) => r.outward.value), closing: sum(out, (r) => r.closing.value) }, rows: out };
}

const BATCH_MOVE_FIELDS = [
  { key: 'date', method: 'Date', type: 'date' },
  { key: 'voucherType', method: 'VoucherTypeName' },
  { key: 'number', method: 'VoucherNumber' },
  { key: 'item', method: 'StockItemName' },
  { key: 'godown', method: 'GodownName' },
  { key: 'destination', method: 'DestinationGodownName' },
  { key: 'qty', method: 'ActualQty', type: 'qty' },
  { key: 'amount', method: 'Amount', type: 'amount' },
  { key: 'inward', method: 'IsDeemedPositive', type: 'logical' },
];

const STOCK_FILTERS = [F.notCancelled(), F.notOptional(), 'NOT $$IsOrderVch:$VoucherTypeName'];

export async function godownSummary(ctx, input) {
  const asOf = input.asOf || today();
  const booksFrom = (await companyBooksFrom(ctx)) || '2000-04-01';
  const opening = await ctx.client.rows({
    collection: { type: 'StockItem', route: ['BatchAllocations'] },
    fields: [
      { key: 'item', method: 'Name' },
      { key: 'godown', method: 'GodownName' },
      { key: 'qty', method: 'OpeningBalance', type: 'qty' },
    ],
  });
  const moves = await ctx.client.rows({ collection: { type: 'Voucher', route: ['AllInventoryEntries', 'BatchAllocations'], filters: STOCK_FILTERS }, fields: BATCH_MOVE_FIELDS }, { from: booksFrom, to: asOf, chunk: true });
  const pos = new Map();
  const add = (item, godown, q) => {
    if (!godown) godown = 'Main Location';
    const k = `${norm(item)}|${norm(godown)}`;
    const r = pos.get(k) || { item, godown, qty: 0 };
    r.qty = Math.round((r.qty + q) * 10000) / 10000;
    pos.set(k, r);
  };
  const itemsWithOpeningBatches = new Set(opening.map((o) => norm(o.item)));
  for (const o of opening) add(o.item, o.godown, o.qty.qty);
  if (!itemsWithOpeningBatches.size) {
    const items = await ctx.client.rows({ collection: { type: 'StockItem' }, fields: [{ key: 'item', method: 'Name' }, { key: 'qty', method: 'OpeningBalance', type: 'qty' }] }, { from: booksFrom, to: booksFrom });
    for (const it of items) if (it.qty.qty) add(it.item, 'Main Location', it.qty.qty);
  }
  for (const m of moves) {
    const q = Math.abs(m.qty.qty);
    if (m.destination && !/not applicable/i.test(m.destination)) {
      add(m.item, m.godown, -q);
      add(m.item, m.destination, q);
    } else add(m.item, m.godown, m.inward ? q : -q);
  }
  let rows = [...pos.values()].filter((r) => r.qty !== 0 || input.all);
  if (input.godown) rows = rows.filter((r) => norm(r.godown) === norm(input.godown));
  if (input.item) rows = rows.filter((r) => norm(r.item) === norm(input.item));
  rows.sort((a, b) => a.godown.localeCompare(b.godown) || a.item.localeCompare(b.item));
  return { asOf, rows };
}

export async function itemMovement(ctx, input) {
  const item = await resolveMaster(ctx, 'item', input.item);
  const p = await period(ctx, input);
  const open = await ctx.client.rows({ collection: { type: 'StockItem', filters: [F.eq('Name', item)] }, fields: [{ key: 'q', method: 'OpeningBalance', type: 'qty' }, { key: 'v', method: 'OpeningValue', type: 'amount' }] }, { from: p.from, to: p.to });
  const moves = await ctx.client.rows({ collection: { type: 'Voucher', route: ['AllInventoryEntries'], filters: STOCK_FILTERS }, fields: [{ key: 'date', method: 'Date', type: 'date' }, { key: 'voucherType', method: 'VoucherTypeName' }, { key: 'number', method: 'VoucherNumber' }, { key: 'party', method: 'PartyLedgerName' }, ...INVENTORY_FIELDS] }, { from: p.from, to: p.to, chunk: true });
  let bal = open.length ? open[0].q.qty : 0;
  const unit = open.length ? open[0].q.unit : null;
  const lines = moves
    .filter((m) => norm(m.item) === norm(item))
    .map((m) => {
      const q = Math.abs(m.qty.qty);
      bal = Math.round((bal + (m.inward ? q : -q)) * 10000) / 10000;
      return { date: m.date, voucherType: m.voucherType, number: m.number || null, party: m.party || null, inward: m.inward ? q : 0, outward: m.inward ? 0 : q, rate: m.rate.rate || null, value: Math.abs(m.amount), balance: bal };
    });
  return { item, unit, period: p, opening: open.length ? { qty: open[0].q.qty, value: Math.abs(open[0].v) } : null, closingQty: bal, lines };
}

export async function ordersPending(ctx, input) {
  const p = await period(ctx, input);
  const vt = await voucherTypes(ctx);
  const kind = input.kind || 'sales';
  const base = kind === 'sales' ? 'Sales Order' : 'Purchase Order';
  const orderTypes = vt.list.filter((t) => t.baseType === base).map((t) => t.name);
  if (!orderTypes.length) return { kind, rows: [] };
  const typeFilter = `(${orderTypes.map((t) => `$$IsEqual:$VoucherTypeName:${tdlString(t)}`).join(' OR ')})`;
  const orderRows = await ctx.client.rows({ collection: { type: 'Voucher', route: ['AllInventoryEntries', 'BatchAllocations'], filters: [F.notCancelled(), typeFilter] }, fields: [{ key: 'date', method: 'Date', type: 'date' }, { key: 'number', method: 'VoucherNumber' }, { key: 'party', method: 'PartyLedgerName' }, ...BATCH_MOVE_FIELDS.slice(3), { key: 'orderNo', method: 'OrderNo' }, { key: 'dueDate', method: 'OrderDueDate', type: 'date' }] }, { from: p.from, to: p.to, chunk: true });
  const fulfil = await ctx.client.rows({ collection: { type: 'Voucher', route: ['AllInventoryEntries', 'BatchAllocations'], filters: STOCK_FILTERS }, fields: [{ key: 'item', method: 'StockItemName' }, { key: 'orderNo', method: 'OrderNo' }, { key: 'qty', method: 'ActualQty', type: 'qty' }] }, { from: p.from, to: addDays(today(), 1), chunk: true });
  const done = new Map();
  for (const f of fulfil) {
    if (!f.orderNo || /not applicable/i.test(f.orderNo)) continue;
    const k = `${norm(f.orderNo)}|${norm(f.item)}`;
    done.set(k, (done.get(k) || 0) + Math.abs(f.qty.qty));
  }
  const asOf = today();
  const rows = orderRows
    .map((o) => {
      const orderNo = o.orderNo && !/not applicable/i.test(o.orderNo) ? o.orderNo : o.number;
      const ordered = Math.abs(o.qty.qty);
      const delivered = done.get(`${norm(orderNo)}|${norm(o.item)}`) || 0;
      return { orderNo, date: o.date, party: o.party || null, item: o.item, unit: o.qty.unit || null, ordered, delivered, pending: Math.max(0, Math.round((ordered - delivered) * 10000) / 10000), dueDate: o.dueDate, overdue: o.dueDate ? o.dueDate < asOf : false };
    })
    .filter((r) => input.all || r.pending > 0);
  return { kind, period: p, rows };
}

/** Day book: vouchers of a period with totals per type. */
export async function dayBook(ctx, input, listVouchers) {
  const res = await listVouchers(ctx, { ...input, status: input.status || 'active' });
  const byType = {};
  for (const v of res.vouchers) {
    const t = byType[v.voucherType] || { count: 0, total: 0 };
    t.count++;
    t.total = roundMoney(t.total + (v.status === 'regular' ? v.total : 0));
    byType[v.voucherType] = t;
  }
  return { period: res.period, count: res.count, byType, vouchers: res.vouchers };
}

export { statusOf, TallyCliError };
