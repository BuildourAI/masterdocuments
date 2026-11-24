// Offline tests: no Tally, no Supabase. Run with: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  esc, decodeTallyResponse, parseXml, buildCollectionRequest, buildLedgerCreate, buildOptionalVoucher,
  validateVoucherPayload, parseImportResponse, parseQty, tallyDateToIso, writeTag
} from '../src/xml.js';
import { masterRows, voucherRows, extractWriteTag, companyRows } from '../src/normalize.js';

test('escapes XML special characters', () => {
  assert.equal(esc(`A & B <"x">'`), 'A &amp; B &lt;&quot;x&quot;&gt;&apos;');
});

test('decodes UTF-16LE replies and strips control characters', () => {
  const xml = '<ENVELOPE><A>ok&#4;</A></ENVELOPE>';
  const buf = Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from(xml, 'utf16le')]);
  assert.equal(decodeTallyResponse(buf), '<ENVELOPE><A>ok</A></ENVELOPE>');
});

test('collection request carries company, dates and AlterID filter', () => {
  const x = buildCollectionRequest({ id: 'GSVouchers', type: 'Voucher', fetch: ['GUID', 'ALTERID'], company: 'Grow & Safe', fromDate: '2026-04-01', toDate: '2026-04-30', filter: '$AlterID > 10' });
  assert.match(x, /<SVCURRENTCOMPANY>Grow &amp; Safe<\/SVCURRENTCOMPANY>/);
  assert.match(x, /<SVFROMDATE>20260401<\/SVFROMDATE>/);
  assert.match(x, /<FILTER>GSVouchersFilter<\/FILTER>/);
  assert.match(x, /\$AlterID &gt; 10/);
  parseXml(x); // well-formed
});

test('quantities and dates', () => {
  assert.deepEqual(parseQty('10.000 Ltr'), { qty: 10, unit: 'Ltr' });
  assert.deepEqual(parseQty('-1,250.5 Kg'), { qty: -1250.5, unit: 'Kg' });
  assert.equal(tallyDateToIso('20261125'), '2026-11-25');
});

const sampleSale = {
  voucherType: 'Sales', date: '2026-11-25', partyLedger: 'Sharma Traders', narration: 'Order from app',
  inventoryEntries: [{ item: 'Bio Gold 1L', qty: 10, unit: 'Ltr', rate: 100, amount: 1000, salesLedger: 'Sales GST 18%', godown: 'Main Location', batch: 'B-101' }],
  ledgerEntries: [
    { ledger: 'Sharma Traders', amount: -1180, isParty: true, billRef: { name: 'APP-0001', type: 'New Ref' } },
    { ledger: 'Output IGST 18%', amount: 180 }
  ]
};

test('optional sales voucher: balanced, tagged, ISOPTIONAL=Yes, well-formed', () => {
  assert.deepEqual(validateVoucherPayload(sampleSale), []);
  const x = buildOptionalVoucher('GrowSafe TEST COPY', '11111111-2222-3333-4444-555555555555', sampleSale);
  assert.match(x, /<ISOPTIONAL>Yes<\/ISOPTIONAL>/);
  assert.match(x, /<ISINVOICE>Yes<\/ISINVOICE>/);
  assert.match(x, /\[GSOS:11111111-2222-3333-4444-555555555555\]/);
  assert.match(x, /<LEDGERNAME>Sharma Traders<\/LEDGERNAME><ISDEEMEDPOSITIVE>Yes<\/ISDEEMEDPOSITIVE><ISPARTYLEDGER>Yes<\/ISPARTYLEDGER><AMOUNT>-1180.00<\/AMOUNT>/);
  assert.match(x, /<BATCHNAME>B-101<\/BATCHNAME>/);
  parseXml(x);
});

test('unbalanced or incomplete vouchers are refused before reaching Tally', () => {
  const bad = { ...sampleSale, ledgerEntries: [{ ledger: 'Sharma Traders', amount: -900, isParty: true }] };
  assert.ok(validateVoucherPayload(bad).some((e) => e.includes('do not balance')));
  assert.throws(() => buildOptionalVoucher('X', 'id', bad), /invalid voucher payload/);
  assert.ok(validateVoucherPayload({ voucherType: 'Receipt', date: '25-11-2026', ledgerEntries: [] }).length >= 2);
});

test('receipt voucher (accounting view) builds with debit bank, credit party', () => {
  const r = { voucherType: 'Receipt', date: '2026-11-25', ledgerEntries: [
    { ledger: 'HDFC Bank', amount: -5000 }, { ledger: 'Sharma Traders', amount: 5000, isParty: true, billRef: { name: 'INV-77', type: 'Agst Ref' } }
  ] };
  const x = buildOptionalVoucher('C', 'abcdef12-0000-0000-0000-000000000000', r);
  assert.match(x, /Accounting Voucher View/);
  assert.match(x, /<ISINVOICE>No<\/ISINVOICE>/);
  parseXml(x);
});

