// src/models/logRawAbsensi.model.js
// Model Sequelize untuk tabel t_log_raw_absensi.
// Tabel ini menyimpan catatan absensi mentah dari mesin fingerprint maupun aplikasi mobile.

import { DataTypes } from "sequelize";
import { getSequelize } from "../libraries/database.instance.js";

// Mendefinisikan model secara asynchronous karena getSequelize() mengembalikan promise
const sequelize = await getSequelize();

/**
 * Model LogRawAbsensi mencerminkan struktur tabel absensi.t_log_raw_absensi.
 * Beberapa kolom seperti nama_pegawai atau nama_cabang bukan bagian dari insert/update utama
 * tetapi ikut dibaca saat melakukan join atau view. Oleh karena itu kolom ini tetap didefinisikan
 * sebagai opsional.
 */
const LogRawAbsensi = sequelize.define(
  "LogRawAbsensi",
  {
    id: {
      type: DataTypes.STRING(30),
      allowNull: false,
      primaryKey: true,
    },
    id_pegawai: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    waktu_log: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    source_absensi: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_device: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    koordinat_gps: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    id_lokasi_kerja: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    is_validasi_geofence: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    jarak_dari_lokasi: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    akurasi_gps: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    path_bukti_foto: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    qr_hash: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    keterangan_log: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status_validasi: {
      type: DataTypes.STRING(10),
      allowNull: true,
      validate: { isIn: [["VALID", "INVALID"]] },
      defaultValue: "VALID",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    // Kolom informasi tambahan (tidak selalu diisi saat insert)
    nama_pegawai: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    kode_cabang: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    nama_cabang: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    nama_jabatan_detail: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    schema: "absensi",
    tableName: "t_log_raw_absensi",
    modelName: "LogRawAbsensi",
    freezeTableName: true,
    timestamps: false,
  }
);

export { LogRawAbsensi };
