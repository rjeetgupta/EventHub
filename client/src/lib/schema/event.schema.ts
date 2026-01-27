import { z } from "zod";
import { EventStatus } from "@/types/common.types";

/**
 * Shared ISO date validator
 */
const isoDate = z
  .string()
  .refine((val) => !Number.isNaN(Date.parse(val)), {
    message: "Invalid date format",
  });

/**
 * Create Event
 */
export const createEventSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  startDate: isoDate,
  endDate: isoDate,
  registrationDeadline: isoDate,
  maxParticipants: z
    .number()
    .int()
    .positive()
    .optional(),
}).refine(
  (data) => new Date(data.endDate) > new Date(data.startDate),
  {
    path: ["endDate"],
    message: "End date must be after start date",
  }
).refine(
  (data) => new Date(data.registrationDeadline) < new Date(data.startDate),
  {
    path: ["registrationDeadline"],
    message: "Registration deadline must be before event start",
  }
);

export type CreateEventFormData = z.infer<typeof createEventSchema>;

/**
 * Update Event
 */
export const updateEventSchema = createEventSchema.partial();

export type UpdateEventFormData = z.infer<typeof updateEventSchema>;

/**
 * Event Status Update
 */
export const updateEventStatusSchema = z.object({
  status: z.nativeEnum(EventStatus),
});

export type UpdateEventStatusData = z.infer<typeof updateEventStatusSchema>;
