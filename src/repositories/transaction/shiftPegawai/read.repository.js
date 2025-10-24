import ShiftPegawai from '../../../models/relational/shiftPegawai.model.js';
import { Op } from 'sequelize';

const readRepository = async (params, options = {}) => {
  const { page, limit, filters, orderBy } = params;
  const where = {};

  if (filters.id_pegawai) where.id_pegawai = filters.id_pegawai;
  if (filters.id_shift_kerja) where.id_shift_kerja = filters.id_shift_kerja;
  if (filters.id_shift_group) where.id_shift_group = filters.id_shift_group;
  if (filters.is_aktif !== undefined) where.is_aktif = filters.is_aktif;
  if (filters.search) {
    // contoh pencarian ke kolom id atau id_pegawai
    where[Op.or] = [
      { id: { [Op.iLike]: `%${filters.search}%` } },
      { id_pegawai: { [Op.iLike]: `%${filters.search}%` } },
    ];
  }

  const offset = (page - 1) * limit;
  const result = await ShiftPegawai.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: orderBy || [['created_at', 'DESC']],
    ...options,
  });

  return {
    rows: result.rows.map(r => r.toJSON()),
    count: result.count,
  };
};

export default readRepository;
