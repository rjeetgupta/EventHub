import { Request, Response, NextFunction } from "express";
import { UserRole } from "../types/common.types";
import ApiError from "../utils/ApiError";

// ✅ ISSUE: Not using asyncHandler, which is fine for sync operations
export const isAllowedToDo = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!allowedRoles.includes(user.role)) {
      throw new ApiError(
        403,
        `Access denied. Allowed roles: ${allowedRoles.join(", ")}`
      );
    }

    next();
  };
};