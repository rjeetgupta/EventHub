import { z } from "zod";
import { Permission } from "../types/common.types";

// DEPARTMENT FILTERS (QUERY)

const DepartmentFiltersQuery = z.object({
  search: z.string().trim().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  sortBy: z.enum(["name", "code", "createdAt"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  isActive: z
    .string()
    .transform((val) => val === "true")
    .optional(),
});

export const DepartmentFiltersSchema = z.object({
  query: DepartmentFiltersQuery,
});

// CREATE DEPARTMENT

const CreateDepartmentBody = z.object({
  name: z
    .string("Department name is required")
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name cannot exceed 100 characters")
    .trim(),

  code: z
    .string("Department code is required")
    .min(2, "Code must be at least 2 characters")
    .max(10, "Code cannot exceed 10 characters")
    .trim()
    .toUpperCase(),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .trim()
    .optional(),

  adminEmail: z
    .string("Admin email is required")
    .email("Invalid email format")
    .trim()
    .toLowerCase(),

  adminFullName: z
    .string("Admin full name is required")
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name cannot exceed 100 characters")
    .trim(),

  adminPassword: z
    .string("Admin password is required")
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password cannot exceed 100 characters"),
});

export const CreateDepartmentSchema = z.object({
  body: CreateDepartmentBody,
});

// UPDATE DEPARTMENT

const UpdateDepartmentBody = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name cannot exceed 100 characters")
      .trim()
      .optional(),

    code: z
      .string()
      .min(2, "Code must be at least 2 characters")
      .max(10, "Code cannot exceed 10 characters")
      .trim()
      .toUpperCase()
      .optional(),

    description: z
      .string()
      .max(500, "Description cannot exceed 500 characters")
      .trim()
      .optional()
      .nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const UpdateDepartmentSchema = z.object({
  body: UpdateDepartmentBody,
});

// ASSIGN GROUP ADMIN

const AssignGroupAdminBody = z.object({
  userId: z.string({ error: "User ID is required" }).uuid({ error: "Invalid user ID format" }),

  permissions: z
    .array(z.enum(Permission), { error: "Permissions array is required" })
    .min(1, { error: "At least one permission is required" })
    .max(10, { error: "Cannot assign more than 10 permissions at once" }),
});

export const AssignGroupAdminSchema = z.object({
  body: AssignGroupAdminBody,
});

// UPDATE GROUP ADMIN PERMISSIONS

const UpdateGroupAdminPermissionsBody = z.object({
  permissions: z
    .array(z.enum(Permission), { error: "Permissions array is required" })
    .min(1, { error: "At least one permission is required" })
    .max(10, { error: "Cannot assign more than 10 permissions at once" }),
});

export const UpdateGroupAdminPermissionsSchema = z.object({
  body: UpdateGroupAdminPermissionsBody,
});

// GROUP ADMIN FILTERS (QUERY)

const GroupAdminFiltersQuery = z.object({
  search: z.string().trim().optional(),
  isActive: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export const GroupAdminFiltersSchema = z.object({
  query: GroupAdminFiltersQuery,
});

// DEPARTMENT ID PARAM
export const departmentIdSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid department ID"),
  }),
});

// GROUP ADMIN ID PARAMS
export const groupAdminIdSchema = z.object({
  params: z.object({
    departmentId: z.uuid("Invalid department ID"),
    groupAdminId: z.uuid("Invalid group admin ID"),
  }),
});

// TOGGLE STATUS

export const ToggleStatusSchema = z.object({
  body: z.object({
    isActive: z.boolean("isActive is required"),
  }),
});

// ANALYTICS FILTERS (QUERY)

const DepartmentAnalyticsFiltersQuery = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const DepartmentAnalyticsFiltersSchema = z.object({
  query: DepartmentAnalyticsFiltersQuery,
});

// TYPE EXPORTS

export type CreateDepartmentInput = z.infer<typeof CreateDepartmentBody>;
export type UpdateDepartmentInput = z.infer<typeof UpdateDepartmentBody>;
export type AssignGroupAdminInput = z.infer<typeof AssignGroupAdminBody>;
export type UpdateGroupAdminPermissionsInput = z.infer<typeof UpdateGroupAdminPermissionsBody>;
export type DepartmentFiltersInput = z.infer<typeof DepartmentFiltersQuery>;
export type GroupAdminFiltersInput = z.infer<typeof GroupAdminFiltersQuery>;
export type ToggleStatusInput = z.infer<typeof ToggleStatusSchema>;
export type DepartmentAnalyticsFiltersInput = z.infer<typeof DepartmentAnalyticsFiltersQuery>;