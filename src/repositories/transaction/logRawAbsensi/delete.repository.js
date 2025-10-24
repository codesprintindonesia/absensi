// src/repositories/transaction/logRawAbsensi/delete.repository.js
// Repository untuk menghapus data log raw absensi.

import { LogRawAbsensi } from '../../../models/transactional/logRawAbsensi.model.js';

const remove = async (id, options = {}) => {
  const count = await LogRawAbsensi.destroy({ where: { id }, ...options });
  return count;
};

export default remove;