import { Request, Response, NextFunction } from 'express';

/**
 * Async Handler Wrapper
 * Wraps async controller functions to catch errors automatically
 * Prevents try-catch boilerplate in every controller
 *
 * @param fn - Async controller function
 * @returns Wrapped function that catches errors
 *
 * @example
 * export const getUser = asyncHandler(async (req, res) => {
 *   const user = await User.findById(req.params.id);
 *   res.json(new ApiResponse(200, user, "User fetched"));
 * });
 */
type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

const asyncHandler = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;