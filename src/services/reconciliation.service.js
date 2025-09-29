/**
 * Business logic untuk rekonsiliasi absensi harian
 * File: src/services/reconciliation.service.js
 */

import * as dailyRepo from "../repositories/daily.repository.js";
import * as calc from "./calculator.service.js";

/**
 * Proses rekonsiliasi untuk satu tanggal
 */
export const prosesRekonsiliasi = async (tanggal) => {
  const waktuMulai = new Date();
  let totalPegawai = 0;
  let totalBerhasil = 0;
  let totalGagal = 0;
  const errors = [];

  try {
    console.log(`[${new Date().toISOString()}] Memulai rekonsiliasi absensi untuk tanggal: ${tanggal}`);

    // 1. Ambil data yang diperlukan
    const [rawLogs, shiftHarian, kebijakan] = await Promise.all([
      dailyRepo.getRawAbsensiByDate(tanggal),
      dailyRepo.getShiftHarianByDate(tanggal),
      dailyRepo.getKebijakanAbsensiAktif(),
    ]);

    if (!kebijakan) {
      throw new Error("Kebijakan absensi tidak ditemukan atau tidak aktif");
    }

    console.log(
      `[${new Date().toISOString()}] Raw logs: ${rawLogs.length}, Jadwal shift: ${shiftHarian.length}`
    );

    // 2. Group logs by pegawai
    const logsByPegawai = calc.groupLogsByPegawai(rawLogs);

    // 3. Proses setiap pegawai yang ada jadwal shift
    totalPegawai = shiftHarian.length;

    for (const jadwal of shiftHarian) {
      try {
        const pegawaiLogs = logsByPegawai[jadwal.id_pegawai] || [];

        // Process absensi untuk pegawai ini
        await prosesAbsensiPegawai(tanggal, jadwal, pegawaiLogs, kebijakan);

        totalBerhasil++;
      } catch (error) {
        totalGagal++;
        errors.push({
          id_pegawai: jadwal.id_pegawai,
          error: error.message,
        });
        console.error(
          `[${new Date().toISOString()}] Error processing pegawai ${jadwal.id_pegawai}: ${error.message}`
        );
      }
    }

    // 4. Log hasil proses
    const waktuSelesai = new Date();
    const durasiDetik = Math.floor((waktuSelesai - waktuMulai) / 1000);

    await dailyRepo.insertLogProsesHarian({
      tanggal_proses: new Date().toISOString().split("T")[0],
      jenis_proses: "REKONSILIASI",
      status_proses: totalGagal === 0 ? "SUCCESS" : "PARTIAL",
      waktu_mulai: waktuMulai,
      waktu_selesai: waktuSelesai,
      total_data_diproses: totalPegawai,
      jumlah_success: totalBerhasil,
      jumlah_error: totalGagal,
      detail_error: totalGagal > 0 ? JSON.stringify(errors) : null,
      catatan: `Rekonsiliasi absensi untuk tanggal ${tanggal}. ${totalBerhasil} dari ${totalPegawai} pegawai berhasil diproses.`,
    });

    console.log(
      `[${new Date().toISOString()}] Rekonsiliasi selesai: ${totalBerhasil}/${totalPegawai} berhasil dalam ${durasiDetik} detik`
    );

    return {
      success: true,
      tanggal,
      totalPegawai,
      totalBerhasil,
      totalGagal,
      durasiDetik,
      errors: totalGagal > 0 ? errors : null,
    };
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error rekonsiliasi: ${error.message}`);

    // Log error ke database
    const waktuSelesai = new Date();

    await dailyRepo.insertLogProsesHarian({
      tanggal_proses: new Date().toISOString().split("T")[0],
      jenis_proses: "REKONSILIASI",
      status_proses: "FAILED",
      waktu_mulai: waktuMulai,
      waktu_selesai: waktuSelesai,
      total_data_diproses: totalPegawai,
      jumlah_success: totalBerhasil,
      jumlah_error: totalGagal,
      detail_error: error.message,
      catatan: `Rekonsiliasi gagal untuk tanggal ${tanggal}: ${error.message}`,
    });

    throw error;
  }
};

/**
 * Proses absensi untuk satu pegawai
 */
const prosesAbsensiPegawai = async (tanggal, jadwal, logs, kebijakan) => {
  // 1. Cari log masuk dan pulang
  const { logMasuk, logPulang } = calc.findMasukPulang(logs);

  // 2. Ambil data shift dari jadwal
  const shiftData = jadwal.shiftKerja || {};
  const jamMasukJadwal = shiftData.jam_masuk;
  const jamPulangJadwal = shiftData.jam_pulang;
  const durasiIstirahat = shiftData.durasi_istirahat || 0;
  const toleransiKeterlambatan =
    shiftData.toleransi_keterlambatan || kebijakan.toleransi_keterlambatan || 0;

  // 3. Kalkulasi waktu
  const jamMasukAktual = logMasuk ? logMasuk.waktu_log : null;
  const jamPulangAktual = logPulang ? logPulang.waktu_log : null;

  const keterlambatanMenit = calc.hitungKeterlambatan(
    jamMasukJadwal,
    jamMasukAktual,
    toleransiKeterlambatan
  );

  const pulangCepatMenit = calc.hitungPulangCepat(
    jamPulangJadwal,
    jamPulangAktual
  );

  const durasiKerjaMenit = calc.hitungDurasiKerjaMenit(
    jamMasukAktual,
    jamPulangAktual,
    durasiIstirahat
  );

  const lemburMenit = calc.hitungLemburMenit(
    durasiKerjaMenit,
    durasiIstirahat,
    jamMasukJadwal,
    jamPulangJadwal
  );

  // Convert ke jam (decimal)
  const totalJamKerjaEfektif = calc.menitKeJam(durasiKerjaMenit);
  const jamLemburDihitung = calc.menitKeJam(lemburMenit);

  // 4. Tentukan status kehadiran
  const statusKehadiran = calc.tentukanStatusKehadiran(
    logMasuk,
    logPulang,
    keterlambatanMenit,
    pulangCepatMenit
  );

  // 5. Build catatan
  const catatanKhusus = calc.buildCatatanKhusus(
    statusKehadiran,
    keterlambatanMenit,
    pulangCepatMenit,
    jamLemburDihitung
  );

  // 6. Prepare data untuk save
  const absensiId = `ABS-${jadwal.id_pegawai}-${tanggal.replace(/-/g, "")}`;

  const absensiData = {
    id: absensiId,
    id_pegawai: jadwal.id_pegawai,
    tanggal_absensi: tanggal,
    id_shift_kerja: jadwal.id_shift_kerja_jadwal,
    id_lokasi_kerja_digunakan: jadwal.id_lokasi_kerja_aktual,
    jam_masuk_jadwal: jamMasukJadwal,
    jam_pulang_jadwal: jamPulangJadwal,
    jam_masuk_aktual: jamMasukAktual,
    jam_keluar_istirahat_aktual: null, // Diabaikan untuk simplicity
    jam_masuk_istirahat_aktual: null, // Diabaikan untuk simplicity
    jam_pulang_aktual: jamPulangAktual,
    id_log_masuk: logMasuk ? logMasuk.id : null,
    id_log_keluar_istirahat: null,
    id_log_masuk_istirahat: null,
    id_log_pulang: logPulang ? logPulang.id : null,
    status_kehadiran: statusKehadiran,
    menit_keterlambatan: keterlambatanMenit,
    menit_pulang_cepat: pulangCepatMenit,
    total_jam_kerja_efektif: totalJamKerjaEfektif,
    jam_lembur_dihitung: jamLemburDihitung,
    tanggal_kerja_efektif: tanggal,
    is_shift_lintas_hari: false, // Bisa ditambahkan logic untuk detect lintas hari
    id_kebijakan_absensi: kebijakan.id,
    catatan_khusus: catatanKhusus,
    is_data_final: false,
  };

  // 7. Save atau update
  const exists = await dailyRepo.checkAbsensiExists(
    jadwal.id_pegawai,
    tanggal
  );

  if (exists) {
    await dailyRepo.updateAbsensiHarian(
      jadwal.id_pegawai,
      tanggal,
      absensiData
    );
  } else {
    await dailyRepo.insertAbsensiHarian(absensiData);
  }
};