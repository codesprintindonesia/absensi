// ================================================================
// src/services/master/hariLibur/delete.service.js
// Service untuk delete hari libur DENGAN AUDIT LOG
// ================================================================

import { getSequelize } from "../../../libraries/database.instance.js";
import deleteRepository from "../../../repositories/master/hariLibur/delete.repository.js";
import findByIdRepository from "../../../repositories/master/hariLibur/findById.repository.js";
import { auditLog, AUDIT_ACTION } from "../../../utils/audit.util.js";
import HTTP_STATUS from "../../../constants/httpStatus.constant.js";

/**
 * Business logic untuk delete hari libur dengan audit log
 * @param {string} tanggal - Tanggal hari libur (PK)
 * @param {Object} req - Express request object
 * @returns {Object} Data hari libur yang dihapus
 */
const deleteHariLibur = async (tanggal, { req } = {}) => {
  const sequelize = await getSequelize();

  // Start manual transaction
  const transaction = await sequelize.transaction();

  console.log("Deleting holiday on tanggal:", tanggal);

  try {
    // Business Rule: Check if hari libur exists
    const existingHoliday = await findByIdRepository(tanggal, { transaction });
    if (!existingHoliday) {
      const error = new Error("HOLIDAY_NOT_FOUND");
      error.statusCode = HTTP_STATUS.NOT_FOUND; // 404
      throw error;
    }

    // Simpan data lama untuk audit
    const beforeData = existingHoliday;

    // Delete via repository
    await deleteRepository(tanggal, { transaction });

    // Log audit DELETE
    await auditLog({  
      action: AUDIT_ACTION.DELETE,
      tableName: "master.m_hari_libur",
      refId: tanggal,
      beforeData: beforeData,
      afterData: null,
      req,
      transaction,
    });

    // Commit transaction jika semua sukses
    await transaction.commit();

    return beforeData;
  } catch (error) {
    // Rollback jika ada error
    await transaction.rollback();
    throw error;
  }
};

export default deleteHariLibur;
