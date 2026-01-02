// src/api/penalties.js
import api from "./axios";

export const penaltiesAPI = {
  // GET /penalties – fetch penalties overview and history
  getPenalties: () => api.get("/penalties"),

  // POST /penalties/:id/mark-paid – mark penalty as paid
  markPaid: (penaltyId) => api.post(`/penalties/${penaltyId}/mark-paid`),
};
