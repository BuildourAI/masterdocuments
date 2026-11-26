# Safety model

This tool writes into books of accounts. These are the controls, from the outside in.

## Who can do what

| Control | Where | Default |
|---|---|---|
| Write mode: `off`, `optional`, `on` | `writeMode` in the profile | `off` |
| Create/change masters | `allowMasterWrites` | true only when `writeMode` is `on` |
| Alter, cancel, delete (plus `--yes` every time) | `allowDestructive` | false |
| Front-end ceiling (`read`, `write`, `destructive`) | `frontends.cli/mcp/http/relay` | CLI `destructive`; others `read` |
| HTTP token scope | `tally token create --scope` | `read` |
| Relay allowlist | `relay.allow` | read operations only |

Environment variables and command-line flags can change the connection (URL, company, timeout) and
can **lower** the write mode (`--read-only`, `TALLY_READ_ONLY=1`), but can never raise it. Write
permissions only come from `tally.config.json`, which a person sets up.

`raw` (send any request) is available on the command line only, and Import/Execute requests through
it need `writeMode: "on"` plus `--yes`. It is audited.

## Optional mode

With `writeMode: "optional"` every voucher is created with Tally's *optional* flag: it appears in the
Day Book and the Optional Vouchers report but does not affect balances until someone regularises it in
Tally (open it, Ctrl+L). This makes the accountant the approver of everything an AI enters. The tool's
own `voucher regularise` needs `writeMode: "on"`. Masters are not created in optional mode unless
`allowMasterWrites` is set. Run `tally selftest --write` on a test company to confirm this Tally keeps
optional vouchers out of balances (`import.optionalStaysOut`).

## Limits

| Setting | Effect |
|---|---|
| `lockBefore: "2026-04-01"` | Refuse writes dated before this date |
| `maxAmount: 500000` | Refuse vouchers above this total |
| `allowedVoucherTypes: ["Receipt", "Sales"]` | Only these voucher types (or base types) |
| `maxPerRun: 200` | Bulk imports and statement posting refuse larger batches |
| `requireIdempotencyKey: true` | Every voucher must carry an idempotency key |
| `company` + `companyGuid` | Writes need a named company; every request names it, and before writing the open company's id is compared with the pinned one, so a restored copy or another data folder with the same name is refused |

## Before anything is sent

- Full validation: names exist (with suggestions), debits equal credits, positive amounts, at most 2
  decimals, bill and cost-centre allocations add up, item amounts equal qty x rate less discount,
  `expectedTotal` matches, dates allowed (Educational mode and lock date).
- `--dry-run` on any write returns the computed summary and the exact XML without sending.
- `voucher prepare` / `voucher commit` give a reviewable plan that is posted exactly once.

## Double posting

- `idempotencyKey`: the first successful post is recorded locally; repeating the key returns the
  earlier result without sending. Reusing a key for different content is refused.
- Checking a key, sending and recording happen under one lock, so concurrent requests with the same
  key (for example an HTTP client retrying after a timeout) post once.
- If anything goes wrong after the request was sent (timeout, connection reset, empty or garbled
  reply), the tool searches Tally for the voucher; if it cannot find it, it returns `E_INDETERMINATE`
  (exit 8). A retry with the same key searches again and refuses to resend until a person confirms
  with `--force-resend` (or `"forceResend": true`) that the voucher is really not in Tally. This
  confirmation is accepted on the command line only, never from MCP, HTTP or relay clients.
- If the self-test found that optional vouchers affect balances on this Tally, optional write mode
  refuses to post.
- One voucher per request, so every result maps to exactly one record, and every created voucher is
  read back and compared.

## Changing existing records

- Alter, cancel and delete need `allowDestructive`, `writeMode: "on"` and `--yes`, and the limits
  above (types, lock date, amount cap) apply to the voucher before and after the change.
- Changing a ledger's opening balance counts as destructive too (and is refused while a lock date is set).
- `--if-alter-id` refuses the change if the voucher was edited since it was read.
- The previous version is stored in the audit log; `voucher undo --audit-seq N` restores an altered
  voucher, re-creates a deleted one, or deletes a created one. Each record can be undone once, and
  only with the profile and company it was written under.
- Vouchers for which Tally reports an e-invoice IRN or acknowledgement number are refused (change them in Tally, where the e-invoice
  can be cancelled properly). Cancel is preferred over delete.

## Audit log

`.tally/audit.jsonl` (next to the config) gets one line per write: time, operation, front-end,
profile, company, input, the exact request, Tally's reply, counts and ids, and the before-image for
changes. Each line carries the hash of the previous line; `tally audit verify` detects edits or
removed lines. `tally audit list` and `tally audit show <seq>` read it.

## Network

- Tally's own port (9000) has no authentication. `tally doctor` warns when it is reachable from other
  machines; block it in Windows Firewall for remote addresses.
- The HTTP API binds to 127.0.0.1 and requires tokens; binding elsewhere needs `--allow-network`.
- Over MCP, HTTP and the relay, operations cannot read or write files on the PC (export files,
  statement files, import files, sync folders) and the write self-test is unavailable.
- The relay only makes outgoing HTTPS connections and checks signatures, expiry and an allowlist.

## What the tool will not do

- Choose prices or rates.
- Generate e-invoices or e-way bills, file GST returns, print, back up, or change Tally users and
  security. These need Tally's own screens.
- Make changes without leaving a trace in the audit log.
