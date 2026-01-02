import api from "./axios";

export const bookingsAPI = {
  // GET /components – fetch all components
  getComponents: () => api.get("/components"),

  // GET /bookings?filter=all|active|completed|overdue
  getBookings: (filter = "all") => api.get("/bookings", { params: { filter } }),

  // POST /bookings – create new booking
  createBooking: (payload) => api.post("/bookings", payload),

  // POST /bookings/:id/return – mark booking as returned
  returnBooking: (bookingId) => api.post(`/bookings/${bookingId}/return`),
};
