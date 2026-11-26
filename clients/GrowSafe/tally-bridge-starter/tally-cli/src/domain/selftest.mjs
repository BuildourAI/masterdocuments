/**
 * "tally selftest": probe the real Tally for every assumption the tool makes, record the results
 * (so the engine adapts), and print a table that can be pasted back to the integrator.
 *
 * Read-only by default. With --write it creates clearly labelled test masters and vouchers in the
 * target company, checks behaviour, then cancels/deletes them. Use a test company for that.
 */
import { TallyCliError } from '../core/errors.mjs';
import { ASSUMPTIONS, defaults, saveCapabilities } from '../core/capabilities.mjs';
import { exportData, commonVars, importData, exportObject } from '../core/envelope.mjs';
import { flatReport } from '../core/tdl.mjs';
import { parseXml, findAll, findFirst } from '../core/xml.mjs';
import { today, addDays, allowedInEducationalMode, daysInMonth } from '../core/dates.mjs';
import { listCompanies, probeLicence } from './company.mjs';
import { listVouchers, getVoucher } from './vouchers/read.mjs';
import { normaliseVoucher } from './vouchers/model.mjs';
import { buildVoucher, buildVoucherAction, buildHeaderAlter } from './vouchers/build.mjs';
import { masterXml, masterBody } from './masters.mjs';
import { norm, assertWriteTarget } from './common.mjs';
import { getMaster } from './masters.mjs';
import { outstanding, trialBalance, ledgerStatement } from './reports.mjs';
import { identifyFor } from './vouchers/post.mjs';
import { F } from '../core/tdl.mjs';

const TAG = 'ZZ Selftest';

