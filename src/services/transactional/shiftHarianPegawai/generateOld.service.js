// src/services/transactional/shiftHarianPegawai/generate.service.js

import { getSequelize } from "../../../libraries/database.instance.js";
import logger from "../../../utils/logger.utils.js";

// Get sequelize instance
const sequelize = await getSequelize();

/**
 * Generate shift harian untuk pegawai
 *
 * @param {Object} params
 * @param {Date} params.tanggalMulai - Tanggal mulai
 * @param {Date} params.tanggalAkhir - Tanggal akhir
 * @param {string} params.idPegawai - Optional: ID pegawai spesifik
 * @returns {Promise<Object>}
 */
export const generateShiftHarianPegawaiService = async ({
  tanggalMulai,
  tanggalAkhir,
  idPegawai = null,
}) => {
  const transaction = await sequelize.transaction();

  try {
    logger.info("[ShiftHarianGenerator] Memulai generate shift harian", {
      tanggalMulai,
      tanggalAkhir,
      idPegawai,
    });

    // 1. Get daftar pegawai dari r_shift_pegawai
    const shiftPegawaiList = await sequelize.query(
      `SELECT * FROM absensi.r_shift_pegawai WHERE is_aktif = true ${
        idPegawai ? "AND id_pegawai = :idPegawai" : ""
      }`,
      {
        replacements: { idPegawai },
        type: sequelize.QueryTypes.SELECT,
        transaction,
      }
    );

    if (shiftPegawaiList.length === 0) {
      throw new Error("Tidak ada pegawai dengan shift assignment aktif");
    }

    // 2. Generate array tanggal
    const tanggalArray = generateDateArray(tanggalMulai, tanggalAkhir);

    const results = {
      totalPegawai: shiftPegawaiList.length,
      totalHari: tanggalArray.length,
      totalGenerated: 0,
      errors: [],
    };

    // 3. Process setiap pegawai
    for (const shiftPegawai of shiftPegawaiList) {
      try {
        await processShiftForPegawai({
          shiftPegawai,
          tanggalArray,
          transaction,
        });

        results.totalGenerated += tanggalArray.length;
      } catch (error) {
        results.errors.push({
          idPegawai: shiftPegawai.id_pegawai,
          namaPegawai: shiftPegawai.nama_pegawai,
          error: error.message,
        });
      }
    }

    await transaction.commit();

    logger.info(
      "[ShiftHarianGenerator] Selesai generate shift harian",
      results
    );

    return {
      success: true,
      message: "Generate shift harian berhasil",
      data: results,
    };
  } catch (error) {
    await transaction.rollback();

    logger.error("[ShiftHarianGenerator] Error generate shift harian", {
      error: error.message,
    });

    throw error;
  }
};

/**
 * Process shift untuk satu pegawai
 */
