import updateRepository from '../../../repositories/transaction/shiftPegawai/update.repository.js';
import findByIdRepository from '../../../repositories/transaction/shiftPegawai/findById.repository.js';
import HTTP_STATUS from '../../../constants/httpStatus.constant.js';

const updateService = async (id, updateData, updatedBy = 'SYSTEM') => {
  const existing = await findByIdRepository(id);
  if (!existing) {
    const err = new Error('SHIFT_PEGAWAI_NOT_FOUND');
    err.statusCode = HTTP_STATUS.NOT_FOUND;
    throw err;
  }

  const dataToUpdate = {
    ...updateData,
    updated_at: new Date(),
  };

  return await updateRepository(id, dataToUpdate);
};

export default updateService;
