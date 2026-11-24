// Pure helpers for TallyPrime XML: no network, no database. Unit-tested in test/xml.test.js.
// Tally conventions used here:
//   - Dates are YYYYMMDD.
//   - In ledger entries, a DEBIT is a negative AMOUNT with ISDEEMEDPOSITIVE=Yes,
//     a CREDIT is a positive AMOUNT with ISDEEMEDPOSITIVE=No.
//   - Quantities come as text with a unit, e.g. "10.000 Ltr".
// Field names differ slightly between TallyPrime releases (notably GST details on ledgers).
// Every builder here must be checked on a TEST COPY of a company before live use.

import { XMLParser } from 'fast-xml-parser';

export const WRITE_TAG_PREFIX = 'GSOS:';

export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Tally sometimes answers in UTF-16LE and sometimes emits control-character entities
// (for example &#4;) that are not valid XML. Normalise both before parsing.
export function decodeTallyResponse(buffer) {
  const buf = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
  let text;
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) text = buf.subarray(2).toString('utf16le');
  else if (buf.length >= 2 && buf[1] === 0x00 && buf[0] !== 0x00) text = buf.toString('utf16le');
  else text = buf.toString('utf8');
  return sanitiseXml(text);
}

export function sanitiseXml(text) {
  return text
    .replace(/&#(?:x0*[0-8bcef]|x0*1[0-9a-f]|0*[0-8]|0*1[1-2]|0*1[4-9]|0*2[0-9]|0*3[01]);/gi, '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
}

const LIST_TAGS = new Set([
  'LEDGER', 'GROUP', 'STOCKITEM', 'STOCKGROUP', 'UNIT', 'GODOWN', 'COSTCENTRE', 'VOUCHERTYPE', 'COMPANY', 'VOUCHER',
  'ALLLEDGERENTRIES.LIST', 'LEDGERENTRIES.LIST', 'ALLINVENTORYENTRIES.LIST', 'INVENTORYENTRIES.LIST',
  'BATCHALLOCATIONS.LIST', 'BILLALLOCATIONS.LIST', 'ACCOUNTINGALLOCATIONS.LIST', 'CATEGORYALLOCATIONS.LIST',
  'COSTCENTREALLOCATIONS.LIST', 'LINEERROR'
]);

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@',
  parseTagValue: false,
  trimValues: true,
  isArray: (name) => LIST_TAGS.has(name)
});

export function parseXml(text) {
  return parser.parse(text);
}

// Finds every element with the given tag name anywhere in a parsed tree.
export function findAll(node, tag, out = []) {
  if (node == null || typeof node !== 'object') return out;
  for (const [key, value] of Object.entries(node)) {
    if (key === tag) {
      if (Array.isArray(value)) out.push(...value);
      else out.push(value);
    } else if (Array.isArray(value)) value.forEach((v) => findAll(v, tag, out));
    else if (typeof value === 'object') findAll(value, tag, out);
  }
  return out;
}

export function text(node) {
  if (node == null) return null;
  if (typeof node === 'string') return node;
  if (typeof node === 'object' && '#text' in node) return String(node['#text']);
  return null;
}

export function yesNo(value) {
  const t = (text(value) || '').trim().toLowerCase();
  return t === 'yes';
}

export function toNumber(value) {
  const t = (text(value) || '').replace(/,/g, '').trim();
  if (!t) return 0;
  const m = t.match(/-?\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : 0;
}

// "10.000 Ltr" -> { qty: 10, unit: "Ltr" }. "-5 Kg" -> { qty: -5, unit: "Kg" }.
export function parseQty(value) {
  const t = (text(value) || '').trim();
  if (!t) return { qty: 0, unit: null };
  const m = t.match(/^(-?[\d,.]+)\s*(.*)$/);
  if (!m) return { qty: 0, unit: null };
  return { qty: Number(m[1].replace(/,/g, '')), unit: m[2] ? m[2].split('=')[0].trim() : null };
}

// "20261125" -> "2026-11-25"
export function tallyDateToIso(value) {
  const t = (text(value) || '').trim();
  if (!/^\d{8}$/.test(t)) return null;
  return `${t.slice(0, 4)}-${t.slice(4, 6)}-${t.slice(6, 8)}`;
}

// "2026-11-25" -> "20261125"
export function isoToTallyDate(iso) {
  return String(iso).replace(/-/g, '').slice(0, 8);
}

function staticVars(vars) {
  return Object.entries(vars)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `<${k}>${esc(v)}</${k}>`)
    .join('');
}

