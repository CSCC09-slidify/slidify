import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { User } from "./user.js";

export const Job = sequelize.define("SlidifyPresentationJob", {
    jid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

User.hasMany(Job);
Job.belongsTo(User);