export async function runSelftest(ctx, input) {
  const checks = [];
  const caps = { ...defaults(), ...ctx.caps };
  const add = (id, status, detail, value) => {
    checks.push({ check: id, status, detail });
    if (value !== undefined) caps[id] = value;
  };
  const time = async (fn) => {
    const t = Date.now();
    const r = await fn();
    return [r, Date.now() - t];
  };

  // ---- read probes
  let companies;
  try {
    companies = await listCompanies(ctx);
    add('connect', 'pass', `${companies.length} company(ies) open`);
  } catch (err) {
    add('connect', 'fail', err.message);
    return finish(ctx, checks, caps, input);
  }
  const lic = await probeLicence(ctx);
  add('product', lic.product ? 'pass' : 'warn', `${lic.product || 'unknown'}${lic.educationalMode ? ' (Educational mode)' : ''}`);
  caps.educational = !!lic.educationalMode;

  try {
    const spec = { collection: { type: 'Ledger' }, fields: [{ key: 'name', method: 'Name' }, { key: 'closing', method: 'ClosingBalance', type: 'amount' }] };
    const { tdl, name } = flatReport(spec);
    const xml = exportData({ id: name, vars: commonVars({ company: ctx.profile.company }), tdl });
    const [reply, ms] = await time(() => ctx.client.sendRaw(xml));
    const root = parseXml(reply.text);
    const rows = findAll(root, 'ROW').length;
    const f01 = findAll(root, 'F01').length;
    add('export.flatReport', f01 > 0 ? 'pass' : 'fail', `${f01} ledgers in ${ms} ms`, f01 > 0);
    add('export.rowWrapper', rows > 0 ? 'pass' : 'warn', rows > 0 ? 'rows wrapped in <ROW>' : 'no <ROW> wrapper; rows are split at the first field (handled)', rows > 0);
  } catch (err) {
    add('export.flatReport', 'fail', err.message, false);
  }

  try {
    const xml = exportData({ id: 'TCUtf8', vars: commonVars({ company: null }), tdl: flatReport({ name: 'TCUtf8', collection: { type: 'Company' }, fields: [{ key: 'v', expr: '"₹ टेस्ट"' }] }).tdl });
    const reply = await ctx.client.sendRaw(xml, { encoding: 'utf8' });
    const ok = reply.text.includes('₹ टेस्ट');
    add('encoding.utf8', ok ? 'pass' : 'warn', ok ? 'UTF-8 requests work' : 'UTF-8 request did not round-trip; UTF-16 stays in use', ok);
  } catch (err) {
    add('encoding.utf8', 'warn', `UTF-8 request failed (${err.message}); UTF-16 stays in use`, false);
  }

  let sample = null;
  try {
    const [res, ms] = await time(() => listVouchers(ctx, { from: addDays(today(), -31), to: today(), status: 'all' }));
    sample = res.vouchers[res.vouchers.length - 1] || null;
    add('vouchers.month', 'pass', `${res.count} vouchers in the last 31 days read in ${ms} ms`);
  } catch (err) {
    add('vouchers.month', 'fail', err.message);
  }
  if (sample) {
    try {
      const v = await getVoucher(ctx, { masterId: sample.masterId, date: sample.date });
      add('voucher.get', 'pass', `${v.voucherType} ${v.number || ''} total ${v.total}`);
    } catch (err) {
      add('voucher.get', 'fail', err.message);
    }
    try {
      const xml = exportObject({ subtype: 'Voucher', id: sample.masterId, idType: 'MasterID', vars: commonVars({ company: ctx.profile.company }) });
      const reply = await ctx.client.sendRaw(xml);
      const ok = !!findFirst(parseXml(reply.text), 'VOUCHER');
      add('export.voucherObject', ok ? 'pass' : 'warn', ok ? 'Object export by master id works' : 'not supported (collections are used instead)', ok);
    } catch (err) {
      add('export.voucherObject', 'warn', `not supported (${err.message.slice(0, 80)})`, false);
    }
  }
  try {
    const tb = await ctx.client.report('Trial Balance', { to: today() });
    const n = findAll(tb, 'DSPACCNAME').length;
    add('builtin.trialBalance', n ? 'pass' : 'warn', n ? `${n} groups in Tally's own Trial Balance` : 'unexpected shape (curated reports do not depend on it)');
  } catch (err) {
    add('builtin.trialBalance', 'warn', `built-in report export failed: ${err.message.slice(0, 100)}`);
  }

  // Read-only accounting invariants: the curated reports must agree with Tally's own balances.
  try {
    const tb = await trialBalance(ctx, { level: 'group' });
    add('invariant.trialBalance', Math.abs(tb.totals.difference) < 1 ? 'pass' : 'warn', `ledger closing balances plus opening stock differ by ${tb.totals.difference}${Math.abs(tb.totals.difference) < 1 ? '' : ' (compare with Tally\'s trial balance)'}`);
  } catch (err) {
    add('invariant.trialBalance', 'fail', err.message);
  }
  try {
    const r = await outstanding(ctx, 'receivable', { asOf: today() });
    const ledgers = await ctx.client.rows({ collection: { type: 'Ledger', filters: ['$$IsLedOfGrp:$Name:"Sundry Debtors"'] }, fields: [{ key: 'name', method: 'Name' }, { key: 'closing', method: 'ClosingBalance', type: 'amount' }, { key: 'billWise', method: 'IsBillWiseOn', type: 'logical' }] }, { to: today() });
    const mismatches = r.parties.filter((p) => {
      const l = ledgers.find((x) => norm(x.name) === norm(p.party));
      return l && l.billWise && Math.abs(-l.closing - p.total) >= 1;
    });
    add('invariant.receivables', mismatches.length ? 'warn' : 'pass', mismatches.length ? `${mismatches.length} party(ies) where pending bills differ from the ledger balance, e.g. ${mismatches[0].party} (often bills without references in Tally)` : `pending bills match ledger balances for ${r.parties.length} parties`);
  } catch (err) {
    add('invariant.receivables', 'fail', err.message);
  }
  try {
    const bank = await ctx.client.rows({ collection: { type: 'Ledger', filters: ['$$IsLedOfGrp:$Name:"Cash-in-Hand"'] }, fields: [{ key: 'name', method: 'Name' }, { key: 'closing', method: 'ClosingBalance', type: 'amount' }] }, { to: today() });
    if (bank.length) {
      const st = await ledgerStatement(ctx, { ledger: bank[0].name, to: today() });
      const closing = st.closing.side === 'Dr' ? -st.closing.amount : st.closing.amount;
      add('invariant.ledgerStatement', Math.abs(closing - bank[0].closing) < 1 ? 'pass' : 'fail', `statement of "${bank[0].name}" closes at ${closing}, Tally's balance ${bank[0].closing}`);
    }
  } catch (err) {
    add('invariant.ledgerStatement', 'fail', err.message);
  }
  try {
    const recent = await listVouchers(ctx, { from: addDays(today(), -120), to: today(), type: 'Sales', status: 'regular' });
    let probed = false;
    for (const v of recent.vouchers.slice(-10).reverse()) {
      const inv = await ctx.client.rows({ collection: { type: 'Voucher', route: ['AllInventoryEntries'], filters: [F.masterId(v.masterId)] }, fields: [{ key: 'item', method: 'StockItemName' }] }, { from: v.date, to: v.date });
      if (!inv.length) continue;
      const rows = await ctx.client.rows({ collection: { type: 'Voucher', route: ['AllLedgerEntries'], filters: [F.masterId(v.masterId)] }, fields: [{ key: 'amount', method: 'Amount', type: 'amount' }] }, { from: v.date, to: v.date });
      const balanced = rows.length > 1 && Math.abs(rows.reduce((t, x) => t + x.amount, 0)) < 0.005;
      add('entries.includeInventoryAllocations', balanced ? 'pass' : 'warn', balanced ? `item invoice ${v.number || v.masterId}: entries include the sales ledger and balance` : `item invoice ${v.number || v.masterId}: entries do not balance without item allocations (report this)`, balanced);
      probed = true;
      break;
    }
    if (!probed) add('entries.includeInventoryAllocations', 'warn', 'no recent item invoice to check (the write self-test checks it)');
  } catch (err) {
    add('entries.includeInventoryAllocations', 'warn', `could not check: ${err.message}`);
  }
  if (companies.length < 2) add('import.companyHonoured', 'warn', 'not tested (needs two open companies); every write names its company and the pinned company is checked before writing');

  if (input.write) await writeProbes(ctx, input, add, caps, companies);
  return finish(ctx, checks, caps, input);
}

