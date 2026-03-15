import { changeCurrentUserPassword } from '../../../../lib/services/auth.service.js';
import { requireUser } from '../../../../lib/auth/server.js';
import { json, errorResponse } from '../../../../lib/http/response.js';

export const runtime = 'nodejs';

export async function PATCH(request) {
  try {
    const user = await requireUser(request);
    const body = await request.json();
    const result = await changeCurrentUserPassword({
      userId: Number(user.id),
      currentPassword: body?.currentPassword,
      newPassword: body?.newPassword,
    });
    return json(result);
  } catch (error) {
    return errorResponse(error);
  }
}
