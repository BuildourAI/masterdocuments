# Troubleshooting

Start with `tally doctor`. For a Tally error message: `tally explain "<message>"`. To see what is sent,
add `--verbose`; to keep request and reply files for a bug report, add `--record artifacts/rec`.

| Symptom | Cause and fix |
|---|---|
| `E_CONNECT ... ECONNREFUSED` | Tally is closed, or its gateway is off, or on another port. Enable it (docs/SETUP.md step 3) and restart Tally. Check `--url`. |
| `E_CONNECT` to another PC | Windows Firewall on the Tally PC blocks the port, or the IP changed. Prefer running the tool on the Tally PC. |
| `No company is open` | Open the company in Tally (F3 / Alt+F3). Tally must stay open. |
| `Company "X" is not open` | The profile's company differs from what is loaded. Open it, or fix `company` (`tally company list` shows exact names). |
| `not the one this profile was set up for (different id)` | A different data folder or restored copy with the same name is open. Check in Tally; re-run `tally init --force` if intended. |
| Several companies open, data went to the wrong one | Set `company` in the profile (`tally init --company ...`); every request then names it. |
| `E_TIMEOUT` on big reports | Use a shorter period (`--from/--to`), raise `--timeout`, or lower `chunk.maxDays` in the profile. Tally may still be busy: wait before retrying. |
| `E_TRUNCATED` | The reply stopped half way (Tally busy or crashed). Retry with a smaller period. |
| Garbled names (boxes, `?`) | Encoding. Keep the default `utf16`; on Windows consoles prefer `--json` output into a file (`--out`). |
| `Voucher totals do not match` | Debits and credits differ. Run `tally voucher validate`; check item amounts, taxes and round off. |
| `Ledger 'X' does not exist` | Names must match exactly. `tally ledger search X`. Create it if it is really new. |
| `keeps bill-wise details: add "bills"` | The party tracks bills. Add `--against <bill>`, `--auto-allocate` or `--on-account` (or `bills` in JSON). `tally party bills <party>` lists pending bills. |
| Dates refused in Educational mode | Only the 1st, 2nd and last day of a month are allowed without a licence. |
| `writes are switched off` | Expected until writes are enabled: `tally init --write-mode optional --force` (with the owner's approval). |
| `E_INDETERMINATE` (exit 8) | The reply was lost. Check with `tally voucher find --date ... --party ...`; re-sending with the same `idempotencyKey` is safe. |
| MCP tools missing in Claude | Check the config path from `tally integrate`, restart the client, and look at the client's MCP log. Write tools appear only if `frontends.mcp` is `write`. |
| HTTP API answers 401 / 403 / 421 | 401: token missing or wrong. 403: token scope or `frontends.http` too low, or a browser `Origin` header. 421: unexpected Host header (add it to `http.allowHosts`). |
| `Another process has been talking to Tally for too long` | A crashed process left `.tally/tally.lock`. Delete it if nothing else is running. |
| Reports differ slightly from Tally's screens | Stock valuation and some P&L groupings can differ; the curated reports are computed from ledgers and items. Compare with `tally report run "<Tally report name>"`. |

Still stuck: send the integrator the output of `tally doctor --json`, `tally selftest --json`,
`tally capabilities --json`, and the files from `--record`.
