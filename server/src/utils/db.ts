import { config } from "../config";
import { Sequelize } from "sequelize";
import { Pool } from "pg";

const db: any = config.database;

const sequelize = new Sequelize(db.database, db.username, db.password, {
  host: db.host,
  port: db.port,
  dialect: db.dialect,
  logging: false,
  sync: {
    alter: true,
  },
});

const createDatabase = async (): Promise<void> => {
  const pool = new Pool({
    user: db.username,
    host: db.host,
    password: db.password,
    port: db.port,
  });

  try {
    console.log(`creating database ${db.database}`);
    await pool.query(`CREATE DATABASE ${db.database};`);
    console.log(`database ${db.database} created.`);
  } catch (err: any) {
    if (err.code === "42P04") {
      console.log(`database ${db.database} already exists.`);
    } else {
      console.error("error creating database", err);
      throw err;
    }
  } finally {
    await pool.end();
  }
};

const connectToDatabase = async (): Promise<void> => {
  await createDatabase();
  try {
    await sequelize.authenticate();
    console.log("connected to database");
  } catch (error) {
    console.error("connection error", error);
    throw error;
  }
};

export { sequelize, createDatabase, connectToDatabase };
