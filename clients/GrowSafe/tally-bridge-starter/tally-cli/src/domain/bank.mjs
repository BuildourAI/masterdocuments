/**
 * Bank reconciliation helpers: unreconciled book entries, statement matching, setting bank dates.
 */
import { TallyCliError, suggest } from '../core/errors.mjs';
import { F } from '../core/tdl.mjs';
import { parseDate, diffDays, addDays, today } from '../core/dates.mjs';
import { parseTallyAmount, roundMoney } from '../core/amounts.mjs';
import { csvObjects, pickColumn } from '../io/csv.mjs';
import { parseJson } from '../core/textio.mjs';
import { norm, period } from './common.mjs';
import { resolveMaster, masterNames, underFn } from './masters.mjs';
import { getVoucher } from './vouchers/read.mjs';
import { updateVoucher, readToInput } from './vouchers/post.mjs';

const ROW_FIELDS = [
  { key: 'masterId', method: 'MasterId', type: 'number' },
  { key: 'date', method: 'Date', type: 'date' },
  { key: 'voucherType', method: 'VoucherTypeName' },
  { key: 'number', method: 'VoucherNumber' },
  { key: 'party', method: 'PartyLedgerName' },
  { key: 'narration', method: 'Narration' },
  { key: 'ledger', method: 'LedgerName' },
  { key: 'transactionType', method: 'TransactionType' },
  { key: 'instrumentNumber', method: 'InstrumentNumber' },
  { key: 'instrumentDate', method: 'InstrumentDate', type: 'date' },
  { key: 'amount', method: 'Amount', type: 'amount' },
  { key: 'bankersDate', method: 'BankersDate', type: 'date' },
];

/** Bank allocations of a bank ledger in a period. */
export async function bankEntries(ctx, input) {
  const ledger = await resolveMaster(ctx, 'ledger', input.ledger);
  const p = await period(ctx, input);
  const rows = await ctx.client.rows({ collection: { type: 'Voucher', route: ['AllLedgerEntries', 'BankAllocations'], filters: [F.notCancelled(), F.notOptional(), 'NOT $$IsOrderVch:$VoucherTypeName', 'NOT $$IsInventoryVch:$VoucherTypeName'] }, fields: ROW_FIELDS }, { from: p.from, to: p.to, chunk: true });
  const mine = rows
    .filter((r) => norm(r.ledger) === norm(ledger))
    .map((r) => ({
      date: r.date,
      voucherType: r.voucherType,
      number: r.number || null,
      party: r.party || null,
      instrument: r.instrumentNumber || null,
      mode: r.transactionType || null,
      deposit: r.amount < 0 ? -r.amount : 0, // debit to bank = money in
      withdrawal: r.amount > 0 ? r.amount : 0,
      bankDate: r.bankersDate,
      narration: r.narration || null,
      masterId: r.masterId,
    }));
  return { ledger, period: p, rows: mine };
}

export async function unreconciled(ctx, input) {
  const all = await bankEntries(ctx, input);
  const rows = all.rows.filter((r) => !r.bankDate);
  return { ledger: all.ledger, period: all.period, count: rows.length, deposits: roundMoney(rows.reduce((s, r) => s + r.deposit, 0)), withdrawals: roundMoney(rows.reduce((s, r) => s + r.withdrawal, 0)), rows };
}

/**
 * Read a bank statement (CSV or JSON) into {date, deposit, withdrawal, description, reference}.
 * CSV columns are detected by common names (Date, Narration/Description, Ref/Cheque No, Withdrawal/Debit, Deposit/Credit, Amount).
 */
