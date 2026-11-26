import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runCli } from '../src/cli/main.mjs';

/** Make a temporary site: a folder with tally.config.json pointing at a fresh simulator file. */
export function makeSite(profile = {}, extra = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tally-cli-test-'));
  const config = {
    defaultProfile: 'test',
    profiles: {
      test: {
        url: `sim:${path.join(dir, 'books.json')}`,
        company: 'Sample Traders Pvt Ltd',
        writeMode: 'on',
        allowDestructive: true,
        gst: { companyState: 'Maharashtra' },
        roundOffLedger: 'Round Off',
        defaultBankLedger: 'Bank of Example - Current A/c',
        ...profile,
      },
    },
    ...extra,
  };
  fs.writeFileSync(path.join(dir, 'tally.config.json'), JSON.stringify(config, null, 2));
  return dir;
}

/** Run the CLI in-process; returns {code, out, err, json}. */
export async function tally(dir, ...args) {
  let out = '';
  let err = '';
  const stdout = { isTTY: false, write: (s) => (out += s) };
  const stderr = { isTTY: false, write: (s) => (err += s) };
  const code = await runCli([...args, '--json'], { stdout, stderr, cwd: dir, env: { ...process.env, TALLY_URL: '', TALLY_COMPANY: '', TALLY_PROFILE: '', TALLY_CLI_CONFIG: path.join(dir, 'tally.config.json') } });
  let json = null;
  try {
    json = JSON.parse(out);
  } catch {
    json = null;
  }
  return { code, out, err, json, data: json?.data, error: json?.error };
}

export function writeJson(dir, name, value) {
  const f = path.join(dir, name);
  fs.writeFileSync(f, JSON.stringify(value, null, 2));
  return f;
}
