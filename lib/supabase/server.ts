import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { Database } from '../database.types';
import { env } from '../config/env.js';

const supabaseUrl = env.supabaseUrl;
const supabaseAnonKey = env.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  );
}

export function getSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      async get(name: string) {
        return cookieStore.get(name)?.value;
      },
      async set(name: string, value: string, options: any) {
        cookieStore.set(name, value, options);
      },
      async remove(name: string, options: any) {
        cookieStore.set(name, '', { ...options, maxAge: 0 });
      },
    },
  });
}
