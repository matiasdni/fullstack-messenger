import cors from "cors";
import { authenticateSocket } from "./middlewares/auth";
import onConnection from "./listeners/socketsManager";

const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);

const loginRouter = require("./controllers/loginController");
const usersRouter = require("./controllers/userController");
const chatRouter = require("./controllers/chatController");

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

io.use(authenticateSocket);

io.on("connection", onConnection);

export { app, server };
