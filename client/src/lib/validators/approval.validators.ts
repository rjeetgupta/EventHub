import { z } from 'zod';

// Approval enums
export const ApprovalActionEnum = z.enum(['approve', 'reject']);
export type ApprovalAction = z.infer<typeof ApprovalActionEnum>;

// ============ APPROVAL SCHEMAS ============

export const approveEventSchema = z.object({
  eventId: z
    .string()
    .min(1, 'Event ID is required'),
  feedback: z
    .string()
    .min(0)
    .max(500, 'Feedback cannot exceed 500 characters')
    .optional()
    .or(z.literal('')),
});

export const rejectEventSchema = z.object({
  eventId: z
    .string()
    .min(1, 'Event ID is required'),
  feedback: z
    .string()
    .min(1, 'Feedback is required for rejection')
    .min(10, 'Feedback must be at least 10 characters')
    .max(500, 'Feedback cannot exceed 500 characters'),
});

export const approvalFiltersSchema = z.object({
  department: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

// ============ TYPE EXPORTS ============

export type ApproveEventInput = z.infer<typeof approveEventSchema>;
export type RejectEventInput = z.infer<typeof rejectEventSchema>;
export type ApprovalFiltersInput = z.infer<typeof approvalFiltersSchema>;
