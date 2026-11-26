// The bridge's only door to Supabase: the bridge_* database functions, called with the secret key.
// Tests use the same functions on a local Postgres (test/pgstore.js), so both paths run the same SQL.
import { createClient } from '@supabase/supabase-js';

export class SupabaseStore {
  constructor(url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SECRET_KEY) {
    if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_SECRET_KEY must be set in bridge/.env on the Tally server');
    this.sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  }

  async rpc(fn, args) {
    const { data, error } = await this.sb.rpc(fn, args);
    if (error) throw new Error(`${fn}: ${error.message}`);
    return data;
  }
}

export function chunks(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
