// src/controllers/transaction/shiftPegawai/create.controller.js
import { formatErrorMessage, mapErrorToStatusCode } from '../../../helpers/error.helper.js';
import { sendResponse } from '../../../helpers/response.helper.js';
import HTTP_STATUS from '../../../constants/httpStatus.constant.js';
import createService from '../../../services/transaction/shiftPegawai/create.service.js';

const createController = async (req, res) => {
  try {
    const data = await createService(req.body);
    return sendResponse(res, {
      httpCode: HTTP_STATUS.CREATED,
      message: 'Penugasan shift pegawai berhasil dibuat',
      data,
    });
  } catch (error) {
    return sendResponse(res, {
      httpCode: mapErrorToStatusCode(error),
      message: formatErrorMessage(error),
    });
  }
};

export default createController;
