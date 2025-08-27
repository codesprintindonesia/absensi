// src/controllers/create.controllers.js
import { formatErrorMessage } from '../../../helpers/error.helper.js';
import { sendResponse } from '../../../helpers/response.helper.js';
import { create } from '../../../services/master/lokasiKerja/create.service.js';
import  HTTP_STATUS from "../../../constants/httpStatus.constant.js";
/**
 * POST /lokasi-kerja
 * Create lokasi kerja baru
 */
const createController = async (req, res) => {
  try {
    console.log('REQ BODY', req.body);

    const newLocation = await create(req.body);
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

export default createController;