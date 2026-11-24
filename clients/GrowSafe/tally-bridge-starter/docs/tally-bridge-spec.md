# GrowSafe Tally Bridge · Build Spec

For Akash's Claude (HQ and the BRIDGE session). Read with `bridge/README.md` and `supabase/migrations/20261125000000_tally_bridge.sql`. This spec and the starter code in `bridge/` implement Akash's five points; the BRIDGE session's job is to install, test on a copy of one company, and adjust, not to rewrite from zero.

## 1. Akash's five points (the requirement, verbatim)

1. TallyPrime bridge should use incremental sync for new or changed entries only.
2. New or updated masters are authorised on app then synced back to TallyPrime.
3. New vouchers like Sales, Payments, Receipts, Credit Notes, Debit Notes are synced into Tally as Optional vouchers. Then converted to regular vouchers by accountant manually.
4. The app we are building here will be a layer over this Tally synced database and only affect it after some approval mechanism.
5. App users (all staff etc) will be mapped to their expense or salary ledger or cost center inside user profile just by selection from Tally data. Sales people will be assigned dealers by assigning Group (maintained inside Tally) for their performance measurement & analysis.

## 2. The pieces

```
TallyPrime (Tally server, accounts LAN)
   ^  |  XML over localhost:9000
   |  v
bridge/ (Node.js, scheduled task on the Tally server)
   reader.js     Tally -> Supabase: masters, then vouchers, by AlterID; deletions by GUID comparison
   writer.js     Supabase -> Tally: approved rows only; ledgers created; vouchers as Optional
   reconcile.js  daily ledger balance check
   |  HTTPS out only (secret key in bridge/.env on the server)
   v
Supabase (Mumbai)
   tally_*                 read-only copy of Tally
   bridge_*                sync state, runs, reconciliations, the approval queue
   app_*                   approval rules, point 5 mapping
   views                   v_tally_ledger_balance, v_salesperson_dealers
   ^
   | the app (development PC builds it; Vercel serves it)
GrowSafe OS
```

## 3. Reading (points 1 and 4)

- Masters in order: Group, Ledger, CostCentre, StockGroup, StockItem, Unit, Godown, VoucherType. Each request filters `$AlterID > last` per company; `bridge_sync_state` keeps the last AlterID per master type and for vouchers.
- First voucher load: month by month from `booksFrom` (4 to 5 years). After that: one request with `$AlterID > last`.
- Each voucher is saved with its ledger entries and inventory entries (batches and bill references as JSON) through `bridge_upsert_vouchers`, which replaces the lines of a changed voucher in one transaction.
- Deleted vouchers do not appear in an AlterID sync: `detectDeletions` compares GUIDs month by month and marks missing ones `is_deleted`; the monthly counts are stored in `bridge_reconciliations` (kind `voucher_counts`).
- The app never writes `tally_*` tables (no RLS write policy; only the secret key writes).

**Not yet in the starter code (add on the test copy, in this order):** batch master details (manufacturing and expiry dates) and price levels on stock items; the daily stock summary by godown and batch, compared Tally against the app; party outstanding by bill. The starter code already reconciles ledger closing balances (`reconcile.js`) and monthly voucher counts (`detectDeletions`).

**Verify on the test copy:** that the Voucher collection with `ALLLEDGERENTRIES` and `ALLINVENTORYENTRIES` in FETCH returns the lines for both invoice and accounting views; that Optional vouchers are included in the export (they must be, so the app can confirm them); field names of GST on ledgers for the installed TallyPrime release.

## 4. Writing (points 2, 3 and 4)

- The app inserts a row into `bridge_writeback_queue` as `draft` (kind `master` or `voucher`, `object_type` = `Ledger` or the Tally voucher type name, `payload` JSON). A person allowed by `app_approval_rules` calls `app_approve_writeback`.
- The writer claims approved rows (`bridge_claim_writebacks` marks them `sending` in one step), checks every name against the copy of Tally, and sends:
  - **Ledger create:** `buildLedgerCreate` (name, parent group, GSTIN and registration type, state, address, mobile, email, bill-wise). Refused if the name already exists or the parent group does not.
  - **Voucher as Optional:** `buildOptionalVoucher` with `ISOPTIONAL=Yes`; narration ends with `[GSOS:<queue id>]`. Amounts use Tally's sign: negative = debit, positive = credit; ledger plus inventory amounts must sum to zero (checked before sending).