// Export a collection with inline TDL. `filter` is a TDL formula without the collection name,
// e.g. "$AlterID > 1200". Keep FETCH lists explicit so Tally does not send everything.
export function buildCollectionRequest({ id, type, fetch, filter, company, fromDate, toDate, childOf }) {
  const filterName = filter ? `${id}Filter` : null;
  return `<ENVELOPE><HEADER><VERSION>1</VERSION><TALLYREQUEST>Export</TALLYREQUEST><TYPE>Collection</TYPE><ID>${esc(id)}</ID></HEADER>`
    + `<BODY><DESC><STATICVARIABLES>${staticVars({
      SVEXPORTFORMAT: '$$SysName:XML',
      SVCURRENTCOMPANY: company,
      SVFROMDATE: fromDate ? isoToTallyDate(fromDate) : undefined,
      SVTODATE: toDate ? isoToTallyDate(toDate) : undefined
    })}</STATICVARIABLES>`
    + `<TDL><TDLMESSAGE><COLLECTION NAME="${esc(id)}" ISMODIFY="No"><TYPE>${esc(type)}</TYPE>`
    + (childOf ? `<CHILDOF>${esc(childOf)}</CHILDOF>` : '')
    + `<FETCH>${fetch.map(esc).join(', ')}</FETCH>`
    + (filterName ? `<FILTER>${filterName}</FILTER>` : '')
    + `</COLLECTION>`
    + (filterName ? `<SYSTEM TYPE="Formulae" NAME="${filterName}">${esc(filter)}</SYSTEM>` : '')
    + `</TDLMESSAGE></TDL></DESC></BODY></ENVELOPE>`;
}

function importEnvelope(reportName, company, inner) {
  return `<ENVELOPE><HEADER><TALLYREQUEST>Import Data</TALLYREQUEST></HEADER><BODY><IMPORTDATA>`
    + `<REQUESTDESC><REPORTNAME>${esc(reportName)}</REPORTNAME><STATICVARIABLES>${staticVars({ SVCURRENTCOMPANY: company })}</STATICVARIABLES></REQUESTDESC>`
    + `<REQUESTDATA><TALLYMESSAGE xmlns:UDF="TallyUDF">${inner}</TALLYMESSAGE></REQUESTDATA>`
    + `</IMPORTDATA></BODY></ENVELOPE>`;
}

// payload: { name, parent, gstin?, gstRegistrationType?, state?, pincode?, address?: string[], billWise?: bool,
//            mobile?, email?, gstApplicableFrom? (ISO) }
export function buildLedgerCreate(company, p) {
  const addr = (p.address || []).filter(Boolean).map((a) => `<ADDRESS>${esc(a)}</ADDRESS>`).join('');
  const gst = p.gstin
    ? `<LEDGSTREGDETAILS.LIST><APPLICABLEFROM>${esc(isoToTallyDate(p.gstApplicableFrom || '2017-07-01'))}</APPLICABLEFROM>`
      + `<GSTREGISTRATIONTYPE>${esc(p.gstRegistrationType || 'Regular')}</GSTREGISTRATIONTYPE>`
      + `<STATE>${esc(p.state || '')}</STATE><GSTIN>${esc(p.gstin)}</GSTIN></LEDGSTREGDETAILS.LIST>`
      // Older TallyPrime releases read these flat fields instead of LEDGSTREGDETAILS.LIST.
      + `<PARTYGSTIN>${esc(p.gstin)}</PARTYGSTIN><GSTREGISTRATIONTYPE>${esc(p.gstRegistrationType || 'Regular')}</GSTREGISTRATIONTYPE>`
    : '';
  const inner = `<LEDGER NAME="${esc(p.name)}" ACTION="Create">`
    + `<NAME.LIST TYPE="String"><NAME>${esc(p.name)}</NAME></NAME.LIST>`
    + `<PARENT>${esc(p.parent)}</PARENT>`
    + `<ISBILLWISEON>${p.billWise === false ? 'No' : 'Yes'}</ISBILLWISEON>`
    + (addr ? `<ADDRESS.LIST TYPE="String">${addr}</ADDRESS.LIST>` : '')
    + (p.state ? `<LEDSTATENAME>${esc(p.state)}</LEDSTATENAME><STATENAME>${esc(p.state)}</STATENAME>` : '')
    + `<COUNTRYNAME>India</COUNTRYNAME>`
    + (p.pincode ? `<PINCODE>${esc(p.pincode)}</PINCODE>` : '')
    + (p.mobile ? `<LEDGERMOBILE>${esc(p.mobile)}</LEDGERMOBILE>` : '')
    + (p.email ? `<EMAIL>${esc(p.email)}</EMAIL>` : '')
    + gst
    + `</LEDGER>`;
  return importEnvelope('All Masters', company, inner);
}

