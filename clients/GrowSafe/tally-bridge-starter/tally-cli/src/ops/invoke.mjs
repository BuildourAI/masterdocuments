/**
 * The single pipeline every operation call goes through, whatever the front-end:
 * lookup -> input validation -> front-end ceiling -> handler (which applies write policy) -> envelope.
 */
import { getOp, levelFor } from './registry.mjs';
import { validateInput } from './schema.mjs';
import { asCliError, TallyCliError, suggest } from '../core/errors.mjs';
import { listOps } from './registry.mjs';

/**
 * @returns {Promise<{ok: true, data: any, meta: object} | {ok: false, error: object, meta: object}>}
 */
export async function invoke(opId, input, ctx, { fromCli = false } = {}) {
  const started = Date.now();
  const meta = { op: opId, profile: ctx.profileName, company: ctx.profile?.company || null, frontend: ctx.frontend };
  try {
    const op = getOp(opId);
    if (!op) {
      const s = suggest(opId, listOps().map((o) => o.id), 3);
      throw new TallyCliError('E_USAGE', `Unknown operation "${opId}".`, { hint: s.length ? `Did you mean: ${s.join(', ')}?` : 'Run "tally ops" for the list.' });
    }
    if (ctx.frontend !== 'cli' && op.kind === 'unsafe') throw new TallyCliError('E_POLICY', `${opId} is only available on the command line.`);
    if ((ctx.frontend === 'http' || ctx.frontend === 'relay') && op.remote === false) throw new TallyCliError('E_POLICY', `${opId} is not available over ${ctx.frontend}.`);
    const clean = validateInput(op, input, { fromCli });
    if (ctx.frontend !== 'cli') {
      for (const [k, schema] of Object.entries(op.input?.properties || {})) {
        if (schema.localPath && clean[k] !== undefined && clean[k] !== '-') throw new TallyCliError('E_POLICY', `"${k}" (a file or folder on this PC) can only be used from the command line.`, { hint: 'Pass the content inline where the operation allows it (for example statementText).' });
      }
    }
    ctx.policy.assertLevel(levelFor(op.kind), opId);
    if (op.kind === 'destructive' && !clean.dryRun) ctx.policy.assertDestructive(opId, clean);
    const data = await op.run(ctx, clean);
    meta.ms = Date.now() - started;
    const stats = ctx.clientStats;
    if (stats && stats.requests) meta.tally = { requests: stats.requests, ms: stats.ms };
    if (ctx.warnings.length) meta.warnings = [...ctx.warnings];
    return { ok: true, data: data === undefined ? null : data, meta };
  } catch (err) {
    const e = asCliError(err);
    meta.ms = Date.now() - started;
    if (ctx.warnings.length) meta.warnings = [...ctx.warnings];
    const out = { ok: false, error: e.toJSON(), meta };
    Object.defineProperty(out, 'exitCode', { value: e.exitCode, enumerable: false });
    Object.defineProperty(out, 'stack', { value: e.stack, enumerable: false });
    return out;
  }
}
