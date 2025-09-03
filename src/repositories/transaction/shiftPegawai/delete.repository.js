import ShiftPegawai from '../../../models/shiftPegawai.model.js';

const deleteRepository = async (id, options = {}) => {
  return await ShiftPegawai.destroy({ where: { id }, ...options });
};

export default deleteRepository;
