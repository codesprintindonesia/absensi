import createRepository from '../../../repositories/transaction/shiftPegawai/create.repository.js';

const createService = async (data) => {
  // business logic: bisa tambah pengecekan duplikasi id jika diperlukan
  const row = await createRepository(data);
  return row;
};

export default createService;
