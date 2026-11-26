/**
 * Help text generated from the registry.
 */
import { listOps, getOp } from '../ops/registry.mjs';
import { GLOBAL_FLAGS, camelToKebab } from './args.mjs';

const AREAS = [
  ['Setup', ['init', 'doctor', 'status', 'selftest', 'config', 'ops', 'explain', 'integrate', 'simulate', 'token']],
  ['Company', ['company']],
  ['Masters', ['ledger', 'group', 'item', 'stock-group', 'stock-category', 'unit', 'godown', 'cost-centre', 'cost-category', 'voucher-type', 'currency', 'master']],
  ['Parties', ['party']],
  ['Vouchers and data entry', ['voucher', 'post']],
  ['Reports', ['report']],
  ['GST and banking', ['gst', 'bank']],
  ['Bulk, sync and change feed', ['import', 'export', 'changes', 'sync', 'watch']],
  ['Records', ['audit']],
  ['Anything else', ['query', 'raw', 'xml']],
  ['For AI systems', ['mcp', 'serve', 'relay']],
];

export function mainHelp(version) {
  const ops = listOps();
  const byArea = new Map();
  for (const op of ops) {
    const area = op.id.split('.')[0];
    if (!byArea.has(area)) byArea.set(area, []);
    byArea.get(area).push(op);
  }
  let s = `tally ${version}: connect AI systems and scripts to Tally (TallyPrime / Tally.ERP 9)\n\n`;
  s += 'Usage: tally <area> <action> [arguments] [--options]\n\n';
  for (const [title, areas] of AREAS) {
    const lines = [];
    for (const a of areas) {
      const list = byArea.get(a);
      if (!list) continue;
      const actions = list.map((o) => o.id.split('.').slice(1).join(' ') || '').filter(Boolean);
      lines.push(`  ${a.padEnd(15)} ${actions.length ? actions.join(', ') : list[0].summary}`);
      byArea.delete(a);
    }
    if (lines.length) s += `${title}\n${lines.join('\n')}\n\n`;
  }
  for (const [a, list] of byArea) s += `  ${a.padEnd(15)} ${list.map((o) => o.id.split('.').slice(1).join(' ')).join(', ')}\n`;
  s += 'Run "tally <area> --help" or "tally <area> <action> --help" for details. "tally ops --json" lists everything for programs.\n';
  s += 'Start here: "tally doctor" checks the connection to Tally; "tally init" sets up a profile.\n';
  return s;
}

export function areaHelp(area) {
  const ops = listOps().filter((o) => o.id === area || o.id.startsWith(area + '.'));
  if (!ops.length) return null;
  let s = `tally ${area}\n\n`;
  for (const op of ops) s += `  ${op.id.split('.').join(' ').padEnd(34)} ${op.summary}\n`;
  return s + `\nRun "tally ${area} <action> --help" for options.\n`;
}

export function opHelp(id) {
  const op = getOp(id);
  if (!op) return null;
  const words = op.id.split('.').join(' ');
  const pos = (op.positional || []).map((p) => `<${camelToKebab(p)}>`).join(' ');
  let s = `tally ${words}${pos ? ' ' + pos : ''} [options]\n\n${op.summary}\n`;
  if (op.description) s += `\n${op.description}\n`;
  s += `\nAccess: ${op.kind}${op.kind === 'write' ? ' (needs writes enabled in the profile)' : op.kind === 'destructive' ? ' (needs allowDestructive and --yes)' : ''}\n`;
  const props = op.input?.properties || {};
  const req = new Set(op.input?.required || []);
  if (Object.keys(props).length) {
    s += '\nOptions:\n';
    for (const [k, v] of Object.entries(props)) {
      const type = v.type === 'boolean' ? '' : ` <${v.enum ? v.enum.join('|') : v.type || 'value'}>`;
      s += `  --${camelToKebab(k)}${type}${req.has(k) ? ' (required)' : ''}\n      ${v.description || ''}${v.default !== undefined ? ` Default: ${JSON.stringify(v.default)}.` : ''}\n`;
    }
  }
  if (op.inputKey !== undefined || Object.values(props).some((p) => p.type === 'object' || p.type === 'array')) {
    s += `\nComplex input: put it in a JSON file and pass --input file.json${op.inputKey ? ` (the file becomes "${op.inputKey}")` : ' (keys as in the options above)'}.\n`;
  }
  if (op.examples?.length) s += `\nExamples:\n${op.examples.map((e) => `  tally ${e}`).join('\n')}\n`;
  s += `\nGlobal options: ${Object.keys(GLOBAL_FLAGS)
    .map((k) => '--' + camelToKebab(k))
    .join(' ')}\n`;
  return s;
}
