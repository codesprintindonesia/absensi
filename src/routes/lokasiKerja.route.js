// src/routes/lokasiKerja.route.js
import { Router } from 'express';
import { Op } from 'sequelize';
import { LokasiKerja } from '../models/lokasiKerja.model.js';
import { validate } from '../middlewares/validate.middleware.js'
import {
  createLokasiSchema,
  updateLokasiSchema,
  listLokasiQuerySchema,
} from '../validations/lokasiKerja.validation.js';

const router = Router();

// LIST
router.get(
  '/',
  validate(listLokasiQuerySchema, 'query'),
  async (req, res, next) => {
    try {
      const { page, limit, type_lokasi, is_aktif, q } = req.query;
      const where = {};
      if (type_lokasi) where.type_lokasi = type_lokasi;
      if (typeof is_aktif === 'boolean') where.is_aktif = is_aktif;
      if (q) {
        where[Op.or] = [
          { nama: { [Op.iLike]: `%${q}%` } },
          { kode_referensi: { [Op.iLike]: `%${q}%` } },
        ];
      }

      const offset = (page - 1) * limit;
      const { rows, count } = await LokasiKerja.findAndCountAll({
        where,
        limit,
        offset,
        order: [['created_at', 'DESC']],
      });

      return res.json({
        code: 200,
        message: 'OK',
        data: rows,
        metadata: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
          hasNext: offset + rows.length < count,
        },
      });
    } catch (err) { next(err); }
  }
);

// DETAIL
router.get('/:id', async (req, res, next) => {
  try {
    const data = await LokasiKerja.findByPk(req.params.id);
    if (!data) {
      return res.status(404).json({ code: 404, message: 'Data tidak ditemukan', data: null, metadata: null });
    }
    return res.json({ code: 200, message: 'OK', data, metadata: null });
  } catch (err) { next(err); }
});

// CREATE
router.post(
  '/',
  validate(createLokasiSchema),
  async (req, res, next) => {
    try {
      const created = await LokasiKerja.create(req.body);
      return res.status(201).json({ code: 201, message: 'Berhasil membuat lokasi kerja', data: created, metadata: null });
    } catch (err) { next(err); }
  }
);

// UPDATE (full)
router.put(
  '/:id',
  validate(updateLokasiSchema),
  async (req, res, next) => {
    try {
      const [affected] = await LokasiKerja.update(req.body, { where: { id: req.params.id } });
      if (!affected) {
        return res.status(404).json({ code: 404, message: 'Data tidak ditemukan', data: null, metadata: null });
      }
      const fresh = await LokasiKerja.findByPk(req.params.id);
      return res.json({ code: 200, message: 'Berhasil mengubah lokasi kerja', data: fresh, metadata: null });
    } catch (err) { next(err); }
  }
);

// DELETE → soft delete (is_aktif = false)
router.delete('/:id', async (req, res, next) => {
  try {
    const inst = await LokasiKerja.findByPk(req.params.id);
    if (!inst) {
      return res.status(404).json({ code: 404, message: 'Data tidak ditemukan', data: null, metadata: null });
    }
    await inst.update({ is_aktif: false });
    return res.json({ code: 200, message: 'Berhasil menonaktifkan lokasi kerja', data: { id: inst.id, is_aktif: inst.is_aktif }, metadata: null });
  } catch (err) { next(err); }
});

export default router;
