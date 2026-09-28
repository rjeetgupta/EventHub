import { z } from "zod";
import { Permission } from "../types/common.types.js";

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
  userId: z
    .string({ error: "User ID is required" })
    .uuid({ error: "Invalid user ID format" }),

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

// UPDATE DEPARTMENT STATUS

export const updateDepartmentStatusSchema = z.object({
  params: departmentIdSchema.shape.params,
  body: ToggleStatusSchema.shape.body,
});

// ANALYTICS FILTERS (QUERY)

const DepartmentAnalyticsFiltersQuery = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const DepartmentAnalyticsFiltersSchema = z.object({
  query: DepartmentAnalyticsFiltersQuery,
});

// DEPARTMENT REGISTRATIONS FILTERS (QUERY)

const DepartmentRegistrationsFiltersQuery = z.object({
  /** Scope everything to a single event ("Manage Registrations" deep link). */
  eventId: z.uuid("Invalid event ID").optional(),
  /** UI status buckets (see deriveRegistrationStatus). */
  status: z.enum(["CONFIRMED", "CANCELLED", "OTHERS"]).optional(),
  search: z.string().trim().optional(),
  /** GroupAdmin user id (membership admin). */
  group: z.uuid("Invalid group ID").optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export const DepartmentRegistrationsFiltersSchema = z.object({
  query: DepartmentRegistrationsFiltersQuery,
});

// DEPARTMENT STUDENTS FILTERS (QUERY)

const DepartmentStudentsFiltersQuery = z.object({
  search: z.string().trim().optional(),
  year: z.string().optional(),
  section: z.string().optional(),
  status: z.enum(["active", "inactive", "top"]).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  sortBy: z.enum(["eventsJoined", "name", "joinedAt"]).optional().default("eventsJoined"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export const DepartmentStudentsFiltersSchema = z.object({
  query: DepartmentStudentsFiltersQuery,
});

// CREATE DEPARTMENT STUDENT

export const CreateDepartmentStudentSchema = z.object({
  body: z.object({
    fullName: z
      .string("Full name is required")
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name cannot exceed 100 characters")
      .trim(),
    email: z.string("Email is required").email("Invalid email format").trim().toLowerCase(),
    studentID: z.string().trim().max(20).optional(),
    password: z
      .string("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(100),
    isActive: z.boolean().optional(),
  }),
});

// TOGGLE STUDENT STATUS

export const DepartmentStudentStatusSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid department ID"),
    studentId: z.uuid("Invalid student ID"),
  }),
  body: z.object({
    isActive: z.boolean("isActive is required"),
  }),
});

// TYPE EXPORTS

export type CreateDepartmentInput = z.infer<typeof CreateDepartmentBody>;
export type UpdateDepartmentInput = z.infer<typeof UpdateDepartmentBody>;
export type AssignGroupAdminInput = z.infer<typeof AssignGroupAdminBody>;
export type UpdateGroupAdminPermissionsInput = z.infer<
  typeof UpdateGroupAdminPermissionsBody
>;
export type DepartmentFiltersInput = z.infer<typeof DepartmentFiltersQuery>;
export type GroupAdminFiltersInput = z.infer<typeof GroupAdminFiltersQuery>;
export type ToggleStatusInput = z.infer<typeof ToggleStatusSchema>;
export type UpdateDepartmentStatusInput = z.infer<
  typeof updateDepartmentStatusSchema
>;
export type DepartmentAnalyticsFiltersInput = z.infer<
  typeof DepartmentAnalyticsFiltersQuery
>;
export type DepartmentRegistrationsFiltersInput = z.infer<
  typeof DepartmentRegistrationsFiltersQuery
>;
export type DepartmentStudentsFiltersInput = z.infer<
  typeof DepartmentStudentsFiltersQuery
>;
