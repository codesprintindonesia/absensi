// src/controllers/transactional/shiftHarianPegawai/createManual.controller.js

import createManualShiftService from "../../../services/transactional/shiftHarianPegawai/createManual.service.js";
import logger from "../../../utils/logger.utils.js";

export const createManualController = async (req, res) => {
  try {
    const {
      id_pegawai,
      id_personal,
      nama_pegawai,
      tanggal_mulai,
      tanggal_akhir,
      id_shift_kerja,
      id_lokasi_kerja,
      id_pegawai_pengganti,
      alasan_perubahan,
      overwrite_existing,
    } = req.body;

    const result = await createManualShiftService({
      idPegawai: id_pegawai,
      idPersonal: id_personal,
      namaPegawai: nama_pegawai,
      tanggalMulai: tanggal_mulai,
      tanggalAkhir: tanggal_akhir,
      idShiftKerja: id_shift_kerja,
      idLokasiKerja: id_lokasi_kerja,
      idPegawaiPengganti: id_pegawai_pengganti,
      alasanPerubahan: alasan_perubahan,
      overwriteExisting: overwrite_existing || false,
    });

    return res.status(201).json({
      code: 201,
      message: result.message,
      data: result.data,
      metadata: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error("[CreateManualController] Error", {
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

export default createManualController;