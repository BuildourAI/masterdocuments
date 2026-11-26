# Setup on a client PC

Typical time: 20 to 40 minutes on a screen share. The AI agent version of these steps is in
[../CLAUDE.md](../CLAUDE.md).

## 1. Copy the folder

Copy the whole `tally-cli` folder to the PC, for example to `C:\tally-cli`. Avoid `Program Files`
(not writable) and folders synced by OneDrive/Google Drive (the state files change often).

## 2. Node.js

Check with `node -v` (needs 20 or newer). If missing, install the LTS version from nodejs.org with the
default options and open a new terminal.

No admin rights? Download the Windows "zip" build of Node.js, and copy `node.exe` into
`C:\tally-cli\runtime\node.exe`. `tally.cmd` uses it automatically.

## 3. Enable Tally's gateway

**TallyPrime**: press F1 (Help) > Settings > Connectivity > Client/Server configuration.
Set *TallyPrime acts as* to **Server** (or **Both**), *Port* to **9000**, accept, and restart TallyPrime.
(Older TallyPrime releases: F12 Configure > Connectivity; the option names are the same.)

**Tally.ERP 9**: F12 Configure > Advanced Configuration: *Tally.ERP 9 is acting as* **Both** (or Server),
*Port* **9000**. Restart Tally.

Open the company. Tally must stay open (with the company loaded) whenever the tool is used.

## 4. Check the connection

```bash
cd C:\tally-cli
.\tally.cmd doctor
```

(In PowerShell the `.\` prefix is required; in Command Prompt `tally.cmd doctor` also works.)
Every line should say `pass`. The `hint` on each failing line says what to do. If Tally runs on a
different PC on the network, use `--url http://<that-pc-ip>:9000` (and see the network note below).

## 5. Create the profile

```bash
.\tally.cmd init --company "Exact Company Name"
```

Writes stay **off**. Review what was detected:

- `gst.companyState`: the company's GST state (needed for automatic CGST/SGST vs IGST)
- `gst.ledgers.output` / `gst.ledgers.input`: tax ledgers used when taxes are computed automatically
- `roundOffLedger`, `defaultBankLedger`

Edit `tally.config.json` if something is missing or wrong. A full example with every setting is in
[../tally.config.example.json](../tally.config.example.json).

Several companies or several Tally PCs? Create one profile each (`--profile name`) and pass
`--profile name` to commands (or set `TALLY_PROFILE`).

## 6. Self-test

```bash
.\tally.cmd selftest
```

Keep the output; it is the quickest way to diagnose a site later. With a test company and a profile
that allows writes, `selftest --write --confirm-company "<test company>"` also checks how this Tally
handles writes and cleans up after itself.

## 7. Decide on writes

| writeMode | Effect |
|---|---|
| `off` | Read only (default) |
| `optional` | Vouchers are created as **optional vouchers**: visible in Tally, but outside the books until someone regularises them (open the voucher, Ctrl+L). The safest way to let an AI enter data. |
| `on` | Vouchers go straight into the books |

Change it with `.\tally.cmd init --company "..." --write-mode optional --force`, or edit the file.
See [SAFETY.md](SAFETY.md) for the other limits (lock date, amount cap, allowed voucher types,
alter/cancel/delete switch).

## 8. Keep services running (only if used)

The HTTP API (`serve`), relay (`relay`), watcher (`watch`) and scheduled syncs (`sync run`) are
normal commands. To start one automatically when the user logs in, create a Windows scheduled task:

```bash
schtasks /Create /TN "tally-cli serve" /SC ONLOGON /RL LIMITED /TR "\"C:\tally-cli\tally.cmd\" serve"
```

For a periodic sync (every 15 minutes):

```bash
schtasks /Create /TN "tally-cli sync" /SC MINUTE /MO 15 /TR "\"C:\tally-cli\tally.cmd\" sync run --sink C:\tally-exports\\"
```

Remove a task with `schtasks /Delete /TN "tally-cli serve" /F`.

## Network note

Tally's port has no password: anyone who can reach it can read and change the books. `doctor` warns
when it is reachable from other machines. Prefer keeping Tally's port closed to the network
(Windows Firewall) and giving remote systems access through `tally serve` (tokens) or `tally relay`
(outbound only).

## Rehearsing without a client

TallyPrime runs without a licence in Educational mode (dates limited to the 1st, 2nd and last day of
a month), which is enough to rehearse a whole installation. Or use the built-in simulator:
`tally simulate --port 9000` and `tally init --url http://127.0.0.1:9000 --profile demo`.
