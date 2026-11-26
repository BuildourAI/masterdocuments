/**
 * Command-line parsing: `tally <area> <action> [positionals] [--flags]`.
 * The command words are matched against operation ids in the registry ("ledger list" -> ledger.list).
 * Flags are kebab-case on the command line and camelCase in operation input.
 */
import { hasOp, getOp } from '../ops/registry.mjs';
import { TallyCliError } from '../core/errors.mjs';

export const GLOBAL_FLAGS = {
  profile: { type: 'string', help: 'Profile name from tally.config.json.' },
  config: { type: 'string', help: 'Path to tally.config.json.' },
  url: { type: 'string', help: 'Tally gateway URL (default http://127.0.0.1:9000), or sim:<file> for the simulator.' },
  company: { type: 'string', help: 'Company name to target (must be open in Tally).' },
  timeout: { type: 'number', help: 'Seconds to wait for Tally (default 120).' },
  encoding: { type: 'string', help: 'utf16 (default) or utf8.' },
  json: { type: 'boolean', help: 'JSON output (default when piped).' },
  table: { type: 'boolean', help: 'Table output (default in a terminal).' },
  csv: { type: 'boolean', help: 'CSV output (rows only).' },
  ndjson: { type: 'boolean', help: 'One JSON object per line (rows only).' },
  format: { type: 'string', help: 'json | table | csv | ndjson' },
  pretty: { type: 'boolean', help: 'Indent JSON output.' },
  out: { type: 'string', help: 'Write output to this file instead of stdout.' },
  input: { type: 'string', help: 'Read the operation input from a JSON file ("-" for stdin).' },
  readOnly: { type: 'boolean', help: 'Refuse all writes for this run.' },
  record: { type: 'string', help: 'Save every request and reply to this folder (for replay and bug reports).' },
  verbose: { type: 'boolean', help: 'Log requests to stderr.' },
  quiet: { type: 'boolean', help: 'No warnings on stderr.' },
  help: { type: 'boolean', help: 'Show help.' },
  version: { type: 'boolean', help: 'Show version.' },
};

export const kebabToCamel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
export const camelToKebab = (s) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/**
 * @param {string[]} argv
 * @returns {{opId: string|null, words: string[], input: object, flags: object}}
 */
export function parseArgs(argv) {
  const words = [];
  const raw = []; // [name, value|true, explicit]
  const consumed = new Set();
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--') {
      words.push(...argv.slice(i + 1));
      break;
    }
    if (a.startsWith('--') && a.length > 2) {
      const eq = a.indexOf('=');
      if (eq !== -1) raw.push([a.slice(2, eq), a.slice(eq + 1), true]);
      else {
        const g = GLOBAL_FLAGS[kebabToCamel(a.slice(2))];
        if (g && g.type !== 'boolean' && argv[i + 1] !== undefined && !argv[i + 1].startsWith('--')) {
          // Global flags with values are known up front, so their value is never taken for a command word.
          raw.push([a.slice(2), argv[i + 1], true]);
          consumed.add(i + 1);
          i++;
        } else raw.push([a.slice(2), undefined, false, i]);
      }
      continue;
    }
    if (a === '-h') {
      raw.push(['help', true, true]);
      continue;
    }
    if (a === '-v' || a === '-V') {
      raw.push(['version', true, true]);
      continue;
    }
    words.push(a);
  }

  // Match the longest command prefix that is a registered op.
  let opId = null;
  let used = 0;
  for (let n = Math.min(3, words.length); n >= 1; n--) {
    const id = words.slice(0, n).join('.').toLowerCase();
    if (hasOp(id)) {
      opId = id;
      used = n;
      break;
    }
  }
  const op = opId ? getOp(opId) : null;
  const props = op?.input?.properties || {};
  const positionals = words.slice(used);

  const flags = {};
  const input = {};
  // Resolve flags; a flag without "=" takes the next argv token as value unless it is boolean.
  for (const entry of raw) {
    const [rawName, val, explicit, idx] = entry;
    let name = kebabToCamel(rawName);
    let negated = false;
    if (name.startsWith('no') && name.length > 2 && /[A-Z]/.test(name[2])) {
      const base = name[2].toLowerCase() + name.slice(3);
      if ((props[base] && props[base].type === 'boolean') || (GLOBAL_FLAGS[base] && GLOBAL_FLAGS[base].type === 'boolean')) {
        name = base;
        negated = true;
      }
    }
    const def = props[name] || GLOBAL_FLAGS[name];
    let value = val;
    if (!explicit) {
      if (negated) value = false;
      else if (def && def.type === 'boolean') {
        const next = argv[idx + 1];
        if (next !== undefined && /^(true|false|yes|no)$/i.test(next)) {
          value = next;
          consumed.add(idx + 1);
        } else value = true;
      }
      else {
        const next = argv[idx + 1];
        if (next !== undefined && !next.startsWith('--')) {
          value = next;
          consumed.add(idx + 1);
        } else if (!def) value = true;
        else throw new TallyCliError('E_USAGE', `--${rawName} needs a value.`);
      }
    }
    const target = props[name] ? input : GLOBAL_FLAGS[name] ? flags : input; // unknown flags go to input (validation reports them)
    if (target === input && props[name]?.type === 'array') {
      const list = Array.isArray(input[name]) ? input[name] : input[name] === undefined ? [] : [input[name]];
      input[name] = [...list, ...String(value).split(',').map((s) => s.trim()).filter(Boolean)];
    } else target[name] = value;
  }
  // Remove positionals that were consumed as flag values
  const cleanPositionals = [];
  {
    // Rebuild the positional list by excluding argv indexes consumed by flags
    let wi = 0;
    for (let i = 0; i < argv.length; i++) {
      if (argv[i] === '--') {
        cleanPositionals.push(...argv.slice(i + 1).slice(Math.max(0, used - wi)));
        break;
      }
      if (argv[i].startsWith('--') || argv[i] === '-h' || argv[i] === '-v' || argv[i] === '-V' || consumed.has(i)) continue;
      if (wi < used) {
        wi++;
        continue;
      }
      cleanPositionals.push(argv[i]);
    }
  }
  void positionals;
  const posNames = op?.positional || [];
  cleanPositionals.forEach((p, idx) => {
    const name = posNames[idx];
    if (!name) {
      if (op) throw new TallyCliError('E_USAGE', `Unexpected argument "${p}" for "${words.slice(0, used).join(' ')}".`, { hint: 'Quote names that contain spaces, e.g. "Sundry Debtors".' });
      return;
    }
    if (input[name] === undefined) input[name] = props[name]?.type === 'array' ? p.split(',') : p;
  });
  return { opId, words, used, input, flags, op };
}
