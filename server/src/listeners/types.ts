import { Socket } from "socket.io";
import { User } from "../models/user";

export type newMessage = {
  content: string;
  room: string;
};

export interface mySocket extends Socket {
  user?: User;
}
