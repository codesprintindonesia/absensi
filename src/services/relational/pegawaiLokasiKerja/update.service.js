// src/services/relational/pegawaiLokasiKerja/update.service.js
import updateRepository from "../../../repositories/relational/pegawaiLokasiKerja/update.repository.js";
import findByIdRepository from "../../../repositories/relational/pegawaiLokasiKerja/findById.repository.js";
import readRepository from "../../../repositories/relational/pegawaiLokasiKerja/read.repository.js";
import HTTP_STATUS from "../../../constants/httpStatus.constant.js";

const updateService = async (id, updateData, updatedBy = "SYSTEM") => {
  // pastikan data ada
  const existing = await findByIdRepository(id);
  if (!existing) {
    const error = new Error("PEGAWAI_LOKASI_KERJA_NOT_FOUND");
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }

  // nilai target setelah update (pakai payload jika ada, fallback ke existing)
  const targetIdPegawai =
    updateData.id_pegawai !== undefined ? updateData.id_pegawai : existing.id_pegawai;

  const targetIsLokasiUtama =
    updateData.is_lokasi_utama !== undefined ? updateData.is_lokasi_utama : existing.is_lokasi_utama;

  const targetIsAktif =
    updateData.is_aktif !== undefined ? updateData.is_aktif : existing.is_aktif;

  // VALIDASI: 1 pegawai tidak boleh punya >1 lokasi utama & aktif
  if (targetIsLokasiUtama === true && targetIsAktif === true) {
    const check = await readRepository({
      page: 1,
      limit: 1,
      filters: {
        id_pegawai: targetIdPegawai,
        is_lokasi_utama: true,
        is_aktif: true,
      },
      // order default by created_at desc di repo
    });

    const conflict = check.rows.find((r) => r.id !== id);
    if (conflict) {
      const error = new Error("PEGAWAI_SUDAH_PUNYA_LOKASI_UTAMA_AKTIF");
      error.statusCode = HTTP_STATUS.CONFLICT; // 409
      throw error;
    }
  }

  // siapkan payload final (gaya kamu: catat updated_by & updated_at)
  const dataToUpdate = {
    ...updateData,
    updated_by: updatedBy,
    updated_at: new Date(),
  };

  const updated = await updateRepository(id, dataToUpdate);
  return updated;
};

export default updateService;
