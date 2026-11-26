# Voucher JSON

One format covers every voucher: it is accepted by `voucher create`, `voucher validate`,
`voucher prepare`, `import vouchers` and the `post ...` shortcuts, and `voucher get` returns the same
shape, so a voucher can be read, edited and posted again.

Rules that prevent accounting mistakes:

- **Amounts are always positive.** The side is the key: `"debit": 500` or `"credit": 500`. For
  invoices the sides follow from the kind (a sales invoice debits the party).
- **Dates are `YYYY-MM-DD`.**
- **Quantity, unit and rate are separate**: `"qty": 10, "rate": 95`. The unit comes from the item.
- **Names must exist in Tally.** Case and extra spaces are forgiven; anything else is reported with
  suggestions. Use `tally ledger search` / `tally item search`.
- **Prices are never invented**: every item needs a `rate` from the caller.
- **Money has at most 2 decimals**; more is rejected, never rounded silently. Rates may have 4.
- **Everything is checked before sending**: debits equal credits, bill amounts add up, masters exist,
  dates are allowed. All problems are reported together (`error.details.problems`).

Validate any file with `tally voucher validate --input file.json`; preview the exact XML with
`tally voucher create --input file.json --dry-run`.

## Common fields

| Field | Meaning |
|---|---|
| `kind` | `receipt`, `payment`, `contra`, `journal`, `sales`, `purchase`, `credit-note`, `debit-note`, `sales-order`, `purchase-order`, `delivery-note`, `receipt-note`, `stock-journal` |
| `voucherType` | A custom voucher type (e.g. "Sales - Retail"); its base type must match `kind`. Default: the standard type of the kind |
| `date` | Voucher date |
| `number` | Voucher number; omit for Tally's automatic numbering |
| `reference` | `"PO-88"` or `{"number": "PO-88", "date": "2026-11-01"}` (supplier bill number for purchases) |
| `narration` | Text |
| `party` | Party ledger (required for invoices; recommended for receipts and payments) |
| `optional` | `true` creates an optional voucher (forced on in `optional` write mode) |
| `idempotencyKey` | Your unique id for this voucher (invoice id, bank transaction id). Re-sending the same key never posts twice |
| `raw` | Extra Tally tags for the voucher, e.g. `{"voucher": {"VCHGSTCLASS": "..."}}` |

## Accounting vouchers (receipt, payment, contra, journal)

```json
{
  "kind": "receipt",
  "date": "2026-11-24",
  "party": "Alpha Hardware Stores",
  "narration": "NEFT received",
  "entries": [
    { "ledger": "Bank of Example - Current A/c", "debit": 50000,
      "bank": { "mode": "neft", "instrumentNumber": "UTR123", "instrumentDate": "2026-11-24" } },
    { "ledger": "Alpha Hardware Stores", "credit": 50000,
      "bills": [ { "type": "against", "ref": "SI/26-27/0040", "amount": 43853 },
                 { "type": "on-account", "amount": 6147 } ] }
  ]
}
```

Entry fields: `ledger`, `debit` or `credit`, optional `bills`, `bank`, `costCentres`, `raw`.

- `bills`: for parties that keep bill-wise details (most customers and suppliers) a receipt or payment
  **must** say what it settles: `type` is `new`, `against`, `advance` or `on-account`; `ref` is the bill
  name; amounts must add up to the entry. `"bills": "on-account"` is a shortcut. Pending bills:
  `tally party bills "<party>"`.
- `bank`: `mode` is `cheque`, `neft`, `rtgs`, `imps`, `upi`, `others` or `cash` (or give Tally's own
  `transactionType`); `instrumentNumber`, `instrumentDate`, `bankName`, `upiId`, `bankersDate`.
- `costCentres`: `[{"category": "Primary Cost Category", "name": "Mumbai Branch", "amount": 1000}]`
  adding up to the entry.

Shortcuts: `tally post receipt --party ... --amount ... --bank ... --against REF` (or `--auto-allocate`
to settle the oldest bills first), `tally post payment ...`, `tally post contra --from ... --to ...`,
`tally post journal --debit ... --credit ... --amount ...`.

## Invoices (sales, purchase, credit and debit notes, orders, delivery and receipt notes)

