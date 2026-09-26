import { z } from "zod";

// ============================================================================
// SHARED PARAMS
// ============================================================================

const GroupIdParams = z.object({
  departmentId: z.uuid("Invalid department ID"),
  groupId: z.uuid("Invalid group ID"),
});

export const departmentIdParamSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid department ID"),
  }),
});

// ============================================================================
// GROUP FILTERS (QUERY)
// ============================================================================

const GroupFiltersQuery = z.object({
  search: z.string().trim().optional(),
  status: z.enum(["active", "inactive", "all"]).optional().default("all"),
  category: z.string().trim().optional(),
  sortBy: z
    .enum(["name", "members", "events", "createdAt"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
});

export const groupFiltersSchema = z.object({
  query: GroupFiltersQuery,
});

// ============================================================================
// CREATE GROUP
// ============================================================================

const CreateGroupBody = z.object({
  name: z
    .string("Group name is required")
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name cannot exceed 100 characters")
    .trim(),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .trim()
    .optional(),

  category: z
    .string("Category is required")
    .min(2, "Category must be at least 2 characters")
    .max(50, "Category name is too long")
    .trim(),

  adminId: z.uuid("Invalid group admin ID").optional(),
});

export const createGroupSchema = z.object({
  body: CreateGroupBody,
});

// ============================================================================
// UPDATE GROUP
// ============================================================================

const UpdateGroupBody = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name cannot exceed 100 characters")
      .trim()
      .optional(),

    description: z
      .string()
      .max(500, "Description cannot exceed 500 characters")
      .trim()
      .optional(),

    category: z
      .string()
      .min(2, "Category must be at least 2 characters")
      .max(50, "Category name is too long")
      .trim()
      .optional(),

    isActive: z.boolean().optional(),

    adminId: z.uuid("Invalid group admin ID").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const updateGroupSchema = z.object({
  params: GroupIdParams,
  body: UpdateGroupBody,
});

// ============================================================================
// GROUP ID PARAM
// ============================================================================

export const groupIdParamSchema = z.object({
  params: GroupIdParams,
});

// TYPE EXPORTS

export type CreateGroupInput = z.infer<typeof CreateGroupBody>;
export type UpdateGroupInput = z.infer<typeof UpdateGroupBody>;
export type GroupFiltersInput = z.infer<typeof GroupFiltersQuery>;
