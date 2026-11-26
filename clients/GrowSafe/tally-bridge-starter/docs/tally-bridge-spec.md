# GrowSafe Tally Bridge · Build Spec

For Akash's Claude (HQ and the BRIDGE session). Read with `bridge/README.md`, `tally-cli/README.md` and `supabase/migrations/20261125000000_tally_bridge.sql`. This spec, tally-cli and the code in `bridge/` implement Akash's five points; the BRIDGE session's job is to install, test on a copy of one company, and adjust, not to rewrite from zero.

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
tally-cli/   reads, validates, writes Optional vouchers and ledgers, idempotency keys, audit log, doctor, selftest, simulator
   ^  |  JSON (the bridge runs tally-cli commands)
   |  v
bridge/ (Node.js, scheduled task on the Tally server)
   reader.js     Tally -> Supabase: masters, then vouchers, by alter id; deletions by comparing voucher ids
   writer.js     Supabase -> Tally: approved rows only; ledgers created; vouchers as Optional
   reconcile.js  daily ledger balance check
   |  HTTPS out only (secret key in bridge/.env on the server)
   v
Supabase (Mumbai)
   tally_*                 read-only copy of Tally
   bridge_*                sync state, runs, reconciliations, the approval queue, the functions the bridge calls
   app_*                   approval rules, point 5 mapping
   views                   v_tally_ledger_balance, v_salesperson_dealers
   ^
   | the app (development PC builds it; Vercel serves it)
GrowSafe OS
```

tally-cli is used as it is; the bridge never builds Tally XML. Its documentation (`tally-cli/README.md`, `CLAUDE.md`, `docs/`) applies in full: read `docs/SAFETY.md` before switching any write on.

## 3. Reading (points 1 and 4)

- Before each read the bridge takes Tally's change counters (`tally sync status`); afterwards it stores them in `bridge_sync_state` (`masters`, `vouchers`). Anything changed during a read is picked up next time.
- Masters in order: groups, ledgers, cost centres, stock groups, units, godowns, stock items, voucher types (`tally export <dataset> --since-alter-id`).
- First voucher load: one financial year at a time from `booksFrom` (tally-cli splits each year month by month and retries smaller windows if Tally is slow). After that: only vouchers altered since the last counter.
- Each voucher is saved with its ledger lines (bill references and cost centres inside), inventory lines (godown and batches inside), its base type, and Optional and cancelled flags, through `bridge_upsert_vouchers`.
- Deleted vouchers never appear in an alter-id sync: `detectDeletions` compares voucher ids month by month and marks missing ones `is_deleted`; monthly counts go to `bridge_reconciliations` (kind `voucher_counts`).
- Orders, delivery and receipt notes, memoranda and stock-only vouchers are kept (sales reporting needs orders) but never count in balances (`tally_affects_books`).
- The app never writes `tally_*` tables (no RLS write policy; the bridge writes through the `bridge_*` functions with the secret key).

**Not yet in this code (add on the test copy, in this order):** batch manufacturing and expiry dates and price levels (from the stock item and batch masters, with `tally query collection`); the daily stock summary by godown and batch compared with Tally (`tally export stock`); party outstanding by bill compared with Tally (`tally export receivables`). The code already reconciles every ledger's closing balance (`reconcile.js`) and monthly voucher counts (`detectDeletions`).

## 4. Writing (points 2, 3 and 4)

- The app inserts a row into `bridge_writeback_queue` as `draft`: `kind` `master` or `voucher`, `object_type` `Ledger` or the voucher type (`Sales`, `Receipt`, `Payment`, `Credit Note`, `Debit Note`), `payload` in tally-cli's JSON. A person allowed by `app_approval_rules` calls `app_approve_writeback`.
- The writer claims approved rows (`bridge_claim_writebacks` marks them `sending` in one step), skips any voucher Tally already holds with its tag, and runs `tally voucher create` (idempotency key `gsos:<queue id>`, narration ending `[GSOS:<queue id>]`) or `tally ledger create`.
- tally-cli's profile (`tally-cli/tally.config.json`) is the second lock: `writeMode: "optional"` (every voucher Optional), `allowMasterWrites: true`, `allowedVoucherTypes`, `requireIdempotencyKey: true`, `maxAmount`, `lockBefore`, the pinned company id.
- Outcome on the row: `sent`; `failed` with tally-cli's or Tally's exact reason (a wrong name, unbalanced, missing bill reference, invalid GSTIN); `check_in_tally` when the result is unknown (never resent automatically); back to `approved` when Tally could not be reached (nothing was sent).
- The next sync calls `bridge_confirm_writebacks`: a voucher found with its tag becomes `in_tally_optional`, and `converted` once the accountant makes it regular; a ledger found by name becomes `in_tally`.
- `bridge/config.json` gates writing too: `write.enabled`, the allowed master and voucher types, `allowLiveCompanies` (false until M8).

### Payload examples (tally-cli voucher JSON; full reference in tally-cli/docs/VOUCHERS.md)

New dealer ledger (`kind` master, `object_type` Ledger):
```json
{ "name": "Sharma Agro Bhopal", "group": "MP Dealers", "gstin": "23AAFCA1111A1ZV", "gstRegistrationType": "Regular",
  "state": "Madhya Pradesh", "billWise": true, "creditDays": 30, "phone": "98xxxxxxxx" }
