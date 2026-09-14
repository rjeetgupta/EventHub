import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser"
import { errorHandler } from './middlewares/error.middleware.js';
import routes from "./routes/index.js"

const app: Application = express();

/**
 * Middleware Configuration
 * - CORS: Enable cross-origin requests
 * - Cookie Parser: Parse incoming cookies
 * - JSON: Parse JSON request bodies
 * - URL Encoded: Parse URL-encoded bodies
 */
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * configure cors
 */
app.use(cors({
  origin: [
    'http://localhost:3000',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

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
 * Route Registration
 * All routes are registered here (auth, departments, events, users)
 * via routes/index.ts, each already prefixed with /api/v1/...
 */
app.use(routes);

/**
 * 404 Handler
 * Handles requests to non-existent routes.
 * IMPORTANT: this must come AFTER route registration above,
 * otherwise every request gets caught here before reaching real routes.
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