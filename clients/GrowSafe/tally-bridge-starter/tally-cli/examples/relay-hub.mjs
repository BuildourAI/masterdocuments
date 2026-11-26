#!/usr/bin/env node
/**
 * Reference relay hub (for testing and as a starting point). In production, put this behind HTTPS.
 *
 * The cloud AI system:
 *   POST /enqueue        {"op": "report.receivables", "input": {...}}   -> {"id": "..."}       (Authorization: Bearer <secret>)
 *   GET  /jobs/<id>                                                      -> {"status": "pending"|"done", "result": {...}}
 * The office PC ("tally relay"):
 *   GET  /jobs/next?wait=25       long-poll for the next job (signed request)
 *   POST /jobs/<id>/result        deliver the result (signed request)
 *
 * Usage: RELAY_SECRET=change-me node examples/relay-hub.mjs [port]
 */
import http from 'node:http';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';

const stable = (v) => (v === null || typeof v !== 'object' ? JSON.stringify(v) : Array.isArray(v) ? `[${v.map(stable).join(',')}]` : `{${Object.keys(v).filter((k) => v[k] !== undefined).sort().map((k) => `${JSON.stringify(k)}:${stable(v[k])}`).join(',')}}`);
const hmac = (secret, text) => crypto.createHmac('sha256', secret).update(text).digest('hex');

export function createHub({ secret, jobTtlMs = 10 * 60 * 1000, log = () => {} }) {
  const queue = [];
  const jobs = new Map();
  const waiters = [];
  const send = (res, status, body) => {
    const t = body === undefined ? '' : JSON.stringify(body);
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(t);
  };
  const verifyAgent = (req, body) => {
    const ts = req.headers['x-relay-timestamp'];
    const sig = req.headers['x-relay-signature'];
    if (!ts || !sig || Math.abs(Date.now() - Number(ts)) > 5 * 60 * 1000) return false;
    const path = new URL(req.url, 'http://x').pathname;
    const want = hmac(secret, `${req.method}\n${path}\n${ts}\n${body || ''}`);
    return want.length === sig.length && crypto.timingSafeEqual(Buffer.from(want), Buffer.from(sig));
  };
  const deliverNext = () => {
    while (waiters.length && queue.length) {
      const { res, timer } = waiters.shift();
      clearTimeout(timer);
      send(res, 200, queue.shift());
    }
  };
  return http.createServer((req, res) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const body = Buffer.concat(chunks).toString('utf8');
      const url = new URL(req.url, 'http://x');
      if (req.method === 'POST' && url.pathname === '/enqueue') {
        if (req.headers.authorization !== `Bearer ${secret}`) return send(res, 401, { error: 'unauthorised' });
        let data;
        try {
          data = JSON.parse(body);
        } catch {
          return send(res, 400, { error: 'bad json' });
        }
        const job = { id: crypto.randomUUID(), op: String(data.op), input: data.input || {}, expiresAt: new Date(Date.now() + jobTtlMs).toISOString() };
        job.signature = hmac(secret, `${job.id}\n${job.op}\n${job.expiresAt}\n${stable(job.input)}`);
        jobs.set(job.id, { status: 'pending', op: job.op });
        queue.push(job);
        log(`enqueued ${job.id} ${job.op}`);
        deliverNext();
        return send(res, 200, { id: job.id });
      }
      const status = /^\/jobs\/([^/]+)$/.exec(url.pathname);
      if (req.method === 'GET' && status && status[1] !== 'next') {
        if (req.headers.authorization !== `Bearer ${secret}`) return send(res, 401, { error: 'unauthorised' });
        const j = jobs.get(status[1]);
        return j ? send(res, 200, j) : send(res, 404, { error: 'unknown job' });
      }
      if (req.method === 'GET' && url.pathname === '/jobs/next') {
        if (!verifyAgent(req, '')) return send(res, 401, { error: 'bad signature' });
        if (queue.length) return send(res, 200, queue.shift());
        const wait = Math.min(Number(url.searchParams.get('wait') || 25), 30) * 1000;
        const entry = { res, timer: null };
        entry.timer = setTimeout(() => {
          const i = waiters.indexOf(entry);
          if (i >= 0) waiters.splice(i, 1);
          send(res, 204);
        }, wait);
        waiters.push(entry);
        return undefined;
      }
      const result = /^\/jobs\/([^/]+)\/result$/.exec(url.pathname);
      if (req.method === 'POST' && result) {
        if (!verifyAgent(req, body)) return send(res, 401, { error: 'bad signature' });
        const j = jobs.get(result[1]);
        if (j) {
          j.status = 'done';
          j.result = JSON.parse(body);
          log(`result ${result[1]} ok=${j.result.ok}`);
        }
        return send(res, 200, { received: true });
      }
      return send(res, 404, { error: 'not found' });
    });
  });
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const secret = process.env.RELAY_SECRET;
  if (!secret) {
    process.stderr.write('Set RELAY_SECRET.\n');
    process.exit(2);
  }
  const port = Number(process.argv[2] || 8790);
  createHub({ secret, log: (m) => process.stderr.write(`[hub] ${m}\n`) }).listen(port, '127.0.0.1', () => process.stderr.write(`[hub] listening on http://127.0.0.1:${port}\n`));
}
