// src/repositories/master/kebijakanAbsensi/read.repository.js
import { KebijakanAbsensi } from "../../../models/master/kebijakanAbsensi.model.js";
import { Op } from "sequelize";

/**
 * Repository untuk read lokasi kerja dengan filtering
 * Direct database operation only
 * @param {Object} params - params untuk query
 * @returns {Object} Result dengan rows dan count
 */
const readRepository = async (params, options = {}) => {
  const { page, limit, filters, orderBy } = params;

  // Build where clause dari filters
  const where = {}; 

  if (filters.is_aktif !== undefined) {
    where.is_aktif = filters.is_aktif;
  }

  if (filters.search) {
    where[Op.or] = [
      { nama: { [Op.iLike]: `%${filters.search}%` } },
      { kode_referensi: { [Op.iLike]: `%${filters.search}%` } }
    ];
  }

  // Calculate offset untuk pagination
  const offset = (page - 1) * limit;

  // Execute query
  const result = await KebijakanAbsensi.findAndCountAll(
    {
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: orderBy,
    },
    options
  );

  return {
    rows: result.rows.map((row) => row.toJSON()),
    count: result.count,
  };
};

export default readRepository;
