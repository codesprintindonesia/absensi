// src/routes/master/lokasiKerja.route.js
import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { createSchema } from "../../validations/master/lokasiKerja/create.validation.js";
import { listSchema } from "../../validations/master/lokasiKerja/list.validation.js";
import createController from "../../controllers/master/lokasiKerja/create.controller.js";
import listController from "../../controllers/master/lokasiKerja/list.controller.js";

const router = Router();

/**
 * GET /lokasi-kerja
 * Get list lokasi kerja dengan filtering dan pagination
 */
router.get("/", validate(listSchema, "query"), listController);

/**
 * POST /lokasi-kerja
 * Create lokasi kerja baru
 */
router.post("/", validate(createSchema), createController);

export default router;