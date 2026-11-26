/**
 * MCP tool server over stdio (JSON-RPC 2.0, one message per line).
 * Works with both protocol eras:
 *   legacy  (2024-11-05 ... 2025-11-25): initialize / notifications/initialized / ping / tools/list / tools/call
 *   modern  (2026-07-28): stateless; every request carries _meta["io.modelcontextprotocol/protocolVersion"];
 *           server/discover; results carry resultType, list results carry ttlMs and cacheScope.
 * stdout carries protocol messages only; logs go to stderr. Tally is not contacted until a tool is called.
 */
import readline from 'node:readline';
import { listOps, getOp, levelFor } from '../ops/registry.mjs';
import { toJsonSchema } from '../ops/schema.mjs';
import { invoke } from '../ops/invoke.mjs';
import { levelAllows } from '../core/config.mjs';

export const LEGACY_VERSIONS = ['2025-11-25', '2025-06-18', '2025-03-26', '2024-11-05'];
export const MODERN_VERSIONS = ['2026-07-28'];
const META_VERSION = 'io.modelcontextprotocol/protocolVersion';

export const toolName = (id) => id.replace(/[.-]/g, '_');

const INSTRUCTIONS = [
  'Tools for reading and writing a Tally company (Indian accounting software).',
  'Amounts are always positive; the side is given by "debit"/"credit" (or Dr/Cr in balances). Dates are YYYY-MM-DD.',
  'Names must match Tally exactly: use ledger_search / item_search first. Reads are safe. Writes are validated; pass dryRun: true to preview and idempotencyKey to avoid duplicates.',
  'Before posting a receipt or payment, call party_bills to see which bills to settle. Never invent prices or rates.',
].join(' ');

/** Build the tool list for a context (respecting the front-end ceiling and toolset). */
export function buildTools(ctx, toolset = 'core') {
  const ceiling = ctx.policy.ceiling;
  const tools = [];
  for (const op of listOps()) {
    if (op.mcp === false || op.kind === 'unsafe') continue;
    if (!levelAllows(ceiling, levelFor(op.kind))) continue;
    if (toolset === 'core' && op.tier !== 'core') continue;
    tools.push(toolFor(op));
  }
  tools.push({
    name: 'tally_ops_find',
    description: 'Search all available Tally operations (including ones not listed as tools) by keyword. Returns ids, summaries and input schemas; run them with tally_run_read or tally_run_write.',
    inputSchema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'], additionalProperties: false },
    annotations: { readOnlyHint: true, openWorldHint: false },
  });
  tools.push({
    name: 'tally_run_read',
    description: 'Run any read-only Tally operation by id (from tally_ops_find) with its input object.',
    inputSchema: { type: 'object', properties: { op: { type: 'string' }, input: { type: 'object' } }, required: ['op'], additionalProperties: false },
    annotations: { readOnlyHint: true, openWorldHint: false },
  });
  if (levelAllows(ceiling, 'write')) {
    tools.push({
      name: 'tally_run_write',
      description: 'Run any Tally operation that writes (by id from tally_ops_find). Subject to the same safety rules; use dryRun first.',
      inputSchema: { type: 'object', properties: { op: { type: 'string' }, input: { type: 'object' } }, required: ['op'], additionalProperties: false },
      annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: false },
    });
  }
  return tools;
}

function toolFor(op) {
  const examples = op.examples?.length ? `\nCLI equivalent: tally ${op.examples[0]}` : '';
  return {
    name: toolName(op.id),
    description: `${op.summary}${op.description ? '\n' + op.description : ''}${examples}`.slice(0, 1800),
    inputSchema: toJsonSchema(op),
    annotations: {
      title: op.id,
      readOnlyHint: op.kind === 'read' || op.kind === 'local',
      destructiveHint: op.kind === 'destructive',
      idempotentHint: op.kind === 'read' || op.kind === 'local',
      openWorldHint: false,
    },
  };
}

/** Cap a result for the model's context; rows are trimmed with a note. */
export function capText(data, maxChars) {
  let text = JSON.stringify(data);
  if (text.length <= maxChars) return text;
  const rowsKey = data && typeof data === 'object' && !Array.isArray(data) ? Object.keys(data).find((k) => Array.isArray(data[k]) && data[k].length > 5) : null;
  const arr = Array.isArray(data) ? data : rowsKey ? data[rowsKey] : null;
  if (arr) {
    let n = arr.length;
    while (n > 1) {
      n = Math.floor(n * 0.7);
      const slice = arr.slice(0, n);
      const out = Array.isArray(data) ? { rows: slice } : { ...data, [rowsKey]: slice };
      out.truncated = { shown: n, total: arr.length, hint: 'Result shortened. Narrow it with filters (party, period, limit) or use the CLI/HTTP API for the full data.' };
      text = JSON.stringify(out);
      if (text.length <= maxChars) return text;
    }
  }
  return text.slice(0, maxChars) + '... [truncated]';
}

/**
 * Handle one JSON-RPC message. Returns a response object, or null for notifications.
 * @param {object} msg
 * @param {{makeCtx: () => any, toolset: string, maxChars: number, version: string, state: {legacyVersion?: string}}} env
 */
