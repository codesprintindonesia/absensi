import { LokasiKerja } from '../../../models/lokasiKerja.model.js';

/**
 * Repository untuk hard delete lokasi kerja
 * Direct database operation only
 * @param {string} id - ID lokasi kerja
 * @returns {number} Jumlah record yang dihapus
 */
const deleteById = async (id) => {
  const deletedCount = await LokasiKerja.destroy({
    where: { id }
  });
  
  return deletedCount;
};

export default deleteById;