import http from "http";
import app from "./server";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { User } from "./models/user";
import "./models/initModels";

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

const isValidToken = (token: string) => {
  const user: any = jwt.verify(token, process.env.JWT_SECRET!);
  return !!User.findOne(user);
};

io.on("connection", (socket: Socket) => {
  console.log("Client connected", socket.id);
  const token = socket.handshake.auth.token;

  if (isValidToken(token)) {
    socket.join("general");
  } else {
    socket.disconnect();
  }

  socket.on("message", (content) => {
    console.log(content);
    const message = {
      ...content,
      date: new Date(),
    };
    console.log(message);
    io.to("general").emit("message", message);
  });
});

io.on("disconnect", (socket: Socket) => {
  console.log("Client disconnected", socket.id);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
