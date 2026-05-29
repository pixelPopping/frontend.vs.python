import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------- REQUEST INTERCEPTOR ----------------
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Voeg token toe indien aanwezig
    if (token) {
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
  (response) => response,

  (error) => {
    // Auto logout bij 401
    if (error.response?.status === 401) {
      console.error("401 UNAUTHORIZED");

      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  },
);

export default client;
