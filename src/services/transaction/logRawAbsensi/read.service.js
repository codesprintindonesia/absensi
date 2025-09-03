// src/services/transaction/logRawAbsensi/read.service.js
// Service untuk mengambil daftar log raw absensi dengan filter dan pagination.

import readRepository from '../../../repositories/transaction/logRawAbsensi/read.repository.js';

const readService = async (queryParams) => {
  const {
    page = 1,
    limit = 20,
    id_pegawai,
    id_lokasi_kerja,
    source_absensi,
    status_validasi,
    start_date,
    end_date,
    search,
  } = queryParams;
  const filters = {};
  if (id_pegawai) filters.id_pegawai = id_pegawai;
  if (id_lokasi_kerja) filters.id_lokasi_kerja = id_lokasi_kerja;
  if (source_absensi) filters.source_absensi = source_absensi;
  if (status_validasi) filters.status_validasi = status_validasi;
  if (start_date) filters.start_date = start_date;
  if (end_date) filters.end_date = end_date;
  if (search) filters.search = search;
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    filters,
    orderBy: [['waktu_log', 'DESC']],
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
    logs: result.rows,
    metadata,
  };
};

export default readService;