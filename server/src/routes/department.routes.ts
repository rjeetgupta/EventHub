import { Router } from "express";
import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getGroupAdmins,
  assignGroupAdmin,
  updateGroupAdminPermissions,
  removeGroupAdmin,
  getAvailablePermissions,
  getDepartmentAnalytics,
} from "../controllers/department.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { isAllowedToDo } from "../middlewares/isAllowed.middleware";
import { validate } from "../middlewares/validate.middleware";
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
} from "../validators/department.validator";
import { UserRole } from "../types/common.types";

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

export default router;