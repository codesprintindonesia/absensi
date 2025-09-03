// src/services/transaction/logRawAbsensi/findById.service.js
// Service untuk mengambil detail log raw absensi berdasarkan ID pada domain transaction.

import findByIdRepository from '../../../repositories/transaction/logRawAbsensi/findById.repository.js';
import HTTP_STATUS from '../../../constants/httpStatus.constant.js';

const getByIdService = async (id) => {
  const record = await findByIdRepository(id);
  if (!record) {
    const error = new Error('LOG_NOT_FOUND');
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }
  return record;
};

export default getByIdService;