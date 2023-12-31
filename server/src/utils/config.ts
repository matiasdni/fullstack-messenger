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
    port: Number(process.env.DB_PORT),
    dialect: process.env.DB_DIALECT,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "secret",
  },
  session: {
    secret: process.env.SESSION_SECRET || "secret",
  },
};
export const jwtSecret = config.jwt.secret;
