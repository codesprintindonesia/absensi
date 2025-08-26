// src/services/master/lokasiKerja/list.service.js
import listRepository from '../../../repositories/master/lokasiKerja/list.repository.js';

/**
 * Business logic untuk list lokasi kerja
 * @param {Object} queryParams - Query parameters (sudah tervalidasi oleh Joi middleware)
 * @returns {Object} List lokasi kerja dengan metadata pagination
 */
const list = async (queryParams) => {
  const { page, limit, type_lokasi, is_aktif, q } = queryParams;
  
  // Build filter object
  const filters = {};
  if (type_lokasi) filters.type_lokasi = type_lokasi;
  if (is_aktif !== undefined) filters.is_aktif = is_aktif;
  if (q) filters.search = q; // Search akan dihandle di repository
  
  // Business logic: Default sorting berdasarkan created_at terbaru
  const options = {
    page,
    limit,
    filters,
    orderBy: [['created_at', 'DESC']]
  };
  
  // Get data dari repository
  const result = await listRepository(options);
  
  // Transform response dengan metadata pagination
  const metadata = {
    page: parseInt(page),
    limit: parseInt(limit),
    total: result.count,
    totalPages: Math.ceil(result.count / limit),
    hasNext: (page * limit) < result.count,
    hasPrev: page > 1
  };
  
  return {
    locations: result.rows,
    metadata
  };
};

export { list };