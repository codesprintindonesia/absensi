// src/services/laporan/realisasiLembur/generateBulanan.service.js

import { AbsensiHarian } from "../../../models/transactional/absensiHarian.model.js";
import { RealisasiLembur } from "../../../models/laporan/realisasiLembur.model.js";
import { getSequelize } from "../../../libraries/database.instance.js";
import { Op } from "sequelize";

/**
 * Generate ID untuk realisasi lembur
 * Format: LEM-{ID_PEGAWAI}-{YYYYMM}
 */
const generateRealisasiLemburId = (idPegawai, periodeBulan) => {
  const date = new Date(periodeBulan);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `LEM-${idPegawai}-${year}${month}`;
};

/**
 * Generate realisasi lembur bulanan untuk satu pegawai
 * @param {string} idPegawai - ID pegawai
 * @param {string} periodeBulan - Periode bulan (format: YYYY-MM-DD atau YYYY-MM-01)
 * @param {object} options - Options untuk transaction
 * @returns {object} Data realisasi lembur yang di-generate
 */
const generateRealisasiLemburBulanan = async (idPegawai, periodeBulan, options = {}) => {
  const sequelize = await getSequelize();
  const transaction = await sequelize.transaction();

  try {
    // Parse periode bulan
    const periodeDate = new Date(periodeBulan);
    const tahun = periodeDate.getFullYear();
    const bulan = periodeDate.getMonth() + 1;

    // Hitung tanggal awal dan akhir bulan
    const tanggalAwal = new Date(tahun, bulan - 1, 1);
    const tanggalAkhir = new Date(tahun, bulan, 0);

    // Ambil semua data absensi harian untuk pegawai di bulan tersebut
    const dataAbsensi = await AbsensiHarian.findAll({
      where: {
        id_pegawai: idPegawai,
        tanggal_absensi: {
          [Op.between]: [tanggalAwal, tanggalAkhir],
        },
      },
      order: [["tanggal_absensi", "ASC"]],
      transaction,
    });

    if (dataAbsensi.length === 0) {
      throw new Error(`Tidak ada data absensi untuk pegawai ${idPegawai} pada periode ${periodeBulan}`);
    }

    // Inisialisasi variabel perhitungan
    let totalJamLemburBulanan = 0;
    let totalHariTerlambat = 0;
    let totalMenitKeterlambatan = 0;
    let totalHariTidakHadir = 0;
    let totalHariKerjaEfektif = 0;
    let jumlahHariTerlambat = 0;

    // Ambil data pegawai dari record pertama (untuk denormalisasi)
    const dataPegawai = dataAbsensi[0];

    // Proses setiap record absensi
    dataAbsensi.forEach((absensi) => {
      const absensiJson = absensi.toJSON();

      // Hitung jam lembur
      const jamLembur = parseFloat(absensiJson.jam_lembur_dihitung) || 0;
      totalJamLemburBulanan += jamLembur;

      // Hitung keterlambatan
      const menitTerlambat = parseInt(absensiJson.menit_keterlambatan) || 0;
      if (menitTerlambat > 0) {
        totalHariTerlambat++;
        totalMenitKeterlambatan += menitTerlambat;
        jumlahHariTerlambat++;
      }

      // Hitung hari tidak hadir
      const statusKehadiran = absensiJson.status_kehadiran;
      if (statusKehadiran === "Tidak Hadir" || statusKehadiran === "Alpa") {
        totalHariTidakHadir++;
      }

      // Hitung hari kerja efektif (hadir, terlambat, atau pulang cepat = dianggap masih kerja)
      if (
        statusKehadiran === "Hadir" ||
        statusKehadiran === "Terlambat" ||
        statusKehadiran === "Pulang Cepat"
      ) {
        totalHariKerjaEfektif++;
      }
    });

    // Hitung rata-rata menit keterlambatan
    const rataMenitKeterlambatan =
      jumlahHariTerlambat > 0 ? totalMenitKeterlambatan / jumlahHariTerlambat : 0;

    // Hitung persentase kehadiran
    const totalHariDalamBulan = dataAbsensi.length;
    const persentaseKehadiran =
      totalHariDalamBulan > 0
        ? ((totalHariKerjaEfektif / totalHariDalamBulan) * 100).toFixed(2)
        : 0;

    // Generate ID realisasi lembur
    const realisasiLemburId = generateRealisasiLemburId(idPegawai, periodeBulan);

    // Siapkan data untuk insert/update
    const dataRealisasiLembur = {
      id: realisasiLemburId,
      id_pegawai: idPegawai,
      periode_bulan_lembur: new Date(tahun, bulan - 1, 1), // Tanggal 1 bulan tersebut
      total_jam_lembur_bulanan: parseFloat(totalJamLemburBulanan.toFixed(2)),
      total_hari_terlambat_bulanan: totalHariTerlambat,
      rata_menit_keterlambatan: parseFloat(rataMenitKeterlambatan.toFixed(2)),
      total_hari_tidak_hadir: totalHariTidakHadir,
      total_hari_kerja_efektif: totalHariKerjaEfektif,
      persentase_kehadiran: parseFloat(persentaseKehadiran),
      is_data_final: false,
      // Data denormalisasi dari tabel absensi
      nama_pegawai: dataPegawai.nama_pegawai,
      kode_cabang: dataPegawai.kode_cabang,
      nama_cabang: dataPegawai.nama_cabang,
      id_divisi: dataPegawai.id_divisi,
      nama_divisi: dataPegawai.nama_divisi,
      nama_jabatan_detail: dataPegawai.nama_jabatan_detail,
    };

    // Cek apakah data sudah ada
    const existing = await RealisasiLembur.findOne({
      where: {
        id_pegawai: idPegawai,
        periode_bulan_lembur: dataRealisasiLembur.periode_bulan_lembur,
      },
      transaction,
    });

    let result;
    if (existing) {
      // Update data yang sudah ada
      await RealisasiLembur.update(dataRealisasiLembur, {
        where: {
          id_pegawai: idPegawai,
          periode_bulan_lembur: dataRealisasiLembur.periode_bulan_lembur,
        },
        transaction,
      });

      result = await RealisasiLembur.findOne({
        where: {
          id_pegawai: idPegawai,
          periode_bulan_lembur: dataRealisasiLembur.periode_bulan_lembur,
        },
        transaction,
      });
    } else {
      // Insert data baru
      result = await RealisasiLembur.create(dataRealisasiLembur, { transaction });
    }

    // Commit transaction jika dibuat di sini
    if (!options.transaction) {
      await transaction.commit();
    }

    return {
      success: true,
      data: result.toJSON(),
      summary: {
        total_hari_diproses: dataAbsensi.length,
        total_jam_lembur: totalJamLemburBulanan,
        total_hari_terlambat: totalHariTerlambat,
        total_hari_kerja_efektif: totalHariKerjaEfektif,
      },
    };
  } catch (error) {
    // Rollback transaction jika dibuat di sini
    if (!options.transaction) {
      await transaction.rollback();
    }
    throw error;
  }
};

