// src/controllers/createLokasiKerja.controllers.js
import { formatErrorMessage } from '../helpers/error.helper.js';
import { sendResponse } from '../helpers/response.helper.js';
import { createLokasiKerja } from '../services/createLokasiKerja.services.js';
import  HTTP_STATUS from "../constants/httpStatus.constant.js";
/**
 * POST /lokasi-kerja
 * Create lokasi kerja baru
 */
const createLokasiKerjaController = async (req, res) => {
  try {
    const newLocation = await createLokasiKerja(req.body);
    
    return sendResponse(res, {
      code: HTTP_STATUS.CREATED, // 201
      message: 'Lokasi kerja berhasil dibuat',
      data: newLocation
    });
  } catch (error) {
    console.log(error)
    return sendResponse(res, {
      code: HTTP_STATUS.BAD_REQUEST, // 400
      message: formatErrorMessage(error)
    });
  }
};

export default createLokasiKerjaController;