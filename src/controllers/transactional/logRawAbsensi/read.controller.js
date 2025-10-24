// src/controllers/transaction/logRawAbsensi/read.controller.js
// Controller untuk mengambil daftar log raw absensi (transaction domain).

import { formatErrorMessage, mapErrorToStatusCode } from '../../../helpers/error.helper.js';
import { sendResponse } from '../../../helpers/response.helper.js';
import readService from '../../../services/transaction/logRawAbsensi/read.service.js';
import HTTP_STATUS from '../../../constants/httpStatus.constant.js';

const readController = async (req, res) => {
  try {
    const data = await readService(req.query);
    return sendResponse(res, {
      httpCode: HTTP_STATUS.OK,
      message: 'List log absensi raw berhasil didapatkan',
      data,
    });
  } catch (err) {
    return sendResponse(res, {
      httpCode: mapErrorToStatusCode(err),
      message: formatErrorMessage(err),
    });
  }
};

export default readController;