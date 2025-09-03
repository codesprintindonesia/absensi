// src/repositories/transaction/logRawAbsensi/findById.repository.js
// Repository untuk mengambil data log raw absensi berdasarkan ID.

import { LogRawAbsensi } from '../../../models/logRawAbsensi.model.js';

const findById = async (id, options = {}) => {
  const record = await LogRawAbsensi.findByPk(id, options);
  return record ? record.toJSON() : null;
};

export default findById;