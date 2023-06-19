import cors from "cors";
import express from "express";
import "express-async-errors";
import session from "express-session";
import http from "http";
import { Server } from "socket.io";
import authRouter from "./controllers/authController";
import inviteRouter from "./controllers/inviteController";
import usersRouter from "./controllers/userController";
import { mySocket } from "./listeners/types";
import { authenticateSocket } from "./middlewares/auth";
import errorHandler from "./middlewares/errorHandler";
import chatRouter from "./routes/chats";
import { getChatIds } from "./services/userChatService";
import logger from "./utils/logger";

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const sessionMiddleware = session({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
});

app.use(sessionMiddleware);

app.use("/api/auth", authRouter);

app.use("/images", express.static("./images"));

app.use("/api/register", usersRouter);

app.use("/api/users", usersRouter);

app.use("/api/chats", chatRouter);

app.use("/api/invites", inviteRouter);

app.use(errorHandler);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.use(authenticateSocket);

// connected clients, user id is the key for the socket. Multiple sockets can be connected to the same user.
// Use lodash for mapping sockets to user ids for easier access
const connectedClients: { [key: string]: mySocket[] } = {};

io.sockets.on("connection", (socket: mySocket) => {
  const user = socket.user;
  if (!user) {
    return;
  }
  connectedClients[user.id] = connectedClients[user.id] || [];
  connectedClients[user.id].push(socket);
  logger.info(`User ${socket.user?.username} connected`);

  const uniqueUsers = Object.keys(connectedClients);

  logger.info(`Number of connected users: ${uniqueUsers.length}`);

  socket.join(socket.user!.id);
  // join user chat rooms
  getChatIds(socket.user!.id).then((ids: string[]) => {
    ids.forEach((id) => {
      socket.join(id);
    });
  });

  socket.on("disconnect", () => {
    logger.info(`User disconnected: ${socket.user?.username}`);
    const sockets = connectedClients[user.id];
    const index = sockets.indexOf(socket);
    if (index > -1) {
      sockets.splice(index, 1);
    }

    if (sockets.length === 0) {
      delete connectedClients[user.id];
    }

    socket.disconnect();
  });
});

export { app, connectedClients, server };
