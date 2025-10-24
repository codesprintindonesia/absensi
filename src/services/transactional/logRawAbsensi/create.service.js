// src/services/transaction/logRawAbsensi/create.service.js
// Service untuk membuat catatan log raw absensi pada domain transaction.

import createRepository from "../../../repositories/transactional/logRawAbsensi/create.repository.js";
import findByIdRepository from "../../../repositories/master/lokasiKerja/findById.repository.js";
// Di service/controller backend
const createLogRawAbsensi = async (data) => {
  // Fingerprint selalu valid
  if (data.source_absensi === "1") {
    return { status_validasi: "VALID", is_validasi_geofence: true };
  }

  // Mobile/QR tanpa data lokasi = valid
  if (!data.id_lokasi_kerja || data.jarak_dari_lokasi === undefined) {
    return { status_validasi: "VALID", is_validasi_geofence: true };
  }

  // Cek radius lokasi
  const lokasi = await findByIdRepository(data.id_lokasi_kerja);
  if (!lokasi) {
    return { status_validasi: "INVALID", is_validasi_geofence: false };
  }

  const isValid = data.jarak_dari_lokasi <= lokasi.radius; 

  // Simpan dengan status yang sudah ditentukan
  const logData = {
    ...data,
    status_validasi: isValid ? "VALID" : "INVALID",
    is_validasi_geofence: isValid,
  };

  console.log("logData:", logData);

  return await createRepository(logData);
};

export default createLogRawAbsensi;
