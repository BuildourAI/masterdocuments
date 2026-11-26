/**
 * Masters: groups, ledgers, stock items and the other master types.
 * One declarative spec per type drives reading (flat-report fields) and writing (XML builders).
 */
import { el, tag, jsonToNodes, serialize } from '../core/xml.mjs';
import { toSided, fromSided, toPaise, paiseToString, formatQty, formatRate } from '../core/amounts.mjs';
import { TallyCliError } from '../core/errors.mjs';
import { F } from '../core/tdl.mjs';
import { importData } from '../core/envelope.mjs';
import { norm, resolveIn, auditedImport, dryRunResult, searchRows, limitRows } from './common.mjs';
import { findState, checkGstin } from './gst.mjs';
import { toTallyBody, today } from '../core/dates.mjs';

const NA = (m) => `if $$IsEqual:$${m}:$$SysName:NotApplicable then "" else $${m}`;
const SIDED = (v) => toSided(v);

/** Read specs. `fields` feed the flat report; `shape` turns a row into output JSON. */
export const MASTER_SPECS = {
  group: {
    tally: 'Group',
    tag: 'GROUP',
    label: 'Group',
    fields: [
      { key: 'name', method: 'Name' },
      { key: 'parent', method: 'Parent', type: 'parent' },
      { key: 'primaryGroup', method: '_PrimaryGroup' },
      { key: 'isRevenue', method: 'IsRevenue', type: 'logical' },
      { key: 'isDeemedPositive', method: 'IsDeemedPositive', type: 'logical' },
      { key: 'affectsGrossProfit', method: 'AffectsGrossProfit', type: 'logical' },
      { key: 'closing', method: 'ClosingBalance', type: 'amount' },
      { key: 'guid', method: 'Guid' },
      { key: 'masterId', method: 'MasterId', type: 'number' },
      { key: 'alterId', method: 'AlterId', type: 'number' },
    ],
    shape: (r) => ({
      name: r.name,
      parent: r.parent || null,
      primaryGroup: r.primaryGroup || null,
      nature: r.isRevenue ? (r.isDeemedPositive ? 'expense' : 'income') : r.isDeemedPositive ? 'asset' : 'liability',
      affectsGrossProfit: r.affectsGrossProfit,
      closingBalance: SIDED(r.closing),
      guid: r.guid,
      masterId: r.masterId,
      alterId: r.alterId,
    }),
  },
  ledger: {
    tally: 'Ledger',
    tag: 'LEDGER',
    label: 'Ledger',
    fields: [
      { key: 'name', method: 'Name' },
      { key: 'parent', method: 'Parent', type: 'parent' },
      { key: 'alias', method: 'OnlyAlias' },
      { key: 'opening', method: 'OpeningBalance', type: 'amount' },
      { key: 'closing', method: 'ClosingBalance', type: 'amount' },
      { key: 'mailingName', method: 'MailingName' },
      { key: 'address', expr: 'if $$IsEmpty:$Address then "" else $$FullList:Address:$Address' },
      { key: 'state', method: 'LedStateName' },
      { key: 'country', method: 'CountryName' },
      { key: 'pincode', method: 'PinCode' },
      { key: 'email', method: 'Email' },
      { key: 'mobile', method: 'LedgerMobile' },
      { key: 'contact', method: 'LedgerContact' },
      { key: 'pan', method: 'IncomeTaxNumber' },
      { key: 'gstin', expr: 'if $$IsEmpty:$PartyGSTIN then $LedGSTRegDetails[Last].GSTIN else $PartyGSTIN' },
      { key: 'gstRegistrationType', expr: 'if $$IsEmpty:$GSTRegistrationType then $LedGSTRegDetails[Last].GSTRegistrationType else $GSTRegistrationType' },
      { key: 'gstDutyHead', method: 'GSTDutyHead' },
      { key: 'billWise', method: 'IsBillWiseOn', type: 'logical' },
      { key: 'creditDays', expr: '$$Number:$BillCreditPeriod', type: 'number' },
      { key: 'bankAccount', method: 'BankDetails' },
      { key: 'ifsc', method: 'IFSCode' },
      { key: 'primaryGroup', method: '_PrimaryGroup' },
      { key: 'isRevenue', method: 'IsRevenue', type: 'logical' },
      { key: 'guid', method: 'Guid' },
      { key: 'masterId', method: 'MasterId', type: 'number' },
      { key: 'alterId', method: 'AlterId', type: 'number' },
    ],
    shape: (r) => ({
      name: r.name,
      group: r.parent || null,
      primaryGroup: r.primaryGroup || null,
      alias: r.alias || null,
      openingBalance: SIDED(r.opening),
      closingBalance: SIDED(r.closing),
      gstin: r.gstin || null,
      gstRegistrationType: r.gstRegistrationType || null,
      gstDutyHead: r.gstDutyHead || null,
      pan: r.pan || null,
      mailingName: r.mailingName || null,
      address: r.address ? r.address.split(/,\s*|\n/).filter(Boolean) : [],
      state: r.state || null,
      country: r.country || null,
      pincode: r.pincode || null,
      contact: { person: r.contact || null, phone: r.mobile || null, email: r.email || null },
      billWise: r.billWise,
      creditDays: r.creditDays || 0,
      bank: r.bankAccount || r.ifsc ? { account: r.bankAccount || null, ifsc: r.ifsc || null } : null,
      isRevenue: r.isRevenue,
      guid: r.guid,
      masterId: r.masterId,
      alterId: r.alterId,
    }),
  },
  item: {
    tally: 'StockItem',
    tag: 'STOCKITEM',
    label: 'Stock item',
    fields: [
      { key: 'name', method: 'Name' },
      { key: 'parent', method: 'Parent', type: 'parent' },
      { key: 'category', expr: NA('Category') },
      { key: 'alias', method: 'OnlyAlias' },
      { key: 'partNo', method: 'PartNo' },
      { key: 'unit', expr: NA('BaseUnits') },
      { key: 'altUnit', expr: NA('AdditionalUnits') },
      { key: 'hsn', method: 'InfGSTHSNCode' },
      { key: 'gstRate', method: 'InfGSTIGSTRate', type: 'number' },
      { key: 'taxability', method: 'InfGSTTaxablility' },
      { key: 'openingQty', method: 'OpeningBalance', type: 'qty' },
      { key: 'openingValue', method: 'OpeningValue', type: 'amount' },
      { key: 'closingQty', method: 'ClosingBalance', type: 'qty' },
      { key: 'closingValue', method: 'ClosingValue', type: 'amount' },
      { key: 'closingRate', method: 'ClosingRate', type: 'rate' },
      { key: 'costingMethod', method: 'CostingMethod' },
      { key: 'guid', method: 'Guid' },
      { key: 'masterId', method: 'MasterId', type: 'number' },
      { key: 'alterId', method: 'AlterId', type: 'number' },
    ],
    shape: (r) => ({
      name: r.name,
      group: r.parent || null,
      category: r.category || null,
      alias: r.alias || null,
      partNo: r.partNo || null,
      unit: r.unit || r.closingQty.unit || null,
      alternateUnit: r.altUnit || null,
      hsn: r.hsn || null,
      gstRate: r.gstRate || null,
      taxability: r.taxability || null,
      opening: { qty: r.openingQty.qty, value: Math.abs(r.openingValue) },
      closing: { qty: r.closingQty.qty, value: Math.abs(r.closingValue), rate: r.closingRate.rate },
      costingMethod: r.costingMethod || null,
      guid: r.guid,
      masterId: r.masterId,
      alterId: r.alterId,
    }),
  },
  'stock-group': {
    tally: 'StockGroup',
    tag: 'STOCKGROUP',
    label: 'Stock group',
    fields: [
      { key: 'name', method: 'Name' },
      { key: 'parent', method: 'Parent', type: 'parent' },
      { key: 'guid', method: 'Guid' },
      { key: 'masterId', method: 'MasterId', type: 'number' },
      { key: 'alterId', method: 'AlterId', type: 'number' },
    ],
    shape: (r) => ({ name: r.name, parent: r.parent || null, guid: r.guid, masterId: r.masterId, alterId: r.alterId }),
  },
  'stock-category': {
    tally: 'StockCategory',
    tag: 'STOCKCATEGORY',
    label: 'Stock category',
    fields: [
      { key: 'name', method: 'Name' },
      { key: 'parent', method: 'Parent', type: 'parent' },
      { key: 'guid', method: 'Guid' },
      { key: 'masterId', method: 'MasterId', type: 'number' },
      { key: 'alterId', method: 'AlterId', type: 'number' },
    ],
    shape: (r) => ({ name: r.name, parent: r.parent || null, guid: r.guid, masterId: r.masterId, alterId: r.alterId }),
  },
  unit: {
    tally: 'Unit',
    tag: 'UNIT',
    label: 'Unit',
    fields: [
      { key: 'name', method: 'Symbol' },
      { key: 'formalName', method: 'FormalName' },
      { key: 'originalName', method: 'OriginalName' },
      { key: 'isSimple', method: 'IsSimpleUnit', type: 'logical' },
      { key: 'decimals', method: 'DecimalPlaces', type: 'number' },
      { key: 'baseUnits', method: 'BaseUnits' },
      { key: 'additionalUnits', method: 'AdditionalUnits' },
      { key: 'conversion', method: 'Conversion', type: 'number' },
      { key: 'guid', method: 'Guid' },
      { key: 'masterId', method: 'MasterId', type: 'number' },
      { key: 'alterId', method: 'AlterId', type: 'number' },
    ],
    shape: (r) => ({
      name: r.name,
      formalName: r.formalName || r.originalName || null,
      isSimple: r.isSimple,
      decimals: r.decimals,
      compound: r.isSimple ? null : { base: r.baseUnits, additional: r.additionalUnits, conversion: r.conversion },
      guid: r.guid,
      masterId: r.masterId,
      alterId: r.alterId,
    }),
  },
  godown: {
    tally: 'Godown',
    tag: 'GODOWN',
    label: 'Godown',
    fields: [
      { key: 'name', method: 'Name' },
      { key: 'parent', method: 'Parent', type: 'parent' },
      { key: 'address', expr: 'if $$IsEmpty:$Address then "" else $$FullList:Address:$Address' },
      { key: 'guid', method: 'Guid' },
      { key: 'masterId', method: 'MasterId', type: 'number' },
      { key: 'alterId', method: 'AlterId', type: 'number' },
    ],
    shape: (r) => ({ name: r.name, parent: r.parent || null, address: r.address || null, guid: r.guid, masterId: r.masterId, alterId: r.alterId }),
  },
  'cost-centre': {
    tally: 'CostCentre',
    tag: 'COSTCENTRE',
    label: 'Cost centre',
    fields: [
      { key: 'name', method: 'Name' },
      { key: 'parent', method: 'Parent', type: 'parent' },
      { key: 'category', method: 'Category' },
      { key: 'guid', method: 'Guid' },
      { key: 'masterId', method: 'MasterId', type: 'number' },
      { key: 'alterId', method: 'AlterId', type: 'number' },
    ],
    shape: (r) => ({ name: r.name, parent: r.parent || null, category: r.category || null, guid: r.guid, masterId: r.masterId, alterId: r.alterId }),
  },
  'cost-category': {
    tally: 'CostCategory',
    tag: 'COSTCATEGORY',
    label: 'Cost category',
    fields: [
      { key: 'name', method: 'Name' },
      { key: 'allocateRevenue', method: 'AllocateRevenue', type: 'logical' },
      { key: 'allocateNonRevenue', method: 'AllocateNonRevenue', type: 'logical' },
      { key: 'guid', method: 'Guid' },
      { key: 'masterId', method: 'MasterId', type: 'number' },
      { key: 'alterId', method: 'AlterId', type: 'number' },
    ],
    shape: (r) => ({ name: r.name, allocateRevenue: r.allocateRevenue, allocateNonRevenue: r.allocateNonRevenue, guid: r.guid, masterId: r.masterId, alterId: r.alterId }),
  },
  'voucher-type': {
    tally: 'VoucherType',
    tag: 'VOUCHERTYPE',
    label: 'Voucher type',
    fields: [
      { key: 'name', method: 'Name' },
      { key: 'parent', method: 'Parent' },
      { key: 'numberingMethod', method: 'NumberingMethod' },
      { key: 'isDeemedPositive', method: 'IsDeemedPositive', type: 'logical' },
      { key: 'affectsStock', method: 'AffectsStock', type: 'logical' },
      { key: 'isActive', expr: 'if $$IsEmpty:$IsDeactivated then 1 else if $IsDeactivated then 0 else 1', type: 'logical' },
      { key: 'guid', method: 'Guid' },
      { key: 'masterId', method: 'MasterId', type: 'number' },
      { key: 'alterId', method: 'AlterId', type: 'number' },
    ],
    shape: (r) => ({ name: r.name, baseType: r.parent || r.name, numbering: r.numberingMethod || null, guid: r.guid, masterId: r.masterId, alterId: r.alterId }),
  },
  currency: {
    tally: 'Currency',
    tag: 'CURRENCY',
    label: 'Currency',
    fields: [
      { key: 'name', method: 'Name' },
      { key: 'formalName', method: 'FormalName' },
      { key: 'originalName', method: 'OriginalName' },
      { key: 'guid', method: 'Guid' },
      { key: 'masterId', method: 'MasterId', type: 'number' },
    ],
    shape: (r) => ({ symbol: r.name, name: r.formalName || r.originalName || null, guid: r.guid, masterId: r.masterId }),
  },
};

