// src/routes/createLokasiKerja.routes.js
import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { createLokasiKerjaSchema } from "../validations/createLokasiKerja.validations.js";
import createLokasiKerjaController from "../controllers/createLokasiKerja.controllers.js";

const router = Router();

/**
 * POST /lokasi-kerja
 * Create lokasi kerja baru
 */
router.post(
  "/",
  validate(createLokasiKerjaSchema, "body"),
  createLokasiKerjaController
);

export default router;
