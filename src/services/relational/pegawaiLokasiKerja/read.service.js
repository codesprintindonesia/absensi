import readRepository from "../../../repositories/relational/pegawaiLokasiKerja/read.repository.js";

const readService = async (queryParams) => {
  const {
    page = 1,
    limit = 20,
    id_pegawai,
    id_lokasi_kerja,
    is_aktif, 
    prioritas_lokasi, 
    tanggal_mulai_berlaku,
    tanggal_akhir_berlaku,
  } = queryParams;

  // siapkan filter
  const filters = {};
  if (id_pegawai) filters.id_pegawai = id_pegawai;
  if (id_lokasi_kerja) filters.id_lokasi_kerja = id_lokasi_kerja;
  if (typeof is_aktif !== "undefined") filters.is_aktif = is_aktif === "true" || is_aktif === true; 
  if (prioritas_lokasi) filters.prioritas_lokasi = prioritas_lokasi; 
  if (tanggal_mulai_berlaku) filters.tanggal_mulai_berlaku = tanggal_mulai_berlaku;
  if (typeof tanggal_akhir_berlaku !== "undefined") filters.tanggal_akhir_berlaku = tanggal_akhir_berlaku;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  const options = {
    page: pageNum,
    limit: limitNum,
    filters,
    orderBy: [["created_at", "DESC"]],
  };

  const result = await readRepository(options);

  const metadata = {
    page: pageNum,
    limit: limitNum,
    total: result.count,
    totalPages: Math.ceil(result.count / limitNum),
    hasNext: pageNum * limitNum < result.count,
    hasPrev: pageNum > 1,
  };

  return {
    items: result.rows,
    metadata,
  };
};

export default readService;
