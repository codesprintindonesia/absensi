// src/services/master/shiftGroup/read.service.js
import readRepository from '../../../repositories/master/shiftKerja/read.repository.js';
 
const readService = async (queryParams) => {
  const { page = 1, limit = 20, is_aktif, search } = queryParams;
  
  // Build filter object
  const filters = {}; 
  if (is_aktif !== undefined) filters.is_aktif = is_aktif; 
  if (search) filters.search = search; // Search akan dihandle di repository
  
  // Business logic: Default sorting berdasarkan created_at terbaru
  const options = {
    page,
    limit,
    filters,
    orderBy: [['created_at', 'DESC']]
  };
  
  // Get data dari repository
  const result = await readRepository(options);
  
  // Transform response dengan metadata pagination
  const metadata = {
    page: parseInt(page),
    limit: parseInt(limit),
    total: result.count,
    totalPages: Math.ceil(result.count / limit),
    hasNext: (page * limit) < result.count,
    hasPrev: page > 1
  };
  
  return {
    locations: result.rows,
    metadata
  };
};

export default readService;