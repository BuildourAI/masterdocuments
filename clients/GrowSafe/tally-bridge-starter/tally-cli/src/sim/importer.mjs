/**
 * Simulator import: applies TALLYMESSAGE contents (masters and vouchers) to the store with
 * Tally-like validation, and reports counts the way Tally does.
 */
import { child, childText, childrenNamed, elementChildren, textOf, cleanText } from '../core/xml.mjs';
import { parseQty, parseRate, parseTallyAmount } from '../core/amounts.mjs';
import { fromTally, allowedInEducationalMode } from '../core/dates.mjs';
import { MASTER_TYPES, key, SYS, isPrimary, ACCOUNTING_BASES } from './store.mjs';

const yes = (v) => /^(yes|true|1)$/i.test(String(v ?? '').trim());

export class ImportOutcome {
  constructor() {
    Object.assign(this, { created: 0, altered: 0, deleted: 0, cancelled: 0, combined: 0, ignored: 0, errors: 0, exceptions: 0, lastvchid: 0, lastmid: 0, lineErrors: [], vchnumber: '' });
  }
  error(msg) {
    this.errors++;
    this.lineErrors.push(msg);
  }
}

/**
 * @param {import('./store.mjs').Store} store
 * @param {any[]} messages elements inside TALLYMESSAGE
 * @param {{remoteIdUpsert?: boolean, alterKeepsLists?: boolean, educational?: boolean, importDups?: string}} opts
 */
export function applyImport(store, messages, opts = {}) {
  const out = new ImportOutcome();
  for (const node of messages) {
    const type = node.name.toUpperCase();
    try {
      if (type === 'VOUCHER') importVoucher(store, node, out, opts);
      else if (MASTER_TYPES[type]) importMaster(store, MASTER_TYPES[type], type, node, out, opts);
      else if (type === 'COMPANY') out.ignored++;
      else out.error(`Unknown object type <${node.name}>`);
    } catch (err) {
      out.error(err.message);
    }
  }
  return out;
}

// ---------------- masters ----------------

function masterName(node) {
  const names = [];
  const lang = child(node, 'LANGUAGENAME.LIST');
  if (lang) for (const n of childrenNamed(child(lang, 'NAME.LIST'), 'NAME')) names.push(cleanText(textOf(n)));
  const direct = childText(node, 'NAME');
  return { name: names[0] || direct || '', aliases: names.slice(1) };
}

function parseMasterFields(node) {
  const f = {};
  for (const c of elementChildren(node)) {
    const tag = c.name.toUpperCase();
    if (tag === 'LANGUAGENAME.LIST' || tag === 'NAME') continue;
    if (tag.endsWith('.LIST')) {
      const k = tag.slice(0, -5).toLowerCase();
      const kids = elementChildren(c);
      if (kids.length && kids.every((x) => x.name.toUpperCase() === kids[0].name.toUpperCase() && elementChildren(x).length === 0) && kids[0].name.toUpperCase() === tag.slice(0, -5)) {
        f[k] = kids.map((x) => cleanText(textOf(x)));
      } else {
        const o = parseMasterFields(c);
        (f[k] = f[k] || []).push(o);
      }
    } else if (elementChildren(c).length) {
      f[tag.toLowerCase()] = parseMasterFields(c);
    } else {
      f[tag.toLowerCase()] = cleanText(textOf(c));
    }
  }
  return f;
}

