# Connecting AI systems and other software

All front-ends run the same operations through the same safety pipeline. Each front-end has an
access ceiling in the profile (`frontends`): `read`, `write` or `destructive`. Defaults: command line
`destructive` (still limited by `writeMode` and `allowDestructive`), MCP / HTTP / relay `read`.

```json
"frontends": { "cli": "destructive", "mcp": "read", "http": "read", "relay": "read" }
```

`tally integrate` prints ready-to-paste settings with the right paths for this PC.

## 1. Command line (agents on the same PC)

Every command takes `--json`. Pass complex input as a file with `--input file.json` (never inline JSON
on Windows command lines). `tally ops --json` lists every operation with its JSON Schema.

## 2. MCP tool server

```bash
tally mcp --profile main
```

Speaks MCP over stdio, supporting the handshake-based protocol revisions (2024-11-05 to 2025-11-25)
and the stateless revision (2026-07-28). Tool names are operation ids with `_` (`report_receivables`,
`post_receipt`, ...). `--toolset core` (default) lists the main operations plus three generic tools:
`tally_ops_find` (search all operations), `tally_run_read` and `tally_run_write` (run any operation by
id). `--toolset all` lists every operation. Only operations within the MCP ceiling are offered; raise
`frontends.mcp` to `write` to allow data entry. Read tools are marked `readOnlyHint`, so clients can
auto-approve reads and ask before writes. Long results are shortened (about 40,000 characters) with a
note to narrow the query.

Claude Desktop (`claude_desktop_config.json`):

```json
{ "mcpServers": { "tally": { "command": "C:\\Program Files\\nodejs\\node.exe", "args": ["C:\\tally-cli\\bin\\tally.mjs", "mcp", "--profile", "main"] } } }
```

Claude Code:

```bash
claude mcp add tally --scope user -- node C:\tally-cli\bin\tally.mjs mcp --profile main
```

## 3. Local HTTP API

```bash
tally token create n8n --scope read
tally serve
```

