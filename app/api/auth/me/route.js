import { requireUser } from '../../../../lib/auth/server.js';
import { createRouteHandlerSupabaseClient } from '../../../../lib/supabase/route-client.js';
import { mapSupabaseUser } from '../../../../lib/auth/supabase-user.js';
import { json, errorResponse } from '../../../../lib/http/response.js';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const user = await requireUser(request);
    return json({ user });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request) {
  try {
    await requireUser(request);
    const { supabase, applyCookies } = createRouteHandlerSupabaseClient(request);
    const body = await request.json();

    const updates = {};

    if (typeof body?.email === 'string') {
      updates.email = body.email;
    }

    const userMetadata = {};
    if (typeof body?.fullName === 'string') {
      userMetadata.full_name = body.fullName;
    }

    const { data, error } = await supabase.auth.updateUser({
      ...updates,
      data: Object.keys(userMetadata).length ? userMetadata : undefined,
    });

    if (error || !data?.user) {
      throw error || new Error('Unable to update profile.');
    }

    const response = json({ user: mapSupabaseUser(data.user) });
    applyCookies(response);
    return response;
  } catch (error) {
    const { applyCookies } = createRouteHandlerSupabaseClient(request);
    const response = errorResponse(error);
    applyCookies(response);
    return response;
  }
}
