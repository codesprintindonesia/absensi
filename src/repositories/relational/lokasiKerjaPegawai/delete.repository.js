import { PegawaiLokasiKerja } from "../../../models/relational/lokasiKerjaPegawai.model.js";

const deleteRepository = async (id, options = {}) => {
  const deletedCount = await PegawaiLokasiKerja.destroy({
    where: { id },
    ...options,
  });
  return deletedCount;
};

export default deleteRepository;
