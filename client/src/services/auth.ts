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
  const response = await api.post(BASE_URL, loginData);
  if (response.status === 200) return response.data;
  else throw new Error("Login failed");
};
