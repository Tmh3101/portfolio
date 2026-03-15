import { getSupabaseAdminClient } from '../supabase/db-client.js';
import { formatDateTime } from '../utils/date-time.js';

export const listVisits = async ({ page, pageSize }) => {
  const parsedPage = Number(page);
  const parsedPageSize = Number(pageSize);

  const safePage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const safePageSize =
    Number.isFinite(parsedPageSize) && parsedPageSize > 0 ? Math.min(parsedPageSize, 50) : 20;

  const offset = (safePage - 1) * safePageSize;
  const supabase = getSupabaseAdminClient();

  const [{ data: items, error: itemsError, count }, { error: countError }] = await Promise.all([
    supabase
      .from('page_visits')
      .select(
        'id, path, ip, country, region, city, user_agent, device_type, browser, os, device_vendor, device_model, visited_at',
        { count: 'exact' }
      )
      .order('visited_at', { ascending: false })
      .range(offset, offset + safePageSize - 1),
    supabase.from('page_visits').select('id', { count: 'exact', head: true }),
  ]);

  if (itemsError || countError) {
    console.error('Failed to fetch visits:', itemsError || countError);
    throw new Error('Failed to fetch visits');
  }

  return {
    page: safePage,
    pageSize: safePageSize,
    total: count ?? 0,
    items: (items ?? []).map((row) => ({
      id: row.id,
      path: row.path,
      ip: row.ip,
      country: row.country,
      region: row.region,
      city: row.city,
      userAgent: row.user_agent,
      deviceType: row.device_type,
      browser: row.browser,
      os: row.os,
      deviceVendor: row.device_vendor,
      deviceModel: row.device_model,
      visitedAt: formatDateTime(row.visited_at),
    })),
  };
};
