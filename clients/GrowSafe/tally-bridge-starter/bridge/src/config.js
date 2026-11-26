import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function loadEnv() {
  const file = path.join(root, '.env');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

export function loadConfig() {
  const file = path.join(root, 'config.json');
  if (!fs.existsSync(file)) throw new Error('config.json not found: copy config.example.json to config.json and fill in your company names');
  const cfg = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!Array.isArray(cfg.companies) || cfg.companies.length === 0) throw new Error('config.json: list at least one company');
  for (const c of cfg.companies) {
    if (!c.name || !c.profile) throw new Error('config.json: every company needs "name" (exact, as in TallyPrime) and "profile" (its tally-cli profile)');
  }
  return cfg;
}

const logDir = path.join(root, 'logs');
export function log(level, message, extra) {
  const line = `${new Date().toISOString()} ${level.toUpperCase()} ${message}${extra ? ' ' + JSON.stringify(extra) : ''}`;
  console.log(line);
  try {
    fs.mkdirSync(logDir, { recursive: true });
    fs.appendFileSync(path.join(logDir, `bridge-${new Date().toISOString().slice(0, 10)}.log`), line + '\n');
  } catch { /* logging must never stop the bridge */ }
}
