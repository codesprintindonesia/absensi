// src/controllers/transaction/logRawAbsensi/create.controller.js
// Controller untuk membuat catatan log raw absensi (transaction domain).

import { formatErrorMessage, mapErrorToStatusCode } from '../../../helpers/error.helper.js';
import { sendResponse } from '../../../helpers/response.helper.js';
import createService from '../../../services/transaction/logRawAbsensi/create.service.js';
import HTTP_STATUS from '../../../constants/httpStatus.constant.js';

const createController = async (req, res) => {
  try {
    const data = await createService(req.body);
    return sendResponse(res, {
      httpCode: HTTP_STATUS.CREATED,
      message: 'Log absensi raw berhasil dibuat',
      data,
    });
  } catch (err) {
    console.error('Database Error:', err.original || err); // Log detail error
    return sendResponse(res, {
      httpCode: mapErrorToStatusCode(err),
      message: formatErrorMessage(err),
    });
  }
};

export default createController;