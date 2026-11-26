---
name: tally-setup
description: Install, configure, verify and wire up tally-cli (the Tally / TallyPrime bridge in this folder) on a business PC, or diagnose it when a command fails. Use when asked to set up Tally integration, connect Tally to an AI system, post vouchers into Tally, or fix a tally-cli error.
---

# Setting up tally-cli

Follow `CLAUDE.md` in this folder step by step: prerequisites, `tally doctor`, `tally init`, smoke
reads, `tally selftest`, writes only with the person's explicit approval (test company first,
optional mode before full writes), then wiring (`tally integrate`) and the hand-over checklist.

Rules that always apply:

- Reads are safe. Before any write, show `--dry-run` output and get a yes from the person.
- Never invent prices, amounts, GSTINs or names; look them up (`ledger search`, `item search`,
  `party bills`) or ask.
- Pass complex input with `--input file.json`; parse `--json` output (`ok`, `data`, `error.code`,
  `error.hint`).
- On errors: read `error.hint`, try `tally explain "<message>"`, re-run with `--verbose`, and see
  `docs/TROUBLESHOOTING.md` before changing any code.
- Keep `tally.config.json`, `.tally/` and `artifacts/` private to the site.

Key references: `docs/SETUP.md` (human steps), `docs/VOUCHERS.md` (voucher JSON),
`docs/INTEGRATION.md` (MCP, HTTP, relay, sync, import), `docs/SAFETY.md`, `docs/COMMANDS.md`.
