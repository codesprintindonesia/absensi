import  HTTP_STATUS from "../constants/httpStatus.constant.js";

export function formatErrorMessage(error) {
  // Ambil pesan detail dari Postgres lewat Sequelize
  if (error?.parent?.detail) return error.parent.detail;
  if (error?.original?.detail) return error.original.detail;

  // Kalau Sequelize validation error, ambil pesan pertama
  if (error?.errors?.length) return error.errors[0].message;

  // Default: pakai message biasa
  return error?.message || "Unknown error";
}

// Helper untuk mapping error ke status code
export function mapErrorToStatusCode(error) {
  if (error.name === "SequelizeUniqueConstraintError")
    return HTTP_STATUS.CONFLICT;
  if (
    error.name === "SequelizeDatabaseError" ||
    error.name === "SequelizeConnectionError"
  )
    return HTTP_STATUS.INTERNAL_ERROR;
  if (error.name === "SequelizeValidationError") return HTTP_STATUS.BAD_REQUEST;
  if (error.statusCode && Object.values(HTTP_STATUS).includes(error.statusCode))
    return error.statusCode;
  if (error.code === "NOT_FOUND") return HTTP_STATUS.NOT_FOUND;
  return HTTP_STATUS.INTERNAL_ERROR; // fallback
}
