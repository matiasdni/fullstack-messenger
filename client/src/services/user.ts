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