test('ledger create carries parent and GST details, well-formed', () => {
  const x = buildLedgerCreate('C', { name: 'New Dealer & Co', parent: 'Sundry Debtors', gstin: '23ABCDE1234F1Z5', state: 'Madhya Pradesh', address: ['Main Road', 'Bhopal'] });
  assert.match(x, /<LEDGER NAME="New Dealer &amp; Co" ACTION="Create">/);
  assert.match(x, /<PARENT>Sundry Debtors<\/PARENT>/);
  assert.match(x, /<GSTIN>23ABCDE1234F1Z5<\/GSTIN>/);
  parseXml(x);
});

test('import replies: success and error', () => {
  const ok = parseImportResponse('<RESPONSE><CREATED>1</CREATED><ALTERED>0</ALTERED><ERRORS>0</ERRORS><EXCEPTIONS>0</EXCEPTIONS><LASTVCHID>4321</LASTVCHID></RESPONSE>');
  assert.equal(ok.ok, true);
  assert.equal(ok.lastVoucherId, 4321);
  const bad = parseImportResponse('<ENVELOPE><BODY><DATA><LINEERROR>Ledger \'Sharma Trader\' does not exist!</LINEERROR><CREATED>0</CREATED><ERRORS>1</ERRORS></DATA></BODY></ENVELOPE>');
  assert.equal(bad.ok, false);
  assert.match(bad.lineErrors[0], /does not exist/);
});

test('masters, companies and vouchers normalise from export XML', () => {
  const ledgers = parseXml(`<ENVELOPE><BODY><DATA><COLLECTION>
    <LEDGER NAME="Sharma Traders"><GUID>g-1</GUID><MASTERID>11</MASTERID><ALTERID>90</ALTERID><PARENT>Sundry Debtors</PARENT>
      <OPENINGBALANCE>-500.00</OPENINGBALANCE><CLOSINGBALANCE>-1680.00</CLOSINGBALANCE><PARTYGSTIN>23ABCDE1234F1Z5</PARTYGSTIN><ISBILLWISEON>Yes</ISBILLWISEON></LEDGER>
  </COLLECTION></DATA></BODY></ENVELOPE>`);
  const rows = masterRows(ledgers, 'Ledger', 'c-1');
  assert.equal(rows[0].name, 'Sharma Traders');
  assert.equal(rows[0].closing_balance, -1680);
  assert.equal(rows[0].is_bill_wise, true);

  const comps = companyRows(parseXml('<ENVELOPE><COMPANY NAME="GrowSafe"><GUID>c-1</GUID><BOOKSFROM>20210401</BOOKSFROM></COMPANY></ENVELOPE>'));
  assert.deepEqual(comps[0], { guid: 'c-1', name: 'GrowSafe', books_from: '2021-04-01', starting_from: null });

  const tag = writeTag('11111111-2222-3333-4444-555555555555');
  const vt = parseXml(`<ENVELOPE><VOUCHER><GUID>v-1</GUID><ALTERID>91</ALTERID><DATE>20261125</DATE><VOUCHERTYPENAME>Sales</VOUCHERTYPENAME>
    <PARTYLEDGERNAME>Sharma Traders</PARTYLEDGERNAME><NARRATION>Order ${tag}</NARRATION><ISOPTIONAL>Yes</ISOPTIONAL>
    <ALLLEDGERENTRIES.LIST><LEDGERNAME>Sharma Traders</LEDGERNAME><AMOUNT>-1180.00</AMOUNT><ISPARTYLEDGER>Yes</ISPARTYLEDGER></ALLLEDGERENTRIES.LIST>
    <ALLLEDGERENTRIES.LIST><LEDGERNAME>Output IGST 18%</LEDGERNAME><AMOUNT>180.00</AMOUNT></ALLLEDGERENTRIES.LIST>
    <ALLINVENTORYENTRIES.LIST><STOCKITEMNAME>Bio Gold 1L</STOCKITEMNAME><BILLEDQTY>10 Ltr</BILLEDQTY><AMOUNT>1000.00</AMOUNT>
      <BATCHALLOCATIONS.LIST><GODOWNNAME>Main Location</GODOWNNAME><BATCHNAME>B-101</BATCHNAME><BILLEDQTY>10 Ltr</BILLEDQTY></BATCHALLOCATIONS.LIST>
    </ALLINVENTORYENTRIES.LIST></VOUCHER></ENVELOPE>`);
  const v = voucherRows(vt, 'c-1')[0];
  assert.equal(v.date, '2026-11-25');
  assert.equal(v.is_optional, true);
  assert.equal(v.app_tag, '11111111-2222-3333-4444-555555555555');
  assert.equal(v.ledger_entries.length, 2);
  assert.equal(v.inventory_entries[0].batches[0].batch, 'B-101');
  assert.equal(extractWriteTag('no tag here'), null);
});
