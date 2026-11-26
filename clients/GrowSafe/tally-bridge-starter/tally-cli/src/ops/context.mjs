/**
 * Execution context shared by all operations: configuration, the Tally client (created lazily),
 * policy, audit log, state files, capabilities, and a per-invocation cache.
 */
import path from 'node:path';
import { loadConfig } from '../core/config.mjs';
import { createTransport, recording } from '../core/transport.mjs';
import { createLock } from '../core/lock.mjs';
import { TallyClient } from '../core/client.mjs';
import { Policy } from '../core/policy.mjs';
import { AuditLog } from '../core/audit.mjs';
import { StateStore, scopeKey } from '../core/state.mjs';
import { loadCapabilities } from '../core/capabilities.mjs';

/**
 * @param {{frontend?: string, configPath?: string, profile?: string, overrides?: object, verbose?: boolean,
 *   log?: Function, transport?: any, env?: object, cwd?: string}} opts
 */
export function createContext(opts = {}) {
  const config = loadConfig({ configPath: opts.configPath, profile: opts.profile, overrides: opts.overrides, env: opts.env, cwd: opts.cwd });
  const frontend = opts.frontend || 'cli';
  const log = opts.log || (opts.verbose ? (m) => process.stderr.write(`[tally] ${m}\n`) : () => {});
  const state = new StateStore(config.stateDir);
  let client = null;
  let transport = opts.transport || null;

  const ctx = {
    config,
    profile: config.profile,
    profileName: config.profileName,
    frontend,
    log,
    state,
    audit: new AuditLog(path.join(config.stateDir, 'audit.jsonl')),
    policy: new Policy(config.profile, frontend),
    warnings: [],
    cache: new Map(),
    get scope() {
      return scopeKey(config.profileName, config.profile.company);
    },
    get caps() {
      if (!this._caps) this._caps = loadCapabilities(state, this.scope);
      return this._caps;
    },
    get transport() {
      if (!transport) {
        transport = createTransport(config.profile, { stateDir: config.stateDir });
        if (opts.overrides?.record) transport = recording(transport, opts.overrides.record);
      }
      return transport;
    },
    get client() {
      if (!client) {
        const lock = createLock(path.join(config.stateDir, 'tally.lock'), { enabled: !String(config.profile.url).startsWith('sim:') || !!opts.lockSim });
        client = new TallyClient({ transport: ctx.transport, profile: config.profile, lock, log });
      }
      return client;
    },
    get clientStats() {
      return client ? client.stats : null;
    },
    warn(msg) {
      if (!ctx.warnings.includes(msg)) ctx.warnings.push(msg);
    },
    /** Memoise an async computation for this invocation. */
    async memo(key, fn) {
      if (!ctx.cache.has(key)) ctx.cache.set(key, Promise.resolve().then(fn));
      return ctx.cache.get(key);
    },
    invalidate(prefix) {
      for (const k of [...ctx.cache.keys()]) if (k.startsWith(prefix)) ctx.cache.delete(k);
    },
  };
  return ctx;
}
