import express, { Express } from "express";
import cors from "cors";

const loginRouter = require("./controllers/login");
const usersRouter = require("./controllers/users");
const chatRouter = require("./controllers/chat");

const app: Express = express();

app.use(express.json());

app.use(cors());

app.use("/api/register", usersRouter);

app.use("/api/login", loginRouter);

app.use("/api/users", usersRouter);

app.use("/api/chat", chatRouter);

export default app;
