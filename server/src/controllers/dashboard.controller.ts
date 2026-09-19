import { Request, Response } from "express";
import dashboardService from "../services/dashboard.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getAdminDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const dashboard = await dashboardService.getAdminDashboard();
  res.status(200).json(new ApiResponse(200, dashboard, "Admin dashboard fetched successfully"));
});

export const getDepartmentDashboard = asyncHandler(async (req: Request, res: Response) => {
  const dashboard = await dashboardService.getDepartmentDashboard(req.user!.id);
  res.status(200).json(new ApiResponse(200, dashboard, "Department dashboard fetched successfully"));
});

export const getGroupDashboard = asyncHandler(async (req: Request, res: Response) => {
  const dashboard = await dashboardService.getGroupDashboard(req.user!.id);
  res.status(200).json(new ApiResponse(200, dashboard, "Group dashboard fetched successfully"));
});

export const getStudentDashboard = asyncHandler(async (req: Request, res: Response) => {
  const dashboard = await dashboardService.getStudentDashboard(req.user!.id);
  res.status(200).json(new ApiResponse(200, dashboard, "Student dashboard fetched successfully"));
});
