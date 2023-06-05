import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import inviteRouter from "./controllers/inviteController";
import loginRouter from "./controllers/loginController";
import usersRouter from "./controllers/userController";
import onConnection from "./listeners/socketsManager";
import { authenticateSocket } from "./middlewares/auth";
import errorHandler from "./middlewares/errorHandler";
import chatRouter from "./routes/chats";
require("express-async-errors");

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

app.use(cors());

app.use(express.json());

app.use("/api/register", usersRouter);

app.use("/api/login", loginRouter);

app.use("/api/users", usersRouter);

app.use("/api/chat", chatRouter);

app.use("/api/invites", inviteRouter);

app.use(errorHandler);

io.use(authenticateSocket);

io.on("connection", onConnection);

export { app, server };