```json
{
  "kind": "sales",
  "date": "2026-11-24",
  "number": "SI/26-27/0101",
  "party": "City Lights Traders",
  "items": [
    { "item": "MCB 32A Double Pole", "qty": 20, "rate": 520, "ledger": "Sales GST 18%" },
    { "item": "LED Bulb 9W", "qty": 100, "rate": 95, "discountPct": 5, "ledger": "Sales GST 12%", "godown": "Main Location" }
  ],
  "charges": [ { "ledger": "Freight Outward", "amount": 450, "gstRate": 18 } ],
  "taxes": "auto",
  "roundOff": "auto",
  "expectedTotal": 22911
}
```

- `items`: `item`, `qty`, `rate`, `ledger` (the sales or purchase ledger; or set `salesLedger` /
  `purchaseLedger` once for all items), optional `discountPct`, `amount` (checked against
  qty x rate less discount), `godown`, `batch`, `gstRate` (default: the item's rate in Tally),
  `orderNo`, `dueDate`.
- `charges`: extra ledger lines such as freight or packing (added to the invoice), or discounts with
  `"deduct": true` (subtracted). `gstRate` makes a charge part of the taxable value.
- `taxes`: `"auto"` (default when items have GST rates) computes CGST+SGST or IGST from the company state
  and the place of supply (`placeOfSupply`, else the party's state) using the ledgers in the profile
  (`gst.ledgers.output` for sales, `gst.ledgers.input` for purchases; `gst.byRate` for per-rate ledgers).
  `"none"` adds no tax lines. Or give them yourself: `[{"ledger": "Output CGST", "amount": 936}, ...]`.
- `roundOff`: `"auto"` rounds the total to the nearest rupee using `roundOffLedger`; or
  `{"ledger": "Round Off", "amount": -0.4}` (negative reduces the total).
- `bills`: party bill allocation. Default for a bill-wise party: a new bill named after `number`, with
  the party's credit days. A credit note against an invoice: `[{"type": "against", "ref": "SI/26-27/0040"}]`.
- `expectedTotal`: refuse unless the computed total matches exactly. Recommended for AI callers.

| Kind | Party side | Stock |
|---|---|---|
| sales, debit-note, sales-order, delivery-note | debit | out |
| purchase, credit-note, purchase-order, receipt-note | credit | in |

A service invoice without stock: leave out `items` and put the income lines in `charges`.

Shortcut for one item: `tally post sales --party ... --item ... --qty ... --rate ... --ledger ... --number ...`.

## Stock journal

Transfer between godowns:

```bash
tally post stock-journal --item "LED Panel 18W" --qty 20 --rate 470 --from-godown "Main Location" --to-godown "Pune Warehouse"
```

Manufacturing or consumption:

```json
{
  "kind": "stock-journal",
  "date": "2026-11-24",
  "consumed": [ { "item": "Copper Wire 1.5 sqmm (90 m)", "qty": 2, "rate": 1180, "godown": "Main Location" } ],
  "produced": [ { "item": "Distribution Board 8 Way", "qty": 1, "rate": 2360, "godown": "Main Location" } ]
}
```

## Changing existing vouchers

- `tally voucher update --master-id N --narration "..." --yes` (or `--input changes.json` with any
  fields, e.g. new `items`; when items or charges change, GST and round off are recomputed). The whole voucher is rebuilt from what the tool reads and sent back, and the
  previous version is kept in the audit log: `tally voucher undo --audit-seq <n> --yes` restores it.
- `tally voucher cancel --master-id N --reason "..." --yes` (preferred to delete)
- `tally voucher delete --master-id N --yes` (undo re-creates it)
- `tally voucher regularise --master-id N --yes` turns an optional voucher into a regular one
  (needs write mode `on`; in Tally: open it and press Ctrl+L)

`--if-alter-id <alterId from voucher get>` refuses the change if someone edited the voucher meanwhile.

Fields the tool does not model (some GST and e-invoice details) are not carried over by an update.
For vouchers with such details, capture a template from a correct voucher once
(`tally voucher template capture --master-id N`) so new vouchers of that type include the site's
static tags, and make corrections to e-invoiced vouchers in Tally itself (the tool refuses them).

## Approval flows

`tally voucher prepare --input file.json` validates and stores the voucher as a plan (24 hours) and
returns a `planId` and a summary to show to a person. `tally voucher commit --plan-id <id>` posts
exactly that plan, once. Optional write mode plus regularising in Tally is the other approval flow.
