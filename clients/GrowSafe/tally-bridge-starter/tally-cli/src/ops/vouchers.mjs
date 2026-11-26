/**
 * Voucher write operations and data-entry shortcuts.
 */
import { defineOp, WRITE_PARAMS, DESTRUCTIVE_PARAMS } from './registry.mjs';
import { postVoucher, prepare, preparePlan, commitPlan, listPlans, updateVoucher, cancelVoucher, deleteVoucher, regulariseVoucher, undoFromAudit, summarisePlan } from '../domain/vouchers/post.mjs';
import { KIND_NAMES, KINDS } from '../domain/vouchers/kinds.mjs';
import { outstanding } from '../domain/reports.mjs';
import { getMaster } from '../domain/masters.mjs';
import { TallyCliError } from '../core/errors.mjs';
import { toPaise, fromPaise } from '../core/amounts.mjs';
import { today } from '../core/dates.mjs';
import { exportCollection, commonVars } from '../core/envelope.mjs';
import { parseXml, findFirst, elementChildren, childText, el, tag, cleanText, textOf } from '../core/xml.mjs';
import { checkExportReply } from '../core/client.mjs';
import { norm } from '../domain/common.mjs';
import { F } from '../core/tdl.mjs';
import { wholePeriod } from '../domain/vouchers/read.mjs';

const VOUCHER_DESC =
  'Voucher JSON (see docs/VOUCHERS.md). Accounting kinds use "entries": [{"ledger", "debit"|"credit", "bills", "bank", "costCentres"}]. Invoice kinds use "party", "items": [{"item", "qty", "rate", "ledger", "godown"}], optional "charges", "taxes" ("auto" | "none" | list), "roundOff", "bills", "expectedTotal". Stock journals use "consumed" and "produced".';

defineOp({
  id: 'voucher.create',
  kind: 'write',
  summary: 'Create any voucher from JSON (all kinds and custom voucher types). Validates everything first; --dry-run shows the XML.',
  description: VOUCHER_DESC,
  input: { properties: { voucher: { type: 'object', description: VOUCHER_DESC }, ...WRITE_PARAMS }, required: ['voucher'] },
  inputKey: 'voucher',
  examples: ['voucher create --input sales-invoice.json --dry-run', 'voucher create --input receipt.json --idempotency-key bank-txn-88213'],
  run: (ctx, i) => postVoucher(ctx, { ...i.voucher, idempotencyKey: i.idempotencyKey || i.voucher.idempotencyKey, forceResend: i.forceResend || i.voucher.forceResend, dryRun: i.dryRun }, { op: 'voucher.create' }),
});

defineOp({
  id: 'voucher.validate',
  kind: 'read',
  summary: 'Check a voucher JSON against Tally (names, totals, bills, GST) and show the computed result, without writing.',
  input: { properties: { voucher: { type: 'object', description: VOUCHER_DESC } }, required: ['voucher'] },
  inputKey: 'voucher',
  examples: ['voucher validate --input invoice.json'],
  run: async (ctx, i) => {
    const p = await prepare(ctx, i.voucher);
    return { valid: true, summary: p.summary };
  },
});

defineOp({
  id: 'voucher.prepare',
  kind: 'read',
  summary: 'Validate a voucher and store it as a plan for approval; "voucher commit" posts exactly that plan.',
  input: { properties: { voucher: { type: 'object', description: VOUCHER_DESC } }, required: ['voucher'] },
  inputKey: 'voucher',
  examples: ['voucher prepare --input invoice.json'],
  run: (ctx, i) => preparePlan(ctx, i.voucher),
});

defineOp({
  id: 'voucher.commit',
  kind: 'write',
  summary: 'Post a prepared plan (after a person or system approved it). Safe to repeat.',
  input: { properties: { planId: { type: 'string' }, forceResend: { type: 'boolean', description: 'Only after checking in Tally that an earlier commit of this plan really did not arrive.' } }, required: ['planId'] },
  positional: ['planId'],
  examples: ['voucher commit --plan-id p1abc23'],
  run: (ctx, i) => commitPlan(ctx, i),
});

defineOp({
  id: 'voucher.plans',
  kind: 'local',
  summary: 'List prepared plans and whether they were committed.',
  run: async (ctx) => listPlans(ctx),
});

