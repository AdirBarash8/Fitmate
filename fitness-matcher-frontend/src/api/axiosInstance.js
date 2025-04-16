import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Optional: set default headers dynamically based on token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or use context if preferred
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