function normaliseMaster(table, fields, store) {
  const m = { ...fields };
  if (m.parent !== undefined && (m.parent === '' || key(m.parent) === 'primary')) m.parent = SYS('Primary');
  if (table === 'ledgers') {
    if (m.openingbalance !== undefined) m.openingbalance = parseTallyAmount(m.openingbalance);
    if (m.billcreditperiod !== undefined) m.billcreditperiod = parseInt(m.billcreditperiod, 10) || 0;
    if (m.isbillwiseon !== undefined) m.isbillwiseon = yes(m.isbillwiseon);
    // Newer releases keep GST registration and address in dated sub-lists; mirror them into flat fields.
    const reg = Array.isArray(m.ledgstregdetails) ? m.ledgstregdetails[m.ledgstregdetails.length - 1] : null;
    if (reg) {
      if (reg.gstin && !m.partygstin) m.partygstin = reg.gstin;
      if (reg.gstregistrationtype && !m.gstregistrationtype) m.gstregistrationtype = reg.gstregistrationtype;
    }
    const mail = Array.isArray(m.ledmailingdetails) ? m.ledmailingdetails[m.ledmailingdetails.length - 1] : null;
    if (mail) {
      if (mail.state && !m.ledstatename) m.ledstatename = mail.state;
      if (mail.pincode && !m.pincode) m.pincode = mail.pincode;
      if (mail.mailingname && !m.mailingname) m.mailingname = mail.mailingname;
      if (mail.address && !m.address) m.address = mail.address;
      if (mail.country && !m.countryname) m.countryname = mail.country;
    }
    if (Array.isArray(m.billallocations)) {
      m.billallocations = m.billallocations.map((b) => ({
        name: b.name,
        billdate: fromTally(b.billdate) || store.company.booksfrom,
        openingbalance: parseTallyAmount(b.openingbalance),
        billcreditperiod: parseInt(b.billcreditperiod, 10) || 0,
      }));
    }
  }
  if (table === 'stockitems') {
    if (m.openingbalance !== undefined) {
      const q = parseQty(m.openingbalance);
      m.openingqty = q.qty;
      delete m.openingbalance;
    }
    if (m.openingvalue !== undefined) m.openingvalue = parseTallyAmount(m.openingvalue);
    if (m.openingrate !== undefined) m.openingrate = parseRate(m.openingrate).rate;
    const hsn = Array.isArray(m.hsndetails) ? m.hsndetails[m.hsndetails.length - 1] : null;
    if (hsn && hsn.hsncode) m.hsncode = hsn.hsncode;
    const gst = Array.isArray(m.gstdetails) ? m.gstdetails[m.gstdetails.length - 1] : null;
    if (gst) {
      if (gst.taxability) m.taxability = gst.taxability;
      const sw = Array.isArray(gst.statewisedetails) ? gst.statewisedetails[0] : null;
      const rates = sw && Array.isArray(sw.ratedetails) ? sw.ratedetails : [];
      const igst = rates.find((r) => /integrated/i.test(r.gstratedutyhead || ''));
      if (igst) m.igstrate = parseFloat(igst.gstrate) || 0;
      if (gst.hsncode && !m.hsncode) m.hsncode = gst.hsncode;
    }
  }
  if (table === 'units') {
    if (m.issimpleunit !== undefined) m.issimpleunit = yes(m.issimpleunit);
    if (m.decimalplaces !== undefined) m.decimalplaces = parseInt(m.decimalplaces, 10) || 0;
    if (!m.symbol) m.symbol = m.name;
  }
  return m;
}

function validateMaster(store, table, rec) {
  const needParentGroup = table === 'ledgers' || table === 'groups';
  if (needParentGroup && !isPrimary(rec.parent) && !store.getMaster('groups', rec.parent)) {
    throw new Error(`Group '${cleanText(rec.parent)}' does not exist!`);
  }
  if (table === 'ledgers' && isPrimary(rec.parent) && key(rec.name) !== 'profit & loss a/c') throw new Error(`Ledger '${rec.name}' needs a group (PARENT).`);
  const parentTable = { stockitems: 'stockgroups', stockgroups: 'stockgroups', stockcategories: 'stockcategories', godowns: 'godowns', costcentres: 'costcentres' }[table];
  if (parentTable && rec.parent && !isPrimary(rec.parent) && !store.getMaster(parentTable, rec.parent)) {
    throw new Error(`${parentTable === 'stockgroups' ? 'Stock Group' : 'Parent'} '${cleanText(rec.parent)}' does not exist!`);
  }
  if (table === 'stockitems' && rec.baseunits && !isNotApplicable(rec.baseunits) && !store.getMaster('units', rec.baseunits)) {
    throw new Error(`Unit '${rec.baseunits}' does not exist!`);
  }
  if (table === 'stockitems' && rec.category && !isNotApplicable(rec.category) && !store.getMaster('stockcategories', rec.category)) {
    throw new Error(`Stock Category '${rec.category}' does not exist!`);
  }
}

