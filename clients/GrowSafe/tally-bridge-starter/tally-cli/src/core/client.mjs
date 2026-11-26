/**
 * TallyClient: the only place that talks to a transport. It serialises requests, parses replies,
 * turns Tally's error formats into typed errors, and offers typed helpers for each request kind.
 */
import { parseXml, path as xpath, child, childText, findAll, findFirst, textOf, elementChildren, cleanText } from './xml.mjs';
import { exportData, exportCollection, exportObject, exportFunction, importData, execute, commonVars } from './envelope.mjs';
import { flatReport, rowsFromReply } from './tdl.mjs';
import { TallyCliError } from './errors.mjs';
import { monthWindows, halveWindow } from './dates.mjs';
import { explainTallyMessage } from './explain.mjs';

export class TallyClient {
  /**
   * @param {{transport: any, profile: object, lock?: {run: Function}, log?: Function}} opts
   */
  constructor({ transport, profile, lock, log }) {
    this.transport = transport;
    this.profile = profile;
    this.lock = lock || { run: (fn) => fn() };
    this.log = log || (() => {});
    this.stats = { requests: 0, ms: 0, bytes: 0 };
    this.last = { request: null, reply: null };
  }

  get company() {
    return this.profile.company || null;
  }

  /** Send a request string; returns the reply text. */
  async sendRaw(body, opts = {}) {
    return this.lock.run(async () => {
      this.last.request = body;
      this.log(`-> ${this.transport.name} ${String(body).length} chars`);
      const reply = await this.transport.send(body, opts);
      this.stats.requests++;
      this.stats.ms += reply.ms;
      this.stats.bytes += reply.bytes;
      this.last.reply = reply.text;
      this.log(`<- ${reply.status} ${reply.bytes} bytes in ${reply.ms} ms`);
      if (reply.status && reply.status >= 400) {
        throw new TallyCliError('E_TALLY', `Tally gateway returned HTTP ${reply.status}.`, { details: reply.text.slice(0, 500) });
      }
      return reply;
    });
  }

  /** Send an export request and return the parsed, error-checked tree. */
  async exportRequest(xml, opts = {}) {
    const reply = await this.sendRaw(xml, opts);
    const root = parseXml(reply.text);
    checkExportReply(root);
    return root;
  }

  /**
   * Run a flat report and return typed rows.
   * @param {{collection: object, fields: object[]}} spec
   * @param {{from?: string, to?: string, vars?: object, company?: string|null, chunk?: boolean}} opts
   */
  async rows(spec, opts = {}) {
    const company = opts.company === undefined ? this.company : opts.company;
    if (opts.chunk && opts.from && opts.to) return this.rowsChunked(spec, { ...opts, company });
    const { tdl, name } = flatReport(spec);
    const xml = exportData({ id: name, vars: commonVars({ company, from: opts.from, to: opts.to, extra: opts.vars }), tdl });
    const root = await this.exportRequest(xml, { timeoutMs: opts.timeoutMs });
    return rowsFromReply(root, spec.fields);
  }

  /** Split a period into windows (one month at most), halving a window when Tally times out. */
  async rowsChunked(spec, opts) {
    const maxDays = this.profile.chunk?.maxDays || 31;
    const pauseMs = this.profile.chunk?.pauseMs || 0;
    const queue = maxDays >= 28 ? monthWindows(opts.from, opts.to) : splitDays(opts.from, opts.to, maxDays);
    const out = [];
    while (queue.length) {
      const w = queue.shift();
      try {
        const rows = await this.rows(spec, { ...opts, chunk: false, from: w.from, to: w.to });
        for (const r of rows) out.push(r);
        if (opts.onWindow) opts.onWindow(w, rows.length);
      } catch (err) {
        const halves = (err.code === 'E_TIMEOUT' || err.code === 'E_TRUNCATED') && halveWindow(w);
        if (!halves) throw err;
        this.log(`window ${w.from}..${w.to} failed (${err.code}); splitting`);
        queue.unshift(...halves);
      }
      if (pauseMs && queue.length) await new Promise((r) => setTimeout(r, pauseMs));
    }
    return out;
  }

  /** Export a built-in report (or an inline-TDL report) and return the raw tree. */
  async report(id, { vars = {}, from, to, company, tdl } = {}) {
    const xml = exportData({ id, vars: commonVars({ company: company === undefined ? this.company : company, from, to, extra: vars }), tdl });
    return this.exportRequest(xml);
  }

  /** Export a collection (usually defined inline) and return the raw tree. */
  async collection(id, { vars = {}, from, to, company, tdl } = {}) {
    const xml = exportCollection({ id, vars: commonVars({ company: company === undefined ? this.company : company, from, to, extra: vars }), tdl });
    return this.exportRequest(xml);
  }

  /** Export one object by identifier; returns the object element or throws E_NOT_FOUND. */
  async object(subtype, id, { idType = 'Name', fetch = [], company } = {}) {
    const xml = exportObject({ subtype, id, idType, fetch, vars: commonVars({ company: company === undefined ? this.company : company }) });
    const root = await this.exportRequest(xml);
    const msg = findFirst(root, 'TALLYMESSAGE');
    const obj = msg ? elementChildren(msg)[0] : undefined;
    if (!obj) throw new TallyCliError('E_NOT_FOUND', `${subtype} "${id}" was not found in Tally.`);
    return obj;
  }

