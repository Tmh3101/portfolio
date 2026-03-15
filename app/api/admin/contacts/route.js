import { listContacts } from '../../../../lib/services/admin-contact.service.js';
import { requireRole, requireUser } from '../../../../lib/auth/server.js';
import { json, errorResponse } from '../../../../lib/http/response.js';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const user = await requireUser(request);
    requireRole(user, 'admin');

    const { searchParams } = new URL(request.url);
    const result = await listContacts({
      page: searchParams.get('page'),
      pageSize: searchParams.get('pageSize'),
    });

    return json(result);
  } catch (error) {
    return errorResponse(error);
  }
}
