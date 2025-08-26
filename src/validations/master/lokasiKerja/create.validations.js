// src/validations/create.validations.js
import Joi from 'joi';

const createSchema = Joi.object({
  id: Joi.string()
    .length(8)
    .pattern(/^LOK-[0-9]{4}$/)
    .required()
    .messages({
      'string.pattern.base': 'ID harus format LOK-xxxx (contoh: LOK-0001)',
      'string.length': 'ID harus 8 karakter'
    }),
    
  kode_referensi: Joi.string()
    .max(20)
    .required()
    .messages({
      'string.max': 'Kode referensi maksimal 20 karakter'
    }),
    
  type_lokasi: Joi.string()
    .valid('CABANG', 'DIVISI', 'UNIT_KERJA', 'CUSTOM', 'MOBILE')
    .required()
    .messages({
      'any.only': 'Type lokasi harus salah satu dari: CABANG, DIVISI, UNIT_KERJA, CUSTOM, MOBILE'
    }),
    
  nama: Joi.string()
    .max(100)
    .required()
    .messages({
      'string.max': 'Nama lokasi maksimal 100 karakter'
    }),
    
  alamat: Joi.string()
    .allow('')
    .optional(),
    
  // latitude: Joi.number()
  //   .min(-90)
  //   .max(90)
  //   .when('longitude', {
  //     is: Joi.exist(),
  //     then: Joi.required(),
  //     otherwise: Joi.optional()
  //   })
  //   .messages({
  //     'number.min': 'Latitude harus antara -90 sampai 90',
  //     'number.max': 'Latitude harus antara -90 sampai 90',
  //     'any.required': 'Latitude wajib jika longitude diisi'
  //   }),
    
  // longitude: Joi.number()
  //   .min(-180)
  //   .max(180)
  //   .when('latitude', {
  //     is: Joi.exist(),
  //     then: Joi.required(),
  //     otherwise: Joi.optional()
  //   })
  //   .messages({
  //     'number.min': 'Longitude harus antara -180 sampai 180',
  //     'number.max': 'Longitude harus antara -180 sampai 180',
  //     'any.required': 'Longitude wajib jika latitude diisi'
  //   }),
    
  radius: Joi.number()
    .integer()
    .min(1)
    .max(1000)
    .optional()
    .messages({
      'number.min': 'Radius minimal 1 meter',
      'number.max': 'Radius maksimal 1000 meter'
    }),
    
  is_aktif: Joi.boolean()
    .optional()
    .default(true),
    
  keterangan: Joi.string()
    .allow('')
    .optional()
});

export { createSchema };