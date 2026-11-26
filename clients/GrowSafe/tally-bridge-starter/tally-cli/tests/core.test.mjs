import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseXml, serialize, el, tag, textOf, findAll, jsonToNodes, nodeToJson, cleanText, escapeXml } from '../src/core/xml.mjs';
import { parseDate, toTallyBody, toTallyVar, fyOf, parseFy, monthWindows, allowedInEducationalMode, resolvePeriod, today, halveWindow } from '../src/core/dates.mjs';
import { toPaise, paiseToString, parseTallyAmount, parseQty, parseRate, formatQty, formatRate, formatInr, toSided, fromSided } from '../src/core/amounts.mjs';
import { sniffEncoding, decodeBuffer, parseJson } from '../src/core/textio.mjs';
import { checkGstin, gstinCheckChar, findState, splitGst } from '../src/domain/gst.mjs';
import { suggest } from '../src/core/errors.mjs';
import { parseCsv, csvObjects } from '../src/io/csv.mjs';
import { AuditLog } from '../src/core/audit.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

test('xml: tolerates Tally control-character references and round-trips them', () => {
  const root = parseXml('<ENVELOPE><PARENT>&#4; Primary</PARENT><N>A &amp; B</N></ENVELOPE>');
  assert.equal(textOf(root.children[0]), '\u0004 Primary');
  assert.equal(cleanText(textOf(root.children[0])), 'Primary');
  const out = serialize(root);
  assert.match(out, /&#4; Primary/);
  assert.match(out, /A &amp; B/);
});

test('xml: truncated reply raises E_TRUNCATED', () => {
  assert.throws(() => parseXml('<ENVELOPE><DATA><ROW><F01>x</F01>'), (e) => e.code === 'E_TRUNCATED');
  assert.throws(() => parseXml(''), (e) => e.code === 'E_TRUNCATED');
});

test('xml: comments, CDATA, doctype, attributes, self-closing, unknown entities', () => {
  const r = parseXml('<?xml version="1.0"?><!DOCTYPE x [<!ENTITY a "b">]><A k="1" j=\'2\'><!-- c --><B/><C><![CDATA[<raw>]]></C><D>&nbsp;x</D></A>');
  assert.equal(r.attrs.k, '1');
  assert.equal(r.attrs.j, '2');
  assert.equal(textOf(findAll(r, 'C')[0]), '<raw>');
  assert.equal(textOf(findAll(r, 'D')[0]), '&nbsp;x');
});

test('xml: element order is preserved and case-insensitive lookup works', () => {
  const r = parseXml('<E><dspaccname>a</dspaccname><DSPACCINFO>1</DSPACCINFO><DSPACCNAME>b</DSPACCNAME></E>');
  assert.deepEqual(findAll(r, 'DSPACCNAME').map(textOf), ['a', 'b']);
});

test('xml: random trees round-trip', () => {
  let seed = 7;
  const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  const chars = 'abc &<>"\'₹नम\u0004';
  const word = () => Array.from({ length: 1 + Math.floor(rnd() * 8) }, () => chars[Math.floor(rnd() * chars.length)]).join('');
  const build = (d) => el(`T${Math.floor(rnd() * 5)}`, rnd() < 0.3 ? { A: word() } : {}, d > 3 || rnd() < 0.4 ? word() : [build(d + 1), build(d + 1)]);
  for (let i = 0; i < 50; i++) {
    const tree = build(0);
    const again = parseXml(serialize(tree));
    assert.equal(serialize(again), serialize(tree));
  }
});

test('xml: malformed inputs terminate with an error or a tree', () => {
  for (const s of ['<', '<a', '<a b="', '<a>&#99999999;</a>', '</a>', '<a><b></a>', '<a></b></a>', 'text', '<a>&#xZZ;</a>']) {
    try {
      parseXml(s);
    } catch (e) {
      assert.ok(e.code);
    }
  }
});

test('xml: json conversion helpers', () => {
  const nodes = jsonToNodes({ NARRATION: 'x', 'ADDRESS.LIST': { '@TYPE': 'String', ADDRESS: ['l1', 'l2'] } });
  assert.equal(serialize(el('V', {}, nodes)), '<V><NARRATION>x</NARRATION><ADDRESS.LIST TYPE="String"><ADDRESS>l1</ADDRESS><ADDRESS>l2</ADDRESS></ADDRESS.LIST></V>');
  const j = nodeToJson(parseXml('<L NAME="x"><A>1</A><A>2</A><B>3</B></L>'));
  assert.deepEqual(j.A, ['1', '2']);
  assert.equal(j['@NAME'], 'x');
  assert.equal(escapeXml('a\u0001b'), 'a&#1;b');
  assert.equal(serialize(tag('X', null) || el('Y', {})), '<Y/>');
});

test('dates: parsing and Tally formats', () => {
  assert.equal(parseDate('2026-04-01'), '2026-04-01');
  assert.equal(parseDate('20260401'), '2026-04-01');
  assert.equal(parseDate('01-04-2026'), '2026-04-01');
  assert.equal(parseDate('1/4/26'), '2026-04-01');
  assert.equal(parseDate('1-Apr-2026'), '2026-04-01');
  assert.equal(parseDate('5 December 2026'), '2026-12-05');
  assert.throws(() => parseDate('31-02-2026'), (e) => e.code === 'E_INPUT');
  assert.equal(toTallyBody('2026-04-01'), '20260401');
  assert.equal(toTallyVar('2026-04-01'), '1-Apr-2026');
  assert.deepEqual(fyOf('2027-02-10'), { from: '2026-04-01', to: '2027-03-31', label: '2026-27' });
  assert.equal(parseFy('2026-27').from, '2026-04-01');
  assert.equal(parseFy('FY27').to, '2027-03-31');
  assert.equal(monthWindows('2026-04-15', '2026-06-10').length, 3);
  assert.deepEqual(halveWindow({ from: '2026-04-01', to: '2026-04-30' }), [{ from: '2026-04-01', to: '2026-04-15' }, { from: '2026-04-16', to: '2026-04-30' }]);
  assert.ok(allowedInEducationalMode('2026-02-28'));
  assert.ok(!allowedInEducationalMode('2026-02-27'));
});

test('dates: "today" uses local calendar fields, not UTC', () => {
  const lateEvening = new Date(2026, 10, 25, 23, 50);
  assert.equal(today(lateEvening), '2026-11-25');
  const p = resolvePeriod({}, { now: new Date(2026, 10, 25, 1, 0), booksFrom: '2026-04-01' });
  assert.deepEqual(p, { from: '2026-04-01', to: '2026-11-25' });
});

test('amounts: paise, signs, rounding refusal', () => {
  assert.equal(toPaise('1,234.50'), 123450);
  assert.equal(toPaise(0.3 + 0.6), 90);
  assert.throws(() => toPaise('10.555'), (e) => e.code === 'E_INPUT');
  assert.throws(() => toPaise(-5), (e) => /positive/.test(e.message));
  assert.equal(toPaise('-5', { allowNegative: true }), -500);
  assert.equal(paiseToString(-123405), '-1234.05');
  assert.equal(parseTallyAmount('(-)1,234.50'), -1234.5);
  assert.equal(parseTallyAmount('1,000.00 Dr'), -1000);
  assert.equal(parseTallyAmount('$ 10.00 @ ₹ 83.00/$ = ₹ 830.00'), 830);
  assert.deepEqual(parseQty(' 10 Nos'), { qty: 10, unit: 'Nos' });
  assert.deepEqual(parseQty('(-)2.5 Kgs'), { qty: -2.5, unit: 'Kgs' });
  assert.deepEqual(parseRate('1000.00/Nos'), { rate: 1000, per: 'Nos' });
  assert.equal(formatQty(10, 'Nos'), ' 10 Nos');
  assert.equal(formatRate(15000, 'nos'), '15000.00/nos');
  assert.equal(formatInr(1234567.5), '12,34,567.50');
  assert.deepEqual(toSided(-50), { amount: 50, side: 'Dr' });
  assert.equal(fromSided({ amount: 50, side: 'Cr' }), 50);
});

test('textio: encodings are sniffed (PowerShell UTF-16, BOMs)', () => {
  const s = '{"party":"₹ नमस्ते"}';
  assert.equal(decodeBuffer(Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from(s, 'utf16le')])), s);
  assert.equal(decodeBuffer(Buffer.from(s, 'utf16le')), s);
  assert.equal(decodeBuffer(Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from(s)])), s);
  assert.equal(sniffEncoding(Buffer.from('<A>x</A>', 'utf16le')).encoding, 'utf16le');
  assert.deepEqual(parseJson('{"a":1}\n{"a":2}'), [{ a: 1 }, { a: 2 }]);
  assert.throws(() => parseJson('{bad'), (e) => e.code === 'E_INPUT');
});

