/**
 * Repository untuk operasi database rekonsiliasi absensi harian
 * File: src/repositories/daily.repository.js
 */

import { LogRawAbsensi } from "../models/transactional/logRawAbsensi.model.js";
import { ShiftHarianPegawai } from "../models/transactional/shiftHarianPegawai.model.js";
import { ShiftKerja } from "../models/master/shiftKerja.model.js";
import { KebijakanAbsensi } from "../models/master/kebijakanAbsensi.model.js";
import { AbsensiHarian } from "../models/transactional/absensiHarian.model.js";
import { ProsesHarian } from "../models/system/prosesHarian.model.js";
import { Op } from "sequelize";
import { getSequelize } from "../libraries/database.instance.js";

const sequelize = await getSequelize();

/**
 * Ambil raw log absensi yang valid untuk tanggal tertentu
 * Diurutkan berdasarkan pegawai dan waktu
 */
export const getRawAbsensiByDate = async (tanggal) => {
  const logs = await LogRawAbsensi.findAll({
    where: {
      [Op.and]: [
        sequelize.where(
          sequelize.fn(
            "DATE",
            sequelize.fn(
              "timezone",
              "Asia/Makassar",
              sequelize.col("waktu_log")
            )
          ),
          tanggal
        ),
        { status_validasi: "VALID" },
      ],
    },
    order: [
      ["id_pegawai", "ASC"],
      ["waktu_log", "ASC"],
    ],
    raw: true,
  });

  return logs;
};

/**
 * Ambil jadwal shift harian pegawai untuk tanggal tertentu
 * Join dengan m_shift_kerja untuk mendapatkan detail shift
 */
export const getShiftHarianByDate = async (tanggal) => {
  const jadwal = await ShiftHarianPegawai.findAll({
    where: {
      tanggal_kerja: tanggal, 
    },
    include: [
      {
        model: ShiftKerja,
        as: "shiftKerja",
        attributes: [
          "id",
          "nama",
          "jam_masuk",
          "jam_pulang",
          "durasi_istirahat",
          "toleransi_keterlambatan",
        ],
      },
    ],
    raw: true,
    nest: true,
  });

  return jadwal;
};

/**
 * Ambil kebijakan absensi yang default/aktif
 */
export const getKebijakanAbsensiAktif = async () => {
  const kebijakan = await KebijakanAbsensi.findOne({
    where: {
      is_aktif: true,
      is_default: true,
    },
    order: [["created_at", "DESC"]],
    raw: true,
  });

  return kebijakan;
};

/**
 * Cek apakah data absensi harian sudah ada
 */
export const checkAbsensiExists = async (idPegawai, tanggalAbsensi) => {
  const count = await AbsensiHarian.count({
    where: {
      id_pegawai: idPegawai,
      tanggal_absensi: tanggalAbsensi,
    },
  });

  return count > 0;
};

/**
 * Insert data absensi harian baru
 */
export const insertAbsensiHarian = async (data) => {
  const result = await AbsensiHarian.create(data);
  return result.id;
};

/**
 * Update data absensi harian yang sudah ada
 */
export const updateAbsensiHarian = async (idPegawai, tanggalAbsensi, data) => {
  const [affectedRows] = await AbsensiHarian.update(data, {
    where: {
      id_pegawai: idPegawai,
      tanggal_absensi: tanggalAbsensi,
    },
  });

  return affectedRows > 0;
};

/**
 * Log proses harian ke tabel s_proses_harian
 */
export const insertLogProsesHarian = async (data) => {
  // Generate ID dengan format PRC-YYYYMMDD-XXX
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomNum = String(Math.floor(Math.random() * 999) + 1).padStart(
    3,
    "0"
  );
  const id = `PRC-${today}-${randomNum}`;

  // Pastikan detail_error adalah string JSON yang valid
  const processedData = {
    ...data,
    detail_error: data.detail_error
      ? typeof data.detail_error === "string"
        ? data.detail_error
        : JSON.stringify(data.detail_error)
      : null,
  };

  const dataWithId = { id, ...processedData };
  const result = await ProsesHarian.create(dataWithId);
  return result.id;
};
