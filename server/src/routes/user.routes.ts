import { Router } from "express";
import { getUsers, getUserById } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAllowedToDo } from "../middlewares/isAllowed.middleware.js";
import { UserRole } from "../types/common.types.js";

const router = Router();

// Only admins can list/browse users (e.g. to assign group admins)
router.get(
  "/",
  verifyJWT,
  isAllowedToDo(UserRole.SUPER_ADMIN, UserRole.DEPARTMENT_ADMIN),
  getUsers
);

router.get(
  "/:id",
  verifyJWT,
  isAllowedToDo(UserRole.SUPER_ADMIN, UserRole.DEPARTMENT_ADMIN),
  getUserById
);

export default router;