const IDENT = {
  masterId: { type: 'integer', description: 'Master id of the voucher (from voucher list / get).' },
  guid: { type: 'string' },
  number: { type: 'string', description: 'Voucher number (with --type, optionally --date).' },
  type: { type: 'string' },
  date: { type: 'date' },
  ifAlterId: { type: 'integer', description: 'Refuse if the voucher changed since you read it (its alterId).' },
};

defineOp({
  id: 'voucher.update',
  kind: 'destructive',
  summary: 'Alter an existing voucher (narration, reference, date, or any fields via --input). Keeps a before-image for undo.',
  input: {
    properties: {
      ...IDENT,
      narration: { type: 'string' },
      reference: { type: 'string' },
      newDate: { type: 'date' },
      changes: { type: 'object', description: 'Any voucher fields to replace (same shape as voucher create), e.g. {"items": [...]} or {"entries": [...]}.' },
      ...DESTRUCTIVE_PARAMS,
    },
  },
  inputKey: 'changes',
  examples: ['voucher update --master-id 245 --narration "Corrected narration" --yes', 'voucher update --master-id 245 --input changes.json --dry-run'],
  run: (ctx, i) => updateVoucher(ctx, i),
});

defineOp({
  id: 'voucher.cancel',
  kind: 'destructive',
  summary: 'Cancel a voucher (it stays in Tally marked cancelled, amounts removed). Preferred over delete.',
  input: { properties: { ...IDENT, reason: { type: 'string', description: 'Narration recorded on the cancelled voucher.' }, ...DESTRUCTIVE_PARAMS } },
  examples: ['voucher cancel --master-id 245 --reason "Duplicate entry" --yes'],
  run: (ctx, i) => cancelVoucher(ctx, i),
});

defineOp({
  id: 'voucher.delete',
  kind: 'destructive',
  summary: 'Delete a voucher permanently (the audit log keeps a copy for undo).',
  input: { properties: { ...IDENT, ...DESTRUCTIVE_PARAMS } },
  examples: ['voucher delete --master-id 245 --yes'],
  run: (ctx, i) => deleteVoucher(ctx, i),
});

defineOp({
  id: 'voucher.regularise',
  kind: 'write',
  summary: 'Turn an optional voucher into a regular one (puts it into the books). Needs writeMode "on" and --yes.',
  input: { properties: { ...IDENT, yes: { type: 'boolean' }, dryRun: { type: 'boolean' } } },
  examples: ['voucher regularise --master-id 245 --yes'],
  run: (ctx, i) => regulariseVoucher(ctx, i),
});

defineOp({
  id: 'voucher.undo',
  kind: 'destructive',
  summary: 'Undo a write from the audit log: restore an altered voucher, re-create a deleted one, or delete a created one.',
  input: { properties: { auditSeq: { type: 'integer', description: 'Sequence number from the audit log (shown in every write result).' }, ...DESTRUCTIVE_PARAMS }, required: ['auditSeq'] },
  examples: ['voucher undo --audit-seq 17 --yes'],
  run: (ctx, i) => undoFromAudit(ctx, i),
});

// ---------- templates ----------

const SKIP_TEMPLATE_TAGS = new Set(['DATE', 'EFFECTIVEDATE', 'GUID', 'MASTERID', 'ALTERID', 'VOUCHERNUMBER', 'VOUCHERTYPENAME', 'PARTYLEDGERNAME', 'PARTYNAME', 'BASICBUYERNAME', 'NARRATION', 'REFERENCE', 'REFERENCEDATE', 'ISOPTIONAL', 'ISCANCELLED', 'ISINVOICE', 'PERSISTEDVIEW', 'PLACEOFSUPPLY', 'REMOTEID', 'VOUCHERKEY', 'ALTEREDBY', 'ENTEREDBY', 'IRN', 'IRNACKNO', 'IRNACKDATE', 'IRNQRCODE', 'EWAYBILLNO', 'PARTYGSTIN', 'CONSIGNEEGSTIN', 'BUYERADDRESS', 'BASICBUYERADDRESS']);

