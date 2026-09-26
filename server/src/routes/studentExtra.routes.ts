import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getMyBookmarks,
  bookmarkEvent,
  unbookmarkEvent,
  getGroups,
  getGroupDetail,
  joinGroup,
  leaveGroup,
} from "../controllers/studentExtra.controller.js";

const router = Router();

// Bookmarks
router.get("/me/bookmarks", verifyJWT, getMyBookmarks);
router.post("/me/bookmarks", verifyJWT, bookmarkEvent);
router.delete("/me/bookmarks", verifyJWT, unbookmarkEvent);

// Groups & clubs (group-admin led groups) + membership
router.get("/groups", verifyJWT, getGroups);
router.get("/groups/:id", verifyJWT, getGroupDetail);
router.post("/groups/:id/join", verifyJWT, joinGroup);
router.post("/groups/:id/leave", verifyJWT, leaveGroup);

export default router;