const isNotApplicable = (v) => /not applicable/i.test(String(v));

function masterInUse(store, table, name) {
  const k = key(name);
  if (table === 'ledgers') return store.data.vouchers.some((v) => store.allLedgerEntries(v).some((e) => key(e.ledgername) === k));
  if (table === 'stockitems') return store.data.vouchers.some((v) => store.inventoryLines(v).some((e) => key(e.stockitemname) === k));
  if (table === 'groups') return store.masters('ledgers').some((l) => key(l.parent) === k) || store.masters('groups').some((g) => key(g.parent) === k);
  if (table === 'units') return store.masters('stockitems').some((i) => key(i.baseunits) === k);
  if (table === 'vouchertypes') return store.data.vouchers.some((v) => key(v.vouchertypename) === k);
  if (table === 'godowns') return store.data.vouchers.some((v) => store.inventoryLines(v).some((e) => (e.batchallocations || []).some((b) => key(b.godownname) === k)));
  return false;
}

function importMaster(store, table, type, node, out, opts) {
  const action = String(node.attrs.ACTION || node.attrs.Action || node.attrs.action || 'Create').toLowerCase();
  const { name: innerName, aliases } = masterName(node);
  const attrName = node.attrs.NAME ?? node.attrs.Name ?? innerName;
  if (!attrName) throw new Error(`${type} without a name.`);
  const existing = store.getMaster(table, attrName);
  const label = type.charAt(0) + type.slice(1).toLowerCase();

  if (action === 'delete') {
    if (!existing) throw new Error(`${label} '${attrName}' does not exist!`);
    if (existing.isreserved) throw new Error(`Cannot delete reserved ${label} '${attrName}'.`);
    if (masterInUse(store, table, existing.name)) throw new Error(`Cannot delete ${label} '${existing.name}': it is in use.`);
    delete store.data[table][key(existing.name)];
    store.company.altmstid++;
    out.deleted++;
    return;
  }

  const fields = normaliseMaster(table, parseMasterFields(node), store);
  if (action === 'create' && !existing) {
    const rec = { name: innerName || attrName, ...fields };
    if (aliases.length) rec.aliases = aliases;
    validateMaster(store, table, rec);
    const saved = store.addMaster(table, rec);
    out.created++;
    out.lastmid = saved.masterid;
    return;
  }
  if (action === 'create' && existing) {
    // Tally treats a re-import of an existing master by its duplicate rule; opening balances follow IMPORTDUPS.
    const dups = String(opts.importDups || '').toLowerCase();
    if (dups.includes('ignorecombine')) {
      out.ignored++;
      return;
    }
    if (dups.includes('dupcombine') && fields.openingbalance !== undefined) {
      fields.openingbalance = (Number(existing.openingbalance) || 0) + Number(fields.openingbalance);
      out.combined++;
    } else out.altered++;
    applyAlter(store, table, existing, fields, innerName, aliases);
    return;
  }
  if (action === 'alter') {
    if (!existing) throw new Error(`${label} '${attrName}' does not exist!`);
    applyAlter(store, table, existing, fields, innerName, aliases);
    out.altered++;
    return;
  }
  throw new Error(`Unknown ACTION "${action}" for ${label}.`);
}