export const MASTER_TYPES = Object.keys(MASTER_SPECS);

export function specOf(type) {
  const s = MASTER_SPECS[type];
  if (!s) throw new TallyCliError('E_INPUT', `Unknown master type "${type}".`, { hint: `Known types: ${MASTER_TYPES.join(', ')}` });
  return s;
}

/** Fields subset for name-only listing (fast). */
const NAME_FIELDS = [
  { key: 'name', method: 'Name' },
  { key: 'parent', method: 'Parent', type: 'parent' },
];

/** All names (and parents) of a master type, memoised per invocation. */
export async function masterNames(ctx, type) {
  return ctx.memo(`names:${type}`, async () => {
    const spec = specOf(type);
    const fields = type === 'unit' ? [{ key: 'name', method: 'Symbol' }, { key: 'parent', expr: '""' }] : NAME_FIELDS;
    const rows = await ctx.client.rows({ collection: { type: spec.tally }, fields });
    return rows;
  });
}

export async function resolveMaster(ctx, type, name) {
  const rows = await masterNames(ctx, type);
  return resolveIn(
    rows.map((r) => r.name),
    name,
    specOf(type).label,
  );
}

/** Descendant test using a parent map (for "under group X" filters). */
export function underFn(rows, ancestor) {
  const parent = new Map(rows.map((r) => [norm(r.name), norm(r.parent)]));
  const a = norm(ancestor);
  return (name) => {
    let cur = norm(name);
    for (let i = 0; i < 60 && cur; i++) {
      if (cur === a) return true;
      cur = parent.get(cur);
    }
    return false;
  };
}

