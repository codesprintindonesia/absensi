// src/models/relational/pegawaiLokasiKerja.model.js
import { DataTypes } from "sequelize";
import { getSequelize } from "../../libraries/database.instance.js";

// dapatkan instance sequelize
const sequelize = await getSequelize();  

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
    prioritas_lokasi: {
      type: DataTypes.INTEGER, // int4
      allowNull: true,
      defaultValue: 1,
      validate: { min: 1 },
    }, 
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true,
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
          "tanggal_mulai_berlaku",
          "tanggal_akhir_berlaku",
        ], // NOTE: jika ingin persis seperti DDL 
      },
      // CREATE INDEX idx_pegawai_lokasi_prioritas ON absensi.r_pegawai_lokasi_kerja (id_pegawai, prioritas_lokasi 
      {
        name: "idx_pegawai_lokasi_prioritas",
        fields: ["id_pegawai", "prioritas_lokasi"],
      },
    ],
  }
);

export { PegawaiLokasiKerja };
