export function formatErrorMessage(error) {
  // Ambil pesan detail dari Postgres lewat Sequelize
  if (error?.parent?.detail) return error.parent.detail;
  if (error?.original?.detail) return error.original.detail;

  // Kalau Sequelize validation error, ambil pesan pertama
  if (error?.errors?.length) return error.errors[0].message;

  // Default: pakai message biasa
  return error?.message || "Unknown error";
}