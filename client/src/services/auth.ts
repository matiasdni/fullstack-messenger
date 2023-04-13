import axios from "axios";

const BASE_URL = "/api";

interface LoginData {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export const loginUser = async (
  loginData: LoginData
): Promise<LoginResponse> => {
  console.log(`${BASE_URL}/login`);
  console.log(loginData);
  const response = await axios.post(`${BASE_URL}/login`, loginData);
  console.log("response data", response.data);
  if (response.status === 200) return response.data;
  else throw new Error("Login failed");
};

export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    return decodedToken.exp > currentTime;
  } catch (error) {
    return false;
  }
};
