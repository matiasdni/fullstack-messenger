import { Socket } from "socket.io";
import { User } from "../models/user";

export type newMessage = {
  content: string;
  room: string;
};

export interface ClientToServerEvents {
  "join-room": (room: string) => void;
  "leave-room": (room: string) => void;
  sendMessage: (message: { content: string; room: string }) => void;
}

export interface ServerToClientEvents {
  "chat:message": (message: newMessage) => void;
}

export interface SocketData {
  user: {
    id: string;
    username: string;
  };
}

export interface mySocket extends Socket {
  user?: User;
}
