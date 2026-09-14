import type { Request, Response } from "express";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

import {
  getStudentAchievementsService,
  getStudentEventsService,
  getStudentCertificatesService,
} from "../services/student.service.js";

export const getMyAchievements = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await getStudentAchievementsService(req.user!.id);

    res.json(new ApiResponse(200, data, "Achievements fetched"));
  }
);

export const getMyEvents = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await getStudentEventsService(req.user!.id);

    res.json(new ApiResponse(200, data, "Event history fetched"));
  }
);

export const getMyCertificates = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await getStudentCertificatesService(req.user!.id);

    res.json(new ApiResponse(200, data, "Certificates fetched"));
  }
);
