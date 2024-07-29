import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { User } from "./user.js";
import { defaultUserSettings } from "../constants/userSettings.js";
export const UserSettings = sequelize.define("UserSettings", {
  config: {
    type: DataTypes.JSON,
    defaultValue: defaultUserSettings
  }
});

UserSettings.belongsTo(User);
User.hasOne(UserSettings);