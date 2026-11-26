/**
 * Append-only audit log of every write, as JSON lines with a hash chain: each record stores the
 * hash of the previous one, so any edit or deletion in the middle is detectable ("tally audit verify").
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const MAX_TEXT = 20000;
const clip = (s) => (typeof s === 'string' && s.length > MAX_TEXT ? s.slice(0, MAX_TEXT) + `... [${s.length - MAX_TEXT} more characters]` : s);

export class AuditLog {
  constructor(file) {
    this.file = file;
  }

  lastRecord() {
    if (!fs.existsSync(this.file)) return null;
    const text = fs.readFileSync(this.file, 'utf8').trimEnd();
    if (!text) return null;
    const last = text.slice(text.lastIndexOf('\n') + 1);
    try {
      return JSON.parse(last);
    } catch {
      return null;
    }
  }

  /** Append a record; returns it with seq and hash. */
  append(entry) {
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    const prev = this.lastRecord();
    const rec = {
      seq: prev ? prev.seq + 1 : 1,
      at: new Date().toISOString(),
      ...entry,
      request: clip(entry.request),
      reply: clip(entry.reply),
      prev: prev ? prev.hash : null,
    };
    rec.hash = hashOf(rec);
    fs.appendFileSync(this.file, JSON.stringify(rec) + '\n');
    return rec;
  }

  all() {
    if (!fs.existsSync(this.file)) return [];
    return fs
      .readFileSync(this.file, 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((l, i) => {
        try {
          return JSON.parse(l);
        } catch {
          return { seq: null, corrupt: true, line: i + 1 };
        }
      });
  }

  /** Check the chain; returns {ok, records, problems[]}. */
  verify() {
    const recs = this.all();
    const problems = [];
    let prevHash = null;
    recs.forEach((r, i) => {
      if (r.corrupt) {
        problems.push(`line ${r.line}: not valid JSON`);
        return;
      }
      if (r.prev !== prevHash) problems.push(`record ${r.seq}: previous-hash link broken (a record before it was changed or removed)`);
      const { hash, ...rest } = r;
      if (hashOf(rest) !== hash) problems.push(`record ${r.seq}: content does not match its hash (edited)`);
      if (i > 0 && recs[i - 1].seq !== null && r.seq !== recs[i - 1].seq + 1) problems.push(`record ${r.seq}: sequence gap`);
      prevHash = hash;
    });
    return { ok: problems.length === 0, records: recs.length, problems };
  }
}

function hashOf(rec) {
  const { hash: _ignored, ...rest } = rec;
  return crypto.createHash('sha256').update(stableStringify(rest)).digest('hex');
}

export function stableStringify(v) {
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(stableStringify).join(',')}]`;
  return `{${Object.keys(v)
    .filter((k) => v[k] !== undefined)
    .sort()
    .map((k) => `${JSON.stringify(k)}:${stableStringify(v[k])}`)
    .join(',')}}`;
}
