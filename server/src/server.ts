import app from "./app.js";
import dotenv from "dotenv";

/**
 * Load environment variables from .env file
 */
dotenv.config();

/**
 * Server Configuration
 * PORT: Default to 8000 if not specified in .env
 */
const PORT: number = Number(process.env.PORT) || 4000;

/**
 * Start Express Server
 * Logs server startup information
 */
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

/**
 * Graceful Shutdown
 * Handle process termination signals
 */
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  process.exit(0);
});
