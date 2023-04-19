import http from "http";
import app from "./server";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import "./models/initModels";
import { jwtSecret } from "./config";
import { authenticateSocket } from "./middlewares/auth";
const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.use(authenticateSocket);

const onConnection = (socket: Socket) => {
  const { joinRoom, sendMessage, leaveRoom } = require("./userHandler")(
    io,
    socket
  );
  const { user } = socket.data;
  console.log("User connected: ", user.username);

  socket.join(user.id);
  socket.on("join-room", joinRoom);
  socket.on("message", sendMessage);
  socket.on("leave-room", leaveRoom);

  socket.on("disconnect", () => {
    console.log("User disconnected: ", user.username);
  });
};

io.on("connection", onConnection);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
