// src/repositories/transaction/logRawAbsensi/read.repository.js
// Repository untuk membaca daftar log raw absensi pada domain transaction.

import { LogRawAbsensi } from "../../../models/logRawAbsensi.model.js";
import { Op } from "sequelize";

const read = async (params, options = {}) => {
  const { page, limit, filters, orderBy } = params;
  const where = {};
  if (filters.id_pegawai) where.id_pegawai = filters.id_pegawai;
  if (filters.id_lokasi_kerja) where.id_lokasi_kerja = filters.id_lokasi_kerja;
  if (filters.source_absensi) where.source_absensi = filters.source_absensi;
  if (filters.status_validasi) where.status_validasi = filters.status_validasi;
  if (filters.start_date && filters.end_date) {
    where.waktu_log = { [Op.between]: [filters.start_date, filters.end_date] };
  } else if (filters.start_date) {
    where.waktu_log = { [Op.gte]: filters.start_date };
  } else if (filters.end_date) {
    where.waktu_log = { [Op.lte]: filters.end_date };
  }
  if (filters.search) {
    where[Op.or] = [
      { id: { [Op.iLike]: `%${filters.search}%` } },
      { keterangan_log: { [Op.iLike]: `%${filters.search}%` } },
      { id_device: { [Op.iLike]: `%${filters.search}%` } },
    ];
  }
  const offset = (page - 1) * limit;
  const result = await LogRawAbsensi.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: orderBy || [["waktu_log", "DESC"]],
    ...options,
  });
  return {
    rows: result.rows.map((r) => r.toJSON()),
    count: result.count,
  };
};

export default read;
