import { User } from "../users/types";

export type Message = {
  id: string;
  content: string;
  user: {
    id: string;
    username: string;
  };
  createdAt: string;
};

export type Chat = {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  messages: Message[];
  users: User[];
};

export interface ChatState {
  chats: Chat[];
  activeChat: Chat;
}

export type ChatsInitialState = {
  chats: null | Chat[];
  activeChat: null | Chat;
};
