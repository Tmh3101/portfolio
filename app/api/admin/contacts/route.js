import { createClient } from '../../../../lib/supabase/server';
import { listContacts } from '../../../../lib/services/admin-contact.service.js';
import { json, errorResponse } from '../../../../lib/http/response.js';

export async function GET(request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      // If unauthorized, return a 401 response
      return errorResponse(new Error('Unauthorized'), 401);
    }

    // If authentication is successful, proceed with the request
    const { searchParams } = new URL(request.url);
    const result = await listContacts({
      page: searchParams.get('page'),
      pageSize: searchParams.get('pageSize'),
      // Optionally pass user ID if services need it for auditing or specific queries
      // userId: user.id,
    });

    return json(result);
  } catch (error) {
    // Catch any other errors during processing
    return errorResponse(error);
  }
}