defineOp({
  id: 'voucher.template.capture',
  kind: 'write',
  summary: 'Learn site-specific voucher tags (GST class, registration, etc.) from a correct voucher made in Tally; later vouchers of that type include them.',
  input: { properties: { masterId: { type: 'integer' }, date: { type: 'date' }, include: { type: 'array', items: { type: 'string' }, description: 'Only these tags.' } }, required: ['masterId'] },
  examples: ['voucher template capture --master-id 245'],
  run: async (ctx, i) => {
    const per = i.date ? { from: i.date, to: i.date } : await wholePeriod(ctx);
    const tdl = [el('COLLECTION', { NAME: 'TCTpl' }, tag('TYPE', 'Voucher'), tag('NATIVEMETHOD', '*'), tag('FILTER', 'TCTplF')), el('SYSTEM', { TYPE: 'Formulae', NAME: 'TCTplF' }, F.masterId(i.masterId))];
    const reply = await ctx.client.sendRaw(exportCollection({ id: 'TCTpl', vars: commonVars({ company: ctx.profile.company, from: per.from, to: per.to }), tdl }));
    const root = parseXml(reply.text);
    checkExportReply(root);
    const v = findFirst(root, 'VOUCHER');
    if (!v) throw new TallyCliError('E_NOT_FOUND', `Voucher ${i.masterId} not found.`);
    const vtype = childText(v, 'VOUCHERTYPENAME') || v.attrs.VCHTYPE;
    const tags = {};
    for (const c of elementChildren(v)) {
      const n = c.name.toUpperCase();
      if (n.endsWith('.LIST') || elementChildren(c).length || SKIP_TEMPLATE_TAGS.has(n)) continue;
      if (i.include && !i.include.map((x) => x.toUpperCase()).includes(n)) continue;
      const val = textOf(c).trim();
      if (val === '') continue;
      tags[n] = val;
    }
    ctx.state.update('templates.json', (all) => {
      all[ctx.scope] = all[ctx.scope] || {};
      all[ctx.scope][norm(vtype)] = { voucher: tags, from: i.masterId, at: new Date().toISOString() };
      return all;
    });
    return { voucherType: vtype, captured: Object.keys(tags).length, tags: Object.fromEntries(Object.entries(tags).map(([k, val]) => [k, cleanText(val)])) };
  },
});

defineOp({
  id: 'voucher.template.list',
  kind: 'local',
  summary: 'Show captured voucher templates for this profile and company.',
  run: async (ctx) => Object.entries(ctx.state.read('templates.json', {})[ctx.scope] || {}).map(([type, t]) => ({ voucherType: type, tags: Object.keys(t.voucher || {}).length, from: t.from, at: t.at })),
});

defineOp({
  id: 'voucher.template.delete',
  kind: 'local',
  summary: 'Remove a captured voucher template.',
  input: { properties: { voucherType: { type: 'string' } }, required: ['voucherType'] },
  positional: ['voucherType'],
  run: async (ctx, i) => {
    let removed = false;
    ctx.state.update('templates.json', (all) => {
      if (all[ctx.scope] && all[ctx.scope][norm(i.voucherType)]) {
        delete all[ctx.scope][norm(i.voucherType)];
        removed = true;
      }
      return all;
    });
    return { removed };
  },
});

// ---------- data-entry shortcuts ----------

const SETTLE = {
  against: { type: 'array', items: { type: 'string' }, description: 'Bills to settle: "REF" or "REF:amount" (repeatable or comma separated).' },
  onAccount: { type: 'boolean', description: 'Do not settle specific bills (amount stays on account).' },
  advance: { type: 'string', description: 'Record as an advance with this reference.' },
  autoAllocate: { type: 'boolean', description: 'Settle the oldest pending bills first; any remainder goes on account.' },
};
const BANK = {
  mode: { type: 'string', description: 'cheque | neft | rtgs | imps | upi | others | cash' },
  instrumentNumber: { type: 'string', description: 'Cheque number or UTR.' },
  instrumentDate: { type: 'date' },
  upiId: { type: 'string' },
};
const COMMON = {
  date: { type: 'date', description: 'Voucher date (default today).' },
  number: { type: 'string', description: 'Voucher number (default: Tally numbering).' },
  reference: { type: 'string' },
  narration: { type: 'string' },
  voucherType: { type: 'string', description: 'A custom voucher type of this kind (default: the standard one).' },
  optional: { type: 'boolean', description: 'Create as an optional voucher (kept out of the books until regularised).' },
};

