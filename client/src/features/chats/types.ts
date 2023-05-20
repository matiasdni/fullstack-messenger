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

export interface Chat {
  id: string;
  name?: string;
  description?: string;
  updatedAt: string;
  messages?: Message[];
  users?: User[];
  chat_type: string;
}

export type ChatState = {
  chats: Chat[];
  activeChatId: null | string;
};
