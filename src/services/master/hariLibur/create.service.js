// src/services/master/hariLibur/create.service.js
import createRepository from '../../../repositories/master/hariLibur/create.repository.js';
import findByIdRepository from '../../../repositories/master/hariLibur/findById.repository.js';
import HTTP_STATUS from '../../../constants/httpStatus.constant.js';

/**
 * Business logic untuk create hari libur
 * @param {Object} data - Data hari libur (sudah tervalidasi)
 * @returns {Object} Data hari libur yang dibuat
 */
const create = async (data) => {
  // Business Rule: Check duplicate tanggal
  const existingHoliday = await findByIdRepository(data.tanggal);
  if (existingHoliday) {
    const error = new Error('TANGGAL_ALREADY_EXISTS');
    error.statusCode = HTTP_STATUS.CONFLICT; // 409
    throw error;
  }

  // Create via repository
  const holiday = await createRepository(data);
  
  return holiday;
};

export default create;