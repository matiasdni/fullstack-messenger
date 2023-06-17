import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";

interface AdaptAxiosRequestConfig extends AxiosRequestConfig {
  headers: AxiosRequestHeaders;
}

const BASE_URL = "/api";

const api = axios.create({
  baseURL: BASE_URL,
});

// add token to headers
api.interceptors.request.use(
  (config: AdaptAxiosRequestConfig) => {
    const token = localStorage.getItem("token") || "";
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error: AxiosError) => {
    console.log(error.toJSON());
    return Promise.reject(error);
  }
);

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
