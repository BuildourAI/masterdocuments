/**
 * Shared helpers for domain code: name resolution with suggestions, import-with-audit, period handling.
 */
import { TallyCliError, suggest } from '../core/errors.mjs';
import { resolvePeriod } from '../core/dates.mjs';
import { prettyXml } from '../core/xml.mjs';
import { tallyError } from '../core/client.mjs';

const norm = (s) =>
  String(s ?? '')
    .replace(/\u0004\s?/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

export { norm };

/** Company period info (books from), memoised. Fails soft. */
export async function companyBooksFrom(ctx) {
  return ctx.memo('booksFrom', async () => {
    try {
      const rows = await ctx.client.rows(
        { collection: { type: 'Company' }, fields: [{ key: 'name', method: 'Name' }, { key: 'booksFrom', method: 'BooksFrom', type: 'date' }] },
        { company: null },
      );
      const want = ctx.profile.company;
      const row = want ? rows.find((r) => norm(r.name) === norm(want)) : rows[0];
      return row?.booksFrom || null;
    } catch {
      return null;
    }
  });
}

/** Resolve --from/--to/--fy into a concrete period, using the books start when known. */
export async function period(ctx, input, { needBooks = true } = {}) {
  const booksFrom = needBooks && !input.from && !input.fy ? await companyBooksFrom(ctx) : null;
  return resolvePeriod({ from: input.from, to: input.to, fy: input.fy, asOf: input.asOf }, { booksFrom });
}

/**
 * Resolve a name against a list of existing names: exact match ignoring case and spaces.
 * Throws E_NOT_FOUND with suggestions when missing.
 */
export function resolveIn(list, name, what) {
  const n = norm(name);
  const hit = list.find((x) => norm(x) === n);
  if (hit) return hit;
  const s = suggest(name, list, 5);
  throw new TallyCliError('E_NOT_FOUND', `${what} "${name}" does not exist in Tally.`, {
    hint: s.length ? `Did you mean: ${s.map((x) => `"${x}"`).join(', ')}?` : `Create it first, or check the spelling.`,
    details: { suggestions: s },
  });
}

/**
 * Before any write: the profile must name its company, that company must be open, and when the
 * profile pinned the company's id, the open company must have the same id (so a restored copy or
 * another data folder with the same name is never written to). Checked once per invocation.
 */
export async function assertWriteTarget(ctx) {
  return ctx.memo('writeTarget', async () => {
    if (!ctx.profile.company) {
      throw new TallyCliError('E_CONFIG', 'Writes need the target company named in the profile.', { hint: 'Run "tally init --company \"<name>\"" (or pass --company) so data can never go to whichever company happens to be active.' });
    }
    const { targetCompany } = await import('./company.mjs');
    try {
      return await targetCompany(ctx);
    } catch (err) {
      // Nothing was written yet: make sure no caller mistakes this for an unknown write outcome.
      err.details = { ...(err.details && typeof err.details === 'object' ? err.details : {}), sent: false, beforeWrite: true };
      throw err;
    }
  });
}

/**
 * Send an import, check the result, write the audit record. Returns the parsed result.
 * @param {any} ctx
 * @param {{op: string, id: 'All Masters'|'Vouchers', messages: any[], input: any, vars?: object, summary?: object, expect?: string}} p
 */
export async function auditedImport(ctx, { op, id, messages, input, vars, summary, expect }) {
  await assertWriteTarget(ctx);
  let result;
  try {
    result = await ctx.client.importMessages(id, messages, { vars });
  } catch (err) {
    ctx.audit.append({ op, profile: ctx.profileName, company: ctx.profile.company, frontend: ctx.frontend, input, outcome: 'error', error: err.code ? { code: err.code, message: err.message } : String(err), request: ctx.client.last.request, reply: ctx.client.last.reply, summary });
    throw err;
  }
  const outcome = result.ok ? 'ok' : 'rejected';
  const rec = ctx.audit.append({
    op,
    profile: ctx.profileName,
    company: ctx.profile.company,
    frontend: ctx.frontend,
    input,
    outcome,
    result: { created: result.created, altered: result.altered, deleted: result.deleted, cancelled: result.cancelled, combined: result.combined, ignored: result.ignored, errors: result.errors, lastVchId: result.lastVchId, lineErrors: result.lineErrors },
    request: result.request,
    reply: result.reply,
    summary,
  });
  result.auditSeq = rec.seq;
  if (!result.ok) {
    const msg = result.lineErrors[0] || `Tally rejected the import (${result.errors} error(s)).`;
    const e = tallyError(msg, { result: { ...result, request: undefined, reply: undefined }, auditSeq: rec.seq });
    throw e;
  }
  if (expect) {
    const n = result[expect] || 0;
    if (n === 0) {
      ctx.warn(`Tally accepted the request but reported ${expect}=0 (created ${result.created}, altered ${result.altered}, ignored ${result.ignored}, combined ${result.combined}).`);
    }
  }
  return result;
}

/** Standard dry-run answer. */
export function dryRunResult(xml, extra = {}) {
  return { dryRun: true, sent: false, ...extra, xml: prettyXml(xml) };
}

/** Filter rows by a free-text query on given keys (case-insensitive substring), ranked. */
export function searchRows(rows, query, keys = ['name']) {
  if (!query) return rows;
  const q = norm(query);
  const scored = [];
  for (const r of rows) {
    let best = 99;
    for (const k of keys) {
      const v = norm(r[k]);
      if (!v) continue;
      if (v === q) best = Math.min(best, 0);
      else if (v.startsWith(q)) best = Math.min(best, 1);
      else if (v.includes(q)) best = Math.min(best, 2);
      else if (q.split(' ').every((w) => v.includes(w))) best = Math.min(best, 3);
    }
    if (best < 99) scored.push([best, r]);
  }
  if (!scored.length) {
    const names = rows.map((r) => r[keys[0]]);
    const s = new Set(suggest(query, names, 10));
    return rows.filter((r) => s.has(r[keys[0]]));
  }
  scored.sort((a, b) => a[0] - b[0] || String(a[1][keys[0]]).length - String(b[1][keys[0]]).length);
  return scored.map((s) => s[1]);
}

export function limitRows(rows, limit) {
  return limit ? rows.slice(0, limit) : rows;
}
