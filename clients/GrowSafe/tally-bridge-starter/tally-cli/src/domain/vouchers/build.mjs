/**
 * Build Tally voucher XML from a validated plan.
 * Sign convention (Tally): debit = ISDEEMEDPOSITIVE Yes with a negative AMOUNT; credit = No with a positive AMOUNT.
 */
import { el, tag, jsonToNodes } from '../../core/xml.mjs';
import { paiseToString, formatQty, formatRate } from '../../core/amounts.mjs';
import { toTallyBody, toTallyVar } from '../../core/dates.mjs';
import { BILL_TYPES } from './kinds.mjs';

const yn = (b) => (b ? 'Yes' : 'No');
const signed = (side, paise) => paiseToString(side === 'debit' ? -paise : paise);

function billNodes(bills, side) {
  return (bills || []).map((b) =>
    el(
      'BILLALLOCATIONS.LIST',
      {},
      tag('NAME', b.ref || ''),
      tag('BILLTYPE', BILL_TYPES[b.type] || b.type),
      b.creditDays ? tag('BILLCREDITPERIOD', `${b.creditDays} Days`) : null,
      tag('AMOUNT', signed(side, b.paise)),
    ),
  );
}

function bankNode(bank, side, paise) {
  if (!bank) return null;
  return el(
    'BANKALLOCATIONS.LIST',
    {},
    tag('DATE', bank.instrumentDate ? toTallyBody(bank.instrumentDate) : undefined),
    tag('INSTRUMENTDATE', bank.instrumentDate ? toTallyBody(bank.instrumentDate) : undefined),
    tag('TRANSACTIONTYPE', bank.transactionType),
    bank.transferMode ? tag('TRANSFERMODE', bank.transferMode) : null,
    bank.instrumentNumber ? tag('INSTRUMENTNUMBER', bank.instrumentNumber) : null,
    bank.bankName ? tag('BANKNAME', bank.bankName) : null,
    bank.upiId ? tag('VIRTUALPAYMENTADDRESS', bank.upiId) : null,
    bank.bankersDate ? tag('BANKERSDATE', toTallyBody(bank.bankersDate)) : null,
    tag('AMOUNT', signed(side, paise)),
  );
}

function costNodes(cc, side) {
  if (!cc || !cc.length) return [];
  const cats = new Map();
  for (const c of cc) {
    if (!cats.has(c.category)) cats.set(c.category, []);
    cats.get(c.category).push(c);
  }
  return [...cats.entries()].map(([cat, list]) =>
    el('CATEGORYALLOCATIONS.LIST', {}, tag('CATEGORY', cat), tag('ISDEEMEDPOSITIVE', yn(side === 'debit')), list.map((c) => el('COSTCENTREALLOCATIONS.LIST', {}, tag('NAME', c.name), tag('AMOUNT', signed(side, c.paise))))),
  );
}

function ledgerEntry(e, tagName) {
  return el(
    tagName,
    {},
    tag('LEDGERNAME', e.ledger),
    tag('ISDEEMEDPOSITIVE', yn(e.side === 'debit')),
    e.isParty ? tag('ISPARTYLEDGER', 'Yes') : null,
    e.isParty ? tag('ISLASTDEEMEDPOSITIVE', yn(e.side === 'debit')) : null,
    tag('AMOUNT', signed(e.side, e.paise)),
    billNodes(e.bills, e.side),
    bankNode(e.bank, e.side, e.paise),
    costNodes(e.costCentres, e.side),
    e.raw ? jsonToNodes(e.raw) : null,
  );
}

function inventoryEntry(it, tagName, { withLedger = true } = {}) {
  const qty = formatQty(it.qty, it.unit);
  const amount = signed(it.side, it.paise);
  return el(
    tagName,
    {},
    tag('STOCKITEMNAME', it.item),
    tag('ISDEEMEDPOSITIVE', yn(it.side === 'debit')),
    tag('RATE', formatRate(it.rate, it.per || it.unit)),
    it.discountPct ? tag('DISCOUNT', it.discountPct) : null,
    tag('AMOUNT', amount),
    tag('ACTUALQTY', qty),
    tag('BILLEDQTY', qty),
    el(
      'BATCHALLOCATIONS.LIST',
      {},
      tag('GODOWNNAME', it.godown || 'Main Location'),
      tag('BATCHNAME', it.batch || 'Primary Batch'),
      it.destinationGodown ? tag('DESTINATIONGODOWNNAME', it.destinationGodown) : null,
      it.orderNo ? tag('ORDERNO', it.orderNo) : null,
      it.dueDate ? tag('ORDERDUEDATE', toTallyVar(it.dueDate)) : null,
      tag('AMOUNT', amount),
      tag('ACTUALQTY', qty),
      tag('BILLEDQTY', qty),
    ),
    withLedger && it.ledger ? el('ACCOUNTINGALLOCATIONS.LIST', {}, tag('LEDGERNAME', it.ledger), tag('ISDEEMEDPOSITIVE', yn(it.side === 'debit')), tag('AMOUNT', amount)) : null,
    it.raw ? jsonToNodes(it.raw) : null,
  );
}

