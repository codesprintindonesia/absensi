import createRepository from "../../../repositories/master/kebijakanDenda/create.repository.js";
/**
 * Business logic untuk create kebijakan denda
 * @param {Object} data - Data kebijakan denda baru (sudah tervalidasi oleh Joi middleware)
 * @returns {Object} Kebijakan denda yang dibuat
 */

const create = async (data) => {
  const policy = await createRepository(data);
  return policy;
};

export default create;
