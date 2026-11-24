# GrowSafe Tally Bridge

Starter code written new for GrowSafe, to Akash's five points:

1. Incremental sync: only new or changed masters and vouchers (Tally's AlterID).
2. New masters are approved in the app, then created in TallyPrime (ledgers first).
3. Sales, Payments, Receipts, Credit Notes and Debit Notes go into TallyPrime as **Optional** vouchers; the accountant converts them to regular vouchers by hand.
4. The app is a layer over the synced copy of Tally and changes Tally only through the approval queue.
5. Staff map to their expense or salary ledger or cost centre, and salespeople to dealer groups, all chosen from Tally's own lists.

**Status:** first version. It is unit-tested offline (XML building and reading) and the database migration is tested, but it has **not yet been run against GrowSafe's TallyPrime**. Run every step below on a **test copy of one company** first. Field names can differ between TallyPrime releases (GST details on ledgers especially); adjust them with Claude on the test copy.

## Where things run

| Computer | What runs there |
|---|---|
| Akash's development PC | Claude Code, the GrowSafe-OS repository, the app |
| Tally server (accounts LAN, Remote Desktop) | TallyPrime, and this bridge (Node.js) as a background task |
| Supabase (Mumbai) | The copy of Tally, the approval queue, the app's data |

The bridge talks to TallyPrime at `localhost:9000` on the server and connects **out** to Supabase over HTTPS. Nothing on the server is opened to the internet.

## One-time setup on the Tally server (over Remote Desktop)

1. **TallyPrime:** F1 Help > Settings > Connectivity > Client/Server configuration: *TallyPrime acts as* **Both**, *Enable ODBC* **Yes**, *Port* **9000**. Keep TallyPrime open with the companies loaded. Set Windows never to sleep during working hours.
2. **Test company:** in TallyPrime, back up one company and restore it under a new name, for example `GrowSafe TEST COPY`. Every write test goes there first.
3. **Node.js LTS** from nodejs.org.
4. **This folder:** copy `bridge/` from the GrowSafe-OS repository to `C:\GrowSafe\bridge` (download the repository as a ZIP if the server has no Git). In that folder run `npm install --omit=dev`.
5. **Settings:** copy `config.example.json` to `config.json` and put the exact Tally company names. Copy `.env.example` to `.env` and type the Supabase URL and **secret key** yourself (Supabase > Project Settings > API Keys). `.env` and `config.json` never go to GitHub.
6. **Database:** the HQ session applies `supabase/migrations/20261125000000_tally_bridge.sql` to the new Supabase project (from the development PC).

## Milestones (do them in order; each one is checked before the next)

| # | Command on the server | Done when |
|---|---|---|
| M1 | `node src/index.js test` | It lists your Tally companies and says Supabase answers. Nothing is written into Tally. |
| M2 | `node src/index.js sync-once` (test company) | The first load runs month by month; ledger and voucher counts look right in the app. |
| M3 | `node src/index.js reconcile` and `node src/index.js deletions` | `bridge_reconciliations` shows 0 mismatches (or each one explained by accounts). |
| M4 | `scripts\install-task.cmd` (as Administrator), then `schtasks /Run /TN "GrowSafe Tally Bridge"` | Restart the server: the bridge starts by itself; new Tally entries appear in the app within minutes. |
| M5 | Add live companies to `config.json` | Seven days of matching reconciliations on the live companies. |
| M6 | In `config.json` set `write.enabled: true` (test company only) and approve one new dealer ledger in the app; `node src/index.js write-once` | The ledger appears in the TEST COPY with correct GST details; the app shows `in_tally`. |
| M7 | Approve one voucher of each type, one type at a time | Each arrives in the TEST COPY as **Optional**; the accountant converts it; the app shows `in_tally_optional`, then `converted`. Sending the same item twice does nothing. A wrong ledger name is refused with Tally's reason. |
| M8 | `write.allowLiveCompanies: true`, one voucher type at a time | Live company, same checks as M7. |

## Commands

```
node src/index.js test         read-only checks
node src/index.js sync-once    one incremental sync of every company
node src/index.js deletions    find vouchers deleted in Tally
node src/index.js reconcile    compare ledger balances, Tally against the app
node src/index.js write-once   send approved items (only when write.enabled)
node src/index.js run          keep running on the schedule in config.json (what the scheduled task runs)
npm test                       offline unit tests (no Tally, no Supabase needed)
```

Logs are in `logs\`. To stop the bridge: `scripts\uninstall-task.cmd` (nothing in Tally or Supabase is deleted).

## Rules this code keeps

- Nothing reaches Tally except rows in `bridge_writeback_queue` that a permitted person approved (`app_approve_writeback`).
- A row is claimed before sending, so it is never sent twice; if Tally's answer is unknown (timeout), the row goes to `check_in_tally` and is **not** resent automatically.
- Every name (ledger, item, godown, voucher type, cost centre, group) is checked against the copy of Tally before sending.
- Vouchers carry the tag `[GSOS:<queue id>]` in the narration; the next sync finds it and confirms the row.
- Reconciliation differences are recorded and shown, never corrected automatically.
- The `tally_*` tables are a read-only copy: only the bridge (secret key) writes them.
