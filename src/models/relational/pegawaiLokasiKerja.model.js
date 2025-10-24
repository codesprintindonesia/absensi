// src/models/relational/pegawaiLokasiKerja.model.js
import { DataTypes } from "sequelize";
import { getSequelize } from "../../libraries/database.instance.js";

// dapatkan instance sequelize
const sequelize = await getSequelize();

const JENIS_PENUGASAN = [
  "REGULAR",
  "TEMPORARY",
  "EMERGENCY",
  "SPECIAL_DUTY",
  "PROJECT_BASED",
];

const STATUS_PERSETUJUAN = ["PENDING", "APPROVED", "REJECTED"];

// Definisi model PegawaiLokasiKerja
const PegawaiLokasiKerja = sequelize.define(
  "PegawaiLokasiKerja",
  {
    id: {
      type: DataTypes.STRING(25),
      allowNull: false,
      primaryKey: true,
    },
    id_pegawai: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    id_lokasi_kerja: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
    tanggal_mulai_berlaku: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    tanggal_akhir_berlaku: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    jenis_penugasan: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "REGULAR",
      validate: {
        isIn: [JENIS_PENUGASAN],
      },
    },
    prioritas_lokasi: {
      type: DataTypes.INTEGER, // int4
      allowNull: true,
      defaultValue: 1,
      validate: { min: 1 },
    },
    is_lokasi_utama: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    disetujui_oleh: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    tanggal_persetujuan: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status_persetujuan: {
      type: DataTypes.STRING(15),
      allowNull: true,
      defaultValue: "APPROVED",
      validate: {
        isIn: [STATUS_PERSETUJUAN],
      },
    },
    is_aktif: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
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
    id_personal: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    schema: "absensi",
    tableName: "r_pegawai_lokasi_kerja",
    modelName: "PegawaiLokasiKerja",
    freezeTableName: true,
    timestamps: false, // trigger DB yang mengurus updated_at
    indexes: [
      // CREATE INDEX idx_pegawai_lokasi_aktif ON absensi.r_pegawai_lokasi_kerja (id_pegawai, is_aktif, tanggal_mulai_berlaku, tanggal_akhir_berlaku)
      {
        name: "idx_pegawai_lokasi_aktif",
        fields: [
          "id_pegawai",
          "is_lokasi_utama",
          "tanggal_mulai_berlaku",
          "tanggal_akhir_berlaku",
        ], // NOTE: jika ingin persis seperti DDL, ganti is_lokasi_utama -> is_aktif
      },
      // CREATE INDEX idx_pegawai_lokasi_prioritas ON absensi.r_pegawai_lokasi_kerja (id_pegawai, prioritas_lokasi, is_lokasi_utama)
      {
        name: "idx_pegawai_lokasi_prioritas",
        fields: ["id_pegawai", "prioritas_lokasi", "is_lokasi_utama"],
      },
    ],
  }
);

export { PegawaiLokasiKerja, JENIS_PENUGASAN, STATUS_PERSETUJUAN };
