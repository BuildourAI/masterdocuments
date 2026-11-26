/**
 * Simulator export: evaluates the inline-TDL reports and collections this tool sends, plus a few
 * built-in reports in the shapes shown in Tally's documentation.
 */
import { el, tag, child, childText, childrenNamed, elementChildren, textOf, cleanText } from '../core/xml.mjs';
import { compile, evaluate, FormulaError } from './formula.mjs';
import { key, SYS, isPrimary, ACCOUNTING_BASES, INVENTORY_BASES, ORDER_BASES, COLLECTION_TO_TABLE } from './store.mjs';
import { diffDays, addDays, fyOf } from '../core/dates.mjs';

const fmtNum = (n) => {
  if (!Number.isFinite(n)) return '0';
  const r = Math.round(n * 10000) / 10000;
  return Number.isInteger(r) ? String(r) : String(r);
};
const yesNo = (b) => (b ? 'Yes' : 'No');
const qtyStr = (q, unit) => `${fmtNum(q)}${unit ? ' ' + unit : ''}`;

function wrap(base, type, parent) {
  const w = Object.create(base);
  Object.defineProperty(w, '_type', { value: type, enumerable: false });
  Object.defineProperty(w, '_parent', { value: parent || null, enumerable: false });
  return w;
}

export class ExportEngine {
  /**
   * @param {import('./store.mjs').Store} store
   * @param {{svcurrentcompany?: string, svfromdate?: string, svtodate?: string}} vars
   * @param {Record<string,string>} formulas  SYSTEM Formulae defined in the request
   */
  constructor(store, vars, formulas = {}) {
    this.store = store;
    this.vars = vars;
    this.formulas = formulas;
    this.cache = new Map();
    const self = this;
    this.env = {
      resolve: (o, m) => self.resolve(o, m),
      lookup: (type, name, m) => self.lookup(type, name, m),
      variable: (v) => self.variable(v),
      formula: (name, ctx) => self.formula(name, ctx),
      func: (name, args) => self.func(name, args),
    };
  }

  get toDate() {
    return this.vars.svtodate || null;
  }
  get fromDate() {
    return this.vars.svfromdate || null;
  }

  variable(v) {
    const k = v.toLowerCase();
    if (k === 'svcurrentcompany') return this.store.company.name;
    if (k === 'svfromdate') return this.fromDate || this.store.company.booksfrom;
    if (k === 'svtodate') return this.toDate || '';
    if (k === 'svcurrentpath') return 'C:\\TallyPrime\\Data';
    return '';
  }

  formula(name, ctx) {
    const k = Object.keys(this.formulas).find((f) => f.toLowerCase() === name.toLowerCase());
    if (k) return evaluate(compile(this.formulas[k]), ctx);
    const builtins = { versionreleasestring: 'TallyPrime Simulator 7.2', capproductdetails: 'TallyPrime (Simulator)', versionbuildstring: '1' };
    if (name.toLowerCase() in builtins) return builtins[name.toLowerCase()];
    throw new FormulaError(`Formula @@${name} is not defined.`);
  }

  func(name, args) {
    const s = this.store;
    switch (name) {
      case 'sysname':
        return SYS(args[0]);
      case 'fulllist':
        return Array.isArray(args[1]) ? args[1].join(', ') : String(args[1] ?? '');
      case 'isaccountingvch':
        return ACCOUNTING_BASES.has(s.baseTypeOf(args[0]));
      case 'isinventoryvch':
        return INVENTORY_BASES.has(s.baseTypeOf(args[0]));
      case 'isordervch':
        return ORDER_BASES.has(s.baseTypeOf(args[0]));
      case 'isledofgrp':
        return s.isLedgerUnder(args[0], cleanText(args[1]));
      case 'licenseinfo': {
        const f = String(args[0]).toLowerCase();
        const info = { serialnumber: '700000000', remoteserialnumber: '', accountid: '', adminemailid: '', isadmin: true, iseducationalmode: !!s.company.educational, issilver: true, isgold: false, isindian: true, isremoteaccessmode: false, islicclientmode: false };
        return info[f] ?? '';
      }
      case 'sysinfo':
        return String(args[0]).toLowerCase() === 'applicationpath' ? 'C:\\TallyPrime' : '';
      case 'isprodtallyprime':
        return true;
      case 'isprodtallyprimeel':
      case 'isprodtallyserver':
        return false;
      case 'systemperiodfrom':
        return s.company.booksfrom;
      case 'systemperiodto':
        return fyOf(s.data.vouchers.reduce((m, v) => (v.date > m ? v.date : m), s.company.booksfrom)).to;
      case 'numstockitems':
        return s.masters('stockitems').length;
      case 'cmpusername':
        return '';
      case 'cmpuserlevel':
        return 'Owner';
      case 'groupstock':
        return 'Stock-in-Hand';
      default:
        throw new FormulaError(`Function $$${name} is not supported in the simulator.`);
    }
  }

