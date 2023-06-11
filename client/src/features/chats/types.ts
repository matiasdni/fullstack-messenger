import { User } from "../users/types";

export type Message = {
  id: string;
  content: string;
  user: {
    id: string;
    username: string;
  };
  createdAt: string;
  chatId: string;
  userId: string;
};

export interface Chat {
  id: string;
  name?: string;
  description?: string;
  updatedAt: Date;
  createdAt: Date;
  messages?: Message[];
  users?: User[];
  owner?: User;
  ownerId?: string;
  chat_type: string;
  avatar?: File;
}

export type ChatState = {
  chats: Chat[];
  activeChatId: null | string;
};
