import { config } from "./config";
import { Sequelize } from "sequelize";
import { Pool } from "pg";

const db: any = config.database;

const sequelize = new Sequelize({
  dialect: db.dialect,
  host: db.host,
  port: db.port,
  database: db.database,
  username: db.username,
  password: db.password,
  logging: false,
  sync: {
    alter: true,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  ssl: true,
});

const createDatabase = async (): Promise<void> => {
  const pool = new Pool({
    user: db.username,
    host: db.host,
    password: db.password,
    port: db.port,
    database: db.database,
    ssl: {
      rejectUnauthorized: false,
    },
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
  process.env.NODE_ENV !== "production" && (await createDatabase());
  try {
    await sequelize.authenticate();
    console.log("connected to database");
  } catch (error) {
    console.error("connection error", error);
  }
};

export { sequelize, createDatabase, connectToDatabase };
