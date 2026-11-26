import { test } from 'node:test';
import assert from 'node:assert/strict';
import { exportData, importData, exportObject, exportFunction, commonVars } from '../src/core/envelope.mjs';
import { flatReport, fieldFormula, rowsFromReply, tdlString } from '../src/core/tdl.mjs';
import { parseXml, serialize, findFirst, childText, childrenNamed, child, textOf } from '../src/core/xml.mjs';
import { parseImportReply, checkExportReply } from '../src/core/client.mjs';
import { buildVoucher, buildVoucherAction } from '../src/domain/vouchers/build.mjs';
import { masterXml, masterBody } from '../src/domain/masters.mjs';
import { parseFormula, evalFormula } from '../src/sim/formula.mjs';

test('envelopes follow the documented header layout', () => {
  const x = parseXml(exportData({ id: 'Trial Balance', vars: commonVars({ company: 'Co', from: '2026-04-01', to: '2026-04-30' }) }));
  assert.equal(childText(child(x, 'HEADER'), 'TALLYREQUEST'), 'Export');
  assert.equal(childText(child(x, 'HEADER'), 'TYPE'), 'Data');
  const sv = findFirst(x, 'STATICVARIABLES');
  assert.equal(childText(sv, 'SVFROMDATE'), '1-Apr-2026');
  assert.equal(child(sv, 'SVFROMDATE').attrs.TYPE, 'Date');
  assert.equal(childText(sv, 'SVEXPORTFORMAT'), '$$SysName:XML');
  const o = parseXml(exportObject({ subtype: 'Ledger', id: 'Cash', fetch: ['Name', 'ClosingBalance'] }));
  assert.equal(findFirst(o, 'ID').attrs.TYPE, 'Name');
  assert.equal(childrenNamed(findFirst(o, 'FETCHLIST'), 'FETCH').length, 2);
  const f = parseXml(exportFunction({ id: 'SystemPeriodFrom' }));
  assert.equal(childText(child(f, 'HEADER'), 'ID'), '$$SystemPeriodFrom');
  const i = parseXml(importData({ id: 'Vouchers', messages: [] }));
  assert.equal(childText(child(i, 'HEADER'), 'ID'), 'Vouchers');
  assert.ok(findFirst(i, 'TALLYMESSAGE'));
});

test('field formulas use the proven patterns', () => {
  assert.equal(fieldFormula('Amount', 'amount'), '$$StringFindAndReplace:(if $$IsDebit:$Amount then -$$NumValue:$Amount else $$NumValue:$Amount):"(-)":"-"');
  assert.equal(fieldFormula('Date', 'date'), 'if $$IsEmpty:$Date then "" else $$PyrlYYYYMMDDFormat:$Date:"-"');
  assert.equal(fieldFormula('IsOptional', 'logical'), 'if $IsOptional then 1 else 0');
  assert.throws(() => tdlString('a"b'), (e) => e.code === 'E_INPUT');
  for (const t of ['amount', 'date', 'logical', 'number', 'parent', 'text']) parseFormula(fieldFormula('X', t));
});

test('flat report: nested routes produce one part per level', () => {
  const r = flatReport({ collection: { type: 'Voucher', route: ['AllLedgerEntries', 'BillAllocations'], filters: ['NOT $IsCancelled'] }, fields: [{ key: 'a', method: 'Guid' }] });
  const xml = serialize({ name: 'X', attrs: {}, children: r.tdl });
  assert.match(xml, /<REPEAT>TCLine1 : TCColl<\/REPEAT>/);
  assert.match(xml, /<REPEAT>TCLine2 : AllLedgerEntries<\/REPEAT>/);
  assert.match(xml, /<REPEAT>TCLine3 : BillAllocations<\/REPEAT>/);
  assert.match(xml, /<FETCH>AllLedgerEntries<\/FETCH>/);
  assert.match(xml, /<SYSTEM TYPE="Formulae" NAME="TCFilter1">NOT \$IsCancelled<\/SYSTEM>/);
});

test('rows are read with or without <ROW> wrappers', () => {
  const fields = [
    { key: 'name', method: 'Name' },
    { key: 'amt', method: 'Amount', type: 'amount' },
  ];
  const a = rowsFromReply(parseXml('<ENVELOPE><DATA><ROW><F01>A</F01><F02>-5.00</F02></ROW><ROW><F01>&#4; B</F01><F02>3</F02></ROW></DATA></ENVELOPE>'), fields);
  assert.deepEqual(a, [{ name: 'A', amt: -5 }, { name: 'B', amt: 3 }]);
  const b = rowsFromReply(parseXml('<ENVELOPE><F01>A</F01><F02>-5.00</F02><FBLANK/><F01>B</F01><F02>3</F02></ENVELOPE>'), fields);
  assert.deepEqual(b, a);
});

test('import replies: all documented shapes', () => {
  const erp9 = parseImportReply('<RESPONSE><CREATED>2</CREATED><ALTERED>0</ALTERED><LASTVCHID>0</LASTVCHID><LASTMID>0</LASTMID><COMBINED>0</COMBINED><IGNORED>0</IGNORED><ERRORS>0</ERRORS></RESPONSE>');
  assert.equal(erp9.created, 2);
  assert.ok(erp9.ok);
  const v = parseImportReply('<ENVELOPE><HEADER><VERSION>1</VERSION><STATUS>1</STATUS></HEADER><BODY><DATA><IMPORTRESULT><CREATED>1</CREATED><LASTVCHID>119</LASTVCHID><ERRORS>0</ERRORS></IMPORTRESULT></DATA></BODY></ENVELOPE>');
  assert.equal(v.lastVchId, 119);
  const err = parseImportReply('<ENVELOPE><HEADER><VERSION>1</VERSION><STATUS>0</STATUS></HEADER><BODY><DATA><LINEERROR>Voucher totals do not match! Dr: 20,394.00 Dr Cr: 20,395.00 Cr Diff: 1.00 Cr</LINEERROR><CREATED>0</CREATED><ERRORS>1</ERRORS></DATA></BODY></ENVELOPE>');
  assert.equal(err.ok, false);
  assert.match(err.lineErrors[0], /totals do not match/);
  assert.throws(() => parseImportReply('<RESPONSE>Unknown Request, cannot be processed</RESPONSE>'), (e) => e.code === 'E_TALLY');
});

