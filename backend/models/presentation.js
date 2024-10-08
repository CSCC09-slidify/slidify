import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { User } from "./user.js";
import { Job } from "./job.js";

export const Presentation = sequelize.define("PresentationData", {
  presentationId: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  externalId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Presentation.belongsTo(User);
User.hasMany(Presentation);

Presentation.belongsTo(Job);
Job.hasOne(Presentation);
