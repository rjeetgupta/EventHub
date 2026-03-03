import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";

declare global {
  namespace Express {
    interface Request {
      validated: {
        body: Record<string, any>;
        params: Record<string, any>;
        query: Record<string, any>;
      };
    }
  }
}

export const validate = (schema: ZodSchema) =>
  asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    const result = await schema.safeParseAsync({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      throw new ApiError(
        400,
        "Validation failed",
        result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }))
      );
    }

    // Initialize validated if not present
    if (!req.validated) {
      req.validated = { body: {}, params: {}, query: {} };
    }

    // Merge validated data (supports chained validate() calls)
    const data = result.data as {
      body?: Record<string, unknown>;
      params?: Record<string, unknown>;
      query?: Record<string, unknown>;
    };

    if (data.body !== undefined) req.validated.body = data.body;
    if (data.params !== undefined) {
      req.validated.params = { ...req.validated.params, ...data.params };
    }
    if (data.query !== undefined) req.validated.query = data.query;

    next();
  });