test('gst: GSTIN checksum, states and tax split', () => {
  const first = '27AAPFU0939F1Z';
  const g = first + gstinCheckChar(first);
  assert.ok(checkGstin(g).valid);
  assert.ok(!checkGstin(first + (g[14] === 'A' ? 'B' : 'A')).valid);
  assert.ok(!checkGstin('27ABC').valid);
  assert.equal(findState('27').name, 'Maharashtra');
  assert.equal(findState('orissa').name, 'Odisha');
  const intra = splitGst({ lines: [{ taxable: 1000000, rate: 18 }], companyState: 'Maharashtra', placeOfSupply: '27', ledgers: { cgst: 'C', sgst: 'S', igst: 'I' } });
  assert.equal(intra.interState, false);
  assert.deepEqual(intra.taxes.map((t) => t.amount), [90000, 90000]);
  const inter = splitGst({ lines: [{ taxable: 1000000, rate: 18 }, { taxable: 50000, rate: 12 }], companyState: 'Maharashtra', placeOfSupply: 'Gujarat', ledgers: { igst: 'I' } });
  assert.equal(inter.taxes.length, 1);
  assert.equal(inter.taxes[0].amount, 180000 + 6000);
  assert.throws(() => splitGst({ lines: [{ taxable: 1, rate: 5 }], companyState: 'Maharashtra', placeOfSupply: 'Goa', ledgers: {} }), (e) => /No ledger configured/.test(e.message));
});

