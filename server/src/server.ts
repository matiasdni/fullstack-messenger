import cors from "cors";
import express from "express";
import "express-async-errors";
import http from "http";
import { Server } from "socket.io";
import inviteRouter from "./controllers/inviteController";
import loginRouter from "./controllers/loginController";
import usersRouter from "./controllers/userController";
import { mySocket } from "./listeners/types";
import { authenticateSocket } from "./middlewares/auth";
import errorHandler from "./middlewares/errorHandler";
import chatRouter from "./routes/chats";
import { getChatIds } from "./services/userChatService";
import logger from "./utils/logger";

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

app.use("/api/chats", chatRouter);

app.use("/api/invites", inviteRouter);

app.use(errorHandler);

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
