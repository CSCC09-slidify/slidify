import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize("db", "user", "password", {
  host: process.env.DATABASE_URL,
  dialect: "postgres"
});
