/**
 * Inline TDL builders.
 *
 * Curated reads use a "flat report": the request defines a tiny report that walks a collection
 * (optionally descending into sub-collections such as Voucher > AllLedgerEntries > BillAllocations)
 * and emits one <ROW> per leaf object with fields we chose. This avoids depending on the display
 * layout of Tally's built-in reports. Field formulas follow patterns proven in production
 * integrations: debit amounts come back negative, dates as YYYY-MM-DD, logicals as 1/0.
 */
import { el, tag, findAll, elementChildren, textOf, cleanText } from './xml.mjs';
import { parseTallyAmount, parseQty, parseRate } from './amounts.mjs';
import { fromTally } from './dates.mjs';
import { TallyCliError } from './errors.mjs';

/** Quote a string literal for a TDL formula. Double quotes cannot be escaped in TDL, so they are rejected. */
export function tdlString(value) {
  const s = String(value ?? '');
  if (s.includes('"')) {
    throw new TallyCliError('E_INPUT', `Names containing double quotes (") cannot be used in filters: ${s}`);
  }
  return `"${s}"`;
}

/** SET formula for a field of a given type reading method `m`. */
export function fieldFormula(m, type = 'text') {
  const x = m.startsWith('$') || m.startsWith('..') ? m : `$${m}`;
  switch (type) {
    case 'logical':
      return `if ${x} then 1 else 0`;
    case 'date':
      return `if $$IsEmpty:${x} then "" else $$PyrlYYYYMMDDFormat:${x}:"-"`;
    case 'amount':
      return `$$StringFindAndReplace:(if $$IsDebit:${x} then -$$NumValue:${x} else $$NumValue:${x}):"(-)":"-"`;
    case 'number':
      return `if $$IsEmpty:${x} then 0 else $$StringFindAndReplace:($$String:${x}):"(-)":"-"`;
    case 'parent':
      return `if $$IsEqual:${x}:$$SysName:Primary then "" else ${x}`;
    case 'qty':
    case 'rate':
    case 'text':
    default:
      return x;
  }
}

/**
 * @typedef {{key: string, method?: string, expr?: string, type?: string}} FieldSpec
 * @typedef {{type: string, route?: string[], fetch?: string[], filters?: string[], childOf?: string, belongsTo?: boolean}} CollectionSpec
 */

/**
 * Build the TDL nodes for a flat report.
 * @param {{name?: string, collection: CollectionSpec, fields: FieldSpec[]}} spec
 */
export function flatReport({ name = 'TCReport', collection, fields }) {
  if (!fields || !fields.length) throw new Error('flatReport needs fields');
  const route = collection.route || [];
  const nodes = [];
  const fieldNames = fields.map((_, i) => `TCFld${String(i + 1).padStart(2, '0')}`);
  const xmlTags = fields.map((_, i) => `F${String(i + 1).padStart(2, '0')}`);

  nodes.push(el('REPORT', { NAME: name }, tag('FORMS', 'TCForm')));
  nodes.push(el('FORM', { NAME: 'TCForm' }, tag('PARTS', 'TCPart1'), tag('XMLTAG', 'DATA')));

  const levels = route.length + 1;
  for (let lv = 1; lv <= levels; lv++) {
    const source = lv === 1 ? 'TCColl' : route[lv - 2];
    nodes.push(el('PART', { NAME: `TCPart${lv}` }, tag('LINES', `TCLine${lv}`), tag('REPEAT', `TCLine${lv} : ${source}`), tag('SCROLLED', 'Vertical')));
    if (lv < levels) {
      nodes.push(el('LINE', { NAME: `TCLine${lv}` }, tag('FIELDS', 'TCFldBlank'), tag('EXPLODE', `TCPart${lv + 1}`)));
    } else {
      nodes.push(el('LINE', { NAME: `TCLine${lv}` }, tag('FIELDS', fieldNames.join(',')), tag('XMLTAG', 'ROW')));
    }
  }
  if (levels > 1) nodes.push(el('FIELD', { NAME: 'TCFldBlank' }, tag('SET', '""')));
  fields.forEach((f, i) => {
    const formula = f.expr ?? fieldFormula(f.method || f.key, f.type);
    nodes.push(el('FIELD', { NAME: fieldNames[i] }, tag('SET', formula), tag('XMLTAG', xmlTags[i])));
  });

  const fetch = new Set(collection.fetch || []);
  if (route.length) fetch.add(route[0]);
  const filters = collection.filters || [];
  nodes.push(
    el(
      'COLLECTION',
      { NAME: 'TCColl' },
      tag('TYPE', collection.type),
      collection.childOf ? tag('CHILDOF', tdlString(collection.childOf)) : null,
      collection.belongsTo ? tag('BELONGSTO', 'Yes') : null,
      fetch.size ? tag('FETCH', [...fetch].join(',')) : null,
      filters.length ? tag('FILTER', filters.map((_, i) => `TCFilter${i + 1}`).join(',')) : null,
    ),
  );
  filters.forEach((expr, i) => nodes.push(el('SYSTEM', { TYPE: 'Formulae', NAME: `TCFilter${i + 1}` }, expr)));
  return { name, tdl: nodes, xmlTags };
}

