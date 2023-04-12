import express, { Express, Router } from "express";
import cors from "cors";

const loginRouter = require("./controllers/login");
const usersRouter: Router = require("./controllers/users");

const app: Express = express();

app.use(cors());

app.use(express.json());

app.use("/api/login", loginRouter);

app.use("/api/users", usersRouter);

export default app;
