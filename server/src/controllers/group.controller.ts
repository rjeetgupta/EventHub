import { Request, Response } from "express";
import groupService from "../services/group.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Get groups for the caller's department (Super Admin: first department)
 * @route GET /api/v1/groups
 * @access Department Admin, Super Admin
 */
export const getGroups = asyncHandler(async (req: Request, res: Response) => {
  const result = await groupService.getGroups(
    req.validated?.query ?? req.query,
    req.user!.id,
    req.user!.role
  );

  res
    .status(200)
    .json(new ApiResponse(200, result, "Groups fetched successfully"));
});

/**
 * Overview stats for the Group Management screen
 * @route GET /api/v1/groups/overview
 * @access Department Admin, Super Admin
 */
export const getGroupOverview = asyncHandler(
  async (req: Request, res: Response) => {
    const overview = await groupService.getGroupOverview(
      req.user?.departmentId
    );

    res
      .status(200)
      .json(new ApiResponse(200, overview, "Group overview fetched successfully"));
  }
);

/**
 * Create a group inside the caller's department
 * @route POST /api/v1/groups
 * @access Department Admin, Super Admin
 */
export const createGroup = asyncHandler(async (req: Request, res: Response) => {
  const group = await groupService.createGroup(
    req.validated?.body ?? req.body,
    req.user!.id,
    req.user!.role
  );

  res
    .status(201)
    .json(new ApiResponse(201, group, "Group created successfully"));
});

/**
 * Update a group (name/description/category/status/admin)
 * @route PUT /api/v1/groups/:groupId
 * @access Department Admin (own department), Super Admin
 */
export const updateGroup = asyncHandler(async (req: Request, res: Response) => {
  const group = await groupService.updateGroup(
    req.params.departmentId,
    req.params.groupId,
    req.validated?.body ?? req.body,
    req.user!.id,
    req.user!.role
  );

  res
    .status(200)
    .json(new ApiResponse(200, group, "Group updated successfully"));
});

/**
 * Delete a group (removes memberships, demotes its admin)
 * @route DELETE /api/v1/groups/:groupId
 * @access Department Admin (own department), Super Admin
 */
export const deleteGroup = asyncHandler(async (req: Request, res: Response) => {
  await groupService.deleteGroup(
    req.params.departmentId,
    req.params.groupId,
    req.user!.id,
    req.user!.role
  );

  res
    .status(200)
    .json(new ApiResponse(200, null, "Group deleted successfully"));
});

/**
 * Toggle a group's active status
 * @route PATCH /api/v1/groups/:groupId/status
 * @access Department Admin (own department), Super Admin
 */
export const toggleGroupStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await groupService.toggleGroupStatus(
      req.params.departmentId,
      req.params.groupId,
      Boolean(req.validated?.body?.isActive ?? req.body?.isActive)
    );

    res
      .status(200)
      .json(new ApiResponse(200, result, "Group status updated successfully"));
  }
);
