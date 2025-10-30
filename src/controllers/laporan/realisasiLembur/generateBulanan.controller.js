// src/controllers/laporan/realisasiLembur/generateBulanan.controller.js

import { formatErrorMessage, mapErrorToStatusCode } from "../../../helpers/error.helper.js";
import { sendResponse } from "../../../helpers/response.helper.js";
import {
  generateRealisasiLemburBulanan,
  generateRealisasiLemburBulananAllPegawai,
} from "../../../services/laporan/realisasiLembur/generateBulanan.service.js";
import HTTP_STATUS from "../../../constants/httpStatus.constant.js";

/**
 * Generate realisasi lembur bulanan untuk satu pegawai
 * POST /api/v1/realisasi-lembur/generate
 * Body: { id_pegawai, periode_bulan_lembur }
 */
const generateBulananController = async (req, res) => {
  try {
    const { id_pegawai, periode_bulan_lembur } = req.body;

    const result = await generateRealisasiLemburBulanan(id_pegawai, periode_bulan_lembur);

    return sendResponse(res, {
      httpCode: HTTP_STATUS.OK,
      message: "Realisasi lembur bulanan berhasil di-generate",
      data: result.data,
      metadata: result.summary,
    });
  } catch (error) {
    return sendResponse(res, {
      httpCode: mapErrorToStatusCode(error),
      message: formatErrorMessage(error),
    });
  }
};

/**
 * Generate realisasi lembur bulanan untuk semua pegawai
 * POST /api/v1/realisasi-lembur/generate-all
 * Body: { periode_bulan_lembur }
 */
const generateBulananAllPegawaiController = async (req, res) => {
  try {
    const { periode_bulan_lembur } = req.body;

    const result = await generateRealisasiLemburBulananAllPegawai(periode_bulan_lembur);

    return sendResponse(res, {
      httpCode: HTTP_STATUS.OK,
      message: `Realisasi lembur bulanan berhasil di-generate untuk ${result.total_success} dari ${result.total_pegawai} pegawai`,
      data: result.results,
      metadata: {
        periode: result.periode,
        total_pegawai: result.total_pegawai,
        total_success: result.total_success,
        total_error: result.total_error,
        errors: result.errors,
      },
    });
  } catch (error) {
    return sendResponse(res, {
      httpCode: mapErrorToStatusCode(error),
      message: formatErrorMessage(error),
    });
  }
};

export { generateBulananController, generateBulananAllPegawaiController };