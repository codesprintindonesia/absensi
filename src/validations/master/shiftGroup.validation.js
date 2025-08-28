// src/validations/master/lokasiKerja.validation.js
import Joi from "joi"; 

/*
CREATE TABLE absensi.m_shift_group (
	id varchar(8) NOT NULL,
	nama varchar(100) NOT NULL,
	durasi_rotasi_minggu int4 DEFAULT 1 NULL,
	keterangan text NULL,
	is_aktif bool DEFAULT true NULL,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT m_shift_group_durasi_rotasi_minggu_check CHECK ((durasi_rotasi_minggu > 0)),
	CONSTRAINT m_shift_group_pkey PRIMARY KEY (id)
);

*/

// Schema dasar untuk field lokasi kerja
const idSchema = Joi.string().max(8).trim().required();

const baseFields = {
  nama: Joi.string().max(100).trim().required(),
  durasi_rotasi_minggu: Joi.number().integer().min(1).optional(), // sesuai constraint durasi > 0:contentReference[oaicite:1]{index=1}
  keterangan: Joi.string().allow(null, "").optional(),
  is_aktif: Joi.boolean().optional(),
};

// CREATE validation
const createSchema = Joi.object({
  ...baseFields,
  id: idSchema,
});

// UPDATE validation
const updateSchema = Joi.object({
  ...baseFields, // id ada di params
}).min(1);

// LIST validation (untuk query parameters)
const readSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20), 
  is_aktif: Joi.boolean().optional(),
  search: Joi.string().max(100).optional().allow(''),
});

// PARAMS validation (untuk :id di URL)
const paramsSchema = Joi.object({
  id: idSchema,
});

// HEADER validation example (jika diperlukan)
const headerSchema = Joi.object({
  'x-client-version': Joi.string().optional(),
  'x-device-id': Joi.string().optional(),
  'authorization': Joi.string().pattern(/^Bearer .+/).optional(),
  // Joi akan ignore headers lain yang tidak didefinisikan
}).unknown(true);

// Export semua schemas
export { 
  createSchema, 
  updateSchema, 
  readSchema,
  paramsSchema,
  headerSchema
};