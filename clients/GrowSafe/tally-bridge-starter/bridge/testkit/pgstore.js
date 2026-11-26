// A local Postgres (PGlite, in memory) with the bridge migration applied, and a store with the same
// rpc() as SupabaseStore. Used by the tests only; on the Tally server the bridge uses Supabase.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PGlite } from '@electric-sql/pglite';

const here = path.dirname(fileURLToPath(import.meta.url));
const MIGRATION = path.join(here, '..', '..', 'supabase', 'migrations', '20261125000000_tally_bridge.sql');

export const OWNER = '00000000-0000-0000-0000-000000000001';

export async function makeDb({ twice = true } = {}) {
  const db = new PGlite();
  // Minimal Supabase stand-ins: the auth schema, auth.uid() and the API roles.
  await db.exec(`
    create schema auth;
    create table auth.users (id uuid primary key);
    create or replace function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    create role anon; create role authenticated; create role service_role;
  `);
  const sql = fs.readFileSync(MIGRATION, 'utf8');
  await db.exec(sql);
  if (twice) await db.exec(sql); // the migration must be safe to run twice
  await db.exec(`insert into auth.users values ('${OWNER}'); insert into profiles(id, role) values ('${OWNER}', 'owner');`);
  return db;
}

const pgArray = (a) => `{${a.map((x) => `"${String(x).replace(/["\\]/g, '\\$&')}"`).join(',')}}`;

export class PgStore {
  constructor(db) { this.db = db; this.retset = new Map(); }

  async rpc(fn, args = {}) {
    if (!this.retset.has(fn)) {
      const r = await this.db.query('select proretset from pg_proc where proname = $1', [fn]);
      if (!r.rows.length) throw new Error(`${fn}: no such function`);
      this.retset.set(fn, r.rows[0].proretset);
    }
    const names = Object.keys(args);
    const params = names.map((k) => {
      const v = args[k];
      if (Array.isArray(v) && (v.length === 0 || typeof v[0] !== 'object')) return pgArray(v);
      if (v !== null && typeof v === 'object') return JSON.stringify(v);
      return v;
    });
    const call = `${fn}(${names.map((k, i) => `${k} => $${i + 1}`).join(', ')})`;
    if (this.retset.get(fn)) return (await this.db.query(`select * from ${call}`, params)).rows;
    const r = await this.db.query(`select ${call} as v`, params);
    return r.rows[0]?.v ?? null;
  }
}

/** Put an item in the approval queue as the owner and approve it, exactly as the app would. */
export async function approve(db, companyGuid, kind, objectType, payload) {
  await db.exec(`set request.jwt.claim.sub = '${OWNER}'`);
  const id = (await db.query(
    `insert into bridge_writeback_queue(company_guid, kind, object_type, payload, created_by) values ($1, $2, $3, $4::jsonb, $5) returning id`,
    [companyGuid, kind, objectType, JSON.stringify(payload), OWNER])).rows[0].id;
  await db.query('select app_approve_writeback($1)', [id]);
  await db.exec(`reset request.jwt.claim.sub`);
  return id;
}

export async function statusOf(db, id) {
  return (await db.query('select status, error, tally_response from bridge_writeback_queue where id = $1', [id])).rows[0];
}
