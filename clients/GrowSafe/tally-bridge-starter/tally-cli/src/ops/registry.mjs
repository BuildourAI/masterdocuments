/**
 * The operation registry. Every capability is declared once here and exposed by every front-end
 * (CLI, MCP tool server, HTTP API, relay).
 *
 * @typedef {'local'|'read'|'write'|'destructive'|'unsafe'} OpKind
 * @typedef {{
 *   id: string,                 e.g. "ledger.list"
 *   kind: OpKind,
 *   summary: string,            one line
 *   description?: string,       longer help
 *   input?: {properties?: Record<string, any>, required?: string[]},
 *   positional?: string[],      CLI positional argument names, in order
 *   inputKey?: string,          when set, --input file content goes into this property
 *   examples?: string[],        CLI examples (without the leading "tally")
 *   tier?: 'core'|'extended'|'hatch',
 *   remote?: boolean,           false = never exposed over HTTP / relay
 *   mcp?: boolean,              false = never exposed as a tool
 *   run: (ctx: any, input: any) => Promise<any>
 * }} OpDef
 */

const OPS = new Map();

export function defineOp(def) {
  if (!def.id || !/^[a-z][a-z0-9-]*(\.[a-z][a-z0-9-]*)*$/.test(def.id)) throw new Error(`Bad op id ${def.id}`);
  if (OPS.has(def.id)) throw new Error(`Duplicate op ${def.id}`);
  if (!['local', 'read', 'write', 'destructive', 'unsafe'].includes(def.kind)) throw new Error(`Bad kind for ${def.id}`);
  if (typeof def.run !== 'function') throw new Error(`Op ${def.id} has no run()`);
  OPS.set(def.id, { tier: 'core', remote: true, mcp: true, input: { properties: {} }, examples: [], positional: [], ...def });
  return def;
}

export const getOp = (id) => OPS.get(id);
export const listOps = () => [...OPS.values()].sort((a, b) => a.id.localeCompare(b.id));
export const hasOp = (id) => OPS.has(id);

/** Required level for an op kind. */
export function levelFor(kind) {
  if (kind === 'write') return 'write';
  if (kind === 'destructive' || kind === 'unsafe') return 'destructive';
  return 'read';
}

/** Common parameters shared by write operations. */
export const WRITE_PARAMS = {
  dryRun: { type: 'boolean', description: 'Validate and show what would be sent, without sending anything to Tally.' },
  idempotencyKey: { type: 'string', description: 'Unique key for this write. Repeating a key returns the earlier result instead of posting twice.' },
  forceResend: { type: 'boolean', description: 'Only after checking in Tally that an earlier attempt with this key really did not arrive: send it again.' },
};

export const DESTRUCTIVE_PARAMS = {
  yes: { type: 'boolean', description: 'Confirm a destructive action (delete, cancel, alter).' },
  dryRun: WRITE_PARAMS.dryRun,
};

export const PERIOD_PARAMS = {
  from: { type: 'date', description: 'Start date (YYYY-MM-DD). Default: start of the financial year.' },
  to: { type: 'date', description: 'End date (YYYY-MM-DD). Default: today.' },
  fy: { type: 'string', description: 'Financial year instead of from/to, e.g. 2026-27, current, previous.' },
};
