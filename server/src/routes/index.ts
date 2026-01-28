import { Router } from "express";
import authRoutes from "./auth.routes";
import departmentRoutes from "./department.routes";
import eventRoutes from "./event.routes";

const router = Router();

router.use('/api/v1/auth', authRoutes);
router.use("/api/v1/departments", departmentRoutes);
router.use("/api/v1/events", eventRoutes);

export default router;