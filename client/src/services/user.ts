import axios from "axios";
import { User } from "../features/users/types";

const BASE_URL = "/api/users";

export const createUser = async (user) => {
  return await axios.post(`${BASE_URL}`, user);
};

export const getAllUsers = async () => {
  return await axios.get(`${BASE_URL}`);
};

export const getUserById = async (id: string) => {
  return await axios.get(`${BASE_URL}/${id}`);
};

export const searchUsersByName = async (
  name: string,
  token
): Promise<User[]> => {
  const response = await axios.post(
    `${BASE_URL}/search`,
    { name },
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export async function fetchUserChats(id: string, token: string) {
  const response = await axios.get(`${BASE_URL}/${id}/chats`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response.data);
  return response.data;
}

export async function fetchUserFriends(id: string, token: string) {
  const response = await axios.get(`${BASE_URL}/${id}/friends`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// returns all the user's friend requests and chat invites
export async function fetchUserRequests(id: string, token: string) {
  const response = await axios.get(`${BASE_URL}/${id}/requests`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// returns all the user's friend requests
export async function fetchUserFriendRequests(id: string, token: string) {
  const response = await axios.get(`${BASE_URL}/${id}/friends/requests`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function fetchUserChatRequests(id: string, token: string) {
  const response = await axios.get(`${BASE_URL}/${id}/chats/requests`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
