import { z } from 'zod';
import { EventMode as EventModeConst, EventStatus as EventStatusConst, RegistrationStatus as RegistrationStatusConst } from '../types/common.types';

export const EventModeEnum = z
  .enum(EventModeConst, { error: "Please select a valid event mode" })
  .default(EventModeConst.ONLINE);


export const EventStatusEnum = z.enum(EventStatusConst, {
  error: 'Invalid event status',
})
export const RegistrationStatusEnum = z.enum(RegistrationStatusConst, {
  error: "Invalid registration status",
})

// ============================================================================
// BASE SCHEMAS
// ============================================================================

export const EventSchema = z.object({
  id: z.uuid({ error: "Invalid event ID format" }),
  title: z.string('Title is required'),
  description: z.string('Description is required'),
  date: z.iso.datetime({ error: "Invalid date format" }),
  time: z.string('Time is required'),
  mode: EventModeEnum,
  venue: z.string().nullable(),
  link: z.url({ message: 'Invalid URL format' }).nullable(),
  registrationDeadline: z.iso.datetime({ message: 'Invalid deadline format' }),
  maxCapacity: z.number().int().positive({ message: 'Capacity must be a positive number' }),
  currentRegistrations: z.number().int().nonnegative({ message: 'Invalid registration count' }),
  category: z.string('Category is required'),
  status: EventStatusEnum,
  approvedAt: z.iso.datetime().nullable(),
  approvedById: z.uuid().nullable(),
  approvedByName: z.string().nullable(),
  rejectionReason: z.string().nullable(),
  departmentId: z.uuid({ message: 'Invalid department ID' }),
  departmentName: z.string('Department name is required'),
  creatorId: z.uuid({ message: 'Invalid creator ID' }),
  creatorName: z.string('Creator name is required'),
  registeredUsers: z.array(z.uuid()).optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const RegistrationSchema = z.object({
  id: z.uuid({ message: 'Invalid registration ID' }),
  userId: z.uuid({ message: 'Invalid user ID' }),
  userName: z.string().optional(),
  userEmail: z.email({ message: 'Invalid email format' }).optional(),
  studentID: z.string().optional(),
  eventId: z.uuid({ message: 'Invalid event ID' }),
  eventTitle: z.string().optional(),
  status: RegistrationStatusEnum,
  registeredAt: z.iso.datetime({ message: 'Invalid registration date' }),
  attendedAt: z.iso.datetime().nullable().optional(),
  cancelledAt: z.iso.datetime().nullable().optional(),
});

// ============================================================================
// REQUEST SCHEMAS WITH VALIDATION MESSAGES
// ============================================================================

export const EventFiltersSchema = z.object({
  search: z.string().optional(),
  departments: z.array(z.uuid({ message: 'Invalid department ID' })).optional(),
  categories: z.array(z.string()).optional(),
  mode: EventModeEnum.optional(),
  status: EventStatusEnum.optional(),
  dateFrom: z.iso.datetime({ message: 'Invalid start date format' }).optional(),
  dateTo: z.iso.datetime({ message: 'Invalid end date format' }).optional(),
  page: z.number().int().positive({ message: 'Page must be a positive number' }).default(1),
  limit: z.number()
    .int()
    .positive({ message: 'Limit must be a positive number' })
    .max(100, { message: 'Limit cannot exceed 100' })
    .default(10),
  sortBy: z.enum(['date', 'title', 'createdAt'], {
    error: 'Invalid sort field',
  }).default('date'),
  sortOrder: z.enum(['asc', 'desc'], {
    error: 'Sort order must be asc or desc',
  }).default('asc'),
});


export const CreateEventSchema = z
  .object({
    title: z
      .string({ error: (iss) => (iss.input === undefined ? "Event title is required" : "Invalid input") })
      .min(3, { error: "Title must be at least 3 characters long" })
      .max(200, { error: "Title cannot exceed 200 characters" })
      .trim(),

    description: z
      .string({ error: (iss) => (iss.input === undefined ? "Event description is required" : "Invalid input") })
      .min(10, { error: "Description must be at least 10 characters long" })
      .max(2000, { error: "Description cannot exceed 2000 characters" })
      .trim(),

    date: z.iso.datetime({
      error: (issue) =>
        issue.input === undefined
          ? "Event date is required"
          : "Please provide a valid date and time",
    }),

    time: z
      .string({ error: (iss) => (iss.input === undefined ? "Event time is required" : "Invalid input") })
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      }),

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

    registrationDeadline: z.iso.datetime({
      error: (issue) =>
        issue.input === undefined
          ? "Registration deadline is required"
          : "Please provide a valid deadline date and time",
    }),

    maxCapacity: z
      .number({ error: (iss) => (iss.input === undefined ? "Maximum capacity is required" : "Invalid input") })
      // note: docs here don’t show the exact option shape for `.int()` in v4;
      // keep your constraints but move messages to `error` where applicable in your codebase
      .int()
      .positive()
      .max(10000),

    category: z
      .string({ error: (iss) => (iss.input === undefined ? "Event category is required" : "Invalid input") })
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

export const UpdateEventSchema = CreateEventSchema.partial();


export const ApprovalSchema = z
  .object({
    action: z.enum(["approve", "reject"], {
      error: "Action must be either approve or reject",
    }),
    feedback: z
      .string()
      .max(500, { error: "Feedback cannot exceed 500 characters" })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.action === "reject" && !data.feedback) {
      ctx.addIssue({
        code: "custom",
        path: ["feedback"],
        message: "Please provide a reason for rejection",
      });
    }
  });

export const ApprovalBaseSchema = z.object({
  action: z.enum(['approve', 'reject'], {
    error: 'Action must be either approve or reject',
  }),
  feedback: z.string()
    .max(500, { message: 'Feedback cannot exceed 500 characters' })
    .optional(),
});


export const MarkAttendanceSchema = z.object({
  userIds: z.array(z.uuid({ message: 'Invalid user ID format' }))
    .min(1, { message: 'Please select at least one participant' })
    .max(1000, { message: 'Cannot mark attendance for more than 1000 users at once' }),
});

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

export const EventsResponseSchema = z.object({
  events: z.array(EventSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
});

export const MyEventsResponseSchema = z.object({
  events: z.array(EventSchema),
  registrations: z.array(RegistrationSchema),
});

// ============================================================================
// FORM SCHEMAS (For React Hook Form)
// ============================================================================

// For creating events (with default values)
export const CreateEventFormSchema = CreateEventSchema.safeExtend({
  venue: z.string().optional().or(z.literal("")).default(""),
  link: z.url().optional().or(z.literal("")).default(""),
});

// For updating events (all optional)
export const UpdateEventFormSchema = UpdateEventSchema;

// For approval dialog
export const ApprovalFormSchema = ApprovalSchema.safeExtend({
  feedback: ApprovalSchema.shape.feedback.default(""),
});

// For attendance marking
export const MarkAttendanceFormSchema = MarkAttendanceSchema;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

// Enums
export type EventMode = z.infer<typeof EventModeEnum>;
export type EventStatus = z.infer<typeof EventStatusEnum>;
export type RegistrationStatus = z.infer<typeof RegistrationStatusEnum>;

// Base Types
export type Event = z.infer<typeof EventSchema>;
export type Registration = z.infer<typeof RegistrationSchema>;

// Request Types
export type EventFilters = z.infer<typeof EventFiltersSchema>;
export type CreateEventRequest = z.infer<typeof CreateEventSchema>;
export type UpdateEventRequest = z.infer<typeof UpdateEventSchema>;
export type ApprovalRequest = z.infer<typeof ApprovalSchema>;
export type MarkAttendanceRequest = z.infer<typeof MarkAttendanceSchema>;

// Response Types
export type EventsResponse = z.infer<typeof EventsResponseSchema>;
export type MyEventsResponse = z.infer<typeof MyEventsResponseSchema>;

// Form Types (for React Hook Form)
export type CreateEventFormData = z.infer<typeof CreateEventFormSchema>;
export type UpdateEventFormData = z.infer<typeof UpdateEventFormSchema>;
export type ApprovalFormData = z.infer<typeof ApprovalFormSchema>;
export type MarkAttendanceFormData = z.infer<typeof MarkAttendanceFormSchema>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate event dates manually (for use outside forms)
 */
export const validateEventDates = (date: string, deadline: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const eventDate = new Date(date);
  const registrationDeadline = new Date(deadline);
  const now = new Date();

  if (registrationDeadline >= eventDate) {
    errors.push('Registration deadline must be before the event date');
  }

  if (eventDate <= now) {
    errors.push('Event date must be in the future');
  }

  if (registrationDeadline <= now) {
    errors.push('Registration deadline must be in the future');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate event mode requirements manually
 */
export const validateEventMode = (mode: EventMode, venue?: string, link?: string): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (mode === 'OFFLINE' && !venue) {
    errors.venue = 'Venue is required for offline events';
  }

  if (mode === 'ONLINE' && !link) {
    errors.link = 'Meeting link is required for online events';
  }

  if (mode === 'HYBRID') {
    if (!venue) errors.venue = 'Venue is required for hybrid events';
    if (!link) errors.link = 'Meeting link is required for hybrid events';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Get default form values for create event
 */
// export const getDefaultEventFormValues = (): CreateEventFormData => ({
//   title: '',
//   description: '',
//   date: '',
//   time: '',
//   mode: ,
//   venue: '',
//   link: '',
//   registrationDeadline: '',
//   maxCapacity: 50,
//   category: '',
// });

/**
 * Parse form data for API submission
 */
export const parseEventFormData = (data: CreateEventFormData): CreateEventRequest => {
  return CreateEventSchema.parse({
    ...data,
    venue: data.venue || undefined,
    link: data.link || undefined,
  });
};