/**
 * Voucher kinds: which base type, which shape, which side the party and the items sit on.
 *   accounting  entries[] with explicit debit/credit
 *   invoice     party + items[] (+ charges, taxes, round off), Tally "Invoice Voucher View"
 *   stock       consumed[] and produced[] (stock journal / transfers)
 */
export const KINDS = {
  receipt: { base: 'Receipt', shape: 'accounting' },
  payment: { base: 'Payment', shape: 'accounting' },
  contra: { base: 'Contra', shape: 'accounting' },
  journal: { base: 'Journal', shape: 'accounting' },
  sales: { base: 'Sales', shape: 'invoice', partySide: 'debit', stock: 'out', taxDir: 'output', ledgerKey: 'salesLedger' },
  purchase: { base: 'Purchase', shape: 'invoice', partySide: 'credit', stock: 'in', taxDir: 'input', ledgerKey: 'purchaseLedger' },
  'credit-note': { base: 'Credit Note', shape: 'invoice', partySide: 'credit', stock: 'in', taxDir: 'output', ledgerKey: 'salesLedger' },
  'debit-note': { base: 'Debit Note', shape: 'invoice', partySide: 'debit', stock: 'out', taxDir: 'input', ledgerKey: 'purchaseLedger' },
  'sales-order': { base: 'Sales Order', shape: 'invoice', partySide: 'debit', stock: 'out', order: true, taxDir: 'output', ledgerKey: 'salesLedger' },
  'purchase-order': { base: 'Purchase Order', shape: 'invoice', partySide: 'credit', stock: 'in', order: true, taxDir: 'input', ledgerKey: 'purchaseLedger' },
  'delivery-note': { base: 'Delivery Note', shape: 'invoice', partySide: 'debit', stock: 'out', taxDir: 'output', ledgerKey: 'salesLedger' },
  'receipt-note': { base: 'Receipt Note', shape: 'invoice', partySide: 'credit', stock: 'in', taxDir: 'input', ledgerKey: 'purchaseLedger' },
  'stock-journal': { base: 'Stock Journal', shape: 'stock' },
};

export const KIND_NAMES = Object.keys(KINDS);

const BASE_TO_KIND = Object.fromEntries(Object.entries(KINDS).map(([k, v]) => [v.base.toLowerCase(), k]));

export function kindForBase(base) {
  return BASE_TO_KIND[String(base || '').toLowerCase()] || null;
}

export const opposite = (side) => (side === 'debit' ? 'credit' : 'debit');

/** Bill types: model name -> Tally BILLTYPE. */
export const BILL_TYPES = { new: 'New Ref', against: 'Agst Ref', advance: 'Advance', 'on-account': 'On Account' };

/** Bank transaction types: model mode -> Tally TRANSACTIONTYPE. */
export const BANK_MODES = {
  cheque: 'Cheque',
  'cheque/dd': 'Cheque/DD',
  neft: 'e-Fund Transfer',
  rtgs: 'e-Fund Transfer',
  imps: 'e-Fund Transfer',
  'e-fund-transfer': 'e-Fund Transfer',
  upi: 'UPI',
  'inter-bank': 'Inter Bank Transfer',
  'same-bank': 'Same Bank Transfer',
  card: 'Others',
  others: 'Others',
  cash: 'Cash',
};