/**
 * Build the VOUCHER element.
 * @param {object} plan from normaliseVoucher
 * @param {{action?: 'Create'|'Alter', identify?: {date: string, tagName: string, tagValue: string, voucherType: string}, remoteId?: string, template?: object}} opts
 */
export function buildVoucher(plan, opts = {}) {
  const action = opts.action || 'Create';
  const invoice = plan.shape === 'invoice';
  const view = invoice ? 'Invoice Voucher View' : 'Accounting Voucher View';
  const attrs = { VCHTYPE: plan.voucherType, ACTION: action, OBJVIEW: plan.shape === 'stock' ? 'Consumption Voucher View' : view };
  if (opts.remoteId) attrs.REMOTEID = opts.remoteId;
  if (opts.identify) {
    attrs.DATE = toTallyVar(opts.identify.date);
    attrs.TAGNAME = opts.identify.tagName;
    attrs.TAGVALUE = opts.identify.tagValue;
    attrs.VCHTYPE = opts.identify.voucherType;
  }
  const template = opts.template || {};
  const set = new Set();
  const head = [];
  const push = (name, value) => {
    if (value === undefined || value === null) return;
    set.add(name);
    head.push(tag(name, value));
  };
  push('DATE', toTallyBody(plan.date));
  push('EFFECTIVEDATE', toTallyBody(plan.date));
  push('VOUCHERTYPENAME', plan.voucherType);
  if (plan.number) push('VOUCHERNUMBER', plan.number);
  if (plan.reference?.number) push('REFERENCE', plan.reference.number);
  if (plan.reference?.date) push('REFERENCEDATE', toTallyBody(plan.reference.date));
  if (plan.narration !== undefined) push('NARRATION', plan.narration);
  if (plan.party) {
    push('PARTYLEDGERNAME', plan.party);
    if (invoice) {
      push('PARTYNAME', plan.party);
      push('BASICBUYERNAME', plan.party);
    }
  }
  if (plan.placeOfSupply) push('PLACEOFSUPPLY', plan.placeOfSupply);
  if (plan.shape !== 'stock') push('PERSISTEDVIEW', view);
  push('ISINVOICE', yn(invoice));
  push('ISOPTIONAL', yn(!!plan.optional));
  // Site template tags (captured from a correct voucher in this Tally) fill in anything not set above.
  for (const [k, v] of Object.entries(template.voucher || {})) if (!set.has(k.toUpperCase())) head.push(tag(k.toUpperCase(), v));
  const raw = plan.raw?.voucher ? jsonToNodes(plan.raw.voucher) : plan.raw && !plan.raw.voucher ? jsonToNodes(plan.raw) : [];

  let body;
  if (plan.shape === 'accounting') {
    body = plan.entries.map((e) => ledgerEntry(e, 'ALLLEDGERENTRIES.LIST'));
  } else if (plan.shape === 'invoice') {
    body = [...plan.entries.map((e) => ledgerEntry(e, 'LEDGERENTRIES.LIST')), ...plan.items.map((it) => inventoryEntry(it, 'ALLINVENTORYENTRIES.LIST'))];
  } else {
    body = [
      ...plan.items.filter((i) => i.direction === 'out').map((it) => inventoryEntry(it, 'INVENTORYENTRIESOUT.LIST', { withLedger: false })),
      ...plan.items.filter((i) => i.direction === 'in').map((it) => inventoryEntry(it, 'INVENTORYENTRIESIN.LIST', { withLedger: false })),
    ];
  }
  return el('VOUCHER', attrs, head, raw, body);
}

/** Minimal element for cancel / delete, in the form Tally's documentation shows. */
export function buildVoucherAction(action, identify, narration) {
  return el(
    'VOUCHER',
    { DATE: toTallyVar(identify.date), TAGNAME: identify.tagName, TAGVALUE: identify.tagValue, VCHTYPE: identify.voucherType, ACTION: action },
    narration && action === 'Cancel' ? tag('NARRATION', narration) : null,
  );
}

/** Header-only alter (only used when the site's selftest confirmed that lists are kept). */
export function buildHeaderAlter(identify, fields) {
  return el(
    'VOUCHER',
    { DATE: toTallyVar(identify.date), TAGNAME: identify.tagName, TAGVALUE: identify.tagValue, VCHTYPE: identify.voucherType, ACTION: 'Alter' },
    tag('DATE', toTallyBody(fields.date || identify.date)),
    fields.narration !== undefined ? tag('NARRATION', fields.narration) : null,
    fields.reference !== undefined ? tag('REFERENCE', fields.reference) : null,
    fields.optional !== undefined ? tag('ISOPTIONAL', yn(fields.optional)) : null,
  );
}
