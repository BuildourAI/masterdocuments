/**
 * Outbound relay: for AI systems hosted in the cloud that cannot reach the office PC.
 * The tool dials out to a hub over HTTPS, pulls signed jobs, runs them locally under the relay
 * front-end's safety ceiling and an allowlist, and posts signed results back. Nothing listens on the PC.
 *
 * Wire protocol (see docs/INTEGRATION.md, examples/relay-hub.mjs):
 *   GET  {hub}/jobs/next?wait=25    -> 204 (none) | 200 {id, op, input, expiresAt, signature}
 *   POST {hub}/jobs/{id}/result     body {id, ok, data | error, meta}
 * Every request from the tool carries X-Relay-Agent, X-Relay-Timestamp, X-Relay-Signature
 * (HMAC-SHA256 over "METHOD\nPATH\nTIMESTAMP\nBODY"). Job signature = HMAC over "id\nop\nexpiresAt\nstableJSON(input)".
 */
import crypto from 'node:crypto';
import http from 'node:http';
import https from 'node:https';
import { invoke } from '../ops/invoke.mjs';
import { stableStringify } from '../core/audit.mjs';
import { TallyCliError } from '../core/errors.mjs';

export const hmac = (secret, text) => crypto.createHmac('sha256', String(secret)).update(text).digest('hex');
export const jobSignature = (secret, job) => hmac(secret, `${job.id}\n${job.op}\n${job.expiresAt}\n${stableStringify(job.input || {})}`);
export const requestSignature = (secret, method, path, ts, body) => hmac(secret, `${method}\n${path}\n${ts}\n${body || ''}`);

function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

/** Glob-like allowlist: "report.*", "ledger.list", "*" */
export function allowed(allow, opId) {
  if (!allow || !allow.length) return false;
  return allow.some((p) => (p.endsWith('*') ? opId.startsWith(p.slice(0, -1)) : p === opId));
}

export function verifyJob(job, { secret, allow, seen, now = Date.now() }) {
  if (!job || typeof job.id !== 'string' || typeof job.op !== 'string') throw new TallyCliError('E_INPUT', 'Malformed job.');
  if (!safeEqual(job.signature || '', jobSignature(secret, job))) throw new TallyCliError('E_POLICY', 'Job signature does not match.');
  if (!job.expiresAt || Date.parse(job.expiresAt) < now) throw new TallyCliError('E_POLICY', 'Job expired.');
  if (seen && seen.has(job.id)) throw new TallyCliError('E_CONFLICT', 'Job already processed.');
  if (!allowed(allow, job.op)) throw new TallyCliError('E_POLICY', `Operation ${job.op} is not in relay.allow.`);
}

function request(urlStr, { method = 'GET', body = '', headers = {}, timeoutMs = 40000 }) {
  const url = new URL(urlStr);
  const lib = url.protocol === 'https:' ? https : http;
  return new Promise((resolve, reject) => {
    const req = lib.request(url, { method, headers: { ...headers, ...(body ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } : {}) }, timeout: timeoutMs }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, text: Buffer.concat(chunks).toString('utf8') }));
    });
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', reject);
    req.end(body || undefined);
  });
}

/**
 * Run the relay loop.
 * @param {{config: any, makeCtx: Function, state: any, log: Function, once?: boolean, signal?: AbortSignal}} opts
 */
export async function runRelay({ config, makeCtx, state, log, once = false, signal }) {
  const r = config.relay;
  if (!r.url || !r.secret) throw new TallyCliError('E_CONFIG', 'relay.url and relay.secret must be set in tally.config.json.', { hint: 'See docs/INTEGRATION.md (Relay).' });
  const hub = new URL(r.url);
  const local = ['localhost', '127.0.0.1', '::1'].includes(hub.hostname);
  if (hub.protocol !== 'https:' && !(local && r.insecureLocalhost)) throw new TallyCliError('E_CONFIG', 'The relay hub must use https:// (plain http is only allowed for localhost testing).');
  const agent = r.agentId || 'tally-relay';
  const allow = r.allow || ['report.*', 'company.*', 'ledger.list', 'ledger.get', 'ledger.search', 'item.list', 'item.get', 'party.*', 'voucher.list', 'voucher.get', 'voucher.find', 'gst.*', 'status'];
  const seen = new Set(state.read('relay-seen.json', []));
  const signed = (method, path, body = '') => {
    const ts = String(Date.now());
    return { 'X-Relay-Agent': agent, 'X-Relay-Timestamp': ts, 'X-Relay-Signature': requestSignature(r.secret, method, path, ts, body) };
  };
  const base = r.url.replace(/\/+$/, '');
  const flushSpool = async () => {
    const spool = state.read('relay-spool.json', []);
    const keep = [];
    for (const item of spool) {
      const path = `${hub.pathname.replace(/\/+$/, '')}/jobs/${encodeURIComponent(item.id)}/result`;
      const body = JSON.stringify(item);
      try {
        const res = await request(`${base}/jobs/${encodeURIComponent(item.id)}/result`, { method: 'POST', body, headers: signed('POST', path, body) });
        if (res.status < 200 || res.status >= 300) keep.push(item);
      } catch {
        keep.push(item);
      }
    }
    state.write('relay-spool.json', keep);
    return keep.length;
  };
  let backoff = 1000;
  log(`relay: polling ${base} as "${agent}"; allowed: ${allow.join(', ')}`);
  for (;;) {
    if (signal?.aborted) return;
    await flushSpool();
    const path = `${hub.pathname.replace(/\/+$/, '')}/jobs/next`;
    let res;
    try {
      res = await request(`${base}/jobs/next?wait=25`, { headers: signed('GET', path) });
      backoff = 1000;
    } catch (err) {
      log(`relay: hub unreachable (${err.message}); retrying in ${backoff / 1000}s`);
      await new Promise((ok) => setTimeout(ok, backoff));
      backoff = Math.min(backoff * 2, 60000);
      if (once) return;
      continue;
    }
    if (res.status === 200) {
      let job;
      let result;
      try {
        job = JSON.parse(res.text);
        verifyJob(job, { secret: r.secret, allow, seen });
        const ctx = makeCtx();
        const out = await invoke(job.op, job.input || {}, ctx);
        result = { id: job.id, ...out };
        log(`relay: ${job.id} ${job.op} -> ${out.ok ? 'ok' : out.error.code}`);
      } catch (err) {
        result = { id: job?.id || 'unknown', ok: false, error: { code: err.code || 'E_INTERNAL', message: err.message } };
        log(`relay: rejected job ${job?.id}: ${err.message}`);
      }
      if (job?.id) {
        seen.add(job.id);
        state.write('relay-seen.json', [...seen].slice(-5000));
        state.update('relay-spool.json', (s) => [...(Array.isArray(s) ? s : []), result], []);
        await flushSpool();
      }
    } else if (res.status !== 204) {
      log(`relay: hub answered ${res.status}: ${res.text.slice(0, 200)}`);
      await new Promise((ok) => setTimeout(ok, Math.min(backoff, 10000)));
    }
    if (once) return;
    if (r.pollMs && res.status === 204) await new Promise((ok) => setTimeout(ok, r.pollMs));
  }
}
