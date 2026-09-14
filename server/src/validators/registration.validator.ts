import { z } from "zod";

export const registerEventSchema = z.object({
  eventId: z.string().uuid(),
});

export const markAttendanceSchema = z.object({
  userId: z.string().uuid(),
});
