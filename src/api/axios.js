// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.example.com/api", // TODO: replace with real backend later
  timeout: 10000,
  withCredentials: true,
});

// Optional: attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
