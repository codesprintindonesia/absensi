import express from "express";
import { config as dotenv } from "dotenv";
import Database from "../libraries/databaseConnection.library.js";
import "../models/associations.model.js";
import mainRoutes from "../routes/main.route.js";
import { logger } from "../libraries/logger.library.js";
import { tracingMiddleware } from "../middlewares/tracing.middleware.js";

dotenv();

const httpServer = express();
const httpPort = process.env.PORT || 3000;

/* connect ke database */
(async () => {
  try {
    const db = new Database();
    await db.connect(process.env.DATABASE);
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
  }
})();

/* middleware dasar */
httpServer.use(express.json());
httpServer.use(express.urlencoded({ extended: false }));

/* IMPORTANT: Add tracing middleware EARLY in the stack */
if (process.env.SIGNOZ_ENABLED === 'true') {
  httpServer.use(tracingMiddleware);
}

/* routes */
httpServer.use("/", mainRoutes);

/* health check */
httpServer.get("/health", (req, res) => {
  logger.info("Health check called", { timestamp: new Date().toISOString() });
  res.json({ 
    ok: true, 
    env: process.env.NODE_ENV, 
    db: process.env.DATABASE,
    tracing: process.env.SIGNOZ_ENABLED === 'true' ? 'enabled' : 'disabled'
  });
});

/* 404 handler */
httpServer.use((req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.jadwalUrl}`);
  res.status(404).json({ code: 404, message: "Service Not Found" });
});

/* error handler */
httpServer.use((err, req, res, next) => {
  console.error(`500 Internal Server Error: ${err.message}`);
  res
    .status(500)
    .json({ code: 500, message: `500 Internal Server Error: ${err.message}` });
});

export { httpServer, httpPort };