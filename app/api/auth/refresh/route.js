import { createHttpError } from '../../../../lib/utils/http-error.js';
import { createRouteHandlerSupabaseClient } from '../../../../lib/supabase/route-client.js';
import { json, errorResponse } from '../../../../lib/http/response.js';

export const runtime = 'nodejs';

export async function POST(request) {
  const { supabase, applyCookies } = createRouteHandlerSupabaseClient(request);

  try {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data?.session) {
      throw createHttpError(401, error?.message || 'Session refresh failed.');
    }

    const response = json({ ok: true });
    applyCookies(response);
    return response;
  } catch (error) {
    const response = errorResponse(error);
    applyCookies(response);
    return response;
  }
}