/**
 * List masters of a type.
 * @param {{under?: string, search?: string, limit?: number, asOf?: string, from?: string, names?: boolean}} opts
 */
export async function listMasters(ctx, type, opts = {}) {
  const spec = specOf(type);
  const rows = await ctx.client.rows({ collection: { type: spec.tally }, fields: spec.fields }, { from: opts.from, to: opts.asOf });
  let out = rows;
  if (opts.under) {
    const treeType = type === 'ledger' || type === 'group' ? 'group' : type === 'item' || type === 'stock-group' ? 'stock-group' : type;
    const tree = treeType === type ? rows : await masterNames(ctx, treeType);
    const canonical = resolveIn(
      tree.map((r) => r.name),
      opts.under,
      treeType === 'group' ? 'Group' : 'Stock group',
    );
    const isUnder = underFn(tree, canonical);
    out = out.filter((r) => (type === treeType ? norm(r.name) !== norm(canonical) && isUnder(r.name) : isUnder(r.parent)));
  }
  out = out.map(spec.shape);
  if (opts.search) out = searchRows(out, opts.search, ['name', 'alias', 'gstin', 'partNo'].filter((k) => k in (out[0] || {})));
  return limitRows(out, opts.limit);
}

/** Get one master by exact name (case-insensitive), with suggestions when missing. */
export async function getMaster(ctx, type, name, opts = {}) {
  const spec = specOf(type);
  const rows = await ctx.client.rows({ collection: { type: spec.tally, filters: [F.eq(type === 'unit' ? 'Symbol' : 'Name', name)] }, fields: spec.fields }, { to: opts.asOf });
  if (rows.length) return spec.shape(rows[0]);
  const canonical = await resolveMaster(ctx, type, name); // throws with suggestions if missing
  const again = await ctx.client.rows({ collection: { type: spec.tally, filters: [F.eq(type === 'unit' ? 'Symbol' : 'Name', canonical)] }, fields: spec.fields }, { to: opts.asOf });
  if (!again.length) throw new TallyCliError('E_NOT_FOUND', `${spec.label} "${name}" was not found.`);
  return spec.shape(again[0]);
}

