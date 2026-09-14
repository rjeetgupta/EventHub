import { Request, Response } from "express";
import userService from "../services/user.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const { departmentId, role, search, excludeGroupAdmins, page, limit } = req.query;

  const result = await userService.getUsers({
    departmentId: departmentId as string | undefined,
    role: role as string | undefined,
    search: search as string | undefined,
    excludeGroupAdmins: excludeGroupAdmins !== "false",
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });

  res.status(200).json(new ApiResponse(200, result, "Users fetched successfully"));
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id as string);

  res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});
