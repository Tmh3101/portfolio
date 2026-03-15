import { getSupabaseAdminClient } from '../supabase/db-client.js';
import { sanitizePath } from '../utils/sanitize.js';

export const recordVisit = async ({ path, metadata }) => {
  const supabase = getSupabaseAdminClient();

  const { error } = await supabase.from('page_visits').insert({
    path: sanitizePath(path),
    ip: metadata.ip,
    country: metadata.country,
    region: metadata.region,
    city: metadata.city,
    user_agent: metadata.userAgent,
    device_type: metadata.deviceType,
    browser: metadata.browser,
    os: metadata.os,
    device_vendor: metadata.deviceVendor,
    device_model: metadata.deviceModel,
  });

  if (error) {
    console.error('Failed to record visit:', error);
    throw new Error('Failed to record visit');
  }

  return { ok: true };
};

export const getVisitSummary = async () => {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from('page_visits')
    .select('ip', { count: 'exact', head: true });

  if (error) {
    console.error('Failed to fetch visit summary:', error);
    throw new Error('Failed to fetch visit summary');
  }

  const totalVisits = data?.length ?? 0;

  const { count: uniqueVisitors, error: uniqueError } = await supabase
    .from('page_visits')
    .select('ip', { count: 'exact', head: true })
    .neq('ip', null);

  if (uniqueError) {
    console.error('Failed to fetch unique visitors:', uniqueError);
    throw new Error('Failed to fetch visit summary');
  }

  return {
    totalVisits,
    uniqueVisitors: uniqueVisitors ?? 0,
  };
};
