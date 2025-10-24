// src/validations/master/hariLibur.validation.js
import Joi from "joi";

// Jenis libur constants
const JENIS_LIBUR = ['LIBUR_NASIONAL', 'CUTI_BERSAMA', 'LIBUR_DAERAH'];

// Schema dasar untuk field hari libur
const baseFields = {
  tanggal: Joi.date().iso().required(),
  nama_libur: Joi.string().max(100).trim().required(),
  jenis_libur: Joi.string().valid(...JENIS_LIBUR).required(),
  keterangan: Joi.string().allow(null, "").optional(),
};

// CREATE validation
const createSchema = Joi.object({
  ...baseFields,
});

// UPDATE validation
const updateSchema = Joi.object({
  nama_libur: Joi.string().max(100).trim().optional(),
  jenis_libur: Joi.string().valid(...JENIS_LIBUR).optional(),
  keterangan: Joi.string().allow(null, "").optional(),
}).min(1);

// LIST validation (untuk query parameters)
const readSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  jenis_libur: Joi.string().valid(...JENIS_LIBUR).optional(),
  search: Joi.string().max(100).optional().allow(''),
});

// PARAMS validation (untuk :tanggal di URL)
const paramsSchema = Joi.object({
  tanggal: Joi.date().iso().required(),
});

// Export semua schemas
export { 
  createSchema, 
  updateSchema, 
  readSchema,
  paramsSchema
};