- Tally's reply is parsed (`CREATED`, `ERRORS`, `LINEERROR`) and stored on the row: `sent` or `failed` with Tally's reason. A timeout becomes `check_in_tally` and is never resent automatically.
- The next sync calls `bridge_confirm_writebacks`: a voucher found with its tag becomes `in_tally_optional`, and `converted` once the accountant makes it regular; a ledger found by name becomes `in_tally`.
- `config.json` gates writing: `write.enabled`, the allowed master and voucher types, and `allowLiveCompanies` (false until M8).

### Voucher payload examples

Sales (invoice view, goods out):
```json
{ "voucherType": "Sales", "date": "2026-11-25", "partyLedger": "Sharma Traders", "narration": "Order from app",
  "inventoryEntries": [{ "item": "Bio Gold 1L", "qty": 10, "unit": "Ltr", "rate": 100, "amount": 1000,
                         "salesLedger": "Sales GST 18%", "godown": "Main Location", "batch": "B-101" }],
  "ledgerEntries": [{ "ledger": "Sharma Traders", "amount": -1180, "isParty": true, "billRef": { "name": "APP-0001", "type": "New Ref" } },
                    { "ledger": "Output IGST 18%", "amount": 180 }] }
```
Receipt (bank debit, party credit against a bill):
```json
{ "voucherType": "Receipt", "date": "2026-11-25",
  "ledgerEntries": [{ "ledger": "HDFC Bank", "amount": -5000 },
                    { "ledger": "Sharma Traders", "amount": 5000, "isParty": true, "billRef": { "name": "INV-77", "type": "Agst Ref" } }] }
```
Payment: party debit (negative), bank credit (positive). Credit Note (sales return): inventory amount negative (goods in), party credit. Debit Note: the reverse. GST lines are computed by the app from Tally's tax ledgers and rates and shown to the approver; the accountant checks them when converting the Optional voucher.

**Next, once ledger creation is proven:** stock item creation (name, group, base unit, HSN and GST rate), then alteration of existing masters (Tally's `ACTION="Alter"` with the old name), each behind its own approval type.

## 5. Point 5: mapping

- `app_profile_tally_links`: profile to expense ledger, salary ledger and cost centre, chosen from `tally_ledgers` and `tally_cost_centres` (pickers only, never typed).
- `app_salesperson_groups`: profile to one or more Tally groups; `v_salesperson_dealers` expands sub-groups and lists every dealer ledger under them. Performance (sales, receipts, outstanding) is read from `tally_vouchers` and `tally_ledger_entries` for those ledgers.

## 6. Safety rules (never break these)

1. Nothing reaches Tally except approved queue rows. 2. Vouchers only as Optional. 3. Names only from the copy of Tally. 4. Every voucher tagged; nothing sent twice. 5. Unknown results are checked by a person, not resent. 6. Mismatches flagged, never fixed silently. 7. Test copy first, one type at a time; live only with `allowLiveCompanies`. 8. The secret key lives only in `bridge/.env` on the Tally server and in Vercel's settings.

## 7. Test protocol (on the test copy)

| Case | Expected |
|---|---|
| New dealer ledger with GSTIN | Created; app shows `in_tally` |
| Ledger name that already exists | Refused before sending |
| Sales with batch and godown | Optional voucher in Tally; `in_tally_optional` |
| Accountant converts it | `converted` after next sync |
| Same row sent twice (re-approve or crash) | Second send blocked (claim) or skipped (tag found) |
| Wrong ledger name in a voucher | Refused before sending, reason shown |
| Unbalanced voucher | Refused before sending |
| Receipt, Payment, Credit Note, Debit Note | Each arrives Optional and converts |
| Voucher deleted in Tally | Marked deleted after the deletion check |
| Tally closed during a send | Row goes to `check_in_tally`; a person checks Tally |
