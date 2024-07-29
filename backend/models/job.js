import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { User } from "./user.js";

export const Job = sequelize.define("SlidifyPresentationJob", {
  jid: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  finishedAt: {
    type: DataTypes.DATE,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.hasMany(Job);
Job.belongsTo(User);
