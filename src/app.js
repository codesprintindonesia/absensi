import { httpServer, httpPort } from "./servers/http.server.js";
import { validateEnv } from "./validations/env.validation.js";
import { initializeTracing } from "./configs/tracing.config.js";
import chalk from "chalk";
import { logger } from "./libraries/logger.library.js"; 

// ================================================================
// STEP 1: Initialize OpenTelemetry FIRST (before any imports)
// ================================================================
const tracingSDK = initializeTracing();

// ================================================================
// STEP 2: Validate Environment
// ================================================================
try {
  const validEnv = validateEnv();
  logger.info("Environment validated", {
    // GANTI console.log
    database: validEnv.DATABASE,
    port: validEnv.PORT,
    signoz: validEnv.SIGNOZ_ENABLED,
  });
} catch (error) {
  logger.error("Environment validation failed", {
    // GANTI console.error
    error: error.message,
  });
  process.exit(1);
} 

// ================================================================
// STEP 3: Start HTTP Server
// ================================================================
httpServer.listen(httpPort, "0.0.0.0", () => {
  logger.info("HTTP server started", {
    // GANTI console.log
    port: httpPort,
    env: process.env.NODE_ENV,
  });
});

const shutdown = async (signal) => {
  logger.info("Shutdown initiated", { signal });
  
  httpServer.close(() => {
    logger.info("HTTP server closed");
  });
  
  if (tracingSDK) {
    await tracingSDK.shutdown();
    logger.info("Tracing SDK shutdown complete");
  }
  
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
