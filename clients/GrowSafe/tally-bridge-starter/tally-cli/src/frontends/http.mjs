/**
 * Local HTTP API for automation tools (n8n, Make, backends).
 *   GET  /health                 no auth, no data
 *   GET  /v1/ops                 catalogue of operations available to the token's scope
 *   POST /v1/ops/<op.id>         run an operation; JSON body = input; reply = {ok, data, meta} | {ok:false, error}
 * Security: binds to 127.0.0.1 by default; every /v1 call needs "Authorization: Bearer <token>"
 * (tokens are stored hashed); scopes read < write < destructive; browser-origin requests and unexpected
 * Host headers are refused (DNS rebinding); body size and queue length are capped.
 */
import http from 'node:http';
import crypto from 'node:crypto';
import { listOps, getOp, levelFor } from '../ops/registry.mjs';
import { toJsonSchema } from '../ops/schema.mjs';
import { invoke } from '../ops/invoke.mjs';
import { levelAllows } from '../core/config.mjs';

const json = (res, status, body) => {
  const text = JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(text), 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(text);
};

export function findToken(tokens, header) {
  const m = /^Bearer\s+(\S+)$/i.exec(header || '');
  if (!m) return null;
  const hash = crypto.createHash('sha256').update(m[1]).digest();
  for (const t of tokens || []) {
    if (!t.hash) continue;
    const stored = Buffer.from(t.hash, 'hex');
    if (stored.length === hash.length && crypto.timingSafeEqual(stored, hash)) return t;
  }
  return null;
}

/**
 * @param {{makeCtx: (token: object) => any, config: object, log?: Function}} opts
 */
export function createHttpServer({ makeCtx, config, log = () => {} }) {
  const httpCfg = config.http;
  const maxBody = httpCfg.maxBodyBytes || 2_000_000;
  const maxQueue = httpCfg.maxQueue || 20;
  let inFlight = 0;
  const allowedHosts = () => {
    const port = server.address()?.port || httpCfg.port;
    return new Set([`${httpCfg.host}:${port}`, `localhost:${port}`, `127.0.0.1:${port}`, `[::1]:${port}`, ...(httpCfg.allowHosts || [])].map((h) => h.toLowerCase()));
  };

  const server = http.createServer(async (req, res) => {
    const started = Date.now();
    const url = new URL(req.url, 'http://local');
    try {
      if (req.headers.origin) return json(res, 403, { ok: false, error: { code: 'E_POLICY', message: 'Browser-origin requests are not accepted.' } });
      const host = String(req.headers.host || '').toLowerCase();
      if (host && !allowedHosts().has(host) && !httpCfg.anyHost) return json(res, 421, { ok: false, error: { code: 'E_POLICY', message: `Unexpected Host header "${host}".`, hint: 'Add it to http.allowHosts in tally.config.json if this is intended (e.g. behind a tunnel).' } });
      if (url.pathname === '/health') return json(res, 200, { ok: true, service: 'tally-cli' });
      if (!url.pathname.startsWith('/v1/')) return json(res, 404, { ok: false, error: { code: 'E_NOT_FOUND', message: 'Not found.' } });
      const token = findToken(httpCfg.tokens, req.headers.authorization);
      if (!token) return json(res, 401, { ok: false, error: { code: 'E_POLICY', message: 'Missing or invalid token.', hint: 'Create one with "tally token create <name> --scope read" and send "Authorization: Bearer <token>".' } });
      const scope = token.scope || 'read';
      if (req.method === 'GET' && url.pathname === '/v1/ops') {
        const ops = listOps().filter((o) => o.remote !== false && o.kind !== 'unsafe' && levelAllows(scope, levelFor(o.kind)));
        return json(res, 200, { ok: true, data: ops.map((o) => ({ id: o.id, kind: o.kind, summary: o.summary, input: toJsonSchema(o) })) });
      }
      const m = /^\/v1\/ops\/([a-z0-9.-]+)$/.exec(url.pathname);
      if (!m) return json(res, 404, { ok: false, error: { code: 'E_NOT_FOUND', message: 'Not found.' } });
      if (req.method !== 'POST') return json(res, 405, { ok: false, error: { code: 'E_USAGE', message: 'Use POST with a JSON body.' } });
      if (!/application\/json/i.test(req.headers['content-type'] || '')) return json(res, 415, { ok: false, error: { code: 'E_USAGE', message: 'Content-Type must be application/json.' } });
      const op = getOp(m[1]);
      if (!op || op.remote === false || op.kind === 'unsafe') return json(res, 404, { ok: false, error: { code: 'E_NOT_FOUND', message: `Operation ${m[1]} is not available over HTTP.` } });
      if (!levelAllows(scope, levelFor(op.kind))) return json(res, 403, { ok: false, error: { code: 'E_POLICY', message: `Token scope "${scope}" does not allow ${op.id} (${levelFor(op.kind)}).` } });
      if (inFlight >= maxQueue) return json(res, 429, { ok: false, error: { code: 'E_LOCKED', message: 'Too many requests queued; retry shortly.' } });
      const body = await readBody(req, maxBody);
      let input = {};
      if (body.trim()) {
        try {
          input = JSON.parse(body);
        } catch {
          return json(res, 400, { ok: false, error: { code: 'E_INPUT', message: 'Body is not valid JSON.' } });
        }
      }
      inFlight++;
      try {
        const ctx = makeCtx(token);
        const out = await invoke(op.id, input, ctx);
        log(`${req.method} ${url.pathname} token=${token.name || token.id} -> ${out.ok ? 'ok' : out.error.code} ${Date.now() - started}ms`);
        return json(res, out.ok ? 200 : statusFor(out.error.code), out);
      } finally {
        inFlight--;
      }
    } catch (err) {
      if (err.code === 'E_TOO_LARGE') return json(res, 413, { ok: false, error: { code: 'E_INPUT', message: err.message } });
      log(`error: ${err.stack || err.message}`);
      return json(res, 500, { ok: false, error: { code: 'E_INTERNAL', message: err.message } });
    }
  });
  server.requestTimeout = 15 * 60 * 1000;
  return server;
}

function statusFor(code) {
  return { E_INPUT: 400, E_VALIDATION: 422, E_USAGE: 400, E_POLICY: 403, E_NOT_FOUND: 404, E_CONFLICT: 409, E_CONNECT: 502, E_TIMEOUT: 504, E_TALLY: 502, E_INDETERMINATE: 504, E_LOCKED: 503 }[code] || 500;
}

function readBody(req, max) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > max) {
        const e = new Error(`Body larger than ${max} bytes.`);
        e.code = 'E_TOO_LARGE';
        req.destroy();
        reject(e);
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}
