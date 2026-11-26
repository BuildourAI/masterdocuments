/**
 * Posting pipeline for vouchers: validate, apply policy, guard against double posting, send,
 * read back, audit. Also alter, cancel, delete, regularise and undo.
 */
import crypto from 'node:crypto';
import path from 'node:path';
import { createLock } from '../../core/lock.mjs';
import { TallyCliError } from '../../core/errors.mjs';
import { fromPaise } from '../../core/amounts.mjs';
import { importData } from '../../core/envelope.mjs';
import { stableStringify } from '../../core/audit.mjs';
import { allowedInEducationalMode } from '../../core/dates.mjs';
import { normaliseVoucher } from './model.mjs';
import { buildVoucher, buildVoucherAction, buildHeaderAlter } from './build.mjs';
import { getVoucher, findVouchers, listVouchers } from './read.mjs';
import { auditedImport, dryRunResult, norm, assertWriteTarget } from '../common.mjs';
import { ledgerClasses } from '../reports.mjs';
import { KINDS, kindForBase } from './kinds.mjs';
import { serialize, prettyXml } from '../../core/xml.mjs';

const IDEM_FILE = 'idempotency.json';

export function fingerprint(input) {
  const { idempotencyKey: _k, dryRun: _d, yes: _y, forceResend: _f, ...rest } = input || {};
  return crypto.createHash('sha256').update(stableStringify(rest)).digest('hex').slice(0, 32);
}

/** Human summary of a plan (for dry runs, previews and approvals). */
export function summarisePlan(plan) {
  const lines = [];
  for (const e of plan.entries) lines.push({ ledger: e.ledger, [e.side]: fromPaise(e.paise), ...(e.bills ? { bills: e.bills.map((b) => `${b.type}${b.ref ? ' ' + b.ref : ''} ${fromPaise(b.paise)}`).join('; ') } : {}) });
  for (const it of plan.items) lines.push({ item: it.item, qty: it.qty, unit: it.unit, rate: it.rate, amount: fromPaise(it.paise), ...(it.ledger ? { ledger: it.ledger } : {}), ...(it.godown ? { godown: it.godown } : {}), direction: it.direction });
  return {
    kind: plan.kind,
    voucherType: plan.voucherType,
    date: plan.date,
    number: plan.number || '(automatic)',
    party: plan.party || null,
    total: plan.total !== undefined ? fromPaise(plan.total) : null,
    debit: fromPaise(plan.totals.debit),
    credit: fromPaise(plan.totals.credit),
    optional: !!plan.optional,
    ...(plan.gst ? { gst: plan.gst } : {}),
    lines,
  };
}

async function educationalCheck(ctx, plan) {
  if (ctx.caps.educational === true || ctx.profile.educational === true) {
    if (!allowedInEducationalMode(plan.date)) throw new TallyCliError('E_POLICY', `Tally is in Educational mode: ${plan.date} is not allowed (use the 1st, 2nd or last day of a month).`);
  }
}

function templateFor(ctx, plan) {
  const all = ctx.state.read('templates.json', {});
  const scoped = all[ctx.scope] || {};
  return scoped[norm(plan.voucherType)] || scoped[norm(plan.baseType)] || null;
}

/**
 * Validate and build without sending. Returns {plan, node, xml, summary}.
 */
export async function prepare(ctx, input, { action = 'Create', identify, forAlter } = {}) {
  const { dryRun: _dry, yes: _yes, forceResend: _fr, ...model } = input || {};
  const plan = await normaliseVoucher(ctx, model, { forAlter });
  const forceOptional = ctx.profile.writeMode === 'optional';
  if (forceOptional && ctx.caps['import.optionalStaysOut'] === false) {
    throw new TallyCliError('E_POLICY', 'Optional write mode is not safe on this Tally: the self-test found that optional vouchers change balances.', { hint: 'Use writeMode "off", or "on" with an approval flow (voucher prepare / commit).' });
  }
  if (forceOptional && !plan.optional) {
    plan.optional = true;
    plan.forcedOptional = true;
  }
  const remoteId = ctx.caps['import.remoteIdUpsert'] === true && input.idempotencyKey ? `tc-${crypto.createHash('sha256').update(String(input.idempotencyKey)).digest('hex').slice(0, 24)}` : undefined;
  const node = buildVoucher(plan, { action, identify, remoteId, template: templateFor(ctx, plan) });
  const xml = importData({ id: 'Vouchers', vars: { SVCURRENTCOMPANY: ctx.profile.company }, messages: [node] });
  return { plan, node, xml, summary: summarisePlan(plan) };
}

