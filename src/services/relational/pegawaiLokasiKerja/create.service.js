import createRepository from "../../../repositories/relational/pegawaiLokasiKerja/create.repository.js";
import readRepository from "../../../repositories/relational/pegawaiLokasiKerja/read.repository.js";
import HTTP_STATUS from "../../../constants/httpStatus.constant.js";

const createService = async (data) => { 
  // jalankan insert ke database
  const result = await createRepository(data);
  return result;
};

export default createService;
