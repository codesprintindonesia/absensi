import createRepository from "../../../repositories/relational/pegawaiLokasiKerja/create.repository.js";
import readRepository from "../../../repositories/relational/pegawaiLokasiKerja/read.repository.js";
import HTTP_STATUS from "../../../constants/httpStatus.constant.js";

const createService = async (data) => {
  // cek apakah data menyatakan lokasi utama
  if (data.is_lokasi_utama === true) {
    // cari apakah pegawai sudah punya lokasi utama aktif lain
    const existing = await readRepository({
      page: 1,
      limit: 1,
      filters: {
        id_pegawai: data.id_pegawai,
        is_lokasi_utama: true,
        is_aktif: true,
      },
    });

    if (existing.count > 0) {
      const error = new Error(
        "PEGAWAI_SUDAH_PUNYA_LOKASI_UTAMA_AKTIF"
      );
      error.statusCode = HTTP_STATUS.CONFLICT;
      throw error;
    }
  }

  // jalankan insert ke database
  const result = await createRepository(data);
  return result;
};

export default createService;