test('export errors become typed errors with remedies', () => {
  assert.throws(
    () => checkExportReply(parseXml('<ENVELOPE><HEADER><VERSION>1</VERSION><STATUS>0</STATUS></HEADER><BODY><DATA><STATUS.LIST><STATUS><CODE>123</CODE><DESC>Invalid Request</DESC></STATUS></STATUS.LIST></DATA></BODY></ENVELOPE>')),
    (e) => e.code === 'E_TALLY' && /Invalid Request/.test(e.message) && !!e.hint,
  );
  assert.doesNotThrow(() => checkExportReply(parseXml('<RESPONSE>TallyPrime Server is Running</RESPONSE>')));
});

test('voucher XML follows the documented sign convention and shapes', () => {
  const plan = {
    shape: 'invoice',
    voucherType: 'Sales',
    date: '2026-04-01',
    number: '1',
    party: 'ABC Company Limited',
    optional: false,
    entries: [
      { ledger: 'ABC Company Limited', side: 'debit', paise: 2154600, isParty: true, bills: [{ type: 'new', ref: '1', paise: 2154600 }] },
      { ledger: 'Packing Charges', side: 'credit', paise: 90000 },
      { ledger: 'VAT', side: 'credit', paise: 264600 },
    ],
    items: [
      { item: 'Sony Television 14 inches', qty: 1, unit: 'nos', per: 'nos', rate: 15000, paise: 1500000, side: 'credit', ledger: 'Sales', godown: 'Main Location' },
      { item: 'Samsung DVD Player', qty: 1, unit: 'nos', per: 'nos', rate: 3000, paise: 300000, side: 'credit', ledger: 'Sales', godown: 'Main Location' },
    ],
    totals: { debit: 2154600, credit: 2154600 },
  };
  const v = buildVoucher(plan);
  assert.equal(v.attrs.OBJVIEW, 'Invoice Voucher View');
  const party = childrenNamed(v, 'LEDGERENTRIES.LIST')[0];
  assert.equal(childText(party, 'ISDEEMEDPOSITIVE'), 'Yes');
  assert.equal(childText(party, 'AMOUNT'), '-21546.00');
  assert.equal(childText(child(party, 'BILLALLOCATIONS.LIST'), 'BILLTYPE'), 'New Ref');
  const item = childrenNamed(v, 'ALLINVENTORYENTRIES.LIST')[0];
  assert.equal(childText(item, 'RATE'), '15000.00/nos');
  assert.equal(textOf(child(item, 'ACTUALQTY')), ' 1 nos');
  assert.equal(childText(item, 'ISDEEMEDPOSITIVE'), 'No');
  assert.equal(childText(child(item, 'ACCOUNTINGALLOCATIONS.LIST'), 'LEDGERNAME'), 'Sales');
  assert.equal(childText(child(item, 'BATCHALLOCATIONS.LIST'), 'GODOWNNAME'), 'Main Location');
  const cancel = buildVoucherAction('Cancel', { date: '2008-04-02', tagName: 'Voucher Number', tagValue: '3', voucherType: 'Sales' }, 'reason');
  assert.deepEqual(cancel.attrs, { DATE: '2-Apr-2008', TAGNAME: 'Voucher Number', TAGVALUE: '3', VCHTYPE: 'Sales', ACTION: 'Cancel' });
});

test('ledger XML carries old and new GST tags', () => {
  const node = masterXml('ledger', 'Create', { name: 'X', body: masterBody('ledger', { group: 'Sundry Debtors', gstin: '27AAPFU0939F1ZV', state: 'Maharashtra', openingBalance: { amount: 100, side: 'Dr' } }, { isCreate: true }) });
  const xml = serialize(node);
  assert.match(xml, /<OPENINGBALANCE>-100.00<\/OPENINGBALANCE>/);
  assert.match(xml, /<PARTYGSTIN>27AAPFU0939F1ZV<\/PARTYGSTIN>/);
  assert.match(xml, /<LEDGSTREGDETAILS.LIST>.*<GSTIN>27AAPFU0939F1ZV<\/GSTIN>/);
  assert.match(xml, /<LEDSTATENAME>Maharashtra<\/LEDSTATENAME>/);
  assert.throws(() => masterBody('ledger', { gstin: '27AAPFU0939F1ZA' }), (e) => /not valid/.test(e.message));
});

test('simulator formula subset evaluates the emitted formulas', () => {
  const env = { resolve: (o, m) => o[m.toLowerCase()] ?? '', lookup: () => '', variable: () => 'Co', formula: () => '', func: (n, a) => (n === 'sysname' ? `\u0004 ${a[0]}` : '') };
  const obj = { amount: -10, parent: '\u0004 Primary', iscancelled: false };
  assert.equal(evalFormula(fieldFormula('Amount', 'amount'), { obj, env }), '-10');
  assert.equal(evalFormula(fieldFormula('Parent', 'parent'), { obj, env }), '');
  assert.equal(evalFormula('NOT $IsCancelled', { obj, env }), true);
});
