import shiftGroup from "../../../models/shiftGroup.model.js";

/**
 * Cari shift group berdasarkan ID.
 * Mengembalikan data atau null jika tidak ditemukan.
 */
const findById = async (id, options = {}) => {
  const shift = await shiftGroup.findByPk(id, options);
  return shift ? shift.toJSON() : null;
};

export default findById;
