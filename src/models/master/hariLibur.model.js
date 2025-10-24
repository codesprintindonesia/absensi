// src/models/hariLibur.model.js
import { DataTypes } from "sequelize";
import { getSequelize } from "../../libraries/database.instance.js";

// Define enum constants untuk jenis_libur
const JENIS_LIBUR = ["LIBUR_NASIONAL", "CUTI_BERSAMA", "LIBUR_DAERAH"];

// Get sequelize instance
const sequelize = await getSequelize();

const HariLibur = sequelize.define(
  "HariLibur",
  {
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      primaryKey: true,
    },
    nama_libur: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    jenis_libur: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: { isIn: [JENIS_LIBUR] },
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
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
    tableName: "m_hari_libur",
    modelName: "HariLibur",
    freezeTableName: true,
    timestamps: false, // DB trigger handles updated_at
  }
);

// Export di akhir script sesuai coding guidelines
export { JENIS_LIBUR, HariLibur };