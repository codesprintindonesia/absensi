// src/services/master/shiftKerja/create.service.js
import createRepository from '../../../repositories/master/shiftKerja/create.repository.js';
 
const createService = async (data) => { 
  const newData = {
    ...data,
    is_aktif: data.is_aktif !== undefined ? data.is_aktif : true, 
  };
  return await createRepository(newData);
};

export default createService;
