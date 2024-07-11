import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const Session = sequelize.define("Session", {
  sid: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  expires: {
    type: DataTypes.DATE,
  },
  data: {
    type: DataTypes.TEXT,
  },
});
