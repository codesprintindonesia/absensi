// src/services/master/shiftKerja/update.service.js
import updateRepository from '../../../repositories/master/shiftKerja/update.repository.js';
import findByIdRepository from '../../../repositories/master/shiftKerja/findById.repository.js';
import findByKodeShift from '../../../repositories/master/shiftKerja/findByKodeShift.repository.js';
import HTTP_STATUS from '../../../constants/httpStatus.constant.js';

const updateService = async (id, updateData, updatedBy = 'SYSTEM') => {
 
  const existing = await findByIdRepository(id);
  if (!existing) {
    const err = new Error('SHIFT_KERJA_NOT_FOUND');
    err.statusCode = HTTP_STATUS.NOT_FOUND;
    throw err;
  } 
  // check duplicate kode_shift if updated
  if (
    updateData.kode_shift &&
    updateData.kode_shift !== existing.kode_shift
  ) {
 

    const dup = await findByKodeShift(updateData.kode_shift, id);

    if (dup) {
      const err = new Error('KODE_SHIFT_DUPLICATE');
      err.statusCode = HTTP_STATUS.CONFLICT;
      throw err;
    }
  } 

  const dataToUpdate = {
    ...updateData,
    updated_by: updatedBy,
    updated_at: new Date(),
  };
  return await updateRepository(id, dataToUpdate);
};

export default updateService;
