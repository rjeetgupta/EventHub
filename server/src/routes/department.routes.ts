import { Router } from "express";
import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  updateDepartmentStatus,
  getGroupAdmins,
  assignGroupAdmin,
  updateGroupAdminPermissions,
  removeGroupAdmin,
  toggleGroupAdminStatus,
  getAvailablePermissions,
  getDepartmentAnalytics,
} from "../controllers/department.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAllowedToDo } from "../middlewares/isAllowed.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  CreateDepartmentSchema,
  UpdateDepartmentSchema,
  AssignGroupAdminSchema,
  UpdateGroupAdminPermissionsSchema,
  DepartmentFiltersSchema,
  GroupAdminFiltersSchema,
  DepartmentAnalyticsFiltersSchema,
  departmentIdSchema,
  groupAdminIdSchema,
  ToggleStatusSchema,
  updateDepartmentStatusSchema,
} from "../validators/department.validator.js";
import { UserRole } from "../types/common.types.js";

const router = Router();

// ============================================================================
// SPECIFIC ROUTES (must come BEFORE /:id to avoid being caught by param)
// ============================================================================

router.get("/permissions", verifyJWT, getAvailablePermissions);

// ============================================================================
// DEPARTMENT CRUD
// ============================================================================

router
  .route("/")
  .get(
    verifyJWT,
    validate(DepartmentFiltersSchema),
    getDepartments
  )
  .post(
    verifyJWT,
    isAllowedToDo(UserRole.SUPER_ADMIN),
    validate(CreateDepartmentSchema),
    createDepartment
  );

router
  .route("/:id")
  .get(
    validate(departmentIdSchema),
    getDepartmentById
  )
  .put(
    verifyJWT,
    isAllowedToDo(UserRole.SUPER_ADMIN, UserRole.DEPARTMENT_ADMIN),
    validate(departmentIdSchema),
    validate(UpdateDepartmentSchema),
    updateDepartment
  )
  .delete(
    verifyJWT,
    isAllowedToDo(UserRole.SUPER_ADMIN),
    validate(departmentIdSchema),
    deleteDepartment
  );

router
  .route("/:id/status")
  .patch(
    verifyJWT,
    isAllowedToDo(UserRole.SUPER_ADMIN),
    validate(updateDepartmentStatusSchema),
    updateDepartmentStatus
  );

// ============================================================================
// ANALYTICS
// ============================================================================

router.get(
  "/:id/analytics",
  verifyJWT,
  isAllowedToDo(UserRole.SUPER_ADMIN, UserRole.DEPARTMENT_ADMIN),
  validate(departmentIdSchema),
  validate(DepartmentAnalyticsFiltersSchema),
  getDepartmentAnalytics
);

// ============================================================================
// GROUP ADMIN MANAGEMENT
// ============================================================================

router
  .route("/:id/group-admins")
  .get(
    verifyJWT,
    isAllowedToDo(UserRole.SUPER_ADMIN, UserRole.DEPARTMENT_ADMIN),
    validate(departmentIdSchema),
    validate(GroupAdminFiltersSchema),
    getGroupAdmins
  )
  .post(
    verifyJWT,
    isAllowedToDo(UserRole.SUPER_ADMIN, UserRole.DEPARTMENT_ADMIN),
    validate(departmentIdSchema),
    validate(AssignGroupAdminSchema),
    assignGroupAdmin
  );

router
  .route("/:departmentId/group-admins/:groupAdminId/permissions")
  .put(
    verifyJWT,
    isAllowedToDo(UserRole.SUPER_ADMIN, UserRole.DEPARTMENT_ADMIN),
    validate(groupAdminIdSchema),
    validate(UpdateGroupAdminPermissionsSchema),
    updateGroupAdminPermissions
  );

router
  .route("/:departmentId/group-admins/:groupAdminId")
  .delete(
    verifyJWT,
    isAllowedToDo(UserRole.SUPER_ADMIN, UserRole.DEPARTMENT_ADMIN),
    validate(groupAdminIdSchema),
    removeGroupAdmin
  );

router
  .route("/:departmentId/group-admins/:groupAdminId/status")
  .patch(
    verifyJWT,
    isAllowedToDo(UserRole.SUPER_ADMIN, UserRole.DEPARTMENT_ADMIN),
    validate(groupAdminIdSchema),
    validate(ToggleStatusSchema),
    toggleGroupAdminStatus
  );

export default router;