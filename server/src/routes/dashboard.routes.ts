import { Router } from "express";
import {
  getAdminDashboard,
  getDepartmentDashboard,
  getGroupDashboard,
  getStudentDashboard,
} from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAllowedToDo } from "../middlewares/isAllowed.middleware.js";
import { UserRole } from "../types/common.types.js";

const router = Router();

router.get("/admin", verifyJWT, isAllowedToDo(UserRole.SUPER_ADMIN), getAdminDashboard);
router.get("/department", verifyJWT, isAllowedToDo(UserRole.DEPARTMENT_ADMIN), getDepartmentDashboard);
router.get("/group", verifyJWT, isAllowedToDo(UserRole.GROUP_ADMIN), getGroupDashboard);
router.get("/student", verifyJWT, isAllowedToDo(UserRole.STUDENT), getStudentDashboard);

export default router;
