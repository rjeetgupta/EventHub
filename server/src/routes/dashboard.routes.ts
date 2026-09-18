import { Router } from "express";
import { getAdminDashboard } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAllowedToDo } from "../middlewares/isAllowed.middleware.js";
import { UserRole } from "../types/common.types.js";

const router = Router();

router.get("/admin", verifyJWT, isAllowedToDo(UserRole.SUPER_ADMIN), getAdminDashboard);

export default router;
