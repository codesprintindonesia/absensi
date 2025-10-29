// src/controllers/transactional/shiftHarianPegawai/deleteRange.controller.js

import deleteRangeShiftService from "../../../services/transactional/shiftHarianPegawai/deleteRange.service.js";
import logger from "../../../utils/logger.utils.js";

export const deleteRangeController = async (req, res) => {
  try {
    const { id_pegawai, tanggal_mulai, tanggal_akhir, alasan_hapus } =
      req.body;

    const result = await deleteRangeShiftService({
      idPegawai: id_pegawai,
      tanggalMulai: tanggal_mulai,
      tanggalAkhir: tanggal_akhir,
      alasanHapus: alasan_hapus,
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
    logger.error("[DeleteRangeController] Error", {
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

export default deleteRangeController;