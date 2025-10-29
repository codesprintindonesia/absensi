// src/services/transactional/shiftHarianPegawai/deleteRange.service.js

import { getSequelize } from "../../../libraries/database.instance.js";
import logger from "../../../utils/logger.utils.js";
import deleteByRange from "../../../repositories/transactional/shiftHarianPegawai/deleteByRange.repository.js";
import findByRange from "../../../repositories/transactional/shiftHarianPegawai/findByRange.repository.js";

const sequelize = await getSequelize();

/**
 * Delete shift harian untuk rentang tanggal
 * Use case: pembatalan jadwal, error data, dll
 */
export const deleteRangeShiftService = async ({
  idPegawai,
  tanggalMulai,
  tanggalAkhir,
  alasanHapus = null,
}) => {
  const transaction = await sequelize.transaction();

  try {
    // Validate existing data
    const existing = await findByRange(
      { idPegawai, tanggalMulai, tanggalAkhir },
      { transaction }
    );

    if (existing.length === 0) {
      throw new Error(
        `Tidak ada data shift untuk pegawai ${idPegawai} pada rentang ${tanggalMulai} - ${tanggalAkhir}`
      );
    }

    const count = await deleteByRange(
      idPegawai,
      tanggalMulai,
      tanggalAkhir,
      { transaction }
    );

    await transaction.commit();

    logger.info("[DeleteRangeShift] Success", {
      idPegawai,
      totalDeleted: count,
      dateRange: `${tanggalMulai} - ${tanggalAkhir}`,
      alasanHapus,
    });

    return {
      success: true,
      message: "Shift harian berhasil dihapus",
      data: {
        totalDeleted: count,
        dateRange: { tanggalMulai, tanggalAkhir },
        deletedRecords: existing.length,
      },
    };
  } catch (error) {
    await transaction.rollback();
    logger.error("[DeleteRangeShift] Error", {
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

export default deleteRangeShiftService;