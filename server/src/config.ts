import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  database: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "postgres",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "secret",
  },
};

export const jwtSecret = config.jwt.secret;
