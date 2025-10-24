// src/services/transaction/logRawAbsensi/delete.service.js
// Service untuk menghapus data log raw absensi.

import deleteRepository from '../../../repositories/transactional/logRawAbsensi/delete.repository.js';
import findByIdRepository from '../../../repositories/transactional/logRawAbsensi/findById.repository.js';
import HTTP_STATUS from '../../../constants/httpStatus.constant.js';

const deleteService = async (id) => {
  const existing = await findByIdRepository(id);
  if (!existing) {
    const error = new Error('LOG_NOT_FOUND');
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }
  await deleteRepository(id);
  return true;
};

export default deleteService;