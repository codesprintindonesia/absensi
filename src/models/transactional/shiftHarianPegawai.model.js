// src//models/transactional/shiftHarianPegawai.model.js
import { DataTypes } from "sequelize";
import { getSequelize } from "../../libraries/database.instance.js";

const sequelize = await getSequelize();

const JENIS_PERUBAHAN = [
  "NORMAL",
  "TUKAR_SHIFT",
  "PENUGASAN_KHUSUS",
  "LEMBUR",
  "CUTI"
];

const STATUS_PERSETUJUAN = ["PENDING", "APPROVED", "REJECTED"];

const ShiftHarianPegawai = sequelize.define(
  "ShiftHarianPegawai",
  {
    id: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true,
    },
    id_pegawai: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    tanggal_kerja: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    id_shift_kerja_jadwal: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
    id_shift_kerja_aktual: {
      type: DataTypes.STRING(8),
      allowNull: true,
    },
    id_lokasi_kerja_aktual: {
      type: DataTypes.STRING(8),
      allowNull: true,
    },
    jenis_perubahan: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "NORMAL",
      validate: { isIn: [JENIS_PERUBAHAN] },
    },
    id_pegawai_pengganti: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    alasan_perubahan: {
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
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "APPROVED",
      validate: { isIn: [STATUS_PERSETUJUAN] },
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
  },
  {
    schema: "absensi",
    tableName: "t_shift_harian_pegawai",
    modelName: "ShiftHarianPegawai",
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        name: "idx_shift_harian_pegawai_tanggal",
        unique: true,
        fields: ["id_pegawai", "tanggal_kerja"],
      },
      { name: "idx_shift_harian_tanggal", fields: ["tanggal_kerja"] },
    ],
  }
);

export { JENIS_PERUBAHAN, STATUS_PERSETUJUAN, ShiftHarianPegawai };