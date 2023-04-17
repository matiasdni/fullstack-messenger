import axios from "axios";

const BASE_URL = "/api/chat";

interface ChatDetails {
  name: string;
  description: string;
}

interface Chats {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const createChat = async (chatData: ChatDetails): Promise<Chats> => {
  const response = await axios.post(BASE_URL, chatData);
  if (response.status === 200) return response.data;
  else throw new Error("Chats creation failed");
};

export async function fetchChats(token: string) {
  const response = await axios.get(BASE_URL, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
