import express, { Express } from "express";
import cors from "cors";

const loginRouter = require("./controllers/login");
const usersRouter = require("./controllers/users");

const app: Express = express();

app.use(cors());

app.use(express.json());

app.use("/api/login", loginRouter);

app.use("/api/users", usersRouter);

export default app;
