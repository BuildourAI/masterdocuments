/**
 * Read operations: vouchers, reports, parties, GST registers.
 */
import { defineOp, PERIOD_PARAMS } from './registry.mjs';
import { listVouchers, getVoucher, findVouchers, voucherTypes } from '../domain/vouchers/read.mjs';
import * as R from '../domain/reports.mjs';
import { listMasters, getMaster } from '../domain/masters.mjs';
import { checkGstin, stateList, findState, splitGst } from '../domain/gst.mjs';
import { toPaise, fromPaise } from '../core/amounts.mjs';
import { TallyCliError } from '../core/errors.mjs';

const STATUS = { type: 'string', enum: ['active', 'regular', 'optional', 'cancelled', 'all'], default: 'active', description: 'active = regular + optional (not cancelled).' };

// ---------- vouchers (read) ----------

defineOp({
  id: 'voucher.list',
  kind: 'read',
  summary: 'List vouchers in a period with totals; filter by type (or base type), party, ledger, number, status.',
  input: {
    properties: {
      ...PERIOD_PARAMS,
      type: { type: 'string', description: 'Voucher type, or a base type such as Sales (includes custom types under it).' },
      party: { type: 'string', description: 'Party ledger name.' },
      ledger: { type: 'string', description: 'Any ledger appearing in the voucher.' },
      number: { type: 'string' },
      search: { type: 'string', description: 'Text in number, party, narration or reference.' },
      status: STATUS,
      limit: { type: 'integer', minimum: 1, description: 'Only the latest N.' },
    },
  },
  examples: ['voucher list --type Sales --from 2026-10-01 --to 2026-10-31', 'voucher list --party "Alpha Hardware Stores" --fy current'],
  run: (ctx, i) => listVouchers(ctx, i),
});

defineOp({
  id: 'voucher.get',
  kind: 'read',
  summary: 'Get one voucher in full (entries, items, bills, bank details), in the same shape "voucher create" accepts.',
  input: {
    properties: {
      masterId: { type: 'integer', description: 'Tally master id (shown by voucher list).' },
      guid: { type: 'string' },
      number: { type: 'string', description: 'Voucher number (use with --type, optionally --date).' },
      type: { type: 'string' },
      date: { type: 'date' },
    },
  },
  examples: ['voucher get --master-id 245', 'voucher get --type Sales --number SI/26-27/0012'],
  run: (ctx, i) => getVoucher(ctx, i),
});

defineOp({
  id: 'voucher.find',
  kind: 'read',
  summary: 'Search for vouchers by date (with tolerance), party, amount, reference or narration. Use before posting to avoid duplicates.',
  input: {
    properties: {
      date: { type: 'date' },
      days: { type: 'integer', minimum: 0, default: 0, description: 'Search this many days either side of --date.' },
      from: { type: 'date' },
      to: { type: 'date' },
      type: { type: 'string' },
      party: { type: 'string' },
      amount: { type: 'number' },
      number: { type: 'string' },
      reference: { type: 'string' },
      narration: { type: 'string', description: 'Text contained in the narration.' },
      status: { ...STATUS, default: 'all' },
    },
  },
  examples: ['voucher find --date 2026-11-02 --days 3 --party "Alpha Hardware Stores" --amount 11800'],
  run: (ctx, i) => findVouchers(ctx, i),
});

defineOp({
  id: 'voucher-type.bases',
  kind: 'read',
  summary: 'List voucher types with the base type each belongs to (Sales, Receipt, Journal, ...).',
  tier: 'extended',
  run: async (ctx) => (await voucherTypes(ctx)).list,
});

// ---------- reports ----------

