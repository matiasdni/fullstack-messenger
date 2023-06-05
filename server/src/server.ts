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

app.use("/api/chat", chatRouter);

app.use("/api/invites", inviteRouter);

app.use(errorHandler);

io.use(authenticateSocket);

const connectedClients: mySocket[] = [];
io.sockets.on("connection", (socket: mySocket) => {
  connectedClients.push(socket);
  logger.info(
    `User ${socket.user?.username} connected, connected clients: ${io.engine.clientsCount}`
  );

  const uniqueUsers = connectedClients.reduce((acc: any, curr: any) => {
    if (!acc.includes(curr.user.username)) {
      acc.push(curr.user.username);
    }
    return acc;
  }, []);

  logger.info(`Unique users: ${uniqueUsers.length}`);

  socket.join(socket.user!.id);

  socket.on("disconnect", () => {
    logger.info(`User disconnected: ${socket.user?.username}`);
    const index = connectedClients.indexOf(socket);
    connectedClients.splice(index, 1);
    socket.disconnect();
  });
});

export { app, connectedClients, server };
