import express from "express";
import { config as dotenv } from "dotenv";
import Database from "../libraries/databaseconnection.library.js";
// import { logger } from "../configs/logger.config.js";
import "../models/associations.model.js";
import mainRoutes from "../routes/main.route.js";

dotenv();

const httpServer = express();
const httpPort = process.env.PORT || 3000;

/* connect ke database */
(async () => {
  try {
    const db = new Database();
    await db.connect(process.env.DATABASE); // DATABASE=development (misalnya)
    //logger.info(`Database connected with profile: ${process.env.DATABASE}`);
  } catch (error) {
    //logger.error(`Database connection failed: ${error.message}`);
  }
})();

/* middleware dasar */
httpServer.use(express.json());
httpServer.use(express.urlencoded({ extended: false }));

/* routes */
httpServer.use("/", mainRoutes); // mainRoutes diimpor dari routes/main.route.js

/* contoh route */
httpServer.get("/health", (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV, db: process.env.DATABASE });
});

/* 404 handler */
httpServer.use((req, res) => {
  //logger.warn(`404 Not Found: ${req.method} ${req.originalUrl}`);
  console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ code: 404, message: "Service Not Found" });
});

/* error handler */
httpServer.use((err, req, res, next) => {
  //logger.error(`500 Internal Server Error: ${err.message}`);
  res
    .status(500)
    .json({ code: 500, message: `500 Internal Server Error: ${err.message}` });
});

export { httpServer, httpPort };
