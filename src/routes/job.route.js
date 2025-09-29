/**
 * Routes untuk job management
 * File: src/routes/job.route.js
 */

import express from "express";
import * as jobController from "../controllers/job.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  startJobSchema,
  manualReconciliationSchema,
  jobNameSchema,
} from "../validations/job.validation.js";

const router = express.Router();

/**
 * POST /jobs/reconciliation/start
 * Start job rekonsiliasi harian otomatis
 */
router.post(
  "/reconciliation/start",
  validate(startJobSchema, "body"),
  jobController.startDailyReconciliationJob
);

/**
 * POST /jobs/reconciliation/stop
 * Stop job rekonsiliasi harian
 */
router.post("/reconciliation/stop", jobController.stopDailyReconciliationJob);

/**
 * POST /jobs/reconciliation/run
 * Run rekonsiliasi manual untuk tanggal tertentu
 */
router.post(
  "/reconciliation/run",
  validate(manualReconciliationSchema, "body"),
  jobController.runManualReconciliation
);

/**
 * GET /jobs
 * Get status semua jobs
 */
router.get("/", jobController.getAllJobsStatus);

/**
 * GET /jobs/:jobName
 * Get status job spesifik
 */
router.get(
  "/:jobName",
  validate(jobNameSchema, "params"),
  jobController.getJobStatus
);

/**
 * POST /jobs/stop-all
 * Stop semua jobs
 */
router.post("/stop-all", jobController.stopAllJobs);

export default router;