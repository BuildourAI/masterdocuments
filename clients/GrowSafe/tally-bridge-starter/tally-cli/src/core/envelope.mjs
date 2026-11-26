/**
 * Request envelopes for Tally's XML gateway.
 *   <ENVELOPE><HEADER><VERSION>1</VERSION><TALLYREQUEST>Export|Import|Execute</TALLYREQUEST>
 *   <TYPE>Data|Collection|Object|Function|TDLAction</TYPE><ID>..</ID></HEADER>
 *   <BODY><DESC><STATICVARIABLES>..</STATICVARIABLES><TDL><TDLMESSAGE>..</TDLMESSAGE></TDL></DESC><DATA>..</DATA></BODY></ENVELOPE>
 */
import { el, tag, serialize } from './xml.mjs';
import { toTallyVar } from './dates.mjs';

/**
 * Static variables. Values may be strings or {type, value}. Dates (ISO) are converted to 1-Apr-2026.
 * @param {Record<string, any>} vars
 */
export function staticVariables(vars = {}) {
  const kids = [];
  for (const [name, v] of Object.entries(vars)) {
    if (v === undefined || v === null || v === '') continue;
    if (typeof v === 'object') {
      const value = v.type === 'Date' && /^\d{4}-\d{2}-\d{2}$/.test(v.value) ? toTallyVar(v.value) : v.value;
      kids.push(el(name, v.type ? { TYPE: v.type } : {}, String(value)));
    } else {
      const value = /^SV(FROM|TO)DATE$/i.test(name) && /^\d{4}-\d{2}-\d{2}$/.test(v) ? toTallyVar(v) : v;
      kids.push(el(name, {}, String(value)));
    }
  }
  return kids.length ? el('STATICVARIABLES', {}, kids) : null;
}

function header(request, type, id, extra = []) {
  return el(
    'HEADER',
    {},
    tag('VERSION', '1'),
    tag('TALLYREQUEST', request),
    tag('TYPE', type),
    extra,
    id === undefined || id === null ? null : typeof id === 'object' ? id : tag('ID', id),
  );
}

/** Common static vars: company, export format, period. */
export function commonVars({ company, from, to, format = '$$SysName:XML', extra } = {}) {
  return {
    SVEXPORTFORMAT: format,
    SVCURRENTCOMPANY: company || undefined,
    SVFROMDATE: from ? { type: 'Date', value: from } : undefined,
    SVTODATE: to ? { type: 'Date', value: to } : undefined,
    ...(extra || {}),
  };
}

/** Export Data: a built-in report by name, or an inline report defined in `tdl` (array of nodes). */
export function exportData({ id, vars, tdl }) {
  return serialize(
    el(
      'ENVELOPE',
      {},
      header('Export', 'Data', id),
      el('BODY', {}, el('DESC', {}, staticVariables(vars), tdl && tdl.length ? el('TDL', {}, el('TDLMESSAGE', {}, tdl)) : null)),
    ),
  );
}

/** Export Collection: a collection by name (usually defined inline in `tdl`). */
export function exportCollection({ id, vars, tdl }) {
  return serialize(
    el(
      'ENVELOPE',
      {},
      header('Export', 'Collection', id),
      el('BODY', {}, el('DESC', {}, staticVariables(vars), tdl && tdl.length ? el('TDL', {}, el('TDLMESSAGE', {}, tdl)) : null)),
    ),
  );
}

/** Export Object: one object by its identifier. */
export function exportObject({ subtype, id, idType = 'Name', fetch = [], vars, tdl }) {
  return serialize(
    el(
      'ENVELOPE',
      {},
      header('Export', 'Object', el('ID', { TYPE: idType }, String(id)), [tag('SUBTYPE', subtype)]),
      el(
        'BODY',
        {},
        el(
          'DESC',
          {},
          staticVariables(vars),
          fetch.length ? el('FETCHLIST', {}, fetch.map((f) => tag('FETCH', f))) : null,
          tdl && tdl.length ? el('TDL', {}, el('TDLMESSAGE', {}, tdl)) : null,
        ),
      ),
    ),
  );
}

/** Export Function: evaluate a TDL function ($$Name) with parameters. */
export function exportFunction({ id, params = [], vars }) {
  const name = id.startsWith('$$') ? id : `$$${id}`;
  return serialize(
    el(
      'ENVELOPE',
      {},
      header('Export', 'Function', name),
      el(
        'BODY',
        {},
        el(
          'DESC',
          {},
          staticVariables(vars),
          params.length
            ? el(
                'FUNCPARAMLIST',
                {},
                params.map((p) => (typeof p === 'object' ? el('PARAM', p.type ? { TYPE: p.type } : {}, String(p.value)) : tag('PARAM', p))),
              )
            : null,
        ),
      ),
    ),
  );
}

/**
 * Import Data: masters ("All Masters") or vouchers ("Vouchers").
 * @param {{id: string, vars?: object, messages: any[]}} p messages: nodes placed inside TALLYMESSAGE
 */
export function importData({ id, vars, messages }) {
  return serialize(
    el(
      'ENVELOPE',
      {},
      header('Import', 'Data', id),
      el('BODY', {}, el('DESC', {}, staticVariables(vars)), el('DATA', {}, el('TALLYMESSAGE', {}, messages))),
    ),
  );
}

/** Execute a TDL action (only "Sync" is documented by Tally). */
export function execute({ type = 'TDLAction', id, vars }) {
  return serialize(el('ENVELOPE', {}, header('Execute', type, id), vars ? el('BODY', {}, el('DESC', {}, staticVariables(vars))) : null));
}