// ---------------------------------------------------------------- writing

const GST_START = '20170701';

function nameList(name, aliases = []) {
  return el('LANGUAGENAME.LIST', {}, el('NAME.LIST', { TYPE: 'String' }, tag('NAME', name), aliases.map((a) => tag('NAME', a))), tag('LANGUAGEID', ' 1033'));
}

const yn = (b) => (b ? 'Yes' : 'No');

function money(v, field) {
  return toPaise(v, { field });
}

/** Input properties accepted per type for create/update (documented in docs/COMMANDS.md). */
export const MASTER_INPUTS = {
  group: {
    name: { type: 'string', description: 'Group name.' },
    parent: { type: 'string', description: 'Parent group (for example "Sundry Debtors").' },
    aliases: { type: 'array', items: { type: 'string' } },
  },
  ledger: {
    name: { type: 'string', description: 'Ledger name (exactly as it should appear in Tally).' },
    group: { type: 'string', description: 'Parent group, e.g. "Sundry Debtors", "Sundry Creditors", "Bank Accounts", "Sales Accounts".' },
    aliases: { type: 'array', items: { type: 'string' } },
    openingBalance: { type: 'object', description: '{"amount": 1000, "side": "Dr"|"Cr"}' },
    billWise: { type: 'boolean', description: 'Maintain balances bill-by-bill (usual for parties).' },
    creditDays: { type: 'integer', description: 'Default credit period in days.' },
    costCentres: { type: 'boolean', description: 'Cost centres are applicable.' },
    mailingName: { type: 'string' },
    address: { type: 'array', items: { type: 'string' }, description: 'Address lines.' },
    state: { type: 'string', description: 'State name or GST state code.' },
    country: { type: 'string', default: undefined },
    pincode: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
    contactPerson: { type: 'string' },
    pan: { type: 'string' },
    gstin: { type: 'string', description: 'Party GSTIN (validated).' },
    gstRegistrationType: { type: 'string', enum: ['Regular', 'Composition', 'Unregistered/Consumer', 'Unknown', 'Consumer', 'Unregistered'], description: 'GST registration type.' },
    gstDutyHead: { type: 'string', enum: ['Central Tax', 'State Tax', 'Integrated Tax', 'Cess'], description: 'For GST tax ledgers.' },
    taxRate: { type: 'number', description: 'For tax ledgers: percentage of calculation.' },
    bankAccount: { type: 'string' },
    ifsc: { type: 'string' },
    accountHolder: { type: 'string' },
    raw: { type: 'object', description: 'Extra Tally tags to include verbatim, e.g. {"ISTDSAPPLICABLE": "Yes"}.' },
  },
  item: {
    name: { type: 'string' },
    group: { type: 'string', description: 'Stock group (optional).' },
    category: { type: 'string' },
    unit: { type: 'string', description: 'Base unit, e.g. "Nos" (must exist).' },
    alternateUnit: { type: 'string' },
    conversion: { type: 'object', description: '{"base": 12, "alternate": 1} means 12 base units = 1 alternate unit.' },
    aliases: { type: 'array', items: { type: 'string' } },
    partNo: { type: 'string' },
    description: { type: 'string' },
    hsn: { type: 'string', description: 'HSN/SAC code.' },
    hsnDescription: { type: 'string' },
    gstRate: { type: 'number', description: 'Integrated GST rate in percent (CGST/SGST are half each).' },
    cessRate: { type: 'number' },
    taxability: { type: 'string', enum: ['Taxable', 'Exempt', 'Nil Rated'], default: undefined },
    gstApplicableFrom: { type: 'date' },
    opening: { type: 'object', description: '{"qty": 10, "rate": 100, "godown": "Main Location", "batch": "Primary Batch"}' },
    raw: { type: 'object' },
  },
  'stock-group': { name: { type: 'string' }, parent: { type: 'string' }, addable: { type: 'boolean' }, raw: { type: 'object' } },
  'stock-category': { name: { type: 'string' }, parent: { type: 'string' }, raw: { type: 'object' } },
  unit: {
    name: { type: 'string', description: 'Unit symbol, e.g. "Nos".' },
    formalName: { type: 'string', description: 'e.g. "Numbers".' },
    decimals: { type: 'integer', minimum: 0, maximum: 4 },
    uqc: { type: 'string', description: 'GST unit quantity code, e.g. "NOS-NUMBERS".' },
    raw: { type: 'object' },
  },
  godown: { name: { type: 'string' }, parent: { type: 'string' }, address: { type: 'array', items: { type: 'string' } }, raw: { type: 'object' } },
  'cost-centre': { name: { type: 'string' }, parent: { type: 'string' }, category: { type: 'string' }, raw: { type: 'object' } },
  'cost-category': { name: { type: 'string' }, allocateRevenue: { type: 'boolean' }, allocateNonRevenue: { type: 'boolean' }, raw: { type: 'object' } },
};