/** Convert one raw field string to a typed value. */
export function convertValue(raw, type) {
  const s = raw === undefined || raw === null ? '' : String(raw);
  switch (type) {
    case 'logical': {
      const t = s.trim().toLowerCase();
      return t === '1' || t === 'yes' || t === 'true';
    }
    case 'date':
      return fromTally(s.trim());
    case 'amount':
      return parseTallyAmount(s);
    case 'number': {
      const n = parseFloat(cleanText(s).replace(/,/g, '').replace(/^\(-\)/, '-'));
      return Number.isFinite(n) ? n : 0;
    }
    case 'qty':
      return parseQty(s);
    case 'rate':
      return parseRate(s);
    case 'parent':
    case 'text':
    default:
      return cleanText(s);
  }
}

/**
 * Extract rows from a flat-report reply. Uses <ROW> wrappers when present; otherwise falls back to
 * splitting the flat sequence of F01..Fnn tags at each F01 (some Tally builds drop line wrappers).
 */
export function rowsFromReply(root, fields) {
  const tags = fields.map((_, i) => `F${String(i + 1).padStart(2, '0')}`);
  const index = new Map(tags.map((t, i) => [t, i]));
  const rows = [];
  const rowNodes = findAll(root, 'ROW');
  const build = (values) => {
    const o = {};
    fields.forEach((f, i) => {
      o[f.key] = convertValue(values[i], f.type);
    });
    return o;
  };
  if (rowNodes.length) {
    for (const r of rowNodes) {
      const values = new Array(fields.length);
      for (const c of elementChildren(r)) {
        const i = index.get(c.name.toUpperCase());
        if (i !== undefined) values[i] = textOf(c);
      }
      rows.push(build(values));
    }
    return rows;
  }
  let current = null;
  const visit = (node) => {
    for (const c of elementChildren(node)) {
      const i = index.get(c.name.toUpperCase());
      if (i !== undefined) {
        if (i === 0 || !current) {
          if (current) rows.push(build(current));
          current = new Array(fields.length);
        }
        current[i] = textOf(c);
      } else visit(c);
    }
  };
  visit(root);
  if (current) rows.push(build(current));
  return rows;
}

/** Helpers to write common filter formulas. */
export const F = {
  eq: (method, value) => `$$IsEqual:$${method}:${tdlString(value)}`,
  notCancelled: () => 'NOT $IsCancelled',
  notOptional: () => 'NOT $IsOptional',
  alterIdAbove: (n, method = 'AlterID') => `$${method} > ${Number(n)}`,
  masterId: (n) => `$MasterID = ${Number(n)}`,
  voucherType: (name) => `$$IsEqual:$VoucherTypeName:${tdlString(name)}`,
};
