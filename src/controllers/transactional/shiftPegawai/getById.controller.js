// src/controllers/transaction/shiftPegawai/getById.controller.js
import { formatErrorMessage, mapErrorToStatusCode } from '../../../helpers/error.helper.js';
import { sendResponse } from '../../../helpers/response.helper.js';
import getByIdService from '../../../services/transaction/shiftPegawai/getById.service.js';
import HTTP_STATUS from '../../../constants/httpStatus.constant.js';

const getByIdController = async (req, res) => {
  try {
    const data = await getByIdService(req.params.id);
    return sendResponse(res, {
      httpCode: HTTP_STATUS.OK,
      message: 'Data penugasan shift pegawai berhasil ditemukan',
      data,
    });
  } catch (error) {
    return sendResponse(res, {
      httpCode: mapErrorToStatusCode(error),
      message: formatErrorMessage(error),
    });
  }
};

export default getByIdController;
