import { z } from "zod";
import { EventMode, EventStatus } from "../../generated/prisma/enums";

// SHARED FIELD SCHEMAS

const EventModeEnum = z
  .enum(EventMode, { error: "Please select a valid event mode" })
  .default(EventMode.OFFLINE);

// CREATE EVENT

const CreateEventBody = z
  .object({
    title: z
      .string("Event title is required")
      .min(3, { error: "Title must be at least 3 characters long" })
      .max(100, { error: "Title cannot exceed 100 characters" })
      .trim(),

    description: z
      .string("Event description is required")
      .min(10, { error: "Description must be at least 10 characters long" })
      .max(1000, { error: "Description cannot exceed 1000 characters" })
      .trim(),

    date: z.iso.date({
      error: (issue) =>
        issue.input === undefined
          ? "Event date is required"
          : "Please provide a valid date (YYYY-MM-DD)",
    }),

    time: z.iso.time("Event time is required"),

    mode: EventModeEnum,

    venue: z
      .string()
      .min(3, { error: "Venue must be at least 3 characters long" })
      .max(200, { error: "Venue cannot exceed 200 characters" })
      .trim()
      .optional()
      .or(z.literal("")),

    link: z
      .url({ error: "Please provide a valid URL (e.g., https://zoom.us/j/123)" })
      .optional()
      .or(z.literal("")),

    registrationDeadline: z.iso.date({
      error: (issue) =>
        issue.input === undefined
          ? "Registration deadline is required"
          : "Please provide a valid deadline date",
    }),

    maxCapacity: z.coerce
      .number({ error: "Maximum capacity is required" })
      .int()
      .positive()
      .max(10000),

    category: z
      .string("Event category is required")
      .min(1, { error: "Please select a category" })
      .max(50, { error: "Category name is too long" })
      .trim(),
  })
  .superRefine((data, ctx) => {
    const eventDate = new Date(data.date);
    const deadline = new Date(data.registrationDeadline);
    const now = new Date();

    if (deadline >= eventDate) {
      ctx.addIssue({
        code: "custom",
        path: ["registrationDeadline"],
        message: "Registration deadline must be before the event date",
      });
    }

    if (eventDate <= now) {
      ctx.addIssue({
        code: "custom",
        path: ["date"],
        message: "Event date must be in the future",
      });
    }

    if (deadline <= now) {
      ctx.addIssue({
        code: "custom",
        path: ["registrationDeadline"],
        message: "Registration deadline must be in the future",
      });
    }

    const venueProvided = data.venue !== undefined && data.venue !== "";
    const linkProvided = data.link !== undefined && data.link !== "";

    if (data.mode === "OFFLINE" && !venueProvided) {
      ctx.addIssue({
        code: "custom",
        path: ["venue"],
        message: "Venue is required for offline events",
      });
    }

    if (data.mode === "ONLINE" && !linkProvided) {
      ctx.addIssue({
        code: "custom",
        path: ["link"],
        message: "Meeting link is required for online events",
      });
    }

    if (data.mode === "HYBRID") {
      if (!venueProvided) {
        ctx.addIssue({
          code: "custom",
          path: ["venue"],
          message: "Venue is required for hybrid events",
        });
      }
      if (!linkProvided) {
        ctx.addIssue({
          code: "custom",
          path: ["link"],
          message: "Meeting link is required for hybrid events",
        });
      }
    }
  });

export const createEventSchema = z.object({
  body: CreateEventBody,
});

// UPDATE EVENT

export const updateEventSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid event ID format"),
  }),
  body: z
    .object({
      title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(200, "Title must not exceed 200 characters")
        .trim()
        .optional(),

      description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(2000, "Description must not exceed 2000 characters")
        .trim()
        .optional(),

      date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
        .optional(),

      time: z
        .string()
        .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Time must be in HH:MM format")
        .optional(),

      mode: z.nativeEnum(EventMode).optional(),

      venue: z
        .string()
        .min(3, "Venue must be at least 3 characters")
        .max(200, "Venue must not exceed 200 characters")
        .trim()
        .optional(),

      link: z.url("Link must be a valid URL").optional(),

      registrationDeadline: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Deadline must be in YYYY-MM-DD format")
        .optional(),

      maxCapacity: z
        .number()
        .int("Max capacity must be an integer")
        .min(1, "Max capacity must be at least 1")
        .max(10000, "Max capacity cannot exceed 10,000")
        .optional(),

      category: z
        .string()
        .min(2, "Category must be at least 2 characters")
        .max(50, "Category must not exceed 50 characters")
        .trim()
        .optional(),

      status: z.nativeEnum(EventStatus).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),
});

// EVENT ID PARAM

export const eventIdSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid event ID"),
  }),
});

// EVENT FILTERS (QUERY)

export const eventFiltersSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),

    departments: z
      .string()
      .transform((val) => val.split(",").filter(Boolean))
      .optional(),
    
    categories: z
      .string()
      .transform((val) => val.split(",").filter(Boolean))
      .optional(),
    
    mode: z
      .enum(["All", "ONLINE", "OFFLINE", "HYBRID"])
      .optional(),
    
    status: z.nativeEnum(EventStatus).optional(),
    
    dateFrom: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
      .optional(),
    
    dateTo: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
      .optional(),
    
    page: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => val > 0, "Page must be greater than 0")
      .optional()
      .default(1),
    
    limit: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => val > 0 && val <= 100, "Limit must be between 1 and 100")
      .optional()
      .default(10),
    
    sortBy: z
      .enum(["date", "title", "createdAt"])
      .optional()
      .default("date"),
    
    sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
  }),
});

// DEPARTMENT EVENTS QUERY

export const departmentEventsQuerySchema = z.object({
  query: z.object({
    status: z.nativeEnum(EventStatus).optional(),
  }),
});

// MY EVENTS QUERY

export const myEventsQuerySchema = z.object({
  query: z.object({
    status: z.enum(["upcoming", "finished"]).optional(),
  }),
});

// APPROVAL

export const approvalSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid event ID format"),
  }),
  body: z.object({
    action: z.enum(["approve", "reject"], {
      error: "Action must be either 'approve' or 'reject'" }),
    feedback: z
      .string()
      .max(500, "Feedback must not exceed 500 characters")
      .trim()
      .optional(),
  }).refine(
    (data) => {
      if (data.action === "reject" && !data.feedback) {
        return false;
      }
      return true;
    },
    {
      message: "Feedback is required when rejecting an event",
      path: ["feedback"],
    }
  ),
});

// MARK ATTENDANCE

export const markAttendanceSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid event ID format"),
  }),
  body: z.object({
    userIds: z
      .array(z.uuid("Invalid user ID format"))
      .min(1, "At least one user ID is required")
      .max(1000, "Cannot mark attendance for more than 1000 users at once"),
  }),
});

// TYPE EXPORTS

export type CreateEventInput = z.infer<typeof CreateEventBody>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type EventFiltersInput = z.infer<typeof eventFiltersSchema>;
export type ApprovalInput = z.infer<typeof approvalSchema>;
export type MarkAttendanceInput = z.infer<typeof markAttendanceSchema>;