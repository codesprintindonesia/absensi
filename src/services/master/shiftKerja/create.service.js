// src/services/master/shiftKerja/create.service.js
import createRepository from '../../../repositories/master/shiftKerja/create.repository.js';
import findByKodeShift from '../../../repositories/master/shiftKerja/findByKodeShift.repository.js';
import HTTP_STATUS from '../../../constants/httpStatus.constant.js';

/**
 * Business logic untuk membuat shift kerja baru.
 * - Cek duplikasi kode_shift
 * - Transform data bila diperlukan
 */
const createService = async (data) => {
  const existing = await findByKodeShift(data.kode_shift);
  if (existing) {
    const err = new Error('KODE_SHIFT_DUPLICATE');
    err.statusCode = HTTP_STATUS.CONFLICT;
    throw err;
  }
  const newData = {
    ...data,
    is_aktif: data.is_aktif !== undefined ? data.is_aktif : true,
    is_umum: data.is_umum !== undefined ? data.is_umum : true,
  };
  return await createRepository(newData);
};

export default createService;
