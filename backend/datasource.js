import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(process.env.DATABASE_URL ?? "postgres://postgres:password@146.148.63.108/slidify_db?sslmode=disable");
