import createRepository from "../../../repositories/master/shiftGroupDetail/create.repository.js";

const createService = async (data) => {
  return await createRepository(data);
};

export default createService;
