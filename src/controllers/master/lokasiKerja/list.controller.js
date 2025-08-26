// src/controllers/master/lokasiKerja/list.controller.js
import { formatErrorMessage } from '../../../helpers/error.helper.js';
import { sendResponse } from '../../../helpers/response.helper.js';
import { list } from '../../../services/master/lokasiKerja/list.service.js';
import HTTP_STATUS from "../../../constants/httpStatus.constant.js";

/**
 * GET /lokasi-kerja
 * Get list lokasi kerja dengan filtering dan pagination
 */
const listController = async (req, res) => {
  try {
    const result = await list(req.query);
    
    return sendResponse(res, {
      code: HTTP_STATUS.OK, // 200
      message: 'OK',
      data: result.locations,
      metadata: result.metadata
    });
  } catch (error) {
    console.log(error);
    return sendResponse(res, {
      code: HTTP_STATUS.INTERNAL_SERVER_ERROR, // 500
      message: formatErrorMessage(error)
    });
  }
};

export default listController;