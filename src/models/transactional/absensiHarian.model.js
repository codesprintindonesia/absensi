// src/models/absensiHarian.model.js
import { DataTypes } from "sequelize";
import { getSequelize } from "../../libraries/database.instance.js";

const sequelize = await getSequelize();

// Enum berdasarkan data aktual di database
const STATUS_KEHADIRAN = [
  "Hadir",
  "Terlambat",
];

const AbsensiHarian = sequelize.define(
  "AbsensiHarian",
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
    tanggal_absensi: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    id_shift_kerja: {
      type: DataTypes.STRING(8),
      allowNull: true,
    },
    id_lokasi_kerja_digunakan: {
      type: DataTypes.STRING(8),
      allowNull: true,
    },
    jam_masuk_jadwal: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    jam_pulang_jadwal: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    jam_masuk_aktual: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    jam_keluar_istirahat_aktual: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    jam_masuk_istirahat_aktual: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    jam_pulang_aktual: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    id_log_masuk: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    id_log_keluar_istirahat: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    id_log_masuk_istirahat: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    id_log_pulang: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    status_kehadiran: {
      type: DataTypes.STRING(50),
      allowNull: false,
      // validate: { isIn: [STATUS_KEHADIRAN] },
    },
    menit_keterlambatan: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    menit_pulang_cepat: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    total_jam_kerja_efektif: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      defaultValue: 0,
    },
    jam_lembur_dihitung: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      defaultValue: 0,
    },
    tanggal_kerja_efektif: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    is_shift_lintas_hari: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    id_kebijakan_absensi: {
      type: DataTypes.STRING(8),
      allowNull: true,
    },
    catatan_khusus: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_data_final: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    difinalisasi_oleh: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    tanggal_finalisasi: {
      type: DataTypes.DATE,
      allowNull: true,
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
    id_divisi: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    nama_divisi: {
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
    tableName: "t_absensi_harian",
    modelName: "AbsensiHarian",
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        name: "idx_absensi_pegawai_tanggal",
        unique: true,
        fields: ["id_pegawai", "tanggal_absensi"],
      },
      { name: "idx_absensi_tanggal", fields: ["tanggal_absensi"] },
    ],
  }
);

export { STATUS_KEHADIRAN, AbsensiHarian };