async function settlement(ctx, party, amountPaise, i, kind) {
  const info = await getMaster(ctx, 'ledger', party);
  if (!info.billWise) return { party: info.name, bills: undefined };
  if (i.onAccount) return { party: info.name, bills: 'on-account' };
  if (i.advance) return { party: info.name, bills: [{ type: 'advance', ref: i.advance, amount: fromPaise(amountPaise) }] };
  if (i.against && i.against.length) {
    const bills = i.against.map((a) => {
      const [ref, amt] = String(a).split(':');
      return { type: 'against', ref: ref.trim(), amount: amt !== undefined ? Number(amt) : undefined };
    });
    if (bills.length === 1 && bills[0].amount === undefined) bills[0].amount = fromPaise(amountPaise);
    if (bills.some((b) => b.amount === undefined)) throw new TallyCliError('E_INPUT', 'With several bills, give each amount as "REF:amount".');
    const sum = bills.reduce((s, b) => s + toPaise(b.amount), 0);
    if (sum < amountPaise) bills.push({ type: 'on-account', ref: '', amount: fromPaise(amountPaise - sum) });
    return { party: info.name, bills };
  }
  if (i.autoAllocate) {
    const out = await outstanding(ctx, kind === 'receipt' ? 'receivable' : 'payable', { party: info.name });
    let left = amountPaise;
    const bills = [];
    for (const b of out.bills.filter((x) => x.amount > 0).sort((a, b) => (a.date || '').localeCompare(b.date || ''))) {
      if (left <= 0) break;
      const take = Math.min(left, toPaise(b.amount));
      bills.push({ type: 'against', ref: b.ref, amount: fromPaise(take) });
      left -= take;
    }
    if (left > 0) bills.push({ type: 'on-account', ref: '', amount: fromPaise(left) });
    return { party: info.name, bills };
  }
  throw new TallyCliError('E_INPUT', `"${info.name}" keeps bill-wise details: say which bills this settles.`, { hint: 'Use --against REF (or REF:amount,...), --auto-allocate (oldest first), --advance REF, or --on-account. "tally party bills <party>" lists pending bills.' });
}

function bankLedger(ctx, i) {
  const b = i.bank || ctx.profile.defaultBankLedger;
  if (!b) throw new TallyCliError('E_INPUT', 'Which bank or cash ledger? Pass --bank "<ledger>" (or set defaultBankLedger in the profile).');
  return b;
}

for (const kind of ['receipt', 'payment']) {
  defineOp({
    id: `post.${kind}`,
    kind: 'write',
    summary: kind === 'receipt' ? 'Record money received from a party into a bank/cash ledger, settling bills.' : 'Record money paid to a party (or an expense ledger) from a bank/cash ledger, settling bills.',
    input: {
      properties: {
        party: { type: 'string', description: kind === 'receipt' ? 'Customer (or any ledger) the money came from.' : 'Supplier, expense or any ledger paid.' },
        amount: { type: 'number' },
        bank: { type: 'string', description: 'Bank or cash ledger.' },
        ...SETTLE,
        ...BANK,
        ...COMMON,
        ...WRITE_PARAMS,
      },
      required: ['party', 'amount'],
    },
    examples:
      kind === 'receipt'
        ? ['post receipt --party "Alpha Hardware Stores" --amount 11800 --bank "Bank of Example - Current A/c" --mode neft --instrument-number UTR123 --against SI/26-27/0012', 'post receipt --party "Alpha Hardware Stores" --amount 50000 --bank Cash --auto-allocate --dry-run']
        : ['post payment --party "Prime Cables Ltd" --amount 97562 --bank "Bank of Example - Current A/c" --against PRI-8536 --mode neft --instrument-number UTR555'],
    run: async (ctx, i) => {
      const paise = toPaise(i.amount, { field: 'amount' });
      const bank = bankLedger(ctx, i);
      const s = await settlement(ctx, i.party, paise, i, kind);
      const bankEntry = { ledger: bank, [kind === 'receipt' ? 'debit' : 'credit']: i.amount, ...(i.mode || i.instrumentNumber ? { bank: { mode: i.mode || 'others', instrumentNumber: i.instrumentNumber, instrumentDate: i.instrumentDate, upiId: i.upiId } } : {}) };
      const partyEntry = { ledger: s.party, [kind === 'receipt' ? 'credit' : 'debit']: i.amount, ...(s.bills ? { bills: s.bills } : {}) };
      const voucher = { kind, voucherType: i.voucherType, date: i.date || today(), number: i.number, reference: i.reference, narration: i.narration, party: s.party, optional: i.optional, entries: kind === 'receipt' ? [bankEntry, partyEntry] : [partyEntry, bankEntry] };
      return postVoucher(ctx, { ...voucher, idempotencyKey: i.idempotencyKey, forceResend: i.forceResend, dryRun: i.dryRun }, { op: `post.${kind}`, requestInput: i });
    },
  });
}