  lookup(type, name, method) {
    const table = COLLECTION_TO_TABLE[String(type).toLowerCase()];
    if (!table) throw new FormulaError(`Lookup of type ${type} is not supported in the simulator.`);
    const m = this.store.findMaster(table, cleanText(name));
    if (!m) return '';
    return this.resolve(wrap(m, typeOfTable(table), null), method);
  }

  resolve(obj, method) {
    const m = method.toLowerCase();
    let o = obj;
    while (o) {
      const v = this.methodOf(o, m);
      if (v !== undefined) return v;
      o = o._parent;
    }
    return '';
  }

  methodOf(o, m) {
    const s = this.store;
    const t = o._type;
    const c = this.cache;
    switch (t) {
      case 'Group': {
        if (m === '_primarygroup') return s.reservedGroupOf(o.name)?.name ?? o.name;
        const prim = s.primaryGroupOf(o.name);
        if (m === 'isrevenue') return !!prim?.isrevenue;
        if (m === 'isdeemedpositive') return prim ? ['asset', 'expense'].includes(prim.nature) : false;
        if (m === 'affectsgrossprofit') return !!prim?.affectsgrossprofit;
        if (m === 'closingbalance' || m === 'openingbalance') {
          const bal = m === 'closingbalance' ? s.ledgerBalances(this.toDate, c) : null;
          let sum = 0;
          for (const l of s.masters('ledgers')) {
            if (!s.isLedgerUnder(l.name, o.name)) continue;
            sum += m === 'closingbalance' ? bal.get(key(l.name)) || 0 : Number(l.openingbalance) || 0;
          }
          if (key(o.name) === 'stock-in-hand' && m === 'closingbalance') {
            let stock = 0;
            for (const p of s.stockPosition(this.fromDate, this.toDate, c).values()) stock += p.cv;
            sum -= stock;
          }
          return Math.round(sum * 100) / 100;
        }
        if (m === 'sortposition') return 0;
        break;
      }
      case 'Ledger': {
        if (m === 'closingbalance') return Math.round((s.ledgerBalances(this.toDate, c).get(key(o.name)) || 0) * 100) / 100;
        if (m === 'debittotals') return -Math.round((s.ledgerTotals(this.fromDate, this.toDate, c).get(key(o.name))?.dr || 0) * 100) / 100;
        if (m === 'credittotals') return Math.round((s.ledgerTotals(this.fromDate, this.toDate, c).get(key(o.name))?.cr || 0) * 100) / 100;
        if (m === '_primarygroup') return s.reservedGroupOf(o.parent)?.name ?? '';
        if (m === 'isrevenue') return !!s.primaryGroupOf(o.parent)?.isrevenue;
        if (m === 'isdeemedpositive') return ['asset', 'expense'].includes(s.primaryGroupOf(o.parent)?.nature);
        if (m === 'affectsgrossprofit') return !!s.primaryGroupOf(o.parent)?.affectsgrossprofit;
        if (m === 'billallocations') return (o.billallocations || []).map((b) => wrap(b, 'OpeningBill', o));
        if (m === 'onlyalias') return (o.aliases || [])[0] || '';
        if (m === 'isbillwiseon') return !!o.isbillwiseon;
        if (m === 'billcreditperiod') return Number(o.billcreditperiod) || 0;
        if (m === 'ledgstregdetails') return (o.ledgstregdetails || []).map((r) => wrap(r, 'Sub', o));
        break;
      }
      case 'StockItem': {
        const p = () => s.stockPosition(this.fromDate, this.toDate, c).get(key(o.name)) || { oq: 0, ov: 0, iq: 0, iv: 0, xq: 0, xv: 0, cq: 0, cv: 0, cr: 0, or: 0 };
        const u = o.baseunits || '';
        if (m === 'closingbalance') return qtyStr(p().cq, u);
        if (m === 'closingvalue') return p().cv;
        if (m === 'closingrate') return `${fmtNum(p().cr)}/${u}`;
        if (m === 'openingbalance') return qtyStr(p().oq, u);
        if (m === 'openingvalue') return Math.round(p().ov * 100) / 100;
        if (m === 'openingrate') return `${fmtNum(p().or)}/${u}`;
        if (m === 'inwardquantity') return qtyStr(p().iq, u);
        if (m === 'inwardvalue') return Math.round(p().iv * 100) / 100;
        if (m === 'outwardquantity') return qtyStr(p().xq, u);
        if (m === 'outwardvalue') return Math.round(p().xv * 100) / 100;
        if (m === 'infgsthsncode') return o.hsncode || '';
        if (m === 'infgstigstrate') return Number(o.igstrate) || 0;
        if (m === 'infgsttaxablility') return o.taxability || '';
        if (m === 'onlyalias') return (o.aliases || [])[0] || '';
        if (m === 'batchallocations') return (o.batchallocations || []).map((b) => wrap(b, 'Sub', o));
        break;
      }
      case 'Unit':
        if (m === 'symbol') return o.symbol || o.name;
        if (m === 'issimpleunit') return o.issimpleunit !== false;
        break;
      case 'Voucher': {
        if (m === 'allledgerentries') return s.allLedgerEntries(o).map((e) => wrap(e, 'LedgerEntry', o));
        if (m === 'ledgerentries') return (o.ledgerentries || []).map((e) => wrap(e, 'LedgerEntry', o));
        if (m === 'allinventoryentries') return s.inventoryLines(o).map((e) => wrap(e, 'InventoryEntry', o));
        if (m === 'inventoryentries') return (o.inventoryentries || []).map((e) => wrap(e, 'InventoryEntry', o));
        if (m === 'inventoryentriesin') return (o.inventoryentriesin || []).map((e) => wrap({ ...e, isdeemedpositive: true }, 'InventoryEntry', o));
        if (m === 'inventoryentriesout') return (o.inventoryentriesout || []).map((e) => wrap({ ...e, isdeemedpositive: false }, 'InventoryEntry', o));
        if (m === 'isoptional' || m === 'iscancelled' || m === 'isinvoice') return !!o[m];
        if (m === 'effectivedate') return o.date;
        if (o.extra && m in o.extra) return o.extra[m];
        break;
      }
      case 'LedgerEntry':
        if (m === 'billallocations') return (o.billallocations || []).map((b) => wrap(b, 'BillAllocation', o));
        if (m === 'bankallocations') return (o.bankallocations || []).map((b) => wrap(b, 'BankAllocation', o));
        if (m === 'costcentreallocations') return (o.costcentreallocations || []).map((b) => wrap(b, 'CostCentreAllocation', o));
        if (m === 'categoryallocations') {
          const cats = new Map();
          for (const cc of o.costcentreallocations || []) {
            const k = cc.category || 'Primary Cost Category';
            if (!cats.has(k)) cats.set(k, { category: k, costcentreallocations: [] });
            cats.get(k).costcentreallocations.push(cc);
          }
          return [...cats.values()].map((x) => wrap(x, 'Category', o));
        }
        if (m === 'isdeemedpositive' || m === 'ispartyledger') return !!o[m];
        break;
      case 'Category':
        if (m === 'costcentreallocations') return o.costcentreallocations.map((b) => wrap(b, 'CostCentreAllocation', o));
        break;
      case 'InventoryEntry':
        if (m === 'batchallocations') return (o.batchallocations || []).map((b) => wrap(b, 'BatchAllocation', o));
        if (m === 'accountingallocations') return (o.accountingallocations || []).map((b) => wrap(b, 'LedgerEntry', o));
        if (m === 'godownname') return (o.batchallocations || [])[0]?.godownname || '';
        if (m === 'orderno') return (o.batchallocations || [])[0]?.orderno || '';
        if (m === 'trackingnumber') return (o.batchallocations || [])[0]?.trackingnumber || '';
        if (m === 'orderduedate') return (o.batchallocations || [])[0]?.orderduedate || '';
        if (m === 'isdeemedpositive') return !!o.isdeemedpositive;
        if (m === 'ledgername') return ''; // do not fall through to the voucher
        break;
      case 'Bill':
        if (m === '_overduedays') {
          const asOf = this.toDate || this.store.data.vouchers.reduce((mx, v) => (v.date > mx ? v.date : mx), this.store.company.booksfrom);
          const due = addDays(o.billdate, Number(o.billcreditperiod) || 0);
          return Math.max(0, diffDays(due, asOf));
        }
        if (m === 'duedate') return addDays(o.billdate, Number(o.billcreditperiod) || 0);
        break;
      case 'Company':
        if (m === 'altmstid') return s.company.altmstid;
        if (m === 'altvchid') return s.company.altvchid;
        break;
      default:
        break;
    }
    if (m in o) return o[m];
    return undefined;
  }

