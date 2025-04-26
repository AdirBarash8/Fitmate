import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/api",
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login");
    const token = localStorage.getItem("token");

    if (error.response?.status === 401 && token && !isLoginRequest) {
      localStorage.removeItem("token");
      window.location.href = "/"; // Or use a context-aware logout for no-refresh
    }

    return Promise.reject(error);
  }
);

export default instance;