defineOp({
  id: 'report.receivables',
  kind: 'read',
  summary: 'Outstanding receivables bill by bill with ageing buckets and party totals (input for payment reminders).',
  input: {
    properties: {
      asOf: { type: 'date', description: 'As of this date (default today).' },
      party: { type: 'string' },
      group: { type: 'string', description: 'Only parties under this group (e.g. a regional sub-group of Sundry Debtors).' },
      buckets: { type: 'string', default: '30,60,90,180', description: 'Ageing bucket edges in days.' },
      ageBy: { type: 'string', enum: ['bill-date', 'due-date'], default: 'bill-date' },
      minDays: { type: 'integer', minimum: 0, description: 'Only bills at least this old (or overdue, with --age-by due-date).' },
      withContacts: { type: 'boolean', description: 'Add phone, email and credit days of each party.' },
      detail: { type: 'boolean', default: true, description: 'Include the bill-level list.' },
    },
  },
  examples: ['report receivables --with-contacts', 'report receivables --age-by due-date --min-days 1 --json'],
  run: (ctx, i) => R.outstanding(ctx, 'receivable', i),
});

defineOp({
  id: 'report.payables',
  kind: 'read',
  summary: 'Outstanding payables to suppliers bill by bill with ageing.',
  input: {
    properties: {
      asOf: { type: 'date' },
      party: { type: 'string' },
      group: { type: 'string' },
      buckets: { type: 'string', default: '30,60,90,180' },
      ageBy: { type: 'string', enum: ['bill-date', 'due-date'], default: 'bill-date' },
      minDays: { type: 'integer', minimum: 0 },
      withContacts: { type: 'boolean' },
      detail: { type: 'boolean', default: true },
    },
  },
  examples: ['report payables --age-by due-date'],
  run: (ctx, i) => R.outstanding(ctx, 'payable', i),
});

defineOp({
  id: 'report.ledger',
  kind: 'read',
  summary: 'Ledger statement with opening, each voucher, running balance and closing (any ledger: party, bank, expense).',
  input: { properties: { ledger: { type: 'string' }, ...PERIOD_PARAMS }, required: ['ledger'] },
  positional: ['ledger'],
  examples: ['report ledger "Alpha Hardware Stores" --fy current', 'report ledger Cash --from 2026-11-01'],
  run: (ctx, i) => R.ledgerStatement(ctx, i),
});

defineOp({
  id: 'report.day-book',
  kind: 'read',
  summary: 'All vouchers of a period (default today) with totals per voucher type.',
  input: { properties: { ...PERIOD_PARAMS, type: { type: 'string' }, status: STATUS } },
  examples: ['report day-book', 'report day-book --from 2026-11-01 --to 2026-11-07'],
  run: (ctx, i) => {
    const today = new Date();
    const d = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return R.dayBook(ctx, { ...i, from: i.from || (i.fy ? undefined : d), to: i.to || (i.fy ? undefined : i.from || d) }, listVouchers);
  },
});

defineOp({
  id: 'report.trial-balance',
  kind: 'read',
  summary: 'Trial balance by ledger or by primary group: opening, period debits/credits, closing; checks the totals.',
  input: { properties: { ...PERIOD_PARAMS, level: { type: 'string', enum: ['ledger', 'group'], default: 'ledger' }, group: { type: 'string', description: 'Only ledgers under this group.' } } },
  examples: ['report trial-balance --level group', 'report trial-balance --fy current --csv --out tb.csv'],
  run: (ctx, i) => R.trialBalance(ctx, i),
});

defineOp({
  id: 'report.profit-loss',
  kind: 'read',
  summary: 'Profit and loss for a period: trading and indirect sections, gross and net profit, stock values.',
  input: { properties: { ...PERIOD_PARAMS } },
  examples: ['report profit-loss --fy current'],
  run: (ctx, i) => R.profitLoss(ctx, i),
});

defineOp({
  id: 'report.balance-sheet',
  kind: 'read',
  summary: 'Balance sheet as of a date: liabilities and assets by primary group, with the current profit.',
  input: { properties: { asOf: { type: 'date' }, from: { type: 'date', description: 'Start of the period for the current profit (default: FY start).' } } },
  examples: ['report balance-sheet --as-of 2026-09-30'],
  run: (ctx, i) => R.balanceSheet(ctx, i),
});

