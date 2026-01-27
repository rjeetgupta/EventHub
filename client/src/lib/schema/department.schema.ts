import { z } from "zod";

/**
 * Create Department
 */
export const createDepartmentSchema = z.object({
  name: z
    .string()
    .min(3, "Department name must be at least 3 characters"),
  code: z
    .string()
    .min(2)
    .max(10)
    .regex(/^[A-Z0-9_-]+$/, "Invalid department code"),
});

export type CreateDepartmentFormData = z.infer<typeof createDepartmentSchema>;

/**
 * Update Department
 */
export const updateDepartmentSchema = z.object({
  name: z
    .string()
    .min(3)
    .optional(),
  code: z
    .string()
    .min(2)
    .max(10)
    .regex(/^[A-Z0-9_-]+$/)
    .optional(),
});

export type UpdateDepartmentFormData = z.infer<typeof updateDepartmentSchema>;