function applyAlter(store, table, existing, fields, innerName, aliases) {
  const merged = { ...existing, ...fields };
  if (aliases.length) merged.aliases = aliases;
  if (innerName && key(innerName) !== key(existing.name)) {
    if (store.getMaster(table, innerName)) throw new Error(`'${innerName}' already exists!`);
    merged.name = innerName;
    renameReferences(store, table, existing.name, innerName);
  }
  validateMaster(store, table, merged);
  merged.alterid = ++store.company.altmstid;
  delete store.data[table][key(existing.name)];
  store.data[table][key(merged.name)] = merged;
}

function renameReferences(store, table, from, to) {
  const k = key(from);
  if (table === 'ledgers') {
    for (const v of store.data.vouchers) {
      if (key(v.partyledgername) === k) v.partyledgername = to;
      for (const e of store.allLedgerEntries(v)) if (key(e.ledgername) === k) e.ledgername = to;
    }
  }
  if (table === 'groups') {
    for (const t of ['ledgers', 'groups']) for (const m of store.masters(t)) if (key(m.parent) === k) m.parent = to;
  }
  if (table === 'stockitems') {
    for (const v of store.data.vouchers) for (const e of store.inventoryLines(v)) if (key(e.stockitemname) === k) e.stockitemname = to;
  }
}

// ---------------- vouchers ----------------

function amountOf(node) {
  return parseTallyAmount(childText(node, 'AMOUNT'));
}

function parseBills(node) {
  return childrenNamed(node, 'BILLALLOCATIONS.LIST')
    .map((b) => ({
      name: childText(b, 'NAME'),
      billtype: childText(b, 'BILLTYPE') || 'New Ref',
      amount: amountOf(b),
      billcreditperiod: parseInt(childText(b, 'BILLCREDITPERIOD'), 10) || 0,
    }))
    .filter((b) => b.amount !== 0 || b.name);
}

function parseBank(node) {
  return childrenNamed(node, 'BANKALLOCATIONS.LIST').map((b) => {
    const o = {};
    for (const c of elementChildren(b)) o[c.name.toLowerCase()] = cleanText(textOf(c));
    o.amount = amountOf(b);
    if (o.instrumentdate) o.instrumentdate = fromTally(o.instrumentdate);
    if (o.bankersdate) o.bankersdate = fromTally(o.bankersdate);
    return o;
  });
}

function parseCostCentres(node) {
  const out = [];
  for (const cat of childrenNamed(node, 'CATEGORYALLOCATIONS.LIST')) {
    const category = childText(cat, 'CATEGORY');
    for (const cc of childrenNamed(cat, 'COSTCENTREALLOCATIONS.LIST')) out.push({ category, name: childText(cc, 'NAME'), amount: amountOf(cc) });
  }
  for (const cc of childrenNamed(node, 'COSTCENTREALLOCATIONS.LIST')) out.push({ category: '', name: childText(cc, 'NAME'), amount: amountOf(cc) });
  return out;
}

function parseLedgerEntry(n) {
  const amount = amountOf(n);
  return {
    ledgername: childText(n, 'LEDGERNAME'),
    amount,
    isdeemedpositive: childText(n, 'ISDEEMEDPOSITIVE') ? yes(childText(n, 'ISDEEMEDPOSITIVE')) : amount < 0,
    ispartyledger: yes(childText(n, 'ISPARTYLEDGER')),
    billallocations: parseBills(n),
    bankallocations: parseBank(n),
    costcentreallocations: parseCostCentres(n),
  };
}

