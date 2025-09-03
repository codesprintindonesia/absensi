import { formatErrorMessage, mapErrorToStatusCode } from "../../../helpers/error.helper.js";
import { sendResponse } from "../../../helpers/response.helper.js";
import HTTP_STATUS from "../../../constants/httpStatus.constant.js";
import createService from "../../../services/master/shiftGroupDetail/create.service.js";

const createController = async (req, res) => {
  try {
    const newDetail = await createService(req.body);
    return sendResponse(res, {
      code: HTTP_STATUS.CREATED,
      message: "Shift group detail berhasil dibuat",
      data: newDetail,
    });
  } catch (error) {
    return sendResponse(res, {
      code: mapErrorToStatusCode(error),
      message: formatErrorMessage(error),
    });
  }
};

export default createController;
