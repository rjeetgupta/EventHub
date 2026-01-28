import { Request, Response, NextFunction } from "express";
import { Permission as PermissionType } from "../types/common.types";
import { prisma } from "../config/db";
import { UserRole } from "../types/common.types";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";

export const checkPermission = (permission: PermissionType) =>
  asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user; // ✅ Use req.user

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    // ✅ Super admin has all permissions
    if (user.role === UserRole.SUPER_ADMIN) {
      return next();
    }

    // ✅ Department admin has all event-related permissions
    if (
      user.role === UserRole.DEPARTMENT_ADMIN &&
      [
        PermissionType.CREATE_EVENT,
        PermissionType.UPDATE_EVENT,
        PermissionType.DELETE_EVENT,
        PermissionType.PUBLISH_EVENT,
        PermissionType.CLOSE_EVENT,
        PermissionType.MARK_ATTENDANCE,
        PermissionType.DECLARE_WINNERS,
        PermissionType.VIEW_REGISTRATIONS,
      ].includes(permission)
    ) {
      return next();
    }

    // ✅ For group admins, check specific permissions
    if (user.role === UserRole.GROUP_ADMIN) {
      const hasPermission = await prisma.groupAdminPermission.findFirst({
        where: {
          userId: user.id,
          isGranted: true,
          permission: {
            name: permission, // ✅ This should match PermissionType enum
          },
        },
      });

      if (!hasPermission) {
        throw new ApiError(
          403,
          `Access denied. Missing permission: ${permission}`
        );
      }

      return next();
    }

    // ✅ Students don't have any admin permissions
    throw new ApiError(403, "Access denied. Insufficient permissions");
  });