function parseInventoryEntry(n) {
  const actual = childText(n, 'ACTUALQTY');
  const billed = childText(n, 'BILLEDQTY') || actual;
  const q = parseQty(actual || billed);
  const amount = amountOf(n);
  return {
    stockitemname: childText(n, 'STOCKITEMNAME'),
    isdeemedpositive: childText(n, 'ISDEEMEDPOSITIVE') ? yes(childText(n, 'ISDEEMEDPOSITIVE')) : amount < 0,
    rate: childText(n, 'RATE'),
    actualqty: actual || billed,
    billedqty: billed,
    qty: Math.abs(q.qty),
    unit: q.unit,
    amount,
    discount: parseFloat(childText(n, 'DISCOUNT')) || 0,
    batchallocations: childrenNamed(n, 'BATCHALLOCATIONS.LIST').map((b) => ({
      godownname: childText(b, 'GODOWNNAME'),
      batchname: childText(b, 'BATCHNAME'),
      destinationgodownname: childText(b, 'DESTINATIONGODOWNNAME'),
      orderno: childText(b, 'ORDERNO'),
      orderduedate: fromTally(childText(b, 'ORDERDUEDATE')),
      trackingnumber: childText(b, 'TRACKINGNUMBER'),
      amount: amountOf(b),
      actualqty: childText(b, 'ACTUALQTY'),
      qty: Math.abs(parseQty(childText(b, 'ACTUALQTY') || childText(b, 'BILLEDQTY')).qty),
    })),
    accountingallocations: childrenNamed(n, 'ACCOUNTINGALLOCATIONS.LIST').map(parseLedgerEntry),
  };
}

const KNOWN_VOUCHER_TAGS = new Set([
  'DATE',
  'EFFECTIVEDATE',
  'VOUCHERTYPENAME',
  'VOUCHERNUMBER',
  'REFERENCE',
  'REFERENCEDATE',
  'NARRATION',
  'PARTYLEDGERNAME',
  'PARTYNAME',
  'PLACEOFSUPPLY',
  'ISINVOICE',
  'ISOPTIONAL',
  'ISCANCELLED',
  'PERSISTEDVIEW',
  'GUID',
  'MASTERID',
  'ALTERID',
]);

/** Parse a VOUCHER element into the store's shape. Only lists present in the XML are set. */
export function parseVoucherNode(node) {
  const v = {};
  const d = childText(node, 'DATE') || node.attrs.DATE;
  if (d) v.date = fromTally(d);
  const t = childText(node, 'VOUCHERTYPENAME') || node.attrs.VCHTYPE;
  if (t) v.vouchertypename = t;
  for (const [tag, k] of [
    ['VOUCHERNUMBER', 'vouchernumber'],
    ['REFERENCE', 'reference'],
    ['NARRATION', 'narration'],
    ['PARTYLEDGERNAME', 'partyledgername'],
    ['PLACEOFSUPPLY', 'placeofsupply'],
    ['PERSISTEDVIEW', 'persistedview'],
  ]) {
    if (child(node, tag)) v[k] = childText(node, tag);
  }
  if (child(node, 'REFERENCEDATE')) v.referencedate = fromTally(childText(node, 'REFERENCEDATE'));
  if (child(node, 'ISINVOICE')) v.isinvoice = yes(childText(node, 'ISINVOICE'));
  if (child(node, 'ISOPTIONAL')) v.isoptional = yes(childText(node, 'ISOPTIONAL'));
  if (node.attrs.OBJVIEW && !v.persistedview) v.persistedview = node.attrs.OBJVIEW;
  const led = [...childrenNamed(node, 'ALLLEDGERENTRIES.LIST'), ...childrenNamed(node, 'LEDGERENTRIES.LIST')];
  if (led.length) v.ledgerentries = led.map(parseLedgerEntry);
  const inv = [...childrenNamed(node, 'ALLINVENTORYENTRIES.LIST'), ...childrenNamed(node, 'INVENTORYENTRIES.LIST')];
  if (inv.length) v.inventoryentries = inv.map(parseInventoryEntry);
  // Voucher-mode inventory nested inside a ledger entry
  for (const le of led) {
    const nested = childrenNamed(le, 'INVENTORYALLOCATIONS.LIST');
    if (nested.length) (v.inventoryentries = v.inventoryentries || []).push(...nested.map(parseInventoryEntry));
  }
  const ins = childrenNamed(node, 'INVENTORYENTRIESIN.LIST');
  if (ins.length) v.inventoryentriesin = ins.map(parseInventoryEntry);
  const outs = childrenNamed(node, 'INVENTORYENTRIESOUT.LIST');
  if (outs.length) v.inventoryentriesout = outs.map(parseInventoryEntry);
  const extra = {};
  for (const c of elementChildren(node)) {
    const tag = c.name.toUpperCase();
    if (!tag.endsWith('.LIST') && !KNOWN_VOUCHER_TAGS.has(tag) && elementChildren(c).length === 0) extra[tag.toLowerCase()] = cleanText(textOf(c));
  }
  if (Object.keys(extra).length) v.extra = extra;
  return v;
}