function finish(ctx, checks, caps, input) {
  const values = Object.fromEntries(ASSUMPTIONS.map((a) => [a.id, caps[a.id]]));
  values.educational = caps.educational;
  if (!input.noSave) saveCapabilities(ctx.state, ctx.scope, values, checks);
  const fails = checks.filter((c) => c.status === 'fail').length;
  return {
    ok: fails === 0,
    fails,
    warnings: checks.filter((c) => c.status === 'warn').length,
    profile: ctx.profileName,
    company: ctx.profile.company,
    at: new Date().toISOString(),
    checks,
    capabilities: values,
    note: 'Paste this output back to your integrator. Results are saved and used by the tool on this PC.',
  };
}

/** Pick a test date the company and the licence accept. */
function testDate(educational) {
  const t = today();
  if (!educational || allowedInEducationalMode(t)) return t;
  const [y, m] = t.split('-').map(Number);
  return `${y}-${String(m).padStart(2, '0')}-01`;
}

async function writeProbes(ctx, input, add, caps, companies) {
  const target = ctx.profile.company || companies.find((c) => c.active)?.name;
  if (!input.confirmCompany || norm(input.confirmCompany) !== norm(target)) {
    throw new TallyCliError('E_POLICY', `Write tests change data in "${target}". Repeat with --confirm-company "${target}" (use a test company).`);
  }
  ctx.policy.assertMasterWrites('selftest --write');
  if (ctx.profile.writeMode !== 'on' || !ctx.profile.allowDestructive) {
    throw new TallyCliError('E_POLICY', 'Write tests need writeMode "on" and allowDestructive: true (they clean up after themselves).', { hint: 'Use a profile for a test company with those settings.' });
  }
  await assertWriteTarget(ctx);
  const imp = async (id, messages) => {
    const r = await ctx.client.importMessages(id, messages);
    ctx.audit.append({ op: 'selftest.write', profile: ctx.profileName, company: ctx.profile.company, frontend: ctx.frontend, outcome: r.ok ? 'ok' : 'rejected', result: { created: r.created, altered: r.altered, deleted: r.deleted, cancelled: r.cancelled, errors: r.errors, lastVchId: r.lastVchId, lineErrors: r.lineErrors }, request: r.request, reply: r.reply });
    return r;
  };
  const refresh = () => {
    ctx.invalidate('refdata');
    ctx.invalidate('names:');
    ctx.invalidate('vouchertypes');
  };
  const party = `${TAG} Party`;
  const income = `${TAG} Income`;
  const unit = 'ZZS';
  const item = `${TAG} Item`;
  const gstin = '27AAPFU0939F1ZV';
  const date = testDate(caps.educational);
  const created = []; // {masterId, date}
  const masters = { ledgers: [], items: [], units: [] };
  const step = async (id, fn) => {
    try {
      await fn();
    } catch (err) {
      add(id, 'fail', err.message);
    }
  };
  try {
    // Masters: a bill-wise party with a GSTIN, an income ledger, a unit and an item
    await step('import.masters', async () => {
      const r1 = await imp('All Masters', [
        masterXml('ledger', 'Create', { name: party, body: masterBody('ledger', { group: 'Sundry Debtors', billWise: true, creditDays: 30, gstin, state: 'Maharashtra' }, { isCreate: true, tagStyle: ctx.profile.tagStyle || 'both' }) }),
        masterXml('ledger', 'Create', { name: income, body: masterBody('ledger', { group: 'Indirect Incomes' }, { isCreate: true }) }),
        masterXml('unit', 'Create', { name: unit, body: masterBody('unit', { formalName: 'Selftest units', decimals: 0 }, { isCreate: true }) }),
      ]);
      if (r1.created >= 2) masters.ledgers.push(party, income);
      if (r1.created === 3) masters.units.push(unit);
      const r2 = await imp('All Masters', [masterXml('item', 'Create', { name: item, body: masterBody('item', { unit }, { isCreate: true }) })]);
      if (r2.created === 1) masters.items.push(item);
      refresh();
      const back = await getMaster(ctx, 'ledger', party);
      const ok = r1.created === 3 && r2.created === 1 && back.gstin === gstin && back.billWise;
      add('import.masters', ok ? 'pass' : 'fail', `created ${r1.created + r2.created} of 4 masters; party GSTIN read back "${back.gstin}", bill-wise ${back.billWise}${r1.lineErrors.length ? '; ' + r1.lineErrors.join('; ') : ''}`);
    });

    const post = async (voucher, opts = {}) => {
      const plan = await normaliseVoucher(ctx, voucher);
      const r = await imp('Vouchers', [buildVoucher(plan, { remoteId: opts.remoteId })]);
      if (r.lastVchId) created.push({ masterId: r.lastVchId, date: plan.date });
      return r;
    };
    const journal = (narration, opts = {}) => ({ kind: 'journal', date, narration, optional: !!opts.optional, entries: [{ ledger: party, debit: 1, bills: [{ type: 'new', ref: `${TAG} ${narration}` }] }, { ledger: income, credit: 1 }] });

    // Plain journal and addressing by master id
    let mid = null;
    await step('import.voucher', async () => {
      const r = await post(journal('create'));
      mid = r.lastVchId;
      add('import.voucher', r.created === 1 ? 'pass' : 'fail', `created ${r.created}, last voucher id ${mid}${r.lineErrors.length ? ', ' + r.lineErrors.join('; ') : ''}`);
      if (!mid) add('import.lastVchId', 'warn', 'LASTVCHID not returned; vouchers are found by date and amount instead');
    });
    if (mid) {
      await step('import.tagMasterId', async () => {
        for (const tagName of ['MASTER ID', 'MasterId']) {
          const node = buildHeaderAlter({ date, tagName, tagValue: String(mid), voucherType: 'Journal' }, { narration: `${TAG} altered via ${tagName}` });
          const r = await imp('Vouchers', [node]).catch((e) => ({ altered: 0, lineErrors: [e.message] }));
          if (r.altered === 1) {
            add('import.tagMasterId', 'pass', `TAGNAME "${tagName}" addresses vouchers`, tagName);
            return;
          }
        }
        add('import.tagMasterId', 'warn', 'neither "MASTER ID" nor "MasterId" worked; vouchers are addressed by number', 'MASTER ID');
      });
      await step('import.alterKeepsLists', async () => {
        const v = await getVoucher(ctx, { masterId: mid, date }).catch(() => null);
        const kept = v && (v.entries || v.ledgers || []).length >= 2;
        add('import.alterKeepsLists', kept ? 'pass' : 'warn', kept ? 'header-only alter kept the entries' : 'header-only alter dropped entries; alters always send the full voucher', !!kept);
      });
    }

    // Item invoice with a bill reference, read back in full
    const billRef = `${TAG} INV-1`;
    await step('invoice', async () => {
      if (!masters.items.length) throw new Error('test item was not created');
      const r = await post({ kind: 'sales', date, party, number: billRef, salesLedger: income, items: [{ item, qty: 3, rate: 100.5 }], taxes: 'none' });
      if (r.created !== 1) throw new Error(`not created: ${r.lineErrors.join('; ')}`);
      const v = await getVoucher(ctx, { masterId: r.lastVchId || undefined, number: r.lastVchId ? undefined : billRef, type: r.lastVchId ? undefined : 'Sales', date });
      const bills = await outstanding(ctx, 'receivable', { party, asOf: date });
      const bill = bills.bills.find((b) => b.ref === billRef);
      const ok = v.total === 301.5 && v.items?.length === 1 && v.items[0].qty === 3 && bill && bill.amount === 301.5;
      add('invoice', ok ? 'pass' : 'fail', `total ${v.total} (expected 301.5), items ${v.items?.length}, pending bill ${bill ? bill.amount : 'missing'}`);
      // Does AllLedgerEntries carry the sales ledger of the items? (every total and register depends on it)
      const rows = await ctx.client.rows({ collection: { type: 'Voucher', route: ['AllLedgerEntries'], filters: [F.masterId(v.masterId)] }, fields: [{ key: 'ledger', method: 'LedgerName' }, { key: 'amount', method: 'Amount', type: 'amount' }] }, { from: date, to: date });
      const balanced = Math.abs(rows.reduce((t, x) => t + x.amount, 0)) < 0.005 && rows.some((x) => norm(x.ledger) === norm(income));
      add('entries.includeInventoryAllocations', balanced ? 'pass' : 'warn', balanced ? 'invoice entries include the sales ledger and balance' : 'invoice entries do not include item allocations; totals use party lines (report this)', balanced);
    });

    // Receipt against that bill, then cancel it
    await step('receipt', async () => {
      const r = await post({ kind: 'receipt', date, party, entries: [{ ledger: 'Cash', debit: 301.5 }, { ledger: party, credit: 301.5, bills: [{ type: 'against', ref: billRef }] }] });
      if (r.created !== 1) throw new Error(`not created: ${r.lineErrors.join('; ')}`);
      const bills = await outstanding(ctx, 'receivable', { party, asOf: date });
      const settled = !bills.bills.some((b) => b.ref === billRef);
      add('receipt', settled ? 'pass' : 'fail', settled ? 'receipt settled the bill' : 'bill still pending after the receipt');
      const v = await getVoucher(ctx, { masterId: r.lastVchId, date });
      const c = await imp('Vouchers', [buildVoucherAction('Cancel', await identifyFor(ctx, v), 'selftest')]);
      const after = await getVoucher(ctx, { masterId: r.lastVchId, date });
      add('cancel', c.cancelled === 1 && after.status === 'cancelled' ? 'pass' : 'fail', `cancelled ${c.cancelled}, status ${after.status}`);
    });

    // REMOTEID upsert
    await step('import.remoteIdUpsert', async () => {
      const rid = `tc-selftest-${Date.now().toString(36)}`;
      await post(journal('remoteid-1'), { remoteId: rid });
      const b = await post(journal('remoteid-2'), { remoteId: rid }).catch((e) => ({ created: 0, altered: 0, lineErrors: [e.message] }));
      const upsert = b.altered === 1 && b.created === 0;
      add('import.remoteIdUpsert', upsert ? 'pass' : 'warn', upsert ? 'same REMOTEID alters instead of duplicating' : `same REMOTEID ${b.created ? 'created a duplicate' : 'was not accepted'}; duplicates are prevented locally instead`, upsert);
    });

    // Optional vouchers stay out of balances
    await step('import.optionalStaysOut', async () => {
      const before = await ledgerBalance(ctx, income, date);
      await post(journal('optional', { optional: true }));
      const after = await ledgerBalance(ctx, income, date);
      const out = Math.abs(after - before) < 0.005;
      add('import.optionalStaysOut', out ? 'pass' : 'fail', out ? 'optional voucher did not change balances' : 'optional voucher changed balances: do not rely on "optional" mode', out);
    });
  } finally {
    // Clean up: delete test vouchers (addressed the documented way where possible), then masters
    let left = 0;
    for (const c of created) {
      try {
        const v = await getVoucher(ctx, { masterId: c.masterId, date: c.date });
        const r = await imp('Vouchers', [buildVoucherAction('Delete', await identifyFor(ctx, v))]);
        if (r.deleted !== 1) left++;
      } catch {
        left++;
      }
    }
    const del = [...masters.items.map((n) => masterXml('item', 'Delete', { name: n })), ...masters.units.map((n) => masterXml('unit', 'Delete', { name: n })), ...masters.ledgers.map((n) => masterXml('ledger', 'Delete', { name: n }))];
    let deleted = 0;
    for (const node of del) {
      const r = await imp('All Masters', [node]).catch(() => ({ deleted: 0 }));
      deleted += r.deleted || 0;
    }
    refresh();
    const clean = left === 0 && deleted === del.length;
    add('cleanup', clean ? 'pass' : 'warn', clean ? 'test records removed' : `${left} test voucher(s) and ${del.length - deleted} master(s) could not be removed; delete records starting "${TAG}" (and unit ${unit}) by hand`);
  }
}

async function ledgerBalance(ctx, name, date) {
  const rows = await ctx.client.rows({ collection: { type: 'Ledger', filters: [`$$IsEqual:$Name:"${name}"`] }, fields: [{ key: 'b', method: 'ClosingBalance', type: 'amount' }] }, { to: date });
  return rows.length ? rows[0].b : 0;
}

export { daysInMonth, importData };