/** Create a voucher. */
export async function postVoucher(ctx, input, { op = 'voucher.create', requestInput } = {}) {
  // The fingerprint is taken from what the caller asked for, so derived details (such as bills chosen by
  // --auto-allocate) cannot make a retry look like a different voucher.
  const fpSource = requestInput || input;
  if (requestInput?.forceResend) input = { ...input, forceResend: true };
  if (input.idempotencyKey && !input.dryRun) {
    const seen = ctx.state.read(IDEM_FILE, {})[`${ctx.scope}::${input.idempotencyKey}`];
    if (seen && seen.status === 'done') {
      if (seen.fingerprint !== fingerprint(fpSource)) throw new TallyCliError('E_CONFLICT', `idempotencyKey "${input.idempotencyKey}" was already used for a different voucher.`, { details: seen, hint: 'Use a new key for a new voucher.' });
      return { duplicate: true, created: false, message: 'Already posted earlier with this idempotencyKey; nothing was sent.', ...seen.result };
    }
  }
  const prepared = await prepare(ctx, input);
  const { plan, node, summary } = prepared;
  if (plan.forcedOptional) ctx.warn('This profile is in "optional" write mode: the voucher is created as an optional voucher (not in the books until regularised in Tally).');
  if (input.dryRun) return dryRunResult(prepared.xml, { summary });
  return sendCreate(ctx, { input, plan, node, summary, op, fpSource });
}

async function sendCreate(ctx, { input, plan, node, summary, op, planId, fpSource }) {
  ctx.policy.assertWritesEnabled(op);
  ctx.policy.checkVoucher({ voucherType: plan.voucherType, baseType: plan.baseType, date: plan.date, total: plan.total !== undefined ? fromPaise(plan.total) : undefined }, op);
  await educationalCheck(ctx, plan);
  const key = input.idempotencyKey || null;
  if (!key && ctx.profile.requireIdempotencyKey) throw new TallyCliError('E_INPUT', 'This profile requires an idempotencyKey on every voucher.', { hint: 'Use a stable id from your system, e.g. the invoice id or bank transaction id.' });
  const fp = fingerprint({ ...(fpSource || input), ...(planId ? { planId } : {}) });
  await assertWriteTarget(ctx);
  if (!key) return sendCreateLocked(ctx, { input, plan, node, summary, op, key, fp });
  // Check, send and record under one lock, so concurrent requests with the same key cannot both post.
  const lock = createLock(path.join(ctx.config.stateDir, 'idempotency.lock'), { leaseMs: (ctx.profile.timeoutMs || 120000) * 3 });
  return lock.run(async () => {
    const seen = ctx.state.read(IDEM_FILE, {})[`${ctx.scope}::${key}`];
    if (seen) {
      if (seen.fingerprint !== fp) throw new TallyCliError('E_CONFLICT', `idempotencyKey "${key}" was already used for a different voucher.`, { details: seen, hint: 'Use a new key for a new voucher.' });
      if (seen.status === 'done') return { duplicate: true, created: false, message: 'Already posted earlier with this idempotencyKey; nothing was sent.', ...seen.result };
      // pending (a process died mid-request) or indeterminate (reply lost): look in Tally before anything else
      const resolved = await probeForPosted(ctx, plan);
      if (resolved) {
        markIdem(ctx, key, { status: 'done', fingerprint: fp, result: resolved });
        return { duplicate: true, created: false, message: 'A previous attempt with this key reached Tally; nothing was sent again.', ...resolved };
      }
      // Only a person at the command line may confirm a resend; AI clients over MCP/HTTP/relay cannot.
      if (!(input.forceResend && ctx.frontend === 'cli')) {
        throw new TallyCliError('E_INDETERMINATE', `A previous attempt with idempotencyKey "${key}" has an unknown outcome and the voucher was not found in Tally.`, {
          hint: `Check in Tally (tally voucher find --date ${plan.date} --type "${plan.voucherType}"). If it is really not there, send again with "forceResend": true.`,
          details: seen,
        });
      }
    }
    markIdem(ctx, key, { status: 'pending', fingerprint: fp, at: new Date().toISOString() });
    return sendCreateLocked(ctx, { input, plan, node, summary, op, key, fp });
  });
}

