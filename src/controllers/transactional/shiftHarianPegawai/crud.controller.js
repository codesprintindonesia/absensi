// src/controllers/transactional/shiftHarianPegawai/crud.controller.js

import createManualShiftService from "../../../services/transactional/shiftHarianPegawai/createManual.service.js";
import updateRangeShiftService from "../../../services/transactional/shiftHarianPegawai/updateRange.service.js";
import deleteRangeShiftService from "../../../services/transactional/shiftHarianPegawai/deleteRange.service.js";
import getByRangeShiftService from "../../../services/transactional/shiftHarianPegawai/getByRange.service.js";
import logger from "../../../utils/logger.utils.js";

/**
 * POST /api/transactional/shift-harian-pegawai/manual
 * Create shift manual untuk rentang tanggal
 */
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

/**
 * PUT /api/transactional/shift-harian-pegawai/range
 * Update shift untuk rentang tanggal (cuti/izin/tukar shift)
 */
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

/**
 * DELETE /api/transactional/shift-harian-pegawai/range
 * Delete shift untuk rentang tanggal
 */
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

/**
 * GET /api/transactional/shift-harian-pegawai/range
 * Get shift untuk rentang tanggal
 */
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