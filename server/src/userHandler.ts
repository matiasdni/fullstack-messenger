import { getChatById } from "./services/chatService";
import jwt from "jsonwebtoken";
import { createMessage, getMessages } from "./services/messageService";
import { DataTypes } from "sequelize";

module.exports = (io, socket) => {
  const joinRoom = async (room: string) => {
    // check if room is valid
    if (await getChatById(room)) {
      socket.join(room);
    }
  };

  const leaveRoom = (room: string) => {
    socket.leave(room);
  };

  const sendMessage = async ({ content, room }) => {
    const message: any = await createMessage(
      content,
      <typeof DataTypes.UUID>socket.data.user.id,
      <typeof DataTypes.UUID>room
    );

    const returnedMessage = {
      content: message.content,
      createdAt: message.createdAt,
      id: message.id,
      User: {
        id: socket.data.user.id,
        username: socket.data.user.username,
      },
    };

    io.to(room).emit(`message-${room}`, returnedMessage);
  };

  return {
    joinRoom,
    sendMessage,
    leaveRoom,
  };
};
