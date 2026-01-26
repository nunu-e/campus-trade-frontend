import axios from "axios";

// IMPORTANT: Remove '/api' from the base URL since Render is already at root
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://campus-trade-backend.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  register: (userData) => api.post("/api/auth/register", userData), // Now correct: /api/auth/register
  login: (credentials) => api.post("/api/auth/login", credentials),
  getProfile: () => api.get("/api/auth/profile"),
  updateProfile: (profileData) => api.put("/api/auth/profile", profileData),
  verifyEmail: (code) => api.get(`/api/auth/verify/${code}`),
};
// User API
export const userAPI = {
  getById: (id) => api.get(`/api/users/${id}`),
  getListings: (userId) => api.get(`/api/users/${userId}/listings`),
  getTransactions: (userId) => api.get(`/api/users/${userId}/transactions`),
  getReviews: (userId) => api.get(`/api/users/${userId}/reviews`),
  search: (params) => api.get("/api/users/search", { params }),
};
// Listing API
export const listingAPI = {
  getAll: (params) => api.get("/api/listings", { params }),
  getById: (id) => api.get(`/api/listings/${id}`),
  create: (listingData) => api.post("/api/listings", listingData),
  update: (id, listingData) => api.put(`/api/listings/${id}`, listingData),
  delete: (id) => api.delete(`/api/listings/${id}`),
  search: (params) => api.get("/api/listings/search", { params }),
  reserve: (id) => api.post(`/api/listings/${id}/reserve`),
  getMyListings: () => api.get("/api/listings/my-listings"),
};

// Transaction API
export const transactionAPI = {
  create: (transactionData) => api.post("/api/transactions", transactionData),
  getMyTransactions: () => api.get("/api/transactions/my-transactions"),
  getById: (id) => api.get(`/api/transactions/${id}`),
  updateStatus: (id, status) =>
    api.put(`/api/transactions/${id}/status`, { status }),
  cancel: (id, reason) => api.put(`/api/transactions/${id}/cancel`, { reason }),
  complete: (id) => api.put(`/api/transactions/${id}/complete`),
};

// Message API
export const messageAPI = {
  send: (messageData) => api.post("/api/messages", messageData),
  getConversations: () => api.get("/api/messages/conversations"),
  getConversation: (userId) => api.get(`/api/messages/conversation/${userId}`),
  getUnreadCount: () => api.get("/api/messages/unread-count"),
  markAsRead: (messageId) => api.put(`/api/messages/${messageId}/read`),
};

// Review API
export const reviewAPI = {
  create: (reviewData) => api.post("/api/reviews", reviewData),
  getForUser: (userId) => api.get(`/api/reviews/user/${userId}`),
  getForListing: (listingId) => api.get(`/api/reviews/listing/${listingId}`),
  update: (id, reviewData) => api.put(`/api/reviews/${id}`, reviewData),
  delete: (id) => api.delete(`/api/reviews/${id}`),
};

// Admin API
export const adminAPI = {
  getUsers: (params) => api.get("/api/admin/users", { params }),
  updateUserStatus: (id, statusData) =>
    api.put(`/api/admin/users/${id}/status`, statusData),
  getListings: (params) => api.get("/api/admin/listings", { params }),
  updateListingStatus: (id, statusData) =>
    api.put(`/api/admin/listings/${id}/status`, statusData),
  getTransactions: (params) => api.get("/api/admin/transactions", { params }),
  getStats: () => api.get("/api/admin/stats"),
  getReports: (params) => api.get("/api/admin/reports", { params }),
};

// Report API
export const reportAPI = {
  create: (reportData) => api.post("/api/reports", reportData),
  getMyReports: () => api.get("/api/reports"),
  getById: (id) => api.get(`/api/reports/${id}`),
  updateStatus: (id, statusData) => api.put(`/api/reports/${id}`, statusData),
};

export default api;
