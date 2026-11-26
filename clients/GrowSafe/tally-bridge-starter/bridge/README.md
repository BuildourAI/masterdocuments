# GrowSafe Tally Bridge

Built for GrowSafe to Akash's five points:

1. Incremental sync: only new or changed masters and vouchers (Tally's alter ids).
2. New masters are approved in the app, then created in TallyPrime (ledgers first).
3. Sales, Payments, Receipts, Credit Notes and Debit Notes go into TallyPrime as **Optional** vouchers; the accountant converts them to regular vouchers by hand.
4. The app is a layer over the synced copy of Tally and changes Tally only through the approval queue.
5. Staff map to their expense or salary ledger or cost centre, and salespeople to dealer groups, all chosen from Tally's own lists.

## Two parts, side by side on the Tally server

| Folder | What it does |
|---|---|
| `tally-cli/` | Talks to TallyPrime on `localhost:9000`: reads, validates, writes Optional vouchers, refuses to post anything twice, keeps an audit log. It has its own README, CLAUDE.md and docs. |
| `bridge/` (this folder) | Moves data between tally-cli and Supabase: the copy of Tally, the approval queue, the confirmation loop, the daily checks. It never talks to Tally itself. |

The bridge connects **out** to Supabase over HTTPS. Nothing on the server is opened to the internet.

**Status:** both parts are tested against tally-cli's Tally simulator. The bridge's tests (`npm test`) cover a full first load, an incremental sync, all five voucher types written as Optional and confirmed, conversion by the accountant, double-send protection, safety switches and deletions. The balance check matches Tally exactly. **They have not yet run on GrowSafe's TallyPrime**: run every step below on a **test copy of one company** first.

## One-time setup on the Tally server (over Remote Desktop)

1. **TallyPrime:** F1 Help > Settings > Connectivity > Client/Server configuration: *TallyPrime acts as* **Both**, *Port* **9000**. Restart TallyPrime and keep it open with the companies loaded. Set Windows never to sleep.
2. **Test company:** back up one company and restore it under a new name, e.g. `GrowSafe TEST COPY`.
3. **Node.js LTS** from nodejs.org.
4. **Folders:** copy `tally-cli` and `bridge` to `C:\GrowSafe\tally-cli` and `C:\GrowSafe\bridge` (side by side). In `C:\GrowSafe\bridge` run `npm install --omit=dev`.
5. **tally-cli profiles** (in `C:\GrowSafe\tally-cli`, PowerShell):
   ```
   .\tally.cmd doctor
   .\tally.cmd init --company "GrowSafe TEST COPY" --profile test-copy --no-make-default
   .\tally.cmd selftest --profile test-copy
   ```
   Writes stay **off**. Each live company gets its own profile the same way (for example `--profile live-1`).
6. **Bridge settings:** copy `config.example.json` to `config.json` (exact company names, each with its tally-cli profile). Copy `.env.example` to `.env` and type the Supabase URL and **secret key** yourself. `.env`, `config.json` and `tally-cli\tally.config.json` never go to GitHub.
7. **Database:** the HQ session applies `supabase/migrations/20261125000000_tally_bridge.sql` to the Supabase project (from the development PC).

## Milestones (in order; each one checked before the next)

| # | On the server | Done when |
|---|---|---|
| M1 | `node src/index.js test` | tally-cli's doctor passes for each company and Supabase answers. Nothing is written into Tally. |
| M2 | `node src/index.js sync-once` (test copy) | The first load runs one financial year at a time; ledger and voucher counts match Tally. |
| M3 | `node src/index.js reconcile` and `node src/index.js deletions` | `bridge_reconciliations` shows 0 mismatches (or each one explained by accounts). |
| M4 | `scripts\install-task.cmd` (as Administrator), then `schtasks /Run /TN "GrowSafe Tally Bridge"` | After a restart the bridge starts by itself; new Tally entries reach the app within minutes. |
| M5 | Add the live companies (writes off) | Seven days of matching reconciliations. |
| M6 | Write self-test on the test copy (below), then switch the test-copy profile to Optional mode (below) and set `write.enabled: true`; approve one new dealer ledger in the app; `node src/index.js write-once` | The ledger appears in the TEST COPY with correct GST details; the app shows `in_tally`. |
| M7 | Approve one voucher of each type, one type at a time | Each arrives in the TEST COPY as **Optional**; the accountant converts it; the app shows `in_tally_optional`, then `converted`. A wrong name is refused with the reason. |
| M8 | A live company's profile in Optional mode, `write.allowLiveCompanies: true`, one type at a time | Same checks as M7 on the live company. |

**Write self-test (M6, test copy only):** tally-cli creates, checks and removes its own records, and confirms that Optional vouchers stay out of balances on this TallyPrime:
```
.\tally.cmd init --company "GrowSafe TEST COPY" --profile selftest --write-mode on --allow-destructive --no-make-default
.\tally.cmd selftest --profile selftest --write --confirm-company "GrowSafe TEST COPY"
```
**Optional mode for the bridge's profile:**
```
.\tally.cmd init --company "GrowSafe TEST COPY" --profile test-copy --write-mode optional --allow-master-writes --no-make-default --force
```
then in `tally-cli\tally.config.json`, for that profile, set `"allowedVoucherTypes": ["Sales", "Receipt", "Payment", "Credit Note", "Debit Note"]`, `"requireIdempotencyKey": true`, and a `"maxAmount"` and `"lockBefore"` that accounts agree.

## What the app puts in the approval queue

`bridge_writeback_queue.payload` is tally-cli's voucher JSON (see `tally-cli/docs/VOUCHERS.md`); `object_type` is the voucher type. The bridge adds the kind, the tag `[GSOS:<queue id>]` in the narration and the idempotency key. Ledgers use tally-cli's ledger fields (`name`, `group`, `gstin`, `gstRegistrationType`, `state`, `billWise`, `creditDays`, ...). Examples are in `docs/tally-bridge-spec.md`.

## Commands

```
node src/index.js test         read-only checks (tally-cli doctor, Supabase)
node src/index.js sync-once    one incremental sync of every company
node src/index.js deletions    find vouchers deleted in Tally
node src/index.js reconcile    compare ledger balances, Tally against the app
node src/index.js write-once   send approved items (only when write.enabled)
node src/index.js run          keep running on the schedule in config.json (what the scheduled task runs)
npm test                       tests against tally-cli's simulator and an in-memory database (needs npm install with dev dependencies)
```

Logs are in `logs\`; tally-cli keeps its own audit log of every write in `tally-cli\.tally\audit.jsonl`. To stop the bridge: `scripts\uninstall-task.cmd` (nothing in Tally or Supabase is deleted).

## Rules this code keeps

- Nothing reaches Tally except rows in `bridge_writeback_queue` that a permitted person approved (`app_approve_writeback`).
- tally-cli's profile decides what may be written at all: Optional vouchers only, the five voucher types, ledgers, an amount cap, a lock date, the pinned company.
- A row is claimed before sending; vouchers carry an idempotency key, so a repeat is never posted twice. If Tally's answer is unknown, the row goes to `check_in_tally` and is **not** resent automatically. If Tally cannot be reached, nothing was sent and the row waits in the queue.
- tally-cli checks every name, the totals and the bill details before sending, and Tally's or tally-cli's exact reason is stored on a failed row.
- Reconciliation differences are recorded and shown, never corrected automatically.
- The `tally_*` tables are a read-only copy: only the bridge (secret key) writes them, through the `bridge_*` database functions.
