import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Appointment = sequelize.define(
  "Appointment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
    },
    carID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "cars",
        key: "id",
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "da_nop",
    },
  },
  {
    tableName: "appointments",
    timestamps: true,
  }
);

export default Appointment;