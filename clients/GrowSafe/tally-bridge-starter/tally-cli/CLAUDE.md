# Playbook for AI coding agents working with this folder

This folder is **tally-cli**, a self-contained command-line bridge between AI systems and Tally
(TallyPrime / Tally.ERP 9). You are most likely here to install and wire it up on a business's PC,
with a person (the integrator and/or the business owner) watching. Follow this playbook. When in
doubt, prefer reading over writing, and ask the person before any step that writes to the books.

Golden rules:

1. **Never write to real books without the person's explicit go-ahead in this conversation.** Reads
   are always fine. Use `--dry-run` to show what a write would do.
2. **Never invent prices, rates, amounts, GSTINs or ledger names.** Get them from the person or from
   Tally (`tally ledger search`, `tally item search`, `tally party bills`).
3. **Keep the books' owner in control**: start with writes off, then `optional` mode (vouchers are
   created as optional and the accountant regularises them in Tally), and `on` only when asked.
4. Do not edit files under `src/` to make a command "work" unless the person agrees; first run
   `tally doctor`, `tally selftest` and `tally explain "<error text>"`, and read docs/TROUBLESHOOTING.md.
5. Do not commit or share `tally.config.json`, `.tally/` or anything under `artifacts/`: they contain
   site details. They are git-ignored.

Commands below use `tally`. On Windows that is `.\tally.cmd` in this folder (the `.\` is required in PowerShell), or `node bin\tally.mjs`;
on macOS/Linux `./tally` (or `node bin/tally.mjs`). Add `--json` when you need to parse output.

## 1. Prerequisites (check, do not assume)

- Node.js 20 or newer: `node -v`. If missing, ask the person to install the LTS version from
  nodejs.org (Windows installer, default options). Alternatively a portable `node.exe` can be put in
  `runtime\node.exe` inside this folder; `tally.cmd` uses it automatically.
- Tally running on this PC (or reachable on the network) with the company open.
- Tally's gateway enabled. TallyPrime: Help (F1) > Settings > Connectivity > Client/Server configuration:
  set "TallyPrime acts as" to **Server** (or Both), Port **9000**, then restart TallyPrime.
  Tally.ERP 9: F12 Configure > Advanced Configuration: Client/Server = Both or Server, port 9000.
  Ask the person to do this on screen if `doctor` cannot connect.
- Put this folder somewhere writable and stable, e.g. `C:\tally-cli` (avoid Program Files and
  folders that sync to the cloud).

## 2. Connect

```bash
tally doctor
```

Read every line. Fix failures in order (the hint on each line says how). Typical issues: Tally not
running, gateway off, wrong port, no company open, several companies open.

## 3. Create the profile (writes off)

```bash
tally init --company "<exact company name from doctor>"
```

This writes `tally.config.json` next to the tool, pins the company (name and internal id), detects
the GST tax ledgers, round-off ledger and the bank ledger, and reads the company's state. Show the
person the `settings` and `fillInByHand` parts of the output. If GST ledger names were not detected,
edit `tally.config.json` (`gst.ledgers.output` / `gst.ledgers.input`) with the person.

## 4. Smoke test the reads

```bash
tally status
tally company info
tally ledger list --under "Sundry Debtors" --limit 5
tally report receivables --detail false
tally voucher list --from <first day of this month>
tally report trial-balance --level group
```

Ask the person to compare one or two figures with Tally's own screens (for example the debtors total
and one party's balance). Differences are worth investigating before anything else.

## 5. Self-test (read-only)

```bash
tally selftest
```

This probes everything the tool relies on and stores the results (the tool adapts to them). Paste
the output back to the integrator if anything fails or warns.

## 6. Writes (only with the person's go-ahead)

1. Preferably on a **test company** first (in Tally: create a company, or restore a backup copy).
   Make a profile for it with writes on, then run the write self-test, which creates, checks and
   removes its own records:

   ```bash
   tally init --company "<test company>" --profile test --write-mode on --allow-destructive --no-make-default
   tally selftest --profile test --write --confirm-company "<test company>"
   ```

2. Switch the real profile to optional mode when the person agrees:

   ```bash
   tally init --profile default --company "<company>" --write-mode optional --force
   ```

3. Post one small, real example with `--dry-run` first, show the person the summary, then post it,
   and have the person find it in Tally (Day Book, Optional Vouchers report in optional mode).

Never enable `allowDestructive` (alter, cancel, delete) unless the person asks for it.

## 7. Wire it into the AI system

Ask which system will use it, then:

- **Claude Desktop / Claude Code on this PC**: `tally integrate --target claude-desktop` or
  `--target claude-code` prints the exact configuration (paths included). Tools are read-only unless
  the profile's `frontends.mcp` is raised to `write`.
- **n8n / Make / a backend on this network**: `tally token create <name> --scope read`, then
  `tally serve`. To keep it running, set it up as a scheduled task at logon (docs/SETUP.md).
- **A cloud AI system**: use the relay (`relay` section in docs/INTEGRATION.md). The office PC only
  makes outgoing HTTPS connections.
- **Data flowing out** (dashboards, reminders): `tally sync run --sink <folder or URL>` on a schedule,
  or `tally watch --sink <webhook>`.

## 8. Hand-over checklist

- [ ] `tally doctor` all pass (warnings explained to the person)
- [ ] `tally selftest` saved; write self-test passed on a test company (if writes are used)
- [ ] Profile write mode agreed with the owner and written down
- [ ] `doctor` shows Tally's port is not reachable from the network, or the person accepted the risk
- [ ] The AI system is connected and a read works end to end
- [ ] The person knows where the audit log is (`tally audit list`) and how to undo (`tally voucher undo`)
- [ ] Background services (serve, relay, watch, sync) set to start automatically, if used

## When a command fails

1. Read the error `code`, `message` and `hint`.
2. `tally explain "<Tally's message>"` for Tally's own errors.
3. Re-run with `--verbose` to see requests, and `--record artifacts/rec` to save request/reply files.
4. `tally capabilities` shows what the self-test learned about this Tally.
5. docs/TROUBLESHOOTING.md covers the common cases.

If you must change code: keep the change inside this folder, run `node --test`, and regenerate the
command reference with `node bin/tally.mjs ops --markdown --out docs/COMMANDS.md` if an operation
changed. Tell the person exactly what you changed.

## Conventions for extending the tool

- Every capability is one operation in `src/ops/` (`defineOp`): id, kind (`local`, `read`, `write`,
  `destructive`, `unsafe`), input schema, examples, handler. The CLI, MCP server, HTTP API and relay
  pick it up automatically. Register new files in `src/ops/index.mjs`.
- Reads use inline flat reports (`ctx.client.rows({collection, fields}, {from, to})`); see docs/TALLY-XML.md.
- Writes go through `src/domain/vouchers/post.mjs` or `src/domain/masters.mjs` so validation, policy,
  idempotency and the audit log apply. Never send an Import request from a handler directly.
- Amounts are integer paise inside; inputs are positive with an explicit side.
- Zero dependencies; Node 20+; ESM `.mjs`; tests in `tests/*.test.mjs` run by `node --test`.
- Make the simulator (`src/sim/`) understand any new request shape so tests stay meaningful.
