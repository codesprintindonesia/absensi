import readRepository from "../../../repositories/master/shiftGroupDetail/read.repository.js";

const readService = async (queryParams) => {
  const {
    page = 1,
    limit = 20,
    id_shift_group,
    id_shift_kerja,
    hari_dalam_minggu,
    urutan_minggu,
  } = queryParams;

  // siapkan filter
  const filters = {};
  if (id_shift_group) filters.id_shift_group = id_shift_group;
  if (id_shift_kerja) filters.id_shift_kerja = id_shift_kerja;
  if (hari_dalam_minggu) filters.hari_dalam_minggu = hari_dalam_minggu;
  if (urutan_minggu) filters.urutan_minggu = urutan_minggu;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    filters,
    orderBy: [["created_at", "DESC"]],
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
    items: result.rows,
    metadata,
  };
};

export default readService;
