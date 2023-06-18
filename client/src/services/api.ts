import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";

interface AdaptAxiosRequestConfig extends AxiosRequestConfig {
  headers: AxiosRequestHeaders;
}

const BASE_URL = "/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      return Promise.reject({
        message: error.response.data.message,
        status: "error",
      });
    } else {
      return Promise.reject({ message: "Unexpected error", status: "error" });
    }
  }
);

export default api;
