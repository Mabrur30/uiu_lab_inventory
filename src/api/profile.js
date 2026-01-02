// src/api/profile.js
import api from "./axios";

export const profileAPI = {
  // GET /profile – fetch student profile
  getProfile: () => api.get("/profile"),

  // PUT /profile – update profile info
  updateProfile: (payload) => api.put("/profile", payload),

  // PUT /profile/notifications – update notification settings
  updateNotifications: (payload) => api.put("/profile/notifications", payload),
};
