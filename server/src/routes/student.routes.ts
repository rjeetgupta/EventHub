import { Router } from "express";
import {
  getMyAchievements,
  getMyEvents,
  getMyCertificates,
} from "../controllers/student.controller";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/me/achievements", verifyJWT, getMyAchievements);
router.get("/me/events", verifyJWT, getMyEvents);
router.get("/me/certificates", verifyJWT, getMyCertificates);
// router.get(
//   "/students/:studentId/profile",
//   verifyJWT,
//   getPublicStudentProfile
// );

export default router;
