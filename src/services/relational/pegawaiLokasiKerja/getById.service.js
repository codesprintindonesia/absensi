import findByIdRepository from "../../../repositories/relational/pegawaiLokasiKerja/findById.repository.js";
import HTTP_STATUS from "../../../constants/httpStatus.constant.js";

const getById = async (id) => {
  const detail = await findByIdRepository(id);
  if (!detail) {
    const error = new Error("PEGAWAI_LOKASI_KERJA_NOT_FOUND");
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }
  return detail;
};

export default getById;
