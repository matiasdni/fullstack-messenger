import axios from "axios";

const BASE_URL = "/api";

interface LoginData {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

export const loginUser = async (
  loginData: LoginData
): Promise<LoginResponse> => {
  const response = await axios.post(`${BASE_URL}/login`, loginData);
  if (response.status === 200) return response.data;
  else throw new Error("Login failed");
};
