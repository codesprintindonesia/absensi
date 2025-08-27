// src/controllers/update.controllers.js
import { formatErrorMessage } from "../../../helpers/error.helper.js";
import { sendResponse } from "../../../helpers/response.helper.js";
import { update } from "../../../services/master/lokasiKerja/update.service.js";
import HTTP_STATUS from "../../../constants/httpStatus.constant.js";
/**
 * POST /lokasi-kerja
 * update lokasi kerja baru
 */
const updateController = async (req, res) => {
  try {
    console.log("REQ PARAMS", req.params);
    console.log("REQ BODY", req.body);

    // Sertakan id dari params ke body untuk diproses service
    req.body.id = req.params.id;

    const updateLocation = await update(req.body); 

    return sendResponse(res, {
      code: HTTP_STATUS.OK,
      message: "Lokasi kerja berhasil diupdate",
      data: req.body,
    });
  } catch (error) {
    console.log(error);
    return sendResponse(res, {
      code: HTTP_STATUS.BAD_REQUEST, // 400
      message: formatErrorMessage(error),
    });
  }
};

export default updateController;
