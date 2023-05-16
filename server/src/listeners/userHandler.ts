import { getChatById } from "../services/chatService";
import { createMessage } from "../services/messageService";
import { Server } from "socket.io";
import { mySocket, newMessage } from "./types";
import { Op } from "sequelize";
import { User } from "../models/user";

module.exports = (io: Server, socket: mySocket) => {
  const joinRoom = async (room: string) => {
    // check if room is valid
    if (await getChatById(room)) {
      socket.join(room);
    }
  };

  const leaveRoom = (room: string) => {
    socket.leave(room);
  };

  const sendMessage = async ({ content: msg, room }: newMessage) => {
    if (!!socket.user) {
      const { content, createdAt, id }: any = await createMessage(
        msg,
        socket.user.id,
        room
      );

      const returnedMessage = {
        content,
        createdAt,
        id,
        chatId: room,
        user: {
          id: socket.user.id,
          username: socket.user.username,
        },
      };

      io.to(room).emit("chat:message", returnedMessage);
    }
  };

  const searchUser = async (username: string) => {
    const users = await User.findAll({
      where: {
        username: {
          [Op.like]: `%${username}%`,
        },
        id: {
          [Op.ne]: socket.user?.id,
        },
      },
      attributes: ["id", "username"],
      limit: 5,
    });

    socket.emit("search:user", users);
  };

  return {
    joinRoom,
    sendMessage,
    leaveRoom,
    searchUser,
  };
};
