// src/controllers/transactional/absensiHarian/rekonsiliasi.controller.js
import { formatErrorMessage, mapErrorToStatusCode } from '../../../helpers/error.helper.js';
import { sendResponse } from '../../../helpers/response.helper.js';
import * as rekonService from '../../../services/transactional/absensiHarian/rekonsiliasi.service.js';
import HTTP_STATUS from '../../../constants/httpStatus.constant.js';

/**
 * Controller untuk proses rekonsiliasi absensi harian
 * POST /api/v1/transactional/absensi-harian/rekonsiliasi/proses
 * 
 * Request Body (sudah divalidasi di middleware):
 * {
 *   "tanggal": "2025-10-27"  // Format: YYYY-MM-DD
 * }
 */
const rekonsiliasi = async (req, res) => {
  try {
    const { tanggal } = req.body;
    
    const result = await rekonService.prosesRekonsiliasi(tanggal);
    
    return sendResponse(res, {
      httpCode: HTTP_STATUS.OK,
      message: 'Proses rekonsiliasi berhasil',
      data: result
    });
    
  } catch (error) {
    return sendResponse(res, {
      httpCode: mapErrorToStatusCode(error),
      message: formatErrorMessage(error),
      data: error.code === 'DUPLICATE_ABSENSI_DATA' ? {
        tanggal: req.body.tanggal,
        total_pegawai: error.totalPegawai,
        jumlah_sudah_ada: error.jumlahSudahAda,
        // pegawai_sudah_ada: error.pegawaiSudahAda
      } : null
    });
  }
};

export default rekonsiliasi;