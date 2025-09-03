// src/controllers/transaction/logRawAbsensi/findById.controller.js
// Controller untuk mengambil detail log raw absensi berdasarkan ID (transaction domain).

import { formatErrorMessage, mapErrorToStatusCode } from '../../../helpers/error.helper.js';
import { sendResponse } from '../../../helpers/response.helper.js';
import getByIdService from '../../../services/transaction/logRawAbsensi/getById.service.js';
import HTTP_STATUS from '../../../constants/httpStatus.constant.js';

const getByIdController = async (req, res) => {
  try {
    const data = await getByIdService(req.params.id);
    return sendResponse(res, {
      httpCode: HTTP_STATUS.OK,
      message: 'Detail log absensi raw berhasil didapatkan',
      data,
    });
  } catch (err) {
    return sendResponse(res, {
      httpCode: mapErrorToStatusCode(err),
      message: formatErrorMessage(err),
    });
  }
};

export default getByIdController;