import { login } from '../../../../lib/services/auth.service.js';
import { buildRequestMetadata } from '../../../../lib/utils/request-metadata.js';
import { setAuthCookies } from '../../../../lib/auth/cookies.js';
import { json, errorResponse } from '../../../../lib/http/response.js';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await login({
      email: body?.email,
      password: body?.password,
      metadata: buildRequestMetadata(request),
    });

    const response = json({ user: result.user });
    setAuthCookies(response, { accessToken: result.accessToken, refreshToken: result.refreshToken });
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}
