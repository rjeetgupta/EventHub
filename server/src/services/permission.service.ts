import { prisma } from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import { PermissionType } from "@prisma/client";

export const assignGroupAdminPermission = async (
  currentUser: any,
  data: {
    userId: string;
    permission: PermissionType;
    isGranted: boolean;
  }
) => {
  if (!["SUPER_ADMIN", "DEPARTMENT_ADMIN"].includes(currentUser.role)) {
    throw new ApiError(403, "Not allowed");
  }

  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  });

  if (!user || user.roleId === undefined) {
    throw new ApiError(404, "User not found");
  }

  return prisma.groupAdminPermission.upsert({
    where: {
      userId_permissionId: {
        userId: data.userId,
        permissionId: (
          await prisma.permission.findUnique({
            where: { name: data.permission },
          })
        )!.id,
      },
    },
    update: {
      isGranted: data.isGranted,
    },
    create: {
      userId: data.userId,
      permission: {
        connect: { name: data.permission },
      },
      isGranted: data.isGranted,
      grantedBy: currentUser.id,
    },
  });
};
