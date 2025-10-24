import { PegawaiLokasiKerja } from "../../../models/relational/pegawaiLokasiKerja.model.js";

const updateRepository = async (id, updateData, options = {}) => {
  const [updatedCount, updatedRows] = await PegawaiLokasiKerja.update(updateData, {
    where: { id },
    returning: true,
    ...options,
  });
  if (updatedCount === 0) {
    throw new Error("PEGAWAI_LOKASI_KERJA_NOT_FOUND");
  }
  return updatedRows[0].toJSON();
};

export default updateRepository;
