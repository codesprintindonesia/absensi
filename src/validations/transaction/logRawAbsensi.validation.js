// src/validations/transaction/logRawAbsensi.validation.js
// Validasi input untuk modul log raw absensi pada domain transaction.

import Joi from "joi";

const idSchema = Joi.string().max(30).required();

const createSchema = Joi.object({
  id: idSchema,
  id_pegawai: Joi.string().max(10).required(),
  waktu_log: Joi.date().iso().required(),
  source_absensi: Joi.number().integer().required(),
  id_device: Joi.string().max(50).optional().allow(null),
  koordinat_gps: Joi.string().optional().allow(null, ""),
  id_lokasi_kerja: Joi.string().max(10).optional().allow(null),
  is_validasi_geofence: Joi.boolean().optional(),
  jarak_dari_lokasi: Joi.number().positive().optional(),
  akurasi_gps: Joi.number().positive().optional(),
  path_bukti_foto: Joi.string().optional().allow(null, ""),
  qr_hash: Joi.string().optional().allow(null, ""),
  keterangan_log: Joi.string().optional().allow(null, ""),
  status_validasi: Joi.string().valid("VALID", "INVALID").optional(), // Cuma 2 status
  nama_pegawai: Joi.string().optional().allow(null, ""),
  kode_cabang: Joi.string().optional().allow(null, ""),
  nama_cabang: Joi.string().optional().allow(null, ""),
  nama_jabatan_detail: Joi.string().optional().allow(null, ""),
});

const updateSchema = Joi.object({
  waktu_log: Joi.date().iso().optional(),
  source_absensi: Joi.number().integer().optional(),
  id_device: Joi.string().max(50).optional().allow(null),
  koordinat_gps: Joi.string().optional().allow(null, ""),
  id_lokasi_kerja: Joi.string().max(10).optional().allow(null),
  is_validasi_geofence: Joi.boolean().optional(),
  jarak_dari_lokasi: Joi.number().positive().optional(),
  akurasi_gps: Joi.number().positive().optional(),
  path_bukti_foto: Joi.string().optional().allow(null, ""),
  qr_hash: Joi.string().optional().allow(null, ""),
  keterangan_log: Joi.string().optional().allow(null, ""),
  status_validasi: Joi.string().valid("VALID", "INVALID").optional(), // Cuma 2 status
  nama_pegawai: Joi.string().optional().allow(null, ""),
  kode_cabang: Joi.string().optional().allow(null, ""),
  nama_cabang: Joi.string().optional().allow(null, ""),
  nama_jabatan_detail: Joi.string().optional().allow(null, ""),
}).min(1);

const readSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  id_pegawai: Joi.string().max(10).optional(),
  id_lokasi_kerja: Joi.string().max(10).optional(),
  source_absensi: Joi.number().integer().optional(),
  status_validasi: Joi.string().valid("VALID", "INVALID").optional(), // Cuma 2 status
  start_date: Joi.date().iso().optional(),
  end_date: Joi.date().iso().optional(),
  search: Joi.string().optional(),
});

const paramsSchema = Joi.object({
  id: idSchema,
});

export { createSchema, updateSchema, readSchema, paramsSchema };
