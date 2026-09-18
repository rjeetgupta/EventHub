import { Request, Response } from "express";
import dashboardService from "../services/dashboard.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getAdminDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const dashboard = await dashboardService.getAdminDashboard();
  res.status(200).json(new ApiResponse(200, dashboard, "Admin dashboard fetched successfully"));
});
