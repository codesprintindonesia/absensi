/**
 * Sequelize Model Associations
 * File: src/models/associations.model.js
 * 
 * Setup relationships antar models untuk enable JOIN queries
 */

import { ShiftHarianPegawai } from "./transactional/shiftHarianPegawai.model.js";
import { ShiftKerja } from "./master/shiftKerja.model.js";
import { AbsensiHarian } from "./transactional/absensiHarian.model.js";
import { LogRawAbsensi } from "./transactional/logRawAbsensi.model.js";

/**
 * Association untuk t_shift_harian_pegawai dengan m_shift_kerja
 * Relasi: Many-to-One (ShiftHarianPegawai -> ShiftKerja)
 */
ShiftHarianPegawai.belongsTo(ShiftKerja, {
  foreignKey: "id_shift_kerja_jadwal",
  as: "shiftKerja",
  targetKey: "id",
});

/**
 * Association untuk t_absensi_harian dengan t_log_raw_absensi (log masuk)
 * Relasi: Many-to-One (AbsensiHarian -> LogRawAbsensi)
 */
AbsensiHarian.belongsTo(LogRawAbsensi, {
  foreignKey: "id_log_masuk",
  as: "logMasuk",
  targetKey: "id",
});

/**
 * Association untuk t_absensi_harian dengan t_log_raw_absensi (log pulang)
 * Relasi: Many-to-One (AbsensiHarian -> LogRawAbsensi)
 */
AbsensiHarian.belongsTo(LogRawAbsensi, {
  foreignKey: "id_log_pulang",
  as: "logPulang",
  targetKey: "id",
});

/**
 * Association untuk t_absensi_harian dengan m_shift_kerja
 * Relasi: Many-to-One (AbsensiHarian -> ShiftKerja)
 */
AbsensiHarian.belongsTo(ShiftKerja, {
  foreignKey: "id_shift_kerja",
  as: "shift",
  targetKey: "id",
});

// Export empty object untuk konsistensi
export default {};