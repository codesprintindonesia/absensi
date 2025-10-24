// src/services/master/hariLibur/delete.service.js
import deleteRepository from '../../../repositories/master/hariLibur/delete.repository.js';
import findByIdRepository from '../../../repositories/master/hariLibur/findById.repository.js';
import HTTP_STATUS from '../../../constants/httpStatus.constant.js';

/**
 * Business logic untuk delete hari libur
 * @param {string} tanggal - Tanggal hari libur (PK)
 * @returns {boolean} Success status
 */
const deleteHariLibur = async (tanggal) => {
  // Business Rule: Check if hari libur exists
  const existingHoliday = await findByIdRepository(tanggal);
  if (!existingHoliday) {
    const error = new Error('HOLIDAY_NOT_FOUND');
    error.statusCode = HTTP_STATUS.NOT_FOUND; // 404
    throw error;
  }

  // Delete via repository
  await deleteRepository(tanggal);
  
  return true;
};

export default deleteHariLibur;