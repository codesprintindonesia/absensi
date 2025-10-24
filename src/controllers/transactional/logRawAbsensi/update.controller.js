// src/controllers/transaction/logRawAbsensi/update.controller.js
import { formatErrorMessage, mapErrorToStatusCode } from '../../../helpers/error.helper.js';
import { sendResponse } from '../../../helpers/response.helper.js';
import updateService from '../../../services/transactional/logRawAbsensi/update.service.js';
import HTTP_STATUS from '../../../constants/httpStatus.constant.js';

const updateController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await updateService(id, req.body);
    return sendResponse(res, {
      httpCode: HTTP_STATUS.OK,
      message: 'Log berhasil diupdate',
      data,
    });
  } catch (err) {
    return sendResponse(res, {
      httpCode: mapErrorToStatusCode(err),
      message: formatErrorMessage(err),
    });
  }
};

export default updateController;