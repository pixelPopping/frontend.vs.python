import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const client = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 8000,
});

// ---------------- REQUEST INTERCEPTOR ----------------
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

// ---------------- RESPONSE INTERCEPTOR ----------------
client.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response?.status === 401) {
      console.error("401 UNAUTHORIZED");

      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  },
);

export default client;