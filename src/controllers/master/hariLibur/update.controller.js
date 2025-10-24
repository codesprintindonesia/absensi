// src/controllers/master/hariLibur/update.controller.js
import { formatErrorMessage } from '../../../helpers/error.helper.js';
import { sendResponse } from '../../../helpers/response.helper.js';
import update from '../../../services/master/hariLibur/update.service.js';
import HTTP_STATUS from '../../../constants/httpStatus.constant.js';

/**
 * PUT /hari-libur/:tanggal
 * Update hari libur
 */
const updateController = async (req, res) => {
  try {
    const { tanggal } = req.params;
    
    const holiday = await update(tanggal, req.body);
    
    return sendResponse(res, {
      code: HTTP_STATUS.OK, // 200
      message: 'Success',
      data: holiday
    });
  } catch (error) {
    console.log(error);
    const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_ERROR;
    return sendResponse(res, {
      code: statusCode,
      message: formatErrorMessage(error)
    });
  }
};

export default updateController;