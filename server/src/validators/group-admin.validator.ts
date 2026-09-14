import { z } from "zod";

export const assignGroupAdminSchema = z.object({
  userId: z.string().uuid(),
  permissions: z.array(z.string()).min(1),
});
