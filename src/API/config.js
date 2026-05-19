import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    const isAuthRoute =
      config.url?.includes("/login") ||
      config.url?.includes("/register")||
      config.url?.includes("/forgot-password")||
      config.url?.includes("/reset-password/:token");

    if (token && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    return Promise.reject(error);
  }
);