# How the tool talks to Tally

Reference for extending the tool. Sources: Tally's developer documentation (help.tallysolutions.com:
"Sample XML", "XML interface", "Pre-requisites for integrations", integration case studies) and
widely used open-source integrations. Behaviour that Tally does not document is listed at the end;
`tally selftest` checks it on each site.

## Transport

- HTTP POST to Tally's port (default `http://127.0.0.1:9000`), one request at a time (the tool
  serialises requests across processes with a lock file in `.tally/`).
- Body encoded as UTF-16LE with `Content-Type: text/xml;charset=utf-16` (UTF-8 is available with
  `--encoding utf8`). Replies are decoded by sniffing the bytes.
- Replies may contain character references that are not legal XML, such as `&#4;`, which Tally puts in
  front of system names (`&#4; Primary`, `&#4; Not Applicable`). The parser keeps them; `cleanText`
  strips them for display.
- `node:http` is used rather than `fetch` because long exports can exceed fetch's 5-minute header limit.

## Requests

```xml
<ENVELOPE>
  <HEADER><VERSION>1</VERSION><TALLYREQUEST>Export|Import|Execute</TALLYREQUEST>
          <TYPE>Data|Collection|Object|Function|TDLAction</TYPE><ID>name</ID></HEADER>
  <BODY><DESC><STATICVARIABLES>...</STATICVARIABLES><TDL><TDLMESSAGE>...</TDLMESSAGE></TDL></DESC>
        <DATA><TALLYMESSAGE>...</TALLYMESSAGE></DATA></BODY>
</ENVELOPE>
```

Static variables used: `SVEXPORTFORMAT` (`$$SysName:XML`), `SVCURRENTCOMPANY` (always sent when a company
is configured), `SVFROMDATE` / `SVTODATE` (`TYPE="Date"`, values like `1-Apr-2026`), `IMPORTDUPS`.

Builders: `src/core/envelope.mjs` (`exportData`, `exportCollection`, `exportObject`, `exportFunction`,
`importData`, `execute`).

## Reads: inline flat reports

Curated reads do not depend on the layout of Tally's built-in reports. Each request defines a tiny
report (`src/core/tdl.mjs` `flatReport`) that walks a collection and emits one `<ROW>` per object with
chosen fields:

```xml
<REPORT NAME="TCReport"><FORMS>TCForm</FORMS></REPORT>
<FORM NAME="TCForm"><PARTS>TCPart1</PARTS><XMLTAG>DATA</XMLTAG></FORM>
<PART NAME="TCPart1"><LINES>TCLine1</LINES><REPEAT>TCLine1 : TCColl</REPEAT><SCROLLED>Vertical</SCROLLED></PART>
<LINE NAME="TCLine1"><FIELDS>TCFld01,TCFld02</FIELDS><XMLTAG>ROW</XMLTAG></LINE>
<FIELD NAME="TCFld01"><SET>$Name</SET><XMLTAG>F01</XMLTAG></FIELD>
<COLLECTION NAME="TCColl"><TYPE>Ledger</TYPE><FILTER>TCFilter1</FILTER></COLLECTION>
<SYSTEM TYPE="Formulae" NAME="TCFilter1">$$IsEqual:$Parent:"Sundry Debtors"</SYSTEM>
```

