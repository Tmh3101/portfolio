import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { env } from '../config/env.js';

/**
 * Refreshes the user's session if needed and handles cookie synchronization.
 * This is the standard pattern for Next.js middleware with @supabase/ssr.
 *
 * @param {import('next/server').NextRequest} request
 * @returns {Promise<{supabase: import('@supabase/supabase-js').SupabaseClient, response: NextResponse, user: import('@supabase/supabase-js').User | null}>}
 */
export async function updateSession(request) {
  // 1. Create an initial response
  let supabaseResponse = NextResponse.next({
    request,
  });

  // 2. Create the Supabase client
  const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // Update the request cookies
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

        // Create a new response and set the cookies on it
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // 3. Refresh the session (this will call setAll if tokens are refreshed)
  // getUser() is more secure than getSession() in middleware
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, response: supabaseResponse, user };
}
