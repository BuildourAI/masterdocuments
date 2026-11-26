/**
 * Configuration: flags > environment > config file > defaults.
 *
 * The config file (tally.config.json) holds one or more named profiles, each describing one Tally
 * connection plus its safety settings. Environment variables and flags may change the connection
 * (URL, company, timeout) and may LOWER the write mode (for example --read-only), but can never
 * raise it: write permissions only come from the config file, which a person sets during setup.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TallyCliError } from './errors.mjs';
import { parseJson } from './textio.mjs';

export const TOOL_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const CONFIG_NAME = 'tally.config.json';

export const WRITE_MODES = ['off', 'optional', 'on'];
export const LEVELS = ['read', 'write', 'destructive'];

export const DEFAULT_PROFILE = Object.freeze({
  url: 'http://127.0.0.1:9000',
  company: null,
  companyGuid: null,
  timeoutMs: 120000,
  connectTimeoutMs: 3000,
  encoding: 'utf16',
  writeMode: 'off',
  allowMasterWrites: null, // null = true when writeMode is "on", false when "optional"
  allowDestructive: false,
  allowedVoucherTypes: null, // null = all
  maxAmount: null, // per voucher, rupees
  maxPerRun: null, // vouchers per bulk run
  lockBefore: null, // ISO date: refuse writes dated before this
  requireIdempotencyKey: false,
  decimals: 2,
  frontends: { cli: 'destructive', mcp: 'read', http: 'read', relay: 'read' },
  gst: {
    companyState: null,
    ledgers: { cgst: null, sgst: null, igst: null, cess: null },
    byRate: {},
  },
  roundOffLedger: null,
  chunk: { maxDays: 31, pauseMs: 0 },
});

/** Locate the config file: explicit path > $TALLY_CLI_CONFIG > ./tally.config.json > <tool>/tally.config.json */
export function findConfigPath(explicit, env = process.env, cwd = process.cwd()) {
  if (explicit) return path.resolve(cwd, explicit);
  if (env.TALLY_CLI_CONFIG) return path.resolve(cwd, env.TALLY_CLI_CONFIG);
  const local = path.join(cwd, CONFIG_NAME);
  if (fs.existsSync(local)) return local;
  return path.join(TOOL_ROOT, CONFIG_NAME);
}

function deepMerge(base, over) {
  if (over === undefined || over === null) return base;
  if (typeof base !== 'object' || base === null || Array.isArray(base) || typeof over !== 'object' || Array.isArray(over)) return over;
  const out = { ...base };
  for (const [k, v] of Object.entries(over)) out[k] = deepMerge(base[k], v);
  return out;
}

export function readConfigFile(p) {
  if (!fs.existsSync(p)) return null;
  const text = fs.readFileSync(p, 'utf8');
  try {
    return parseJson(text, `config file ${p}`);
  } catch (err) {
    throw new TallyCliError('E_CONFIG', err.message, { hint: `Fix or delete ${p}, then run "tally init".` });
  }
}

/**
 * Load the effective configuration.
 * @param {{configPath?: string, profile?: string, overrides?: object, env?: object, cwd?: string}} opts
 */
export function loadConfig(opts = {}) {
  const env = opts.env || process.env;
  const file = findConfigPath(opts.configPath, env, opts.cwd);
  const raw = readConfigFile(file) || {};
  const profiles = raw.profiles || {};
  const profileName = opts.profile || env.TALLY_PROFILE || raw.defaultProfile || Object.keys(profiles)[0] || 'default';
  if (opts.profile && !profiles[opts.profile] && Object.keys(profiles).length) {
    throw new TallyCliError('E_CONFIG', `Profile "${opts.profile}" not found in ${file}.`, {
      hint: `Available profiles: ${Object.keys(profiles).join(', ')}`,
    });
  }
  let profile = deepMerge(structuredClone(DEFAULT_PROFILE), profiles[profileName] || {});

  // Connection settings may come from the environment and flags.
  const o = opts.overrides || {};
  const conn = {
    url: o.url ?? env.TALLY_URL,
    company: o.company ?? env.TALLY_COMPANY,
    timeoutMs: o.timeoutMs ?? (env.TALLY_TIMEOUT ? Number(env.TALLY_TIMEOUT) * 1000 : undefined),
    encoding: o.encoding ?? env.TALLY_ENCODING,
  };
  for (const [k, v] of Object.entries(conn)) if (v !== undefined && v !== null && v !== '') profile[k] = v;
  if (conn.company && profiles[profileName]?.company && conn.company !== profiles[profileName].company) {
    profile.companyGuid = null; // a different company was asked for; the pinned id no longer applies
  }

  // Write mode can only be lowered from outside the file.
  const lowered = o.readOnly || env.TALLY_READ_ONLY === '1' ? 'off' : o.writeMode ?? env.TALLY_WRITE_MODE;
  if (lowered && WRITE_MODES.indexOf(lowered) !== -1 && WRITE_MODES.indexOf(lowered) < WRITE_MODES.indexOf(profile.writeMode)) {
    profile.writeMode = lowered;
  }
  if (!WRITE_MODES.includes(profile.writeMode)) {
    throw new TallyCliError('E_CONFIG', `writeMode must be one of ${WRITE_MODES.join(', ')} (got ${profile.writeMode}).`);
  }
  if (profile.allowMasterWrites === null) profile.allowMasterWrites = profile.writeMode === 'on';

  const dir = path.dirname(file);
  const stateDir = path.resolve(dir, raw.stateDir || '.tally');
  return {
    file,
    exists: fs.existsSync(file),
    dir,
    stateDir,
    profileName,
    profile,
    raw,
    http: deepMerge({ host: '127.0.0.1', port: 8765, tokens: [], maxBodyBytes: 2_000_000, allowHosts: [] }, raw.http || {}),
    relay: deepMerge({ url: null, secret: null, allow: null, pollMs: 2000, insecureLocalhost: true }, raw.relay || {}),
    mcp: deepMerge({ toolset: 'core', maxChars: 40000 }, raw.mcp || {}),
  };
}

/** Write the raw config back (pretty, stable). */
export function saveConfig(file, raw) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(raw, null, 2) + '\n');
}

export function levelAllows(ceiling, needed) {
  return LEVELS.indexOf(ceiling) >= LEVELS.indexOf(needed);
}
