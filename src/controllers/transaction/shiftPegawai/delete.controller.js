// src/controllers/transaction/shiftPegawai/delete.controller.js
import { formatErrorMessage, mapErrorToStatusCode } from '../../../helpers/error.helper.js';
import { sendResponse } from '../../../helpers/response.helper.js';
import deleteService from '../../../services/transaction/shiftPegawai/delete.service.js';
import HTTP_STATUS from '../../../constants/httpStatus.constant.js';

const deleteController = async (req, res) => {
  try {
    const data = await deleteService(req.params.id);
    return sendResponse(res, {
      httpCode: HTTP_STATUS.OK,
      message: 'Penugasan shift pegawai berhasil dihapus',
      data,
    });
  } catch (error) {
    return sendResponse(res, {
      httpCode: mapErrorToStatusCode(error),
      message: formatErrorMessage(error),
    });
  }
};

export default deleteController;
