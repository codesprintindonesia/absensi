// src/models/lokasiKerja.model.js
import { DataTypes } from 'sequelize';
import sequelize from '../libraries/databaseconnection.library.js'; // pastikan file ini export { sequelize }

export const TYPE_LOKASI = ['CABANG', 'DIVISI', 'UNIT_KERJA', 'CUSTOM', 'MOBILE'];

export const LokasiKerja = sequelize.define('LokasiKerja', {
  id: {
    type: DataTypes.STRING(8),
    allowNull: false,
    primaryKey: true,
  },
  kode_referensi: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  type_lokasi: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: { isIn: [TYPE_LOKASI] }, // enum mirror DB
  },
  nama: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  alamat: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
  },
  radius: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 20, // DB default
    validate: { min: 1, max: 1000 },
  },
  is_aktif: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  keterangan: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
  },
}, {
  schema: 'absensi',
  tableName: 'm_lokasi_kerja',
  modelName: 'LokasiKerja',
  freezeTableName: true,
  timestamps: false, // trigger DB handle updated_at
  indexes: [
    { name: 'unique_kode_referensi_type', unique: true, fields: ['kode_referensi', 'type_lokasi'] },
    { name: 'idx_lokasi_type_aktif', fields: ['type_lokasi', 'is_aktif'] },
  ],
});
