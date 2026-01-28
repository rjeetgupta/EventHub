import { Request, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { prisma } from "../config/db.js";

/**
 * JWT Verification Middleware
 * Verifies and extracts user information from JWT token
 *
 * Token Source Priority:
 * 1. Cookie: accessToken
 * 2. Authorization Header: Bearer <token>
 *
 * Sets req.user with: { id, role, departmentId }
 *
 * @throws ApiError 401 - If token is missing or invalid
 * @throws ApiError 401 - If user is not found or inactive
 */
export const verifyJWT = asyncHandler(async (req: Request, _, next: NextFunction) => {
  let token: string | undefined;

  // Priority 1: Check cookies
  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  // Priority 2: Check Authorization header
  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Token not found
  if (!token) {
    throw new ApiError(401, "Authentication required");
  }

  // Verify token signature and expiry
  const payload = verifyAccessToken(token);

  // Fetch user from database
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: { role: true },
  });

  // User not found or inactive
  if (!user || !user.isActive) {
    throw new ApiError(401, "Unauthorized - User not found or inactive");
  }

  // Attach user info to request object
  req.user = {
    id: user.id,
    role: user.role.name,
    departmentId: user.departmentId,
  };

  next();
});


