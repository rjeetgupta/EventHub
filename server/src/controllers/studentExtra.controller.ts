import type { Request, Response } from "express";
import { z } from "zod";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  listBookmarksService,
  addBookmarkService,
  removeBookmarkService,
  listGroupsService,
  getGroupDetailService,
  joinGroupService,
  leaveGroupService,
} from "../services/studentExtra.service.js";

const idSchema = z.object({ id: z.string().uuid() });

// ============================================================================
// BOOKMARKS
// ============================================================================

export const getMyBookmarks = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await listBookmarksService(req.user!.id);
    res.json(new ApiResponse(200, data, "Bookmarks fetched"));
  }
);

export const bookmarkEvent = asyncHandler(
  async (req: Request, res: Response) => {
    const { eventId } = z.object({ eventId: z.string().uuid() }).parse(req.body);
    const data = await addBookmarkService(req.user!.id, eventId);
    res.status(201).json(new ApiResponse(201, data, "Event bookmarked"));
  }
);

export const unbookmarkEvent = asyncHandler(
  async (req: Request, res: Response) => {
    const { eventId } = z.object({ eventId: z.string().uuid() }).parse(req.body);
    await removeBookmarkService(req.user!.id, eventId);
    res.json(new ApiResponse(200, null, "Bookmark removed"));
  }
);

// ============================================================================
// GROUPS & CLUBS + MEMBERSHIP
// ============================================================================

export const getGroups = asyncHandler(async (req: Request, res: Response) => {
  const data = await listGroupsService(req.user?.id);
  res.json(new ApiResponse(200, data, "Groups fetched"));
});

export const getGroupDetail = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = idSchema.parse(req.params);
    const data = await getGroupDetailService(id, req.user?.id);
    res.json(new ApiResponse(200, data, "Group fetched"));
  }
);

export const joinGroup = asyncHandler(async (req: Request, res: Response) => {
  const { id } = idSchema.parse(req.params);
  await joinGroupService(req.user!.id, id);
  res.json(new ApiResponse(200, null, "Joined the group"));
});

export const leaveGroup = asyncHandler(async (req: Request, res: Response) => {
  const { id } = idSchema.parse(req.params);
  await leaveGroupService(req.user!.id, id);
  res.json(new ApiResponse(200, null, "Left the group"));
});
