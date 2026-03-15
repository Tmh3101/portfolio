import { logout } from "../../../../lib/services/auth.service.js";
import {
  clearAuthCookies,
  getRefreshTokenFromRequest,
} from "../../../../lib/auth/cookies.js";
import { json } from "../../../../lib/http/response.js";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const refreshToken =
      getRefreshTokenFromRequest(request) || body?.refreshToken;

    if (refreshToken) {
      await logout({ refreshToken });
    }

    const response = json({ ok: true });
    clearAuthCookies(response);
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    const response = json({ ok: true });
    clearAuthCookies(response);
    return response;
  }
}