/** Build the body tags for a master from input (only provided fields are emitted). */
export function masterBody(type, input, { tagStyle = 'both', isCreate = false } = {}) {
  const k = [];
  const has = (f) => input[f] !== undefined && input[f] !== null;
  switch (type) {
    case 'group':
      if (has('parent') || isCreate) k.push(tag('PARENT', input.parent || ''));
      if (isCreate) k.push(tag('ISSUBLEDGER', 'No'), tag('ISBILLWISEON', 'No'), tag('ISADDABLE', 'No'));
      break;
    case 'ledger': {
      if (has('group')) k.push(tag('PARENT', input.group));
      if (has('openingBalance')) {
        const ob = input.openingBalance;
        const paise = money(ob.amount, 'openingBalance.amount');
        k.push(tag('OPENINGBALANCE', paiseToString(fromSided({ amount: paise, side: ob.side }))));
      }
      if (has('billWise')) k.push(tag('ISBILLWISEON', yn(input.billWise)));
      if (has('creditDays')) k.push(tag('BILLCREDITPERIOD', `${input.creditDays} Days`));
      if (has('costCentres')) k.push(tag('ISCOSTCENTRESON', yn(input.costCentres)));
      const state = has('state') ? findState(input.state) : null;
      if (has('state') && !state) throw new TallyCliError('E_INPUT', `Unknown state "${input.state}".`, { hint: 'Use the full state name (e.g. "Maharashtra") or its 2-digit GST code.' });
      const country = input.country || (state ? 'India' : undefined);
      if (tagStyle !== 'new') {
        if (has('mailingName')) k.push(tag('MAILINGNAME', input.mailingName));
        if (has('address')) k.push(el('ADDRESS.LIST', { TYPE: 'String' }, input.address.map((a) => tag('ADDRESS', a))));
        if (state) k.push(tag('LEDSTATENAME', state.name));
        if (country) k.push(tag('COUNTRYNAME', country));
        if (has('pincode')) k.push(tag('PINCODE', input.pincode));
      }
      if (tagStyle !== 'old' && (has('mailingName') || has('address') || state || has('pincode'))) {
        k.push(
          el(
            'LEDMAILINGDETAILS.LIST',
            {},
            has('address') ? el('ADDRESS.LIST', { TYPE: 'String' }, input.address.map((a) => tag('ADDRESS', a))) : null,
            tag('APPLICABLEFROM', GST_START),
            has('mailingName') ? tag('MAILINGNAME', input.mailingName) : null,
            state ? tag('STATE', state.name) : null,
            country ? tag('COUNTRY', country) : null,
            has('pincode') ? tag('PINCODE', input.pincode) : null,
          ),
        );
      }
      if (has('email')) k.push(tag('EMAIL', input.email));
      if (has('phone')) k.push(tag('LEDGERMOBILE', input.phone));
      if (has('contactPerson')) k.push(tag('LEDGERCONTACT', input.contactPerson));
      if (has('pan')) k.push(tag('INCOMETAXNUMBER', String(input.pan).toUpperCase()));
      if (has('gstin') || has('gstRegistrationType')) {
        let gstin;
        if (has('gstin') && input.gstin) {
          const chk = checkGstin(input.gstin);
          if (!chk.valid) throw new TallyCliError('E_INPUT', `GSTIN ${input.gstin} is not valid: ${chk.problems.join('; ')}.`);
          gstin = chk.gstin;
        }
        const regType = input.gstRegistrationType || (gstin ? 'Regular' : undefined);
        const pos = state ? state.name : gstin ? findState(gstin.slice(0, 2))?.name : undefined;
        if (tagStyle !== 'new') {
          if (gstin !== undefined) k.push(tag('PARTYGSTIN', gstin));
          if (regType) k.push(tag('GSTREGISTRATIONTYPE', regType));
        }
        if (tagStyle !== 'old') {
          k.push(el('LEDGSTREGDETAILS.LIST', {}, tag('APPLICABLEFROM', GST_START), regType ? tag('GSTREGISTRATIONTYPE', regType) : null, pos ? tag('PLACEOFSUPPLY', pos) : null, gstin ? tag('GSTIN', gstin) : null));
        }
      }
      if (has('gstDutyHead')) k.push(tag('TAXTYPE', 'GST'), tag('GSTDUTYHEAD', input.gstDutyHead));
      if (has('taxRate')) k.push(tag('RATEOFTAXCALCULATION', input.taxRate));
      if (has('bankAccount')) k.push(tag('BANKDETAILS', input.bankAccount));
      if (has('ifsc')) k.push(tag('IFSCODE', String(input.ifsc).toUpperCase()));
      if (has('accountHolder')) k.push(tag('BANKACCHOLDERNAME', input.accountHolder));
      break;
    }
    case 'item': {
      if (has('group')) k.push(tag('PARENT', input.group));
      if (has('category')) k.push(tag('CATEGORY', input.category));
      if (has('unit')) k.push(tag('BASEUNITS', input.unit));
      if (has('alternateUnit')) k.push(tag('ADDITIONALUNITS', input.alternateUnit));
      if (has('conversion')) k.push(tag('DENOMINATOR', input.conversion.base), tag('CONVERSION', input.conversion.alternate));
      if (has('partNo')) k.push(el('MAILINGNAME.LIST', { TYPE: 'String' }, tag('MAILINGNAME', input.partNo)));
      if (has('description')) k.push(tag('DESCRIPTION', input.description));
      if (has('hsn') || has('gstRate') || has('taxability')) {
        const from = input.gstApplicableFrom ? toTallyBody(input.gstApplicableFrom) : GST_START;
        k.push(tag('GSTAPPLICABLE', '\u0004 Applicable'), tag('GSTTYPEOFSUPPLY', 'Goods'));
        if (has('hsn')) k.push(el('HSNDETAILS.LIST', {}, tag('APPLICABLEFROM', from), tag('HSNCODE', input.hsn), tag('HSN', input.hsnDescription || ''), tag('SRCOFHSNDETAILS', 'Specify Details Here')));
        const rate = Number(input.gstRate || 0);
        const rates = has('gstRate')
          ? [
              el('RATEDETAILS.LIST', {}, tag('GSTRATEDUTYHEAD', 'Central Tax'), tag('GSTRATEVALUATIONTYPE', 'Based on Value'), tag('GSTRATE', rate / 2)),
              el('RATEDETAILS.LIST', {}, tag('GSTRATEDUTYHEAD', 'State Tax'), tag('GSTRATEVALUATIONTYPE', 'Based on Value'), tag('GSTRATE', rate / 2)),
              el('RATEDETAILS.LIST', {}, tag('GSTRATEDUTYHEAD', 'Integrated Tax'), tag('GSTRATEVALUATIONTYPE', 'Based on Value'), tag('GSTRATE', rate)),
              el('RATEDETAILS.LIST', {}, tag('GSTRATEDUTYHEAD', 'Cess'), tag('GSTRATEVALUATIONTYPE', 'Based on Value'), tag('GSTRATE', Number(input.cessRate || 0))),
            ]
          : [];
        k.push(
          el(
            'GSTDETAILS.LIST',
            {},
            tag('APPLICABLEFROM', from),
            tag('CALCULATIONTYPE', 'On Value'),
            has('hsn') ? tag('HSNCODE', input.hsn) : null,
            tag('TAXABILITY', input.taxability || 'Taxable'),
            tag('SRCOFGSTDETAILS', 'Specify Details Here'),
            rates.length ? el('STATEWISEDETAILS.LIST', {}, tag('STATENAME', '\u0004 Any'), rates) : null,
          ),
        );
      }
      if (has('opening')) {
        const o = input.opening;
        const unit = input.unit || o.unit || '';
        const ratePaise = toPaise(o.rate, { field: 'opening.rate' });
        const valuePaise = Math.round(ratePaise * Number(o.qty));
        k.push(tag('OPENINGBALANCE', formatQty(o.qty, unit)), tag('OPENINGRATE', formatRate(ratePaise / 100, unit)), tag('OPENINGVALUE', paiseToString(-valuePaise)));
        k.push(
          el(
            'BATCHALLOCATIONS.LIST',
            {},
            tag('GODOWNNAME', o.godown || 'Main Location'),
            tag('BATCHNAME', o.batch || 'Primary Batch'),
            tag('OPENINGBALANCE', formatQty(o.qty, unit)),
            tag('OPENINGVALUE', paiseToString(-valuePaise)),
            tag('OPENINGRATE', formatRate(ratePaise / 100, unit)),
          ),
        );
      }
      break;
    }
    case 'stock-group':
      if (has('parent') || isCreate) k.push(tag('PARENT', input.parent || ''));
      if (has('addable') || isCreate) k.push(tag('ISADDABLE', yn(input.addable !== false)));
      break;
    case 'stock-category':
      if (has('parent') || isCreate) k.push(tag('PARENT', input.parent || ''));
      break;
    case 'unit':
      if (isCreate) k.push(tag('ISSIMPLEUNIT', 'Yes'));
      if (has('formalName')) k.push(tag('ORIGINALNAME', input.formalName));
      if (has('decimals')) k.push(tag('DECIMALPLACES', input.decimals));
      if (has('uqc')) k.push(tag('GSTREPUOM', input.uqc));
      break;
    case 'godown':
      if (has('parent') || isCreate) k.push(tag('PARENT', input.parent || ''));
      if (has('address')) k.push(el('ADDRESS.LIST', { TYPE: 'String' }, input.address.map((a) => tag('ADDRESS', a))));
      break;
    case 'cost-centre':
      if (has('parent') || isCreate) k.push(tag('PARENT', input.parent || ''));
      if (has('category') || isCreate) k.push(tag('CATEGORY', input.category || 'Primary Cost Category'));
      break;
    case 'cost-category':
      if (has('allocateRevenue') || isCreate) k.push(tag('ALLOCATEREVENUE', yn(input.allocateRevenue !== false)));
      if (has('allocateNonRevenue') || isCreate) k.push(tag('ALLOCATENONREVENUE', yn(!!input.allocateNonRevenue)));
      break;
    default:
      break;
  }
  if (input.raw) k.push(...jsonToNodes(input.raw));
  return k;
}

