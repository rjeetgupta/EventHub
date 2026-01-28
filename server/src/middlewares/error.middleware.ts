import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import ApiError from "../utils/ApiError";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const isDev = process.env.NODE_ENV !== "production";

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors?.length ? err.errors : undefined,
      timestamp: new Date().toISOString(),
      ...(isDev && { stack: err.stack }),
    });
  }

  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((issue) => ({
      field: issue.path.join(".") || "root",
      message: issue.message,
      code: issue.code,
    }));

    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Validation failed",
      errors: formattedErrors,
      timestamp: new Date().toISOString(),
    });
  }

  if (err instanceof Error) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Invalid or malformed token",
        timestamp: new Date().toISOString(),
      });
    }

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Token has expired",
        timestamp: new Date().toISOString(),
      });
    }

    if (err.name === "NotBeforeError") {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Token not yet valid",
        timestamp: new Date().toISOString(),
      });
    }
  }

  console.error("[Unexpected Error]", err);

  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: isDev
      ? err instanceof Error
        ? err.message
        : "Unknown error"
      : "Internal server error",
    timestamp: new Date().toISOString(),
    ...(isDev && {
      stack: err instanceof Error ? err.stack : undefined,
    }),
  });
};