const processShiftForPegawai = async ({
  shiftPegawai,
  tanggalArray,
  transaction,
}) => {
  // Get lokasi kerja dengan prioritas terkecil
  const lokasi = await sequelize.query(
    `SELECT * FROM absensi.r_pegawai_lokasi_kerja 
     WHERE id_pegawai = :idPegawai AND is_aktif = true 
     ORDER BY prioritas_lokasi ASC LIMIT 1`,
    {
      replacements: { idPegawai: shiftPegawai.id_pegawai },
      type: sequelize.QueryTypes.SELECT,
      transaction,
    }
  );

  if (!lokasi || lokasi.length === 0) {
    throw new Error(
      `Pegawai ${shiftPegawai.id_pegawai} tidak memiliki lokasi kerja aktif`
    );
  }

  const lokasiKerja = lokasi[0];

  // Tentukan tipe shift
  const isFixedShift = shiftPegawai.id_shift_kerja !== null;
  const isRotatingShift = shiftPegawai.id_shift_group !== null;

  if (!isFixedShift && !isRotatingShift) {
    throw new Error(
      `Pegawai ${shiftPegawai.id_pegawai} tidak memiliki shift assignment yang valid`
    );
  }

  // Get shift pattern untuk rotating shift
  let shiftPattern = null;
  if (isRotatingShift) {
    shiftPattern = await sequelize.query(
      `SELECT * FROM absensi.r_shift_group_detail 
       WHERE id_shift_group = :idShiftGroup 
       ORDER BY urutan_minggu`,
      {
        replacements: { idShiftGroup: shiftPegawai.id_shift_group },
        type: sequelize.QueryTypes.SELECT,
        transaction,
      }
    );

    if (!shiftPattern || shiftPattern.length === 0) {
      throw new Error(
        `Shift group ${shiftPegawai.id_shift_group} tidak memiliki detail pattern`
      );
    }
  }

  // Process setiap tanggal
  for (let dayIndex = 0; dayIndex < tanggalArray.length; dayIndex++) {
    const tanggal = tanggalArray[dayIndex];

    // Check apakah sudah ada
    const existing = await sequelize.query(
      `SELECT id FROM absensi.t_shift_harian_pegawai 
       WHERE id_pegawai = :idPegawai AND tanggal_kerja = :tanggal`,
      {
        replacements: {
          idPegawai: shiftPegawai.id_pegawai,
          tanggal,
        },
        type: sequelize.QueryTypes.SELECT,
        transaction,
      }
    );

    if (existing && existing.length > 0) {
      throw new Error(
        `Shift untuk pegawai ${shiftPegawai.nama_pegawai} tanggal ${tanggal} sudah ada`
      );
    }

    // Tentukan shift_id
    let shiftId;
    if (isFixedShift) {
      shiftId = shiftPegawai.id_shift_kerja;
    } else {
      // Rotating shift
      const date = new Date(tanggal);
      // Gunakan format ISO (Senin=1, Minggu=7)
      const jsDay = date.getDay(); // 0–6
      const dayOfWeek = jsDay === 0 ? 7 : jsDay;

      const maxWeek = Math.max(...shiftPattern.map((p) => p.urutan_minggu));
      const daysInCycle = maxWeek * 7;
      const cycleDay = dayIndex % daysInCycle;
      const weekInCycle = Math.floor(cycleDay / 7) + 1;

      const pattern = shiftPattern.find(
        (p) =>
          p.urutan_minggu === weekInCycle && p.hari_dalam_minggu === dayOfWeek
      );

      if (!pattern || !pattern.id_shift_kerja) {
        throw new Error(
          `Pattern tidak ditemukan untuk minggu ${weekInCycle} hari ${dayOfWeek}`
        );
      }

      shiftId = pattern.id_shift_kerja;
    }

    // Generate ID
    const dateStr = tanggal.replace(/-/g, "");
    const id = `JDW-${shiftPegawai.id_pegawai}-${dateStr}`;

    // Insert
    await sequelize.query(
      `INSERT INTO absensi.t_shift_harian_pegawai (
        id, id_pegawai, tanggal_kerja, 
        id_shift_kerja_original, id_shift_kerja_final,
        id_lokasi_kerja_original, id_lokasi_kerja_final, 
        nama_pegawai, id_personal
      ) VALUES (
        :id, :idPegawai, :tanggalKerja,
        :shiftOriginal, :shiftFinal,
        :lokasiOriginal, :lokasiFinal,
        'NORMAL', 'APPROVED',
        :namaPegawai, :idPersonal
      )`,
      {
        replacements: {
          id,
          idPegawai: shiftPegawai.id_pegawai,
          tanggalKerja: tanggal,
          shiftOriginal: shiftId,
          shiftFinal: shiftId,
          lokasiOriginal: lokasiKerja.id_lokasi_kerja,
          lokasiFinal: lokasiKerja.id_lokasi_kerja,
          namaPegawai: shiftPegawai.nama_pegawai,
          idPersonal: shiftPegawai.id_personal,
        },
        type: sequelize.QueryTypes.INSERT,
        transaction,
      }
    );
  }
};

/**
 * Generate array tanggal dari start sampai end
 */
const generateDateArray = (startDate, endDate) => {
  const dates = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
};
