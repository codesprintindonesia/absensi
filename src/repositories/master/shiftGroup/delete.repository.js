import  shiftGroup  from "../../../models/shiftGroup.model.js";

/**
 * Hard‑delete shift group berdasarkan ID.
 * @returns {number} jumlah record yang dihapus
 */
const deleteById = async (id, options = {}) => {
  const deletedCount = await shiftGroup.destroy({
    where: { id },
    ...options,
  });
  return deletedCount;
};

export default deleteById;