export function writeTag(queueId) {
  return `[${WRITE_TAG_PREFIX}${queueId}]`;
}

// Ledger entries: amounts follow Tally's sign: negative = debit, positive = credit. They must sum to 0.
// payload: {
//   voucherType, date (ISO), partyLedger?, narration?, reference?,
//   ledgerEntries: [{ ledger, amount, isParty?, billRef?: { name, type: 'New Ref'|'Agst Ref'|'On Account' }, costCentre? }],
//   inventoryEntries?: [{ item, qty, unit, rate, amount, salesLedger, godown?, batch? }]   // invoice-style vouchers only
// }
export function validateVoucherPayload(p) {
  const errors = [];
  if (!p || typeof p !== 'object') return ['payload missing'];
  if (!p.voucherType) errors.push('voucherType missing');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(p.date || '')) errors.push('date must be YYYY-MM-DD');
  if (!Array.isArray(p.ledgerEntries) || p.ledgerEntries.length === 0) errors.push('ledgerEntries missing');
  const inv = p.inventoryEntries || [];
  const ledgerSum = (p.ledgerEntries || []).reduce((s, e) => s + Number(e.amount || 0), 0);
  const invSum = inv.reduce((s, e) => s + Number(e.amount || 0), 0);
  if (Math.abs(round2(ledgerSum + invSum)) > 0.005) errors.push(`entries do not balance (difference ${round2(ledgerSum + invSum)})`);
  for (const e of p.ledgerEntries || []) if (!e.ledger) errors.push('a ledger entry has no ledger');
  for (const e of inv) {
    if (!e.item) errors.push('an inventory entry has no item');
    if (!e.salesLedger) errors.push(`inventory entry ${e.item || '?'} has no salesLedger`);
    if (!(Number(e.qty) > 0)) errors.push(`inventory entry ${e.item || '?'} needs a positive qty`);
  }
  return errors;
}

function round2(n) { return Math.round(n * 100) / 100; }
function amt(n) { return round2(Number(n)).toFixed(2); }

