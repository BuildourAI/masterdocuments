// Every conversation with TallyPrime goes through tally-cli (the folder ../tally-cli next to this one).
// The bridge never builds Tally XML itself: tally-cli reads, validates, writes Optional vouchers,
// stops double posting and keeps its own audit log. We run it as a command and read its JSON reply.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

// tally-cli exit codes (see tally-cli/README.md, "Output").
export const EXIT = { ok: 0, usage: 2, unreachable: 3, refused: 4, invalid: 5, policy: 6, notFound: 7, unknownOutcome: 8, conflict: 9 };

export class TallyCliError extends Error {
  constructor(message, { code, exitCode, hint, details } = {}) {
    super(message);
    this.code = code;
    this.exitCode = exitCode;
    this.hint = hint;
    this.details = details;
  }
}

export class TallyCli {
  /**
   * @param {object} opts
   * @param {string} [opts.dir]        tally-cli folder (default ../tally-cli, next to the bridge folder)
   * @param {string} [opts.configPath] tally.config.json to use (default: the one inside tally-cli)
   * @param {number} [opts.timeoutMs]  hard stop for one command (default 30 minutes: first loads are long)
   */
  constructor(opts = {}) {
    // A relative folder in config.json is read from the bridge folder, wherever the bridge is started from.
    this.dir = path.resolve(path.join(here, '..'), opts.dir || path.join('..', 'tally-cli'));
    this.entry = path.join(this.dir, 'bin', 'tally.mjs');
    if (!fs.existsSync(this.entry)) throw new Error(`tally-cli not found at ${this.dir}. Put the tally-cli folder next to the bridge folder.`);
    this.configPath = opts.configPath;
    this.timeoutMs = opts.timeoutMs || 30 * 60_000;
  }

  /** Run one tally-cli command for a profile; returns its "data" or throws TallyCliError. */
  run(profile, args, { input } = {}) {
    let inputFile;
    const full = [this.entry, ...args, '--json', '--quiet'];
    if (profile) full.push('--profile', profile);
    if (this.configPath) full.push('--config', this.configPath);
    if (input !== undefined) {
      inputFile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'gsb-')), 'input.json');
      fs.writeFileSync(inputFile, JSON.stringify(input));
      full.push('--input', inputFile);
    }
    return new Promise((resolve, reject) => {
      const child = spawn(process.execPath, full, { cwd: this.dir, windowsHide: true });
      let out = '', err = '';
      const timer = setTimeout(() => child.kill(), this.timeoutMs);
      child.stdout.on('data', (d) => { out += d; });
      child.stderr.on('data', (d) => { err += d; });
      child.on('error', (e) => { clearTimeout(timer); reject(e); });
      child.on('close', (exitCode) => {
        clearTimeout(timer);
        if (inputFile) fs.rmSync(path.dirname(inputFile), { recursive: true, force: true });
        let reply;
        try { reply = JSON.parse(out); } catch {
          return reject(new TallyCliError(`tally-cli gave no JSON reply (exit ${exitCode}): ${(err || out).trim().slice(0, 500)}`, { code: 'E_NO_REPLY', exitCode }));
        }
        if (reply.ok) return resolve(reply.data);
        const e = reply.error || {};
        reject(new TallyCliError(e.message || 'tally-cli failed', { code: e.code, exitCode, hint: e.hint, details: e.details }));
      });
    });
  }

  // ---- reads ----
  companies(profile) { return this.run(profile, ['company', 'list']); }
  doctor(profile) { return this.run(profile, ['doctor']); }
  counters(profile) { return this.run(profile, ['sync', 'status']).then((d) => d.tally); }

  /** export <dataset>; masters ignore from/to; voucher datasets are read month by month inside tally-cli. */
  async exportRows(profile, dataset, { from, to, sinceAlterId } = {}) {
    const args = ['export', dataset];
    if (sinceAlterId) args.push('--since-alter-id', String(sinceAlterId));
    else {
      if (from) args.push('--from', from);
      if (to) args.push('--to', to);
    }
    if (!['ledgers', 'groups', 'items', 'units', 'godowns', 'cost-centres', 'voucher-types', 'stock-groups'].includes(dataset)) {
      args.push('--include-optional', '--include-cancelled');
    }
    return (await this.run(profile, args)).rows;
  }

  /** Batch allocations of inventory lines (godown, batch) for a period or since an alter id. */
  batches(profile, { from, to, sinceAlterId } = {}) {
    const input = {
      type: 'Voucher',
      route: ['AllInventoryEntries', 'BatchAllocations'],
      fields: ['Guid', 'StockItemName', 'GodownName', 'BatchName', 'ActualQty:qty', 'Amount:amount'],
      filter: sinceAlterId ? [`$AlterID > ${Number(sinceAlterId)}`] : [],
    };
    if (from) input.from = from;
    if (to) input.to = to;
    return this.run(profile, ['query', 'collection'], { input });
  }

  // ---- writes (allowed only by the tally-cli profile: optional mode, master writes, voucher types, limits) ----
  createVoucher(profile, voucher, idempotencyKey) {
    return this.run(profile, ['voucher', 'create', '--idempotency-key', idempotencyKey], { input: voucher });
  }

  createLedger(profile, ledger) {
    return this.run(profile, ['ledger', 'create'], { input: ledger });
  }
}