  /** Evaluate a TDL function; returns the result string. */
  async func(id, params = [], { company } = {}) {
    const xml = exportFunction({ id, params, vars: commonVars({ company: company === undefined ? this.company : company }) });
    const root = await this.exportRequest(xml);
    const result = findFirst(root, 'RESULT');
    if (!result) throw new TallyCliError('E_TALLY', `Function ${id} returned no RESULT.`);
    return cleanText(textOf(result));
  }

  /**
   * Import masters or vouchers.
   * @param {'All Masters'|'Vouchers'} id
   * @param {any[]} messages nodes for TALLYMESSAGE
   * @returns {Promise<ImportResult>}
   */
  async importMessages(id, messages, { vars = {}, company, timeoutMs } = {}) {
    const xml = importData({ id, vars: { SVCURRENTCOMPANY: company === undefined ? this.company : company, ...vars }, messages });
    return this.importXml(xml, { timeoutMs });
  }

  /** Send an already-built import envelope. */
  async importXml(xml, { timeoutMs } = {}) {
    const reply = await this.sendRaw(xml, { timeoutMs, kind: 'write' });
    const result = parseImportReply(reply.text);
    result.request = xml;
    result.reply = reply.text;
    return result;
  }

  async execute(id, { type = 'TDLAction' } = {}) {
    const reply = await this.sendRaw(execute({ type, id }));
    const root = parseXml(reply.text);
    checkExportReply(root);
    return root;
  }
}

function splitDays(from, to, days) {
  const out = [];
  let w = { from, to };
  const add = (d, n) => {
    const t = new Date(d + 'T00:00:00Z');
    t.setUTCDate(t.getUTCDate() + n);
    return t.toISOString().slice(0, 10);
  };
  while (w.from <= to) {
    const end = add(w.from, days - 1);
    out.push({ from: w.from, to: end < to ? end : to });
    w = { from: add(end, 1), to };
  }
  return out;
}

/** Throw a typed error if an export reply reports failure. */
export function checkExportReply(root) {
  const name = root.name.toUpperCase();
  if (name === 'ENVELOPE') {
    const status = childText(child(root, 'HEADER'), 'STATUS');
    const lineErrors = findAll(root, 'LINEERROR').map((n) => cleanText(textOf(n))).filter(Boolean);
    if (status === '0' || lineErrors.length) {
      const descs = findAll(root, 'STATUS')
        .map((s) => childText(s, 'DESC'))
        .filter(Boolean);
      const msg = lineErrors[0] || descs[0] || cleanText(textOf(xpath(root, 'BODY/DATA')) || '') || 'Tally reported an error.';
      throw tallyError(msg, { lineErrors, descs });
    }
    return;
  }
  if (name === 'RESPONSE' && elementChildren(root).length === 0) {
    const text = cleanText(textOf(root));
    if (text && !/running/i.test(text)) throw tallyError(text);
  }
}

export function tallyError(message, details) {
  const ex = explainTallyMessage(message);
  return new TallyCliError('E_TALLY', `Tally: ${message}`, { hint: ex?.remedy, details });
}

/**
 * @typedef {{created: number, altered: number, deleted: number, cancelled: number, combined: number, ignored: number,
 *   errors: number, exceptions: number, lastVchId: number, lastMid: number, lineErrors: string[], ok: boolean,
 *   request?: string, reply?: string}} ImportResult
 */

/** Parse an import reply in any of Tally's formats (RESPONSE, IMPORTRESULT, DATA, LINEERROR, plain text). */
export function parseImportReply(text) {
  let root;
  try {
    root = parseXml(text);
  } catch (err) {
    if (err.code === 'E_TALLY') throw tallyError(err.message.replace(/^.*?XML: /, ''));
    throw err;
  }
  const holder =
    findFirst(root, 'IMPORTRESULT') ||
    (findFirst(root, 'CREATED') ? findFirst(root, 'CREATED') && parentOf(root, findFirst(root, 'CREATED')) : null) ||
    root;
  const num = (tagName) => {
    const v = childText(holder, tagName);
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : 0;
  };
  const lineErrors = findAll(root, 'LINEERROR').map((n) => cleanText(textOf(n))).filter(Boolean);
  const status = childText(child(root, 'HEADER'), 'STATUS');
  const hasCounts = !!findFirst(root, 'CREATED') || !!findFirst(root, 'ERRORS');
  if (!hasCounts && !lineErrors.length) {
    const t = cleanText(textOf(root));
    if (status === '0' || t) throw tallyError(t || 'Import failed.');
  }
  const result = {
    created: num('CREATED'),
    altered: num('ALTERED'),
    deleted: num('DELETED'),
    cancelled: num('CANCELLED'),
    combined: num('COMBINED'),
    ignored: num('IGNORED'),
    errors: num('ERRORS'),
    exceptions: num('EXCEPTIONS'),
    lastVchId: num('LASTVCHID'),
    lastMid: num('LASTMID'),
    lineErrors,
    voucherNumber: childText(holder, 'VCHNUMBER') || undefined,
  };
  if (lineErrors.length && result.errors === 0) result.errors = lineErrors.length;
  result.ok = result.errors === 0 && result.exceptions === 0 && status !== '0';
  return result;
}

function parentOf(root, target) {
  let found = null;
  const visit = (n) => {
    for (const c of elementChildren(n)) {
      if (c === target) {
        found = n;
        return true;
      }
      if (visit(c)) return true;
    }
    return false;
  };
  visit(root);
  return found;
}
