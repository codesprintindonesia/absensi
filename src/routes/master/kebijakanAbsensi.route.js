// src/routes/master/kebijakanAbsensi.route.js
import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createSchema,
  readSchema,
} from "../../validations/master/kebijakanAbsensi.validation.js";
import createController from "../../controllers/master/kebijakanAbsensi/create.controller.js";
import readController from "../../controllers/master/kebijakanAbsensi/read.controller.js";

const router = Router();

/**
 * GET /kebijakan-absensi
 * Get read lokasi kerja dengan filtering dan pagination
 */
router.get("/", validate(readSchema), readController);

/**
 * POST /kebijakan-absensi
 * Create lokasi kerja baru
 */
router.post("/", validate(createSchema), createController);

export default router;
