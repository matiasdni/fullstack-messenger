import cors from "cors";
import express from "express";
import "express-async-errors";
import helmet from "helmet";
import http from "http";
import { Server, Socket } from "socket.io";
import authRouter from "./controllers/authController";
import inviteRouter from "./controllers/inviteController";
import usersRouter from "./controllers/userController";
import setupSocketHandler from "./listeners/socketHandler";
import { authenticateSocket } from "./middlewares/auth";
import errorHandler from "./middlewares/errorHandler";
import chatRouter from "./routes/chats";

const app = express();

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

app.use(helmet());

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.static('build'));

app.use("/api/auth", authRouter);

app.use("/images", express.static("./images"));

app.use("/api/register", usersRouter);

app.use("/api/users", usersRouter);

app.use("/api/chats", chatRouter);

app.use("/api/invites", inviteRouter);

app.use(errorHandler);

io.use(authenticateSocket);

io.sockets.on("connection", (socket: Socket) => setupSocketHandler(socket));

export { app, server };
