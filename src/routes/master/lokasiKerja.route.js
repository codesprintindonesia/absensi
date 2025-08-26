// src/routes/create.routes.js
import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { createSchema } from "../../validations/master/lokasiKerja/create.validations.js";
import createController from "../../controllers/master/lokasiKerja/create.controllers.js";

const router = Router();

/**
 * POST /lokasi-kerja
 * Create lokasi kerja baru
 */
router.post("/", validate(createSchema), createController);

export default router;
