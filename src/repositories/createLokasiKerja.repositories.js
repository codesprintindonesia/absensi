// src/repositories/createLokasiKerja.repositories.js
import { LokasiKerja } from '../models/lokasiKerja.model.js';

/**
 * Repository untuk create lokasi kerja
 * Direct database operation only
 * @param {Object} data - Data lokasi kerja
 * @returns {Object} Lokasi kerja yang dibuat
 */
const createLokasiKerja = async (data) => {
  const newLocation = await LokasiKerja.create(data);
  return newLocation.toJSON();
};

export { createLokasiKerja };