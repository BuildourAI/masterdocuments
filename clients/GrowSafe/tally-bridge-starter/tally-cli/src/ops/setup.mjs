/**
 * Setup and introspection: ops catalogue, config, doctor, status, explain.
 */
import { defineOp, listOps, levelFor } from './registry.mjs';
import { toJsonSchema } from './schema.mjs';
import { runDoctor } from '../domain/doctor.mjs';
import { targetCompany } from '../domain/company.mjs';
import { KNOWN_MESSAGES, explainTallyMessage } from '../core/explain.mjs';
import { ASSUMPTIONS, loadCapabilities } from '../core/capabilities.mjs';
import { camelToKebab } from '../cli/args.mjs';

defineOp({
  id: 'ops',
  kind: 'local',
  summary: 'List every operation with its parameters (machine-readable with --json, Markdown with --markdown).',
  input: {
    properties: {
      markdown: { type: 'boolean', description: 'Render as Markdown (used to generate docs/COMMANDS.md).' },
      tier: { type: 'string', enum: ['core', 'extended', 'hatch'], description: 'Only operations of this tier.' },
      kind: { type: 'string', enum: ['local', 'read', 'write', 'destructive', 'unsafe'] },
      search: { type: 'string', description: 'Only operations whose id or summary contains this text.' },
    },
  },
  examples: ['ops --json', 'ops --kind write', 'ops --markdown --out docs/COMMANDS.md'],
  mcp: false,
  run: async (ctx, i) => {
    let ops = listOps();
    if (i.tier) ops = ops.filter((o) => o.tier === i.tier);
    if (i.kind) ops = ops.filter((o) => o.kind === i.kind);
    if (i.search) ops = ops.filter((o) => (o.id + ' ' + o.summary).toLowerCase().includes(i.search.toLowerCase()));
    if (i.markdown) return { __raw: commandsMarkdown(ops) };
    return ops.map((o) => ({ id: o.id, command: `tally ${o.id.split('.').join(' ')}`, kind: o.kind, access: levelFor(o.kind), tier: o.tier, summary: o.summary, positional: o.positional, input: toJsonSchema(o), examples: o.examples.map((e) => `tally ${e}`) }));
  },
});

export function commandsMarkdown(ops) {
  let s = '# Command reference\n\nGenerated from the operation registry by `tally ops --markdown`. Do not edit by hand.\n\n';
  s += 'Every command is also available as a tool (`tally mcp`) and over the local HTTP API (`tally serve`), subject to the access ceiling of that front-end. Access levels: `local` (no Tally), `read`, `write` (needs writes enabled), `destructive` (alter/cancel/delete: needs allowDestructive and `--yes`), `unsafe` (command line only).\n\n';
  const groups = new Map();
  for (const o of ops) {
    const g = o.id.split('.')[0];
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(o);
  }
  s += '## Contents\n\n' + [...groups.keys()].map((g) => `- [${g}](#${g})`).join('\n') + '\n\n';
  for (const [g, list] of groups) {
    s += `## ${g}\n\n`;
    for (const o of list) {
      const pos = (o.positional || []).map((p) => `<${camelToKebab(p)}>`).join(' ');
      s += `### \`tally ${o.id.split('.').join(' ')}${pos ? ' ' + pos : ''}\`\n\n${o.summary}\n\n`;
      if (o.description) s += `${o.description}\n\n`;
      s += `Access: \`${o.kind}\`. Tool name: \`${o.id.replace(/[.-]/g, '_')}\`.\n\n`;
      const props = o.input?.properties || {};
      const req = new Set(o.input?.required || []);
      if (Object.keys(props).length) {
        s += '| Option | Type | Description |\n|---|---|---|\n';
        for (const [k, v] of Object.entries(props)) {
          const type = v.enum ? v.enum.join(' \\| ') : v.type || 'any';
          s += `| \`--${camelToKebab(k)}\`${req.has(k) ? ' (required)' : ''} | ${type} | ${(v.description || '').replace(/\|/g, '\\|')}${v.default !== undefined ? ` Default \`${JSON.stringify(v.default)}\`.` : ''} |\n`;
        }
        s += '\n';
      }
      if (o.examples?.length) s += '```bash\n' + o.examples.map((e) => `tally ${e}`).join('\n') + '\n```\n\n';
    }
  }
  return s;
}

defineOp({
  id: 'config.show',
  kind: 'local',
  summary: 'Show the effective configuration (profile, connection, safety settings) and where it came from.',
  examples: ['config show'],
  mcp: false,
  run: async (ctx) => ({
    file: ctx.config.file,
    exists: ctx.config.exists,
    stateDir: ctx.config.stateDir,
    profile: ctx.profileName,
    profiles: Object.keys(ctx.config.raw.profiles || {}),
    settings: ctx.profile,
    http: { ...ctx.config.http, tokens: (ctx.config.http.tokens || []).map((t) => ({ id: t.id, scope: t.scope })) },
    relay: { ...ctx.config.relay, secret: ctx.config.relay.secret ? '(set)' : null },
  }),
});

defineOp({
  id: 'doctor',
  kind: 'read',
  summary: 'Check the connection to Tally step by step and say how to fix each problem.',
  input: { properties: { network: { type: 'boolean', default: true, description: 'Also check whether Tally\'s port is exposed on the network.' } } },
  examples: ['doctor', 'doctor --url http://192.168.1.20:9000'],
  run: (ctx, i) => runDoctor(ctx, i),
});

defineOp({
  id: 'status',
  kind: 'read',
  summary: 'One-line health: reachable, target company, change counters, write mode.',
  examples: ['status'],
  run: async (ctx) => {
    const c = await targetCompany(ctx);
    return { reachable: true, url: ctx.transport.url, company: c.name, altMstId: c.altMstId, altVchId: c.altVchId, writeMode: ctx.profile.writeMode, profile: ctx.profileName };
  },
});

defineOp({
  id: 'explain',
  kind: 'local',
  summary: 'Explain a Tally error message and what to do about it (or list known messages).',
  input: { properties: { message: { type: 'string', description: 'The error text from Tally.' } } },
  positional: ['message'],
  examples: ['explain "Voucher totals do not match! Dr: 100.00 Dr Cr: 90.00 Cr"'],
  run: async (ctx, i) => {
    if (!i.message) return KNOWN_MESSAGES.map((k) => ({ id: k.id, meaning: k.meaning, remedy: k.remedy }));
    const k = explainTallyMessage(i.message);
    return k ? { matched: k.id, meaning: k.meaning, remedy: k.remedy } : { matched: null, meaning: 'Not a known message.', remedy: 'Run the same command with --verbose --record <folder> and inspect the request and reply files.' };
  },
});

defineOp({
  id: 'capabilities',
  kind: 'local',
  summary: 'Show assumptions about this Tally (defaults, and results from the last selftest).',
  examples: ['capabilities'],
  run: async (ctx) => {
    const caps = loadCapabilities(ctx.state, ctx.scope);
    const saved = ctx.state.read('capabilities.json', {})[ctx.scope];
    return { testedAt: saved?.at || null, rows: ASSUMPTIONS.map((a) => ({ id: a.id, value: caps[a.id], default: a.default, describe: a.describe })) };
  },
});
