# GrowSafe Tally Bridge: starter folder

| Folder | What it is |
|---|---|
| `tally-cli/` | The Tally connection: reads TallyPrime, writes Optional vouchers and ledgers with full checks, never posts twice, keeps an audit log. Includes a Tally simulator. Used as it is. |
| `bridge/` | GrowSafe's connector between tally-cli and Supabase: the copy of Tally, the approval queue, the confirmation loop, the daily checks. Start with `bridge/README.md`. |
| `supabase/migrations/` | The database side: Tally copy tables, approval queue and rules, staff and salesperson mapping, the functions the bridge calls. |
| `docs/tally-bridge-spec.md` | The build spec: Akash's five points, how reading and writing work, payload examples, the test protocol. |

In the GrowSafe-OS repository these go to `tally-cli/`, `bridge/`, `supabase/migrations/` and `docs/`. On the Tally server, `tally-cli` and `bridge` sit side by side (for example `C:\GrowSafe\tally-cli` and `C:\GrowSafe\bridge`).

Tests: `cd tally-cli && node --test` (tally-cli's own suite), and `cd bridge && npm install && npm test` (the bridge end to end against tally-cli's simulator and an in-memory database). Neither needs TallyPrime or Supabase.
