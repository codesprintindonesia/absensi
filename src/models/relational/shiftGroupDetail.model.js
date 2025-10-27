// src//models/relational/shiftGroupDetail.model.js
import { DataTypes } from "sequelize";
import { getSequelize } from "../../libraries/database.instance.js";

// dapatkan instance sequelize
const sequelize = await getSequelize();

// Definisi model ShiftGroupDetail
const ShiftGroupDetail = sequelize.define(
  "ShiftGroupDetail",
  {
    id: {
      type: DataTypes.STRING(12),
      allowNull: false,
      primaryKey: true,
    },
    id_shift_group: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
    id_shift_kerja: {
      type: DataTypes.STRING(8),
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
    tableName: "r_shift_group_detail",
    modelName: "ShiftGroupDetail",
    freezeTableName: true,
    timestamps: false, // trigger DB yang mengurus updated_at
  }
);

export { ShiftGroupDetail };