async function sendCreateLocked(ctx, { input, plan, node, summary, op, key, fp }) {
  let result;
  try {
    result = await auditedImport(ctx, { op, id: 'Vouchers', messages: [node], input, summary, expect: 'created' });
  } catch (err) {
    // Tally answered and said no: nothing was created. Not sent at all: nothing was created.
    const rejected = err.code === 'E_TALLY' && err.details?.result;
    const notSent = err.details?.sent === false || err.code === 'E_LOCKED' || err.code === 'E_CONFIG';
    if (!rejected && !notSent) {
      const resolved = await probeForPosted(ctx, plan).catch(() => null);
      if (resolved) {
        if (key) markIdem(ctx, key, { status: 'done', fingerprint: fp, result: resolved });
        ctx.warn('The reply from Tally was lost, but the voucher was found in Tally afterwards.');
        return { created: true, recovered: true, ...resolved };
      }
      if (key) markIdem(ctx, key, { status: 'indeterminate', fingerprint: fp, at: new Date().toISOString() });
      throw new TallyCliError('E_INDETERMINATE', `The request may or may not have reached Tally (${err.code}: ${err.message}), and the voucher could not be found yet.`, {
        hint: `Do not post again blindly. Check with: tally voucher find --date ${plan.date} --type "${plan.voucherType}"${plan.party ? ` --party "${plan.party}"` : ''}. Re-sending with the same idempotencyKey is safe: it checks Tally first.`,
        details: { idempotencyKey: key },
      });
    }
    if (key) clearIdem(ctx, key);
    throw err;
  }
  const out = { created: true, voucherType: plan.voucherType, date: plan.date, number: plan.number || result.voucherNumber || null, party: plan.party || null, total: plan.total !== undefined ? fromPaise(plan.total) : null, optional: !!plan.optional, masterId: result.lastVchId || null, auditSeq: result.auditSeq };
  // Read back
  try {
    const back = out.masterId ? await getVoucher(ctx, { masterId: out.masterId, date: plan.date }) : (await probeForPosted(ctx, plan)) || null;
    if (back) {
      out.guid = back.guid;
      out.number = back.number || out.number;
      out.masterId = back.masterId || out.masterId;
      const backTotal = back.total;
      out.verified = out.total === null || Math.abs((backTotal || 0) - out.total) < 0.005;
      if (!out.verified) ctx.warn(`Read-back total ${backTotal} differs from the posted total ${out.total}. Check the voucher in Tally.`);
      out.status = back.status;
    } else out.verified = false;
  } catch (err) {
    out.verified = false;
    ctx.warn(`Posted, but the read-back failed: ${err.message}`);
  }
  if (key) markIdem(ctx, key, { status: 'done', fingerprint: fp, result: { masterId: out.masterId, guid: out.guid, number: out.number, date: out.date, voucherType: out.voucherType, total: out.total } });
  return out;
}

function markIdem(ctx, key, rec) {
  ctx.state.update(IDEM_FILE, (all) => {
    all[`${ctx.scope}::${key}`] = rec;
    return all;
  });
}

function clearIdem(ctx, key) {
  ctx.state.update(IDEM_FILE, (all) => {
    delete all[`${ctx.scope}::${key}`];
    return all;
  });
}

/** Look for a voucher matching a plan (type, date, party, total, number/reference). */
async function probeForPosted(ctx, plan) {
  const r = await findVouchers(ctx, { date: plan.date, type: plan.voucherType, party: plan.party || undefined, amount: plan.listTotal !== undefined ? fromPaise(plan.listTotal) : undefined, number: plan.number || undefined, reference: plan.reference?.number || undefined, narration: plan.listTotal === undefined && plan.narration ? plan.narration : undefined, status: 'all' });
  if (r.vouchers.length === 1) {
    const v = r.vouchers[0];
    return { masterId: v.masterId, guid: v.guid, number: v.number, date: v.date, voucherType: v.voucherType, total: v.total };
  }
  return null;
}

// ---------------------------------------------------------------- prepare / commit

