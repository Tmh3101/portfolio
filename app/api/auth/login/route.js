import { createHttpError } from '../../../../lib/utils/http-error.js';
import { mapSupabaseUser } from '../../../../lib/auth/supabase-user.js';
import { createRouteHandlerSupabaseClient } from '../../../../lib/supabase/route-client.js';
import { json, errorResponse } from '../../../../lib/http/response.js';

export const runtime = 'nodejs';

export async function POST(request) {
  const { supabase, applyCookies } = createRouteHandlerSupabaseClient(request);

  try {
    const body = await request.json();
    const email = body?.email;
    const password = body?.password;

    if (!email || !password) {
      throw createHttpError(400, 'Email and password are required.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data?.user) {
      throw createHttpError(401, error?.message || 'Invalid credentials.');
    }

    const response = json({ user: mapSupabaseUser(data.user) });
    applyCookies(response);
    return response;
  } catch (error) {
    const response = errorResponse(error);
    applyCookies(response);
    return response;
  }
}