/**
 * Generate realisasi lembur bulanan untuk semua pegawai yang memiliki data absensi
 * @param {string} periodeBulan - Periode bulan (format: YYYY-MM-DD atau YYYY-MM-01)
 * @returns {object} Summary hasil generate
 */
const generateRealisasiLemburBulananAllPegawai = async (periodeBulan) => {
  const sequelize = await getSequelize();
  const transaction = await sequelize.transaction();

  try {
    // Parse periode bulan
    const periodeDate = new Date(periodeBulan);
    const tahun = periodeDate.getFullYear();
    const bulan = periodeDate.getMonth() + 1;

    // Hitung tanggal awal dan akhir bulan
    const tanggalAwal = new Date(tahun, bulan - 1, 1);
    const tanggalAkhir = new Date(tahun, bulan, 0);

    // Ambil daftar pegawai unik yang memiliki data absensi di bulan tersebut
    const pegawaiList = await AbsensiHarian.findAll({
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("id_pegawai")), "id_pegawai"],
      ],
      where: {
        tanggal_absensi: {
          [Op.between]: [tanggalAwal, tanggalAkhir],
        },
      },
      raw: true,
      transaction,
    });

    if (pegawaiList.length === 0) {
      await transaction.rollback();
      throw new Error(`Tidak ada data absensi untuk periode ${periodeBulan}`);
    }

    const results = [];
    const errors = [];

    // Generate realisasi lembur untuk setiap pegawai
    for (const pegawai of pegawaiList) {
      try {
        const result = await generateRealisasiLemburBulanan(
          pegawai.id_pegawai,
          periodeBulan,
          { transaction }
        );
        results.push({
          id_pegawai: pegawai.id_pegawai,
          status: "success",
          data: result,
        });
      } catch (error) {
        errors.push({
          id_pegawai: pegawai.id_pegawai,
          status: "error",
          error: error.message,
        });
      }
    }

    await transaction.commit();

    return {
      success: true,
      periode: periodeBulan,
      total_pegawai: pegawaiList.length,
      total_success: results.length,
      total_error: errors.length,
      results,
      errors,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export { generateRealisasiLemburBulanan, generateRealisasiLemburBulananAllPegawai };