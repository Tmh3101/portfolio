import { createServerClient } from '@supabase/ssr';
import { env } from '../config/env.js';

export async function updateSession(request) {
  const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      // No cookie mutations here, so this is a noop
      setAll() {
        return;
      },
    },
  });

  // Refresh the session so that session.user is the most up-to-date
  // This will automatically update the session if the user's tokens are stale
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If the user is not authenticated and is trying to access a protected route,
  // redirect them to the login page.
  // This logic will be more sophisticated in the root middleware.
  return { user, supabase };
}
