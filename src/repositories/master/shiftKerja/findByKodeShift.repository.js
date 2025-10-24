// src/repositories/master/shiftKerja/findByKodeShift.repository.js
import { ShiftKerja } from '../../../models/master/shiftKerja.model.js';
import { Op } from 'sequelize';

const findByKodeShift = async (kodeShift, excludeId = null, options = {}) => {
  const where = { kode_shift: kodeShift };
  if (excludeId) {
    where.id = { [Op.ne]: excludeId };
  }
  const record = await ShiftKerja.findOne({ where, ...options });
  return record ? record.toJSON() : null;
};

export default findByKodeShift;
