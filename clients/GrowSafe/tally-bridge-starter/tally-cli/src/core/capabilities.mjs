/**
 * Assumptions about Tally behaviour that are not confirmed by Tally's own documentation.
 * Each has a safe default; "tally selftest" probes them on the real Tally and stores the results,
 * and the engine reads them to adapt per site.
 */
export const ASSUMPTIONS = [
  { id: 'export.flatReport', default: true, describe: 'Inline TDL reports (REPORT/FORM/PART/LINE/FIELD) export rows. Everything curated depends on this.', probe: 'read' },
  { id: 'export.rowWrapper', default: true, describe: 'A LINE-level XMLTAG wraps each row in <ROW>. If not, rows are split at the first field tag.', probe: 'read' },
  { id: 'export.voucherObject', default: false, describe: 'Export of one voucher as an Object by master id works.', probe: 'read' },
  { id: 'import.remoteIdUpsert', default: false, describe: 'Re-importing a voucher with the same REMOTEID alters it instead of creating a duplicate.', probe: 'write' },
  { id: 'import.tagMasterId', default: 'MASTER ID', describe: 'TAGNAME used to address a voucher by master id for alter/cancel/delete ("MASTER ID" or "MasterId").', probe: 'write' },
  { id: 'import.alterKeepsLists', default: false, describe: 'An alter that omits ledger/inventory lists keeps them. Assumed false: alters always send the full voucher.', probe: 'write' },
  { id: 'import.optionalStaysOut', default: true, describe: 'Vouchers imported with ISOPTIONAL=Yes do not affect balances until regularised.', probe: 'write' },
  { id: 'import.companyHonoured', default: true, describe: 'SVCURRENTCOMPANY in an import targets that company even if another is active.', probe: 'write' },
  { id: 'entries.includeInventoryAllocations', default: true, describe: 'AllLedgerEntries of an invoice includes the sales/purchase ledger amounts from inventory allocations.', probe: 'write' },
  { id: 'encoding.utf8', default: false, describe: 'Tally accepts UTF-8 requests (UTF-16 is used by default because it is proven).', probe: 'read' },
];

export function defaults() {
  return Object.fromEntries(ASSUMPTIONS.map((a) => [a.id, a.default]));
}

/** Effective capabilities for a scope: defaults overlaid with selftest results. */
export function loadCapabilities(state, scope) {
  const saved = state.read('capabilities.json', {});
  const entry = saved[scope] || {};
  return { ...defaults(), ...(entry.values || {}) };
}

export function saveCapabilities(state, scope, values, report) {
  state.update('capabilities.json', (all) => {
    all[scope] = { values, at: new Date().toISOString(), report };
    return all;
  });
}
