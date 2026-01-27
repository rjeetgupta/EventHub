import { z } from 'zod';

// Event enums
export const EventModeEnum = z.enum(['Online', 'Offline', 'Hybrid']);
export type EventMode = z.infer<typeof EventModeEnum>;

export const EventStatusEnum = z.enum([
  'draft',
  'pending',
  'approved',
  'upcoming',
  'finished',
]);
export type EventStatus = z.infer<typeof EventStatusEnum>;

// ============ EVENT SCHEMAS ============

export const createEventSchema = z.object({
  title: z
    .string()
    .min(1, 'Event title is required')
    .min(5, 'Event title must be at least 5 characters')
    .max(200, 'Event title cannot exceed 200 characters'),
  description: z
    .string()
    .min(1, 'Event description is required')
    .min(20, 'Event description must be at least 20 characters')
    .max(2000, 'Event description cannot exceed 2000 characters'),
  department: z
    .string()
    .min(1, 'Department is required'),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category cannot exceed 50 characters'),
  date: z
    .string()
    .min(1, 'Event date is required'),
  time: z
    .string()
    .min(1, 'Event time is required')
    .regex(/^([0-1]\d|2[0-3]):[0-5]\d$/, 'Time must be in HH:MM format'),
  mode: EventModeEnum,
  venue: z
    .string()
    .min(3, 'Venue must be at least 3 characters')
    .max(200, 'Venue cannot exceed 200 characters')
    .optional()
    .or(z.literal('')),
  link: z
    .string()
    .url('Please provide a valid URL')
    .optional()
    .or(z.literal('')),
  registrationDeadline: z
    .string()
    .min(1, 'Registration deadline is required'),
  maxCapacity: z
    .number()
    .int('Max capacity must be a whole number')
    .min(1, 'Max capacity must be at least 1')
    .max(10000, 'Max capacity cannot exceed 10,000'),
  certificateAvailable: z.boolean().default(false),
  agenda: z
    .array(z.string().min(1, 'Agenda item cannot be empty'))
    .optional(),
});

export const updateEventSchema = createEventSchema.partial().extend({
  status: EventStatusEnum.optional(),
});

export const eventFiltersSchema = z.object({
  departments: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  dateRange: z.enum(['today', 'week', 'month', 'custom']).optional(),
  mode: z.enum(['All', 'Online', 'Offline', 'Hybrid']).optional(),
  status: z.enum(['upcoming', 'finished']).optional(),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export const registerForEventSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
});

// ============ TYPE EXPORTS ============

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type EventFiltersInput = z.infer<typeof eventFiltersSchema>;
export type RegisterForEventInput = z.infer<typeof registerForEventSchema>;
