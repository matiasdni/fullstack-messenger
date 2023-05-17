import { io } from "../server";
import { mySocket } from "./types";
import { getUserById } from "../services/userService";
import { createChat } from "../services/chatService";
import { Chat } from "../models/chat";
import { User } from "../models/user";
import { Message } from "../models/message";

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
  socket.on("get:chatByUserId", async (data) => {
    const otherUser = await getUserById(data);
    const currentUser = socket.user;
    if (!otherUser || !currentUser || otherUser.id === currentUser.id) return;

    // Fetch the private chat between the current user and the other user
    const existingChat = await Chat.findOne({
      where: { chat_type: "private" },
      include: [
        {
          model: User,
          where: { id: [currentUser.id, otherUser.id] },
          through: { attributes: [] },
          as: "users",
        },
      ],
    });

    if (existingChat) {
      socket.emit("get:chatByUserId", existingChat);
    } else {
      const newChat = await createChat(
        `${currentUser.username}-${otherUser.username}`,
        undefined,
        "private"
      );
      await newChat.addUser(currentUser);
      await newChat.addUser(otherUser);

      // include users etc in the response
      const chat = (await Chat.findByPk(newChat.id, {
        include: [
          {
            model: User,
            through: { attributes: [] },
            as: "users",
          },
          {
            model: Message,
            as: "messages",
            include: [
              {
                model: User,
                attributes: ["id", "username"],
                as: "user",
              },
            ],
          },
        ],
      })) as Chat;

      // socket.to(currentUser.id).emit("join-room", chat.id);
      io.to(currentUser.id).emit("join-room", chat.id);
      socket.to(otherUser.id).emit("join-room", chat.id); // Make the other user join the new chat room
      socket.emit("get:chatByUserId", chat);
    }
  });

  socket.on("get:chatById", async (data) => {
    const chat = await Chat.findByPk(data, {
      include: [
        {
          model: User,
          through: { attributes: [] },
          as: "users",
        },
        {
          model: Message,
          as: "messages",
          include: [
            {
              model: User,
              attributes: ["id", "username"],
              as: "user",
            },
          ],
        },
      ],
    });
    socket.emit("get:chatById", chat);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: ", user.username);
  });
};

export default onConnection;
