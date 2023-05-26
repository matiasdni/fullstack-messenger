import cors from "cors";
import { authenticateSocket } from "./middlewares/auth";
import onConnection from "./listeners/socketsManager";
import http from "http";
import express from "express";
import { Server } from "socket.io";
import loginRouter from "./controllers/loginController";
import usersRouter from "./controllers/userController";
import chatRouter from "./routes/chats";

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

io.use(authenticateSocket);

io.on("connection", onConnection);

export { app, server };
