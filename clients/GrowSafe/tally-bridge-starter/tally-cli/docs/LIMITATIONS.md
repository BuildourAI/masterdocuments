# Limitations

- **Tested against a simulator, then on site.** The tool follows Tally's documented XML formats and
  patterns used in production integrations, and ships with a simulator for tests. Behaviour that
  Tally does not document is probed by `tally selftest` on each installation (see `tally capabilities`).
  Run it, and the write self-test on a test company, before relying on writes.
- **Tally must be running** with the company open, and it answers one request at a time. Large
  exports take time; they are split by month automatically.
- **Things only Tally's own screens can do** are not available through its gateway: opening or
  closing companies, generating e-invoices and e-way bills, uploading or filing GST returns, printing,
  backup and restore, user and security settings, year-end split. The tool reads and writes the data
  around them.
- **GST reports are for reconciliation**, computed from vouchers (sales/purchase registers, HSN
  summary); file returns from Tally or the GST portal.
- **P&L and balance sheet** are computed from ledger balances and item stock values; stock valuation
  methods and special groupings can make them differ slightly from Tally's screens.
- **Balance sheets for books spanning several years** take earlier years' profit from the Profit &
  Loss A/c ledger; if Tally keeps it elsewhere the report shows a difference warning. Compare with
  Tally's own balance sheet.
- **Items split across several godowns or batches** are read with their first godown/batch; updating
  such a voucher through the tool would merge them. Change those in Tally.
- **Updates rebuild the voucher** from the fields the tool understands. Some details (certain GST,
  e-invoice, job-work, payroll fields) are not carried over. Capture a template from a correct voucher
  for static tags; make corrections to such vouchers in Tally.
- **Payroll, job work, POS, TDS/TCS, budgets, price lists, multi-currency** have no dedicated commands;
  use `master`, `query` and `raw` for them.
- **Educational mode** (no licence) restricts voucher dates to the 1st, 2nd and last day of a month.
- **After a timeout** the tool retries reads with a smaller date window straight away; it does not
  first wait for Tally to finish the abandoned request. If Tally is slow, raise `--timeout` or lower
  `chunk.maxDays` / set `chunk.pauseMs` in the profile.
- **Ledger statements** read all entries of the period and filter locally, so very long periods on very
  large books are slow; use shorter periods.
- **Built-in report shapes** (`report run`) are returned as Tally sends them; only Trial Balance is
  covered by Tally's published samples.
