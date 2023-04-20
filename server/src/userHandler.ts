import { getChatById } from "./services/chatService";
import { createMessage } from "./services/messageService";
import { DataTypes } from "sequelize";
import { Socket, io } from "socket.io";

module.exports = (io: socket.io, socket: Socket) => {
  const joinRoom = async (room: string) => {
    // check if room is valid
    if (await getChatById(room)) {
      socket.join(room);
    }
  };

  const leaveRoom = (room: string) => {
    socket.leave(room);
  };

  const sendMessage = async ({ content: msg, room }) => {
    const { content, createdAt, id }: any = await createMessage(
      msg,
      socket.data.user.id,
      room
    );

    const returnedMessage = {
      content,
      createdAt,
      id,
      user: {
        id: socket.data.user.id,
        username: socket.data.user.username,
      },
    };
    io.to([room, socket.data.user.id]).emit(`message-${room}`, returnedMessage);
  };

  return {
    joinRoom,
    sendMessage,
    leaveRoom,
  };
};
