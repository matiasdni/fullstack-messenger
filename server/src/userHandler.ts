import { getChatById } from "./services/chatService";
import { createMessage } from "./services/messageService";
import { Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  newMessage,
  ServerToClientEvents,
  SocketData,
} from "./index";

type ioType = Server<
  ServerToClientEvents,
  ClientToServerEvents,
  never,
  SocketData
>;

module.exports = (io: Server, socket: Socket) => {
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
    const { content, createdAt, id }: any = await createMessage(
      msg,
      socket.data.user.id,
      room
    );

    const returnedMessage = {
      content,
      createdAt,
      id,
      chatId: room,
      user: {
        id: socket.data.user.id,
        username: socket.data.user.username,
      },
    };

    io.to(room).emit("chat:message", returnedMessage);
  };

  return {
    joinRoom,
    sendMessage,
    leaveRoom,
  };
};
