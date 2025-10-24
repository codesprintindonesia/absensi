// src/services/transaction/logRawAbsensi/update.service.js
// Service untuk memperbarui data log raw absensi.

import updateRepository from '../../../repositories/transactional/logRawAbsensi/update.repository.js';
import findByIdRepository from '../../../repositories/transactional/logRawAbsensi/findById.repository.js';
import HTTP_STATUS from '../../../constants/httpStatus.constant.js';

const updateService = async (id, data) => {
  const existing = await findByIdRepository(id);
  if (!existing) {
    const error = new Error('LOG_NOT_FOUND');
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }
  const updated = await updateRepository(id, data);
  return updated;
};

export default updateService;