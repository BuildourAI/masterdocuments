/**
 * Transports carry one request string to Tally and bring back the reply string.
 *   http   Tally's built-in HTTP gateway (node:http; fetch's 5-minute header timeout would kill long exports)
 *   sim    the built-in simulator, in-process (url "sim:" or "sim:path/to/state.json")
 *   replay answers from recorded request/reply pairs (url "replay:dir"), for offline debugging
 * Any transport can be wrapped with recording() to capture traffic for later replay.
 */
import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { TallyCliError } from './errors.mjs';
import { decodeBuffer, encodeString } from './textio.mjs';

const MAX_REPLY_BYTES = 256 * 1024 * 1024;

/**
 * @typedef {{status: number, text: string, bytes: number, ms: number, headers?: object}} Reply
 * @typedef {{name: string, url: string, send: (body: string, opts?: SendOpts) => Promise<Reply>, close?: () => Promise<void>}} Transport
 * @typedef {{timeoutMs?: number, contentType?: string, headers?: Record<string,string>, encoding?: string, method?: string, kind?: string}} SendOpts
 */

export function createTransport(profile, { stateDir } = {}) {
  const url = String(profile.url || '');
  if (url.startsWith('sim:')) return createSimTransport(url.slice(4), { stateDir });
  if (url.startsWith('replay:')) return createReplayTransport(url.slice(7));
  return createHttpTransport(profile);
}

/** HTTP transport to Tally's gateway. */
export function createHttpTransport({ url, timeoutMs = 120000, connectTimeoutMs = 3000, encoding = 'utf16' }) {
  let target;
  try {
    target = new URL(/^https?:\/\//i.test(url) ? url : `http://${url}`);
  } catch {
    throw new TallyCliError('E_CONFIG', `Invalid Tally URL "${url}".`, { hint: 'Example: http://127.0.0.1:9000' });
  }
  const lib = target.protocol === 'https:' ? https : http;

  /** @type {Transport} */
  return {
    name: 'http',
    url: target.href,
    send(body, opts = {}) {
      const enc = opts.encoding || encoding;
      const payload = Buffer.isBuffer(body) ? body : encodeString(body, enc);
      const contentType = opts.contentType || (enc === 'utf8' ? 'text/xml;charset=utf-8' : 'text/xml;charset=utf-16');
      const started = Date.now();
      const limit = opts.timeoutMs || timeoutMs;
      return new Promise((resolve, reject) => {
        let settled = false;
        const done = (fn, v) => {
          if (settled) return;
          settled = true;
          clearTimeout(connectTimer);
          clearTimeout(totalTimer);
          fn(v);
        };
        const req = lib.request(
          {
            hostname: target.hostname,
            port: target.port || (target.protocol === 'https:' ? 443 : 80),
            path: target.pathname + target.search,
            method: opts.method || 'POST',
            headers: {
              'Content-Type': contentType,
              'Content-Length': payload.length,
              Connection: 'close',
              ...(opts.headers || {}),
            },
          },
          (res) => {
            clearTimeout(connectTimer);
            const chunks = [];
            let size = 0;
            res.on('data', (c) => {
              size += c.length;
              if (size > MAX_REPLY_BYTES) {
                req.destroy();
                done(reject, new TallyCliError('E_TALLY', `Reply from Tally exceeded ${MAX_REPLY_BYTES / 1048576} MB.`, { hint: 'Use a smaller date range.' }));
                return;
              }
              chunks.push(c);
            });
            res.on('end', () => {
              const buf = Buffer.concat(chunks);
              done(resolve, { status: res.statusCode || 0, text: decodeBuffer(buf), bytes: buf.length, ms: Date.now() - started, headers: res.headers });
            });
            res.on('error', (err) => done(reject, netError(err, target, true)));
          },
        );
        const connectTimer = setTimeout(() => {
          req.destroy();
          done(reject, new TallyCliError('E_CONNECT', `Could not connect to Tally at ${target.host} within ${connectTimeoutMs} ms.`, { hint: hintConnect(target), details: { sent: false } }));
        }, connectTimeoutMs);
        req.on('socket', (sock) => {
          if (!sock.connecting) clearTimeout(connectTimer);
          else sock.once('connect', () => clearTimeout(connectTimer));
        });
        const totalTimer = setTimeout(() => {
          req.destroy();
          done(
            reject,
            new TallyCliError('E_TIMEOUT', `Tally did not answer within ${Math.round(limit / 1000)} s.`, {
              hint: 'Tally may still be working on it. Use a smaller date range or raise --timeout. For writes, check the result with "tally voucher find" before retrying.',
              details: { sent: true },
            }),
          );
        }, limit);
        req.on('error', (err) => done(reject, netError(err, target, false)));
        req.end(payload);
      });
    },
  };
}

function hintConnect(target) {
  return [
    `Is Tally running on this PC with a company open, and is its HTTP gateway on port ${target.port || 9000}?`,
    'TallyPrime: F1 Help > Settings > Connectivity > Client/Server configuration: "TallyPrime acts as" Server (or Both), Port 9000. Restart Tally after changing it.',
    'Run "tally doctor" for a guided check.',
  ].join(' ');
}

function netError(err, target, afterConnect) {
  const code = err && err.code;
  if (code === 'ECONNREFUSED' || code === 'EHOSTUNREACH' || code === 'ENOTFOUND' || code === 'EAI_AGAIN') {
    return new TallyCliError('E_CONNECT', `Cannot reach Tally at ${target.host} (${code}).`, { hint: hintConnect(target), details: { sent: false, code } });
  }
  if (code === 'ECONNRESET' || code === 'EPIPE' || code === 'ECONNABORTED') {
    return new TallyCliError('E_CONNECT', `Connection to Tally was reset (${code}).`, {
      hint: 'Tally may have closed the connection or crashed. For writes, check with "tally voucher find" before retrying.',
      details: { sent: afterConnect ? true : 'unknown', code },
    });
  }
  return new TallyCliError('E_CONNECT', `Network error talking to Tally: ${err.message}`, { details: { sent: 'unknown', code } });
}

/** In-process simulator transport. State persists to a JSON file when a path is given. */
export function createSimTransport(spec, { stateDir } = {}) {
  let sim = null;
  const file = spec ? path.resolve(spec) : null;
  async function getSim() {
    if (sim) return sim;
    const { Simulator } = await import('../sim/simulator.mjs');
    if (file && fs.existsSync(file)) sim = Simulator.fromJSON(JSON.parse(fs.readFileSync(file, 'utf8')));
    else {
      sim = Simulator.demo();
      if (file) persist();
    }
    return sim;
  }
  function persist() {
    if (!file || !sim) return;
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(sim.toJSON()));
  }
  void stateDir;
  return {
    name: 'sim',
    url: `sim:${spec || ''}`,
    async send(body, opts = {}) {
      const s = await getSim();
      const started = Date.now();
      const res = s.handle(Buffer.isBuffer(body) ? decodeBuffer(body) : body, { headers: opts.headers || {} });
      if (res.mutated) persist();
      return { status: res.status || 200, text: res.body, bytes: Buffer.byteLength(res.body), ms: Date.now() - started };
    },
    get simulator() {
      return sim;
    },
    getSimulator: getSim,
  };
}

