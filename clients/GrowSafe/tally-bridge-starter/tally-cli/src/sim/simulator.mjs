/**
 * The Tally simulator: answers the same XML requests as Tally's gateway, from an in-memory company.
 * Used by the test suite and by "tally simulate" for demos and rehearsals. It is not Tally: it
 * implements the subset of behaviour this tool relies on, and says so when asked for anything else.
 */
import { parseXml, serialize, el, tag, child, childText, childrenNamed, elementChildren, textOf, cleanText, path as xpath } from '../core/xml.mjs';
import { fromTally } from '../core/dates.mjs';
import { Store, key } from './store.mjs';
import { applyImport } from './importer.mjs';
import { ExportEngine, runInlineReport, indexTdl, collectionDef, nativeObject, builtinTrialBalance, builtinDayBook, wrap, typeOfTable } from './exporter.mjs';
import { COLLECTION_TO_TABLE } from './store.mjs';
import { FormulaError } from './formula.mjs';
import { buildDemo } from './demo.mjs';

export class Simulator {
  constructor(store, options = {}) {
    this.store = store;
    this.options = { remoteIdUpsert: false, alterDropsLists: false, educational: false, delayMs: 0, ...options };
    this.requests = 0;
  }

  static demo(opts = {}) {
    return new Simulator(buildDemo(opts), opts.options);
  }

  static empty(opts = {}) {
    return new Simulator(Store.empty(opts), opts.options);
  }

  static fromJSON(json) {
    return new Simulator(new Store(json.data), json.options || {});
  }

  toJSON() {
    return { data: this.store.data, options: this.options };
  }

  /**
   * Handle one request body. Returns {status, body, mutated}.
   * @param {string} body
   */
  handle(body) {
    this.requests++;
    let root;
    try {
      root = parseXml(body);
    } catch (err) {
      return reply(errorEnvelope(`Invalid request XML: ${err.message}`));
    }
    try {
      const header = child(root, 'HEADER');
      const req = childText(header, 'TALLYREQUEST').toLowerCase();
      const type = childText(header, 'TYPE').toLowerCase();
      const idNode = child(header, 'ID');
      const id = idNode ? cleanText(textOf(idNode)) : '';
      const desc = xpath(root, 'BODY/DESC');
      const vars = readVars(desc);
      const company = vars.svcurrentcompany;
      if (company && key(company) !== key(this.store.company.name) && !(req === 'export' && type === 'collection')) {
        return reply(errorEnvelope(`Company '${company}' is not open. Open companies: ${this.store.company.name}`));
      }

      if (req === 'import data') return this.handleImport(xpath(root, 'BODY/IMPORTDATA/REQUESTDATA'), readVars(xpath(root, 'BODY/IMPORTDATA/REQUESTDESC')), true);
      if (req === 'import') return this.handleImport(xpath(root, 'BODY/DATA'), vars, false);
      if (req === 'execute') {
        if (type === 'tdlaction' && key(id) === 'sync') return reply(el('ENVELOPE', {}, el('HEADER', {}, tag('VERSION', '1'), tag('STATUS', '1'))));
        return reply(errorEnvelope(`Action '${id}' is not supported in the simulator.`));
      }
      if (req !== 'export') return reply(plainResponse('Unknown Request, cannot be processed'));

      const tdlMessage = desc ? xpath(desc, 'TDL/TDLMESSAGE') : null;
      if (type === 'data') {
        if (tdlMessage) {
          const { defs } = indexTdl(tdlMessage);
          if (defs.REPORT?.[id.toUpperCase()]) return reply(runInlineReport(this.store, vars, tdlMessage, id));
        }
        if (key(id) === 'trial balance') return reply(builtinTrialBalance(this.store, vars));
        if (key(id) === 'day book' || key(id) === 'daybook') return reply(builtinDayBook(this.store, vars));
        return reply(errorEnvelope(`Report '${id}' is not available in the simulator.`));
      }
      if (type === 'collection') return reply(this.exportCollection(id, vars, tdlMessage));
      if (type === 'object') return reply(this.exportObject(header, desc, vars));
      if (type === 'function') return reply(this.exportFunction(id, desc, vars));
      return reply(plainResponse('Unknown Request, cannot be processed'));
    } catch (err) {
      if (err instanceof FormulaError) return reply(errorEnvelope(err.message));
      return reply(errorEnvelope(`Simulator error: ${err.message}`));
    }
  }

  handleImport(dataNode, vars, legacy) {
    const msgs = dataNode ? childrenNamed(dataNode, 'TALLYMESSAGE').flatMap((m) => elementChildren(m)) : [];
    const out = applyImport(this.store, msgs, { ...this.options, importDups: vars.importdups });
    const counts = [
      tag('CREATED', out.created),
      tag('ALTERED', out.altered),
      tag('DELETED', out.deleted),
      tag('LASTVCHID', out.lastvchid),
      tag('LASTMID', 0),
      tag('COMBINED', out.combined),
      tag('IGNORED', out.ignored),
      tag('ERRORS', out.errors),
      tag('CANCELLED', out.cancelled),
      tag('EXCEPTIONS', out.exceptions),
    ];
    const lineErrors = out.lineErrors.map((e) => tag('LINEERROR', e));
    const mutated = out.created + out.altered + out.deleted + out.cancelled + out.combined > 0;
    if (legacy) return { status: 200, body: serialize(el('RESPONSE', {}, lineErrors, counts)), mutated };
    const status = out.errors ? '0' : '1';
    const body = el(
      'ENVELOPE',
      {},
      el('HEADER', {}, tag('VERSION', '1'), tag('STATUS', status)),
      el('BODY', {}, el('DATA', {}, out.errors ? [...lineErrors, ...counts, tag('VCHNUMBER', out.vchnumber)] : el('IMPORTRESULT', {}, counts))),
    );
    return { status: 200, body: serialize(body), mutated };
  }

