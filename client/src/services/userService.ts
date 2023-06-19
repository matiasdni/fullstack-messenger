import { friendRequest } from "features/users/types";
import api from "services/api";
import { Chats, InviteAttributes, Senders } from "../../../shared/types";

const BASE_URL = "/users";

interface UserRequests {
  invites: {
    invites: InviteAttributes[];
    senders: Senders;
    chats: Chats;
  };
  friendRequests: {
    userId: string;
    username: string;
    status: string;
    createdAt: string;
  }[];
}

export const createUser = async (user: {
  username: string;
  password: string;
}) => {
  return await api.post(`${BASE_URL}`, user);
};

export const searchUsersByName = async (name: string) => {
  const response = await api.post(`${BASE_URL}/search`, { name });
  if (response.data) {
    return response.data;
  } else {
    throw new Error("Response data is undefined");
  }
};

export const fetchUserChats = async (id: string) => {
  const response = await api.get(`${BASE_URL}/${id}/chats`);
  return response.data;
};

export const fetchUserRequests = async (id: string): Promise<UserRequests> => {
  const response = await api.get(`${BASE_URL}/${id}/requests`);
  return response.data;
};

export const removeFriend = async (userId: string, friendId: string) => {
  const response = await api.delete(
    `${BASE_URL}/${userId}/friends/${friendId}`
  );
  return response.data;
};

export const acceptFriendRequest = async (
  userId: string,
  friendId: string
): Promise<friendRequest> => {
  const response = await api.put(
    `${BASE_URL}/${userId}/friends/${friendId}/accept`
  );
  return response.data;
};

export const rejectFriendRequest = async (
  userId: string,
  friendId: string
): Promise<friendRequest> => {
  const response = await api.put(
    `${BASE_URL}/${userId}/friends/${friendId}/reject`
  );
  return response.data;
};

export const sendFriendRequest = async (
  userId: string,
  friendId: string
): Promise<friendRequest> => {
  const response = await api.post(`${BASE_URL}/${userId}/friends/${friendId}`);
  return response.data;
};
