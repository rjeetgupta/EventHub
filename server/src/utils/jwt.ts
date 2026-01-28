import jwt from "jsonwebtoken";
import crypto from "crypto";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY_DAYS = 7;

/**
 * Generate Access Token
 * Creates a JWT token for user authentication
 * Valid for 15 minutes
 *
 * @param payload - Token payload (userId, role, departmentId)
 * @returns Signed JWT token
 */
export const generateAccessToken = (payload: {
  userId: string;
  role: string;
  departmentId?: string | null;
}) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

/**
 * Generate Refresh Token
 * Creates a random refresh token for token renewal
 * Valid for 7 days (must be stored in database)
 *
 * @returns Random hex string (40 bytes)
 */
export const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString("hex");
};

/**
 * Verify Access Token
 * Validates and decodes a JWT token
 *
 * @param token - JWT token to verify
 * @returns Decoded token payload or throws error
 * @throws JWT verification errors (invalid, expired, etc.)
 */
export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!) as {
    userId: string;
    role: string;
    departmentId?: string | null;
  };
};

/**
 * Get Refresh Token Expiry Date
 * Calculates expiration date 7 days from now
 *
 * @returns Date object for 7 days in the future
 */
export const getRefreshTokenExpiry = () => {
  const date = new Date();
  date.setDate(date.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);
  return date;
};
