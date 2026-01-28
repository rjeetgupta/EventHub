/**
 * ApiResponse Class
 * Standardizes API responses across the application
 *
 * @param statusCode - HTTP status code
 * @param data - Response data
 * @param message - Response message (default: "Success")
 *
 * @example
 * res.json(new ApiResponse(200, userData, "User fetched successfully"));
 */
class ApiResponse {
  statusCode: number;
  data: any;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: any, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; // Auto-determine success based on status code
  }
}

export default ApiResponse;