import * as dotenv from "dotenv";

dotenv.config();

const isDevelopment = process.env.NODE_ENV !== "production";

export const config = {
  database: {
    username: isDevelopment ? process.env.DB_USER : process.env.PROD_DB_USER,
    password: isDevelopment
      ? process.env.DB_PASSWORD
      : process.env.PROD_DB_PASSWORD,
    database: isDevelopment ? process.env.DB_NAME : process.env.PROD_DB_NAME,
    host: isDevelopment ? process.env.DB_HOST : process.env.PROD_DB_HOST,
    port: Number(
      isDevelopment ? process.env.DB_PORT : process.env.PROD_DB_PORT
    ),
    dialect: isDevelopment
      ? process.env.DB_DIALECT
      : process.env.PROD_DB_DIALECT || "postgres",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "secret",
  },
};
export const jwtSecret = config.jwt.secret;
