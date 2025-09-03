import ShiftPegawai from '../../../models/shiftPegawai.model.js';

const createRepository = async (data, options = {}) => {
  const row = await ShiftPegawai.create(data, options);
  return row.toJSON();
};

export default createRepository;
