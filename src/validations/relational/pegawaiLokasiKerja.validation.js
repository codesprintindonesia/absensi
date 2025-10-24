import Joi from "joi";
import { JENIS_PENUGASAN } from "../../models/relational/pegawaiLokasiKerja.model.js";
import { STATUS_PERSETUJUAN } from "../../models/relational/pegawaiLokasiKerja.model.js";

// id maksimal 25 karakter, wajib
const idSchema = Joi.string().max(25).trim().required(); 

// base fields
const baseFields = {
  id_pegawai: Joi.string().max(10).trim().required(),
  id_lokasi_kerja: Joi.string().max(8).trim().required(),
  tanggal_mulai_berlaku: Joi.date().iso().required(),
  tanggal_akhir_berlaku: Joi.date().iso().min(Joi.ref("tanggal_mulai_berlaku")).allow(null),
  jenis_penugasan: Joi.string().valid(...JENIS_PENUGASAN).default("REGULAR"),
  prioritas_lokasi: Joi.number().integer().min(1).default(1),
  is_lokasi_utama: Joi.boolean().default(false),
  keterangan: Joi.string().allow("", null),
  disetujui_oleh: Joi.string().max(10).trim().allow(null),
  tanggal_persetujuan: Joi.date().iso().allow(null),
  status_persetujuan: Joi.string().valid(...STATUS_PERSETUJUAN).default("APPROVED"),
  is_aktif: Joi.boolean().default(true),
  id_personal: Joi.string().max(20).trim().allow(null),
};

// validasi create
const createSchema = Joi.object({
  id: idSchema,
  ...baseFields,
});

// validasi update: minimal satu field diisi
// Catatan: untuk update, tanggal_akhir_berlaku tetap menjaga relasi >= tanggal_mulai_berlaku bila keduanya ada
const updateSchema = Joi.object({
  id_pegawai: Joi.string().max(10).trim(),
  id_lokasi_kerja: Joi.string().max(8).trim(),
  tanggal_mulai_berlaku: Joi.date().iso(),
  tanggal_akhir_berlaku: Joi.alternatives().try(
    Joi.date().iso().min(Joi.ref("tanggal_mulai_berlaku")),
    Joi.valid(null)
  ),
  jenis_penugasan: Joi.string().valid(...JENIS_PENUGASAN),
  prioritas_lokasi: Joi.number().integer().min(1),
  is_lokasi_utama: Joi.boolean(),
  keterangan: Joi.string().allow(""),
  disetujui_oleh: Joi.string().max(10).trim().allow(null),
  tanggal_persetujuan: Joi.date().iso().allow(null),
  status_persetujuan: Joi.string().valid(...STATUS_PERSETUJUAN),
  is_aktif: Joi.boolean(),
  id_personal: Joi.string().max(20).trim().allow(null),
}).min(1);

// validasi read (list)
const readSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),

  id_pegawai: Joi.string().max(10).trim().optional(),
  id_lokasi_kerja: Joi.string().max(8).trim().optional(),
  is_aktif: Joi.boolean().optional(),
  is_lokasi_utama: Joi.boolean().optional(),
  prioritas_lokasi: Joi.number().integer().min(1).optional(),
  status_persetujuan: Joi.string().valid(...STATUS_PERSETUJUAN).optional(),
  jenis_penugasan: Joi.string().valid(...JENIS_PENUGASAN).optional(),

  // filter tanggal opsional
  tanggal_mulai_berlaku: Joi.date().iso().optional(),
  tanggal_akhir_berlaku: Joi.alternatives().try(Joi.date().iso(), Joi.valid(null)).optional(),
});

// validasi params (:id)
const paramsSchema = Joi.object({
  id: idSchema,
});

// validasi header (opsional, mengikuti gaya kamu)
const headerSchema = Joi.object({
  "x-client-version": Joi.string().optional(),
  "x-device-id": Joi.string().optional(),
  authorization: Joi.string().pattern(/^Bearer .+/).optional(),
}).unknown(true);

export {
  createSchema,
  updateSchema,
  readSchema,
  paramsSchema,
  headerSchema,
};
