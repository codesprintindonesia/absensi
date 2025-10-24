import Joi from "joi";

const idSchema = Joi.string().max(20).trim().required();

const baseFields = {
  id_pegawai: Joi.string().max(10).trim().required(),
  id_shift_kerja: Joi.string().max(8).trim().allow(null),
  id_shift_group: Joi.string().max(8).trim().allow(null),
  tanggal_mulai: Joi.date().iso().required(),
  tanggal_akhir: Joi.date().iso().min(Joi.ref("tanggal_mulai")).allow(null),
  is_aktif: Joi.boolean().default(true),
  id_personal: Joi.string().max(20).trim().required(),
  nama_pegawai: Joi.string().max(100).trim().required(),
};

const createSchema = Joi.object({
  id: idSchema,
  ...baseFields,
}).custom((value, helpers) => {
  if (!value.id_shift_kerja && !value.id_shift_group) {
    return helpers.error("any.invalid", { message: "Harus mengisi salah satu dari id_shift_kerja atau id_shift_group" });
  }
  if (value.id_shift_kerja && value.id_shift_group) {
    return helpers.error("any.invalid", { message: "Hanya salah satu dari id_shift_kerja atau id_shift_group yang boleh diisi" });
  }
  return value;
});

const updateSchema = Joi.object({
  id_pegawai: Joi.string().max(10).trim(),
  id_shift_kerja: Joi.string().max(8).trim().allow(null),
  id_shift_group: Joi.string().max(8).trim().allow(null),
  tanggal_mulai: Joi.date().iso(),
  tanggal_akhir: Joi.alternatives().try(
    Joi.date().iso().min(Joi.ref("tanggal_mulai")),
    Joi.valid(null)
  ),
  is_aktif: Joi.boolean(),
  id_personal: Joi.string().max(20).trim(),
  nama_pegawai: Joi.string().max(100).trim(),
}).min(1).custom((value, helpers) => {
  const ker = value.id_shift_kerja;
  const grp = value.id_shift_group;
  if (ker !== undefined || grp !== undefined) {
    if ((ker === null || ker === undefined) && (grp === null || grp === undefined)) {
      return helpers.error("any.invalid", { message: "Harus mengisi salah satu dari id_shift_kerja atau id_shift_group" });
    }
    if (ker && grp) {
      return helpers.error("any.invalid", { message: "Hanya salah satu dari id_shift_kerja atau id_shift_group yang boleh diisi" });
    }
  }
  return value;
});

const readSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  id_pegawai: Joi.string().max(10).trim().optional(),
  id_shift_kerja: Joi.string().max(8).trim().optional(),
  id_shift_group: Joi.string().max(8).trim().optional(),
  is_aktif: Joi.boolean().optional(),
});

const paramsSchema = Joi.object({
  id: idSchema,
});

export { createSchema, updateSchema, readSchema, paramsSchema };
