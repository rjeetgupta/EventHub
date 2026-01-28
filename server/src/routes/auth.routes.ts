import { Router } from "express";
import {
  login,
  register,
  refreshToken,
  logout,
  changeUserPassword,
  updateUserProfile,
  getProfileDetails,
} from "../controllers/auth.controller";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/refresh-token").post(refreshToken);
router.route("/logout").post(verifyJWT, logout);

// Protected routes (require authentication)
router.route("/change-password").post(verifyJWT, changeUserPassword);
router.route("/update-profile").put(verifyJWT, updateUserProfile);
router.route("/profile").get(verifyJWT, getProfileDetails);

export default router;