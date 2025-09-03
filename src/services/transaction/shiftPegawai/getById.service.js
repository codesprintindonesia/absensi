import findByIdRepository from '../../../repositories/transaction/shiftPegawai/findById.repository.js';
import HTTP_STATUS from '../../../constants/httpStatus.constant.js';

const getByIdService = async (id) => {
  const row = await findByIdRepository(id);
  if (!row) {
    const err = new Error('SHIFT_PEGAWAI_NOT_FOUND');
    err.statusCode = HTTP_STATUS.NOT_FOUND;
    throw err;
  }
  return row;
};

export default getByIdService;
