import axios from "axios";
import { Chat } from "../features/chats/types";
import { ChatType } from "../features/chats/chatsSlice";

const BASE_URL = "/api/chat";

export interface chatData {
  name: string;
  chat_type: ChatType;
  userIds: string[];
  description?: string;
}

const newChat = async (chatData: chatData, token): Promise<Chat> => {
  console.log("chatData", chatData);
  const response = await axios.post(BASE_URL, chatData, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 200) return response.data;
  else throw new Error("chat creation failed");
};

const fetchChatById = async (chatId, token): Promise<Chat> => {
  const response = await axios.get(`${BASE_URL}/${chatId}`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 200) return response.data;
  else throw new Error("chat creation failed");
};

const sendMessage = async (chatId: string, message: string, token: string) => {
  const response = await axios.post(
    `${BASE_URL}/${chatId}/message`,
    {
      message,
    },
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (response.status === 200) return response.data;
  else throw new Error("message sending failed");
};

export { newChat, fetchChatById, sendMessage };
