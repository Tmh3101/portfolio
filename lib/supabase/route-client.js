import { createServerClient } from '@supabase/ssr';
import { env } from '../config/env.js';

export const createRouteHandlerSupabaseClient = (request) => {
  const pendingCookies = [];

  const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      get(name) {
        return request.cookies.get(name)?.value;
      },
      set(name, value, options) {
        pendingCookies.push({ name, value, options });
      },
      remove(name, options) {
        pendingCookies.push({ name, value: '', options: { ...options, maxAge: 0 } });
      },
    },
  });

  const applyCookies = (response) => {
    pendingCookies.forEach(({ name, value, options }) => {
      response.cookies.set({ name, value, ...options });
    });
  };

  return { supabase, applyCookies };
};
