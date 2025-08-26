// src/middlewares/error-handler.middleware.js
import { ValidationError } from 'sequelize';
// import logger from '../configs/logger.config.js'; // pastikan export default logger (winston)

// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
  const traceId = req.id || undefined;

  if (err?.name === 'SequelizeUniqueConstraintError') {
    // logger?.warn?.('409 Unique constraint', { err, traceId });
    return res.status(409).json({
      code: 409,
      message: 'Duplikat data: kombinasi kode_referensi dan type_lokasi sudah ada',
      data: null,
      metadata: { traceId },
    });
  }

  if (err instanceof ValidationError) {
    // logger?.warn?.('400 Sequelize validation', { err, traceId });
    return res.status(400).json({
      code: 400,
      message: 'Validasi database gagal',
      data: null,
      metadata: { traceId, details: err.errors?.map(e => ({ message: e.message, path: e.path })) },
    });
  }

  // logger?.error?.('500 Unhandled error', { err, traceId });
  return res.status(500).json({
    code: 500,
    message: 'Terjadi kesalahan pada server',
    data: null,
    metadata: { traceId },
  });
}
