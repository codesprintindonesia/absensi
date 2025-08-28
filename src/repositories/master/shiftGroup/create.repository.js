import shiftGroup from "../../../models/shiftGroup.model.js";
/**
 * Repository untuk create shift group
 * Direct database operation only
 * @param {Object} data - Data shift group
 * @returns {Object} Kebijakan absensi yang dibuat
 */
const createRepository = async (data, options = {}) => {
  const shift = await shiftGroup.create(data, options);
  return shift.toJSON();
};

export default createRepository;
