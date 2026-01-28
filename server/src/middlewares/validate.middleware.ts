import { Request, Response, NextFunction } from "express";
import { z, ZodObject, ZodEffects } from "zod"; // ✅ Import ZodEffects correctly
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";

// Extend Request type so TypeScript knows about .validated
declare global {
  namespace Express {
    interface Request {
      validated?: any;
    }
  }
}

/**
 * Validates request data against a Zod schema.
 * Attaches validated & parsed data to req.validated
 */
export const validate = (
  schema: ZodObject<any> | ZodEffects<any> // ✅ Fix type definition
) =>
  asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    const input = {
      body: req.body,
      query: req.query,
      params: req.params,
    };

    const result = await schema.safeParseAsync(input);

    if (!result.success) {
      // Clean, frontend-friendly error format
      const formattedErrors = result.error.issues.map((issue: any) => ({
        field: issue.path.join(".") || "root",
        message: issue.message,
        code: issue.code,
      }));

      throw new ApiError(400, "Validation failed", formattedErrors);
    }

    // Attach validated data
    req.validated = result.data;

    next();
  });