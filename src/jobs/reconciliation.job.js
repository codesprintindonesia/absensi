/**
 * Job untuk rekonsiliasi absensi harian
 * File: src/jobs/reconciliation.job.js
 */

import * as reconciliationService from "../services/reconciliation.service.js";

/**
 * Job function untuk rekonsiliasi H-1 (hari sebelumnya)
 * Dijalankan setiap hari jam 02:00
 */
export const runDailyReconciliation = async () => {
  try {
    // Hitung tanggal H-1
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const tanggalProses = yesterday.toISOString().split("T")[0];

    console.log(`[${new Date().toISOString()}] Starting daily reconciliation for date: ${tanggalProses}`);

    // Jalankan rekonsiliasi
    const result = await reconciliationService.prosesRekonsiliasi(
      tanggalProses
    );

    if (result.success) {
      console.log(
        `[${new Date().toISOString()}] Daily reconciliation completed successfully: ${result.totalBerhasil}/${result.totalPegawai} processed`
      );
    } else {
      console.warn(
        `[${new Date().toISOString()}] Daily reconciliation completed with errors: ${result.totalGagal} failed`
      );
    }

    return result;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Daily reconciliation job failed: ${error.message}`);
    throw error;
  }
};

/**
 * Job function untuk rekonsiliasi tanggal spesifik
 * Bisa dipanggil manual via API
 */
export const runReconciliationForDate = async (tanggal) => {
  try {
    console.log(`[${new Date().toISOString()}] Starting manual reconciliation for date: ${tanggal}`);

    const result = await reconciliationService.prosesRekonsiliasi(tanggal);

    if (result.success) {
      console.log(
        `[${new Date().toISOString()}] Manual reconciliation completed: ${result.totalBerhasil}/${result.totalPegawai} processed`
      );
    }

    return result;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Manual reconciliation failed: ${error.message}`);
    throw error;
  }
};