// src/controllers/transaction/logRawAbsensi/delete.controller.js
// Controller untuk menghapus data log raw absensi (transaction domain).

import { formatErrorMessage, mapErrorToStatusCode } from '../../../helpers/error.helper.js';
import { sendResponse } from '../../../helpers/response.helper.js';
import deleteService from '../../../services/transaction/logRawAbsensi/delete.service.js';
import HTTP_STATUS from '../../../constants/httpStatus.constant.js';

const deleteController = async (req, res) => {
  try {
    await deleteService(req.params.id);
    return sendResponse(res, {
      httpCode: HTTP_STATUS.OK,
      message: 'Log absensi raw berhasil dihapus',
    });
  } catch (err) {
    return sendResponse(res, {
      httpCode: mapErrorToStatusCode(err),
      message: formatErrorMessage(err),
    });
  }
};

export default deleteController;