export async function preparePlan(ctx, input) {
  const prepared = await prepare(ctx, input);
  const id = `p${Date.now().toString(36)}${crypto.randomBytes(3).toString('hex')}`;
  const record = { id, createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(), profile: ctx.profileName, company: ctx.profile.company, input, xml: serialize(prepared.node), xmlHash: crypto.createHash('sha256').update(prepared.xml).digest('hex').slice(0, 16), summary: prepared.summary };
  ctx.state.write(`plans/${id}.json`, record);
  return { planId: id, expiresAt: record.expiresAt, summary: prepared.summary, xml: prettyXml(prepared.xml), next: `tally voucher commit --plan-id ${id}` };
}

export async function commitPlan(ctx, { planId, forceResend }) {
  const rec = ctx.state.read(`plans/${planId}.json`, null);
  if (!rec) throw new TallyCliError('E_NOT_FOUND', `Plan ${planId} not found.`, { hint: 'Plans are stored in the state folder for 24 hours.' });
  if (rec.committed) return { duplicate: true, created: false, message: 'This plan was already committed.', ...rec.committed };
  if (new Date(rec.expiresAt) < new Date()) throw new TallyCliError('E_POLICY', `Plan ${planId} expired at ${rec.expiresAt}.`, { hint: 'Prepare it again.' });
  if (rec.profile !== ctx.profileName) throw new TallyCliError('E_POLICY', `Plan ${planId} was prepared for profile "${rec.profile}".`);
  if (norm(rec.company) !== norm(ctx.profile.company)) throw new TallyCliError('E_POLICY', `Plan ${planId} was prepared for company "${rec.company || '(active)'}", not "${ctx.profile.company || '(active)'}".`);
  // Rebuild and compare, so a plan cannot be committed against changed masters or edited files.
  const prepared = await prepare(ctx, rec.input);
  if (serialize(prepared.node) !== rec.xml) throw new TallyCliError('E_CONFLICT', 'The voucher would no longer be built the same way (masters or settings changed since it was prepared).', { hint: 'Prepare it again and review.' });
  const out = await sendCreate(ctx, { input: { ...rec.input, idempotencyKey: rec.input.idempotencyKey || `plan:${planId}`, ...(forceResend ? { forceResend: true } : {}) }, plan: prepared.plan, node: prepared.node, summary: prepared.summary, op: 'voucher.commit', planId });
  rec.committed = { masterId: out.masterId, guid: out.guid, number: out.number, at: new Date().toISOString() };
  ctx.state.write(`plans/${planId}.json`, rec);
  return { planId, ...out };
}

export function listPlans(ctx) {
  return ctx.state
    .list('plans')
    .filter((f) => f.endsWith('.json'))
    .map((f) => ctx.state.read(`plans/${f}`, null))
    .filter(Boolean)
    .map((p) => ({ planId: p.id, createdAt: p.createdAt, expiresAt: p.expiresAt, committed: !!p.committed, voucherType: p.summary.voucherType, date: p.summary.date, party: p.summary.party, total: p.summary.total }));
}

// ---------------------------------------------------------------- existing vouchers

/** Convert a read voucher into an input model (for re-posting after edits). */
export function readToInput(v) {
  const input = { voucherType: v.voucherType, date: v.date, number: v.number || undefined, narration: v.narration ?? undefined, party: v.party || undefined, optional: v.status === 'optional' };
  if (v.reference) input.reference = v.reference;
  if (v.placeOfSupply) input.placeOfSupply = v.placeOfSupply;
  if (v.items && v.ledgers) {
    input.items = v.items.map((i) => clean({ item: i.item, qty: i.qty, unit: i.unit || undefined, rate: i.rate, per: i.per || undefined, discountPct: i.discountPct, amount: i.amount, ledger: i.ledger || undefined, godown: i.godown || undefined, batch: i.batch || undefined, orderNo: i.orderNo, dueDate: i.dueDate }));
    input.ledgers = v.ledgers.map((l) => clean({ ledger: l.ledger, debit: l.debit, credit: l.credit, bills: l.bills, isParty: l.isParty }));
    const party = v.ledgers.find((l) => l.isParty);
    if (party?.bills) input.bills = party.bills;
    input.taxes = 'none';
  } else if (v.entries) {
    input.entries = v.entries.map((e) => clean({ ledger: e.ledger, debit: e.debit, credit: e.credit, bills: e.bills, bank: e.bank ? clean({ transactionType: e.bank.transactionType, instrumentNumber: e.bank.instrumentNumber, instrumentDate: e.bank.instrumentDate, bankName: e.bank.bankName, bankersDate: e.bank.bankersDate }) : undefined, costCentres: e.costCentres }));
  }
  if (v.items && !v.ledgers && v.baseType === 'Stock Journal') {
    input.consumed = v.items.filter((i) => i.direction === 'out').map((i) => clean({ item: i.item, qty: i.qty, unit: i.unit, rate: i.rate, godown: i.godown }));
    input.produced = v.items.filter((i) => i.direction === 'in').map((i) => clean({ item: i.item, qty: i.qty, unit: i.unit, rate: i.rate, godown: i.godown }));
    delete input.entries;
  }
  return input;
}

