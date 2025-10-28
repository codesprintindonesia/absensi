// src/repositories/transactional/absensiHarian/rekonsiliasi.repository.js
// import pool from "../../../config/database.js";
import { getSequelize } from "../../../libraries/database.instance.js";

const pool = await getSequelize();

/**
 * Ambil jadwal shift harian pegawai untuk tanggal tertentu
 */
export const getShiftHarianByDate = async (tanggal) => {
  const query = `
    SELECT 
      tsp.id,
      tsp.id_pegawai,
      tsp.tanggal_kerja,
      tsp.id_shift_kerja_final as id_shift_kerja,
      tsp.id_lokasi_kerja_final as id_lokasi_kerja,
      tsp.nama_pegawai,
      tsp.id_personal,
      sk.nama as nama_shift,
      sk.jam_masuk,
      sk.jam_pulang,
      sk.durasi_istirahat,
      sk.toleransi_keterlambatan,
      lk.nama as nama_lokasi,
      lk.kode_referensi as kode_lokasi
    FROM absensi.t_shift_harian_pegawai tsp
    INNER JOIN absensi.m_shift_kerja sk ON tsp.id_shift_kerja_final = sk.id
    INNER JOIN absensi.m_lokasi_kerja lk ON tsp.id_lokasi_kerja_final = lk.id
    WHERE tsp.tanggal_kerja = $1
    ORDER BY tsp.id_pegawai
  `;
  
  const result = await pool.query(query, [tanggal]);
  return result.rows;
};

/**
 * Ambil raw log absensi untuk tanggal tertentu
 */
export const getRawAbsensiByDate = async (tanggal) => {
  const query = `
    SELECT 
      id, 
      id_pegawai, 
      waktu_log,
      id_lokasi_kerja,
      koordinat_gps,
      source_absensi,
      keterangan_log
    FROM absensi.t_log_raw_absensi
    WHERE DATE(waktu_log) = $1
    ORDER BY id_pegawai, waktu_log ASC
  `;
  
  const result = await pool.query(query, [tanggal]);
  return result.rows;
};

/**
 * Ambil kebijakan absensi yang aktif
 */
export const getKebijakanAbsensiAktif = async () => {
  const query = `
    SELECT 
      id,
      nama,
      toleransi_keterlambatan,
      min_jam_kerja_full_day,
      jam_cut_off_hari
    FROM absensi.m_kebijakan_absensi
    WHERE is_default = true 
      AND is_active = true
    LIMIT 1
  `;
  
  const result = await pool.query(query);
  return result.rows[0] || null;
};

/**
 * Ambil lokasi kerja pegawai yang aktif
 */
export const getLokasiKerjaPegawai = async (idPegawai, tanggal) => {
  const query = `
    SELECT 
      id_lokasi_kerja,
      lk.nama as nama_lokasi,
      lk.kode_referensi as kode_lokasi,
      prioritas_lokasi
    FROM absensi.r_lokasi_kerja_pegawai rlkp
    INNER JOIN absensi.m_lokasi_kerja lk ON rlkp.id_lokasi_kerja = lk.id
    WHERE rlkp.id_pegawai = $1
      AND rlkp.is_active = true
      AND rlkp.tanggal_mulai_berlaku <= $2
      AND (rlkp.tanggal_akhir_berlaku IS NULL OR rlkp.tanggal_akhir_berlaku >= $2)
    ORDER BY prioritas_lokasi ASC
  `;
  
  const result = await pool.query(query, [idPegawai, tanggal]);
  return result.rows;
};

/**
 * Cek apakah data absensi sudah ada untuk pegawai di tanggal tertentu
 */
export const checkAbsensiExists = async (idPegawai, tanggal) => {
  const query = `
    SELECT id 
    FROM absensi.t_absensi_harian
    WHERE id_pegawai = $1 AND tanggal_absensi = $2
  `;
  
  const result = await pool.query(query, [idPegawai, tanggal]);
  return result.rows.length > 0;
};

/**
 * Insert data absensi harian baru
 */
export const insertAbsensiHarian = async (absensiData) => {
  const query = `
    INSERT INTO absensi.t_absensi_harian (
      id, id_pegawai, tanggal_absensi, id_shift_kerja, id_lokasi_kerja_digunakan,
      jam_masuk_jadwal, jam_pulang_jadwal, jam_masuk_aktual, jam_pulang_aktual,
      id_log_masuk, id_log_pulang, status_kehadiran, menit_keterlambatan,
      menit_pulang_cepat, total_jam_kerja_efektif, jam_lembur_dihitung, 
      tanggal_kerja_efektif, is_shift_lintas_hari, id_kebijakan_absensi, 
      catatan_khusus, is_data_final, nama_pegawai, id_personal
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, 
      $17, $18, $19, $20, $21, $22, $23
    )
    RETURNING *
  `;
  
  const values = [
    absensiData.id,
    absensiData.id_pegawai,
    absensiData.tanggal_absensi,
    absensiData.id_shift_kerja,
    absensiData.id_lokasi_kerja_digunakan,
    absensiData.jam_masuk_jadwal,
    absensiData.jam_pulang_jadwal,
    absensiData.jam_masuk_aktual,
    absensiData.jam_pulang_aktual,
    absensiData.id_log_masuk,
    absensiData.id_log_pulang,
    absensiData.status_kehadiran,
    absensiData.menit_keterlambatan,
    absensiData.menit_pulang_cepat,
    absensiData.total_jam_kerja_efektif,
    absensiData.jam_lembur_dihitung,
    absensiData.tanggal_kerja_efektif,
    absensiData.is_shift_lintas_hari,
    absensiData.id_kebijakan_absensi,
    absensiData.catatan_khusus,
    absensiData.is_data_final,
    absensiData.nama_pegawai,
    absensiData.id_personal
  ];
  
  const result = await pool.query(query, values);
  return result.rows[0];
};

/**
 * Insert log proses harian
 */
export const insertLogProsesHarian = async (logData) => {
  const query = `
    INSERT INTO absensi.s_proses_harian (
      id, tanggal_proses, jenis_proses, status_proses, waktu_mulai, waktu_selesai,
      total_data_diproses, jumlah_success, jumlah_error, detail_error, catatan
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
    )
    RETURNING *
  `;
  
  const values = [
    logData.id,
    logData.tanggal_proses,
    logData.jenis_proses,
    logData.status_proses,
    logData.waktu_mulai,
    logData.waktu_selesai,
    logData.total_data_diproses,
    logData.jumlah_success,
    logData.jumlah_error,
    logData.detail_error,
    logData.catatan
  ];
  
  const result = await pool.query(query, values);
  return result.rows[0];
};