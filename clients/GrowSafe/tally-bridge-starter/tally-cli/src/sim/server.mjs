/**
 * "tally simulate": serve the simulator over HTTP on a port, like Tally's gateway.
 * Replies in the encoding of the request (UTF-16 in, UTF-16 out). A plain GET answers like Tally does.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { decodeBuffer, sniffEncoding } from '../core/textio.mjs';
import { Simulator } from './simulator.mjs';

export function loadSimulator({ state, empty, educational, seed, name } = {}) {
  if (state && fs.existsSync(state)) return Simulator.fromJSON(JSON.parse(fs.readFileSync(state, 'utf8')));
  const sim = empty ? Simulator.empty({ name: name || 'Test Company' }) : Simulator.demo({ seed, name, educational });
  if (educational) sim.store.company.educational = true;
  return sim;
}

export function createSimServer(sim, { state, delayMs = 0, log = () => {} } = {}) {
  const persist = () => {
    if (!state) return;
    fs.mkdirSync(path.dirname(path.resolve(state)), { recursive: true });
    fs.writeFileSync(state, JSON.stringify(sim.toJSON()));
  };
  let queue = Promise.resolve();
  return http.createServer((req, res) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      // One request at a time, like Tally.
      queue = queue.then(async () => {
        if (delayMs) await new Promise((r) => setTimeout(r, delayMs));
        const buf = Buffer.concat(chunks);
        let body;
        let enc = 'utf8';
        if (req.method === 'GET' || !buf.length) body = '<RESPONSE>TallyPrime Server is Running</RESPONSE>';
        else {
          enc = sniffEncoding(buf).encoding;
          const out = sim.handle(decodeBuffer(buf));
          if (out.mutated) persist();
          body = out.body;
          log(`${req.method} ${buf.length} bytes -> ${body.length} chars`);
        }
        const payload = enc === 'utf16le' ? Buffer.from(body, 'utf16le') : Buffer.from(body, 'utf8');
        res.writeHead(200, { 'Content-Type': `text/xml; charset=${enc === 'utf16le' ? 'utf-16' : 'utf-8'}`, 'Content-Length': payload.length });
        res.end(payload);
      });
    });
  });
}
