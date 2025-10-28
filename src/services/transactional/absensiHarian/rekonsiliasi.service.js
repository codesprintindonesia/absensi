// src/services/transactional/absensiHarian/rekonsiliasi.service.js
import * as rekonRepo from "../../../repositories/transactional/absensiHarian/rekonsiliasi.repository.js";

/**
 * Helper: Convert time string (HH:MM:SS) ke menit sejak tengah malam
 */
const timeToMinutes = (timeString) => {
  if (!timeString) return 0;
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Helper: Convert menit ke jam desimal
 */
const minutesToHours = (minutes) => {
  return parseFloat((minutes / 60).toFixed(2));
};

/**
 * Helper: Hitung keterlambatan
 */
const hitungKeterlambatan = (jamJadwal, jamAktual, toleransi) => {
  if (!jamJadwal || !jamAktual) return 0;
  
  const menitJadwal = timeToMinutes(jamJadwal);
  const menitAktual = timeToMinutes(jamAktual);
  const selisih = menitAktual - menitJadwal;
  const keterlambatan = selisih - toleransi;
  
  return Math.max(0, keterlambatan);
};

/**
 * Helper: Hitung pulang cepat
 */
const hitungPulangCepat = (jamJadwal, jamAktual) => {
  if (!jamJadwal || !jamAktual) return 0;
  
  const menitJadwal = timeToMinutes(jamJadwal);
  const menitAktual = timeToMinutes(jamAktual);
  
  if (menitAktual < menitJadwal) {
    return menitJadwal - menitAktual;
  }
  
  return 0;
};

/**
 * Helper: Hitung jam kerja efektif
 */
const hitungJamKerjaEfektif = (jamMasuk, jamPulang, durasiIstirahat) => {
  if (!jamMasuk || !jamPulang) return 0;
  
  const menitMasuk = timeToMinutes(jamMasuk);
  const menitPulang = timeToMinutes(jamPulang);
  const totalMenit = menitPulang - menitMasuk;
  const menitKerja = Math.max(0, totalMenit - durasiIstirahat);
  
  return minutesToHours(menitKerja);
};

/**
 * Helper: Hitung jam lembur
 */
const hitungJamLembur = (totalJamKerja, minJamKerja) => {
  if (totalJamKerja <= minJamKerja) return 0;
  return parseFloat((totalJamKerja - minJamKerja).toFixed(2));
};

/**
 * Helper: Extract waktu dari timestamp
 */
const extractTime = (timestamp) => {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  return date.toTimeString().split(' ')[0];
};

/**
 * Helper: Check shift lintas hari
 */
const isShiftLintasHari = (jamMasuk, jamPulang) => {
  const menitMasuk = timeToMinutes(jamMasuk);
  const menitPulang = timeToMinutes(jamPulang);
  return menitPulang < menitMasuk;
};

/**
 * Helper: Group logs by pegawai
 */
const groupLogsByPegawai = (logs) => {
  return logs.reduce((grouped, log) => {
    if (!grouped[log.id_pegawai]) {
      grouped[log.id_pegawai] = [];
    }
    grouped[log.id_pegawai].push(log);
    return grouped;
  }, {});
};

/**
 * Helper: Generate ID absensi
 */
const generateAbsensiId = (idPegawai, tanggal) => {
  const dateStr = tanggal.replace(/-/g, '');
  return `ABS-${idPegawai}-${dateStr}`;
};

/**
 * Helper: Generate ID proses
 */
const generateIdProses = (tanggal) => {
  const dateStr = tanggal.replace(/-/g, '');
  const timestamp = Date.now().toString().slice(-3);
  return `PRC-${dateStr}-${timestamp}`;
};

/**
 * Validasi lokasi log dengan 2 level checking
 */
const validateLokasi = (logLokasiId, shiftLokasiId, shiftLokasiNama, lokasiPegawai) => {
  // Level 1: Cek sesuai dengan lokasi shift
  if (logLokasiId === shiftLokasiId) {
    return { valid: true, catatan: null };
  }
  
  // Level 2: Cek apakah ada di lokasi pegawai yang terdaftar
  const lokasiTerdaftar = lokasiPegawai.find(lok => lok.id_lokasi_kerja === logLokasiId);
  
  if (lokasiTerdaftar) {
    return {
      valid: true,
      catatan: `Log dilakukan di ${lokasiTerdaftar.nama_lokasi}, bukan di lokasi jadwal ${shiftLokasiNama}`
    };
  }
  
  // Tidak ditemukan sama sekali
  return {
    valid: true,
    catatan: 'Log dilakukan di lokasi tidak terdaftar'
  };
};

/**
 * Proses absensi untuk satu pegawai
 */
const prosesAbsensiPegawai = async (tanggal, jadwal, logs, kebijakan, lokasiPegawai) => {
  // Identifikasi log masuk dan pulang
  const sortedLogs = logs.sort((a, b) => new Date(a.waktu_log) - new Date(b.waktu_log));
  const logMasuk = sortedLogs[0] || null;
  const logPulang = sortedLogs.length > 1 ? sortedLogs[sortedLogs.length - 1] : null;
  
  // Extract waktu
  const jamMasukAktual = logMasuk ? extractTime(logMasuk.waktu_log) : null;
  const jamPulangAktual = logPulang ? extractTime(logPulang.waktu_log) : null;
  
  // Kalkulasi
  const toleransi = jadwal.toleransi_keterlambatan || kebijakan.toleransi_keterlambatan;
  const keterlambatanMenit = hitungKeterlambatan(jadwal.jam_masuk, jamMasukAktual, toleransi);
  const pulangCepatMenit = hitungPulangCepat(jadwal.jam_pulang, jamPulangAktual);
  const totalJamKerja = hitungJamKerjaEfektif(jamMasukAktual, jamPulangAktual, jadwal.durasi_istirahat || 60);
  const jamLembur = hitungJamLembur(totalJamKerja, kebijakan.min_jam_kerja_full_day || 8);
  
  // Tentukan status kehadiran
  let statusKehadiran = 'Alpa';
  if (logMasuk && logPulang) {
    if (keterlambatanMenit > 0) {
      statusKehadiran = 'Terlambat';
    } else if (pulangCepatMenit > 30) {
      statusKehadiran = 'Pulang_Cepat';
    } else {
      statusKehadiran = 'Hadir';
    }
  }
  
  // Build catatan khusus
  const catatan = [];
  
  // Validasi lokasi jika ada log
  if (logMasuk) {
    const validasiLokasi = validateLokasi(
      logMasuk.id_lokasi_kerja,
      jadwal.id_lokasi_kerja,
      jadwal.nama_lokasi,
      lokasiPegawai
    );
    
    if (validasiLokasi.catatan) {
      catatan.push(validasiLokasi.catatan);
    }
  }
  
  // Catatan keterlambatan
  if (keterlambatanMenit > 0) {
    catatan.push(`Terlambat ${keterlambatanMenit} menit`);
  }
  
  // Catatan pulang cepat
  if (pulangCepatMenit > 30) {
    catatan.push(`Pulang cepat ${pulangCepatMenit} menit`);
  }
  
  // Catatan lembur
  if (jamLembur > 0) {
    catatan.push(`Lembur ${jamLembur} jam`);
  }
  
  // Catatan khusus untuk Alpa
  if (statusKehadiran === 'Alpa') {
    if (logMasuk && !logPulang) {
      catatan.push('Hanya ada log masuk, tidak ada log pulang');
    } else if (!logMasuk) {
      catatan.push('Tidak ada log absensi');
    }
  }
  
  // Prepare data
  const absensiData = {
    id: generateAbsensiId(jadwal.id_pegawai, tanggal),
    id_pegawai: jadwal.id_pegawai,
    tanggal_absensi: tanggal,
    id_shift_kerja: jadwal.id_shift_kerja,
    id_lokasi_kerja_digunakan: logMasuk ? logMasuk.id_lokasi_kerja : jadwal.id_lokasi_kerja,
    jam_masuk_jadwal: jadwal.jam_masuk,
    jam_pulang_jadwal: jadwal.jam_pulang,
    jam_masuk_aktual: jamMasukAktual,
    jam_pulang_aktual: jamPulangAktual,
    id_log_masuk: logMasuk ? logMasuk.id : null,
    id_log_pulang: logPulang ? logPulang.id : null,
    status_kehadiran: statusKehadiran,
    menit_keterlambatan: keterlambatanMenit,
    menit_pulang_cepat: pulangCepatMenit,
    total_jam_kerja_efektif: totalJamKerja,
    jam_lembur_dihitung: jamLembur,
    tanggal_kerja_efektif: tanggal,
    is_shift_lintas_hari: isShiftLintasHari(jadwal.jam_masuk, jadwal.jam_pulang),
    id_kebijakan_absensi: kebijakan.id,
    catatan_khusus: catatan.length > 0 ? catatan.join(', ') : null,
    is_data_final: false,
    nama_pegawai: jadwal.nama_pegawai,
    id_personal: jadwal.id_personal
  };
  
  await rekonRepo.insertAbsensiHarian(absensiData);
};

/**
 * Main service: Proses rekonsiliasi untuk satu tanggal
 */
export const prosesRekonsiliasi = async (tanggal) => {
  const waktuMulai = new Date();
  let totalPegawai = 0;
  let totalBerhasil = 0;
  let totalGagal = 0;
  const errors = [];
  
  const idProses = generateIdProses(tanggal);
  
  try {
    // 1. Ambil data yang diperlukan
    const [shiftHarian, rawLogs, kebijakan] = await Promise.all([
      rekonRepo.getShiftHarianByDate(tanggal),
      rekonRepo.getRawAbsensiByDate(tanggal),
      rekonRepo.getKebijakanAbsensiAktif()
    ]);
    
    if (!kebijakan) {
      throw new Error('Kebijakan absensi tidak ditemukan atau tidak aktif');
    }
    
    // 2. Group logs by pegawai
    const logsByPegawai = groupLogsByPegawai(rawLogs);
    
    // 3. Proses setiap pegawai
    totalPegawai = shiftHarian.length;
    
    for (const jadwal of shiftHarian) {
      try {
        // Cek apakah data sudah ada
        const exists = await rekonRepo.checkAbsensiExists(jadwal.id_pegawai, tanggal);
        if (exists) {
          totalGagal++;
          errors.push({
            id_pegawai: jadwal.id_pegawai,
            nama_pegawai: jadwal.nama_pegawai,
            error: 'Data absensi sudah ada'
          });
          continue;
        }
        
        // Ambil lokasi kerja pegawai
        const lokasiPegawai = await rekonRepo.getLokasiKerjaPegawai(jadwal.id_pegawai, tanggal);
        
        // Ambil logs pegawai
        const pegawaiLogs = logsByPegawai[jadwal.id_pegawai] || [];
        
        // Proses absensi
        await prosesAbsensiPegawai(tanggal, jadwal, pegawaiLogs, kebijakan, lokasiPegawai);
        
        totalBerhasil++;
      } catch (error) {
        totalGagal++;
        errors.push({
          id_pegawai: jadwal.id_pegawai,
          nama_pegawai: jadwal.nama_pegawai,
          error: error.message
        });
      }
    }
    
    // 4. Log hasil proses
    const waktuSelesai = new Date();
    const durasiDetik = Math.floor((waktuSelesai - waktuMulai) / 1000);
    const statusProses = totalGagal === 0 ? 'SUCCESS' : (totalBerhasil > 0 ? 'PARTIAL' : 'ERROR');
    
    await rekonRepo.insertLogProsesHarian({
      id: idProses,
      tanggal_proses: tanggal,
      jenis_proses: 'REKONSILIASI',
      status_proses: statusProses,
      waktu_mulai: waktuMulai,
      waktu_selesai: waktuSelesai,
      total_data_diproses: totalPegawai,
      jumlah_success: totalBerhasil,
      jumlah_error: totalGagal,
      detail_error: totalGagal > 0 ? JSON.stringify(errors) : null,
      catatan: `Rekonsiliasi absensi untuk tanggal ${tanggal}. ${totalBerhasil} dari ${totalPegawai} pegawai berhasil diproses dalam ${durasiDetik} detik.`
    });
    
    return {
      tanggal,
      total_pegawai: totalPegawai,
      berhasil: totalBerhasil,
      gagal: totalGagal,
      errors: totalGagal > 0 ? errors : [],
      durasi_detik: durasiDetik
    };
    
  } catch (error) {
    // Log error
    const waktuSelesai = new Date();
    await rekonRepo.insertLogProsesHarian({
      id: idProses,
      tanggal_proses: tanggal,
      jenis_proses: 'REKONSILIASI',
      status_proses: 'ERROR',
      waktu_mulai: waktuMulai,
      waktu_selesai: waktuSelesai,
      total_data_diproses: totalPegawai,
      jumlah_success: totalBerhasil,
      jumlah_error: totalGagal,
      detail_error: JSON.stringify({ error: error.message }),
      catatan: `Error dalam proses rekonsiliasi: ${error.message}`
    });
    
    throw error;
  }
};