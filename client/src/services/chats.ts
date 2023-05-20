import axios from "axios";
import { Chat } from "../features/chats/types";

const BASE_URL = "/api/chat";

export const newChat = async (chatData, token): Promise<Chat> => {
  const response = await axios.post(BASE_URL, chatData, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 200) return response.data;
  else throw new Error("chat creation failed");
};

export const fetchChatById = async (chatId, token): Promise<Chat> => {
  const response = await axios.get(`${BASE_URL}/${chatId}`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 200) return response.data;
  else throw new Error("chat creation failed");
};
