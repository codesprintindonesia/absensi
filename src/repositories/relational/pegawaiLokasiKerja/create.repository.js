import { PegawaiLokasiKerja } from "../../../models/relational/pegawaiLokasiKerja.model.js";

const createRepository = async (data, options = {}) => {
  const row = await PegawaiLokasiKerja.create(data, options);
  return row.toJSON();
};

export default createRepository;
