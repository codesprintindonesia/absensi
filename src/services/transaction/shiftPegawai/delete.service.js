import deleteRepository from '../../../repositories/transaction/shiftPegawai/delete.repository.js';
import findByIdRepository from '../../../repositories/transaction/shiftPegawai/findById.repository.js';
import HTTP_STATUS from '../../../constants/httpStatus.constant.js';

const deleteService = async (id, deletedBy = 'SYSTEM') => {
  const existing = await findByIdRepository(id);
  if (!existing) {
    const err = new Error('SHIFT_PEGAWAI_NOT_FOUND');
    err.statusCode = HTTP_STATUS.NOT_FOUND;
    throw err;
  }
  const deletedCount = await deleteRepository(id);
  if (deletedCount === 0) {
    throw new Error('DELETE_FAILED');
  }
  return {
    deleted_assignment: existing,
    deleted_by: deletedBy,
    deleted_at: new Date().toISOString(),
  };
};

export default deleteService;
