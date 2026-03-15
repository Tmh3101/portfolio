import { getCurrentUser, updateCurrentUser } from '../../../../lib/services/auth.service.js';
import { requireUser } from '../../../../lib/auth/server.js';
import { json, errorResponse } from '../../../../lib/http/response.js';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const user = await requireUser(request);
    const result = await getCurrentUser({ userId: Number(user.id) });
    return json({ user: result });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request) {
  try {
    const user = await requireUser(request);
    const body = await request.json();
    const result = await updateCurrentUser({
      userId: Number(user.id),
      email: body?.email,
      fullName: body?.fullName,
    });
    return json({ user: result });
  } catch (error) {
    return errorResponse(error);
  }
}
