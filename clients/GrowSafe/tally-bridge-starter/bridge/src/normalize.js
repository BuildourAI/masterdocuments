// Turns parsed Tally collection XML into plain rows for Supabase. Pure, unit-tested.
import { text, yesNo, toNumber, parseQty, tallyDateToIso, findAll, WRITE_TAG_PREFIX } from './xml.js';

// What we ask Tally for, per master type. Field names are TallyPrime's; verify on the test copy.
export const MASTER_SPECS = {
  Group:       { table: 'tally_groups',       fetch: ['GUID', 'MASTERID', 'ALTERID', 'NAME', 'PARENT', 'ISREVENUE'] },
  Ledger:      { table: 'tally_ledgers',      fetch: ['GUID', 'MASTERID', 'ALTERID', 'NAME', 'PARENT', 'OPENINGBALANCE', 'CLOSINGBALANCE', 'PARTYGSTIN', 'GSTREGISTRATIONTYPE', 'LEDSTATENAME', 'PINCODE', 'EMAIL', 'LEDGERMOBILE', 'ISBILLWISEON'] },
  CostCentre:  { table: 'tally_cost_centres', fetch: ['GUID', 'MASTERID', 'ALTERID', 'NAME', 'PARENT', 'CATEGORY'] },
  StockGroup:  { table: 'tally_stock_groups', fetch: ['GUID', 'MASTERID', 'ALTERID', 'NAME', 'PARENT'] },
  StockItem:   { table: 'tally_stock_items',  fetch: ['GUID', 'MASTERID', 'ALTERID', 'NAME', 'PARENT', 'BASEUNITS', 'OPENINGBALANCE', 'CLOSINGBALANCE', 'CLOSINGVALUE'] },
  Unit:        { table: 'tally_units',        fetch: ['GUID', 'MASTERID', 'ALTERID', 'NAME'] },
  Godown:      { table: 'tally_godowns',      fetch: ['GUID', 'MASTERID', 'ALTERID', 'NAME', 'PARENT'] },
  VoucherType: { table: 'tally_voucher_types', fetch: ['GUID', 'MASTERID', 'ALTERID', 'NAME', 'PARENT'] }
};

export const VOUCHER_FETCH = [
  'GUID', 'MASTERID', 'ALTERID', 'DATE', 'VOUCHERTYPENAME', 'VOUCHERNUMBER', 'PARTYLEDGERNAME',
  'NARRATION', 'REFERENCE', 'ISOPTIONAL', 'ISCANCELLED', 'ISINVOICE',
  'ALLLEDGERENTRIES', 'ALLINVENTORYENTRIES'
];

function nameOf(item) {
  return (text(item.NAME) || item['@NAME'] || '').trim();
}

export function masterRows(tree, masterType, companyGuid) {
  const tag = masterType.toUpperCase();
  return findAll(tree, tag).map((m) => {
    const base = {
      company_guid: companyGuid,
      guid: text(m.GUID),
      master_id: toNumber(m.MASTERID),
      alter_id: toNumber(m.ALTERID),
      name: nameOf(m),
      parent: text(m.PARENT) || null
    };
    switch (masterType) {
      case 'Group': return { ...base, is_revenue: yesNo(m.ISREVENUE) };
      case 'Ledger': return {
        ...base,
        opening_balance: toNumber(m.OPENINGBALANCE),
        closing_balance: toNumber(m.CLOSINGBALANCE),
        gstin: text(m.PARTYGSTIN) || null,
        gst_registration_type: text(m.GSTREGISTRATIONTYPE) || null,
        state: text(m.LEDSTATENAME) || null,
        pincode: text(m.PINCODE) || null,
        email: text(m.EMAIL) || null,
        mobile: text(m.LEDGERMOBILE) || null,
        is_bill_wise: yesNo(m.ISBILLWISEON)
      };
      case 'CostCentre': return { ...base, category: text(m.CATEGORY) || null };
      case 'StockItem': {
        const ob = parseQty(m.OPENINGBALANCE);
        const cb = parseQty(m.CLOSINGBALANCE);
        return { ...base, base_unit: text(m.BASEUNITS) || null, opening_qty: ob.qty, closing_qty: cb.qty, closing_value: toNumber(m.CLOSINGVALUE) };
      }
      default: return base;
    }
  }).filter((r) => r.guid && r.name);
}

export function extractWriteTag(narration) {
  const m = String(narration || '').match(new RegExp(`\\[${WRITE_TAG_PREFIX}([0-9a-fA-F-]{8,})\\]`));
  return m ? m[1] : null;
}

function list(node, ...tags) {
  for (const t of tags) {
    const v = node?.[t];
    if (v) return Array.isArray(v) ? v : [v];
  }
  return [];
}

export function voucherRows(tree, companyGuid) {
  const vouchers = [];
  for (const v of findAll(tree, 'VOUCHER')) {
    const guid = text(v.GUID);
    if (!guid) continue;
    const narration = text(v.NARRATION) || null;
    const ledgerEntries = list(v, 'ALLLEDGERENTRIES.LIST', 'LEDGERENTRIES.LIST').map((e, i) => ({
      line_no: i + 1,
      ledger: text(e.LEDGERNAME),
      amount: toNumber(e.AMOUNT),
      is_party: yesNo(e.ISPARTYLEDGER),
      bill_refs: list(e, 'BILLALLOCATIONS.LIST').map((b) => ({ name: text(b.NAME), type: text(b.BILLTYPE), amount: toNumber(b.AMOUNT) }))
    })).filter((e) => e.ledger);
    const inventoryEntries = list(v, 'ALLINVENTORYENTRIES.LIST', 'INVENTORYENTRIES.LIST').map((e, i) => {
      const q = parseQty(e.BILLEDQTY || e.ACTUALQTY);
      return {
        line_no: i + 1,
        item: text(e.STOCKITEMNAME),
        qty: q.qty,
        unit: q.unit,
        rate: toNumber(e.RATE),
        amount: toNumber(e.AMOUNT),
        is_inward: yesNo(e.ISDEEMEDPOSITIVE),
        batches: list(e, 'BATCHALLOCATIONS.LIST').map((b) => {
          const bq = parseQty(b.BILLEDQTY || b.ACTUALQTY);
          return { godown: text(b.GODOWNNAME), batch: text(b.BATCHNAME), qty: bq.qty, amount: toNumber(b.AMOUNT) };
        })
      };
    }).filter((e) => e.item);
    vouchers.push({
      company_guid: companyGuid,
      guid,
      master_id: toNumber(v.MASTERID),
      alter_id: toNumber(v.ALTERID),
      date: tallyDateToIso(v.DATE),
      voucher_type: text(v.VOUCHERTYPENAME),
      voucher_number: text(v.VOUCHERNUMBER) || null,
      party_ledger: text(v.PARTYLEDGERNAME) || null,
      narration,
      reference: text(v.REFERENCE) || null,
      is_optional: yesNo(v.ISOPTIONAL),
      is_cancelled: yesNo(v.ISCANCELLED),
      is_invoice: yesNo(v.ISINVOICE),
      app_tag: extractWriteTag(narration),
      ledger_entries: ledgerEntries,
      inventory_entries: inventoryEntries
    });
  }
  return vouchers;
}

export function companyRows(tree) {
  return findAll(tree, 'COMPANY').map((c) => ({
    guid: text(c.GUID),
    name: nameOf(c),
    books_from: tallyDateToIso(c.BOOKSFROM),
    starting_from: tallyDateToIso(c.STARTINGFROM)
  })).filter((c) => c.guid && c.name);
}
