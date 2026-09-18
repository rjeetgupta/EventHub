import { Router } from "express";
import authRoutes from "./auth.routes.js";
import departmentRoutes from "./department.routes.js";
import eventRoutes from "./event.routes.js";
import userRoutes from "./user.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

const router = Router();

router.use('/api/v1/auth', authRoutes);
router.use("/api/v1/departments", departmentRoutes);
router.use("/api/v1/events", eventRoutes);
router.use("/api/v1/users", userRoutes);
router.use("/api/v1/dashboard", dashboardRoutes);

export default router;