function findVoucher(store, node) {
  const a = node.attrs;
  const get = (n) => a[n] ?? a[n.toLowerCase()] ?? a[n.charAt(0) + n.slice(1).toLowerCase()];
  const remoteId = get('REMOTEID');
  const guid = get('GUID');
  if (guid) return store.data.vouchers.find((v) => v.guid === guid);
  const tagName = String(get('TAGNAME') || '').replace(/\s+/g, '').toLowerCase();
  const tagValue = get('TAGVALUE');
  const date = fromTally(get('DATE'));
  const vt = get('VCHTYPE');
  if (tagName) {
    if (!date) throw new Error('Voucher date is mandatory to identify an existing voucher.');
    return store.data.vouchers.find((v) => {
      if (v.date !== date) return false;
      if (vt && key(v.vouchertypename) !== key(vt)) return false;
      if (tagName === 'masterid') return String(v.masterid) === String(tagValue);
      if (tagName === 'vouchernumber') return String(v.vouchernumber) === String(tagValue);
      if (tagName === 'guid') return v.guid === tagValue;
      if (tagName === 'reference') return v.reference === tagValue;
      return false;
    });
  }
  if (remoteId) return store.data.vouchers.find((v) => v.remoteid === remoteId);
  return undefined;
}

function fmt(n) {
  return Math.abs(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function validateVoucher(store, v, opts) {
  const vt = store.getMaster('vouchertypes', v.vouchertypename);
  if (!vt) throw new Error(`Voucher Type '${v.vouchertypename}' does not exist!`);
  if (!v.date) throw new Error('Voucher date is missing.');
  if (v.date < store.company.booksfrom) throw new Error(`Date ${v.date} is before the books beginning date ${store.company.booksfrom}.`);
  if ((opts.educational || store.company.educational) && !allowedInEducationalMode(v.date)) {
    throw new Error(`Date ${v.date} is not allowed in Educational mode (only 1, 2 and the last day of a month).`);
  }
  if (v.partyledgername && !store.findMaster('ledgers', v.partyledgername)) throw new Error(`Ledger '${v.partyledgername}' does not exist!`);
  for (const e of store.allLedgerEntries(v)) {
    if (!store.findMaster('ledgers', e.ledgername)) throw new Error(`Ledger '${e.ledgername}' does not exist!`);
    if (e.billallocations && e.billallocations.length) {
      const sum = e.billallocations.reduce((s, b) => s + b.amount, 0);
      if (Math.abs(sum - e.amount) > 0.005) throw new Error(`Bill-wise allocations for '${e.ledgername}' (${fmt(sum)}) do not match the amount (${fmt(e.amount)}).`);
    }
  }
  for (const e of store.inventoryLines(v)) {
    const item = store.findMaster('stockitems', e.stockitemname);
    if (!item) throw new Error(`Stock Item '${e.stockitemname}' does not exist!`);
    for (const b of e.batchallocations || []) {
      if (b.godownname && !store.findMaster('godowns', b.godownname)) throw new Error(`Godown '${b.godownname}' does not exist!`);
      if (b.destinationgodownname && !store.findMaster('godowns', b.destinationgodownname)) throw new Error(`Godown '${b.destinationgodownname}' does not exist!`);
    }
  }
  const base = store.baseTypeOf(v.vouchertypename);
  const lines = store.allLedgerEntries(v);
  if (lines.length && (ACCOUNTING_BASES.has(base) || base === 'Sales Order' || base === 'Purchase Order' || base === 'Delivery Note' || base === 'Receipt Note')) {
    let dr = 0;
    let cr = 0;
    for (const e of lines) {
      if (e.amount < 0) dr += -e.amount;
      else cr += e.amount;
    }
    if (Math.abs(dr - cr) > 0.005) {
      throw new Error(`Voucher totals do not match! Dr: ${fmt(dr)} Dr Cr: ${fmt(cr)} Cr Diff: ${fmt(dr - cr)} ${dr > cr ? 'Dr' : 'Cr'}`);
    }
    if (lines.length < 2 && ACCOUNTING_BASES.has(base)) throw new Error('A voucher needs at least two ledger entries.');
  }
}

function nextNumber(store, typeName) {
  const nums = store.data.vouchers.filter((v) => key(v.vouchertypename) === key(typeName)).map((v) => parseInt(v.vouchernumber, 10) || 0);
  return String((nums.length ? Math.max(...nums) : 0) + 1);
}

function importVoucher(store, node, out, opts) {
  const action = String(node.attrs.ACTION || node.attrs.Action || node.attrs.action || 'Create').toLowerCase();
  const parsed = parseVoucherNode(node);
  const remoteId = node.attrs.REMOTEID || node.attrs.RemoteId;

  if (action === 'create' && !(opts.remoteIdUpsert && remoteId && store.data.vouchers.some((v) => v.remoteid === remoteId))) {
    const v = { ...parsed, ledgerentries: parsed.ledgerentries || [], inventoryentries: parsed.inventoryentries || [] };
    if (parsed.inventoryentriesin) v.inventoryentriesin = parsed.inventoryentriesin;
    if (parsed.inventoryentriesout) v.inventoryentriesout = parsed.inventoryentriesout;
    v.isoptional = !!parsed.isoptional;
    v.iscancelled = false;
    validateVoucher(store, v, opts);
    if (!v.vouchernumber) v.vouchernumber = nextNumber(store, v.vouchertypename);
    v.masterid = store.nextMasterId();
    v.alterid = ++store.company.altvchid;
    v.guid = store.guidFor(v.masterid);
    if (remoteId) v.remoteid = remoteId;
    store.data.vouchers.push(v);
    out.created++;
    out.lastvchid = v.masterid;
    out.vchnumber = v.vouchernumber;
    return;
  }

  const existing = action === 'create' ? store.data.vouchers.find((v) => v.remoteid === remoteId) : findVoucher(store, node);
  if (!existing) throw new Error('Voucher not found: the identifying details (date, type, tag) do not match any voucher.');

  if (action === 'delete') {
    store.data.vouchers.splice(store.data.vouchers.indexOf(existing), 1);
    store.company.altvchid++;
    out.deleted++;
    out.lastvchid = existing.masterid;
    return;
  }
  if (action === 'cancel') {
    existing.iscancelled = true;
    if (parsed.narration !== undefined) existing.narration = parsed.narration;
    existing.alterid = ++store.company.altvchid;
    out.cancelled++;
    out.lastvchid = existing.masterid;
    return;
  }
  if (action === 'alter' || action === 'create') {
    const merged = { ...existing };
    for (const [k, val] of Object.entries(parsed)) {
      if (k === 'extra') merged.extra = { ...(existing.extra || {}), ...val };
      else merged[k] = val;
    }
    // Lists absent from the XML are kept, unless the simulator is told to mimic a Tally that drops them.
    if (opts.alterDropsLists) {
      for (const k of ['ledgerentries', 'inventoryentries', 'inventoryentriesin', 'inventoryentriesout']) if (!(k in parsed)) merged[k] = [];
    }
    validateVoucher(store, merged, opts);
    merged.alterid = ++store.company.altvchid;
    store.data.vouchers[store.data.vouchers.indexOf(existing)] = merged;
    out.altered++;
    out.lastvchid = merged.masterid;
    return;
  }
  throw new Error(`Unknown ACTION "${action}" for voucher.`);
}
