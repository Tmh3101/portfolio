import { getSupabaseAdminClient } from '../supabase/db-client.js';
import { formatDateTime } from '../utils/date-time.js';

export const listContacts = async ({ page, pageSize }) => {
  const parsedPage = Number(page);
  const parsedPageSize = Number(pageSize);

  const safePage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const safePageSize =
    Number.isFinite(parsedPageSize) && parsedPageSize > 0 ? Math.min(parsedPageSize, 50) : 20;

  const offset = (safePage - 1) * safePageSize;
  const supabase = getSupabaseAdminClient();

  const [{ data: items, error: itemsError, count }, { error: countError }] = await Promise.all([
    supabase
      .from('contacts')
      .select('id, name, email, message, ip, country, region, city, created_at', {
        count: 'exact',
      })
      .order('created_at', { ascending: false })
      .range(offset, offset + safePageSize - 1),
    supabase.from('contacts').select('id', { count: 'exact', head: true }),
  ]);

  if (itemsError || countError) {
    console.error('Failed to fetch contacts:', itemsError || countError);
    throw new Error('Failed to fetch contacts');
  }

  return {
    page: safePage,
    pageSize: safePageSize,
    total: count ?? 0,
    items: (items ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      message: row.message,
      ip: row.ip,
      country: row.country,
      region: row.region,
      city: row.city,
      createdAt: formatDateTime(row.created_at),
    })),
  };
};