Sub-collections (voucher lines, bill allocations) use one extra PART per level joined with `<EXPLODE>`;
fields at the leaf can read parent values (`$Date` on a ledger entry resolves to the voucher's date).

Field formulas by type (`fieldFormula`):

| Type | Formula | Result |
|---|---|---|
| amount | `$$StringFindAndReplace:(if $$IsDebit:$X then -$$NumValue:$X else $$NumValue:$X):"(-)":"-"` | debit negative |
| date | `if $$IsEmpty:$X then "" else $$PyrlYYYYMMDDFormat:$X:"-"` | `2026-04-01` |
| logical | `if $X then 1 else 0` | 1 / 0 |
| number | `if $$IsEmpty:$X then 0 else $$StringFindAndReplace:($$String:$X):"(-)":"-"` | number |
| qty, rate | `$X` (parsed: `" 10 Nos"`, `"1000.00/Nos"`) | `{qty, unit}`, `{rate, per}` |

Usage in code:

```js
const rows = await ctx.client.rows(
  { collection: { type: 'Voucher', route: ['AllLedgerEntries'], filters: ['NOT $IsCancelled'] },
    fields: [{ key: 'guid', method: 'Guid' }, { key: 'ledger', method: 'LedgerName' }, { key: 'amount', method: 'Amount', type: 'amount' }] },
  { from: '2026-04-01', to: '2026-06-30', chunk: true });   // chunk: month by month, halving on timeouts
```

Useful methods: Company `Name, BooksFrom, AltMstId, AltVchId`; Ledger `Name, Parent, OpeningBalance,
ClosingBalance, DebitTotals, CreditTotals, PartyGSTIN, LedGSTRegDetails[Last].GSTIN, IsBillWiseOn,
BillCreditPeriod, LedStateName, Email, LedgerMobile, GSTDutyHead`; StockItem `BaseUnits, OpeningBalance,
ClosingBalance, ClosingValue, InfGSTHSNCode, InfGSTIGSTRate`; Voucher `Guid, MasterId, AlterId, Date,
VoucherTypeName, VoucherNumber, PartyLedgerName, IsOptional, IsCancelled` with lists `AllLedgerEntries`
(`LedgerName, Amount, BillAllocations, BankAllocations, CategoryAllocations`) and `AllInventoryEntries`
(`StockItemName, ActualQty, Rate, Amount, BatchAllocations, AccountingAllocations`); Bill (pending bills)
`Name, BillDate, ClosingBalance, Parent, _OverDueDays`. Receivables filter:
`$$IsEqual:($_PrimaryGroup:Group:($Parent:Ledger:$Parent)):"Sundry Debtors"`.

Escape hatches: `tally query collection` (any collection and fields), `tally query native` (Tally's own
XML for objects), `tally query object`, `tally query function`, `tally query formula`,
`tally report run "<built-in report>"`, `tally raw <file>`.

## Writes

Import with `TALLYREQUEST Import`, `TYPE Data`, `ID` `All Masters` or `Vouchers`.

- Masters: `<LEDGER NAME="x" ACTION="Create|Alter|Delete">`; rename with an inner name. Create uses
  `IMPORTDUPS @@DUPIGNORECOMBINE` so an existing master's opening balance is never added twice.
- Vouchers: debit = `ISDEEMEDPOSITIVE Yes` with a negative `AMOUNT`; credit = `No` with a positive
  `AMOUNT`. Accounting vouchers use `ALLLEDGERENTRIES.LIST`; invoices use `LEDGERENTRIES.LIST` for
  party/tax/charges and `ALLINVENTORYENTRIES.LIST` with `BATCHALLOCATIONS.LIST` and
  `ACCOUNTINGALLOCATIONS.LIST`; stock journals use `INVENTORYENTRIESOUT.LIST` / `INVENTORYENTRIESIN.LIST`.
  Body dates are `YYYYMMDD`.
- Existing vouchers are addressed as in Tally's documentation:
  `<VOUCHER DATE="2-Apr-2008" TAGNAME="Voucher Number" TAGVALUE="3" VCHTYPE="Sales" ACTION="Alter|Cancel|Delete">`,
  or by master id when the number is not unique.
- Replies: `RESPONSE` or `ENVELOPE/BODY/DATA/IMPORTRESULT` with `CREATED, ALTERED, DELETED, CANCELLED,
  COMBINED, IGNORED, ERRORS, EXCEPTIONS, LASTVCHID`, and `LINEERROR` messages (`parseImportReply`).

## Behaviour checked per site (`tally capabilities`)

| Id | Assumed | Meaning |
|---|---|---|
| export.flatReport | yes | Inline reports work (everything depends on it) |
| export.rowWrapper | yes | Rows come wrapped in `<ROW>`; otherwise split at the first field |
| export.voucherObject | no | Object export of a voucher by master id |
| import.remoteIdUpsert | no | Same REMOTEID alters instead of duplicating (used only if confirmed) |
| import.tagMasterId | `MASTER ID` | TAGNAME for addressing by master id |
| import.alterKeepsLists | no | Header-only alters keep entries (otherwise full vouchers are sent) |
| import.optionalStaysOut | yes | Optional vouchers stay out of balances |
| entries.includeInventoryAllocations | yes | An invoice's AllLedgerEntries include the sales/purchase ledger |
| encoding.utf8 | no | UTF-8 requests work |

Tally's JSON interface (TallyPrime 7.0 and later) is reachable through `tally raw` with the request
metadata in HTTP headers (`tallyrequest`, `type`, `id`, `version`).
