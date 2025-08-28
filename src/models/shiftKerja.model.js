// src/models/shiftKerja.model.js
import { DataTypes } from 'sequelize';
import { getSequelize } from '../libraries/database.instance.js';

// Enum jenis shift sesuai constraint DB:contentReference[oaicite:1]{index=1}
const JENIS_SHIFT = ['NORMAL', 'ROTATING', 'CUSTOM'];

// Dapatkan instance sequelize
const sequelize = await getSequelize();

const ShiftKerja = sequelize.define('ShiftKerja', {
  id: {
    type: DataTypes.STRING(8),
    allowNull: false,
    primaryKey: true,
  },
  kode_shift: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  nama: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  jam_masuk: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  jam_pulang: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  durasi_istirahat: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 60,
    validate: { min: 0, max: 240 },             // sesuai check constraint:contentReference[oaicite:2]{index=2}
  },
  hari_kerja: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  jenis_shift: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: 'NORMAL',
    validate: { isIn: [JENIS_SHIFT] },
  },
  is_umum: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  },
  toleransi_keterlambatan: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 15,
    validate: { min: 0 },
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
}, {
  schema: 'absensi',
  tableName: 'm_shift_kerja',
  modelName: 'ShiftKerja',
  freezeTableName: true,
  timestamps: false,
});

export { JENIS_SHIFT, ShiftKerja };
