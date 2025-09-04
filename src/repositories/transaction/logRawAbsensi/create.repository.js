// src/repositories/transaction/logRawAbsensi/create.repository.js
// Repository untuk menyimpan data log raw absensi (transaction)

import { LogRawAbsensi } from '../../../models/logRawAbsensi.model.js';

const createRepository = async (data, options = {}) => {
  const record = await LogRawAbsensi.create(data, options);
  
  console.log("Created Record:", record);

  return record.toJSON();
};

export default createRepository;