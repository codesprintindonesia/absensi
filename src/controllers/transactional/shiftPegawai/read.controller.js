// src/controllers/transaction/shiftPegawai/read.controller.js
import { formatErrorMessage, mapErrorToStatusCode } from '../../../helpers/error.helper.js';
import { sendResponse } from '../../../helpers/response.helper.js';
import readService from '../../../services/transaction/shiftPegawai/read.service.js';
import HTTP_STATUS from '../../../constants/httpStatus.constant.js';

const readController = async (req, res) => {
  try {
    const data = await readService(req.query);
    return sendResponse(res, {
      httpCode: HTTP_STATUS.OK,
      message: 'Daftar penugasan shift pegawai berhasil didapatkan',
      data,
    });
  } catch (error) {
    return sendResponse(res, {
      httpCode: mapErrorToStatusCode(error),
      message: formatErrorMessage(error),
    });
  }
};

export default readController;
