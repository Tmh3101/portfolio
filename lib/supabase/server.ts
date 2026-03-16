import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { Database } from '../database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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
        const store = await cookieStore;
        return store.get(name)?.value;
      },
      async set(name: string, value: string, options: any) {
        const store = await cookieStore;
        store.set(name, value, options);
      },
      async remove(name: string, options: any) {
        const store = await cookieStore;
        store.set(name, '', { ...options, maxAge: 0 });
      },
    },
  });
}