/** Build a master element for import. */
export function masterXml(type, action, { name, newName, aliases, body }) {
  const spec = specOf(type);
  const display = newName || name;
  const kids = action === 'Delete' ? [tag('NAME', name)] : [type === 'unit' ? tag('NAME', display) : nameList(display, aliases || []), ...(body || [])];
  return el(spec.tag, { NAME: name, ACTION: action }, kids);
}

async function checkReferences(ctx, type, input) {
  if (type === 'ledger' && input.group) input.group = await resolveMaster(ctx, 'group', input.group);
  if (type === 'group' && input.parent) input.parent = await resolveMaster(ctx, 'group', input.parent);
  if (type === 'item') {
    if (input.group) input.group = await resolveMaster(ctx, 'stock-group', input.group);
    if (input.category) input.category = await resolveMaster(ctx, 'stock-category', input.category);
    if (input.unit) input.unit = await resolveMaster(ctx, 'unit', input.unit);
    if (input.alternateUnit) input.alternateUnit = await resolveMaster(ctx, 'unit', input.alternateUnit);
    if (input.opening?.godown) input.opening.godown = await resolveMaster(ctx, 'godown', input.opening.godown);
  }
  if ((type === 'stock-group' || type === 'stock-category' || type === 'godown' || type === 'cost-centre') && input.parent) {
    input.parent = await resolveMaster(ctx, type, input.parent);
  }
  if (type === 'cost-centre' && input.category) input.category = await resolveMaster(ctx, 'cost-category', input.category);
}

