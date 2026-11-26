/**
 * Simulator data store: one company with Tally's default groups and voucher types, masters,
 * vouchers, and the computed values Tally derives (balances, stock, pending bills).
 * Field names are stored lower-case, matching Tally method names case-insensitively.
 */
export const SYS = (name) => `\u0004 ${name}`;

export const PRIMARY_GROUPS = [
  // name, nature (asset|liability|income|expense), revenue, affects gross profit
  ['Capital Account', 'liability', false, false],
  ['Loans (Liability)', 'liability', false, false],
  ['Current Liabilities', 'liability', false, false],
  ['Fixed Assets', 'asset', false, false],
  ['Investments', 'asset', false, false],
  ['Current Assets', 'asset', false, false],
  ['Branch / Divisions', 'liability', false, false],
  ['Misc. Expenses (ASSET)', 'asset', false, false],
  ['Suspense A/c', 'liability', false, false],
  ['Sales Accounts', 'income', true, true],
  ['Purchase Accounts', 'expense', true, true],
  ['Direct Incomes', 'income', true, true],
  ['Direct Expenses', 'expense', true, true],
  ['Indirect Incomes', 'income', true, false],
  ['Indirect Expenses', 'expense', true, false],
];

export const SUB_GROUPS = [
  ['Reserves & Surplus', 'Capital Account'],
  ['Bank OD A/c', 'Loans (Liability)'],
  ['Secured Loans', 'Loans (Liability)'],
  ['Unsecured Loans', 'Loans (Liability)'],
  ['Duties & Taxes', 'Current Liabilities'],
  ['Provisions', 'Current Liabilities'],
  ['Sundry Creditors', 'Current Liabilities'],
  ['Bank Accounts', 'Current Assets'],
  ['Cash-in-Hand', 'Current Assets'],
  ['Deposits (Asset)', 'Current Assets'],
  ['Loans & Advances (Asset)', 'Current Assets'],
  ['Stock-in-Hand', 'Current Assets'],
  ['Sundry Debtors', 'Current Assets'],
];

export const BASE_VOUCHER_TYPES = [
  'Contra',
  'Payment',
  'Receipt',
  'Journal',
  'Sales',
  'Purchase',
  'Credit Note',
  'Debit Note',
  'Sales Order',
  'Purchase Order',
  'Delivery Note',
  'Receipt Note',
  'Rejections In',
  'Rejections Out',
  'Stock Journal',
  'Physical Stock',
  'Memorandum',
  'Reversing Journal',
];

export const ACCOUNTING_BASES = new Set(['Contra', 'Payment', 'Receipt', 'Journal', 'Sales', 'Purchase', 'Credit Note', 'Debit Note', 'Reversing Journal']);
export const INVENTORY_BASES = new Set(['Delivery Note', 'Receipt Note', 'Rejections In', 'Rejections Out', 'Stock Journal', 'Physical Stock']);
export const ORDER_BASES = new Set(['Sales Order', 'Purchase Order']);
export const STOCK_AFFECTING_BASES = new Set(['Sales', 'Purchase', 'Credit Note', 'Debit Note', 'Delivery Note', 'Receipt Note', 'Rejections In', 'Rejections Out', 'Stock Journal']);

export const MASTER_TYPES = {
  GROUP: 'groups',
  LEDGER: 'ledgers',
  STOCKITEM: 'stockitems',
  STOCKGROUP: 'stockgroups',
  STOCKCATEGORY: 'stockcategories',
  UNIT: 'units',
  GODOWN: 'godowns',
  COSTCENTRE: 'costcentres',
  COSTCATEGORY: 'costcategories',
  VOUCHERTYPE: 'vouchertypes',
  CURRENCY: 'currencies',
};

export const COLLECTION_TO_TABLE = {
  group: 'groups',
  ledger: 'ledgers',
  stockitem: 'stockitems',
  stockgroup: 'stockgroups',
  stockcategory: 'stockcategories',
  unit: 'units',
  godown: 'godowns',
  costcentre: 'costcentres',
  costcategory: 'costcategories',
  vouchertype: 'vouchertypes',
  currency: 'currencies',
};

const hex8 = (n) => n.toString(16).padStart(8, '0');

export class Store {
  constructor(data) {
    this.data = data;
  }

