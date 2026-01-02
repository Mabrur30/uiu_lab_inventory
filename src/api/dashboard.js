// src/api/dashboard.js
import api from "./axios";

export const dashboardAPI = {
  // Placeholder endpoint for now
  getStats: () => api.get("/dashboard"), // later your backend will implement /dashboard
};