```
Sales (`object_type` Sales): GST computed by tally-cli from the profile's tax ledgers; the party keeps bill-wise details, so a bill reference is given.
```json
{ "date": "2026-11-25", "party": "Sharma Agro Bhopal", "narration": "Order from app",
  "items": [{ "item": "Bio Gold 1L", "qty": 10, "rate": 100, "ledger": "Sales GST 18%", "godown": "Main Location" }],
  "taxes": "auto", "roundOff": "auto", "bills": [{ "type": "new", "ref": "APP-0001" }] }
```
Receipt (`object_type` Receipt):
```json
{ "date": "2026-11-25", "party": "Sharma Agro Bhopal",
  "entries": [{ "ledger": "HDFC Bank", "debit": 5000 },
              { "ledger": "Sharma Agro Bhopal", "credit": 5000, "bills": [{ "type": "against", "ref": "APP-0001", "amount": 5000 }] }] }
```
Payment: party `debit`, bank `credit`. Credit Note: `items` returned with the sales ledger, `bills` against the invoice or `"on-account"`. Debit Note: the same with the purchase ledger and the supplier. The approver sees tally-cli's dry-run summary (`--dry-run`) before approving, when the app shows one.

**Next, once ledger creation is proven:** stock item creation (`tally item create`), then changes to existing masters (`tally ledger update`), each behind its own approval type and only with `allowMasterWrites`.

## 5. Point 5: mapping

- `app_profile_tally_links`: profile to expense ledger, salary ledger and cost centre, chosen from `tally_ledgers` and `tally_cost_centres` (pickers only, never typed).
- `app_salesperson_groups`: profile to one or more Tally groups; `v_salesperson_dealers` expands sub-groups and lists every dealer ledger under them. Performance (sales, receipts, outstanding) is read from `tally_vouchers` and `tally_ledger_entries` for those ledgers.

## 6. Safety rules (never break these)

1. Nothing reaches Tally except approved queue rows. 2. Vouchers only as Optional (tally-cli's profile in optional mode). 3. Names only from the copy of Tally. 4. Every voucher tagged; nothing sent twice. 5. Unknown results are checked by a person, not resent. 6. Mismatches flagged, never fixed silently. 7. Test copy first, one type at a time; live only with `allowLiveCompanies`. 8. The secret key lives only in `bridge/.env` on the Tally server and in Vercel's settings. 9. tally-cli's files under `src/` are not edited to make something work: first `tally doctor`, `tally selftest`, `tally explain`, and its docs/TROUBLESHOOTING.md.

## 7. Test protocol (on the test copy)

| Case | Expected |
|---|---|
| tally-cli write self-test on the test copy | Passes; Optional vouchers stay out of balances |
| New dealer ledger with GSTIN | Created; app shows `in_tally` |
| Ledger name that already exists | Refused before sending |
| Sales with batch and godown | Optional voucher in Tally; `in_tally_optional` |
| Accountant converts it | `converted` after next sync |
| Same row sent twice (re-approve or crash) | Second send blocked (claim), skipped (tag found) or refused (idempotency key) |
| Wrong ledger name in a voucher | Refused by tally-cli before sending, reason shown |
| GSTIN with a wrong check digit | Refused before sending |
| Unbalanced voucher | Refused before sending |
| Receipt, Payment, Credit Note, Debit Note | Each arrives Optional and converts |
| Voucher deleted in Tally | Marked deleted after the deletion check |
| Tally closed before a send | Nothing sent; the row waits as `approved` |
| Tally stops answering during a send | tally-cli searches Tally; if not found, `check_in_tally`; a person checks Tally |
| Educational mode (if used for rehearsal) | Only the 1st, 2nd and last day of a month accepted; other dates refused with the reason |
