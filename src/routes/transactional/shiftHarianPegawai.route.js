// src/routes/v1/shiftHarianGenerator.routes.js

import express from "express";
import { generateShiftHarianPegawaiController } from "../../controllers/transactional/shiftHarianPegawai/generate.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { generateShiftSchema } from "../../validations/transactional/shiftHarianPegawai.validation.js";

const router = express.Router();

/**
 * @route   POST /api/transactional/shift-harian-pegawai/generate
 * @desc    Generate shift harian untuk pegawai
 * @access  Private
 * @body    {
 *            tanggal_mulai: Date (required),
 *            tanggal_akhir: Date (required),
 *            id_pegawai: String (optional)
 *          }
 */
router.post(
  "/generate",
  validate(generateShiftSchema),
  generateShiftHarianPegawaiController
);

export default router;
