import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const Presentation = sequelize.define("PresentationData", {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  externalId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  presentationId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  }
});