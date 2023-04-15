import axios from "axios";

const BASE_URL = "/api/users";

export const newUser = async (user: any) => {
  return await axios.post(`${BASE_URL}/new`, user);
};

export const getUsers = async () => {
  return await axios.get(`${BASE_URL}`);
};

export const getUser = async (id: string) => {
  return await axios.get(`${BASE_URL}/${id}`);
};
