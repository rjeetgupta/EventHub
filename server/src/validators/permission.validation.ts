import { z } from "zod";
import { PermissionType } from "../../generated/prisma/enums.js";

export const assignPermissionSchema = z.object({
  userId: z.uuid(),
  permission: z.enum(PermissionType),
  isGranted: z.boolean().default(true),
});