export async function handleMessage(msg, env) {
  const { id, method, params } = msg || {};
  const isNotification = id === undefined || id === null;
  const reply = (result) => (isNotification ? null : { jsonrpc: '2.0', id, result });
  const fail = (code, message, data) => (isNotification ? null : { jsonrpc: '2.0', id, error: { code, message, ...(data ? { data } : {}) } });
  if (!msg || msg.jsonrpc !== '2.0' || typeof method !== 'string') return fail(-32600, 'Invalid Request');

  const requested = params?._meta?.[META_VERSION];
  const modern = !!requested;
  if (modern && !MODERN_VERSIONS.includes(requested) && !LEGACY_VERSIONS.includes(requested)) {
    return fail(-32022, 'Unsupported protocol version', { supported: [...MODERN_VERSIONS, ...LEGACY_VERSIONS], requested });
  }
  const serverInfo = { name: 'tally-cli', version: env.version };
  const decorate = (result, cacheable = false) => {
    if (!modern) return result;
    const out = { resultType: 'complete', ...result, _meta: { ...(result._meta || {}), 'io.modelcontextprotocol/serverInfo': serverInfo } };
    if (cacheable) {
      out.ttlMs = 300000;
      out.cacheScope = 'private';
    }
    return out;
  };

  switch (method) {
    case 'initialize': {
      const v = params?.protocolVersion;
      const chosen = LEGACY_VERSIONS.includes(v) ? v : LEGACY_VERSIONS[0];
      env.state.legacyVersion = chosen;
      return reply({ protocolVersion: chosen, capabilities: { tools: { listChanged: false } }, serverInfo, instructions: INSTRUCTIONS });
    }
    case 'notifications/initialized':
    case 'notifications/cancelled':
      return null;
    case 'ping':
      return reply({});
    case 'server/discover':
      return reply(decorate({ supportedVersions: [...MODERN_VERSIONS, ...LEGACY_VERSIONS], capabilities: { tools: {} }, instructions: INSTRUCTIONS }, true));
    case 'tools/list': {
      const ctx = env.makeCtx();
      return reply(decorate({ tools: buildTools(ctx, env.toolset) }, true));
    }
    case 'tools/call': {
      const name = params?.name;
      const args = params?.arguments || {};
      const ctx = env.makeCtx();
      let opId;
      let input = args;
      if (!buildTools(ctx, 'all').some((t) => t.name === name)) return fail(-32602, `Unknown tool: ${name}`);
      if (name === 'tally_ops_find') {
        const q = String(args.query || '').toLowerCase();
        const words = q.split(/\s+/).filter(Boolean);
        const found = listOps()
          .filter((o) => o.mcp !== false && o.kind !== 'unsafe')
          .filter((o) => words.every((w) => `${o.id} ${o.summary} ${o.description || ''}`.toLowerCase().includes(w)))
          .slice(0, 25)
          .map((o) => ({ op: o.id, kind: o.kind, summary: o.summary, input: toJsonSchema(o) }));
        return reply(decorate({ content: [{ type: 'text', text: capText(found, env.maxChars) }], isError: false }));
      }
      if (name === 'tally_run_read' || name === 'tally_run_write') {
        opId = String(args.op || '');
        input = args.input || {};
        const op = getOp(opId);
        if (op && op.mcp === false) return reply(decorate({ content: [{ type: 'text', text: JSON.stringify({ code: 'E_POLICY', message: `${opId} is not available as a tool.` }) }], isError: true }));
        if (op && name === 'tally_run_read' && !['read', 'local'].includes(op.kind)) {
          return reply(decorate({ content: [{ type: 'text', text: JSON.stringify({ code: 'E_POLICY', message: `${opId} writes; call it with tally_run_write.` }) }], isError: true }));
        }
      } else {
        const op = listOps().find((o) => toolName(o.id) === name);
        if (!op) return fail(-32602, `Unknown tool: ${name}`);
        if (op.mcp === false) return fail(-32602, `Tool ${name} is not available.`);
        opId = op.id;
      }
      const env2 = await invoke(opId, input, ctx);
      const payload = env2.ok ? { data: env2.data, ...(env2.meta.warnings ? { warnings: env2.meta.warnings } : {}) } : { error: env2.error };
      return reply(decorate({ content: [{ type: 'text', text: capText(env2.ok ? payload : payload.error, env.maxChars) }], isError: !env2.ok }));
    }
    case 'resources/list':
      return reply(decorate({ resources: [] }, true));
    case 'prompts/list':
      return reply(decorate({ prompts: [] }, true));
    default:
      return fail(-32601, `Method not found: ${method}`);
  }
}

/** Run the stdio loop until stdin closes. */
export function serveStdio({ makeCtx, toolset = 'core', maxChars = 40000, version = '0.0.0', input = process.stdin, output = process.stdout, log = (m) => process.stderr.write(`[tally mcp] ${m}\n`) }) {
  const env = { makeCtx, toolset, maxChars, version, state: {} };
  const rl = readline.createInterface({ input, crlfDelay: Infinity });
  let pending = Promise.resolve();
  log(`ready (toolset ${toolset})`);
  rl.on('line', (line) => {
    const text = line.trim();
    if (!text) return;
    pending = pending.then(async () => {
      let msg;
      try {
        msg = JSON.parse(text);
      } catch {
        output.write(JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }) + '\n');
        return;
      }
      const batch = Array.isArray(msg) ? msg : [msg];
      const responses = [];
      for (const m of batch) {
        try {
          const r = await handleMessage(m, env);
          if (r) responses.push(r);
        } catch (err) {
          log(`error: ${err.stack || err.message}`);
          if (m && m.id !== undefined && m.id !== null) responses.push({ jsonrpc: '2.0', id: m.id, error: { code: -32603, message: err.message } });
        }
      }
      if (!responses.length) return;
      output.write(JSON.stringify(Array.isArray(msg) ? responses : responses[0]) + '\n');
    });
  });
  return new Promise((resolve) => {
    rl.on('close', () => {
      pending.then(() => {
        log('stdin closed; exiting');
        resolve();
      });
    });
  });
}
