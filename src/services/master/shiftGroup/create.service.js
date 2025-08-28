import createRepository from "../../../repositories/master/shiftGroup/create.repository.js";
/**
 * Business logic untuk create shift group
 * @param {Object} data - Data shift group baru (sudah tervalidasi oleh Joi middleware)
 * @returns {Object} Kebijakan denda yang dibuat
 */

const createService = async (data) => {
  const shift = await createRepository(data);
  return shift;
};

export default createService;