- `GET /health` (no token): liveness only.
- `GET /v1/ops`: operations available to the token, with input schemas.
- `POST /v1/ops/<operation id>` with a JSON body (the operation's input) and
  `Authorization: Bearer <token>`. The reply is the standard envelope `{ok, data, meta}` /
  `{ok: false, error}` with a matching HTTP status (400 input, 403 policy, 404 not found, 409 conflict,
  422 validation, 502 Tally error, 504 timeout or unknown outcome).

```bash
curl -s -X POST http://127.0.0.1:8765/v1/ops/report.receivables -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d "{\"withContacts\": true, \"detail\": false}"
```

Security: listens on 127.0.0.1 unless `--host` and `--allow-network` are given; tokens are stored as
SHA-256 hashes; a token's scope (`read`, `write`, `destructive`) and the profile's `frontends.http`
ceiling must both allow an operation; browser requests (any `Origin` header) and unexpected `Host`
headers are refused; body size and concurrent requests are capped. `raw`, `query.function` and
setup operations are never available over HTTP. Behind a tunnel or reverse proxy, add its host name
to `http.allowHosts`.

n8n: an "HTTP Request" node, method POST, URL `http://127.0.0.1:8765/v1/ops/<op>`, header
`Authorization: Bearer <token>`, body JSON = the operation input.

## 4. Relay (cloud AI systems)

When the AI system runs in the cloud and cannot reach the office PC, the PC connects out to a hub and
pulls jobs. Nothing listens on the PC.

```json
"relay": {
  "url": "https://hub.example.com",
  "secret": "<long random shared secret>",
  "agentId": "office-pc-1",
  "allow": ["report.*", "party.*", "ledger.list", "ledger.search", "voucher.list", "voucher.get"]
}
```

```bash
tally relay
```

Protocol:

| Direction | Request |
|---|---|
| PC -> hub | `GET /jobs/next?wait=25` (long poll): `204` none, or `200 {id, op, input, expiresAt, signature}` |
| PC -> hub | `POST /jobs/<id>/result` with `{id, ok, data | error, meta}` |

Every PC request carries `X-Relay-Agent`, `X-Relay-Timestamp` and `X-Relay-Signature` =
HMAC-SHA256(secret, `METHOD\nPATH\nTIMESTAMP\nBODY`). A job's `signature` =
HMAC-SHA256(secret, `id\nop\nexpiresAt\n<input as JSON with keys sorted>`). The PC rejects jobs with a
bad signature, past `expiresAt`, already seen, or not in `allow`; it runs accepted jobs under the
`frontends.relay` ceiling, and keeps unsent results in a local spool until the hub accepts them.
HTTPS is required (plain HTTP only for localhost testing).

`examples/relay-hub.mjs` is a working reference hub (`RELAY_SECRET=... node examples/relay-hub.mjs`)
with `POST /enqueue` and `GET /jobs/<id>` for the cloud side. Put a production hub behind HTTPS.

## 5. Data flowing out

**Exports**: `tally export <dataset> --format csv|ndjson|json --file <path>`. Datasets: ledgers, groups,
items, stock-groups, stock-categories, units, godowns, cost-centres, cost-categories, voucher-types,
currencies, vouchers, entries, inventory, bills, bank, cost-allocations, receivables, payables, stock,
trial-balance. Voucher datasets are read month by month.

**Incremental sync**: `tally sync run --sink <target>`. The first run sends everything (current
financial year for voucher datasets); later runs send only records altered since the last run (Tally's
alter ids). Targets: a folder (`exports/`, one file per dataset and run), a file (`.ndjson` appends),
an `http(s)` URL (POST `{dataset, company, incremental, rows}`), or `-` for stdout. `--detect-deletions`
adds deleted vouchers and masters (found by comparing ids). `tally sync status`, `tally sync reset`.

**Change feed**: `tally watch --sink <url> --interval 30` emits events as they happen:

```json
{"type": "voucher.changed", "at": "...", "company": "...", "masterId": 245, "alterId": 4510, "date": "2026-11-24", "voucherType": "Sales", "number": "SI/26-27/0101", "party": "City Lights Traders", "status": "regular"}
```

Types: `voucher.changed`, `master.changed`, and with `--detect-deletions` `voucher.deleted`,
`master.deleted`. Webhook deliveries are signed when a secret is set (`--secret` or `webhookSecret` in
the config): header `X-Tally-Signature: sha256=<HMAC-SHA256(secret, "<X-Tally-Timestamp>.<body>")>`.
`examples/webhook-receiver.mjs` verifies it.

## 6. Bulk import

```bash
tally import vouchers invoices.json
tally import vouchers invoices.json --commit
```

Without `--commit` every record is validated and nothing is written. With `--commit` each record gets
an idempotency key, so running the same file again skips what was already posted (safe resume).

Input formats:

- JSON array (or NDJSON, one per line) of voucher objects as in [VOUCHERS.md](VOUCHERS.md), or of
  `{"op": "post.receipt", "input": {...}}` records.
- CSV with a mapping file (`--map`). One row per operation:

  ```json
  { "op": "post.receipt",
    "columns": { "date": "Date", "party": "Customer", "amount": "Amount", "against": "Invoice No", "instrumentNumber": "UTR" },
    "defaults": { "bank": "HDFC Bank", "mode": "neft" },
    "key": "UTR" }
  ```

  Or several rows grouped into one voucher:

  ```json
  { "group": "Invoice No",
    "voucher": { "kind": "sales", "date": "Date", "party": "Customer", "number": "Invoice No" },
    "item": { "item": "Item", "qty": "Qty", "rate": "Rate", "ledger": "Sales Ledger" },
    "defaults": { "taxes": "auto", "roundOff": "auto" } }
  ```

  Mapping values are CSV column names; `{"value": "fixed"}` sets a constant. `key` names the column
  used for idempotency (default: file name and row/group).

Masters: `tally import masters customers.csv --map ledgers-map.json` with
`{"type": "ledger", "columns": {"name": "Customer", "group": "Group", "gstin": "GSTIN", "state": "State"}}`,
or JSON `[{"type": "ledger", "name": "...", "group": "..."}]`. Existing masters are left unchanged.

Examples are in [../templates/import/](../templates/import/).

## 7. Bank statements

```bash
tally bank match "HDFC Bank" statement.csv
```

Reads common bank CSV layouts (Date, Narration/Description, Chq/Ref No, Withdrawal, Deposit or
Amount + Dr/Cr) or JSON, matches lines with unreconciled book entries by amount, date (within
`--tolerance-days`) and instrument number, and lists unmatched statement lines with a suggested
party. Then `tally bank set-date --master-id N --bank-date YYYY-MM-DD --yes` for matches, and
`tally bank post-receipts --ledger "HDFC Bank" --input lines.json` to post receipts for the rest.