  exportCollection(id, vars, tdlMessage) {
    let def;
    let formulas = {};
    if (tdlMessage) {
      const idx = indexTdl(tdlMessage);
      formulas = idx.formulas;
      const node = idx.defs.COLLECTION?.[id.toUpperCase()];
      if (node) def = collectionDef(node);
    }
    if (!def) {
      const builtin = { 'list of ledgers': 'Ledger', 'list of groups': 'Group', 'list of stock items': 'StockItem', 'list of companies': 'Company', 'list of godowns': 'Godown' }[key(id)];
      if (!builtin) return errorEnvelope(`Collection '${id}' is not available in the simulator.`);
      def = { type: builtin, filters: [], methods: ['Name', 'Parent'] };
    }
    const engine = new ExportEngine(this.store, vars, formulas);
    const objs = engine.collectionObjects(def);
    const computed = (def.computes || []).map((c) => {
      const i = c.indexOf(':');
      return [c.slice(0, i).trim(), c.slice(i + 1).trim()];
    });
    const items = objs.map((o) => {
      const node = nativeObject(engine, o, def.methods.length ? def.methods : ['*']);
      for (const [name, formula] of computed) node.children.push(el(name.toUpperCase(), {}, engine.evalField(formula, o)));
      return node;
    });
    return el('ENVELOPE', {}, el('HEADER', {}, tag('VERSION', '1'), tag('STATUS', '1')), el('BODY', {}, el('DESC', {}), el('DATA', {}, el('COLLECTION', {}, items))));
  }

  exportObject(header, desc, vars) {
    const subtype = childText(header, 'SUBTYPE');
    const idNode = child(header, 'ID');
    const idType = (idNode?.attrs.TYPE || 'Name').toLowerCase();
    const id = cleanText(textOf(idNode));
    const fetch = desc ? childrenNamed(child(desc, 'FETCHLIST'), 'FETCH').flatMap((f) => textOf(f).split(',')).map((s) => s.trim()).filter(Boolean) : [];
    const engine = new ExportEngine(this.store, vars);
    let obj;
    if (key(subtype) === 'voucher') {
      const v = this.store.data.vouchers.find((x) => (idType === 'guid' ? x.guid === id : idType.replace(/\s/g, '') === 'masterid' ? String(x.masterid) === id : x.remoteid === id || x.guid === id));
      if (v) obj = wrap(v, 'Voucher', null);
    } else if (key(subtype) === 'company') {
      obj = wrap(this.store.company, 'Company', null);
    } else {
      const table = COLLECTION_TO_TABLE[key(subtype).replace(/\s+/g, '')];
      if (!table) return errorEnvelope(`Object type '${subtype}' is not supported in the simulator.`);
      const m = this.store.findMaster(table, id);
      if (m) obj = wrap(m, typeOfTable(table), null);
    }
    if (!obj) return errorEnvelope(`${subtype} '${id}' does not exist!`);
    return el(
      'ENVELOPE',
      {},
      el('HEADER', {}, tag('VERSION', '1'), tag('STATUS', '1')),
      el('BODY', {}, el('DESC', {}), el('DATA', {}, el('TALLYMESSAGE', {}, nativeObject(engine, obj, fetch.length ? ['Name', ...fetch] : ['*'])))),
    );
  }

  exportFunction(id, desc, vars) {
    const name = id.replace(/^\$\$/, '').toLowerCase();
    const params = desc ? childrenNamed(child(desc, 'FUNCPARAMLIST'), 'PARAM').map((p) => cleanText(textOf(p))) : [];
    const engine = new ExportEngine(this.store, vars);
    let result;
    if (name === 'round') result = String(Math.round(parseFloat(params[0]) / (parseFloat(params[1]) || 1)) * (parseFloat(params[1]) || 1));
    else result = engine.func(name, params);
    const typ = typeof result === 'number' ? 'Number' : typeof result === 'boolean' ? 'Logical' : /^\d{4}-\d{2}-\d{2}$/.test(result) ? 'Date' : 'String';
    const val = typeof result === 'boolean' ? (result ? 'Yes' : 'No') : typ === 'Date' ? toTallyDisplay(result) : String(result);
    return el('ENVELOPE', {}, el('HEADER', {}, tag('VERSION', '1'), tag('STATUS', '1')), el('BODY', {}, el('DESC', {}), el('DATA', {}, el('RESULT', { TYPE: typ }, val))));
  }
}

function toTallyDisplay(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return `${d}-${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1]}-${y}`;
}

function readVars(desc) {
  const out = {};
  const sv = desc ? child(desc, 'STATICVARIABLES') : null;
  for (const c of elementChildren(sv)) {
    const k = c.name.toLowerCase();
    const v = cleanText(textOf(c));
    out[k] = /date$/.test(k) ? fromTally(v) || v : v;
  }
  if (desc && !sv) {
    // legacy REQUESTDESC may carry SVCURRENTCOMPANY directly
    const c = childText(desc, 'SVCURRENTCOMPANY');
    if (c) out.svcurrentcompany = c;
  }
  return out;
}

function reply(node) {
  return { status: 200, body: typeof node === 'string' ? node : serialize(node), mutated: false };
}

function errorEnvelope(message) {
  return el('ENVELOPE', {}, el('HEADER', {}, tag('VERSION', '1'), tag('STATUS', '0')), el('BODY', {}, el('DATA', {}, tag('LINEERROR', message))));
}

function plainResponse(text) {
  return el('RESPONSE', {}, text);
}
