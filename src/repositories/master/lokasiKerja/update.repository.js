// src/repositories/update.repositories.js
import { LokasiKerja } from "../../../models/lokasiKerja.model.js";

/**
 * Repository untuk update lokasi kerja
 * Direct database operation only
 * @param {Object} data - Data lokasi kerja
 * @returns {Object} Lokasi kerja yang dibuat
 */
const update = async (data) => {
  const updateLocation = await LokasiKerja.update(
    {
      kode_referensi: data.kode_referensi,
      type_lokasi: data.type_lokasi,
      nama: data.nama,
      alamat: data.alamat,
      latitude: data.latitude,
      longitude: data.longitude,
      radius: data.radius,
      is_aktif: data.is_aktif,
      keterangan: data.keterangan,
    },
    {
      where: { id: data.id },
    }
  );

  console.log('UPDATE RESULT', updateLocation);
  return updateLocation;
};

export default update;
