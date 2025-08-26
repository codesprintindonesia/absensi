// src/services/createLokasiKerja.services.js
import { createLokasiKerja as createLokasiKerjaRepo } from '../repositories/createLokasiKerja.repositories.js';
import { findByKodeReferensiAndType } from '../repositories/findLokasiKerja.repositories.js';

/**
 * Business logic untuk create lokasi kerja
 * @param {Object} data - Data lokasi kerja baru (sudah tervalidasi oleh Joi middleware)
 * @returns {Object} Lokasi kerja yang dibuat
 */
const createLokasiKerja = async (data) => {
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
    radius: data.radius || getDefaultRadius(data.type_lokasi),
    created_at: new Date(),
    updated_at: new Date()
  };

  // Simpan ke database via repository
  const newLocation = await createLokasiKerjaRepo(locationData);
  
  // Post-creation business logic
  await handlePostCreation(newLocation);
  
  return newLocation;
};

/**
 * Handle post-creation tasks
 * @param {Object} location - Lokasi yang baru dibuat
 */
const handlePostCreation = async (location) => {
  // Business Logic: Untuk cabang baru, buat shift group default
  if (location.type_lokasi === 'CABANG') {
    console.log(`📍 Cabang baru dibuat: ${location.nama}`);
    // Future: Create default shift groups, notify HR department, etc.
  }
  
  // Business Logic: Log audit trail
  console.log(`✅ Lokasi kerja dibuat: ${location.id} - ${location.nama}`);
};

export { createLokasiKerja };