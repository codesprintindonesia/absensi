import { PegawaiLokasiKerja } from "../../../models/relational/pegawaiLokasiKerja.model.js";

const readRepository = async (params, options = {}) => {
  const { page, limit, filters = {}, orderBy } = params;
  const where = {};

  if (filters.id_pegawai) where.id_pegawai = filters.id_pegawai;
  if (filters.id_lokasi_kerja) where.id_lokasi_kerja = filters.id_lokasi_kerja;
  if (typeof filters.is_aktif === "boolean") where.is_aktif = filters.is_aktif;
  if (typeof filters.is_lokasi_utama === "boolean") where.is_lokasi_utama = filters.is_lokasi_utama;
  if (filters.prioritas_lokasi) where.prioritas_lokasi = filters.prioritas_lokasi;
  if (filters.status_persetujuan) where.status_persetujuan = filters.status_persetujuan;
  if (filters.jenis_penugasan) where.jenis_penugasan = filters.jenis_penugasan;
  if (filters.tanggal_mulai_berlaku) where.tanggal_mulai_berlaku = filters.tanggal_mulai_berlaku;
  if (filters.tanggal_akhir_berlaku !== undefined) where.tanggal_akhir_berlaku = filters.tanggal_akhir_berlaku;

  const offset = (page - 1) * limit;

  const result = await PegawaiLokasiKerja.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: orderBy || [["created_at", "DESC"]],
    ...options,
  });

  return {
    rows: result.rows.map((r) => r.toJSON()),
    count: result.count,
  };
};

export default readRepository;
