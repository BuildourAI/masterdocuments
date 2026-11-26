/**
 * Small JSON state files kept in the state folder (.tally/ next to the config file):
 * idempotency records, sync cursors, prepared plans, capability probe results.
 */
import fs from 'node:fs';
import path from 'node:path';

export class StateStore {
  constructor(dir) {
    this.dir = dir;
  }

  file(name) {
    return path.join(this.dir, name);
  }

  read(name, fallback = {}) {
    try {
      return JSON.parse(fs.readFileSync(this.file(name), 'utf8'));
    } catch {
      return structuredClone(fallback);
    }
  }

  write(name, value) {
    fs.mkdirSync(path.dirname(this.file(name)), { recursive: true });
    const tmp = this.file(`${name}.${process.pid}.tmp`);
    fs.writeFileSync(tmp, JSON.stringify(value, null, 2));
    fs.renameSync(tmp, this.file(name));
  }

  update(name, fn, fallback = {}) {
    const cur = this.read(name, fallback);
    const next = fn(cur) ?? cur;
    this.write(name, next);
    return next;
  }

  remove(name) {
    try {
      fs.unlinkSync(this.file(name));
      return true;
    } catch {
      return false;
    }
  }

  list(subdir) {
    try {
      return fs.readdirSync(this.file(subdir));
    } catch {
      return [];
    }
  }
}

/** Key for per-profile, per-company state. */
export const scopeKey = (profileName, company) => `${profileName}::${company || '(active company)'}`;
