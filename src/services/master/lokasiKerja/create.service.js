import createRepository from '../../../repositories/master/lokasiKerja/create.repository.js';
import findByKodeReferensiAndType from '../../../repositories/master/lokasiKerja/findByKodeReferensiAndType.repository.js';

/**
 * Business logic untuk create lokasi kerja
 * @param {Object} data - Data lokasi kerja baru (sudah tervalidasi oleh Joi middleware)
 * @returns {Object} Lokasi kerja yang dibuat
 */
const create = async (data) => {
  // Business Rule 1: Check duplicate kode_referensi + type_lokasi
  const existingLocation = await findByKodeReferensiAndType(data.kode_referensi, data.type_lokasi);
  if (existingLocation) {
    throw new Error('Kombinasi kode referensi dan type lokasi sudah ada');
  } 

  // Business Rule 3: Set default radius berdasarkan type lokasi
  const getDefaultRadius = (type) => {
    switch (type) {
      case 'MOBILE': return 100;  // Mobile worker radius lebih besar
      case 'CABANG': return 50;   // Cabang area sedang
      case 'UNIT_KERJA': return 30; // Unit kerja area kecil
      default: return 20;         // Default radius
    }
  };

  // Transform data dengan business rules
  const locationData = {
    ...data,
    is_aktif: data.is_aktif !== undefined ? data.is_aktif : true,
    radius: data.radius || getDefaultRadius(data.type_lokasi)
  };

  // Simpan ke database via repository
  const newLocation = await createRepository(locationData);
  
  return newLocation;
};

export { create };