function clean(o) {
  const out = {};
  for (const [k, v] of Object.entries(o)) if (v !== undefined && v !== null && v !== '') out[k] = v;
  return out;
}

/** How to address an existing voucher in an import: the documented "Voucher Number" form when unique, else master id. */
export async function identifyFor(ctx, v) {
  if (v.number) {
    const same = await listVouchers(ctx, { from: v.date, to: v.date, type: v.voucherType, number: v.number, status: 'all' });
    if (same.vouchers.filter((x) => x.voucherType === v.voucherType).length === 1) return { date: v.date, tagName: 'Voucher Number', tagValue: v.number, voucherType: v.voucherType };
  }
  return { date: v.date, tagName: ctx.caps['import.tagMasterId'] || 'MASTER ID', tagValue: String(v.masterId), voucherType: v.voucherType };
}

/** Apply the profile's voucher limits (types, lock date, amount cap, Educational mode) to an existing voucher. */
async function checkExisting(ctx, v, op) {
  ctx.policy.checkVoucher({ voucherType: v.voucherType, baseType: v.baseType, date: v.date, total: v.total }, op);
  await educationalCheck(ctx, { date: v.date });
}

async function loadForChange(ctx, input, op) {
  const v = await getVoucher(ctx, { masterId: input.masterId, guid: input.guid, number: input.number, type: input.type, date: input.date });
  if (input.ifAlterId !== undefined && Number(input.ifAlterId) !== v.alterId) {
    throw new TallyCliError('E_CONFLICT', `The voucher changed since it was read (alter id ${v.alterId}, expected ${input.ifAlterId}).`, { hint: 'Read it again ("tally voucher get") and retry.' });
  }
  if (v.irn || v.irnAckNo) throw new TallyCliError('E_POLICY', `${op}: the voucher has an e-invoice (IRN); change it in Tally where the e-invoice can be cancelled properly.`);
  await checkExisting(ctx, v, op);
  return v;
}

