import { getChatById } from "./services/chatService";
import { createMessage } from "./services/messageService";
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

  const sendMessage = async ({ content: msg, room }) => {
    const { content, createdAt, id }: any = await createMessage(
      msg,
      <typeof DataTypes.UUID>socket.data.user.id,
      <typeof DataTypes.UUID>room
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
