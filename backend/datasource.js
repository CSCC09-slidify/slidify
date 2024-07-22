import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize("postgres://postgres:password@146.148.63.108:5432/slidify_db?sslmode=disable");
