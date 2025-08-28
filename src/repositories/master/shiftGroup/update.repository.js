import shiftGroup from "../../../models/shiftGroup.model.js";

/**
 * Update shift group berdasarkan ID.
 * @param {string} id – ID kebijakan yang ingin diupdate
 * @param {Object} updateData – kolom yang akan diupdate
 * @returns {Object} data kebijakan yang telah diperbarui
 */
const update = async (id, updateData, options = {}) => {
  const [updatedCount, updatedRows] = await shiftGroup.update(updateData, {
    where: { id },
    returning: true,
    ...options,
  });
  if (updatedCount === 0) {
    throw new Error("KEBIJAKAN_NOT_FOUND");
  }
  return updatedRows[0].toJSON();
};

export default update;