  /** Objects for a collection definition. */
  collectionObjects(def) {
    const type = String(def.type || '').replace(/\s+/g, '').toLowerCase();
    const s = this.store;
    let objs;
    if (type === 'company') objs = [wrap(s.company, 'Company', null)];
    else if (type === 'voucher' || type === 'vouchers') {
      objs = s.data.vouchers
        .filter((v) => (!this.fromDate || v.date >= this.fromDate) && (!this.toDate || v.date <= this.toDate))
        .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.masterid - b.masterid))
        .map((v) => wrap(v, 'Voucher', null));
    } else if (type === 'bill' || type === 'bills') objs = s.pendingBills(this.toDate, this.cache).map((b) => wrap(b, 'Bill', null));
    else {
      const table = COLLECTION_TO_TABLE[type.replace(/s$/, '')] || COLLECTION_TO_TABLE[type];
      if (!table) throw new FormulaError(`Collection type "${def.type}" is not supported in the simulator.`);
      objs = s.masters(table).map((m) => wrap(m, typeOfTable(table), null));
    }
    if (def.childOf) {
      const parent = cleanText(this.evalIn(def.childOf, null));
      objs = objs.filter((o) => {
        if (def.belongsTo) {
          if (o._type === 'Ledger') return s.isLedgerUnder(o.name, parent);
          if (o._type === 'Group') return key(o.name) !== key(parent) && s.isGroupUnder(o.name, parent);
        }
        return key(o.parent) === key(parent);
      });
    }
    for (const f of def.filters || []) {
      const src = this.formulas[Object.keys(this.formulas).find((k) => k.toLowerCase() === f.toLowerCase())];
      if (src === undefined) throw new FormulaError(`Filter ${f} is not defined.`);
      const ast = compile(src);
      objs = objs.filter((o) => {
        const v = evaluate(ast, { obj: o, env: this.env });
        return v === true || v === 1 || (typeof v === 'string' && /^(yes|1|true)$/i.test(v));
      });
    }
    return objs;
  }

  evalIn(src, obj) {
    const s = String(src).trim();
    if (/^".*"$/.test(s)) return s.slice(1, -1);
    if (!/[$@#:()]/.test(s)) return s;
    return evaluate(compile(s), { obj, env: this.env });
  }

  subObjects(obj, route) {
    const v = this.resolve(obj, route);
    return Array.isArray(v) ? v : [];
  }

  evalField(src, obj) {
    const v = evaluate(compile(src), { obj, env: this.env });
    if (typeof v === 'boolean') return yesNo(v);
    if (typeof v === 'number') return fmtNum(v);
    if (Array.isArray(v)) return v.length ? String(v.length) : '';
    return String(v ?? '');
  }
}

export function typeOfTable(table) {
  return {
    groups: 'Group',
    ledgers: 'Ledger',
    stockitems: 'StockItem',
    stockgroups: 'StockGroup',
    stockcategories: 'StockCategory',
    units: 'Unit',
    godowns: 'Godown',
    costcentres: 'CostCentre',
    costcategories: 'CostCategory',
    vouchertypes: 'VoucherType',
    currencies: 'Currency',
  }[table];
}

// ---------- inline TDL definitions ----------

/** Index TDL definitions in a TDLMESSAGE by kind and name. */
export function indexTdl(tdlMessage) {
  const defs = {};
  const formulas = {};
  for (const n of elementChildren(tdlMessage)) {
    const kind = n.name.toUpperCase();
    const name = n.attrs.NAME || n.attrs.Name || '';
    if (kind === 'SYSTEM') {
      if (/formula/i.test(n.attrs.TYPE || '')) formulas[name] = cleanText(textOf(n));
      continue;
    }
    (defs[kind] = defs[kind] || {})[name.toUpperCase()] = n;
  }
  return { defs, formulas };
}

const list = (node, tagName) =>
  childrenNamed(node, tagName)
    .flatMap((c) => textOf(c).split(','))
    .map((s) => s.trim())
    .filter(Boolean);

function collectionDef(node) {
  return {
    type: childText(node, 'TYPE'),
    childOf: childText(node, 'CHILDOF') || null,
    belongsTo: /^yes$/i.test(childText(node, 'BELONGSTO')),
    filters: list(node, 'FILTER'),
    methods: [...list(node, 'NATIVEMETHOD'), ...list(node, 'FETCH')],
    computes: childrenNamed(node, 'COMPUTE').map((c) => textOf(c).trim()),
  };
}

/** Run an inline report; returns the reply element tree. */
export function runInlineReport(store, vars, tdlMessage, reportName) {
  const { defs, formulas } = indexTdl(tdlMessage);
  const engine = new ExportEngine(store, vars, formulas);
  const report = defs.REPORT?.[reportName.toUpperCase()];
  if (!report) throw new FormulaError(`Report "${reportName}" does not exist.`);
  const out = [];
  for (const formName of list(report, 'FORMS')) {
    const form = defs.FORM?.[formName.toUpperCase()];
    if (!form) throw new FormulaError(`Form "${formName}" does not exist.`);
    const formTag = childText(form, 'XMLTAG');
    const formOut = [];
    for (const partName of list(form, 'PARTS')) renderPart(engine, defs, partName, null, formOut);
    if (formTag) out.push(el(formTag, {}, formOut));
    else out.push(...formOut);
  }
  return el('ENVELOPE', {}, out);
}

function renderPart(engine, defs, partName, ctxObj, out) {
  const part = defs.PART?.[partName.toUpperCase()];
  if (!part) throw new FormulaError(`Part "${partName}" does not exist.`);
  const repeat = childText(part, 'REPEAT');
  const lines = list(part, 'LINES');
  if (!repeat) {
    for (const ln of lines) renderLine(engine, defs, ln, ctxObj, out);
    return;
  }
  const [lineName, source] = repeat.split(':').map((s) => s.trim());
  let objs;
  const collNode = defs.COLLECTION?.[source.toUpperCase()];
  if (collNode) objs = engine.collectionObjects(collectionDef(collNode));
  else if (ctxObj) objs = engine.subObjects(ctxObj, source);
  else throw new FormulaError(`Collection "${source}" does not exist.`);
  for (const o of objs) renderLine(engine, defs, lineName, o, out);
}

function renderLine(engine, defs, lineName, obj, out) {
  const line = defs.LINE?.[lineName.toUpperCase()];
  if (!line) throw new FormulaError(`Line "${lineName}" does not exist.`);
  const lineTag = childText(line, 'XMLTAG');
  const values = [];
  for (const fname of list(line, 'FIELDS')) {
    const field = defs.FIELD?.[fname.toUpperCase()];
    if (!field) throw new FormulaError(`Field "${fname}" does not exist.`);
    const xmlTag = childText(field, 'XMLTAG');
    const set = childText(field, 'SET');
    if (!xmlTag) continue; // fields without an XML tag produce no output here
    values.push(el(xmlTag, {}, set ? engine.evalField(set, obj) : ''));
  }
  if (values.length) {
    if (lineTag) out.push(el(lineTag, {}, values));
    else out.push(...values);
  }
  for (const ex of list(line, 'EXPLODE')) renderPart(engine, defs, ex.split(':')[0].trim(), obj, out);
}

// ---------- native object XML ----------

export function nativeObject(engine, obj, methods) {
  const t = obj._type;
  const tagName = t.toUpperCase();
  if (t === 'Voucher' && (!methods || !methods.length || methods.includes('*'))) return nativeVoucher(obj);
  const attrs = obj.name !== undefined ? { NAME: obj.name } : {};
  const kids = [];
  const list = methods && methods.length && !methods.includes('*') ? methods : Object.keys(obj).filter((k) => !['aliases', 'nature'].includes(k));
  for (const m of list) {
    const v = engine.resolve(obj, m);
    if (Array.isArray(v)) continue;
    kids.push(el(m.toUpperCase(), {}, typeof v === 'boolean' ? yesNo(v) : typeof v === 'number' ? fmtNum(v) : String(v ?? '')));
  }
  return el(tagName, attrs, kids);
}

const amt = (n) => (Math.round(Number(n || 0) * 100) / 100).toFixed(2);
const ymd = (d) => (d ? d.replace(/-/g, '') : '');

function ledgerEntryXml(e, tagName) {
  return el(
    tagName,
    {},
    tag('LEDGERNAME', e.ledgername),
    tag('ISDEEMEDPOSITIVE', yesNo(e.isdeemedpositive)),
    e.ispartyledger ? tag('ISPARTYLEDGER', 'Yes') : null,
    tag('AMOUNT', amt(e.amount)),
    (e.billallocations || []).map((b) =>
      el('BILLALLOCATIONS.LIST', {}, tag('NAME', b.name), tag('BILLTYPE', b.billtype), b.billcreditperiod ? tag('BILLCREDITPERIOD', `${b.billcreditperiod} Days`) : null, tag('AMOUNT', amt(b.amount))),
    ),
    (e.bankallocations || []).map((b) =>
      el(
        'BANKALLOCATIONS.LIST',
        {},
        Object.entries(b)
          .filter(([k]) => k !== 'amount')
          .map(([k, v]) => tag(k.toUpperCase(), /date$/.test(k) ? ymd(v) : v)),
        tag('AMOUNT', amt(b.amount)),
      ),
    ),
    groupCostCentres(e.costcentreallocations || []),
  );
}

function groupCostCentres(ccs) {
  const cats = new Map();
  for (const cc of ccs) {
    const k = cc.category || 'Primary Cost Category';
    if (!cats.has(k)) cats.set(k, []);
    cats.get(k).push(cc);
  }
  return [...cats.entries()].map(([cat, items]) =>
    el('CATEGORYALLOCATIONS.LIST', {}, tag('CATEGORY', cat), items.map((cc) => el('COSTCENTREALLOCATIONS.LIST', {}, tag('NAME', cc.name), tag('AMOUNT', amt(cc.amount))))),
  );
}

function inventoryXml(e, tagName) {
  return el(
    tagName,
    {},
    tag('STOCKITEMNAME', e.stockitemname),
    tag('ISDEEMEDPOSITIVE', yesNo(e.isdeemedpositive)),
    tag('RATE', e.rate),
    e.discount ? tag('DISCOUNT', e.discount) : null,
    tag('AMOUNT', amt(e.amount)),
    tag('ACTUALQTY', e.actualqty),
    tag('BILLEDQTY', e.billedqty),
    (e.batchallocations || []).map((b) =>
      el(
        'BATCHALLOCATIONS.LIST',
        {},
        tag('GODOWNNAME', b.godownname),
        tag('BATCHNAME', b.batchname),
        b.destinationgodownname ? tag('DESTINATIONGODOWNNAME', b.destinationgodownname) : null,
        b.orderno ? tag('ORDERNO', b.orderno) : null,
        b.orderduedate ? tag('ORDERDUEDATE', ymd(b.orderduedate)) : null,
        tag('AMOUNT', amt(b.amount)),
        tag('ACTUALQTY', b.actualqty),
        tag('BILLEDQTY', b.actualqty),
      ),
    ),
    (e.accountingallocations || []).map((a) => ledgerEntryXml(a, 'ACCOUNTINGALLOCATIONS.LIST')),
  );
}

export function nativeVoucher(v) {
  const invoice = (v.inventoryentries || []).length > 0 || v.isinvoice;
  return el(
    'VOUCHER',
    { REMOTEID: v.remoteid || v.guid, VCHTYPE: v.vouchertypename, ACTION: 'Create', OBJVIEW: v.persistedview || (invoice ? 'Invoice Voucher View' : 'Accounting Voucher View') },
    tag('DATE', ymd(v.date)),
    tag('GUID', v.guid),
    tag('VOUCHERTYPENAME', v.vouchertypename),
    tag('VOUCHERNUMBER', v.vouchernumber),
    v.reference ? tag('REFERENCE', v.reference) : null,
    v.referencedate ? tag('REFERENCEDATE', ymd(v.referencedate)) : null,
    v.narration ? tag('NARRATION', v.narration) : null,
    v.partyledgername ? tag('PARTYLEDGERNAME', v.partyledgername) : null,
    v.placeofsupply ? tag('PLACEOFSUPPLY', v.placeofsupply) : null,
    tag('PERSISTEDVIEW', v.persistedview || (invoice ? 'Invoice Voucher View' : 'Accounting Voucher View')),
    tag('ISINVOICE', yesNo(!!v.isinvoice)),
    tag('ISOPTIONAL', yesNo(!!v.isoptional)),
    tag('ISCANCELLED', yesNo(!!v.iscancelled)),
    tag('MASTERID', v.masterid),
    tag('ALTERID', v.alterid),
    Object.entries(v.extra || {}).map(([k, val]) => tag(k.toUpperCase(), val)),
    (v.ledgerentries || []).map((e) => ledgerEntryXml(e, invoice ? 'LEDGERENTRIES.LIST' : 'ALLLEDGERENTRIES.LIST')),
    (v.inventoryentries || []).map((e) => inventoryXml(e, 'ALLINVENTORYENTRIES.LIST')),
    (v.inventoryentriesin || []).map((e) => inventoryXml(e, 'INVENTORYENTRIESIN.LIST')),
    (v.inventoryentriesout || []).map((e) => inventoryXml(e, 'INVENTORYENTRIESOUT.LIST')),
  );
}

/** Built-in "Trial Balance" in the shape of Tally's documented sample (flat DSPACCNAME / DSPACCINFO pairs). */
export function builtinTrialBalance(store, vars) {
  const engine = new ExportEngine(store, vars);
  const kids = [];
  for (const g of store.masters('groups').filter((x) => isPrimary(x.parent))) {
    const bal = engine.methodOf(wrap(g, 'Group', null), 'closingbalance');
    if (!bal) continue;
    kids.push(el('DSPACCNAME', {}, tag('DSPDISPNAME', g.name)));
    kids.push(
      el(
        'DSPACCINFO',
        {},
        el('DSPCLDRAMT', {}, tag('DSPCLDRAMTA', bal < 0 ? amt(bal) : '')),
        el('DSPCLCRAMT', {}, tag('DSPCLCRAMTA', bal > 0 ? amt(bal) : '')),
      ),
    );
  }
  return el('ENVELOPE', {}, kids);
}

/** Built-in "Day Book": vouchers of the period as native XML. */
export function builtinDayBook(store, vars) {
  const engine = new ExportEngine(store, vars);
  const vs = engine.collectionObjects({ type: 'Voucher' });
  return el('ENVELOPE', {}, el('HEADER', {}, tag('TALLYREQUEST', 'Import Data')), el('BODY', {}, el('IMPORTDATA', {}, el('REQUESTDATA', {}, vs.map((v) => el('TALLYMESSAGE', {}, nativeVoucher(v)))))));
}

export { child, collectionDef, wrap };
