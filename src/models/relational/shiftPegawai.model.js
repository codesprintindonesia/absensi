// src/models/shiftPegawai.model.js
import { DataTypes } from "sequelize";
import { getSequelize } from "../../libraries/database.instance.js";

// dapatkan instance Sequelize
const sequelize = await getSequelize();

/**
 * Model ShiftPegawai – mewakili tabel t_shift_pegawai
 * Kolom:
 *  - id (PK), id_pegawai: kode pegawai,
 *  - id_shift_kerja: id shift kerja yang diberikan,
 *  - id_shift_group: id shift group yang diberikan (boleh null),
 *  - tanggal_mulai: tanggal mulai penugasan,
 *  - tanggal_akhir: tanggal akhir penugasan (boleh null),
 *  - is_aktif: apakah penugasan aktif,
 *  - created_at, updated_at: waktu pembuatan/pembaruan.
 */

const ShiftPegawai = sequelize.define(
  "ShiftPegawai",
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
    id_shift_kerja: {
      type: DataTypes.STRING(8),
      allowNull: true,
    },
    id_shift_group: {
      type: DataTypes.STRING(8),
      allowNull: true,
    },
    tanggal_mulai: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    tanggal_akhir: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    is_aktif: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    id_personal: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    nama_pegawai: {
      type: DataTypes.STRING(100),
      allowNull: false,
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
    tableName: "t_shift_pegawai",
    modelName: "ShiftPegawai",
    freezeTableName: true,
    timestamps: false,
  }
);

export default ShiftPegawai;