defineOp({
  id: 'post.contra',
  kind: 'write',
  summary: 'Move money between cash and bank ledgers (deposit, withdrawal, transfer).',
  input: { properties: { from: { type: 'string', description: 'Ledger the money leaves (credited).' }, to: { type: 'string', description: 'Ledger the money goes to (debited).' }, amount: { type: 'number' }, ...BANK, ...COMMON, ...WRITE_PARAMS }, required: ['from', 'to', 'amount'] },
  examples: ['post contra --from "Bank of Example - Current A/c" --to Cash --amount 20000 --narration "Cash withdrawn"'],
  run: (ctx, i) =>
    postVoucher(ctx, { kind: 'contra', voucherType: i.voucherType, date: i.date || today(), number: i.number, reference: i.reference, narration: i.narration, optional: i.optional, entries: [{ ledger: i.to, debit: i.amount }, { ledger: i.from, credit: i.amount, ...(i.mode || i.instrumentNumber ? { bank: { mode: i.mode || 'others', instrumentNumber: i.instrumentNumber, instrumentDate: i.instrumentDate } } : {}) }], idempotencyKey: i.idempotencyKey, forceResend: i.forceResend, dryRun: i.dryRun }, { op: 'post.contra' }),
});

defineOp({
  id: 'post.journal',
  kind: 'write',
  summary: 'Journal entry: one debit and one credit ledger with --debit/--credit/--amount, or many lines with --input.',
  input: {
    properties: {
      debit: { type: 'string', description: 'Ledger to debit.' },
      credit: { type: 'string', description: 'Ledger to credit.' },
      amount: { type: 'number' },
      entries: { type: 'array', description: 'Lines [{ledger, debit|credit, bills?, costCentres?}] for multi-line journals.' },
      ...COMMON,
      ...WRITE_PARAMS,
    },
  },
  examples: ['post journal --debit "Salaries" --credit "Second Bank - OD A/c" --amount 38000 --narration "Salary provision"', 'post journal --input journal.json'],
  run: (ctx, i) => {
    const entries = i.entries || (i.debit && i.credit && i.amount ? [{ ledger: i.debit, debit: i.amount }, { ledger: i.credit, credit: i.amount }] : null);
    if (!entries) throw new TallyCliError('E_INPUT', 'Give --debit, --credit and --amount, or "entries" via --input.');
    return postVoucher(ctx, { kind: 'journal', voucherType: i.voucherType, date: i.date || today(), number: i.number, reference: i.reference, narration: i.narration, optional: i.optional, entries, idempotencyKey: i.idempotencyKey, forceResend: i.forceResend, dryRun: i.dryRun }, { op: 'post.journal' });
  },
});

