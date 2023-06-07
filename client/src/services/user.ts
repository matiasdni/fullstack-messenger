import axios from "axios";
import { Chats, InviteAttributes, Senders } from "../../../shared/types";
import { User, friendRequest } from "../features/users/types";

const BASE_URL = "/api/users";

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

const createUser = async (user: { username: string; password: string }) => {
  return await axios.post(`${BASE_URL}`, user);
};

const searchUsersByName = async (
  name: string,
  token: string
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

const fetchUserChats = async (id: string, token: string) => {
  const response = await axios.get(`${BASE_URL}/${id}/chats`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response.data);
  return response.data;
};

// returns all the user's friend requests and chat invites
const fetchUserRequests = async (
  id: string,
  token: string
): Promise<UserRequests> => {
  const response = await axios.get(`${BASE_URL}/${id}/requests`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const removeFriend = async (
  userId: string,
  friendId: string,
  token: string
) => {
  const response = await axios.delete(
    `${BASE_URL}/${userId}/friends/${friendId}`,
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

const acceptFriendRequest = async (
  userId: string,
  friendId: string,
  token: string
): Promise<friendRequest> => {
  const response = await axios.put(
    `${BASE_URL}/${userId}/friends/${friendId}/accept`,
    {},
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const rejectFriendRequest = async (
  userId: string,
  friendId: string,
  token: string
): Promise<friendRequest> => {
  const response = await axios.put(
    `${BASE_URL}/${userId}/friends/${friendId}/reject`,
    {},
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const sendFriendRequest = async (
  userId: string,
  friendId: string,
  token: string
): Promise<friendRequest> => {
  const response = await axios.post(
    `${BASE_URL}/${userId}/friends/${friendId}`,
    {},
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export {
  acceptFriendRequest,
  createUser,
  fetchUserChats,
  fetchUserRequests,
  rejectFriendRequest,
  removeFriend,
  searchUsersByName,
  sendFriendRequest,
};
