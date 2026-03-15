import { jwtVerify } from "jose";

const encoder = new TextEncoder();

const getAccessSecret = () => {
  const secret = process.env.JWT_ACCESS_SECRET || "";
  return secret ? encoder.encode(secret) : null;
};

export const verifyAccessTokenEdge = async (token) => {
  const secret = getAccessSecret();

  if (!secret) {
    const error = new Error("JWT configuration is missing.");
    error.statusCode = 500;
    throw error;
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error("Access token verification failed:", error);
    const authError = new Error("Invalid or expired access token.");
    authError.statusCode = 401;
    throw authError;
  }
};
