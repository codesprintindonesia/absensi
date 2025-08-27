// src/routes/master/lokasiKerja.route.js
import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createSchema,
  listSchema,
  paramsSchema,
  updateSchema,
} from "../../validations/master/lokasiKerja.validation.js";
import createController from "../../controllers/master/lokasiKerja/create.controller.js";
import listController from "../../controllers/master/lokasiKerja/list.controller.js";
import updateController from "../../controllers/master/lokasiKerja/update.controller.js";
const router = Router();

/**
 * GET /lokasi-kerja
 * Get list lokasi kerja dengan filtering dan pagination
 */
router.get("/", validate(listSchema), listController);

/**
 * POST /lokasi-kerja
 * Create lokasi kerja baru
 */
router.post("/", validate(createSchema), createController);

/** PUT /lokasi-kerja
 * Update lokasi kerja
 */
router.put(
  "/:id",
  validate(paramsSchema, "params"),
  validate(updateSchema),
  updateController
);

export default router;
