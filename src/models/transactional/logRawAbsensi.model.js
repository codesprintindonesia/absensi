// src/models/transactional/logRawAbsensi.model.js
import { DataTypes } from "sequelize";
import { getSequelize } from "../../libraries/database.instance.js";

// dapatkan instance sequelize
const sequelize = await getSequelize();

// ENUM mirror dari CHECK constraint DB
const SOURCE_ABSENSI = ["FINGERPRINT", "MOBILE_APP", "QR_CODE"];
const STATUS_VALIDASI = ["VALID", "INVALID"];

const LogRawAbsensi = sequelize.define(
  "LogRawAbsensi",
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
    waktu_log: {
      type: DataTypes.DATE, // timestamp
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
      type: DataTypes.STRING(8),
      allowNull: true,
    },
    is_validasi_geofence: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    jarak_dari_lokasi: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    akurasi_gps: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
    },
    path_bukti_foto: {
      type: DataTypes.STRING(255),
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
      type: DataTypes.STRING(15),
      allowNull: true,
      defaultValue: "VALID",
      validate: { isIn: [STATUS_VALIDASI] },
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
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    nama_cabang: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    nama_jabatan_detail: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    source_absensi: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: { isIn: [SOURCE_ABSENSI] },
      comment:
        "Sumber: FINGERPRINT (mesin biometrik), MOBILE_APP (aplikasi mobile), QR_CODE (scan QR)",
    },
  },
  {
    schema: "absensi",
    tableName: "t_log_raw_absensi",
    modelName: "LogRawAbsensi",
    freezeTableName: true,
    timestamps: false, // trigger DB yang mengatur updated_at
    indexes: [
      // CREATE INDEX idx_log_absensi_pegawai_tanggal ON absensi.t_log_raw_absensi (id_pegawai, date(waktu_log));
      // Catatan: gunakan literal untuk ekspresi fungsi
      {
        name: "idx_log_absensi_pegawai_tanggal",
        fields: ["id_pegawai", sequelize.literal("date(waktu_log)")],
      },
      // CREATE INDEX idx_log_absensi_waktu ON absensi.t_log_raw_absensi (waktu_log);
      {
        name: "idx_log_absensi_waktu",
        fields: ["waktu_log"],
      },
      // CREATE INDEX idx_log_raw_absensi_source ON absensi.t_log_raw_absensi (source_absensi);
      {
        name: "idx_log_raw_absensi_source",
        fields: ["source_absensi"],
      },
    ],
  }
);

export { LogRawAbsensi, SOURCE_ABSENSI, STATUS_VALIDASI };