const INVOICE_KINDS = ['sales', 'purchase', 'credit-note', 'debit-note', 'sales-order', 'purchase-order', 'delivery-note', 'receipt-note'];
for (const kind of INVOICE_KINDS) {
  const k = KINDS[kind];
  const label = k.base.toLowerCase();
  defineOp({
    id: `post.${kind}`,
    kind: 'write',
    summary: `Create a ${label}${k.order ? '' : ' with items, GST and bill reference'}. Full detail via --input; one item via flags.`,
    input: {
      properties: {
        party: { type: 'string' },
        items: { type: 'array', description: 'Items [{item, qty, rate, ledger, godown, discountPct, gstRate, orderNo}].' },
        item: { type: 'string', description: 'Single item (instead of items).' },
        qty: { type: 'number' },
        rate: { type: 'number' },
        ledger: { type: 'string', description: `${k.taxDir === 'output' ? 'Sales' : 'Purchase'} ledger for the item(s).` },
        godown: { type: 'string' },
        charges: { type: 'array', description: 'Extra lines [{ledger, amount, deduct?, gstRate?}] such as freight or discount.' },
        taxes: { type: 'any', description: '"auto" (default when items have GST rates), "none", or [{ledger, amount}].' },
        roundOff: { type: 'any', description: '"auto" or {ledger, amount}.' },
        bills: { type: 'any', description: 'Party bill allocation (default: a new bill named after the voucher number).' },
        expectedTotal: { type: 'number', description: 'Refuse unless the computed total equals this.' },
        placeOfSupply: { type: 'string' },
        orderNo: { type: 'string' },
        dueDate: { type: 'date' },
        ...COMMON,
        ...WRITE_PARAMS,
      },
      required: ['party'],
    },
    examples: [`post ${kind} --input ${kind}.json --dry-run`, `post ${kind} --party "${k.stock === 'out' ? 'Alpha Hardware Stores' : 'Prime Cables Ltd'}" --item "LED Bulb 9W" --qty 100 --rate ${k.stock === 'out' ? 95 : 62} --ledger "${k.stock === 'out' ? 'Sales GST 12%' : 'Purchase GST 12%'}" --number ${k.stock === 'out' ? 'SI/26-27/0101' : 'PB-77'} --round-off auto`],
    run: (ctx, i) => {
      const items = i.items || (i.item ? [{ item: i.item, qty: i.qty, rate: i.rate, ledger: i.ledger, godown: i.godown }] : undefined);
      const voucher = {
        kind,
        voucherType: i.voucherType,
        date: i.date || today(),
        number: i.number,
        reference: i.reference,
        narration: i.narration,
        party: i.party,
        items,
        charges: i.charges,
        taxes: i.taxes,
        roundOff: i.roundOff,
        bills: i.bills,
        expectedTotal: i.expectedTotal,
        placeOfSupply: i.placeOfSupply,
        orderNo: i.orderNo,
        dueDate: i.dueDate,
        optional: i.optional,
        ...(i.ledger && i.items ? { [k.ledgerKey]: i.ledger } : {}),
      };
      for (const key of Object.keys(voucher)) if (voucher[key] === undefined) delete voucher[key];
      return postVoucher(ctx, { ...voucher, idempotencyKey: i.idempotencyKey, forceResend: i.forceResend, dryRun: i.dryRun }, { op: `post.${kind}` });
    },
  });
}

defineOp({
  id: 'post.stock-journal',
  kind: 'write',
  summary: 'Stock journal: transfer between godowns (flags) or consumption/production (--input with consumed and produced).',
  input: {
    properties: {
      item: { type: 'string' },
      qty: { type: 'number' },
      rate: { type: 'number', description: 'Valuation rate for the transfer.' },
      fromGodown: { type: 'string' },
      toGodown: { type: 'string' },
      consumed: { type: 'array' },
      produced: { type: 'array' },
      ...COMMON,
      ...WRITE_PARAMS,
    },
  },
  examples: ['post stock-journal --item "LED Panel 18W" --qty 20 --rate 470 --from-godown "Main Location" --to-godown "Pune Warehouse"', 'post stock-journal --input manufacture.json'],
  run: (ctx, i) => {
    let consumed = i.consumed;
    let produced = i.produced;
    if (!consumed && !produced) {
      if (!i.item || !i.qty || !i.fromGodown || !i.toGodown) throw new TallyCliError('E_INPUT', 'For a transfer give --item, --qty, --from-godown and --to-godown (and --rate); otherwise pass consumed/produced via --input.');
      consumed = [{ item: i.item, qty: i.qty, rate: i.rate ?? 0, godown: i.fromGodown }];
      produced = [{ item: i.item, qty: i.qty, rate: i.rate ?? 0, godown: i.toGodown }];
    }
    return postVoucher(ctx, { kind: 'stock-journal', voucherType: i.voucherType, date: i.date || today(), number: i.number, reference: i.reference, narration: i.narration, optional: i.optional, consumed, produced, idempotencyKey: i.idempotencyKey, forceResend: i.forceResend, dryRun: i.dryRun }, { op: 'post.stock-journal' });
  },
});

defineOp({
  id: 'voucher.kinds',
  kind: 'local',
  summary: 'List voucher kinds the tool understands, with their base type and shape.',
  run: async () => KIND_NAMES.map((k) => ({ kind: k, baseType: KINDS[k].base, shape: KINDS[k].shape, partySide: KINDS[k].partySide || null, stock: KINDS[k].stock || null })),
});

export { summarisePlan };
