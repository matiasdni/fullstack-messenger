import { ChatType } from "features/chats/chatsSlice";
import { Chat } from "features/chats/types";
import api from "services/api";

const BASE_URL = "/chats";

export interface chatData {
  name: string;
  chat_type: ChatType;
  userIds: string[];
  description?: string;
}

export const newChat = async (chatData: chatData): Promise<Chat> => {
  const response = await api.post(BASE_URL, chatData);
  return response.data;
};

export const fetchChatById = async (chatId: string): Promise<Chat> => {
  const response = await api.get(`${BASE_URL}/${chatId}`);
  return response.data;
};

export const sendMessage = async (chatId: string, message: string) => {
  const response = await api.post(`${BASE_URL}/${chatId}/message`, { message });
  return response.data;
};

export const removeUserFromChat = async (chatId: string, userId: string) => {
  const response = await api.delete(`${BASE_URL}/${chatId}/users/${userId}`);
  return response.data;
};

export const updateChatInfo = async (chatId: string, formData: any) => {
  const response = await api.put(`${BASE_URL}/${chatId}`, formData);
  return response.data;
};