// Builds an OPTIONAL voucher. Accountants convert it to a regular voucher in TallyPrime by hand.
export function buildOptionalVoucher(company, queueId, p) {
  const errors = validateVoucherPayload(p);
  if (errors.length) throw new Error(`invalid voucher payload: ${errors.join('; ')}`);
  const inv = p.inventoryEntries || [];
  const isInvoice = inv.length > 0;
  const narration = `${p.narration ? p.narration + ' ' : ''}${writeTag(queueId)}`;
  // For sales-type invoices goods go OUT: inventory ISDEEMEDPOSITIVE=No with positive amount.
  // For credit notes (sales return) goods come IN: ISDEEMEDPOSITIVE=Yes with negative amount.
  const invXml = inv.map((e) => {
    const inward = Number(e.amount) < 0;
    const q = `${Number(e.qty)} ${e.unit || ''}`.trim();
    const batch = (e.godown || e.batch)
      ? `<BATCHALLOCATIONS.LIST>${e.godown ? `<GODOWNNAME>${esc(e.godown)}</GODOWNNAME>` : ''}${e.batch ? `<BATCHNAME>${esc(e.batch)}</BATCHNAME>` : ''}`
        + `<AMOUNT>${amt(e.amount)}</AMOUNT><ACTUALQTY>${esc(q)}</ACTUALQTY><BILLEDQTY>${esc(q)}</BILLEDQTY></BATCHALLOCATIONS.LIST>`
      : '';
    return `<ALLINVENTORYENTRIES.LIST><STOCKITEMNAME>${esc(e.item)}</STOCKITEMNAME>`
      + `<ISDEEMEDPOSITIVE>${inward ? 'Yes' : 'No'}</ISDEEMEDPOSITIVE>`
      + (e.rate != null ? `<RATE>${esc(`${e.rate}/${e.unit || ''}`)}</RATE>` : '')
      + `<AMOUNT>${amt(e.amount)}</AMOUNT><ACTUALQTY>${esc(q)}</ACTUALQTY><BILLEDQTY>${esc(q)}</BILLEDQTY>`
      + batch
      + `<ACCOUNTINGALLOCATIONS.LIST><LEDGERNAME>${esc(e.salesLedger)}</LEDGERNAME><ISDEEMEDPOSITIVE>${inward ? 'Yes' : 'No'}</ISDEEMEDPOSITIVE><AMOUNT>${amt(e.amount)}</AMOUNT></ACCOUNTINGALLOCATIONS.LIST>`
      + `</ALLINVENTORYENTRIES.LIST>`;
  }).join('');
  const ledXml = p.ledgerEntries.map((e) => {
    const debit = Number(e.amount) < 0;
    const bill = e.billRef
      ? `<BILLALLOCATIONS.LIST><NAME>${esc(e.billRef.name)}</NAME><BILLTYPE>${esc(e.billRef.type || 'New Ref')}</BILLTYPE><AMOUNT>${amt(e.amount)}</AMOUNT></BILLALLOCATIONS.LIST>`
      : '';
    const cc = e.costCentre
      ? `<CATEGORYALLOCATIONS.LIST><CATEGORY>Primary Cost Category</CATEGORY><ISDEEMEDPOSITIVE>${debit ? 'Yes' : 'No'}</ISDEEMEDPOSITIVE><COSTCENTREALLOCATIONS.LIST><NAME>${esc(e.costCentre)}</NAME><AMOUNT>${amt(e.amount)}</AMOUNT></COSTCENTREALLOCATIONS.LIST></CATEGORYALLOCATIONS.LIST>`
      : '';
    return `<LEDGERENTRIES.LIST><LEDGERNAME>${esc(e.ledger)}</LEDGERNAME>`
      + `<ISDEEMEDPOSITIVE>${debit ? 'Yes' : 'No'}</ISDEEMEDPOSITIVE>`
      + (e.isParty ? '<ISPARTYLEDGER>Yes</ISPARTYLEDGER>' : '')
      + `<AMOUNT>${amt(e.amount)}</AMOUNT>${bill}${cc}</LEDGERENTRIES.LIST>`;
  }).join('');
  const view = isInvoice ? 'Invoice Voucher View' : 'Accounting Voucher View';
  const inner = `<VOUCHER VCHTYPE="${esc(p.voucherType)}" ACTION="Create" OBJVIEW="${view}">`
    + `<DATE>${isoToTallyDate(p.date)}</DATE>`
    + `<VOUCHERTYPENAME>${esc(p.voucherType)}</VOUCHERTYPENAME>`
    + (p.partyLedger ? `<PARTYLEDGERNAME>${esc(p.partyLedger)}</PARTYLEDGERNAME>` : '')
    + (p.reference ? `<REFERENCE>${esc(p.reference)}</REFERENCE>` : '')
    + `<NARRATION>${esc(narration)}</NARRATION>`
    + `<PERSISTEDVIEW>${view}</PERSISTEDVIEW>`
    + `<ISINVOICE>${isInvoice ? 'Yes' : 'No'}</ISINVOICE>`
    + `<ISOPTIONAL>Yes</ISOPTIONAL>`
    + invXml + ledXml
    + `</VOUCHER>`;
  return importEnvelope('Vouchers', company, inner);
}

// Reads Tally's import reply. Returns counts plus every LINEERROR text.
export function parseImportResponse(textBody) {
  const tree = parseXml(textBody);
  const pick = (tag) => toNumber(findAll(tree, tag)[0]);
  const lineErrors = findAll(tree, 'LINEERROR').map((e) => text(e)).filter(Boolean);
  const result = {
    created: pick('CREATED'),
    altered: pick('ALTERED'),
    deleted: pick('DELETED'),
    ignored: pick('IGNORED'),
    errors: pick('ERRORS'),
    exceptions: pick('EXCEPTIONS'),
    lastVoucherId: pick('LASTVCHID'),
    lastMasterId: pick('LASTMID'),
    lineErrors
  };
  result.ok = result.errors === 0 && result.exceptions === 0 && lineErrors.length === 0 && (result.created + result.altered) > 0;
  return result;
}
