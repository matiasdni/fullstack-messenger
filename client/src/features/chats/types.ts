import { User } from "../users/types";

export type Message = {
  chatId: string;
  content: string;
  sender: string;
  timestamp: number;
};

export type Chat = {
  id: string;
  name: string;
  messages: Message[];
};

export interface ChatState {
  chats: Chat[];
  users: User[];
  activeChat: string | null;
}

export type ChatsInitialState = Chat[];
