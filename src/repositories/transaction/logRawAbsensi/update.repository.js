// src/repositories/transaction/logRawAbsensi/update.repository.js
// Repository untuk memperbarui data log raw absensi.

import { LogRawAbsensi } from "../../../models/transactional/logRawAbsensi.model.js";

const update = async (id, data, options = {}) => {
  const [count, [updated]] = await LogRawAbsensi.update(data, {
    where: { id },
    returning: true,
    ...options,
  });
  if (count === 0) {
    throw new Error("LOG_RAW_ABSENSI_NOT_FOUND");
  }
  return updated.toJSON();
};

export default update;
