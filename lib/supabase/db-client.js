import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';

let cachedAdminClient = null;

export const getSupabaseAdminClient = () => {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    throw new Error('SUPABASE_ADMIN_NOT_CONFIGURED');
  }

  if (!cachedAdminClient) {
    cachedAdminClient = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return cachedAdminClient;
};
