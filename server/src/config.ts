import * as dotenv from "dotenv";

dotenv.config();

export const config: any = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "postgres",
  },
  test: {
    // Test database configuration
  },
  production: {
    // Production database configuration
  },
  jwt: {
    secret: process.env.JWT_SECRET || "secret",
  },
};
