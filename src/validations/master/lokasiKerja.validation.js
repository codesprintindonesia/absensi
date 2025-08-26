// src/validations/master/lokasiKerja.validation.js
import Joi from 'joi';
import { TYPE_LOKASI } from '../../models/lokasiKerja.model.js';

const idSchema = Joi.string().max(8).trim().required();

const base = {
  kode_referensi: Joi.string().max(20).trim().required(),
  type_lokasi: Joi.string().valid(...TYPE_LOKASI).required(),
  nama: Joi.string().max(100).trim().required(),
  alamat: Joi.string().allow(null, ''),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
  radius: Joi.number().integer().min(1).max(1000).optional(),
  is_aktif: Joi.boolean().optional(),
  keterangan: Joi.string().allow(null, ''),
};

export const createLokasiSchema = Joi.object({
  id: idSchema,
  ...base,
});

export const updateLokasiSchema = Joi.object({
  ...base, // id di params
}).min(1);

export const listLokasiQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  type_lokasi: Joi.string().valid(...TYPE_LOKASI).optional(),
  is_aktif: Joi.boolean().optional(),
  q: Joi.string().max(100).optional(),
});