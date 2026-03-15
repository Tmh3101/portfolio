import { createHttpError } from '../utils/http-error.js';
import { mapSupabaseUser } from './supabase-user.js';
import { createRouteHandlerSupabaseClient } from '../supabase/route-client.js';

export const requireUser = async (request) => {
  const { supabase } = createRouteHandlerSupabaseClient(request);
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    throw createHttpError(401, 'User not found or inactive.');
  }

  return mapSupabaseUser(data.user);
};

export const requireRole = (user, ...roles) => {
  if (!user || !roles.includes(user.role)) {
    throw createHttpError(403, 'Forbidden.');
  }
};
