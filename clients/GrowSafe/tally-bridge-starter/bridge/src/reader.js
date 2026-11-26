// Tally -> Supabase, through tally-cli. Incremental by Tally's alter ids: only new or changed masters
// and vouchers. The first load runs one financial year at a time (tally-cli splits each year by month).
// Deleted vouchers are found by comparing voucher ids month by month.
import { MASTER_ORDER, MASTER_TABLES, masterRow, assembleVouchers, monthsBetween, financialYears } from './map.js';
import { chunks } from './store.js';
import { log } from './config.js';

const today = () => new Date().toISOString().slice(0, 10);

/** Find the configured company in Tally and save it. Returns {guid, name, booksFrom}. */
export async function resolveCompany(cli, store, c) {
  const list = await cli.companies(c.profile);
  const found = list.find((x) => x.name.toLowerCase() === c.name.toLowerCase());
  if (!found) throw new Error(`Company "${c.name}" is not open in TallyPrime. Open companies: ${list.map((x) => x.name).join(', ') || 'none'}`);
  await store.rpc('bridge_save_company', { p_guid: found.guid, p_name: found.name, p_books_from: found.booksFrom || null, p_is_test: !!c.isTestCompany });
  return { guid: found.guid, name: found.name, booksFrom: c.booksFrom || found.booksFrom };
}

/** All voucher datasets for one window (a period, or everything altered after an alter id). */
export async function readVoucherWindow(cli, profile, win) {
  const [vouchers, entries, bills, costs, inventory, batches] = [
    await cli.exportRows(profile, 'vouchers', win),
    await cli.exportRows(profile, 'entries', win),
    await cli.exportRows(profile, 'bills', win),
    await cli.exportRows(profile, 'cost-allocations', win),
    await cli.exportRows(profile, 'inventory', win),
    await cli.batches(profile, win),
  ];
  return assembleVouchers({ vouchers, entries, bills, costs, inventory, batches });
}

async function saveVouchers(store, companyGuid, rows) {
  for (const part of chunks(rows, 200)) await store.rpc('bridge_upsert_vouchers', { p_company_guid: companyGuid, p_rows: part });
  return rows.length;
}

export async function syncCompany(cli, store, c) {
  const run = { kind: 'sync', started_at: new Date().toISOString(), details: {} };
  const company = await resolveCompany(cli, store, c);
  run.company_guid = company.guid;
  try {
    const state = await store.rpc('bridge_get_state', { p_company_guid: company.guid }) || {};
    // Read Tally's counters BEFORE reading data: anything changed during the read is picked up next time.
    const now = await cli.counters(c.profile);

    // 1. Masters, parents before children.
    const lastMst = Number(state.masters || 0);
    for (const ds of MASTER_ORDER) {
      const rows = (await cli.exportRows(c.profile, ds, lastMst ? { sinceAlterId: lastMst } : {})).map((r) => masterRow(ds, r));
      for (const part of chunks(rows, 500)) await store.rpc('bridge_upsert_masters', { p_table: MASTER_TABLES[ds], p_company_guid: company.guid, p_rows: part });
      run.details[ds] = rows.length;
    }
    if (now.altMstId && now.altMstId > lastMst) await store.rpc('bridge_set_state', { p_company_guid: company.guid, p_kind: 'masters', p_last: now.altMstId });

    // 2. Vouchers.
    const lastVch = Number(state.vouchers || 0);
    let count = 0;
    if (!lastVch) {
      for (const [from, to] of financialYears(company.booksFrom || '2020-04-01', today())) {
        const rows = await readVoucherWindow(cli, c.profile, { from, to });
        count += await saveVouchers(store, company.guid, rows);
        log('info', `first load ${company.name} ${from}..${to}: ${rows.length} vouchers`);
      }
    } else if (now.altVchId > lastVch) {
      count = await saveVouchers(store, company.guid, await readVoucherWindow(cli, c.profile, { sinceAlterId: lastVch }));
    }
    if (now.altVchId && now.altVchId > lastVch) await store.rpc('bridge_set_state', { p_company_guid: company.guid, p_kind: 'vouchers', p_last: now.altVchId });
    run.details.vouchers = count;

    // 3. Unpaid bills (for payment reminders), refreshed whenever a voucher changed, and on the first run.
    if (!state.outstanding || now.altVchId !== Number(state.outstanding)) {
      run.details.outstanding = await refreshOutstanding(cli, store, c, company.guid);
      if (now.altVchId) await store.rpc('bridge_set_state', { p_company_guid: company.guid, p_kind: 'outstanding', p_last: now.altVchId });
    }

    // 4. Close the loop on anything the app wrote into Tally.
    run.details.confirmed = await store.rpc('bridge_confirm_writebacks', { p_company_guid: company.guid });
    run.status = 'ok';
  } catch (err) {
    run.status = 'error';
    run.error = String(err.message || err);
    throw err;
  } finally {
    run.finished_at = new Date().toISOString();
    await store.rpc('bridge_log', { p_table: 'bridge_sync_runs', p_row: run }).catch(() => {});
  }
  return run;
}

/** Receivables and payables, bill by bill, as Tally reports them today. */
export async function refreshOutstanding(cli, store, c, companyGuid) {
  const asOf = today();
  const out = {};
  for (const [dataset, kind] of [['receivables', 'receivable'], ['payables', 'payable']]) {
    const rows = await cli.exportRows(c.profile, dataset, { to: asOf });
    out[dataset] = await store.rpc('bridge_replace_outstanding', { p_company_guid: companyGuid, p_kind: kind, p_as_of: asOf, p_rows: rows });
  }
  return out;
}

// Vouchers deleted in Tally never show up in an alter-id sync. Compare ids month by month.
export async function detectDeletions(cli, store, c) {
  const company = await resolveCompany(cli, store, c);
  let marked = 0;
  const countsByMonth = {};
  for (const [from, to] of monthsBetween(company.booksFrom || '2020-04-01', today())) {
    const inTally = new Set((await cli.exportRows(c.profile, 'vouchers', { from, to })).map((v) => v.guid));
    const inApp = await store.rpc('bridge_voucher_guids', { p_company_guid: company.guid, p_from: from, p_to: to }) || [];
    const missing = inApp.filter((g) => !inTally.has(g));
    if (missing.length) marked += await store.rpc('bridge_mark_deleted', { p_company_guid: company.guid, p_guids: missing });
    if (inTally.size || inApp.length) countsByMonth[from.slice(0, 7)] = { tally: inTally.size, app: inApp.length - missing.length };
  }
  const mismatches = Object.values(countsByMonth).filter((x) => x.tally !== x.app).length;
  await store.rpc('bridge_log', { p_table: 'bridge_reconciliations', p_row: { company_guid: company.guid, kind: 'voucher_counts', mismatches, details: { countsByMonth, markedDeleted: marked } } });
  return { marked, mismatches };
}
