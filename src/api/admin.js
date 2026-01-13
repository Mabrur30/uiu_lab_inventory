import api from "./axios";

export const adminAPI = {
  // Dashboard
  getDashboard: () => api.get("/admin/dashboard"),

  // Bookings
  getBookingRequests: (filter = "pending") =>
    api.get("/admin/bookings", { params: { filter } }),
  approveBooking: (bookingId) =>
    api.post(`/admin/bookings/${bookingId}/approve`),
  rejectBooking: (bookingId) => api.post(`/admin/bookings/${bookingId}/reject`),
  getBookingHistory: (search = "") =>
    api.get("/admin/bookings/history", { params: { search } }),

  // Components / Inventory
  getComponents: () => api.get("/admin/components"),
  addComponent: (payload) => api.post("/admin/components", payload),
  updateComponent: (componentId, payload) =>
    api.put(`/admin/components/${componentId}`, payload),
  deleteComponent: (componentId) =>
    api.delete(`/admin/components/${componentId}`),

  // Stock Management
  getStockStatus: () => api.get("/admin/stock"),
  addStock: (componentId, quantity) =>
    api.post(`/admin/stock/${componentId}/add`, { quantity }),

  // Students
  getStudents: (search = "") =>
    api.get("/admin/students", { params: { search } }),
  getStudentDetails: (studentId) => api.get(`/admin/students/${studentId}`),

  // Penalties
  getPenalties: (search = "") =>
    api.get("/admin/penalties", { params: { search } }),
  markPenaltyPaid: (penaltyId) =>
    api.post(`/admin/penalties/${penaltyId}/mark-paid`),

  // Analytics
  getAnalytics: () => api.get("/admin/analytics"),

  // History/Logs
  getHistory: () => api.get("/admin/history"),
};
