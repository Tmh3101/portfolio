import ms from 'ms';
import { env } from '../config/env.js';

export const ACCESS_TOKEN_COOKIE = 'portfolio_access_token';
export const REFRESH_TOKEN_COOKIE = 'portfolio_refresh_token';

const toSeconds = (value) => {
  const duration = typeof value === 'string' ? ms(value) : Number(value);
  if (!Number.isFinite(duration) || duration <= 0) {
    return undefined;
  }

  return Math.floor(duration / 1000);
};

const baseOptions = () => ({
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'lax',
  path: '/',
});

export const setAuthCookies = (response, { accessToken, refreshToken }) => {
  const accessMaxAge = toSeconds(env.jwtAccessTtl);
  const refreshMaxAge = toSeconds(env.jwtRefreshTtl);

  response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
    ...baseOptions(),
    maxAge: accessMaxAge,
  });

  response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
    ...baseOptions(),
    maxAge: refreshMaxAge,
  });
};

export const clearAuthCookies = (response) => {
  response.cookies.set(ACCESS_TOKEN_COOKIE, '', {
    ...baseOptions(),
    maxAge: 0,
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE, '', {
    ...baseOptions(),
    maxAge: 0,
  });
};

export const getAccessTokenFromRequest = (request) =>
  request.cookies?.get?.(ACCESS_TOKEN_COOKIE)?.value || null;

export const getRefreshTokenFromRequest = (request) =>
  request.cookies?.get?.(REFRESH_TOKEN_COOKIE)?.value || null;
