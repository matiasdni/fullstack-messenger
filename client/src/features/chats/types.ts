import { User } from "../users/types";

export type Message = {
  id: string;
  content: string;
  User: string;
  createdAt: string;
};

export type Chat = {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  Messages: Message[];
  Users: User[];
};

export interface ChatState {
  chats: Chat[];
  activeChat: Chat;
}

export type ChatsInitialState = {
  chats: null | Chat[];
  activeChat: null | Chat;
};
