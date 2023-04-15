import axios from "axios";

const BASE_URL = "/api/chat";

interface ChatDetails {
  name: string;
  description: string;
}

interface Chat {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const createChat = async (chatData: ChatDetails): Promise<Chat> => {
  const response = await axios.post(BASE_URL, chatData);
  if (response.status === 200) return response.data;
  else throw new Error("Chat creation failed");
};

const getChats = async (): Promise<Chat[]> => {
  const response = await axios.get(BASE_URL);
  if (response.status === 200) return response.data;
  else throw new Error("Failed to get chats");
};

export { createChat, getChats };