  static empty({ name = 'Sample Company', booksFrom = '2026-04-01', state = 'Maharashtra', guidSeed = 'a1b2c3d4-0000-4000-8000-00000000c0de' } = {}) {
    const d = {
      company: { name, guid: guidSeed, booksfrom: booksFrom, startingfrom: booksFrom, statename: state, countryname: 'India', gstin: '', altmstid: 0, altvchid: 0, lastmasterid: 0, educational: false },
      groups: {},
      ledgers: {},
      stockitems: {},
      stockgroups: {},
      stockcategories: {},
      units: {},
      godowns: {},
      costcentres: {},
      costcategories: {},
      vouchertypes: {},
      currencies: {},
      vouchers: [],
    };
    const s = new Store(d);
    for (const [g, nature, revenue, gp] of PRIMARY_GROUPS) s.addMaster('groups', { name: g, parent: SYS('Primary'), nature, isrevenue: revenue, affectsgrossprofit: gp, isreserved: true });
    for (const [g, parent] of SUB_GROUPS) s.addMaster('groups', { name: g, parent, isreserved: true });
    for (const t of BASE_VOUCHER_TYPES) s.addMaster('vouchertypes', { name: t, parent: t, numberingmethod: 'Automatic', isreserved: true });
    s.addMaster('ledgers', { name: 'Cash', parent: 'Cash-in-Hand', openingbalance: 0 });
    s.addMaster('ledgers', { name: 'Profit & Loss A/c', parent: SYS('Primary'), openingbalance: 0, isreserved: true });
    s.addMaster('godowns', { name: 'Main Location', parent: SYS('Primary') });
    s.addMaster('currencies', { name: '₹', formalname: 'Indian Rupees', isreserved: true });
    s.addMaster('costcategories', { name: 'Primary Cost Category', allocaterevenue: true, allocatenonrevenue: false, isreserved: true });
    return s;
  }

  get company() {
    return this.data.company;
  }

  nextMasterId() {
    return ++this.data.company.lastmasterid;
  }

  guidFor(masterId) {
    return `${this.company.guid}-${hex8(masterId)}`;
  }

  addMaster(table, obj) {
    const masterid = this.nextMasterId();
    const rec = { guid: this.guidFor(masterid), masterid, alterid: ++this.data.company.altmstid, ...obj };
    this.data[table][key(obj.name)] = rec;
    return rec;
  }

  getMaster(table, name) {
    if (name === undefined || name === null) return undefined;
    return this.data[table][key(name)];
  }

  /** Find a master by name or alias. */
  findMaster(table, name) {
    const direct = this.getMaster(table, name);
    if (direct) return direct;
    const k = key(name);
    return Object.values(this.data[table]).find((m) => (m.aliases || []).some((a) => key(a) === k));
  }

  masters(table) {
    return Object.values(this.data[table]);
  }

  // ---------- classification ----------

  groupChain(groupName) {
    const chain = [];
    let g = this.getMaster('groups', groupName);
    let guard = 0;
    while (g && guard++ < 50) {
      chain.push(g);
      if (isPrimary(g.parent)) break;
      g = this.getMaster('groups', g.parent);
    }
    return chain;
  }

  primaryGroupOf(groupName) {
    const chain = this.groupChain(groupName);
    return chain.length ? chain[chain.length - 1] : undefined;
  }

  /** Nearest pre-defined (reserved) group at or above a group, which is what Tally's $_PrimaryGroup reports. */
  reservedGroupOf(groupName) {
    return this.groupChain(groupName).find((g) => g.isreserved);
  }

  isLedgerUnder(ledgerName, groupName) {
    const l = this.getMaster('ledgers', ledgerName);
    if (!l) return false;
    return this.groupChain(l.parent).some((g) => key(g.name) === key(groupName));
  }

  isGroupUnder(groupName, ancestor) {
    return this.groupChain(groupName).some((g) => key(g.name) === key(ancestor));
  }

  baseTypeOf(voucherTypeName) {
    let t = this.getMaster('vouchertypes', voucherTypeName);
    let guard = 0;
    while (t && guard++ < 20) {
      if (key(t.parent) === key(t.name) || !t.parent) return t.name;
      t = this.getMaster('vouchertypes', t.parent);
    }
    return t ? t.name : voucherTypeName;
  }

  // ---------- voucher effects ----------

  /** Ledger lines of a voucher as Tally's AllLedgerEntries would show (including inventory accounting allocations). */
  allLedgerEntries(v) {
    const out = [...(v.ledgerentries || [])];
    for (const inv of v.inventoryentries || []) {
      for (const a of inv.accountingallocations || []) out.push(a);
    }
    return out;
  }

  affectsAccounts(v) {
    if (v.isoptional || v.iscancelled) return false;
    return ACCOUNTING_BASES.has(this.baseTypeOf(v.vouchertypename));
  }

  affectsStock(v) {
    if (v.isoptional || v.iscancelled) return false;
    return STOCK_AFFECTING_BASES.has(this.baseTypeOf(v.vouchertypename));
  }

  /** Signed ledger balances (debit negative) as of a date, cached per date. */
  ledgerBalances(toDate, cache) {
    const k = `bal:${toDate || ''}`;
    if (cache && cache.has(k)) return cache.get(k);
    const bal = new Map();
    for (const l of this.masters('ledgers')) bal.set(key(l.name), Number(l.openingbalance) || 0);
    for (const v of this.data.vouchers) {
      if (!this.affectsAccounts(v) || (toDate && v.date > toDate)) continue;
      for (const e of this.allLedgerEntries(v)) bal.set(key(e.ledgername), (bal.get(key(e.ledgername)) || 0) + Number(e.amount || 0));
    }
    if (cache) cache.set(k, bal);
    return bal;
  }

