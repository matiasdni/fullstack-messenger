import api from "./api";

const BASE_URL = "/auth";

interface LoginData {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

export const loginUser = async (
  loginData: LoginData
): Promise<LoginResponse> => {
  const res = await api.post(BASE_URL, loginData);
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.get(`${BASE_URL}/logout`);
  return res.data;
};
