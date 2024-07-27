import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { User } from "./user.js";

export const Notification = sequelize.define("Notification", {
  notificationId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
  },
  content: {
    type: DataTypes.JSON,
  },
  status: {
    type: DataTypes.INTEGER,
  },
  actorId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.hasMany(Notification);
Notification.belongsTo(User);
