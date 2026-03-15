import { refresh } from '../../../../lib/services/auth.service.js';
import { getRefreshTokenFromRequest, setAuthCookies } from '../../../../lib/auth/cookies.js';
import { json, errorResponse } from '../../../../lib/http/response.js';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const refreshToken = getRefreshTokenFromRequest(request) || body?.refreshToken;

    const result = await refresh({ refreshToken });
    const response = json({ ok: true });

    setAuthCookies(response, {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });

    return response;
  } catch (error) {
    return errorResponse(error);
  }
}