/** Alter an existing voucher: read, apply changes, send the full voucher, read back. */
export async function updateVoucher(ctx, input) {
  const before = await loadForChange(ctx, input, 'voucher.update');
  const patch = input.changes || {};
  for (const k of ['narration', 'reference', 'newDate', 'optional']) if (input[k] !== undefined) patch[k === 'newDate' ? 'date' : k] = input[k];
  if (!Object.keys(patch).length) throw new TallyCliError('E_INPUT', 'Nothing to change.', { hint: 'Give --narration, --reference, --new-date, or a JSON file of changes with --input (any voucher fields).' });
  const identify = await identifyFor(ctx, before);
  const headerOnly = Object.keys(patch).every((k) => ['narration', 'reference', 'date', 'optional'].includes(k));
  let node;
  let summary;
  if (headerOnly && ctx.caps['import.alterKeepsLists'] === true) {
    if (patch.date) await checkExisting(ctx, { ...before, date: patch.date }, 'voucher.update');
    node = buildHeaderAlter(identify, { date: patch.date, narration: patch.narration, reference: typeof patch.reference === 'object' ? patch.reference?.number : patch.reference, optional: patch.optional });
    summary = { headerOnly: true, changes: patch };
  } else {
    if (!headerOnly || patch.optional !== undefined) ctx.warn('The whole voucher is rebuilt from the fields this tool reads; details it does not model (some GST, e-invoice or batch splits) are not carried over.');
    const merged = { ...readToInput(before), ...patch };
    if (patch.reference && typeof patch.reference === 'string') merged.reference = { number: patch.reference };
    if ((patch.items || patch.charges) && before.ledgers && patch.ledgers === undefined) {
      // Items changed: rebuild tax and round-off lines instead of keeping the old amounts.
      const classes = await ledgerClasses(ctx);
      const cls = (l) => classes.get(norm(l.ledger)) || {};
      const partySide = KINDS[kindForBase(before.baseType)]?.partySide || 'debit';
      const others = before.ledgers.filter((l) => !l.isParty && !cls(l).head && !cls(l).roundOff);
      delete merged.ledgers;
      if (!patch.charges) merged.charges = others.map((l) => ({ ledger: l.ledger, amount: l.debit || l.credit, ...((l.debit ? 'debit' : 'credit') === partySide ? { deduct: true } : {}) }));
      merged.taxes = patch.taxes ?? (before.ledgers.some((l) => cls(l).head) ? 'auto' : 'none');
      if (patch.roundOff === undefined && before.ledgers.some((l) => cls(l).roundOff)) merged.roundOff = 'auto';
      if (!patch.bills) {
        const pb = before.ledgers.find((l) => l.isParty)?.bills;
        if (pb && pb.length === 1 && pb[0].type === 'new') merged.bills = [{ type: 'new', ref: pb[0].ref, ...(pb[0].creditDays ? { creditDays: pb[0].creditDays } : {}) }];
        else delete merged.bills;
      }
    }
    const prepared = await prepare(ctx, merged, { action: 'Alter', identify, forAlter: true });
    ctx.policy.checkVoucher({ voucherType: prepared.plan.voucherType, baseType: prepared.plan.baseType, date: prepared.plan.date, total: prepared.plan.total !== undefined ? fromPaise(prepared.plan.total) : undefined }, 'voucher.update');
    await educationalCheck(ctx, prepared.plan);
    node = prepared.node;
    summary = prepared.summary;
    if (prepared.plan.forcedOptional && before.status === 'regular') {
      throw new TallyCliError('E_POLICY', 'This profile is in "optional" write mode, which would turn a regular voucher into an optional one.', { hint: 'Alter regular vouchers only with writeMode "on".' });
    }
  }
  if (input.dryRun) return dryRunResult(importData({ id: 'Vouchers', vars: { SVCURRENTCOMPANY: ctx.profile.company }, messages: [node] }), { summary, before });
  const result = await auditedImport(ctx, { op: 'voucher.update', id: 'Vouchers', messages: [node], input, summary: { ...summary, before }, expect: 'altered' });
  const after = await getVoucher(ctx, { masterId: before.masterId }).catch(() => null);
  if (after && before.total !== undefined && patch.items === undefined && patch.entries === undefined && Math.abs(after.total - before.total) > 0.005) {
    ctx.warn(`Total changed from ${before.total} to ${after.total} after the alter; check the voucher. "tally voucher undo --audit-seq ${result.auditSeq}" restores it.`);
  }
  return { altered: true, masterId: before.masterId, auditSeq: result.auditSeq, before, after, undo: `tally voucher undo --audit-seq ${result.auditSeq} --yes` };
}

export async function cancelVoucher(ctx, input) {
  const before = await loadForChange(ctx, input, 'voucher.cancel');
  if (before.status === 'cancelled') return { cancelled: false, message: 'Already cancelled.', masterId: before.masterId };
  const identify = await identifyFor(ctx, before);
  const node = buildVoucherAction('Cancel', identify, input.reason);
  if (input.dryRun) return dryRunResult(importData({ id: 'Vouchers', vars: { SVCURRENTCOMPANY: ctx.profile.company }, messages: [node] }), { before });
  const result = await auditedImport(ctx, { op: 'voucher.cancel', id: 'Vouchers', messages: [node], input, summary: { before }, expect: 'cancelled' });
  return { cancelled: true, masterId: before.masterId, number: before.number, auditSeq: result.auditSeq };
}