async function exists(ctx, type, name) {
  const rows = await masterNames(ctx, type);
  return rows.find((r) => norm(r.name) === norm(name))?.name || null;
}

/**
 * Create, update or delete a master.
 * @param {'create'|'update'|'delete'} action
 */
export async function writeMaster(ctx, type, action, input) {
  const spec = specOf(type);
  const op = `${type}.${action}`;
  if (!input.dryRun) ctx.policy.assertMasterWrites(op);
  if (action === 'update' && input.openingBalance !== undefined && !input.dryRun) {
    // Opening balances change the books; treat like altering a voucher.
    ctx.policy.assertDestructive(op, input);
    if (ctx.profile.lockBefore) throw new TallyCliError('E_POLICY', 'Opening balances cannot be changed while a lock date (lockBefore) is set.');
  }
  const name = String(input.name || '').trim();
  if (!name) throw new TallyCliError('E_INPUT', 'name is required.');
  const current = await exists(ctx, type, name);
  if (action === 'create' && current) {
    throw new TallyCliError('E_CONFLICT', `${spec.label} "${current}" already exists.`, { hint: `Use "tally ${type} update" to change it, or "tally ${type} ensure" to create only when missing.` });
  }
  if (action !== 'create' && !current) await resolveMaster(ctx, type, name); // throws with suggestions
  const target = current || name;
  const data = { ...input };
  if (action !== 'delete') {
    await checkReferences(ctx, type, data);
    if (action === 'create' && type === 'ledger' && !data.group) throw new TallyCliError('E_INPUT', 'group is required to create a ledger.', { hint: 'For example "Sundry Debtors" for customers.' });
    if (action === 'create' && type === 'item' && !data.unit) ctx.warn('No unit given: the item will be created without a unit of measure.');
  }
  if (data.newName && action === 'update') {
    const clash = await exists(ctx, type, data.newName);
    if (clash && norm(clash) !== norm(target)) throw new TallyCliError('E_CONFLICT', `Cannot rename: "${clash}" already exists.`);
  }
  const tallyAction = action === 'create' ? 'Create' : action === 'update' ? 'Alter' : 'Delete';
  const body = action === 'delete' ? [] : masterBody(type, data, { tagStyle: ctx.profile.tagStyle || 'both', isCreate: action === 'create' });
  const node = masterXml(type, tallyAction, { name: target, newName: action === 'update' ? data.newName : undefined, aliases: data.aliases, body });
  const vars = action === 'create' ? { IMPORTDUPS: '@@DUPIGNORECOMBINE' } : {};
  if (input.dryRun) {
    const xml = importData({ id: 'All Masters', vars: { SVCURRENTCOMPANY: ctx.profile.company, ...vars }, messages: [node] });
    return dryRunResult(xml, { action, type, name: target });
  }
  const before = action !== 'create' ? await getMaster(ctx, type, target).catch(() => null) : null;
  const result = await auditedImport(ctx, {
    op,
    id: 'All Masters',
    messages: [node],
    input: { ...input },
    vars,
    summary: { type, action, name: target, before },
    expect: action === 'create' ? 'created' : action === 'update' ? 'altered' : 'deleted',
  });
  ctx.invalidate(`names:${type}`);
  const finalName = data.newName || target;
  const record = action === 'delete' ? null : await getMaster(ctx, type, finalName).catch(() => null);
  if (action !== 'delete' && !record) ctx.warn(`Tally reported success but ${spec.label.toLowerCase()} "${finalName}" could not be read back.`);
  return {
    action,
    type,
    name: finalName,
    tally: { created: result.created, altered: result.altered, deleted: result.deleted, combined: result.combined, ignored: result.ignored },
    record,
    before: before || undefined,
    auditSeq: result.auditSeq,
  };
}