defineOp({
  id: 'report.group-summary',
  kind: 'read',
  summary: 'Balances of the sub-groups and ledgers directly under a group (default: top level).',
  input: { properties: { group: { type: 'string' }, ...PERIOD_PARAMS, all: { type: 'boolean', description: 'Include zero rows.' } } },
  positional: ['group'],
  examples: ['report group-summary "Current Assets"', 'report group-summary'],
  run: (ctx, i) => R.groupSummary(ctx, i),
});

defineOp({
  id: 'report.cash-bank',
  kind: 'read',
  summary: 'Cash and bank ledgers with opening, receipts, payments and closing; or one book with --ledger.',
  input: { properties: { ledger: { type: 'string', description: 'Show the statement of this cash/bank ledger.' }, ...PERIOD_PARAMS } },
  examples: ['report cash-bank', 'report cash-bank --ledger Cash --from 2026-11-01'],
  run: (ctx, i) => (i.ledger ? R.ledgerStatement(ctx, i) : R.cashBankSummary(ctx, i)),
});

defineOp({
  id: 'report.sales-register',
  kind: 'read',
  summary: 'Sales register: each invoice with party GSTIN, taxable value, CGST/SGST/IGST/cess, round off and total.',
  input: { properties: { ...PERIOD_PARAMS, includeNotes: { type: 'boolean', description: 'Include credit notes (as negatives).' } } },
  examples: ['report sales-register --from 2026-10-01 --to 2026-10-31 --csv --out sales-oct.csv'],
  run: (ctx, i) => R.register(ctx, 'sales', i),
});

defineOp({
  id: 'report.purchase-register',
  kind: 'read',
  summary: 'Purchase register: each bill with supplier GSTIN, taxable value and taxes (for GSTR-2B matching).',
  input: { properties: { ...PERIOD_PARAMS, includeNotes: { type: 'boolean', description: 'Include debit notes (as negatives).' } } },
  examples: ['report purchase-register --from 2026-10-01 --to 2026-10-31'],
  run: (ctx, i) => R.register(ctx, 'purchase', i),
});

defineOp({
  id: 'report.stock-summary',
  kind: 'read',
  summary: 'Stock summary per item: opening, inward, outward and closing quantity and value.',
  input: { properties: { ...PERIOD_PARAMS, under: { type: 'string', description: 'Only items under this stock group.' }, all: { type: 'boolean', description: 'Include items with no stock or movement.' } } },
  examples: ['report stock-summary', 'report stock-summary --under Switchgear'],
  run: (ctx, i) => R.stockSummary(ctx, i),
});

defineOp({
  id: 'report.godown-summary',
  kind: 'read',
  summary: 'Closing quantity of each item in each godown (location) as of a date.',
  input: { properties: { asOf: { type: 'date' }, godown: { type: 'string' }, item: { type: 'string' }, all: { type: 'boolean' } } },
  examples: ['report godown-summary --godown "Pune Warehouse"'],
  run: (ctx, i) => R.godownSummary(ctx, i),
});

defineOp({
  id: 'report.item-movement',
  kind: 'read',
  summary: 'Every inward and outward movement of one stock item with running quantity.',
  input: { properties: { item: { type: 'string' }, ...PERIOD_PARAMS }, required: ['item'] },
  positional: ['item'],
  examples: ['report item-movement "LED Bulb 9W" --fy current'],
  run: (ctx, i) => R.itemMovement(ctx, i),
});

defineOp({
  id: 'report.orders-pending',
  kind: 'read',
  summary: 'Sales (or purchase) order lines with ordered, delivered and pending quantity and due dates.',
  input: { properties: { kind: { type: 'string', enum: ['sales', 'purchase'], default: 'sales' }, ...PERIOD_PARAMS, all: { type: 'boolean', description: 'Include fully delivered lines.' } } },
  examples: ['report orders-pending', 'report orders-pending --kind purchase'],
  run: (ctx, i) => R.ordersPending(ctx, i),
});

// ---------- parties ----------

