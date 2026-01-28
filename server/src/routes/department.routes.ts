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
  createDepartmentSchema,
  updateDepartmentSchema,
  departmentIdParamSchema,
  assignGroupAdminSchema,
  updateGroupAdminPermissionsSchema,
  removeGroupAdminSchema,
  departmentFiltersSchema,
  groupAdminFiltersSchema,
  analyticsFiltersSchema,
} from "../validators/department.validator";
import { UserRole } from "../types/common.types";

const router = Router();


/**
 * @route   GET /api/v1/departments
 * @desc    Get all departments
 * @access  Public
 */
router
  .route("/")
  .get(validate(departmentFiltersSchema), getDepartments)

  /**
   * @route   POST /api/v1/departments
   * @desc    Create new department
   * @access  Super Admin only
   */
  .post(
    verifyJWT,
    isAllowedToDo(UserRole.SUPER_ADMIN),
    validate(createDepartmentSchema),
    createDepartment
  );

/**
 * @route   GET /api/v1/departments/:id
 * @desc    Get department by ID
 * @access  Public
 */
router
  .route("/:id")
  .get(validate(departmentIdParamSchema), getDepartmentById)

  /**
   * @route   PUT /api/v1/departments/:id
   * @desc    Update department
   * @access  Super Admin, Department Admin (own department)
   */
  .put(
    verifyJWT,
    isAllowedToDo(UserRole.SUPER_ADMIN, UserRole.DEPARTMENT_ADMIN),
    validate(updateDepartmentSchema),
    updateDepartment
  )

  /**
   * @route   DELETE /api/v1/departments/:id
   * @desc    Delete department
   * @access  Super Admin only
   */
  .delete(
    verifyJWT,
    isAllowedToDo(UserRole.SUPER_ADMIN),
    validate(departmentIdParamSchema),
    deleteDepartment
  );

// ============================================================================
// GROUP ADMIN ROUTES
// ============================================================================

/**
 * @route   GET /api/v1/departments/:id/group-admins
 * @desc    Get all group admins for department
 * @access  Department Admin, Super Admin
 */
router
  .route("/:id/group-admins")
  .get(
    verifyJWT,
    isAllowedToDo(UserRole.SUPER_ADMIN, UserRole.DEPARTMENT_ADMIN),
    validate(groupAdminFiltersSchema),
    getGroupAdmins
  )

  /**
   * @route   POST /api/v1/departments/:id/group-admins
   * @desc    Assign user as group admin
   * @access  Department Admin, Super Admin
   */
  .post(
    verifyJWT,
    isAllowedToDo(UserRole.SUPER_ADMIN, UserRole.DEPARTMENT_ADMIN),
    validate(assignGroupAdminSchema),
    assignGroupAdmin
  );

/**
 * @route   PUT /api/v1/departments/:id/group-admins/:userId/permissions
 * @desc    Update group admin permissions
 * @access  Department Admin, Super Admin
 */
router
  .route("/:id/group-admins/:userId/permissions")
  .put(
    verifyJWT,
    isAllowedToDo(UserRole.SUPER_ADMIN, UserRole.DEPARTMENT_ADMIN),
    validate(updateGroupAdminPermissionsSchema),
    updateGroupAdminPermissions
  );

/**
 * @route   DELETE /api/v1/departments/:id/group-admins/:userId
 * @desc    Remove group admin
 * @access  Department Admin, Super Admin
 */
router
  .route("/:id/group-admins/:userId")
  .delete(
    verifyJWT,
    isAllowedToDo(UserRole.SUPER_ADMIN, UserRole.DEPARTMENT_ADMIN),
    validate(removeGroupAdminSchema),
    removeGroupAdmin
  );

// ============================================================================
// PERMISSION ROUTES
// ============================================================================

/**
 * @route   GET /api/v1/departments/permissions
 * @desc    Get available permissions
 * @access  Authenticated
 */
router.route("/permissions").get(verifyJWT, getAvailablePermissions);

// ============================================================================
// ANALYTICS ROUTES
// ============================================================================

/**
 * @route   GET /api/v1/departments/:id/analytics
 * @desc    Get department analytics
 * @access  Department Admin, Super Admin
 */
router
  .route("/:id/analytics")
  .get(
    verifyJWT,
    isAllowedToDo(UserRole.SUPER_ADMIN, UserRole.DEPARTMENT_ADMIN),
    validate(analyticsFiltersSchema),
    getDepartmentAnalytics
  );

export default router;