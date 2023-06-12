import axios from "axios";
import { ChatType } from "../features/chats/chatsSlice";
import { Chat } from "../features/chats/types";

const BASE_URL = "/api/chats";

export interface chatData {
  name: string;
  chat_type: ChatType;
  userIds: string[];
  description?: string;
}

const newChat = async (chatData: chatData, token: string): Promise<Chat> => {
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

const fetchChatById = async (chatId: string, token: string): Promise<Chat> => {
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

const removeUserFromChat = async ({
  chatId,
  userId,
  token,
}: {
  chatId: string;
  userId: string;
  token: string;
}) => {
  const response = await axios.delete(`${BASE_URL}/${chatId}/users/${userId}`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 200) return response.data;
  else throw new Error("Removing user failed");
};

const updateChatInfo = async ({ chatId, token, formData }) => {
  console.log(formData.get("image"));
  const response = await axios.put(`${BASE_URL}/${chatId}`, formData, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: formData,
  });
  if (response.status === 200) return response.data;
  else throw new Error("Updating chat failed");
};
export {
  fetchChatById,
  newChat,
  removeUserFromChat,
  sendMessage,
  updateChatInfo,
};