defineOp({
  id: 'party.list',
  kind: 'read',
  summary: 'Customers and/or suppliers with GSTIN, contacts, credit days and balance.',
  input: { properties: { kind: { type: 'string', enum: ['customers', 'suppliers', 'all'], default: 'all' }, search: { type: 'string' }, limit: { type: 'integer', minimum: 1 }, asOf: { type: 'date' } } },
  examples: ['party list --kind customers', 'party list --search traders'],
  run: async (ctx, i) => {
    const out = [];
    if (i.kind !== 'suppliers') out.push(...(await listMasters(ctx, 'ledger', { under: 'Sundry Debtors', search: i.search, asOf: i.asOf })).map((l) => ({ kind: 'customer', ...l })));
    if (i.kind !== 'customers') out.push(...(await listMasters(ctx, 'ledger', { under: 'Sundry Creditors', search: i.search, asOf: i.asOf })).map((l) => ({ kind: 'supplier', ...l })));
    const rows = out.map((l) => ({ kind: l.kind, name: l.name, group: l.group, gstin: l.gstin, state: l.state, phone: l.contact.phone, email: l.contact.email, creditDays: l.creditDays, balance: l.closingBalance }));
    return i.limit ? rows.slice(0, i.limit) : rows;
  },
});

defineOp({
  id: 'party.get',
  kind: 'read',
  summary: 'One party with contacts, GSTIN check, credit terms, balance and pending bills.',
  input: { properties: { name: { type: 'string' }, asOf: { type: 'date' } }, required: ['name'] },
  positional: ['name'],
  examples: ['party get "Alpha Hardware Stores"'],
  run: async (ctx, i) => {
    const l = await getMaster(ctx, 'ledger', i.name, i);
    const debtor = /debtor/i.test(l.primaryGroup || '') || /debtor/i.test(l.group || '');
    const bills = await R.outstanding(ctx, debtor ? 'receivable' : 'payable', { party: l.name, asOf: i.asOf });
    return { ...l, kind: debtor ? 'customer' : 'supplier', gstinCheck: l.gstin ? checkGstin(l.gstin) : null, outstanding: { total: bills.totals.total, overdue: bills.totals.overdue, buckets: bills.totals.buckets }, bills: bills.bills };
  },
});

defineOp({
  id: 'party.bills',
  kind: 'read',
  summary: 'Pending bills of one party (what to settle when posting a receipt or payment).',
  input: { properties: { name: { type: 'string' }, asOf: { type: 'date' } }, required: ['name'] },
  positional: ['name'],
  examples: ['party bills "Alpha Hardware Stores"'],
  run: async (ctx, i) => {
    const l = await getMaster(ctx, 'ledger', i.name);
    const debtor = /debtor/i.test(l.primaryGroup || l.group || '');
    const r = await R.outstanding(ctx, debtor ? 'receivable' : 'payable', { party: l.name, asOf: i.asOf });
    return { party: l.name, kind: debtor ? 'customer' : 'supplier', total: r.totals.total, bills: r.bills };
  },
});

defineOp({
  id: 'party.statement',
  kind: 'read',
  summary: 'Statement of account for a party (ledger statement) plus pending bills.',
  input: { properties: { name: { type: 'string' }, ...PERIOD_PARAMS }, required: ['name'] },
  positional: ['name'],
  examples: ['party statement "Alpha Hardware Stores" --fy current'],
  run: async (ctx, i) => {
    const st = await R.ledgerStatement(ctx, { ...i, ledger: i.name });
    const l = await getMaster(ctx, 'ledger', st.ledger);
    const debtor = /debtor/i.test(l.primaryGroup || l.group || '');
    const bills = await R.outstanding(ctx, debtor ? 'receivable' : 'payable', { party: st.ledger, asOf: st.period.to });
    return { ...st, pendingBills: bills.bills };
  },
});

// ---------- GST ----------

defineOp({
  id: 'gst.sales-register',
  kind: 'read',
  summary: 'Outward supplies register (same as report sales-register, credit notes included).',
  input: { properties: { ...PERIOD_PARAMS } },
  examples: ['gst sales-register --from 2026-10-01 --to 2026-10-31'],
  run: (ctx, i) => R.register(ctx, 'sales', { ...i, includeNotes: true }),
});

