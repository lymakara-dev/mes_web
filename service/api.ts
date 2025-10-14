// lib/api.ts
import axios from "axios";

import { getToken, clearToken } from "./authentication/auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Token middleware
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response middleware for auto-logout
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      clearToken();

      if (window.location.pathname !== "/learn/signin") {
        window.location.href = "/learn/signin";
      }
    }

    return Promise.reject(err);
  },
);

export default api;
