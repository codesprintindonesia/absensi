/**
 * Controller untuk job management
 * File: src/controllers/job.controller.js
 */

import * as scheduler from "../jobs/scheduler.job.js";
import * as reconciliationJob from "../jobs/reconciliation.job.js";
import { sendResponse } from "../helpers/response.helper.js";

/**
 * Start job rekonsiliasi harian otomatis
 */
export const startDailyReconciliationJob = async (req, res) => {
  try {
    const { cronTime = "02:00" } = req.body;

    const result = scheduler.scheduleJob(
      "daily-reconciliation",
      cronTime,
      reconciliationJob.runDailyReconciliation
    );

    return sendResponse(res, {
      code: 200,
      message: "Daily reconciliation job started successfully",
      data: result,
      metadata: {
        jobName: "daily-reconciliation",
        description: "Rekonsiliasi absensi harian H-1",
      },
    });
  } catch (error) {
    return sendResponse(res, {
      code: 500,
      message: "Failed to start daily reconciliation job",
      data: { error: error.message },
      metadata: null,
    });
  }
};

/**
 * Stop job rekonsiliasi harian
 */
export const stopDailyReconciliationJob = async (req, res) => {
  try {
    const stopped = scheduler.stopJob("daily-reconciliation");

    if (!stopped) {
      return sendResponse(res, {
        code: 404,
        message: "Daily reconciliation job not found or already stopped",
        data: null,
        metadata: null,
      });
    }

    return sendResponse(res, {
      code: 200,
      message: "Daily reconciliation job stopped successfully",
      data: { jobName: "daily-reconciliation", status: "STOPPED" },
      metadata: null,
    });
  } catch (error) {
    return sendResponse(res, {
      code: 500,
      message: "Failed to stop daily reconciliation job",
      data: { error: error.message },
      metadata: null,
    });
  }
};

/**
 * Get status semua jobs
 */
export const getAllJobsStatus = async (req, res) => {
  try {
    const jobs = scheduler.getActiveJobs();

    return sendResponse(res, {
      code: 200,
      message: "Jobs retrieved successfully",
      data: jobs,
      metadata: { totalJobs: jobs.length },
    });
  } catch (error) {
    return sendResponse(res, {
      code: 500,
      message: "Failed to retrieve jobs",
      data: { error: error.message },
      metadata: null,
    });
  }
};

/**
 * Get status job spesifik
 */
export const getJobStatus = async (req, res) => {
  try {
    const { jobName } = req.params;

    const job = scheduler.getJobDetail(jobName);

    if (!job) {
      return sendResponse(res, {
        code: 404,
        message: "Job not found",
        data: null,
        metadata: null,
      });
    }

    return sendResponse(res, {
      code: 200,
      message: "Job status retrieved successfully",
      data: job,
      metadata: null,
    });
  } catch (error) {
    return sendResponse(res, {
      code: 500,
      message: "Failed to retrieve job status",
      data: { error: error.message },
      metadata: null,
    });
  }
};

/**
 * Run rekonsiliasi manual untuk tanggal tertentu
 */
export const runManualReconciliation = async (req, res) => {
  try {
    const { tanggal } = req.body;

    if (!tanggal) {
      return sendResponse(res, {
        code: 400,
        message: "Tanggal is required",
        data: null,
        metadata: null,
      });
    }

    const result = await reconciliationJob.runReconciliationForDate(tanggal);

    return sendResponse(res, {
      code: 200,
      message: "Manual reconciliation completed",
      data: result,
      metadata: {
        tanggal,
        processedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return sendResponse(res, {
      code: 500,
      message: "Manual reconciliation failed",
      data: { error: error.message },
      metadata: null,
    });
  }
};

/**
 * Stop all jobs
 */
export const stopAllJobs = async (req, res) => {
  try {
    const count = scheduler.stopAllJobs();

    return sendResponse(res, {
      code: 200,
      message: "All jobs stopped successfully",
      data: { totalStopped: count },
      metadata: null,
    });
  } catch (error) {
    return sendResponse(res, {
      code: 500,
      message: "Failed to stop all jobs",
      data: { error: error.message },
      metadata: null,
    });
  }
};