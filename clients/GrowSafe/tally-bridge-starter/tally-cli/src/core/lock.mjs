/**
 * Tally answers one request at a time. Several processes may talk to it (a tool server, a watcher,
 * an ad-hoc command), so requests are serialised in-process with a promise chain and across
 * processes with an exclusive lock file. A lock older than its lease, or held by a dead process,
 * is taken over.
 */
import fs from 'node:fs';
import path from 'node:path';
import { TallyCliError } from './errors.mjs';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function pidAlive(pid) {
  if (!pid || pid === process.pid) return pid === process.pid;
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    return err.code === 'EPERM';
  }
}

export function createLock(file, { leaseMs = 10 * 60 * 1000, waitMs = 5 * 60 * 1000, enabled = true } = {}) {
  let chain = Promise.resolve();

  async function acquireFile() {
    if (!enabled || !file) return () => {};
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const started = Date.now();
    let delay = 25;
    for (;;) {
      try {
        const fd = fs.openSync(file, 'wx');
        fs.writeSync(fd, JSON.stringify({ pid: process.pid, at: Date.now() }));
        fs.closeSync(fd);
        return () => {
          try {
            fs.unlinkSync(file);
          } catch {
            /* already gone */
          }
        };
      } catch (err) {
        if (err.code !== 'EEXIST') throw err;
      }
      try {
        const info = JSON.parse(fs.readFileSync(file, 'utf8') || '{}');
        if (!pidAlive(info.pid) || Date.now() - (info.at || 0) > leaseMs) {
          fs.unlinkSync(file);
          continue;
        }
      } catch {
        // unreadable lock file: treat as stale if it is old
        try {
          const st = fs.statSync(file);
          if (Date.now() - st.mtimeMs > 5000) fs.unlinkSync(file);
        } catch {
          /* ignore */
        }
      }
      if (Date.now() - started > waitMs) {
        throw new TallyCliError('E_LOCKED', 'Another process has been talking to Tally for too long.', {
          hint: `If nothing else is running, delete ${file}.`,
        });
      }
      await sleep(delay);
      delay = Math.min(delay * 2, 500);
    }
  }

  /** Run fn while holding both locks. */
  function run(fn) {
    const next = chain.then(async () => {
      const release = await acquireFile();
      try {
        return await fn();
      } finally {
        release();
      }
    });
    chain = next.catch(() => {});
    return next;
  }

  return { run };
}
