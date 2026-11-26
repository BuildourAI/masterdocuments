# tally-cli

A command-line bridge between AI systems (or any script) and **Tally** (TallyPrime and Tally.ERP 9).
It reads masters, vouchers and reports, posts vouchers of every kind, creates and changes masters,
moves data in bulk, and exposes all of it to AI tools as an MCP server, a local HTTP API or an
outbound relay.

- No dependencies and no build step: copy the folder, run it with Node.js 20 or newer.
- Talks to Tally through Tally's own XML gateway (the port Tally opens, 9000 by default).
- Writes are off until a person switches them on, and every write is validated, previewable,
  protected against double posting and recorded in a tamper-evident audit log.
- Includes a Tally simulator, so everything can be tried without touching real books.

Not affiliated with or endorsed by Tally Solutions. "Tally", "TallyPrime" and "Tally.ERP 9" are
trademarks of their owner.

## Five-minute start

```bash
node bin/tally.mjs --help
node bin/tally.mjs doctor
```

`doctor` checks the connection step by step and says how to fix each problem. On Windows you can use
`.\tally.cmd` instead of `node bin/tally.mjs` (examples below use `tally`).

Then create a profile (writes stay off):

```bash
tally init --company "Your Company Name"
```

and try a few reads:

```bash
tally company info
tally ledger list --under "Sundry Debtors"
tally report receivables --with-contacts
tally voucher list --type Sales --from 2026-11-01
```

No Tally at hand? Start the simulator in one terminal and point a profile at it:

```bash
tally simulate --port 9000 --state demo-books.json
```

```bash
tally init --url http://127.0.0.1:9000 --profile demo --write-mode on
```

## What it can do

| Area | Commands |
|---|---|
| Setup | `init`, `doctor`, `status`, `selftest`, `config show`, `capabilities`, `ops`, `explain`, `integrate`, `token`, `simulate` |
| Company | `company list / info / status` |
| Masters | `ledger`, `group`, `item`, `stock-group`, `stock-category`, `unit`, `godown`, `cost-centre`, `cost-category`: `list / get / search / create / update / ensure / delete`; `voucher-type` and `currency`: `list / get`; `master` for any other Tally master type |
| Parties | `party list / get / bills / statement` |
| Vouchers | `voucher list / get / find / validate / create / prepare / commit / update / cancel / delete / regularise / undo`, voucher templates |
| Data entry | `post receipt / payment / contra / journal / sales / purchase / credit-note / debit-note / sales-order / purchase-order / delivery-note / receipt-note / stock-journal` |
| Reports | `report receivables / payables / ledger / day-book / trial-balance / profit-loss / balance-sheet / group-summary / cash-bank / sales-register / purchase-register / stock-summary / godown-summary / item-movement / orders-pending`, and `report run "<any Tally report>"` |
| GST | `gst sales-register / purchase-register / hsn-summary / party-gstins / tax-ledgers / check-gstin / states / split` |
| Banking | `bank entries / unreconciled / match / set-date / post-receipts` |
| Bulk and sync | `import vouchers / masters`, `export <dataset>`, `changes list / deleted`, `sync status / run / reset`, `watch` |
| Records | `audit list / show / verify` |
| Anything else | `query collection / native / object / function / formula`, `raw`, `xml parse` |
| For AI systems | `mcp`, `serve`, `relay` |

Every command has `--help`. The full reference with every option is in [docs/COMMANDS.md](docs/COMMANDS.md)
(generated from the code). `tally ops --json` gives the same catalogue to programs.

## How AI systems use it

| Mode | Start with | Use when |
|---|---|---|
| Command line | `tally ... --json` | An agent (for example Claude Code) runs on the PC that reaches Tally |
| MCP tool server | `tally mcp` | Claude Desktop, Claude Code or another MCP client should see Tally as tools |
| Local HTTP API | `tally serve` | n8n, Make or a backend calls it (token protected, this PC only by default) |
| Relay | `tally relay` | The AI system runs in the cloud and cannot reach the office PC |
| Change feed | `tally watch`, `tally sync run` | New and changed data should flow out to a file, an API or a webhook |

`tally integrate` prints ready-to-paste settings for each of these. Details: [docs/INTEGRATION.md](docs/INTEGRATION.md).

## Output

Programs get one JSON shape on stdout: `{"ok": true, "data": ..., "meta": ...}` or
`{"ok": false, "error": {"code", "message", "hint"}, "meta": ...}`. Warnings and logs go to stderr.
In a terminal the default is a readable table; `--json`, `--csv` and `--ndjson` choose explicitly.
Exit codes: 0 ok, 2 usage, 3 cannot reach Tally, 4 Tally refused, 5 invalid input, 6 not allowed by
policy, 7 not found, 8 outcome unknown (check before retrying), 9 conflict.

## Safety

Read [docs/SAFETY.md](docs/SAFETY.md) before switching writes on. In short: writes are off by default;
an "optional" mode creates vouchers that stay out of the books until an accountant approves them in
Tally; alter/cancel/delete need a separate switch plus `--yes`; every write can be previewed with
`--dry-run`; idempotency keys stop double posting; and the audit log keeps the request, Tally's reply
and the previous version of anything changed.

## Folder layout

```
bin/tally.mjs        entry point          tally.cmd, tally   launchers (Windows, macOS/Linux)
src/core/            XML, transport, client, config, policy, audit, dates, money
src/domain/          masters, vouchers, reports, GST, bank, company, doctor, selftest
src/ops/             the operation registry: every command is defined once here
src/cli/             argument parsing, help, output
src/frontends/       MCP server, HTTP API, relay
src/sync/            export, change detection, sync, watch, bulk import
src/sim/             the Tally simulator
docs/                setup, commands, vouchers, integration, safety, Tally XML notes, troubleshooting, limitations
templates/           sample voucher files, import mappings, raw requests
examples/            relay hub, webhook receiver
tests/               node --test suites
```

Run the tests with `node --test` (from this folder).

## Documentation

- [docs/SETUP.md](docs/SETUP.md): installing on a client PC, step by step
- [CLAUDE.md](CLAUDE.md): playbook for an AI coding agent doing the installation
- [docs/VOUCHERS.md](docs/VOUCHERS.md): the voucher JSON format with examples for every kind
- [docs/INTEGRATION.md](docs/INTEGRATION.md): MCP, HTTP API, relay, webhooks, bulk import, sync
- [docs/SAFETY.md](docs/SAFETY.md): write modes, limits, audit, undo
- [docs/TALLY-XML.md](docs/TALLY-XML.md): how the tool talks to Tally, for extending it
- [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) and [docs/LIMITATIONS.md](docs/LIMITATIONS.md)
