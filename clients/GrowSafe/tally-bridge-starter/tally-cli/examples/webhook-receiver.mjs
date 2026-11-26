#!/usr/bin/env node
/**
 * Minimal webhook receiver for "tally watch --sink <url>" and "tally sync run --sink <url>".
 * Verifies the X-Tally-Signature header (HMAC-SHA256 of "<timestamp>.<body>") and prints each event.
 *
 * Usage: WEBHOOK_SECRET=change-me node examples/webhook-receiver.mjs [port]
 */
import http from 'node:http';
import crypto from 'node:crypto';

const secret = process.env.WEBHOOK_SECRET || '';
const port = Number(process.argv[2] || 8791);

http
  .createServer((req, res) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const body = Buffer.concat(chunks).toString('utf8');
      if (secret) {
        const ts = req.headers['x-tally-timestamp'] || '';
        const want = `sha256=${crypto.createHmac('sha256', secret).update(`${ts}.${body}`).digest('hex')}`;
        const got = String(req.headers['x-tally-signature'] || '');
        const ok = want.length === got.length && crypto.timingSafeEqual(Buffer.from(want), Buffer.from(got));
        const fresh = Math.abs(Date.now() / 1000 - Number(ts)) < 300;
        if (!ok || !fresh) {
          res.writeHead(401);
          res.end('bad signature');
          return;
        }
      }
      process.stdout.write(`${body}\n`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('{"received":true}');
    });
  })
  .listen(port, '127.0.0.1', () => process.stderr.write(`listening on http://127.0.0.1:${port}\n`));