  /** Debit and credit totals per ledger within a period (positive numbers). */
  ledgerTotals(from, to, cache) {
    const k = `tot:${from}:${to}`;
    if (cache && cache.has(k)) return cache.get(k);
    const tot = new Map();
    for (const v of this.data.vouchers) {
      if (!this.affectsAccounts(v) || (from && v.date < from) || (to && v.date > to)) continue;
      for (const e of this.allLedgerEntries(v)) {
        const t = tot.get(key(e.ledgername)) || { dr: 0, cr: 0 };
        const a = Number(e.amount || 0);
        if (a < 0) t.dr += -a;
        else t.cr += a;
        tot.set(key(e.ledgername), t);
      }
    }
    if (cache) cache.set(k, tot);
    return tot;
  }

  /** Stock position per item: opening, inward, outward, closing (qty and value) for a period. */
  stockPosition(from, to, cache) {
    const k = `stk:${from}:${to}`;
    if (cache && cache.has(k)) return cache.get(k);
    const pos = new Map();
    for (const it of this.masters('stockitems')) {
      const oq = Number(it.openingqty || 0);
      const ov = Math.abs(Number(it.openingvalue || 0));
      pos.set(key(it.name), { oq, ov, iq: 0, iv: 0, xq: 0, xv: 0, unit: it.baseunits || '', preq: oq, prev: ov });
    }
    for (const v of this.data.vouchers) {
      if (!this.affectsStock(v) || (to && v.date > to)) continue;
      const before = from && v.date < from;
      for (const e of this.inventoryLines(v)) {
        const p = pos.get(key(e.stockitemname));
        if (!p) continue;
        const q = Number(e.qty || 0);
        const val = Math.abs(Number(e.amount || 0));
        if (before) {
          if (e.isdeemedpositive) {
            p.preq += q;
            p.prev += val;
          } else {
            const avg = p.preq ? p.prev / p.preq : 0;
            p.preq -= q;
            p.prev -= avg * q;
          }
          continue;
        }
        if (e.isdeemedpositive) {
          p.iq += q;
          p.iv += val;
        } else {
          p.xq += q;
          p.xv += val;
        }
      }
    }
    for (const p of pos.values()) {
      if (from) {
        p.oq = p.preq;
        p.ov = p.prev;
      }
      p.cq = p.oq + p.iq - p.xq;
      const inQty = p.oq + p.iq;
      const avg = inQty ? (p.ov + p.iv) / inQty : 0;
      p.cv = Math.round(p.cq * avg * 100) / 100;
      p.cr = Math.round(avg * 100) / 100;
      p.or = p.oq ? Math.round((p.ov / p.oq) * 100) / 100 : 0;
    }
    if (cache) cache.set(k, pos);
    return pos;
  }

  /** Inventory lines with direction, across invoice and stock-journal shapes. */
  inventoryLines(v) {
    const out = [];
    for (const e of v.inventoryentries || []) out.push(e);
    for (const e of v.inventoryentriesin || []) out.push({ ...e, isdeemedpositive: true });
    for (const e of v.inventoryentriesout || []) out.push({ ...e, isdeemedpositive: false });
    return out;
  }

  /** Pending bills as of a date: opening bills plus voucher bill allocations, grouped by ledger + bill name. */
  pendingBills(toDate, cache) {
    const k = `bills:${toDate || ''}`;
    if (cache && cache.has(k)) return cache.get(k);
    const bills = new Map();
    const touch = (ledger, name, date, amount, creditDays, type) => {
      const bname = name || (type === 'On Account' ? 'On Account' : '');
      const id = `${key(ledger)}|${key(bname)}`;
      let b = bills.get(id);
      if (!b) {
        b = { parent: ledger, name: bname, billdate: date, closingbalance: 0, openingbalance: 0, billcreditperiod: creditDays || 0, isadvance: type === 'Advance' };
        bills.set(id, b);
      }
      b.closingbalance += amount;
      if (type === 'New Ref' || type === 'Opening') {
        b.billdate = date;
        if (creditDays) b.billcreditperiod = creditDays;
      } else if (!b.billdate || date < b.billdate) b.billdate = b.billdate || date;
    };
    for (const l of this.masters('ledgers')) {
      for (const ob of l.billallocations || []) touch(l.name, ob.name, ob.billdate || this.company.booksfrom, Number(ob.openingbalance || 0), ob.billcreditperiod, 'Opening');
    }
    for (const v of this.data.vouchers) {
      if (!this.affectsAccounts(v) || (toDate && v.date > toDate)) continue;
      for (const e of this.allLedgerEntries(v)) {
        for (const b of e.billallocations || []) touch(e.ledgername, b.name, v.date, Number(b.amount || 0), b.billcreditperiod, b.billtype);
      }
    }
    const out = [...bills.values()].filter((b) => Math.abs(b.closingbalance) >= 0.005);
    for (const b of out) b.closingbalance = Math.round(b.closingbalance * 100) / 100;
    if (cache) cache.set(k, out);
    return out;
  }
}

export const key = (s) =>
  String(s ?? '')
    .replace(/\u0004\s?/g, '')
    .trim()
    .toLowerCase();

export const isPrimary = (parent) => !parent || key(parent) === 'primary';
