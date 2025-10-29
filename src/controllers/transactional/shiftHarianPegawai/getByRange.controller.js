// src/controllers/transactional/shiftHarianPegawai/getByRange.controller.js

import getByRangeShiftService from "../../../services/transactional/shiftHarianPegawai/getByRange.service.js";
import logger from "../../../utils/logger.utils.js";

export const getByRangeController = async (req, res) => {
  try {
    const { id_pegawai, tanggal_mulai, tanggal_akhir } = req.query;

    const result = await getByRangeShiftService({
      idPegawai: id_pegawai,
      tanggalMulai: tanggal_mulai,
      tanggalAkhir: tanggal_akhir,
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
    logger.error("[GetByRangeController] Error", {
      error: error.message,
      stack: error.stack,
    });

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

export default getByRangeController;