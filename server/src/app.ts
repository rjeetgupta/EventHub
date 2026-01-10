import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser"
import { errorHandler } from './middlewares/error.middleware.js';

const app: Application = express();

/**
 * Middleware Configuration
 * - CORS: Enable cross-origin requests
 * - Cookie Parser: Parse incoming cookies
 * - JSON: Parse JSON request bodies
 * - URL Encoded: Parse URL-encoded bodies
 */
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Route Imports
 * All API routes are imported here
 */
import authRoutes from './routes/auth.routes.js';


/**
 * Route Registration
 * All routes prefixed with /api/v1
 */
app.use('/api/v1/auth', authRoutes);


/**
 * Health Check Endpoint
 * Used for monitoring and verifying server is running
 */
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * 404 Handler
 * Handles requests to non-existent routes
 */
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'Route not found',
  });
});

/**
 * Global Error Handler Middleware
 * Must be last middleware - catches all errors
 */
app.use(errorHandler);

export default app;