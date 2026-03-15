import { verifyAccessToken } from '../services/token.service.js';
import { findUserById } from '../db/repositories/user.repository.js';
import { createHttpError } from '../utils/http-error.js';
import { getAccessTokenFromRequest } from './cookies.js';

export const requireUser = async (request) => {
  const token = getAccessTokenFromRequest(request);

  if (!token) {
    throw createHttpError(401, 'Missing access token.');
  }

  const payload = verifyAccessToken(token);

  if (payload.type !== 'access') {
    throw createHttpError(401, 'Invalid access token.');
  }

  const user = await findUserById({ id: Number(payload.sub) });

  if (!user || !user.is_active) {
    throw createHttpError(401, 'User not found or inactive.');
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    fullName: user.full_name,
    sessionId: payload.sessionId,
  };
};

export const requireRole = (user, ...roles) => {
  if (!user || !roles.includes(user.role)) {
    throw createHttpError(403, 'Forbidden.');
  }
};
