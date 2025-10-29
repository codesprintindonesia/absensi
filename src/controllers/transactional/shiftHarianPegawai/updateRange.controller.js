// src/controllers/transactional/shiftHarianPegawai/updateRange.controller.js

import updateRangeShiftService from "../../../services/transactional/shiftHarianPegawai/updateRange.service.js";
import logger from "../../../utils/logger.utils.js";

export const updateRangeController = async (req, res) => {
  try {
    const {
      id_pegawai,
      tanggal_mulai,
      tanggal_akhir,
      id_shift_kerja_final,
      id_lokasi_kerja_final,
      id_pegawai_pengganti,
      alasan_perubahan,
    } = req.body;

    const result = await updateRangeShiftService({
      idPegawai: id_pegawai,
      tanggalMulai: tanggal_mulai,
      tanggalAkhir: tanggal_akhir,
      updateData: {
        idShiftKerjaFinal: id_shift_kerja_final,
        idLokasiKerjaFinal: id_lokasi_kerja_final,
        idPegawaiPengganti: id_pegawai_pengganti,
        alasanPerubahan: alasan_perubahan,
      },
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
    logger.error("[UpdateRangeController] Error", {
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

export default updateRangeController;