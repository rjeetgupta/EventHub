import { z } from "zod";
import { RoleType } from "../../generated/prisma/enums.js";

export const assignRoleSchema = z.object({
  role: z.enum(RoleType),
});
