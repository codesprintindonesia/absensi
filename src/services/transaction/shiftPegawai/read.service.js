import readRepository from '../../../repositories/transaction/shiftPegawai/read.repository.js';

const readService = async (queryParams) => {
  const { page, limit, id_pegawai, id_shift_kerja, id_shift_group, is_aktif, q } = queryParams;

  const filters = {};
  if (id_pegawai) filters.id_pegawai = id_pegawai;
  if (id_shift_kerja) filters.id_shift_kerja = id_shift_kerja;
  if (id_shift_group) filters.id_shift_group = id_shift_group;
  if (is_aktif !== undefined) filters.is_aktif = is_aktif;
  if (q) filters.search = q;

  const options = {
    page,
    limit,
    filters,
    orderBy: [['created_at', 'DESC']],
  };

  const result = await readRepository(options);
  const metadata = {
    page: parseInt(page),
    limit: parseInt(limit),
    total: result.count,
    totalPages: Math.ceil(result.count / limit),
    hasNext: (page * limit) < result.count,
    hasPrev: page > 1,
  };

  return {
    assignments: result.rows,
    metadata,
  };
};

export default readService;