export const requestKey = (body) => crypto.createHash('sha256').update(normaliseForKey(body)).digest('hex').slice(0, 24);
const normaliseForKey = (body) => String(body).replace(/\s+/g, ' ').trim();

/** Answer from recorded pairs in a directory (written by recording()). */
export function createReplayTransport(dir) {
  const root = path.resolve(dir);
  return {
    name: 'replay',
    url: `replay:${dir}`,
    async send(body) {
      const key = requestKey(body);
      const f = path.join(root, `${key}.reply.xml`);
      if (!fs.existsSync(f)) {
        throw new TallyCliError('E_NOT_FOUND', `No recorded reply for this request (key ${key}) in ${root}.`, { hint: 'Record it first with --record <dir> against a real Tally.' });
      }
      const text = fs.readFileSync(f, 'utf8');
      return { status: 200, text, bytes: Buffer.byteLength(text), ms: 0 };
    },
  };
}

/** Wrap a transport so every request and reply is saved to `dir` (for replay and bug reports). */
export function recording(transport, dir) {
  const root = path.resolve(dir);
  fs.mkdirSync(root, { recursive: true });
  return {
    ...transport,
    name: `${transport.name}+record`,
    async send(body, opts) {
      const reply = await transport.send(body, opts);
      const key = requestKey(body);
      fs.writeFileSync(path.join(root, `${key}.request.xml`), String(body));
      fs.writeFileSync(path.join(root, `${key}.reply.xml`), reply.text);
      return reply;
    },
  };
}
