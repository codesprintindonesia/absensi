// src/services/transaction/logRawAbsensi/create.service.js
// Service untuk membuat catatan log raw absensi pada domain transaction.

import createRepository from '../../../repositories/transaction/logRawAbsensi/create.repository.js';

const createService = async (data) => {
  return await createRepository(data);
};

export default createService;