export async function deleteVoucher(ctx, input) {
  const before = await loadForChange(ctx, input, 'voucher.delete');
  const identify = await identifyFor(ctx, before);
  const node = buildVoucherAction('Delete', identify);
  if (input.dryRun) return dryRunResult(importData({ id: 'Vouchers', vars: { SVCURRENTCOMPANY: ctx.profile.company }, messages: [node] }), { before });
  const result = await auditedImport(ctx, { op: 'voucher.delete', id: 'Vouchers', messages: [node], input, summary: { before, ...(input._undoes ? { undoes: input._undoes } : {}) }, expect: 'deleted' });
  return { deleted: true, masterId: before.masterId, number: before.number, auditSeq: result.auditSeq, undo: `tally voucher undo --audit-seq ${result.auditSeq} --yes` };
}

/** Turn an optional voucher into a regular one (the approval step). Needs writeMode "on". */
export async function regulariseVoucher(ctx, input) {
  if (ctx.profile.writeMode !== 'on' && !input.dryRun) throw new TallyCliError('E_POLICY', 'Regularising puts a voucher into the books, which needs writeMode "on".', { hint: 'Or regularise it in Tally itself (open the voucher, Ctrl+L).' });
  if (!input.yes && !input.dryRun) throw new TallyCliError('E_POLICY', 'voucher.regularise needs --yes after reviewing the voucher.');
  const before = await getVoucher(ctx, input);
  if (before.status !== 'optional') return { regularised: false, message: `The voucher is ${before.status}, not optional.`, masterId: before.masterId };
  return updateVoucher(ctx, { masterId: before.masterId, optional: false, dryRun: input.dryRun, ifAlterId: input.ifAlterId });
}

/** Undo a write recorded in the audit log. */
export async function undoFromAudit(ctx, input) {
  const rec = ctx.audit.all().find((r) => r.seq === input.auditSeq);
  if (!rec) throw new TallyCliError('E_NOT_FOUND', `Audit record ${input.auditSeq} not found.`);
  if (rec.outcome !== 'ok') throw new TallyCliError('E_POLICY', `Audit record ${input.auditSeq} was not a successful write.`);
  const undoneBy = ctx.audit.all().find((r) => r.outcome === 'ok' && r.summary?.undoes === rec.seq);
  if (undoneBy) throw new TallyCliError('E_CONFLICT', `Audit record ${rec.seq} was already undone by record ${undoneBy.seq}.`);
  if (rec.profile !== ctx.profileName || norm(rec.company) !== norm(ctx.profile.company)) {
    throw new TallyCliError('E_POLICY', `Audit record ${rec.seq} belongs to profile "${rec.profile}" / company "${rec.company || '(active)'}"; run undo with that profile and company.`);
  }
  const before = rec.summary?.before;
  const op = rec.op;
  if (op === 'voucher.update' && before) {
    const current = await getVoucher(ctx, { masterId: before.masterId });
    const identify = await identifyFor(ctx, current);
    await checkExisting(ctx, current, 'voucher.undo');
    await checkExisting(ctx, before, 'voucher.undo');
    const prepared = await prepare(ctx, readToInput(before), { action: 'Alter', identify, forAlter: true });
    if (input.dryRun) return dryRunResult(prepared.xml, { restoring: before });
    const r = await auditedImport(ctx, { op: 'voucher.undo', id: 'Vouchers', messages: [prepared.node], input, summary: { undoes: rec.seq, before: current }, expect: 'altered' });
    return { undone: rec.seq, action: 'restored previous version', masterId: before.masterId, auditSeq: r.auditSeq };
  }
  if (op === 'voucher.delete' && before) {
    const inp = { ...readToInput(before), idempotencyKey: `undo:${ctx.scope}:${rec.seq}` };
    if (input.dryRun) return (await prepare(ctx, inp)).summary;
    const p = await prepare(ctx, inp);
    const out = await sendCreate(ctx, { input: inp, ...p, summary: { ...p.summary, undoes: rec.seq }, op: 'voucher.undo' });
    return { undone: rec.seq, action: 're-created the deleted voucher (it gets a new master id)', ...out };
  }
  if ((op.startsWith('voucher.create') || op.startsWith('post.') || op === 'voucher.commit') && rec.result?.lastVchId) {
    return deleteVoucher(ctx, { masterId: rec.result.lastVchId, yes: true, dryRun: input.dryRun, _undoes: rec.seq });
  }
  throw new TallyCliError('E_UNSUPPORTED', `Undo is not available for ${op}.`, { hint: 'Cancelled vouchers and master changes are undone in Tally itself.' });
}
