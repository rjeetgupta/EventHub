/**
 * ApiError Class
 * Custom error class for API error handling
 *
 * @param statusCode - HTTP status code (e.g., 400, 401, 404, 500)
 * @param message - Error message
 * @param errors - Array of detailed error objects (optional)
 *
 * @example
 * throw new ApiError(404, "User not found");
 * throw new ApiError(400, "Validation failed", [{ field: "email", message: "Invalid" }]);
 */
class ApiError extends Error {
  statusCode: number;
  success: boolean;
  errors: any[];

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: any[] = []
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;