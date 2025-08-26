// src/repositories/master/lokasiKerja/list.repository.js
import { LokasiKerja } from '../../../models/lokasiKerja.model.js';
import { Op } from 'sequelize';

/**
 * Repository untuk list lokasi kerja dengan filtering
 * Direct database operation only
 * @param {Object} options - Options untuk query
 * @returns {Object} Result dengan rows dan count
 */
const list = async (options) => {
  const { page, limit, filters, orderBy } = options;
  
  // Build where clause dari filters
  const where = {};
  
  if (filters.type_lokasi) {
    where.type_lokasi = filters.type_lokasi;
  }
  
  if (filters.is_aktif !== undefined) {
    where.is_aktif = filters.is_aktif;
  }
  
  if (filters.search) {
    where[Op.or] = [
      { nama: { [Op.iLike]: `%${filters.search}%` } },
      { kode_referensi: { [Op.iLike]: `%${filters.search}%` } },
      { alamat: { [Op.iLike]: `%${filters.search}%` } }
    ];
  }
  
  // Calculate offset untuk pagination
  const offset = (page - 1) * limit;
  
  // Execute query
  const result = await LokasiKerja.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: orderBy
  });
  
  return {
    rows: result.rows.map(row => row.toJSON()),
    count: result.count
  };
};

export default list;