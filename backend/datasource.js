import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(process.env.DATABASE_URL ?? "postgres://postgres:password@127.0.0.1:5432/slidify_db?sslmode=disable");