/** Create when missing; when present, report differences (never alters silently). */
export async function ensureMaster(ctx, type, input) {
  const current = await exists(ctx, type, input.name);
  if (!current) {
    const r = await writeMaster(ctx, type, 'create', input);
    return { ...r, existed: false };
  }
  const record = await getMaster(ctx, type, current);
  const diffs = [];
  if (type === 'ledger' && input.group && norm(input.group) !== norm(record.group)) diffs.push({ field: 'group', tally: record.group, wanted: input.group });
  if (type === 'ledger' && input.gstin && norm(input.gstin) !== norm(record.gstin)) diffs.push({ field: 'gstin', tally: record.gstin, wanted: input.gstin });
  if (type === 'item' && input.unit && norm(input.unit) !== norm(record.unit)) diffs.push({ field: 'unit', tally: record.unit, wanted: input.unit });
  if (diffs.length) ctx.warn(`${specOf(type).label} "${current}" already exists with different values; nothing was changed. Use update to change it.`);
  return { action: 'ensure', type, name: current, existed: true, differences: diffs, record };
}

/** Raw XML for a generic master write (any Tally master type). */
export function genericMasterXml(tallyType, action, name, tags, newName) {
  const kids = action === 'Delete' ? [tag('NAME', name)] : [nameList(newName || name), ...jsonToNodes(tags || {})];
  return el(String(tallyType).toUpperCase().replace(/\s+/g, ''), { NAME: name, ACTION: action }, kids);
}

export { serialize, today };
