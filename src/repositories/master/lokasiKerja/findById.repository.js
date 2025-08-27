import { LokasiKerja } from "../../../models/lokasiKerja.model.js";

/**
 * Repository untuk find lokasi kerja by ID
 * Direct database operation only
 * @param {string} id - ID lokasi kerja
 * @returns {Object|null} Data lokasi kerja atau null jika tidak ditemukan
 */

const findById = async (id) => {
  const location = await LokasiKerja.findByPk(id);
  return location ? location.toJSON() : null;
};

export default findById;
