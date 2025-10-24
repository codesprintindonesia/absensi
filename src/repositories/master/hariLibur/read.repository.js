// src/repositories/master/hariLibur/read.repository.js
import { HariLibur } from '../../../models/hariLibur.model.js';
import { Op } from 'sequelize';

/**
 * Repository untuk read hari libur
 * Direct database operation only
 * @param {Object} options - Query options
 * @returns {Object} List hari libur dengan count
 */
const read = async (options = {}) => {
  const { page = 1, limit = 20, filters = {}, orderBy = [['tanggal', 'ASC']] } = options;
  
  const offset = (page - 1) * limit;
  const where = {};

  // Filter by jenis_libur
  if (filters.jenis_libur) {
    where.jenis_libur = filters.jenis_libur;
  }

  // Search by nama_libur or keterangan
  if (filters.search) {
    where[Op.or] = [
      { nama_libur: { [Op.iLike]: `%${filters.search}%` } },
      { keterangan: { [Op.iLike]: `%${filters.search}%` } }
    ];
  }

  const result = await HariLibur.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: orderBy,
  });

  return {
    rows: result.rows.map(row => row.toJSON()),
    count: result.count
  };
};

export default read;