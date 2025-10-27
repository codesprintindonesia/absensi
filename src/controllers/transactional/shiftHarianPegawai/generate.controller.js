// src/controllers/transactional/shiftHarianPegawai/generate.controller.js

import { generateShiftHarianPegawaiService } from "../../../services/transactional/shiftHarianPegawai/generate.service.js";
import logger from "../../../utils/logger.utils.js";

/**
 * Controller untuk generate shift harian pegawai
 * POST /api/transactional/shift-harian-pegawai/generate
 */
export const generateShiftHarianPegawaiController = async (req, res) => {
  try {
    const { tanggal_mulai, tanggal_akhir, id_pegawai } = req.body;

    logger.info(
      "[ShiftHarianGeneratorController] Request generate shift harian",
      {
        tanggal_mulai,
        tanggal_akhir,
        id_pegawai,
      }
    );

    const result = await generateShiftHarianPegawaiService({
      tanggalMulai: tanggal_mulai,
      tanggalAkhir: tanggal_akhir,
      idPegawai: id_pegawai,
    });

    return res.status(200).json({
      code: 200,
      message: result.message,
      data: result.data,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error(
      "[ShiftHarianGeneratorController] Error generate shift harian",
      {
        error: error.message,
        stack: error.stack,
      }
    );

    return res.status(500).json({
      code: 500,
      message: error.message,
      data: null,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  }
};
