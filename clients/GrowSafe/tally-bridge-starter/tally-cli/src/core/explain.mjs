/**
 * Known Tally messages and what to do about them. Used to attach hints to errors and by "tally explain".
 * Patterns are matched case-insensitively against Tally's text.
 */
export const KNOWN_MESSAGES = [
  {
    id: 'totals-mismatch',
    pattern: /voucher totals do not match/i,
    meaning: 'Debits and credits of the voucher are not equal.',
    remedy: 'Check every amount and side. For invoices check item amounts (qty x rate - discount), taxes and round off. Run "tally voucher validate" first.',
  },
  {
    id: 'ledger-missing',
    pattern: /ledger\s+['"]?(.+?)['"]?\s+does not exist|could not find ledger|no ledger/i,
    meaning: 'A ledger name in the voucher does not exist in this company.',
    remedy: 'Names must match Tally exactly. Use "tally ledger search <text>" to find the right name, or create it with "tally ledger create".',
  },
  {
    id: 'item-missing',
    pattern: /stock ?item\s+['"]?(.+?)['"]?\s+does not exist|could not find stock ?item/i,
    meaning: 'A stock item in the voucher does not exist.',
    remedy: 'Use "tally item search <text>" or create the item with "tally item create".',
  },
  {
    id: 'vchtype-missing',
    pattern: /voucher ?type\s+['"]?(.+?)['"]?\s+does not exist|unknown voucher type/i,
    meaning: 'The voucher type name is not defined in this company.',
    remedy: 'List types with "tally voucher-type list" and use the exact name.',
  },
  {
    id: 'company-not-open',
    pattern: /company.*(not (open|loaded)|does not exist)|no company/i,
    meaning: 'The target company is not open in Tally.',
    remedy: 'Open the company in Tally (F3 / Alt+F3), or set the right name with --company. "tally company list" shows open companies.',
  },
  {
    id: 'date-outside-period',
    pattern: /date.*(out of|outside|beyond|before).*(period|books)|books begin/i,
    meaning: 'The voucher date is outside the books period of the company.',
    remedy: 'Use a date within the company period ("tally company info" shows it).',
  },
  {
    id: 'educational',
    pattern: /educational|not allowed in educational/i,
    meaning: 'Tally is in Educational mode, which only accepts some dates.',
    remedy: 'Use the 1st, 2nd or last day of a month, or activate a licence.',
  },
  {
    id: 'duplicate',
    pattern: /duplicate|already exists/i,
    meaning: 'A record with the same name or number already exists.',
    remedy: 'For masters use "update" or "ensure" instead of "create". For vouchers check with "tally voucher find" before posting again.',
  },
  {
    id: 'unknown-request',
    pattern: /unknown request|cannot be processed|invalid request/i,
    meaning: 'Tally did not understand the request.',
    remedy: 'Check the envelope (TALLYREQUEST/TYPE/ID). For built-in reports the name must match exactly. Run "tally doctor".',
  },
  {
    id: 'no-report',
    pattern: /(report|collection|form|part|line|field).*(does not exist|not found|undefined)/i,
    meaning: 'A report, collection or TDL definition named in the request does not exist.',
    remedy: 'Check the name. Built-in report names differ between Tally versions; use "tally query collection" with inline TDL instead.',
  },
  {
    id: 'not-allowed',
    pattern: /(security|access|permission|not allowed|insufficient rights)/i,
    meaning: 'The Tally user or security settings block this action.',
    remedy: 'Ask the Tally administrator, or check the user role in Tally (Alt+K > User Roles).',
  },
  {
    id: 'bill-wise',
    pattern: /bill.?wise|bill allocations?|agst ref|against ref/i,
    meaning: 'Bill-wise details are missing or do not add up for a party ledger.',
    remedy: 'Add "bills" to the party entry (type new/against/advance/on-account) with amounts that sum to the entry amount.',
  },
  {
    id: 'cost-centre',
    pattern: /cost ?centre|cost ?category/i,
    meaning: 'Cost centre allocation is missing or does not add up.',
    remedy: 'Add "costCentres" to the entry with amounts summing to the entry amount, or turn off cost centres for that ledger.',
  },
  {
    id: 'gst',
    pattern: /gstin|gst registration|hsn|place of supply/i,
    meaning: 'GST details are missing or invalid.',
    remedy: 'Check the party GSTIN ("tally gst check-gstin"), the HSN on items and the place of supply. Capture a correct voucher as a template ("tally voucher template capture").',
  },
  {
    id: 'negative-stock',
    pattern: /negative stock|insufficient stock/i,
    meaning: 'The voucher would take stock below zero and Tally is set to refuse that.',
    remedy: 'Post the purchase or receipt first, or allow negative stock in Tally (F11 features).',
  },
  {
    id: 'locked-period',
    pattern: /locked|freeze|closed period/i,
    meaning: 'The period is locked in Tally.',
    remedy: 'Ask the accountant to unlock the period or use a date after the lock.',
  },
];

export function explainTallyMessage(message) {
  const s = String(message || '');
  for (const k of KNOWN_MESSAGES) if (k.pattern.test(s)) return k;
  return null;
}