export function readStatement(text, { format } = {}) {
  let rows;
  if (format === 'json' || /^\s*[[{]/.test(text)) {
    const data = parseJson(text, 'statement');
    rows = (Array.isArray(data) ? data : data.lines || data.rows || []).map((r) => ({ ...r }));
    return rows.map((r, i) => normaliseLine(r, i));
  }
  const objs = csvObjects(text);
  if (!objs.length) return [];
  const headers = Object.keys(objs[0]);
  const col = {
    date: pickColumn(headers, ['Txn Date', 'Transaction Date', 'Value Date', 'Date']),
    description: pickColumn(headers, ['Narration', 'Description', 'Particulars', 'Remarks', 'Details']),
    reference: pickColumn(headers, ['Chq/Ref No', 'Ref No', 'Reference', 'Cheque No', 'UTR', 'Chq No']),
    withdrawal: pickColumn(headers, ['Withdrawal Amt', 'Withdrawal', 'Debit', 'Dr']),
    deposit: pickColumn(headers, ['Deposit Amt', 'Deposit', 'Credit', 'Cr']),
    amount: pickColumn(headers, ['Amount', 'Txn Amount']),
    type: pickColumn(headers, ['Dr/Cr', 'Type', 'Cr/Dr']),
  };
  if (!col.date) throw new TallyCliError('E_INPUT', `Cannot find a date column in the statement (columns: ${headers.join(', ')}).`);
  return objs.map((o, i) =>
    normaliseLine(
      {
        date: o[col.date],
        description: col.description ? o[col.description] : '',
        reference: col.reference ? o[col.reference] : '',
        withdrawal: col.withdrawal ? o[col.withdrawal] : undefined,
        deposit: col.deposit ? o[col.deposit] : undefined,
        amount: col.amount ? o[col.amount] : undefined,
        type: col.type ? o[col.type] : undefined,
      },
      i,
    ),
  );
}

function normaliseLine(r, i) {
  const num = (v) => (v === undefined || v === null || String(v).trim() === '' ? 0 : Math.abs(parseTallyAmount(String(v))));
  let deposit = num(r.deposit);
  let withdrawal = num(r.withdrawal);
  if (!deposit && !withdrawal && r.amount !== undefined) {
    const a = parseTallyAmount(String(r.amount));
    const t = String(r.type || '').toLowerCase();
    if (t.startsWith('d') || (!t && a < 0)) withdrawal = Math.abs(a);
    else deposit = Math.abs(a);
  }
  let date = null;
  try {
    date = parseDate(r.date, { field: `line ${i + 1} date` });
  } catch {
    date = null;
  }
  return { line: i + 1, date, deposit: roundMoney(deposit), withdrawal: roundMoney(withdrawal), description: String(r.description || r.narration || ''), reference: String(r.reference || r.ref || '') };
}

/** Match statement lines with unreconciled book entries; suggest parties for unmatched deposits. */
export async function matchStatement(ctx, input, statementText) {
  const lines = readStatement(statementText, { format: input.format }).filter((l) => l.date && (l.deposit || l.withdrawal));
  if (!lines.length) throw new TallyCliError('E_INPUT', 'No usable lines in the statement.');
  const from = input.from || addDays(lines.reduce((m, l) => (l.date < m ? l.date : m), lines[0].date), -(input.toleranceDays ?? 7) - 30);
  const to = input.to || lines.reduce((m, l) => (l.date > m ? l.date : m), lines[0].date);
  const book = (await unreconciled(ctx, { ledger: input.ledger, from, to })).rows.map((r) => ({ ...r }));
  const tol = input.toleranceDays ?? 7;
  const matched = [];
  const unmatchedLines = [];
  for (const l of lines) {
    const amount = l.deposit || l.withdrawal;
    const isIn = !!l.deposit;
    const candidates = book.filter((b) => !b._used && Math.abs((isIn ? b.deposit : b.withdrawal) - amount) < 0.005 && Math.abs(diffDays(b.date, l.date)) <= tol);
    let best = null;
    if (candidates.length) {
      const desc = norm(`${l.description} ${l.reference}`);
      best = candidates.find((b) => b.instrument && desc.includes(norm(b.instrument))) || candidates.sort((a, b) => Math.abs(diffDays(a.date, l.date)) - Math.abs(diffDays(b.date, l.date)))[0];
    }
    if (best) {
      best._used = true;
      matched.push({ statement: l, book: { masterId: best.masterId, date: best.date, voucherType: best.voucherType, number: best.number, party: best.party, instrument: best.instrument }, bankDate: l.date, confidence: best.instrument && norm(`${l.description} ${l.reference}`).includes(norm(best.instrument)) ? 'high' : 'medium' });
    } else unmatchedLines.push(l);
  }
  // Suggest parties for unmatched deposits/withdrawals by looking for party names in the description
  const ledgers = await masterNames(ctx, 'ledger');
  const groups = await masterNames(ctx, 'group');
  const isParty = (p) => underFn(groups, 'Sundry Debtors')(p) || underFn(groups, 'Sundry Creditors')(p);
  const parties = ledgers.filter((l) => isParty(l.parent)).map((l) => l.name);
  for (const l of unmatchedLines) {
    const words = norm(l.description).replace(/[^a-z0-9 ]/g, ' ');
    const hit = parties.find((p) => {
      const key = norm(p).replace(/[^a-z0-9 ]/g, ' ').split(' ').filter((w) => w.length > 3).slice(0, 2).join(' ');
      return key && words.includes(key);
    });
    l.suggestedParty = hit || suggest(l.description.split(/[/ -]+/).find((w) => w.length > 4) || '', parties, 1)[0] || null;
    l.suggestedAction = l.deposit ? 'post receipt' : 'post payment';
  }
  const unmatchedBook = book.filter((b) => !b._used).map(({ _used, ...b }) => b);
  return { ledger: input.ledger, lines: lines.length, matched, unmatchedStatement: unmatchedLines, unmatchedBook, next: 'Review the matches, then "tally bank set-date" for each (or --apply on this command with writes enabled).' };
}

/** Set the bank (clearing) date on the bank line of a voucher. */
export async function setBankDate(ctx, input) {
  const v = await getVoucher(ctx, { masterId: input.masterId });
  const ledger = input.ledger ? await resolveMaster(ctx, 'ledger', input.ledger) : null;
  const inp = readToInput(v);
  const list = inp.entries || inp.ledgers;
  if (!list) throw new TallyCliError('E_UNSUPPORTED', 'This voucher has no ledger entries to reconcile.');
  const target = list.find((e) => e.bank && (!ledger || norm(e.ledger) === norm(ledger)));
  if (!target) throw new TallyCliError('E_NOT_FOUND', `No bank details on ${ledger ? `"${ledger}" in ` : ''}this voucher.`);
  target.bank = { ...target.bank, bankersDate: input.bankDate || today() };
  const changes = inp.entries ? { entries: inp.entries } : { ledgers: inp.ledgers };
  return updateVoucher(ctx, { masterId: v.masterId, changes, yes: input.yes, dryRun: input.dryRun, ifAlterId: input.ifAlterId });
}
