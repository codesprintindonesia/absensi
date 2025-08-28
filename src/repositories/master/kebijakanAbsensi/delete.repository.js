import { KebijakanAbsensi } from "../../../models/kebijakanAbsensi.model.js";

/**
 * Hard‑delete kebijakan absensi berdasarkan ID.
 * @returns {number} jumlah record yang dihapus
 */
const deleteById = async (id, options = {}) => {
  const deletedCount = await KebijakanAbsensi.destroy({
    where: { id },
    ...options,
  });
  return deletedCount;
};

export default deleteById;
