// src/repositories/transaction/logRawAbsensi/create.repository.js
// Repository untuk menyimpan data log raw absensi (transaction)

import { LogRawAbsensi } from '../../../models/logRawAbsensi.model.js';

const create = async (data, options = {}) => {
  const record = await LogRawAbsensi.create(data, options);
  return record.toJSON();
};

export default create;