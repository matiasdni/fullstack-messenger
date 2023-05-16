import { io } from "../server";
import { mySocket } from "./types";

const onConnection = (socket: mySocket) => {
  const { joinRoom, sendMessage, leaveRoom, searchUser } =
    require("./userHandler")(io, socket);
  const { user } = socket;

  if (!user) return;
  console.log("User connected: ", user.username);
  const users: any[] = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userId: user.id,
      username: user.username,
    });
  }
  socket.emit("users", users);
  socket.join(user.id);
  socket.on("join-room", joinRoom);
  socket.on("message", sendMessage);
  socket.on("leave-room", leaveRoom);
  socket.on("search:user", searchUser);

  socket.on("disconnect", () => {
    console.log("User disconnected: ", user.username);
  });
};

export default onConnection;
