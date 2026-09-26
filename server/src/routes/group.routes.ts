import { Router } from "express";
import {
  getGroups,
  getGroupOverview,
  createGroup,
  updateGroup,
  deleteGroup,
  toggleGroupStatus,
} from "../controllers/group.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAllowedToDo } from "../middlewares/isAllowed.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  groupFiltersSchema,
  createGroupSchema,
  updateGroupSchema,
  groupIdParamSchema,
  departmentIdParamSchema,
} from "../validators/group.validator.js";
import { ToggleStatusSchema } from "../validators/department.validator.js";
import { UserRole } from "../types/common.types.js";

const router = Router();

// ============================================================================
// SPECIFIC ROUTES (must come BEFORE /:groupId to avoid being caught by param)
// ============================================================================

router.get(
  "/overview",
  verifyJWT,
  isAllowedToDo(UserRole.DEPARTMENT_ADMIN, UserRole.SUPER_ADMIN),
  getGroupOverview
);

// ============================================================================
// GROUP CRUD
// ============================================================================

router
  .route("/")
  .get(
    verifyJWT,
    isAllowedToDo(UserRole.DEPARTMENT_ADMIN, UserRole.SUPER_ADMIN),
    validate(groupFiltersSchema),
    getGroups
  )
  .post(
    verifyJWT,
    isAllowedToDo(UserRole.DEPARTMENT_ADMIN, UserRole.SUPER_ADMIN),
    validate(createGroupSchema),
    createGroup
  );

router
  .route("/:groupId")
  .put(
    verifyJWT,
    isAllowedToDo(UserRole.DEPARTMENT_ADMIN, UserRole.SUPER_ADMIN),
    validate(updateGroupSchema),
    updateGroup
  )
  .delete(
    verifyJWT,
    isAllowedToDo(UserRole.DEPARTMENT_ADMIN, UserRole.SUPER_ADMIN),
    validate(departmentIdParamSchema.shape.params),
    validate(groupIdParamSchema),
    deleteGroup
  );

router.patch(
  "/:groupId/status",
  verifyJWT,
  isAllowedToDo(UserRole.DEPARTMENT_ADMIN, UserRole.SUPER_ADMIN),
  validate(groupIdParamSchema),
  validate(ToggleStatusSchema),
  toggleGroupStatus
);

export default router;