test('suggestions rank close names', () => {
  assert.deepEqual(suggest('alpha hardware', ['Alpha Hardware Stores', 'Beta', 'Alphabet']).slice(0, 1), ['Alpha Hardware Stores']);
  assert.ok(suggest('banc', ['Bank of Example', 'Cash']).includes('Bank of Example'));
});

test('csv: quotes, embedded commas and newlines, delimiter sniffing', () => {
  assert.deepEqual(parseCsv('a,b\n"x, y","line1\nline2"\r\n'), [['a', 'b'], ['x, y', 'line1\nline2']]);
  assert.deepEqual(csvObjects('Date;Amount\n01-04-2026;10\n'), [{ Date: '01-04-2026', Amount: '10' }]);
});

test('audit: hash chain detects edits', () => {
  const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'tcaudit-')), 'audit.jsonl');
  const a = new AuditLog(f);
  a.append({ op: 'x', outcome: 'ok' });
  a.append({ op: 'y', outcome: 'ok' });
  assert.ok(a.verify().ok);
  const lines = fs.readFileSync(f, 'utf8').trim().split('\n');
  const r = JSON.parse(lines[0]);
  r.op = 'tampered';
  lines[0] = JSON.stringify(r);
  fs.writeFileSync(f, lines.join('\n') + '\n');
  const v = a.verify();
  assert.equal(v.ok, false);
  assert.ok(v.problems.length >= 1);
});