defineOp({
  id: 'gst.purchase-register',
  kind: 'read',
  summary: 'Inward supplies register with supplier GSTINs (debit notes included), for matching with GSTR-2B.',
  input: { properties: { ...PERIOD_PARAMS } },
  examples: ['gst purchase-register --from 2026-10-01 --to 2026-10-31 --csv --out purchases.csv'],
  run: (ctx, i) => R.register(ctx, 'purchase', { ...i, includeNotes: true }),
});

defineOp({
  id: 'gst.hsn-summary',
  kind: 'read',
  summary: 'HSN-wise quantity and taxable value of sales (or purchases).',
  input: { properties: { kind: { type: 'string', enum: ['sales', 'purchase'], default: 'sales' }, ...PERIOD_PARAMS } },
  examples: ['gst hsn-summary --from 2026-10-01 --to 2026-10-31'],
  run: (ctx, i) => R.hsnSummary(ctx, i),
});

defineOp({
  id: 'gst.party-gstins',
  kind: 'read',
  summary: 'Check the GSTIN of every customer and supplier (format, checksum, state match).',
  input: { properties: { problemsOnly: { type: 'boolean', description: 'Only parties with a problem.' } } },
  examples: ['gst party-gstins --problems-only'],
  run: (ctx, i) => R.partyGstins(ctx, i),
});

defineOp({
  id: 'gst.tax-ledgers',
  kind: 'read',
  summary: 'GST tax ledgers (CGST/SGST/IGST/cess) with period debits, credits and balances.',
  input: { properties: { ...PERIOD_PARAMS } },
  examples: ['gst tax-ledgers --from 2026-10-01 --to 2026-10-31'],
  run: (ctx, i) => R.taxLedgers(ctx, i),
});

defineOp({
  id: 'gst.check-gstin',
  kind: 'local',
  summary: 'Validate a GSTIN offline (format, state code, PAN, check character).',
  input: { properties: { gstin: { type: 'string' } }, required: ['gstin'] },
  positional: ['gstin'],
  examples: ['gst check-gstin 27AAPFU0939F1ZV'],
  run: async (ctx, i) => checkGstin(i.gstin),
});

defineOp({
  id: 'gst.states',
  kind: 'local',
  summary: 'GST state codes and names.',
  examples: ['gst states'],
  run: async (ctx, i) => (i?.state ? findState(i.state) : stateList()),
});

defineOp({
  id: 'gst.split',
  kind: 'local',
  summary: 'Work out CGST+SGST or IGST for a taxable amount, from company state and place of supply.',
  input: {
    properties: {
      taxable: { type: 'number', description: 'Taxable value in rupees.' },
      rate: { type: 'number', description: 'GST rate in percent (e.g. 18).' },
      placeOfSupply: { type: 'string', description: 'State name or code of the buyer.' },
      companyState: { type: 'string', description: 'Default: gst.companyState from the profile.' },
    },
    required: ['taxable', 'rate', 'placeOfSupply'],
  },
  examples: ['gst split --taxable 10000 --rate 18 --place-of-supply Gujarat --company-state Maharashtra'],
  run: async (ctx, i) => {
    const companyState = i.companyState || ctx.profile.gst?.companyState;
    if (!companyState) throw new TallyCliError('E_INPUT', 'companyState is required (or set gst.companyState in the profile).');
    const r = splitGst({ lines: [{ taxable: toPaise(i.taxable), rate: i.rate }], companyState, placeOfSupply: i.placeOfSupply, ledgers: { cgst: 'CGST', sgst: 'SGST', igst: 'IGST' } });
    const tax = r.taxes.reduce((s, t) => s + t.amount, 0);
    return { interState: r.interState, companyState: r.companyState, placeOfSupply: r.placeOfSupply, taxes: r.taxes.map((t) => ({ head: t.head, rate: t.rate, amount: fromPaise(t.amount) })), totalTax: fromPaise(tax), invoiceTotal: fromPaise(toPaise(i.taxable) + tax) };
  },
});
