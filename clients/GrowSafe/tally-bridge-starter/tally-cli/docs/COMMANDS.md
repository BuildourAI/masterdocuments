# Command reference

Generated from the operation registry by `tally ops --markdown`. Do not edit by hand.

Every command is also available as a tool (`tally mcp`) and over the local HTTP API (`tally serve`), subject to the access ceiling of that front-end. Access levels: `local` (no Tally), `read`, `write` (needs writes enabled), `destructive` (alter/cancel/delete: needs allowDestructive and `--yes`), `unsafe` (command line only).

## Contents

- [audit](#audit)
- [bank](#bank)
- [capabilities](#capabilities)
- [changes](#changes)
- [company](#company)
- [config](#config)
- [cost-category](#cost-category)
- [cost-centre](#cost-centre)
- [currency](#currency)
- [doctor](#doctor)
- [explain](#explain)
- [export](#export)
- [godown](#godown)
- [group](#group)
- [gst](#gst)
- [import](#import)
- [init](#init)
- [integrate](#integrate)
- [item](#item)
- [ledger](#ledger)
- [master](#master)
- [mcp](#mcp)
- [ops](#ops)
- [party](#party)
- [post](#post)
- [query](#query)
- [raw](#raw)
- [relay](#relay)
- [report](#report)
- [selftest](#selftest)
- [serve](#serve)
- [simulate](#simulate)
- [status](#status)
- [stock-category](#stock-category)
- [stock-group](#stock-group)
- [sync](#sync)
- [token](#token)
- [unit](#unit)
- [voucher-type](#voucher-type)
- [voucher](#voucher)
- [watch](#watch)
- [xml](#xml)

## audit

### `tally audit list`

Recent writes from the audit log (who, what, outcome, Tally ids).

Access: `local`. Tool name: `audit_list`.

| Option | Type | Description |
|---|---|---|
| `--limit` | integer |  Default `20`. |
| `--op` | string | Only this operation (prefix match). |
| `--outcome` | ok \| rejected \| error \| unknown |  |

```bash
tally audit list
tally audit list --op voucher --limit 50
```

### `tally audit show <seq>`

Full audit record: input, request XML, Tally reply, before-image.

Access: `local`. Tool name: `audit_show`.

| Option | Type | Description |
|---|---|---|
| `--seq` (required) | integer |  |

### `tally audit verify`

Check that the audit log has not been edited (hash chain).

Access: `local`. Tool name: `audit_verify`.

## bank

### `tally bank entries <ledger>`

Bank book lines of a bank ledger with instrument numbers and bank (clearing) dates.

Access: `read`. Tool name: `bank_entries`.

| Option | Type | Description |
|---|---|---|
| `--ledger` (required) | string |  |
| `--from` | date | Start date (YYYY-MM-DD). Default: start of the financial year. |
| `--to` | date | End date (YYYY-MM-DD). Default: today. |
| `--fy` | string | Financial year instead of from/to, e.g. 2026-27, current, previous. |

```bash
tally bank entries "Bank of Example - Current A/c" --from 2026-11-01
```

### `tally bank match <ledger> <statement>`

Match a bank statement (CSV/JSON) with unreconciled book lines; list unmatched lines with suggested parties.

Access: `read`. Tool name: `bank_match`.

| Option | Type | Description |
|---|---|---|
| `--ledger` (required) | string |  |
| `--statement` | string | Statement file (CSV with Date, Narration, Ref, Withdrawal, Deposit columns; or JSON lines). |
| `--statement-text` | string | Statement contents inline (for tool calls). |
| `--tolerance-days` | integer |  Default `7`. |
| `--from` | date |  |
| `--to` | date |  |

```bash
tally bank match "Bank of Example - Current A/c" statement-nov.csv
```

### `tally bank post-receipts`

Post receipts (or payments) for statement lines in one go, each with a stable idempotency key.

Access: `write`. Tool name: `bank_post_receipts`.

| Option | Type | Description |
|---|---|---|
| `--ledger` (required) | string | Bank ledger. |
| `--lines` (required) | array | Lines [{date, amount, party, direction: "in"\|"out", reference, against?: ["REF"], autoAllocate?: true, onAccount?: true, narration?}]. |
| `--dry-run` | boolean |  |
| `--force-resend` | boolean | Resend lines whose earlier attempt had an unknown outcome (only after checking Tally). |

```bash
tally bank post-receipts --ledger "Bank of Example - Current A/c" --input lines.json --dry-run
```

### `tally bank set-date`

Set the bank (clearing) date on a voucher's bank line, i.e. mark it reconciled.

Access: `destructive`. Tool name: `bank_set_date`.

| Option | Type | Description |
|---|---|---|
| `--master-id` (required) | integer |  |
| `--bank-date` (required) | date |  |
| `--ledger` | string | Bank ledger, if the voucher has several bank lines. |
| `--if-alter-id` | integer |  |
| `--yes` | boolean | Confirm a destructive action (delete, cancel, alter). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |

```bash
tally bank set-date --master-id 245 --bank-date 2026-11-25 --yes
```

### `tally bank unreconciled <ledger>`

Bank book lines not yet reconciled (no bank date).

Access: `read`. Tool name: `bank_unreconciled`.

| Option | Type | Description |
|---|---|---|
| `--ledger` (required) | string |  |
| `--from` | date | Start date (YYYY-MM-DD). Default: start of the financial year. |
| `--to` | date | End date (YYYY-MM-DD). Default: today. |
| `--fy` | string | Financial year instead of from/to, e.g. 2026-27, current, previous. |

```bash
tally bank unreconciled "Bank of Example - Current A/c"
```

## capabilities

### `tally capabilities`

Show assumptions about this Tally (defaults, and results from the last selftest).

Access: `local`. Tool name: `capabilities`.

```bash
tally capabilities
```

## changes

### `tally changes deleted`

Detect deleted vouchers and masters by comparing with the previous snapshot of ids (first run takes the snapshot).

Access: `read`. Tool name: `changes_deleted`.

| Option | Type | Description |
|---|---|---|
| `--masters` | boolean |  Default `true`. |

```bash
tally changes deleted
```

### `tally changes list`

Vouchers and masters created or altered since given alter ids (default: since the last sync).

Access: `read`. Tool name: `changes_list`.

| Option | Type | Description |
|---|---|---|
| `--since-voucher-alter-id` | integer |  |
| `--since-master-alter-id` | integer |  |
| `--masters` | boolean |  Default `true`. |

```bash
tally changes list --since-voucher-alter-id 4500
```

## company

### `tally company info`

Details of the target company: period, state, licence mode, Tally version, change counters.

Access: `read`. Tool name: `company_info`.

```bash
tally company info
```

### `tally company list`

List the companies currently open in Tally (and which one is active).

Access: `read`. Tool name: `company_list`.

```bash
tally company list
```

### `tally company status`

Change counters (highest alter ids) for masters and vouchers; compare with the last sync.

Access: `read`. Tool name: `company_status`.

```bash
tally company status
```

## config

### `tally config show`

Show the effective configuration (profile, connection, safety settings) and where it came from.

Access: `local`. Tool name: `config_show`.

```bash
tally config show
```

## cost-category

### `tally cost-category create <name>`

Create a cost category. Fails if it already exists (use ensure for create-if-missing).

Access: `write`. Tool name: `cost_category_create`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string |  |
| `--allocate-revenue` | boolean |  |
| `--allocate-non-revenue` | boolean |  |
| `--raw` | object |  |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally cost-category create "Example"
```

### `tally cost-category delete <name>`

Delete a cost category (Tally refuses if it is in use).

Access: `destructive`. Tool name: `cost_category_delete`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string |  |
| `--yes` | boolean | Confirm a destructive action (delete, cancel, alter). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |

```bash
tally cost-category delete "Example" --yes
```

### `tally cost-category ensure <name>`

Create the cost category if it does not exist; if it exists, report differences without changing it.

Access: `write`. Tool name: `cost_category_ensure`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string |  |
| `--allocate-revenue` | boolean |  |
| `--allocate-non-revenue` | boolean |  |
| `--raw` | object |  |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally cost-category ensure "Example"
```

### `tally cost-category get <name>`

Get one cost category by exact name (suggests close matches when not found).

Access: `read`. Tool name: `cost_category_get`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string | Cost category name. |
| `--as-of` | date | Balances as of this date. |
| `--native` | boolean | Also return the object as Tally exports it (all fields). |

```bash
tally cost-category get "Main Location"
```

### `tally cost-category list`

List cost categorys.

Access: `read`. Tool name: `cost_category_list`.

| Option | Type | Description |
|---|---|---|
| `--search` | string | Text to match against cost category names. |
| `--limit` | integer | Return at most this many rows. |

```bash
tally cost-category list
```

### `tally cost-category update <name>`

Change fields of an existing cost category (only the fields given are sent). Use --new-name to rename.

Access: `write`. Tool name: `cost_category_update`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string |  |
| `--allocate-revenue` | boolean |  |
| `--allocate-non-revenue` | boolean |  |
| `--raw` | object |  |
| `--new-name` | string | Rename to this. |
| `--yes` | boolean | Confirm changing an opening balance (also needs allowDestructive). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally cost-category update "Example" --new-name "Example 2"
```

## cost-centre

### `tally cost-centre create <name>`

Create a cost centre. Fails if it already exists (use ensure for create-if-missing).

Access: `write`. Tool name: `cost_centre_create`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string |  |
| `--parent` | string |  |
| `--category` | string |  |
| `--raw` | object |  |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally cost-centre create "Example"
```

### `tally cost-centre delete <name>`

Delete a cost centre (Tally refuses if it is in use).

Access: `destructive`. Tool name: `cost_centre_delete`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string |  |
| `--yes` | boolean | Confirm a destructive action (delete, cancel, alter). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |

```bash
tally cost-centre delete "Example" --yes
```

### `tally cost-centre ensure <name>`

Create the cost centre if it does not exist; if it exists, report differences without changing it.

Access: `write`. Tool name: `cost_centre_ensure`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string |  |
| `--parent` | string |  |
| `--category` | string |  |
| `--raw` | object |  |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally cost-centre ensure "Example"
```

### `tally cost-centre get <name>`

Get one cost centre by exact name (suggests close matches when not found).

Access: `read`. Tool name: `cost_centre_get`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string | Cost centre name. |
| `--as-of` | date | Balances as of this date. |
| `--native` | boolean | Also return the object as Tally exports it (all fields). |

```bash
tally cost-centre get "Main Location"
```

### `tally cost-centre list`

List cost centres.

Access: `read`. Tool name: `cost_centre_list`.

| Option | Type | Description |
|---|---|---|
| `--search` | string | Text to match against cost centre names. |
| `--limit` | integer | Return at most this many rows. |
| `--under` | string | Only cost centres under this cost centre (any depth). |

```bash
tally cost-centre list
```

### `tally cost-centre update <name>`

Change fields of an existing cost centre (only the fields given are sent). Use --new-name to rename.

Access: `write`. Tool name: `cost_centre_update`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string |  |
| `--parent` | string |  |
| `--category` | string |  |
| `--raw` | object |  |
| `--new-name` | string | Rename to this. |
| `--yes` | boolean | Confirm changing an opening balance (also needs allowDestructive). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally cost-centre update "Example" --new-name "Example 2"
```

## currency

### `tally currency get <name>`

Get one currency by exact name (suggests close matches when not found).

Access: `read`. Tool name: `currency_get`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string | Currency name. |
| `--as-of` | date | Balances as of this date. |
| `--native` | boolean | Also return the object as Tally exports it (all fields). |

```bash
tally currency get "Main Location"
```

### `tally currency list`

List currencies.

Access: `read`. Tool name: `currency_list`.

| Option | Type | Description |
|---|---|---|
| `--search` | string | Text to match against currency names. |
| `--limit` | integer | Return at most this many rows. |

```bash
tally currency list
```

## doctor

### `tally doctor`

Check the connection to Tally step by step and say how to fix each problem.

Access: `read`. Tool name: `doctor`.

| Option | Type | Description |
|---|---|---|
| `--network` | boolean | Also check whether Tally's port is exposed on the network. Default `true`. |

```bash
tally doctor
tally doctor --url http://192.168.1.20:9000
```

## explain

### `tally explain <message>`

Explain a Tally error message and what to do about it (or list known messages).

Access: `local`. Tool name: `explain`.

| Option | Type | Description |
|---|---|---|
| `--message` | string | The error text from Tally. |

```bash
tally explain "Voucher totals do not match! Dr: 100.00 Dr Cr: 90.00 Cr"
```

## export

### `tally export <dataset>`

Export a dataset to JSON, NDJSON or CSV (ledgers, groups, items, stock-groups, stock-categories, units, godowns, cost-centres, cost-categories, voucher-types, currencies, vouchers, entries, inventory, bills, bank, cost-allocations, receivables, payables, stock, trial-balance).

Access: `read`. Tool name: `export`.

| Option | Type | Description |
|---|---|---|
| `--dataset` (required) | ledgers \| groups \| items \| stock-groups \| stock-categories \| units \| godowns \| cost-centres \| cost-categories \| voucher-types \| currencies \| vouchers \| entries \| inventory \| bills \| bank \| cost-allocations \| receivables \| payables \| stock \| trial-balance |  |
| `--from` | date | Start date (YYYY-MM-DD). Default: start of the financial year. |
| `--to` | date | End date (YYYY-MM-DD). Default: today. |
| `--fy` | string | Financial year instead of from/to, e.g. 2026-27, current, previous. |
| `--format` | json \| ndjson \| csv |  Default `"json"`. |
| `--file` | string | Write to this file (default: print). |
| `--include-optional` | boolean |  |
| `--include-cancelled` | boolean |  |
| `--since-alter-id` | integer | Only records altered after this alter id (incremental). |
| `--raw` | boolean | For masters: Tally field names instead of the friendly shape. |

```bash
tally export vouchers --fy current --format csv --file vouchers.csv
tally export entries --from 2026-04-01 --to 2026-06-30 --format ndjson --file entries.ndjson
tally export ledgers --format csv
```

## godown

### `tally godown create <name>`

Create a godown. Fails if it already exists (use ensure for create-if-missing).

Access: `write`. Tool name: `godown_create`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string |  |
| `--parent` | string |  |
| `--address` | array |  |
| `--raw` | object |  |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally godown create "Example"
```

### `tally godown delete <name>`

Delete a godown (Tally refuses if it is in use).

Access: `destructive`. Tool name: `godown_delete`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string |  |
| `--yes` | boolean | Confirm a destructive action (delete, cancel, alter). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |

```bash
tally godown delete "Example" --yes
```

### `tally godown ensure <name>`

Create the godown if it does not exist; if it exists, report differences without changing it.

Access: `write`. Tool name: `godown_ensure`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string |  |
| `--parent` | string |  |
| `--address` | array |  |
| `--raw` | object |  |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally godown ensure "Example"
```

### `tally godown get <name>`

Get one godown by exact name (suggests close matches when not found).

Access: `read`. Tool name: `godown_get`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string | Godown name. |
| `--as-of` | date | Balances as of this date. |
| `--native` | boolean | Also return the object as Tally exports it (all fields). |

```bash
tally godown get "Main Location"
```

### `tally godown list`

List godowns.

Access: `read`. Tool name: `godown_list`.

| Option | Type | Description |
|---|---|---|
| `--search` | string | Text to match against godown names. |
| `--limit` | integer | Return at most this many rows. |
| `--under` | string | Only godowns under this godown (any depth). |

```bash
tally godown list
```

### `tally godown update <name>`

Change fields of an existing godown (only the fields given are sent). Use --new-name to rename.

Access: `write`. Tool name: `godown_update`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string |  |
| `--parent` | string |  |
| `--address` | array |  |
| `--raw` | object |  |
| `--new-name` | string | Rename to this. |
| `--yes` | boolean | Confirm changing an opening balance (also needs allowDestructive). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally godown update "Example" --new-name "Example 2"
```

## group

### `tally group create <name>`

Create a group. Fails if it already exists (use ensure for create-if-missing).

Access: `write`. Tool name: `group_create`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string | Group name. |
| `--parent` | string | Parent group (for example "Sundry Debtors"). |
| `--aliases` | array |  |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally group create "Example"
```

### `tally group delete <name>`

Delete a group (Tally refuses if it is in use).

Access: `destructive`. Tool name: `group_delete`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string |  |
| `--yes` | boolean | Confirm a destructive action (delete, cancel, alter). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |

```bash
tally group delete "Example" --yes
```

### `tally group ensure <name>`

Create the group if it does not exist; if it exists, report differences without changing it.

Access: `write`. Tool name: `group_ensure`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string | Group name. |
| `--parent` | string | Parent group (for example "Sundry Debtors"). |
| `--aliases` | array |  |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally group ensure "Example"
```

### `tally group get <name>`

Get one group by exact name (suggests close matches when not found).

Access: `read`. Tool name: `group_get`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string | Group name. |
| `--as-of` | date | Balances as of this date. |
| `--native` | boolean | Also return the object as Tally exports it (all fields). |

```bash
tally group get "Main Location"
```

### `tally group list`

List groups.

Access: `read`. Tool name: `group_list`.

| Option | Type | Description |
|---|---|---|
| `--search` | string | Text to match against group names. |
| `--limit` | integer | Return at most this many rows. |
| `--under` | string | Only groups under this group (any depth). |
| `--as-of` | date | Balances as of this date (default: today). |

```bash
tally group list
```

### `tally group search <query>`

Find groups by partial or misspelt name (use before writing to get exact names).

Access: `read`. Tool name: `group_search`.

| Option | Type | Description |
|---|---|---|
| `--query` (required) | string | Text to search for. |
| `--limit` | integer |  Default `10`. |

```bash
tally group search debtors
```

### `tally group update <name>`

Change fields of an existing group (only the fields given are sent). Use --new-name to rename.

Access: `write`. Tool name: `group_update`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string | Group name. |
| `--parent` | string | Parent group (for example "Sundry Debtors"). |
| `--aliases` | array |  |
| `--new-name` | string | Rename to this. |
| `--yes` | boolean | Confirm changing an opening balance (also needs allowDestructive). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally group update "Example" --new-name "Example 2"
```

## gst

### `tally gst check-gstin <gstin>`

Validate a GSTIN offline (format, state code, PAN, check character).

Access: `local`. Tool name: `gst_check_gstin`.

| Option | Type | Description |
|---|---|---|
| `--gstin` (required) | string |  |

```bash
tally gst check-gstin 27AAPFU0939F1ZV
```

### `tally gst hsn-summary`

HSN-wise quantity and taxable value of sales (or purchases).

Access: `read`. Tool name: `gst_hsn_summary`.

| Option | Type | Description |
|---|---|---|
| `--kind` | sales \| purchase |  Default `"sales"`. |
| `--from` | date | Start date (YYYY-MM-DD). Default: start of the financial year. |
| `--to` | date | End date (YYYY-MM-DD). Default: today. |
| `--fy` | string | Financial year instead of from/to, e.g. 2026-27, current, previous. |

```bash
tally gst hsn-summary --from 2026-10-01 --to 2026-10-31
```

### `tally gst party-gstins`

Check the GSTIN of every customer and supplier (format, checksum, state match).

Access: `read`. Tool name: `gst_party_gstins`.

| Option | Type | Description |
|---|---|---|
| `--problems-only` | boolean | Only parties with a problem. |

```bash
tally gst party-gstins --problems-only
```

### `tally gst purchase-register`

Inward supplies register with supplier GSTINs (debit notes included), for matching with GSTR-2B.

Access: `read`. Tool name: `gst_purchase_register`.

| Option | Type | Description |
|---|---|---|
| `--from` | date | Start date (YYYY-MM-DD). Default: start of the financial year. |
| `--to` | date | End date (YYYY-MM-DD). Default: today. |
| `--fy` | string | Financial year instead of from/to, e.g. 2026-27, current, previous. |

```bash
tally gst purchase-register --from 2026-10-01 --to 2026-10-31 --csv --out purchases.csv
```

### `tally gst sales-register`

Outward supplies register (same as report sales-register, credit notes included).

Access: `read`. Tool name: `gst_sales_register`.

| Option | Type | Description |
|---|---|---|
| `--from` | date | Start date (YYYY-MM-DD). Default: start of the financial year. |
| `--to` | date | End date (YYYY-MM-DD). Default: today. |
| `--fy` | string | Financial year instead of from/to, e.g. 2026-27, current, previous. |

```bash
tally gst sales-register --from 2026-10-01 --to 2026-10-31
```

### `tally gst split`

Work out CGST+SGST or IGST for a taxable amount, from company state and place of supply.

Access: `local`. Tool name: `gst_split`.

| Option | Type | Description |
|---|---|---|
| `--taxable` (required) | number | Taxable value in rupees. |
| `--rate` (required) | number | GST rate in percent (e.g. 18). |
| `--place-of-supply` (required) | string | State name or code of the buyer. |
| `--company-state` | string | Default: gst.companyState from the profile. |

```bash
tally gst split --taxable 10000 --rate 18 --place-of-supply Gujarat --company-state Maharashtra
```

### `tally gst states`

GST state codes and names.

Access: `local`. Tool name: `gst_states`.

```bash
tally gst states
```

### `tally gst tax-ledgers`

GST tax ledgers (CGST/SGST/IGST/cess) with period debits, credits and balances.

Access: `read`. Tool name: `gst_tax_ledgers`.

| Option | Type | Description |
|---|---|---|
| `--from` | date | Start date (YYYY-MM-DD). Default: start of the financial year. |
| `--to` | date | End date (YYYY-MM-DD). Default: today. |
| `--fy` | string | Financial year instead of from/to, e.g. 2026-27, current, previous. |

```bash
tally gst tax-ledgers --from 2026-10-01 --to 2026-10-31
```

## import

### `tally import masters <file>`

Import masters (ledgers, items, ...) from JSON ([{type, ...fields}]) or CSV (+ mapping with "type" and "columns"). Creates missing ones only.

Access: `write`. Tool name: `import_masters`.

| Option | Type | Description |
|---|---|---|
| `--file` (required) | string |  |
| `--map` | string |  |
| `--commit` | boolean |  |
| `--stop-on-error` | boolean |  |
| `--limit` | integer |  |

```bash
tally import masters customers.csv --map templates/import/ledgers-map.json
tally import masters items.json --commit
```

### `tally import vouchers <file>`

Import vouchers from JSON/NDJSON (voucher objects) or CSV (+ mapping). Validates only, unless --commit. Safe to re-run.

Access: `write`. Tool name: `import_vouchers`.

| Option | Type | Description |
|---|---|---|
| `--file` (required) | string | Input file (.json, .ndjson or .csv). |
| `--map` | string | Mapping file for CSV (see docs/INTEGRATION.md). |
| `--commit` | boolean | Actually post. Without it nothing is written. |
| `--stop-on-error` | boolean |  |
| `--limit` | integer | Only the first N records. |
| `--force-resend` | boolean | Resend records whose earlier attempt had an unknown outcome (only after checking Tally). |

```bash
tally import vouchers invoices.json
tally import vouchers receipts.csv --map templates/import/receipts-map.json --commit
```

## init

### `tally init`

Create or update a profile in tally.config.json: connect, pick the company, detect GST and bank ledgers, choose the write mode.

Non-interactive: everything can be given as flags, which is how an AI agent should run it. Writes stay off unless --write-mode is given. The company id is pinned so a different company with the same name is never written to by mistake.

Access: `local`. Tool name: `init`.

| Option | Type | Description |
|---|---|---|
| `--url` | string | Tally gateway URL (default http://127.0.0.1:9000). |
| `--company` | string | Company to target (default: the only / active open company). |
| `--profile` | string | Profile name to create or update. Default `"default"`. |
| `--write-mode` | off \| optional \| on | off = read only; optional = vouchers land as optional for review; on = full writes. Default `"off"`. |
| `--allow-destructive` | boolean | Allow alter, cancel and delete (still needs --yes each time). Default `false`. |
| `--allow-master-writes` | boolean | Allow creating/changing ledgers and items (default: true when write mode is on). |
| `--company-state` | string | Company GST state (default: read from Tally). |
| `--config-path` | string | Where to write the config (default: tally.config.json next to the tool). |
| `--make-default` | boolean |  Default `true`. |
| `--force` | boolean | Overwrite an existing profile of the same name. |

```bash
tally init --company "Sample Traders Pvt Ltd"
tally init --url http://127.0.0.1:9000 --profile main --write-mode optional
tally init --url sim:demo.json --profile demo --write-mode on --allow-destructive
```

## integrate

### `tally integrate`

Print ready-to-paste settings for Claude Desktop, Claude Code, HTTP clients (n8n, Make, backends) and the relay.

Access: `local`. Tool name: `integrate`.

| Option | Type | Description |
|---|---|---|
| `--target` | all \| claude-desktop \| claude-code \| http \| relay |  Default `"all"`. |
| `--profile` | string | Profile the tool server should use. |

```bash
tally integrate --target claude-desktop
tally integrate --target http
```

## item

### `tally item create <name>`

Create a stock item. Fails if it already exists (use ensure for create-if-missing).

Access: `write`. Tool name: `item_create`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string |  |
| `--group` | string | Stock group (optional). |
| `--category` | string |  |
| `--unit` | string | Base unit, e.g. "Nos" (must exist). |
| `--alternate-unit` | string |  |
| `--conversion` | object | {"base": 12, "alternate": 1} means 12 base units = 1 alternate unit. |
| `--aliases` | array |  |
| `--part-no` | string |  |
| `--description` | string |  |
| `--hsn` | string | HSN/SAC code. |
| `--hsn-description` | string |  |
| `--gst-rate` | number | Integrated GST rate in percent (CGST/SGST are half each). |
| `--cess-rate` | number |  |
| `--taxability` | Taxable \| Exempt \| Nil Rated |  |
| `--gst-applicable-from` | date |  |
| `--opening` | object | {"qty": 10, "rate": 100, "godown": "Main Location", "batch": "Primary Batch"} |
| `--raw` | object |  |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally item create "Widget A" --unit Nos --hsn 84719000 --gst-rate 18
```

### `tally item delete <name>`

Delete a stock item (Tally refuses if it is in use).

Access: `destructive`. Tool name: `item_delete`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string |  |
| `--yes` | boolean | Confirm a destructive action (delete, cancel, alter). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |

```bash
tally item delete "Example" --yes
```

### `tally item ensure <name>`

Create the stock item if it does not exist; if it exists, report differences without changing it.

Access: `write`. Tool name: `item_ensure`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string |  |
| `--group` | string | Stock group (optional). |
| `--category` | string |  |
| `--unit` | string | Base unit, e.g. "Nos" (must exist). |
| `--alternate-unit` | string |  |
| `--conversion` | object | {"base": 12, "alternate": 1} means 12 base units = 1 alternate unit. |
| `--aliases` | array |  |
| `--part-no` | string |  |
| `--description` | string |  |
| `--hsn` | string | HSN/SAC code. |
| `--hsn-description` | string |  |
| `--gst-rate` | number | Integrated GST rate in percent (CGST/SGST are half each). |
| `--cess-rate` | number |  |
| `--taxability` | Taxable \| Exempt \| Nil Rated |  |
| `--gst-applicable-from` | date |  |
| `--opening` | object | {"qty": 10, "rate": 100, "godown": "Main Location", "batch": "Primary Batch"} |
| `--raw` | object |  |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally item ensure "Example"
```

### `tally item get <name>`

Get one stock item by exact name (suggests close matches when not found).

Access: `read`. Tool name: `item_get`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string | Stock item name. |
| `--as-of` | date | Balances as of this date. |
| `--native` | boolean | Also return the object as Tally exports it (all fields). |

```bash
tally item get "Main Location"
```

### `tally item list`

List stock items.

Access: `read`. Tool name: `item_list`.

| Option | Type | Description |
|---|---|---|
| `--search` | string | Text to match against stock item names. |
| `--limit` | integer | Return at most this many rows. |
| `--under` | string | Only stock items under this stock group (any depth). |
| `--as-of` | date | Balances as of this date (default: today). |

```bash
tally item list
```

### `tally item search <query>`

Find stock items by partial or misspelt name (use before writing to get exact names).

Access: `read`. Tool name: `item_search`.

| Option | Type | Description |
|---|---|---|
| `--query` (required) | string | Text to search for. |
| `--limit` | integer |  Default `10`. |

```bash
tally item search wire
```

### `tally item update <name>`

Change fields of an existing stock item (only the fields given are sent). Use --new-name to rename.

Access: `write`. Tool name: `item_update`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string |  |
| `--group` | string | Stock group (optional). |
| `--category` | string |  |
| `--unit` | string | Base unit, e.g. "Nos" (must exist). |
| `--alternate-unit` | string |  |
| `--conversion` | object | {"base": 12, "alternate": 1} means 12 base units = 1 alternate unit. |
| `--aliases` | array |  |
| `--part-no` | string |  |
| `--description` | string |  |
| `--hsn` | string | HSN/SAC code. |
| `--hsn-description` | string |  |
| `--gst-rate` | number | Integrated GST rate in percent (CGST/SGST are half each). |
| `--cess-rate` | number |  |
| `--taxability` | Taxable \| Exempt \| Nil Rated |  |
| `--gst-applicable-from` | date |  |
| `--opening` | object | {"qty": 10, "rate": 100, "godown": "Main Location", "batch": "Primary Batch"} |
| `--raw` | object |  |
| `--new-name` | string | Rename to this. |
| `--yes` | boolean | Confirm changing an opening balance (also needs allowDestructive). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally item update "Example" --new-name "Example 2"
```

## ledger

### `tally ledger create <name>`

Create a ledger. Fails if it already exists (use ensure for create-if-missing).

Access: `write`. Tool name: `ledger_create`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string | Ledger name (exactly as it should appear in Tally). |
| `--group` | string | Parent group, e.g. "Sundry Debtors", "Sundry Creditors", "Bank Accounts", "Sales Accounts". |
| `--aliases` | array |  |
| `--opening-balance` | object | {"amount": 1000, "side": "Dr"\|"Cr"} |
| `--bill-wise` | boolean | Maintain balances bill-by-bill (usual for parties). |
| `--credit-days` | integer | Default credit period in days. |
| `--cost-centres` | boolean | Cost centres are applicable. |
| `--mailing-name` | string |  |
| `--address` | array | Address lines. |
| `--state` | string | State name or GST state code. |
| `--country` | string |  |
| `--pincode` | string |  |
| `--email` | string |  |
| `--phone` | string |  |
| `--contact-person` | string |  |
| `--pan` | string |  |
| `--gstin` | string | Party GSTIN (validated). |
| `--gst-registration-type` | Regular \| Composition \| Unregistered/Consumer \| Unknown \| Consumer \| Unregistered | GST registration type. |
| `--gst-duty-head` | Central Tax \| State Tax \| Integrated Tax \| Cess | For GST tax ledgers. |
| `--tax-rate` | number | For tax ledgers: percentage of calculation. |
| `--bank-account` | string |  |
| `--ifsc` | string |  |
| `--account-holder` | string |  |
| `--raw` | object | Extra Tally tags to include verbatim, e.g. {"ISTDSAPPLICABLE": "Yes"}. |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally ledger create "New Customer Pvt Ltd" --group "Sundry Debtors" --gstin 27AAAAA0000A1Z5 --state Maharashtra --bill-wise --credit-days 30
tally ledger create --input ledger.json --dry-run
```

### `tally ledger delete <name>`

Delete a ledger (Tally refuses if it is in use).

Access: `destructive`. Tool name: `ledger_delete`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string |  |
| `--yes` | boolean | Confirm a destructive action (delete, cancel, alter). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |

```bash
tally ledger delete "Example" --yes
```

### `tally ledger ensure <name>`

Create the ledger if it does not exist; if it exists, report differences without changing it.

Access: `write`. Tool name: `ledger_ensure`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string | Ledger name (exactly as it should appear in Tally). |
| `--group` | string | Parent group, e.g. "Sundry Debtors", "Sundry Creditors", "Bank Accounts", "Sales Accounts". |
| `--aliases` | array |  |
| `--opening-balance` | object | {"amount": 1000, "side": "Dr"\|"Cr"} |
| `--bill-wise` | boolean | Maintain balances bill-by-bill (usual for parties). |
| `--credit-days` | integer | Default credit period in days. |
| `--cost-centres` | boolean | Cost centres are applicable. |
| `--mailing-name` | string |  |
| `--address` | array | Address lines. |
| `--state` | string | State name or GST state code. |
| `--country` | string |  |
| `--pincode` | string |  |
| `--email` | string |  |
| `--phone` | string |  |
| `--contact-person` | string |  |
| `--pan` | string |  |
| `--gstin` | string | Party GSTIN (validated). |
| `--gst-registration-type` | Regular \| Composition \| Unregistered/Consumer \| Unknown \| Consumer \| Unregistered | GST registration type. |
| `--gst-duty-head` | Central Tax \| State Tax \| Integrated Tax \| Cess | For GST tax ledgers. |
| `--tax-rate` | number | For tax ledgers: percentage of calculation. |
| `--bank-account` | string |  |
| `--ifsc` | string |  |
| `--account-holder` | string |  |
| `--raw` | object | Extra Tally tags to include verbatim, e.g. {"ISTDSAPPLICABLE": "Yes"}. |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally ledger ensure "Example" --group "Sundry Debtors"
```

### `tally ledger get <name>`

Get one ledger by exact name (suggests close matches when not found).

Access: `read`. Tool name: `ledger_get`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string | Ledger name. |
| `--as-of` | date | Balances as of this date. |
| `--native` | boolean | Also return the object as Tally exports it (all fields). |

```bash
tally ledger get "Cash"
```

### `tally ledger list`

List ledgers with group, balances, GSTIN and contact details.

Access: `read`. Tool name: `ledger_list`.

| Option | Type | Description |
|---|---|---|
| `--search` | string | Text to match against ledger names, aliases and GSTINs. |
| `--limit` | integer | Return at most this many rows. |
| `--under` | string | Only ledgers under this group (any depth). |
| `--as-of` | date | Balances as of this date (default: today). |

```bash
tally ledger list --under "Sundry Debtors"
tally ledger list --search hdfc --limit 5
```

### `tally ledger search <query>`

Find ledgers by partial or misspelt name (use before writing to get exact names).

Access: `read`. Tool name: `ledger_search`.

| Option | Type | Description |
|---|---|---|
| `--query` (required) | string | Text to search for. |
| `--limit` | integer |  Default `10`. |

```bash
tally ledger search alpha
```

### `tally ledger update <name>`

Change fields of an existing ledger (only the fields given are sent). Use --new-name to rename.

Access: `write`. Tool name: `ledger_update`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string | Ledger name (exactly as it should appear in Tally). |
| `--group` | string | Parent group, e.g. "Sundry Debtors", "Sundry Creditors", "Bank Accounts", "Sales Accounts". |
| `--aliases` | array |  |
| `--opening-balance` | object | {"amount": 1000, "side": "Dr"\|"Cr"} |
| `--bill-wise` | boolean | Maintain balances bill-by-bill (usual for parties). |
| `--credit-days` | integer | Default credit period in days. |
| `--cost-centres` | boolean | Cost centres are applicable. |
| `--mailing-name` | string |  |
| `--address` | array | Address lines. |
| `--state` | string | State name or GST state code. |
| `--country` | string |  |
| `--pincode` | string |  |
| `--email` | string |  |
| `--phone` | string |  |
| `--contact-person` | string |  |
| `--pan` | string |  |
| `--gstin` | string | Party GSTIN (validated). |
| `--gst-registration-type` | Regular \| Composition \| Unregistered/Consumer \| Unknown \| Consumer \| Unregistered | GST registration type. |
| `--gst-duty-head` | Central Tax \| State Tax \| Integrated Tax \| Cess | For GST tax ledgers. |
| `--tax-rate` | number | For tax ledgers: percentage of calculation. |
| `--bank-account` | string |  |
| `--ifsc` | string |  |
| `--account-holder` | string |  |
| `--raw` | object | Extra Tally tags to include verbatim, e.g. {"ISTDSAPPLICABLE": "Yes"}. |
| `--new-name` | string | Rename to this. |
| `--yes` | boolean | Confirm changing an opening balance (also needs allowDestructive). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally ledger update "Alpha Hardware Stores" --credit-days 45 --email accounts@alpha.example
```

## master

### `tally master delete <type> <name>`

Delete any master object by type and name.

Access: `destructive`. Tool name: `master_delete`.

| Option | Type | Description |
|---|---|---|
| `--type` (required) | string |  |
| `--name` (required) | string |  |
| `--yes` | boolean | Confirm a destructive action (delete, cancel, alter). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |

```bash
tally master delete BUDGET "Old Budget" --yes
```

### `tally master get <type> <name>`

Export any master object exactly as Tally holds it (all fields), by type and name.

Access: `read`. Tool name: `master_get`.

| Option | Type | Description |
|---|---|---|
| `--type` (required) | string |  |
| `--name` (required) | string |  |
| `--fetch` | array |  |

```bash
tally master get Ledger "Cash"
```

### `tally master list <type>`

List objects of any Tally master type (e.g. Budget, PriceLevel, AttendanceType, PayHead) with chosen fields.

Access: `read`. Tool name: `master_list`.

| Option | Type | Description |
|---|---|---|
| `--type` (required) | string | Tally collection type, e.g. "Budget", "Employee", "PayHead", "StockItem". |
| `--fields` | array | Tally method names to return. Default `["Name","Parent"]`. |
| `--filter` | string | Optional TDL filter formula, e.g. $$IsEqual:$Parent:"Sundry Debtors". |
| `--limit` | integer |  |

```bash
tally master list Budget
tally master list Ledger --fields Name,Parent,ClosingBalance --filter "$$IsEqual:$Parent:\"Bank Accounts\""
```

### `tally master upsert`

Create or alter any master type with raw Tally tags (for types without a dedicated command).

Access: `write`. Tool name: `master_upsert`.

| Option | Type | Description |
|---|---|---|
| `--type` (required) | string | Tally object tag, e.g. "BUDGET", "PRICELEVEL", "LEDGER". |
| `--name` (required) | string |  |
| `--action` | Create \| Alter |  Default `"Create"`. |
| `--new-name` | string |  |
| `--tags` | object | Tags to send, e.g. {"PARENT": "Primary"}. Lists: {"ADDRESS.LIST": {"ADDRESS": ["l1", "l2"]}}. |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally master upsert BUDGET "FY Budget" --input budget-tags.json --dry-run
```

## mcp

### `tally mcp`

Run as an MCP tool server on stdio (for Claude Desktop, Claude Code and other MCP clients).

Exposes operations as tools, limited by the profile's "frontends.mcp" ceiling (read by default). --toolset all exposes every operation; "core" exposes the main ones plus generic find/run tools. "tally integrate" prints the client configuration.

Access: `local`. Tool name: `mcp`.

| Option | Type | Description |
|---|---|---|
| `--toolset` | core \| all | Default from mcp.toolset in the config (core). |

```bash
tally mcp
tally mcp --profile main --toolset all
```

## ops

### `tally ops`

List every operation with its parameters (machine-readable with --json, Markdown with --markdown).

Access: `local`. Tool name: `ops`.

| Option | Type | Description |
|---|---|---|
| `--markdown` | boolean | Render as Markdown (used to generate docs/COMMANDS.md). |
| `--tier` | core \| extended \| hatch | Only operations of this tier. |
| `--kind` | local \| read \| write \| destructive \| unsafe |  |
| `--search` | string | Only operations whose id or summary contains this text. |

```bash
tally ops --json
tally ops --kind write
tally ops --markdown --out docs/COMMANDS.md
```

## party

### `tally party bills <name>`

Pending bills of one party (what to settle when posting a receipt or payment).

Access: `read`. Tool name: `party_bills`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string |  |
| `--as-of` | date |  |

```bash
tally party bills "Alpha Hardware Stores"
```

### `tally party get <name>`

One party with contacts, GSTIN check, credit terms, balance and pending bills.

Access: `read`. Tool name: `party_get`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string |  |
| `--as-of` | date |  |

```bash
tally party get "Alpha Hardware Stores"
```

### `tally party list`

Customers and/or suppliers with GSTIN, contacts, credit days and balance.

Access: `read`. Tool name: `party_list`.

| Option | Type | Description |
|---|---|---|
| `--kind` | customers \| suppliers \| all |  Default `"all"`. |
| `--search` | string |  |
| `--limit` | integer |  |
| `--as-of` | date |  |

```bash
tally party list --kind customers
tally party list --search traders
```

### `tally party statement <name>`

Statement of account for a party (ledger statement) plus pending bills.

Access: `read`. Tool name: `party_statement`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string |  |
| `--from` | date | Start date (YYYY-MM-DD). Default: start of the financial year. |
| `--to` | date | End date (YYYY-MM-DD). Default: today. |
| `--fy` | string | Financial year instead of from/to, e.g. 2026-27, current, previous. |

```bash
tally party statement "Alpha Hardware Stores" --fy current
```

## post

### `tally post contra`

Move money between cash and bank ledgers (deposit, withdrawal, transfer).

Access: `write`. Tool name: `post_contra`.

| Option | Type | Description |
|---|---|---|
| `--from` (required) | string | Ledger the money leaves (credited). |
| `--to` (required) | string | Ledger the money goes to (debited). |
| `--amount` (required) | number |  |
| `--mode` | string | cheque \| neft \| rtgs \| imps \| upi \| others \| cash |
| `--instrument-number` | string | Cheque number or UTR. |
| `--instrument-date` | date |  |
| `--upi-id` | string |  |
| `--date` | date | Voucher date (default today). |
| `--number` | string | Voucher number (default: Tally numbering). |
| `--reference` | string |  |
| `--narration` | string |  |
| `--voucher-type` | string | A custom voucher type of this kind (default: the standard one). |
| `--optional` | boolean | Create as an optional voucher (kept out of the books until regularised). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally post contra --from "Bank of Example - Current A/c" --to Cash --amount 20000 --narration "Cash withdrawn"
```

### `tally post credit-note`

Create a credit note with items, GST and bill reference. Full detail via --input; one item via flags.

Access: `write`. Tool name: `post_credit_note`.

| Option | Type | Description |
|---|---|---|
| `--party` (required) | string |  |
| `--items` | array | Items [{item, qty, rate, ledger, godown, discountPct, gstRate, orderNo}]. |
| `--item` | string | Single item (instead of items). |
| `--qty` | number |  |
| `--rate` | number |  |
| `--ledger` | string | Sales ledger for the item(s). |
| `--godown` | string |  |
| `--charges` | array | Extra lines [{ledger, amount, deduct?, gstRate?}] such as freight or discount. |
| `--taxes` | any | "auto" (default when items have GST rates), "none", or [{ledger, amount}]. |
| `--round-off` | any | "auto" or {ledger, amount}. |
| `--bills` | any | Party bill allocation (default: a new bill named after the voucher number). |
| `--expected-total` | number | Refuse unless the computed total equals this. |
| `--place-of-supply` | string |  |
| `--order-no` | string |  |
| `--due-date` | date |  |
| `--date` | date | Voucher date (default today). |
| `--number` | string | Voucher number (default: Tally numbering). |
| `--reference` | string |  |
| `--narration` | string |  |
| `--voucher-type` | string | A custom voucher type of this kind (default: the standard one). |
| `--optional` | boolean | Create as an optional voucher (kept out of the books until regularised). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally post credit-note --input credit-note.json --dry-run
tally post credit-note --party "Prime Cables Ltd" --item "LED Bulb 9W" --qty 100 --rate 62 --ledger "Purchase GST 12%" --number PB-77 --round-off auto
```

### `tally post debit-note`

Create a debit note with items, GST and bill reference. Full detail via --input; one item via flags.

Access: `write`. Tool name: `post_debit_note`.

| Option | Type | Description |
|---|---|---|
| `--party` (required) | string |  |
| `--items` | array | Items [{item, qty, rate, ledger, godown, discountPct, gstRate, orderNo}]. |
| `--item` | string | Single item (instead of items). |
| `--qty` | number |  |
| `--rate` | number |  |
| `--ledger` | string | Purchase ledger for the item(s). |
| `--godown` | string |  |
| `--charges` | array | Extra lines [{ledger, amount, deduct?, gstRate?}] such as freight or discount. |
| `--taxes` | any | "auto" (default when items have GST rates), "none", or [{ledger, amount}]. |
| `--round-off` | any | "auto" or {ledger, amount}. |
| `--bills` | any | Party bill allocation (default: a new bill named after the voucher number). |
| `--expected-total` | number | Refuse unless the computed total equals this. |
| `--place-of-supply` | string |  |
| `--order-no` | string |  |
| `--due-date` | date |  |
| `--date` | date | Voucher date (default today). |
| `--number` | string | Voucher number (default: Tally numbering). |
| `--reference` | string |  |
| `--narration` | string |  |
| `--voucher-type` | string | A custom voucher type of this kind (default: the standard one). |
| `--optional` | boolean | Create as an optional voucher (kept out of the books until regularised). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally post debit-note --input debit-note.json --dry-run
tally post debit-note --party "Alpha Hardware Stores" --item "LED Bulb 9W" --qty 100 --rate 95 --ledger "Sales GST 12%" --number SI/26-27/0101 --round-off auto
```

### `tally post delivery-note`

Create a delivery note with items, GST and bill reference. Full detail via --input; one item via flags.

Access: `write`. Tool name: `post_delivery_note`.

| Option | Type | Description |
|---|---|---|
| `--party` (required) | string |  |
| `--items` | array | Items [{item, qty, rate, ledger, godown, discountPct, gstRate, orderNo}]. |
| `--item` | string | Single item (instead of items). |
| `--qty` | number |  |
| `--rate` | number |  |
| `--ledger` | string | Sales ledger for the item(s). |
| `--godown` | string |  |
| `--charges` | array | Extra lines [{ledger, amount, deduct?, gstRate?}] such as freight or discount. |
| `--taxes` | any | "auto" (default when items have GST rates), "none", or [{ledger, amount}]. |
| `--round-off` | any | "auto" or {ledger, amount}. |
| `--bills` | any | Party bill allocation (default: a new bill named after the voucher number). |
| `--expected-total` | number | Refuse unless the computed total equals this. |
| `--place-of-supply` | string |  |
| `--order-no` | string |  |
| `--due-date` | date |  |
| `--date` | date | Voucher date (default today). |
| `--number` | string | Voucher number (default: Tally numbering). |
| `--reference` | string |  |
| `--narration` | string |  |
| `--voucher-type` | string | A custom voucher type of this kind (default: the standard one). |
| `--optional` | boolean | Create as an optional voucher (kept out of the books until regularised). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally post delivery-note --input delivery-note.json --dry-run
tally post delivery-note --party "Alpha Hardware Stores" --item "LED Bulb 9W" --qty 100 --rate 95 --ledger "Sales GST 12%" --number SI/26-27/0101 --round-off auto
```

### `tally post journal`

Journal entry: one debit and one credit ledger with --debit/--credit/--amount, or many lines with --input.

Access: `write`. Tool name: `post_journal`.

| Option | Type | Description |
|---|---|---|
| `--debit` | string | Ledger to debit. |
| `--credit` | string | Ledger to credit. |
| `--amount` | number |  |
| `--entries` | array | Lines [{ledger, debit\|credit, bills?, costCentres?}] for multi-line journals. |
| `--date` | date | Voucher date (default today). |
| `--number` | string | Voucher number (default: Tally numbering). |
| `--reference` | string |  |
| `--narration` | string |  |
| `--voucher-type` | string | A custom voucher type of this kind (default: the standard one). |
| `--optional` | boolean | Create as an optional voucher (kept out of the books until regularised). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally post journal --debit "Salaries" --credit "Second Bank - OD A/c" --amount 38000 --narration "Salary provision"
tally post journal --input journal.json
```

### `tally post payment`

Record money paid to a party (or an expense ledger) from a bank/cash ledger, settling bills.

Access: `write`. Tool name: `post_payment`.

| Option | Type | Description |
|---|---|---|
| `--party` (required) | string | Supplier, expense or any ledger paid. |
| `--amount` (required) | number |  |
| `--bank` | string | Bank or cash ledger. |
| `--against` | array | Bills to settle: "REF" or "REF:amount" (repeatable or comma separated). |
| `--on-account` | boolean | Do not settle specific bills (amount stays on account). |
| `--advance` | string | Record as an advance with this reference. |
| `--auto-allocate` | boolean | Settle the oldest pending bills first; any remainder goes on account. |
| `--mode` | string | cheque \| neft \| rtgs \| imps \| upi \| others \| cash |
| `--instrument-number` | string | Cheque number or UTR. |
| `--instrument-date` | date |  |
| `--upi-id` | string |  |
| `--date` | date | Voucher date (default today). |
| `--number` | string | Voucher number (default: Tally numbering). |
| `--reference` | string |  |
| `--narration` | string |  |
| `--voucher-type` | string | A custom voucher type of this kind (default: the standard one). |
| `--optional` | boolean | Create as an optional voucher (kept out of the books until regularised). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally post payment --party "Prime Cables Ltd" --amount 97562 --bank "Bank of Example - Current A/c" --against PRI-8536 --mode neft --instrument-number UTR555
```

### `tally post purchase`

Create a purchase with items, GST and bill reference. Full detail via --input; one item via flags.

Access: `write`. Tool name: `post_purchase`.

| Option | Type | Description |
|---|---|---|
| `--party` (required) | string |  |
| `--items` | array | Items [{item, qty, rate, ledger, godown, discountPct, gstRate, orderNo}]. |
| `--item` | string | Single item (instead of items). |
| `--qty` | number |  |
| `--rate` | number |  |
| `--ledger` | string | Purchase ledger for the item(s). |
| `--godown` | string |  |
| `--charges` | array | Extra lines [{ledger, amount, deduct?, gstRate?}] such as freight or discount. |
| `--taxes` | any | "auto" (default when items have GST rates), "none", or [{ledger, amount}]. |
| `--round-off` | any | "auto" or {ledger, amount}. |
| `--bills` | any | Party bill allocation (default: a new bill named after the voucher number). |
| `--expected-total` | number | Refuse unless the computed total equals this. |
| `--place-of-supply` | string |  |
| `--order-no` | string |  |
| `--due-date` | date |  |
| `--date` | date | Voucher date (default today). |
| `--number` | string | Voucher number (default: Tally numbering). |
| `--reference` | string |  |
| `--narration` | string |  |
| `--voucher-type` | string | A custom voucher type of this kind (default: the standard one). |
| `--optional` | boolean | Create as an optional voucher (kept out of the books until regularised). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally post purchase --input purchase.json --dry-run
tally post purchase --party "Prime Cables Ltd" --item "LED Bulb 9W" --qty 100 --rate 62 --ledger "Purchase GST 12%" --number PB-77 --round-off auto
```

### `tally post purchase-order`

Create a purchase order. Full detail via --input; one item via flags.

Access: `write`. Tool name: `post_purchase_order`.

| Option | Type | Description |
|---|---|---|
| `--party` (required) | string |  |
| `--items` | array | Items [{item, qty, rate, ledger, godown, discountPct, gstRate, orderNo}]. |
| `--item` | string | Single item (instead of items). |
| `--qty` | number |  |
| `--rate` | number |  |
| `--ledger` | string | Purchase ledger for the item(s). |
| `--godown` | string |  |
| `--charges` | array | Extra lines [{ledger, amount, deduct?, gstRate?}] such as freight or discount. |
| `--taxes` | any | "auto" (default when items have GST rates), "none", or [{ledger, amount}]. |
| `--round-off` | any | "auto" or {ledger, amount}. |
| `--bills` | any | Party bill allocation (default: a new bill named after the voucher number). |
| `--expected-total` | number | Refuse unless the computed total equals this. |
| `--place-of-supply` | string |  |
| `--order-no` | string |  |
| `--due-date` | date |  |
| `--date` | date | Voucher date (default today). |
| `--number` | string | Voucher number (default: Tally numbering). |
| `--reference` | string |  |
| `--narration` | string |  |
| `--voucher-type` | string | A custom voucher type of this kind (default: the standard one). |
| `--optional` | boolean | Create as an optional voucher (kept out of the books until regularised). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally post purchase-order --input purchase-order.json --dry-run
tally post purchase-order --party "Prime Cables Ltd" --item "LED Bulb 9W" --qty 100 --rate 62 --ledger "Purchase GST 12%" --number PB-77 --round-off auto
```

### `tally post receipt`

Record money received from a party into a bank/cash ledger, settling bills.

Access: `write`. Tool name: `post_receipt`.

| Option | Type | Description |
|---|---|---|
| `--party` (required) | string | Customer (or any ledger) the money came from. |
| `--amount` (required) | number |  |
| `--bank` | string | Bank or cash ledger. |
| `--against` | array | Bills to settle: "REF" or "REF:amount" (repeatable or comma separated). |
| `--on-account` | boolean | Do not settle specific bills (amount stays on account). |
| `--advance` | string | Record as an advance with this reference. |
| `--auto-allocate` | boolean | Settle the oldest pending bills first; any remainder goes on account. |
| `--mode` | string | cheque \| neft \| rtgs \| imps \| upi \| others \| cash |
| `--instrument-number` | string | Cheque number or UTR. |
| `--instrument-date` | date |  |
| `--upi-id` | string |  |
| `--date` | date | Voucher date (default today). |
| `--number` | string | Voucher number (default: Tally numbering). |
| `--reference` | string |  |
| `--narration` | string |  |
| `--voucher-type` | string | A custom voucher type of this kind (default: the standard one). |
| `--optional` | boolean | Create as an optional voucher (kept out of the books until regularised). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally post receipt --party "Alpha Hardware Stores" --amount 11800 --bank "Bank of Example - Current A/c" --mode neft --instrument-number UTR123 --against SI/26-27/0012
tally post receipt --party "Alpha Hardware Stores" --amount 50000 --bank Cash --auto-allocate --dry-run
```

### `tally post receipt-note`

Create a receipt note with items, GST and bill reference. Full detail via --input; one item via flags.

Access: `write`. Tool name: `post_receipt_note`.

| Option | Type | Description |
|---|---|---|
| `--party` (required) | string |  |
| `--items` | array | Items [{item, qty, rate, ledger, godown, discountPct, gstRate, orderNo}]. |
| `--item` | string | Single item (instead of items). |
| `--qty` | number |  |
| `--rate` | number |  |
| `--ledger` | string | Purchase ledger for the item(s). |
| `--godown` | string |  |
| `--charges` | array | Extra lines [{ledger, amount, deduct?, gstRate?}] such as freight or discount. |
| `--taxes` | any | "auto" (default when items have GST rates), "none", or [{ledger, amount}]. |
| `--round-off` | any | "auto" or {ledger, amount}. |
| `--bills` | any | Party bill allocation (default: a new bill named after the voucher number). |
| `--expected-total` | number | Refuse unless the computed total equals this. |
| `--place-of-supply` | string |  |
| `--order-no` | string |  |
| `--due-date` | date |  |
| `--date` | date | Voucher date (default today). |
| `--number` | string | Voucher number (default: Tally numbering). |
| `--reference` | string |  |
| `--narration` | string |  |
| `--voucher-type` | string | A custom voucher type of this kind (default: the standard one). |
| `--optional` | boolean | Create as an optional voucher (kept out of the books until regularised). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally post receipt-note --input receipt-note.json --dry-run
tally post receipt-note --party "Prime Cables Ltd" --item "LED Bulb 9W" --qty 100 --rate 62 --ledger "Purchase GST 12%" --number PB-77 --round-off auto
```

### `tally post sales`

Create a sales with items, GST and bill reference. Full detail via --input; one item via flags.

Access: `write`. Tool name: `post_sales`.

| Option | Type | Description |
|---|---|---|
| `--party` (required) | string |  |
| `--items` | array | Items [{item, qty, rate, ledger, godown, discountPct, gstRate, orderNo}]. |
| `--item` | string | Single item (instead of items). |
| `--qty` | number |  |
| `--rate` | number |  |
| `--ledger` | string | Sales ledger for the item(s). |
| `--godown` | string |  |
| `--charges` | array | Extra lines [{ledger, amount, deduct?, gstRate?}] such as freight or discount. |
| `--taxes` | any | "auto" (default when items have GST rates), "none", or [{ledger, amount}]. |
| `--round-off` | any | "auto" or {ledger, amount}. |
| `--bills` | any | Party bill allocation (default: a new bill named after the voucher number). |
| `--expected-total` | number | Refuse unless the computed total equals this. |
| `--place-of-supply` | string |  |
| `--order-no` | string |  |
| `--due-date` | date |  |
| `--date` | date | Voucher date (default today). |
| `--number` | string | Voucher number (default: Tally numbering). |
| `--reference` | string |  |
| `--narration` | string |  |
| `--voucher-type` | string | A custom voucher type of this kind (default: the standard one). |
| `--optional` | boolean | Create as an optional voucher (kept out of the books until regularised). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally post sales --input sales.json --dry-run
tally post sales --party "Alpha Hardware Stores" --item "LED Bulb 9W" --qty 100 --rate 95 --ledger "Sales GST 12%" --number SI/26-27/0101 --round-off auto
```

### `tally post sales-order`

Create a sales order. Full detail via --input; one item via flags.

Access: `write`. Tool name: `post_sales_order`.

| Option | Type | Description |
|---|---|---|
| `--party` (required) | string |  |
| `--items` | array | Items [{item, qty, rate, ledger, godown, discountPct, gstRate, orderNo}]. |
| `--item` | string | Single item (instead of items). |
| `--qty` | number |  |
| `--rate` | number |  |
| `--ledger` | string | Sales ledger for the item(s). |
| `--godown` | string |  |
| `--charges` | array | Extra lines [{ledger, amount, deduct?, gstRate?}] such as freight or discount. |
| `--taxes` | any | "auto" (default when items have GST rates), "none", or [{ledger, amount}]. |
| `--round-off` | any | "auto" or {ledger, amount}. |
| `--bills` | any | Party bill allocation (default: a new bill named after the voucher number). |
| `--expected-total` | number | Refuse unless the computed total equals this. |
| `--place-of-supply` | string |  |
| `--order-no` | string |  |
| `--due-date` | date |  |
| `--date` | date | Voucher date (default today). |
| `--number` | string | Voucher number (default: Tally numbering). |
| `--reference` | string |  |
| `--narration` | string |  |
| `--voucher-type` | string | A custom voucher type of this kind (default: the standard one). |
| `--optional` | boolean | Create as an optional voucher (kept out of the books until regularised). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally post sales-order --input sales-order.json --dry-run
tally post sales-order --party "Alpha Hardware Stores" --item "LED Bulb 9W" --qty 100 --rate 95 --ledger "Sales GST 12%" --number SI/26-27/0101 --round-off auto
```

### `tally post stock-journal`

Stock journal: transfer between godowns (flags) or consumption/production (--input with consumed and produced).

Access: `write`. Tool name: `post_stock_journal`.

| Option | Type | Description |
|---|---|---|
| `--item` | string |  |
| `--qty` | number |  |
| `--rate` | number | Valuation rate for the transfer. |
| `--from-godown` | string |  |
| `--to-godown` | string |  |
| `--consumed` | array |  |
| `--produced` | array |  |
| `--date` | date | Voucher date (default today). |
| `--number` | string | Voucher number (default: Tally numbering). |
| `--reference` | string |  |
| `--narration` | string |  |
| `--voucher-type` | string | A custom voucher type of this kind (default: the standard one). |
| `--optional` | boolean | Create as an optional voucher (kept out of the books until regularised). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally post stock-journal --item "LED Panel 18W" --qty 20 --rate 470 --from-godown "Main Location" --to-godown "Pune Warehouse"
tally post stock-journal --input manufacture.json
```

## query

### `tally query collection <type>`

Run an ad-hoc collection query: any object type, chosen fields, filters, period.

Builds an inline report over a Tally collection and returns one row per object. Fields are Tally method names (Name, Parent, ClosingBalance, ...) optionally with a type suffix: "ClosingBalance:amount", "Date:date", "IsOptional:logical", "ActualQty:qty". Use --route to descend into sub-collections, e.g. --type Voucher --route AllLedgerEntries,BillAllocations.

Access: `read`. Tool name: `query_collection`.

| Option | Type | Description |
|---|---|---|
| `--type` (required) | string | Collection type: Ledger, Group, StockItem, Voucher, Bill, Company, CostCentre, Godown, ... |
| `--fields` | array | Method names, optionally "Method:type" (text\|amount\|date\|logical\|number\|qty\|rate\|parent), or "key=formula:type". Default `["Name"]`. |
| `--filter` | array | TDL filter formulas (all must be true). |
| `--route` | array | Sub-collection path, e.g. AllLedgerEntries,BillAllocations. |
| `--child-of` | string | Only direct children of this group/parent. |
| `--belongs-to` | boolean | With childOf: include all descendants. |
| `--from` | date |  |
| `--to` | date |  |
| `--limit` | integer |  |

```bash
tally query collection Ledger --fields Name,Parent,ClosingBalance:amount --child-of "Bank Accounts"
tally query collection Voucher --fields Date:date,VoucherNumber,Narration --from 2026-04-01 --to 2026-04-30 --filter "$$IsEqual:$VoucherTypeName:\"Sales\""
```

### `tally query formula <formula>`

Evaluate any TDL formula for one object (or the company), e.g. a computed balance.

Access: `read`. Tool name: `query_formula`.

| Option | Type | Description |
|---|---|---|
| `--formula` (required) | string | TDL formula, e.g. $ClosingBalance:Ledger:"Cash". |
| `--type` | string | Collection type to evaluate in. Default `"Company"`. |
| `--name` | string | Object name (default: the active company). |
| `--as` | text \| amount \| date \| logical \| number \| qty \| rate |  Default `"text"`. |
| `--to` | date | As-of date for balances. |

```bash
tally query formula "$ClosingBalance:Ledger:\"Cash\"" --as amount
```

### `tally query function <name>`

Evaluate a TDL function ($$Name) with parameters and return its result.

Access: `read`. Tool name: `query_function`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string | Function, e.g. $$SystemPeriodFrom or $$NumStockItems. |
| `--params` | array |  |

```bash
tally query function $$SystemPeriodTo
tally query function $$NumStockItems
```

### `tally query native <type>`

Export a collection in Tally's native XML (as JSON), e.g. full vouchers or masters with all fields.

Access: `read`. Tool name: `query_native`.

| Option | Type | Description |
|---|---|---|
| `--type` (required) | string | Collection type (Voucher, Ledger, ...). |
| `--fetch` | array | Methods to fetch; "*" for all native fields. Default `["*"]`. |
| `--filter` | array |  |
| `--from` | date |  |
| `--to` | date |  |
| `--xml` | boolean | Return the raw XML text instead of JSON. |

```bash
tally query native Voucher --from 2026-04-01 --to 2026-04-01 --filter "$$IsEqual:$VoucherTypeName:\"Sales\""
```

### `tally query object <type> <id>`

Export one object by type and identifier (Name by default).

Access: `read`. Tool name: `query_object`.

| Option | Type | Description |
|---|---|---|
| `--type` (required) | string | Object type, e.g. Ledger, StockItem, Group, Voucher. |
| `--id` (required) | string | Identifier value. |
| `--id-type` | string | Identifier type: Name, MasterID, GUID. Default `"Name"`. |
| `--fetch` | array |  |

```bash
tally query object Ledger "Cash" --fetch Name,ClosingBalance
```

## raw

### `tally raw <file>`

Send any request body (XML, or JSON for TallyPrime 7+) to Tally and return the reply. Command line only.

For anything not covered by a command. Import and Execute requests are refused unless writes are on (writeMode "on") and --yes is given; they are audited. JSON requests need --header entries (tallyrequest, type, id, version) as documented for TallyPrime 7.

Access: `unsafe`. Tool name: `raw`.

| Option | Type | Description |
|---|---|---|
| `--file` | string | File with the request body ("-" for stdin). |
| `--body` | string | Request body inline (prefer --file). |
| `--header` | array | Extra HTTP headers "Name: value" (repeatable). |
| `--content-type` | string | Override Content-Type (e.g. application/json). |
| `--yes` | boolean | Confirm sending an Import/Execute request. |
| `--dry-run` | boolean |  |

```bash
tally raw templates/raw/list-companies.xml
tally raw request.json --content-type application/json --header "tallyrequest: Export" --header "type: Collection" --header "id: List of Ledgers" --header "version: 1"
```

## relay

### `tally relay`

Connect out to a relay hub and run signed jobs from a cloud AI system (no inbound port needed).

Access: `local`. Tool name: `relay`.

| Option | Type | Description |
|---|---|---|
| `--once` | boolean | Handle at most one poll and exit (for testing). |

```bash
tally relay
tally relay --once
```

## report

### `tally report balance-sheet`

Balance sheet as of a date: liabilities and assets by primary group, with the current profit.

Access: `read`. Tool name: `report_balance_sheet`.

| Option | Type | Description |
|---|---|---|
| `--as-of` | date |  |
| `--from` | date | Start of the period for the current profit (default: FY start). |

```bash
tally report balance-sheet --as-of 2026-09-30
```

### `tally report cash-bank`

Cash and bank ledgers with opening, receipts, payments and closing; or one book with --ledger.

Access: `read`. Tool name: `report_cash_bank`.

| Option | Type | Description |
|---|---|---|
| `--ledger` | string | Show the statement of this cash/bank ledger. |
| `--from` | date | Start date (YYYY-MM-DD). Default: start of the financial year. |
| `--to` | date | End date (YYYY-MM-DD). Default: today. |
| `--fy` | string | Financial year instead of from/to, e.g. 2026-27, current, previous. |

```bash
tally report cash-bank
tally report cash-bank --ledger Cash --from 2026-11-01
```

### `tally report day-book`

All vouchers of a period (default today) with totals per voucher type.

Access: `read`. Tool name: `report_day_book`.

| Option | Type | Description |
|---|---|---|
| `--from` | date | Start date (YYYY-MM-DD). Default: start of the financial year. |
| `--to` | date | End date (YYYY-MM-DD). Default: today. |
| `--fy` | string | Financial year instead of from/to, e.g. 2026-27, current, previous. |
| `--type` | string |  |
| `--status` | active \| regular \| optional \| cancelled \| all | active = regular + optional (not cancelled). Default `"active"`. |

```bash
tally report day-book
tally report day-book --from 2026-11-01 --to 2026-11-07
```

### `tally report godown-summary`

Closing quantity of each item in each godown (location) as of a date.

Access: `read`. Tool name: `report_godown_summary`.

| Option | Type | Description |
|---|---|---|
| `--as-of` | date |  |
| `--godown` | string |  |
| `--item` | string |  |
| `--all` | boolean |  |

```bash
tally report godown-summary --godown "Pune Warehouse"
```

### `tally report group-summary <group>`

Balances of the sub-groups and ledgers directly under a group (default: top level).

Access: `read`. Tool name: `report_group_summary`.

| Option | Type | Description |
|---|---|---|
| `--group` | string |  |
| `--from` | date | Start date (YYYY-MM-DD). Default: start of the financial year. |
| `--to` | date | End date (YYYY-MM-DD). Default: today. |
| `--fy` | string | Financial year instead of from/to, e.g. 2026-27, current, previous. |
| `--all` | boolean | Include zero rows. |

```bash
tally report group-summary "Current Assets"
tally report group-summary
```

### `tally report item-movement <item>`

Every inward and outward movement of one stock item with running quantity.

Access: `read`. Tool name: `report_item_movement`.

| Option | Type | Description |
|---|---|---|
| `--item` (required) | string |  |
| `--from` | date | Start date (YYYY-MM-DD). Default: start of the financial year. |
| `--to` | date | End date (YYYY-MM-DD). Default: today. |
| `--fy` | string | Financial year instead of from/to, e.g. 2026-27, current, previous. |

```bash
tally report item-movement "LED Bulb 9W" --fy current
```

### `tally report ledger <ledger>`

Ledger statement with opening, each voucher, running balance and closing (any ledger: party, bank, expense).

Access: `read`. Tool name: `report_ledger`.

| Option | Type | Description |
|---|---|---|
| `--ledger` (required) | string |  |
| `--from` | date | Start date (YYYY-MM-DD). Default: start of the financial year. |
| `--to` | date | End date (YYYY-MM-DD). Default: today. |
| `--fy` | string | Financial year instead of from/to, e.g. 2026-27, current, previous. |

```bash
tally report ledger "Alpha Hardware Stores" --fy current
tally report ledger Cash --from 2026-11-01
```

### `tally report orders-pending`

Sales (or purchase) order lines with ordered, delivered and pending quantity and due dates.

Access: `read`. Tool name: `report_orders_pending`.

| Option | Type | Description |
|---|---|---|
| `--kind` | sales \| purchase |  Default `"sales"`. |
| `--from` | date | Start date (YYYY-MM-DD). Default: start of the financial year. |
| `--to` | date | End date (YYYY-MM-DD). Default: today. |
| `--fy` | string | Financial year instead of from/to, e.g. 2026-27, current, previous. |
| `--all` | boolean | Include fully delivered lines. |

```bash
tally report orders-pending
tally report orders-pending --kind purchase
```

### `tally report payables`

Outstanding payables to suppliers bill by bill with ageing.

Access: `read`. Tool name: `report_payables`.

| Option | Type | Description |
|---|---|---|
| `--as-of` | date |  |
| `--party` | string |  |
| `--group` | string |  |
| `--buckets` | string |  Default `"30,60,90,180"`. |
| `--age-by` | bill-date \| due-date |  Default `"bill-date"`. |
| `--min-days` | integer |  |
| `--with-contacts` | boolean |  |
| `--detail` | boolean |  Default `true`. |

```bash
tally report payables --age-by due-date
```

### `tally report profit-loss`

Profit and loss for a period: trading and indirect sections, gross and net profit, stock values.

Access: `read`. Tool name: `report_profit_loss`.

| Option | Type | Description |
|---|---|---|
| `--from` | date | Start date (YYYY-MM-DD). Default: start of the financial year. |
| `--to` | date | End date (YYYY-MM-DD). Default: today. |
| `--fy` | string | Financial year instead of from/to, e.g. 2026-27, current, previous. |

```bash
tally report profit-loss --fy current
```

### `tally report purchase-register`

Purchase register: each bill with supplier GSTIN, taxable value and taxes (for GSTR-2B matching).

Access: `read`. Tool name: `report_purchase_register`.

| Option | Type | Description |
|---|---|---|
| `--from` | date | Start date (YYYY-MM-DD). Default: start of the financial year. |
| `--to` | date | End date (YYYY-MM-DD). Default: today. |
| `--fy` | string | Financial year instead of from/to, e.g. 2026-27, current, previous. |
| `--include-notes` | boolean | Include debit notes (as negatives). |

```bash
tally report purchase-register --from 2026-10-01 --to 2026-10-31
```

### `tally report receivables`

Outstanding receivables bill by bill with ageing buckets and party totals (input for payment reminders).

Access: `read`. Tool name: `report_receivables`.

| Option | Type | Description |
|---|---|---|
| `--as-of` | date | As of this date (default today). |
| `--party` | string |  |
| `--group` | string | Only parties under this group (e.g. a regional sub-group of Sundry Debtors). |
| `--buckets` | string | Ageing bucket edges in days. Default `"30,60,90,180"`. |
| `--age-by` | bill-date \| due-date |  Default `"bill-date"`. |
| `--min-days` | integer | Only bills at least this old (or overdue, with --age-by due-date). |
| `--with-contacts` | boolean | Add phone, email and credit days of each party. |
| `--detail` | boolean | Include the bill-level list. Default `true`. |

```bash
tally report receivables --with-contacts
tally report receivables --age-by due-date --min-days 1 --json
```

### `tally report run <name>`

Export any built-in Tally report by its exact name (raw structure), e.g. "Bills Receivable", "Day Book".

Access: `read`. Tool name: `report_run`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string | Report name as Tally knows it. |
| `--from` | date |  |
| `--to` | date |  |
| `--vars` | object | Extra static variables, e.g. {"LEDGERNAME": "Cash", "EXPLODEFLAG": "Yes"}. |
| `--xml` | boolean | Return the XML text instead of JSON. |

```bash
tally report run "Trial Balance" --to 2026-11-30
tally report run "Ledger Vouchers" --vars '{"LEDGERNAME":"Cash"}'
```

### `tally report sales-register`

Sales register: each invoice with party GSTIN, taxable value, CGST/SGST/IGST/cess, round off and total.

Access: `read`. Tool name: `report_sales_register`.

| Option | Type | Description |
|---|---|---|
| `--from` | date | Start date (YYYY-MM-DD). Default: start of the financial year. |
| `--to` | date | End date (YYYY-MM-DD). Default: today. |
| `--fy` | string | Financial year instead of from/to, e.g. 2026-27, current, previous. |
| `--include-notes` | boolean | Include credit notes (as negatives). |

```bash
tally report sales-register --from 2026-10-01 --to 2026-10-31 --csv --out sales-oct.csv
```

### `tally report stock-summary`

Stock summary per item: opening, inward, outward and closing quantity and value.

Access: `read`. Tool name: `report_stock_summary`.

| Option | Type | Description |
|---|---|---|
| `--from` | date | Start date (YYYY-MM-DD). Default: start of the financial year. |
| `--to` | date | End date (YYYY-MM-DD). Default: today. |
| `--fy` | string | Financial year instead of from/to, e.g. 2026-27, current, previous. |
| `--under` | string | Only items under this stock group. |
| `--all` | boolean | Include items with no stock or movement. |

```bash
tally report stock-summary
tally report stock-summary --under Switchgear
```

### `tally report trial-balance`

Trial balance by ledger or by primary group: opening, period debits/credits, closing; checks the totals.

Access: `read`. Tool name: `report_trial_balance`.

| Option | Type | Description |
|---|---|---|
| `--from` | date | Start date (YYYY-MM-DD). Default: start of the financial year. |
| `--to` | date | End date (YYYY-MM-DD). Default: today. |
| `--fy` | string | Financial year instead of from/to, e.g. 2026-27, current, previous. |
| `--level` | ledger \| group |  Default `"ledger"`. |
| `--group` | string | Only ledgers under this group. |

```bash
tally report trial-balance --level group
tally report trial-balance --fy current --csv --out tb.csv
```

## selftest

### `tally selftest`

Probe this Tally for every behaviour the tool relies on, save the results, print a report. --write adds write tests (test company only).

Access: `read`. Tool name: `selftest`.

| Option | Type | Description |
|---|---|---|
| `--write` | boolean | Also run write tests (creates and removes test records). |
| `--confirm-company` | string | Required with --write: the target company name, typed out. |
| `--no-save` | boolean | Do not store the results. |

```bash
tally selftest
tally selftest --write --confirm-company "Test Company"
```

## serve

### `tally serve`

Run the local HTTP API (token protected, this PC only by default) for n8n, Make or a backend.

Access: `local`. Tool name: `serve`.

| Option | Type | Description |
|---|---|---|
| `--port` | integer | Default from http.port (8765). |
| `--host` | string | Default 127.0.0.1. Binding to another address needs --allow-network. |
| `--allow-network` | boolean | Allow binding to a non-loopback address (put it behind a firewall or tunnel). |

```bash
tally serve
tally serve --port 8800
```

## simulate

### `tally simulate`

Run a Tally simulator on a port (fictional demo company) for demos, rehearsals and testing integrations.

Access: `local`. Tool name: `simulate`.

| Option | Type | Description |
|---|---|---|
| `--port` | integer |  Default `9000`. |
| `--state` | string | JSON file to keep the simulated books between runs. |
| `--empty` | boolean | Start with an empty company instead of the demo data. |
| `--educational` | boolean | Behave like Educational mode (date restrictions). |
| `--delay-ms` | integer | Add latency to every reply. Default `0`. |
| `--seed` | integer |  Default `42`. |

```bash
tally simulate --port 9000 --state demo-books.json
tally simulate --empty --port 9100
```

## status

### `tally status`

One-line health: reachable, target company, change counters, write mode.

Access: `read`. Tool name: `status`.

```bash
tally status
```

## stock-category

### `tally stock-category create <name>`

Create a stock category. Fails if it already exists (use ensure for create-if-missing).

Access: `write`. Tool name: `stock_category_create`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string |  |
| `--parent` | string |  |
| `--raw` | object |  |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally stock-category create "Example"
```

### `tally stock-category delete <name>`

Delete a stock category (Tally refuses if it is in use).

Access: `destructive`. Tool name: `stock_category_delete`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string |  |
| `--yes` | boolean | Confirm a destructive action (delete, cancel, alter). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |

```bash
tally stock-category delete "Example" --yes
```

### `tally stock-category ensure <name>`

Create the stock category if it does not exist; if it exists, report differences without changing it.

Access: `write`. Tool name: `stock_category_ensure`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string |  |
| `--parent` | string |  |
| `--raw` | object |  |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally stock-category ensure "Example"
```

### `tally stock-category get <name>`

Get one stock category by exact name (suggests close matches when not found).

Access: `read`. Tool name: `stock_category_get`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string | Stock category name. |
| `--as-of` | date | Balances as of this date. |
| `--native` | boolean | Also return the object as Tally exports it (all fields). |

```bash
tally stock-category get "Main Location"
```

### `tally stock-category list`

List stock categorys.

Access: `read`. Tool name: `stock_category_list`.

| Option | Type | Description |
|---|---|---|
| `--search` | string | Text to match against stock category names. |
| `--limit` | integer | Return at most this many rows. |
| `--under` | string | Only stock categorys under this stock category (any depth). |

```bash
tally stock-category list
```

### `tally stock-category update <name>`

Change fields of an existing stock category (only the fields given are sent). Use --new-name to rename.

Access: `write`. Tool name: `stock_category_update`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string |  |
| `--parent` | string |  |
| `--raw` | object |  |
| `--new-name` | string | Rename to this. |
| `--yes` | boolean | Confirm changing an opening balance (also needs allowDestructive). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally stock-category update "Example" --new-name "Example 2"
```

## stock-group

### `tally stock-group create <name>`

Create a stock group. Fails if it already exists (use ensure for create-if-missing).

Access: `write`. Tool name: `stock_group_create`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string |  |
| `--parent` | string |  |
| `--addable` | boolean |  |
| `--raw` | object |  |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally stock-group create "Example"
```

### `tally stock-group delete <name>`

Delete a stock group (Tally refuses if it is in use).

Access: `destructive`. Tool name: `stock_group_delete`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string |  |
| `--yes` | boolean | Confirm a destructive action (delete, cancel, alter). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |

```bash
tally stock-group delete "Example" --yes
```

### `tally stock-group ensure <name>`

Create the stock group if it does not exist; if it exists, report differences without changing it.

Access: `write`. Tool name: `stock_group_ensure`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string |  |
| `--parent` | string |  |
| `--addable` | boolean |  |
| `--raw` | object |  |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally stock-group ensure "Example"
```

### `tally stock-group get <name>`

Get one stock group by exact name (suggests close matches when not found).

Access: `read`. Tool name: `stock_group_get`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string | Stock group name. |
| `--as-of` | date | Balances as of this date. |
| `--native` | boolean | Also return the object as Tally exports it (all fields). |

```bash
tally stock-group get "Main Location"
```

### `tally stock-group list`

List stock groups.

Access: `read`. Tool name: `stock_group_list`.

| Option | Type | Description |
|---|---|---|
| `--search` | string | Text to match against stock group names. |
| `--limit` | integer | Return at most this many rows. |
| `--under` | string | Only stock groups under this stock group (any depth). |

```bash
tally stock-group list
```

### `tally stock-group update <name>`

Change fields of an existing stock group (only the fields given are sent). Use --new-name to rename.

Access: `write`. Tool name: `stock_group_update`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string |  |
| `--parent` | string |  |
| `--addable` | boolean |  |
| `--raw` | object |  |
| `--new-name` | string | Rename to this. |
| `--yes` | boolean | Confirm changing an opening balance (also needs allowDestructive). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally stock-group update "Example" --new-name "Example 2"
```

## sync

### `tally sync reset`

Forget the sync cursor (the next "sync run" exports everything again).

Access: `local`. Tool name: `sync_reset`.

```bash
tally sync reset
```

### `tally sync run`

Send everything changed since the last run (everything on the first run) to a sink: folder, file, URL or stdout.

Access: `read`. Tool name: `sync_run`.

| Option | Type | Description |
|---|---|---|
| `--sink` (required) | string | Folder (ends with /), file (.ndjson/.json/.csv), http(s) URL, or "-" for stdout. |
| `--datasets` | array | Default: ledgers, groups, items, vouchers, entries, inventory, bills. |
| `--format` | ndjson \| json \| csv |  |
| `--secret` | string | HMAC secret for signing HTTP deliveries (X-Tally-Signature). |
| `--detect-deletions` | boolean |  |
| `--from` | date | Start date (YYYY-MM-DD). Default: start of the financial year. |
| `--to` | date | End date (YYYY-MM-DD). Default: today. |
| `--fy` | string | Financial year instead of from/to, e.g. 2026-27, current, previous. |

```bash
tally sync run --sink exports/
tally sync run --sink https://example.com/hooks/tally --secret $SECRET
```

### `tally sync status`

Where the incremental sync cursor stands versus Tally's current alter ids.

Access: `read`. Tool name: `sync_status`.

```bash
tally sync status
```

## token

### `tally token create <name>`

Create an access token for the local HTTP API (shown once; only its hash is stored).

Access: `local`. Tool name: `token_create`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string | Who uses it, e.g. "n8n". |
| `--scope` | read \| write \| destructive |  Default `"read"`. |

```bash
tally token create n8n --scope read
tally token create backoffice --scope write
```

### `tally token list`

List HTTP API tokens (without the secrets).

Access: `local`. Tool name: `token_list`.

### `tally token revoke <id>`

Revoke an HTTP API token by id or name.

Access: `local`. Tool name: `token_revoke`.

| Option | Type | Description |
|---|---|---|
| `--id` (required) | string |  |

## unit

### `tally unit create <name>`

Create a unit. Fails if it already exists (use ensure for create-if-missing).

Access: `write`. Tool name: `unit_create`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string | Unit symbol, e.g. "Nos". |
| `--formal-name` | string | e.g. "Numbers". |
| `--decimals` | integer |  |
| `--uqc` | string | GST unit quantity code, e.g. "NOS-NUMBERS". |
| `--raw` | object |  |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally unit create "Example"
```

### `tally unit delete <name>`

Delete a unit (Tally refuses if it is in use).

Access: `destructive`. Tool name: `unit_delete`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string |  |
| `--yes` | boolean | Confirm a destructive action (delete, cancel, alter). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |

```bash
tally unit delete "Example" --yes
```

### `tally unit ensure <name>`

Create the unit if it does not exist; if it exists, report differences without changing it.

Access: `write`. Tool name: `unit_ensure`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string | Unit symbol, e.g. "Nos". |
| `--formal-name` | string | e.g. "Numbers". |
| `--decimals` | integer |  |
| `--uqc` | string | GST unit quantity code, e.g. "NOS-NUMBERS". |
| `--raw` | object |  |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally unit ensure "Example"
```

### `tally unit get <name>`

Get one unit by exact name (suggests close matches when not found).

Access: `read`. Tool name: `unit_get`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string | Unit name. |
| `--as-of` | date | Balances as of this date. |
| `--native` | boolean | Also return the object as Tally exports it (all fields). |

```bash
tally unit get "Main Location"
```

### `tally unit list`

List units.

Access: `read`. Tool name: `unit_list`.

| Option | Type | Description |
|---|---|---|
| `--search` | string | Text to match against unit names. |
| `--limit` | integer | Return at most this many rows. |

```bash
tally unit list
```

### `tally unit update <name>`

Change fields of an existing unit (only the fields given are sent). Use --new-name to rename.

Access: `write`. Tool name: `unit_update`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string | Unit symbol, e.g. "Nos". |
| `--formal-name` | string | e.g. "Numbers". |
| `--decimals` | integer |  |
| `--uqc` | string | GST unit quantity code, e.g. "NOS-NUMBERS". |
| `--raw` | object |  |
| `--new-name` | string | Rename to this. |
| `--yes` | boolean | Confirm changing an opening balance (also needs allowDestructive). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally unit update "Example" --new-name "Example 2"
```

## voucher-type

### `tally voucher-type bases`

List voucher types with the base type each belongs to (Sales, Receipt, Journal, ...).

Access: `read`. Tool name: `voucher_type_bases`.

### `tally voucher-type get <name>`

Get one voucher type by exact name (suggests close matches when not found).

Access: `read`. Tool name: `voucher_type_get`.

| Option | Type | Description |
|---|---|---|
| `--name` (required) | string | Voucher type name. |
| `--as-of` | date | Balances as of this date. |
| `--native` | boolean | Also return the object as Tally exports it (all fields). |

```bash
tally voucher-type get "Main Location"
```

### `tally voucher-type list`

List voucher types.

Access: `read`. Tool name: `voucher_type_list`.

| Option | Type | Description |
|---|---|---|
| `--search` | string | Text to match against voucher type names. |
| `--limit` | integer | Return at most this many rows. |

```bash
tally voucher-type list
```

## voucher

### `tally voucher cancel`

Cancel a voucher (it stays in Tally marked cancelled, amounts removed). Preferred over delete.

Access: `destructive`. Tool name: `voucher_cancel`.

| Option | Type | Description |
|---|---|---|
| `--master-id` | integer | Master id of the voucher (from voucher list / get). |
| `--guid` | string |  |
| `--number` | string | Voucher number (with --type, optionally --date). |
| `--type` | string |  |
| `--date` | date |  |
| `--if-alter-id` | integer | Refuse if the voucher changed since you read it (its alterId). |
| `--reason` | string | Narration recorded on the cancelled voucher. |
| `--yes` | boolean | Confirm a destructive action (delete, cancel, alter). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |

```bash
tally voucher cancel --master-id 245 --reason "Duplicate entry" --yes
```

### `tally voucher commit <plan-id>`

Post a prepared plan (after a person or system approved it). Safe to repeat.

Access: `write`. Tool name: `voucher_commit`.

| Option | Type | Description |
|---|---|---|
| `--plan-id` (required) | string |  |
| `--force-resend` | boolean | Only after checking in Tally that an earlier commit of this plan really did not arrive. |

```bash
tally voucher commit --plan-id p1abc23
```

### `tally voucher create`

Create any voucher from JSON (all kinds and custom voucher types). Validates everything first; --dry-run shows the XML.

Voucher JSON (see docs/VOUCHERS.md). Accounting kinds use "entries": [{"ledger", "debit"|"credit", "bills", "bank", "costCentres"}]. Invoice kinds use "party", "items": [{"item", "qty", "rate", "ledger", "godown"}], optional "charges", "taxes" ("auto" | "none" | list), "roundOff", "bills", "expectedTotal". Stock journals use "consumed" and "produced".

Access: `write`. Tool name: `voucher_create`.

| Option | Type | Description |
|---|---|---|
| `--voucher` (required) | object | Voucher JSON (see docs/VOUCHERS.md). Accounting kinds use "entries": [{"ledger", "debit"\|"credit", "bills", "bank", "costCentres"}]. Invoice kinds use "party", "items": [{"item", "qty", "rate", "ledger", "godown"}], optional "charges", "taxes" ("auto" \| "none" \| list), "roundOff", "bills", "expectedTotal". Stock journals use "consumed" and "produced". |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |
| `--idempotency-key` | string | Unique key for this write. Repeating a key returns the earlier result instead of posting twice. |
| `--force-resend` | boolean | Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again. |

```bash
tally voucher create --input sales-invoice.json --dry-run
tally voucher create --input receipt.json --idempotency-key bank-txn-88213
```

### `tally voucher delete`

Delete a voucher permanently (the audit log keeps a copy for undo).

Access: `destructive`. Tool name: `voucher_delete`.

| Option | Type | Description |
|---|---|---|
| `--master-id` | integer | Master id of the voucher (from voucher list / get). |
| `--guid` | string |  |
| `--number` | string | Voucher number (with --type, optionally --date). |
| `--type` | string |  |
| `--date` | date |  |
| `--if-alter-id` | integer | Refuse if the voucher changed since you read it (its alterId). |
| `--yes` | boolean | Confirm a destructive action (delete, cancel, alter). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |

```bash
tally voucher delete --master-id 245 --yes
```

### `tally voucher find`

Search for vouchers by date (with tolerance), party, amount, reference or narration. Use before posting to avoid duplicates.

Access: `read`. Tool name: `voucher_find`.

| Option | Type | Description |
|---|---|---|
| `--date` | date |  |
| `--days` | integer | Search this many days either side of --date. Default `0`. |
| `--from` | date |  |
| `--to` | date |  |
| `--type` | string |  |
| `--party` | string |  |
| `--amount` | number |  |
| `--number` | string |  |
| `--reference` | string |  |
| `--narration` | string | Text contained in the narration. |
| `--status` | active \| regular \| optional \| cancelled \| all | active = regular + optional (not cancelled). Default `"all"`. |

```bash
tally voucher find --date 2026-11-02 --days 3 --party "Alpha Hardware Stores" --amount 11800
```

### `tally voucher get`

Get one voucher in full (entries, items, bills, bank details), in the same shape "voucher create" accepts.

Access: `read`. Tool name: `voucher_get`.

| Option | Type | Description |
|---|---|---|
| `--master-id` | integer | Tally master id (shown by voucher list). |
| `--guid` | string |  |
| `--number` | string | Voucher number (use with --type, optionally --date). |
| `--type` | string |  |
| `--date` | date |  |

```bash
tally voucher get --master-id 245
tally voucher get --type Sales --number SI/26-27/0012
```

### `tally voucher kinds`

List voucher kinds the tool understands, with their base type and shape.

Access: `local`. Tool name: `voucher_kinds`.

### `tally voucher list`

List vouchers in a period with totals; filter by type (or base type), party, ledger, number, status.

Access: `read`. Tool name: `voucher_list`.

| Option | Type | Description |
|---|---|---|
| `--from` | date | Start date (YYYY-MM-DD). Default: start of the financial year. |
| `--to` | date | End date (YYYY-MM-DD). Default: today. |
| `--fy` | string | Financial year instead of from/to, e.g. 2026-27, current, previous. |
| `--type` | string | Voucher type, or a base type such as Sales (includes custom types under it). |
| `--party` | string | Party ledger name. |
| `--ledger` | string | Any ledger appearing in the voucher. |
| `--number` | string |  |
| `--search` | string | Text in number, party, narration or reference. |
| `--status` | active \| regular \| optional \| cancelled \| all | active = regular + optional (not cancelled). Default `"active"`. |
| `--limit` | integer | Only the latest N. |

```bash
tally voucher list --type Sales --from 2026-10-01 --to 2026-10-31
tally voucher list --party "Alpha Hardware Stores" --fy current
```

### `tally voucher plans`

List prepared plans and whether they were committed.

Access: `local`. Tool name: `voucher_plans`.

### `tally voucher prepare`

Validate a voucher and store it as a plan for approval; "voucher commit" posts exactly that plan.

Access: `read`. Tool name: `voucher_prepare`.

| Option | Type | Description |
|---|---|---|
| `--voucher` (required) | object | Voucher JSON (see docs/VOUCHERS.md). Accounting kinds use "entries": [{"ledger", "debit"\|"credit", "bills", "bank", "costCentres"}]. Invoice kinds use "party", "items": [{"item", "qty", "rate", "ledger", "godown"}], optional "charges", "taxes" ("auto" \| "none" \| list), "roundOff", "bills", "expectedTotal". Stock journals use "consumed" and "produced". |

```bash
tally voucher prepare --input invoice.json
```

### `tally voucher regularise`

Turn an optional voucher into a regular one (puts it into the books). Needs writeMode "on" and --yes.

Access: `write`. Tool name: `voucher_regularise`.

| Option | Type | Description |
|---|---|---|
| `--master-id` | integer | Master id of the voucher (from voucher list / get). |
| `--guid` | string |  |
| `--number` | string | Voucher number (with --type, optionally --date). |
| `--type` | string |  |
| `--date` | date |  |
| `--if-alter-id` | integer | Refuse if the voucher changed since you read it (its alterId). |
| `--yes` | boolean |  |
| `--dry-run` | boolean |  |

```bash
tally voucher regularise --master-id 245 --yes
```

### `tally voucher template capture`

Learn site-specific voucher tags (GST class, registration, etc.) from a correct voucher made in Tally; later vouchers of that type include them.

Access: `write`. Tool name: `voucher_template_capture`.

| Option | Type | Description |
|---|---|---|
| `--master-id` (required) | integer |  |
| `--date` | date |  |
| `--include` | array | Only these tags. |

```bash
tally voucher template capture --master-id 245
```

### `tally voucher template delete <voucher-type>`

Remove a captured voucher template.

Access: `local`. Tool name: `voucher_template_delete`.

| Option | Type | Description |
|---|---|---|
| `--voucher-type` (required) | string |  |

### `tally voucher template list`

Show captured voucher templates for this profile and company.

Access: `local`. Tool name: `voucher_template_list`.

### `tally voucher undo`

Undo a write from the audit log: restore an altered voucher, re-create a deleted one, or delete a created one.

Access: `destructive`. Tool name: `voucher_undo`.

| Option | Type | Description |
|---|---|---|
| `--audit-seq` (required) | integer | Sequence number from the audit log (shown in every write result). |
| `--yes` | boolean | Confirm a destructive action (delete, cancel, alter). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |

```bash
tally voucher undo --audit-seq 17 --yes
```

### `tally voucher update`

Alter an existing voucher (narration, reference, date, or any fields via --input). Keeps a before-image for undo.

Access: `destructive`. Tool name: `voucher_update`.

| Option | Type | Description |
|---|---|---|
| `--master-id` | integer | Master id of the voucher (from voucher list / get). |
| `--guid` | string |  |
| `--number` | string | Voucher number (with --type, optionally --date). |
| `--type` | string |  |
| `--date` | date |  |
| `--if-alter-id` | integer | Refuse if the voucher changed since you read it (its alterId). |
| `--narration` | string |  |
| `--reference` | string |  |
| `--new-date` | date |  |
| `--changes` | object | Any voucher fields to replace (same shape as voucher create), e.g. {"items": [...]} or {"entries": [...]}. |
| `--yes` | boolean | Confirm a destructive action (delete, cancel, alter). |
| `--dry-run` | boolean | Validate and show what would be sent, without sending anything to Tally. |

```bash
tally voucher update --master-id 245 --narration "Corrected narration" --yes
tally voucher update --master-id 245 --input changes.json --dry-run
```

### `tally voucher validate`

Check a voucher JSON against Tally (names, totals, bills, GST) and show the computed result, without writing.

Access: `read`. Tool name: `voucher_validate`.

| Option | Type | Description |
|---|---|---|
| `--voucher` (required) | object | Voucher JSON (see docs/VOUCHERS.md). Accounting kinds use "entries": [{"ledger", "debit"\|"credit", "bills", "bank", "costCentres"}]. Invoice kinds use "party", "items": [{"item", "qty", "rate", "ledger", "godown"}], optional "charges", "taxes" ("auto" \| "none" \| list), "roundOff", "bills", "expectedTotal". Stock journals use "consumed" and "produced". |

```bash
tally voucher validate --input invoice.json
```

## watch

### `tally watch`

Poll Tally and emit change events (new/altered vouchers and masters, optional deletions) to stdout, a file or a webhook.

Access: `read`. Tool name: `watch`.

| Option | Type | Description |
|---|---|---|
| `--interval` | integer | Seconds between checks. Default `30`. |
| `--sink` | string | Default stdout (NDJSON). File path or http(s) URL. |
| `--secret` | string | HMAC secret for webhook signatures. |
| `--detect-deletions` | boolean | Also report deletions (reads all ids each time; slower). |
| `--from-now` | boolean | Ignore changes made before starting. |
| `--once` | boolean | Check once and exit. |

```bash
tally watch
tally watch --sink https://example.com/hooks/tally --secret $SECRET --interval 60
```

## xml

### `tally xml parse <file>`

Parse a Tally XML file into JSON (offline; no Tally needed).

Access: `local`. Tool name: `xml_parse`.

| Option | Type | Description |
|---|---|---|
| `--file` (required) | string |  |

```bash
tally xml parse reply.xml
```

