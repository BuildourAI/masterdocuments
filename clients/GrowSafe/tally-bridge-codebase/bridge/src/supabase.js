import { createClient } from '@supabase/supabase-js';

export function connect() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL and SUPABASE_SECRET_KEY must be set in bridge/.env on the Tally server');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function must(promise, what) {
  const { data, error } = await promise;
  if (error) throw new Error(`${what}: ${error.message}`);
  return data;
}

export function chunks(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
