// src/repositories/master/shiftKerja/findByKodeShift.repository.js
import { ShiftKerja } from '../../../models/shiftKerja.model.js';

const findByKodeShift = async (kodeShift, excludeId = null, options = {}) => {
  const where = { kode_shift: kodeShift };
  if (excludeId) {
    where.id = { [ShiftKerja.sequelize.Op.ne]: excludeId };
  }
  const record = await ShiftKerja.findOne({ where, ...options });
  return record ? record.toJSON() : null;
};

export default findByKodeShift;
