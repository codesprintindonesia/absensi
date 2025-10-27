// src/validations/transactional/shiftHarianPegawai.validation.js

import Joi from 'joi';

/**
 * Validation schema untuk generate shift harian
 */
export const generateShiftSchema = Joi.object({
  tanggal_mulai: Joi.date()
    .iso()
    .required()
    .messages({
      'date.base': 'Tanggal mulai harus berupa tanggal yang valid',
      'date.format': 'Tanggal mulai harus dalam format ISO (YYYY-MM-DD)',
      'any.required': 'Tanggal mulai wajib diisi'
    }),

  tanggal_akhir: Joi.date()
    .iso()
    .min(Joi.ref('tanggal_mulai'))
    .required()
    .messages({
      'date.base': 'Tanggal akhir harus berupa tanggal yang valid',
      'date.format': 'Tanggal akhir harus dalam format ISO (YYYY-MM-DD)',
      'date.min': 'Tanggal akhir tidak boleh lebih kecil dari tanggal mulai',
      'any.required': 'Tanggal akhir wajib diisi'
    }),

  id_pegawai: Joi.string()
    .max(10)
    .trim()
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'ID pegawai maksimal 10 karakter'
    })
});