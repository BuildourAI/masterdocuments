/**
 * Text decoding and input reading.
 * Windows tools write files in different encodings: PowerShell 5.1 `>` produces UTF-16LE with a BOM,
 * Notepad may add a UTF-8 BOM. Tally replies in UTF-16LE when asked in UTF-16. Everything is sniffed.
 */
import fs from 'node:fs';
import { TallyCliError } from './errors.mjs';

/** Detect the encoding of a buffer from its BOM or byte pattern. */
export function sniffEncoding(buf) {
  if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) return { encoding: 'utf8', bom: 3 };
  if (buf.length >= 2 && buf[0] === 0xff && buf[1] === 0xfe) return { encoding: 'utf16le', bom: 2 };
  if (buf.length >= 2 && buf[0] === 0xfe && buf[1] === 0xff) return { encoding: 'utf16be', bom: 2 };
  if (buf.length >= 4) {
    // Count NUL bytes in even / odd positions over a sample
    const len = Math.min(buf.length, 512) & ~1;
    let evenNul = 0;
    let oddNul = 0;
    for (let i = 0; i < len; i += 2) {
      if (buf[i] === 0) evenNul++;
      if (buf[i + 1] === 0) oddNul++;
    }
    const pairs = len / 2;
    if (oddNul > pairs * 0.3 && evenNul < pairs * 0.1) return { encoding: 'utf16le', bom: 0 };
    if (evenNul > pairs * 0.3 && oddNul < pairs * 0.1) return { encoding: 'utf16be', bom: 0 };
  }
  return { encoding: 'utf8', bom: 0 };
}

/** Decode a buffer to a string using the sniffed encoding. */
export function decodeBuffer(buf) {
  if (!buf || buf.length === 0) return '';
  const { encoding, bom } = sniffEncoding(buf);
  const body = buf.subarray(bom);
  if (encoding === 'utf16le') return body.toString('utf16le');
  if (encoding === 'utf16be') {
    const swapped = Buffer.from(body);
    swapped.swap16();
    return swapped.toString('utf16le');
  }
  return body.toString('utf8');
}

export function encodeString(str, encoding) {
  if (encoding === 'utf16' || encoding === 'utf16le' || encoding === 'utf-16') return Buffer.from(str, 'utf16le');
  return Buffer.from(str, 'utf8');
}

export async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return decodeBuffer(Buffer.concat(chunks));
}

/** Read a file path, or stdin when the path is "-". */
export async function readText(p) {
  if (p === '-') return readStdin();
  try {
    return decodeBuffer(fs.readFileSync(p));
  } catch (err) {
    throw new TallyCliError('E_INPUT', `Cannot read file "${p}": ${err.code || err.message}`, {
      hint: 'Check the path. Paths with spaces must be quoted.',
    });
  }
}

/** Parse JSON with a useful error message. Accepts NDJSON when `ndjson` is set (returns an array). */
export function parseJson(text, label = 'input', { ndjson = false } = {}) {
  const t = String(text).replace(/^﻿/, '').trim();
  if (!t) throw new TallyCliError('E_INPUT', `The ${label} is empty.`);
  if (ndjson || (t[0] === '{' && /}\s*\n\s*{/.test(t))) {
    const rows = [];
    t.split(/\r?\n/).forEach((line, idx) => {
      if (!line.trim()) return;
      try {
        rows.push(JSON.parse(line));
      } catch (err) {
        throw new TallyCliError('E_INPUT', `Line ${idx + 1} of the ${label} is not valid JSON: ${err.message}`);
      }
    });
    return rows;
  }
  try {
    return JSON.parse(t);
  } catch (err) {
    throw new TallyCliError('E_INPUT', `The ${label} is not valid JSON: ${err.message}`, {
      hint: 'On Windows, put JSON in a file and pass --input file.json instead of typing it on the command line.',
    });
  }
}

/** Write a file creating parent folders; returns the absolute path. */
export function writeFileSafe(p, data) {
  const dir = p.replace(/[\\/][^\\/]*$/, '');
  if (dir && dir !== p) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(p, data);
  return p;
}
