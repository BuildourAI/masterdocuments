// Turns tally-cli's rows into the columns of the tally_* tables. Pure functions, tested offline.
// Sign convention everywhere: debit negative, credit positive (as Tally stores amounts).

export const MASTER_TABLES = {
  groups: 'tally_groups',
  ledgers: 'tally_ledgers',
  'cost-centres': 'tally_cost_centres',
  'stock-groups': 'tally_stock_groups',
  items: 'tally_stock_items',
  units: 'tally_units',
  godowns: 'tally_godowns',
  'voucher-types': 'tally_voucher_types',
};
// Parents before children, so a ledger's group is always there first.
export const MASTER_ORDER = ['groups', 'ledgers', 'cost-centres', 'stock-groups', 'units', 'godowns', 'items', 'voucher-types'];

export function signed(bal) {
  if (bal === null || bal === undefined) return 0;
  if (typeof bal === 'number') return bal;
  const a = Number(bal.amount) || 0;
  return bal.side === 'Dr' ? -a : a;
}

const base = (r) => ({ guid: r.guid, master_id: r.masterId ?? null, alter_id: r.alterId ?? null, name: r.name });

export function masterRow(dataset, r) {
  switch (dataset) {
    case 'groups': return { ...base(r), parent: r.parent ?? null, primary_group: r.primaryGroup ?? null, nature: r.nature ?? null, is_revenue: r.affectsGrossProfit ?? null };
    case 'ledgers': return {
      ...base(r), parent: r.group ?? null, primary_group: r.primaryGroup ?? null,
      opening_balance: signed(r.openingBalance), closing_balance: signed(r.closingBalance),
      gstin: r.gstin ?? null, gst_registration_type: r.gstRegistrationType ?? null, pan: r.pan ?? null,
      state: r.state ?? null, pincode: r.pincode ?? null, email: r.contact?.email ?? null, mobile: r.contact?.phone ?? null,
      is_bill_wise: r.billWise ?? null, credit_days: r.creditDays ?? null,
    };
    case 'cost-centres': return { ...base(r), parent: r.parent ?? null, category: r.category ?? null };
    case 'stock-groups': return { ...base(r), parent: r.parent ?? null };
    case 'items': return {
      ...base(r), parent: r.group ?? null, category: r.category ?? null, base_unit: r.unit ?? null,
      hsn: r.hsn ?? null, gst_rate: r.gstRate ?? null,
      opening_qty: r.opening?.qty ?? 0, closing_qty: r.closing?.qty ?? 0, closing_value: r.closing?.value ?? 0,
    };
    case 'units': return { ...base(r), parent: null };
    case 'godowns': return { ...base(r), parent: r.parent ?? null };
    case 'voucher-types': return { ...base(r), parent: r.baseType ?? null };
    default: throw new Error(`unknown master dataset ${dataset}`);
  }
}

// The app writes its queue id into the narration as [GSOS:<id>]; the next sync finds it there.
export function writeTag(id) { return `[GSOS:${id}]`; }
export function extractWriteTag(narration) {
  const m = /\[GSOS:([0-9a-zA-Z-]+)\]/.exec(narration || '');
  return m ? m[1] : null;
}

const qtyOf = (q) => (q && typeof q === 'object' ? Number(q.qty) || 0 : Number(q) || 0);

/**
 * Join tally-cli's voucher datasets (one period) into rows for bridge_upsert_vouchers.
 * @param {object} d {vouchers, entries, bills, costs, inventory, batches} as returned by tally-cli
 */
export function assembleVouchers(d) {
  const byGuid = new Map();
  for (const v of d.vouchers || []) {
    byGuid.set(v.guid, {
      guid: v.guid, master_id: v.masterId ?? null, alter_id: v.alterId ?? null, date: v.date,
      voucher_type: v.voucherType, base_type: v.baseType || null, voucher_number: v.number || null, party_ledger: v.party || null,
      narration: v.narration || null, reference: v.reference || null,
      is_optional: !!v.isOptional, is_cancelled: !!v.isCancelled, is_invoice: !!v.isInvoice,
      app_tag: extractWriteTag(v.narration),
      ledger_entries: [], inventory_entries: [],
    });
  }
  for (const e of d.entries || []) {
    const v = byGuid.get(e.guid);
    if (!v) continue;
    v.ledger_entries.push({ line_no: v.ledger_entries.length + 1, ledger: e.ledger, amount: Number(e.amount) || 0, is_party: !!e.isParty, bill_refs: [], cost_centres: [] });
  }
  const entryFor = (guid, ledger) => byGuid.get(guid)?.ledger_entries.find((x) => x.ledger === ledger);
  for (const b of d.bills || []) {
    const e = entryFor(b.guid, b.ledger);
    if (e) e.bill_refs.push({ name: b.bill, type: b.billType, amount: Number(b.amount) || 0, credit_days: b.creditDays ?? null });
  }
  for (const c of d.costs || []) {
    const e = entryFor(c.guid, c.ledger);
    if (e) e.cost_centres.push({ category: c.category, cost_centre: c.costCentre, amount: Number(c.amount) || 0 });
  }
  for (const i of d.inventory || []) {
    const v = byGuid.get(i.guid);
    if (!v) continue;
    v.inventory_entries.push({
      line_no: v.inventory_entries.length + 1, item: i.item, qty: qtyOf(i.qty), unit: i.qtyUnit ?? (typeof i.qty === 'object' ? i.qty?.unit : null) ?? null,
      rate: typeof i.rate === 'object' ? Number(i.rate?.rate) || 0 : Number(i.rate) || 0,
      amount: Number(i.amount) || 0, is_inward: !!i.inward, godown: null, batches: [],
    });
  }
  for (const b of d.batches || []) {
    const v = byGuid.get(b.Guid);
    const line = v?.inventory_entries.find((x) => x.item === b.StockItemName && x.batches.length === 0) || v?.inventory_entries.find((x) => x.item === b.StockItemName);
    if (!line) continue;
    line.batches.push({ godown: b.GodownName || null, batch: b.BatchName || null, qty: qtyOf(b.ActualQty), amount: Number(b.Amount) || 0 });
    if (!line.godown) line.godown = b.GodownName || null;
  }
  return [...byGuid.values()];
}

/** Calendar months covering [from, to], as [first, last] ISO dates. */
export function monthsBetween(fromIso, toIso) {
  const out = [];
  const d = new Date(`${fromIso.slice(0, 7)}-01T00:00:00Z`);
  const end = new Date(`${toIso}T00:00:00Z`);
  while (d <= end) {
    const start = d.toISOString().slice(0, 10);
    const next = new Date(d); next.setUTCMonth(next.getUTCMonth() + 1);
    const last = new Date(next); last.setUTCDate(0);
    out.push([start, last.toISOString().slice(0, 10)]);
    d.setUTCMonth(d.getUTCMonth() + 1);
  }
  return out;
}

/** Financial years (1 April to 31 March) covering [from, to]: the first load goes one year at a time. */
export function financialYears(fromIso, toIso) {
  const out = [];
  let y = Number(fromIso.slice(0, 4)) - (Number(fromIso.slice(5, 7)) < 4 ? 1 : 0);
  while (`${y}-04-01` <= toIso) {
    const s = `${y}-04-01` < fromIso ? fromIso : `${y}-04-01`;
    const e = `${y + 1}-03-31` > toIso ? toIso : `${y + 1}-03-31`;
    out.push([s, e]);
    y += 1;
  }
  return out;
}
