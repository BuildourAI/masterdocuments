/**
 * Deterministic demo company for the simulator. All names are fictional.
 * Financial year 2026-27, vouchers from April to November 2026.
 */
import { Store, SYS } from './store.mjs';
import { gstinCheckChar } from '../domain/gst.mjs';
import { addDays } from '../core/dates.mjs';

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const gstin = (state, pan) => {
  const first = `${state}${pan}1Z`;
  return first + gstinCheckChar(first);
};

const r2 = (n) => Math.round(n * 100) / 100;
const pad = (n, w = 4) => String(n).padStart(w, '0');

export const DEMO_COMPANY = 'Sample Traders Pvt Ltd';

export function buildDemo({ seed = 42, name = DEMO_COMPANY, educational = false } = {}) {
  const s = Store.empty({ name, booksFrom: '2026-04-01', state: 'Maharashtra' });
  const rand = rng(seed);
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];
  s.company.gstin = gstin('27', 'AAECS1234K');
  s.company.educational = educational;

  // Groups and ledgers
  s.addMaster('groups', { name: 'Sundry Debtors - Retail', parent: 'Sundry Debtors' });
  const L = (name, parent, extra = {}) => s.addMaster('ledgers', { name, parent, openingbalance: 0, ...extra });
  L('Sales GST 18%', 'Sales Accounts');
  L('Sales GST 12%', 'Sales Accounts');
  L('Purchase GST 18%', 'Purchase Accounts');
  L('Purchase GST 12%', 'Purchase Accounts');
  L('Output CGST', 'Duties & Taxes', { taxtype: 'GST', gstdutyhead: 'Central Tax' });
  L('Output SGST', 'Duties & Taxes', { taxtype: 'GST', gstdutyhead: 'State Tax' });
  L('Output IGST', 'Duties & Taxes', { taxtype: 'GST', gstdutyhead: 'Integrated Tax' });
  L('Input CGST', 'Duties & Taxes', { taxtype: 'GST', gstdutyhead: 'Central Tax' });
  L('Input SGST', 'Duties & Taxes', { taxtype: 'GST', gstdutyhead: 'State Tax' });
  L('Input IGST', 'Duties & Taxes', { taxtype: 'GST', gstdutyhead: 'Integrated Tax' });
  L('Round Off', 'Indirect Expenses');
  L('Freight Outward', 'Indirect Expenses');
  L('Salaries', 'Indirect Expenses');
  L('Office Rent', 'Indirect Expenses', { iscostcentreson: true });
  L('Electricity Charges', 'Indirect Expenses');
  L('Bank Charges', 'Indirect Expenses');
  L('Discount Received', 'Indirect Incomes');
  L('Capital - Owner', 'Capital Account', { openingbalance: 1500000 });
  L('Bank of Example - Current A/c', 'Bank Accounts', { openingbalance: -1250000, bankdetails: '000123456789', ifscode: 'EXMP0000123' });
  L('Second Bank - OD A/c', 'Bank OD A/c', { openingbalance: 0 });
  s.getMaster('ledgers', 'Cash').openingbalance = -50000;

  const debtors = [
    ['Alpha Hardware Stores', '27', 'AAFCA1111A', 'Mumbai', 30, 'Sundry Debtors'],
    ['Bharat Electric Works', '27', 'AABFB2222B', 'Pune', 45, 'Sundry Debtors'],
    ['City Lights Traders', '24', 'AAHCC3333C', 'Ahmedabad', 30, 'Sundry Debtors'],
    ['Deccan Builders', '36', 'AAJCD4444D', 'Hyderabad', 60, 'Sundry Debtors'],
    ['Eastern Supplies', '19', 'AAKFE5555E', 'Kolkata', 30, 'Sundry Debtors'],
    ['Fine Fittings Retail', '27', 'AALPF6666F', 'Nashik', 15, 'Sundry Debtors - Retail'],
  ];
  const states = { 27: 'Maharashtra', 24: 'Gujarat', 36: 'Telangana', 19: 'West Bengal', 29: 'Karnataka', '07': 'Delhi' };
  for (const [nm, st, pan, city, days, grp] of debtors) {
    L(nm, grp, {
      isbillwiseon: true,
      billcreditperiod: days,
      mailingname: nm,
      address: [`Shop 12, Market Road`, city],
      ledstatename: states[st],
      countryname: 'India',
      pincode: '400001',
      partygstin: gstin(st, pan),
      gstregistrationtype: 'Regular',
      email: `accounts@${nm.split(' ')[0].toLowerCase()}.example`,
      ledgermobile: `98${pad(Math.floor(rand() * 1e8), 8)}`,
      ledgercontact: 'Accounts Team',
    });
  }
  const creditors = [
    ['Prime Cables Ltd', '27', 'AAMCP7777G', 'Thane', 30],
    ['Metro Switchgear', '29', 'AANCM8888H', 'Bengaluru', 45],
    ['Western Wires', '24', 'AAOCW9999J', 'Vadodara', 30],
    ['National Lamps Co', '07', 'AAPCN1212K', 'Delhi', 30],
  ];
  for (const [nm, st, pan, city, days] of creditors) {
    L(nm, 'Sundry Creditors', { isbillwiseon: true, billcreditperiod: days, mailingname: nm, address: ['Industrial Estate', city], ledstatename: states[st], countryname: 'India', partygstin: gstin(st, pan), gstregistrationtype: 'Regular', email: `sales@${nm.split(' ')[0].toLowerCase()}.example` });
  }
  // Opening bills for two debtors
  const alpha = s.getMaster('ledgers', 'Alpha Hardware Stores');
  alpha.billallocations = [{ name: 'OB/25-26/118', billdate: '2026-03-10', openingbalance: -84000, billcreditperiod: 30 }];
  alpha.openingbalance = -84000;
  const bharat = s.getMaster('ledgers', 'Bharat Electric Works');
  bharat.billallocations = [{ name: 'OB/25-26/131', billdate: '2026-03-22', openingbalance: -46500, billcreditperiod: 45 }];
  bharat.openingbalance = -46500;
  s.getMaster('ledgers', 'Capital - Owner').openingbalance = 1500000 - 84000 - 46500 + 0;
  // Keep the opening trial balance in balance: capital = assets
  const openAssets = 1250000 + 50000 + 84000 + 46500;
  s.getMaster('ledgers', 'Capital - Owner').openingbalance = openAssets;

  // Inventory masters
  s.addMaster('units', { name: 'Nos', symbol: 'Nos', formalname: 'Numbers', issimpleunit: true, decimalplaces: 0 });
  s.addMaster('units', { name: 'Mtr', symbol: 'Mtr', formalname: 'Metres', issimpleunit: true, decimalplaces: 2 });
  s.addMaster('units', { name: 'Box', symbol: 'Box', formalname: 'Boxes', issimpleunit: true, decimalplaces: 0 });
  s.addMaster('stockgroups', { name: 'Cables & Wires', parent: SYS('Primary') });
  s.addMaster('stockgroups', { name: 'Switchgear', parent: SYS('Primary') });
  s.addMaster('stockgroups', { name: 'Lighting', parent: SYS('Primary') });
  s.addMaster('godowns', { name: 'Pune Warehouse', parent: SYS('Primary') });
  s.addMaster('costcentres', { name: 'Mumbai Branch', parent: SYS('Primary'), category: 'Primary Cost Category' });
  s.addMaster('costcentres', { name: 'Pune Branch', parent: SYS('Primary'), category: 'Primary Cost Category' });
  const items = [
    ['Copper Wire 1.5 sqmm (90 m)', 'Cables & Wires', 'Box', '85444999', 18, 1450, 1180],
    ['Copper Wire 2.5 sqmm (90 m)', 'Cables & Wires', 'Box', '85444999', 18, 2350, 1920],
    ['Armoured Cable 4 core', 'Cables & Wires', 'Mtr', '85446090', 18, 310, 248],
    ['MCB 32A Double Pole', 'Switchgear', 'Nos', '85362090', 18, 520, 410],
    ['RCCB 40A 4 Pole', 'Switchgear', 'Nos', '85362090', 18, 2650, 2120],
    ['Distribution Board 8 Way', 'Switchgear', 'Nos', '85371000', 18, 1850, 1460],
    ['LED Panel 18W', 'Lighting', 'Nos', '94054290', 12, 640, 470],
    ['LED Bulb 9W', 'Lighting', 'Nos', '85395000', 12, 95, 62],
  ];
  const itemInfo = {};
  for (const [nm, grp, unit, hsn, rate, sell, cost] of items) {
    const openQty = Math.floor(rand() * 150) + 300;
    s.addMaster('stockitems', { name: nm, parent: grp, baseunits: unit, hsncode: hsn, igstrate: rate, taxability: 'Taxable', gstapplicable: 'Applicable', openingqty: openQty, openingvalue: r2(openQty * cost), openingrate: cost });
    itemInfo[nm] = { unit, rate, sell, cost, hsn };
  }
  const stockOpen = Object.values(s.data.stockitems).reduce((t, i) => t + (i.openingvalue || 0), 0);
  s.getMaster('ledgers', 'Capital - Owner').openingbalance = r2(openAssets + stockOpen);

  // Voucher types: a custom sales series
  s.addMaster('vouchertypes', { name: 'Sales - Retail', parent: 'Sales', numberingmethod: 'Automatic' });

  // ---------- vouchers ----------
  const counters = {};
  const nextNo = (prefix) => {
    counters[prefix] = (counters[prefix] || 0) + 1;
    return `${prefix}/26-27/${pad(counters[prefix])}`;
  };
  const push = (v) => {
    v.masterid = s.nextMasterId();
    v.alterid = ++s.company.altvchid;
    v.guid = s.guidFor(v.masterid);
    v.isoptional = !!v.isoptional;
    v.iscancelled = !!v.iscancelled;
    v.ledgerentries = v.ledgerentries || [];
    v.inventoryentries = v.inventoryentries || [];
    s.data.vouchers.push(v);
    return v;
  };
  const le = (ledgername, amount, extra = {}) => ({ ledgername, amount: r2(amount), isdeemedpositive: amount < 0, ispartyledger: false, billallocations: [], bankallocations: [], costcentreallocations: [], ...extra });
  const invLine = (item, qty, rate, ledger, inward, godown = 'Main Location') => {
    const unit = itemInfo[item].unit;
    const amount = r2(qty * rate);
    const signed = inward ? -amount : amount;
    return {
      stockitemname: item,
      isdeemedpositive: inward,
      rate: `${rate.toFixed(2)}/${unit}`,
      actualqty: `${qty} ${unit}`,
      billedqty: `${qty} ${unit}`,
      qty,
      unit,
      amount: signed,
      discount: 0,
      batchallocations: [{ godownname: godown, batchname: 'Primary Batch', amount: signed, actualqty: `${qty} ${unit}`, qty, orderno: '', destinationgodownname: '' }],
      accountingallocations: [le(ledger, signed)],
    };
  };
  const BANK = 'Bank of Example - Current A/c';
  const sales = [];
  const purchases = [];

  const months = [
    ['2026-04', 30],
    ['2026-05', 31],
    ['2026-06', 30],
    ['2026-07', 31],
    ['2026-08', 31],
    ['2026-09', 30],
    ['2026-10', 31],
    ['2026-11', 20],
  ];
  for (const [ym, days] of months) {
    const day = (d) => `${ym}-${String(Math.min(d, days)).padStart(2, '0')}`;
    // Purchases: two per month
    for (let k = 0; k < 2; k++) {
      const [supplier, st] = pick(creditors);
      const inter = st !== '27';
      const lines = [];
      const n = 1 + Math.floor(rand() * 3);
      for (let j = 0; j < n; j++) {
        const item = pick(Object.keys(itemInfo));
        const info = itemInfo[item];
        lines.push({ item, qty: 20 + Math.floor(rand() * 50), rate: info.cost, gst: info.rate });
      }
      const date = day(3 + k * 12);
      const inv = [];
      let taxable = 0;
      let tax = 0;
      for (const l of lines) {
        const ledger = l.gst === 12 ? 'Purchase GST 12%' : 'Purchase GST 18%';
        inv.push(invLine(l.item, l.qty, l.rate, ledger, true));
        taxable += l.qty * l.rate;
        tax += (l.qty * l.rate * l.gst) / 100;
      }
      tax = r2(tax);
      const total = r2(taxable + tax);
      const rounded = Math.round(total);
      const ro = r2(rounded - total);
      const billNo = `${supplier.split(' ')[0].toUpperCase().slice(0, 3)}-${pad(Math.floor(rand() * 9000) + 1000)}`;
      const ledgers = [le(supplier, rounded, { ispartyledger: true, billallocations: [{ name: billNo, billtype: 'New Ref', amount: rounded, billcreditperiod: 30 }] })];
      if (inter) ledgers.push(le('Input IGST', -tax));
      else {
        const half = r2(tax / 2);
        ledgers.push(le('Input CGST', -half), le('Input SGST', -r2(tax - half)));
      }
      if (ro) ledgers.push(le('Round Off', -ro));
      purchases.push(
        push({ date, vouchertypename: 'Purchase', vouchernumber: nextNo('PUR'), reference: billNo, referencedate: date, partyledgername: supplier, isinvoice: true, persistedview: 'Invoice Voucher View', narration: `Purchase bill ${billNo}`, ledgerentries: ledgers, inventoryentries: inv, _party: supplier, _bill: billNo, _total: rounded }),
      );
    }
    // Sales: four per month
    for (let k = 0; k < 6; k++) {
      const [party, st, , , days2, grp] = pick(debtors);
      const inter = st !== '27';
      const date = day(2 + k * 5);
      const inv = [];
      let taxable = 0;
      let tax = 0;
      const n = 1 + Math.floor(rand() * 3);
      for (let j = 0; j < n; j++) {
        const item = pick(Object.keys(itemInfo));
        const info = itemInfo[item];
        const qty = 4 + Math.floor(rand() * 26);
        const ledger = info.rate === 12 ? 'Sales GST 12%' : 'Sales GST 18%';
        inv.push(invLine(item, qty, info.sell, ledger, false));
        taxable += qty * info.sell;
        tax += (qty * info.sell * info.rate) / 100;
      }
      tax = r2(tax);
      const freight = rand() < 0.3 ? 500 : 0;
      const total = r2(taxable + tax + freight);
      const rounded = Math.round(total);
      const ro = r2(rounded - total);
      const vtype = grp === 'Sundry Debtors - Retail' ? 'Sales - Retail' : 'Sales';
      const num = nextNo(vtype === 'Sales' ? 'SI' : 'SR');
      const ledgers = [le(party, -rounded, { ispartyledger: true, billallocations: [{ name: num, billtype: 'New Ref', amount: -rounded, billcreditperiod: days2 }] })];
      if (freight) ledgers.push(le('Freight Outward', freight));
      if (inter) ledgers.push(le('Output IGST', tax));
      else {
        const half = r2(tax / 2);
        ledgers.push(le('Output CGST', half), le('Output SGST', r2(tax - half)));
      }
      if (ro) ledgers.push(le('Round Off', ro));
      const st2 = states[st];
      sales.push(
        push({ date, vouchertypename: vtype, vouchernumber: num, partyledgername: party, placeofsupply: st2, isinvoice: true, persistedview: 'Invoice Voucher View', narration: '', ledgerentries: ledgers, inventoryentries: inv, _party: party, _bill: num, _total: rounded }),
      );
    }
    // Receipts against older sales (pay most bills after ~a month)
    for (const sv of sales) {
      if (sv._paid || sv.date > addDays(`${ym}-01`, -20)) continue;
      if (rand() < 0.25) continue; // some stay outstanding
      const date = day(10 + Math.floor(rand() * 15));
      const partial = rand() < 0.2;
      const amt = partial ? Math.round(sv._total * 0.5) : sv._total;
      const mode = pick(['e-Fund Transfer', 'Cheque', 'UPI']);
      push({
        date,
        vouchertypename: 'Receipt',
        vouchernumber: nextNo('RV'),
        partyledgername: sv._party,
        narration: `Received against ${sv._bill}`,
        ledgerentries: [
          le(BANK, -amt, { bankallocations: [{ transactiontype: mode, instrumentnumber: mode === 'Cheque' ? String(100000 + Math.floor(rand() * 899999)) : `UTR${pad(Math.floor(rand() * 1e9), 9)}`, instrumentdate: date, bankname: '', amount: -amt, bankersdate: rand() < 0.8 ? addDays(date, 1) : '' }] }),
          le(sv._party, amt, { ispartyledger: true, billallocations: [{ name: sv._bill, billtype: 'Agst Ref', amount: amt, billcreditperiod: 0 }] }),
        ],
      });
      sv._paid = true;
    }
    // Payments to suppliers
    for (const pv of purchases) {
      if (pv._paid || pv.date > addDays(`${ym}-01`, -25) || rand() < 0.2) continue;
      const date = day(20);
      push({
        date,
        vouchertypename: 'Payment',
        vouchernumber: nextNo('PV'),
        partyledgername: pv._party,
        narration: `Paid against ${pv._bill}`,
        ledgerentries: [
          le(pv._party, -pv._total, { ispartyledger: true, billallocations: [{ name: pv._bill, billtype: 'Agst Ref', amount: -pv._total, billcreditperiod: 0 }] }),
          le(BANK, pv._total, { bankallocations: [{ transactiontype: 'e-Fund Transfer', instrumentnumber: `UTR${pad(Math.floor(rand() * 1e9), 9)}`, instrumentdate: date, bankname: '', amount: pv._total, bankersdate: addDays(date, 1) }] }),
        ],
      });
      pv._paid = true;
    }
    // Expenses
    push({ date: day(1), vouchertypename: 'Payment', vouchernumber: nextNo('PV'), narration: 'Office rent', ledgerentries: [le('Office Rent', -24000, { costcentreallocations: [{ category: 'Primary Cost Category', name: 'Mumbai Branch', amount: -16000 }, { category: 'Primary Cost Category', name: 'Pune Branch', amount: -8000 }] }), le(BANK, 24000)] });
    push({ date: day(days), vouchertypename: 'Journal', vouchernumber: nextNo('JV'), narration: 'Salary provision', ledgerentries: [le('Salaries', -38000), le('Second Bank - OD A/c', 38000)] });
    push({ date: day(15), vouchertypename: 'Contra', vouchernumber: nextNo('CV'), narration: 'Cash withdrawn', ledgerentries: [le('Cash', -20000), le(BANK, 20000)] });
    push({ date: day(days), vouchertypename: 'Payment', vouchernumber: nextNo('PV'), narration: 'Electricity bill', ledgerentries: [le('Electricity Charges', -r2(8000 + rand() * 4000)), le('Cash', 0)] });
    const last = s.data.vouchers[s.data.vouchers.length - 1];
    last.ledgerentries[1].amount = -last.ledgerentries[0].amount;
    last.ledgerentries[1].isdeemedpositive = false;
  }

  // A credit note (sales return) and a sales order, a stock transfer and an optional voucher
  const ret = sales[3];
  const retItem = ret.inventoryentries[0];
  const retQty = 1;
  const retRate = Math.abs(retItem.amount) / retItem.qty;
  const retTax = r2((retRate * itemInfo[retItem.stockitemname].rate) / 100);
  const retTotal = r2(retRate + retTax);
  push({
    date: '2026-06-18',
    vouchertypename: 'Credit Note',
    vouchernumber: nextNo('CN'),
    partyledgername: ret._party,
    isinvoice: true,
    persistedview: 'Invoice Voucher View',
    narration: `Return against ${ret._bill}`,
    ledgerentries: [le(ret._party, retTotal, { ispartyledger: true, billallocations: [{ name: ret._bill, billtype: 'Agst Ref', amount: retTotal, billcreditperiod: 0 }] }), ...(ret.ledgerentries.some((e) => e.ledgername === 'Output IGST') ? [le('Output IGST', -retTax)] : [le('Output CGST', -r2(retTax / 2)), le('Output SGST', -r2(retTax - r2(retTax / 2)))])],
    inventoryentries: [invLine(retItem.stockitemname, retQty, retRate, retItem.accountingallocations[0].ledgername, true)],
  });
  push({
    date: '2026-11-18',
    vouchertypename: 'Sales Order',
    vouchernumber: nextNo('SO'),
    partyledgername: 'Deccan Builders',
    isinvoice: true,
    persistedview: 'Invoice Voucher View',
    ledgerentries: [le('Deccan Builders', -r2(50 * 2650 * 1.18), { ispartyledger: true }), le('Output IGST', r2(50 * 2650 * 0.18))],
    inventoryentries: [
      (() => {
        const l = invLine('RCCB 40A 4 Pole', 50, 2650, 'Sales GST 18%', false);
        l.batchallocations[0].orderno = 'SO/26-27/0001';
        l.batchallocations[0].orderduedate = '2026-12-05';
        return l;
      })(),
    ],
  });
  push({
    date: '2026-09-05',
    vouchertypename: 'Stock Journal',
    vouchernumber: nextNo('SJ'),
    narration: 'Transfer to Pune Warehouse',
    inventoryentriesout: [invLine('LED Panel 18W', 20, 470, 'Purchase GST 12%', false, 'Main Location')].map(stripAcc),
    inventoryentriesin: [invLine('LED Panel 18W', 20, 470, 'Purchase GST 12%', true, 'Pune Warehouse')].map(stripAcc),
  });
  push({ date: '2026-11-20', vouchertypename: 'Journal', vouchernumber: nextNo('JV'), narration: 'Year-end bonus provision (awaiting approval)', isoptional: true, ledgerentries: [le('Salaries', -60000), le('Second Bank - OD A/c', 60000)] });

  for (const v of s.data.vouchers) {
    delete v._party;
    delete v._bill;
    delete v._total;
    delete v._paid;
  }
  return s;
}

function stripAcc(l) {
  return { ...l, accountingallocations: [] };
}
