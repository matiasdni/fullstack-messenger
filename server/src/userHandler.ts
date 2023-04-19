import { getChatById } from "./services/chatService";
import jwt from "jsonwebtoken";

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

  const sendMessage = ({ content, room }) => {
    const message = {
      ...content,
      date: new Date(),
    };
    io.to(room).emit(`message-${room}`, message);
  };

  return {
    joinRoom,
    sendMessage,
    leaveRoom,
  };
};
