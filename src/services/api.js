import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
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
      // Unauthorized - clear storage and redirect to login
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/api/auth/login", credentials),
  register: (userData) => api.post("/api/auth/register", userData),
  getProfile: () => api.get("/api/auth/profile"),
  updateProfile: (profileData) => api.put("/api/auth/profile", profileData),
  verifyEmail: (code) => api.get(`/api/auth/verify/${code}`),
};

// User API
export const userAPI = {
  getById: (id) => api.get(`/api/users/${id}`),
  getUsers: (params) => api.get("/api/users/search", { params }),
  getUserListings: (id) => api.get(`/api/users/${id}/listings`),
  getUserTransactions: (id) => api.get(`/api/users/${id}/transactions`),
  getUserReviews: (id) => api.get(`/api/users/${id}/reviews`),
};

// Listing API
export const listingAPI = {
  getAll: (params) => api.get("/api/listings", { params }),
  getById: (id) => api.get(`/api/listings/${id}`),
  create: (listingData) => api.post("/api/listings", listingData),
  update: (id, listingData) => api.put(`/api/listings/${id}`, listingData),
  delete: (id) => api.delete(`/api/listings/${id}`),
  search: (params) => api.get("/api/listings/search", { params }),
  reserveListing: (id) => api.post(`/api/listings/${id}/reserve`),
  getMyListings: () => api.get("/api/listings/my-listings"),
};

// Transaction API
export const transactionAPI = {
  create: async (transactionData) => {
    try {
      const response = await api.post("/api/transactions", transactionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMyTransactions: async () => {
    try {
      const response = await api.get("/api/transactions/my-transactions");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/api/transactions/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateStatus: async (id, status) => {
    try {
      const response = await api.put(`/api/transactions/${id}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  cancel: async (id, reason) => {
    try {
      const response = await api.put(`/api/transactions/${id}/cancel`, {
        reason,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  complete: async (id) => {
    try {
      const response = await api.put(`/api/transactions/${id}/complete`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
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

// Report API
export const reportAPI = {
  create: (reportData) => api.post("/api/reports", reportData),
  getMyReports: () => api.get("/api/reports"),
  getById: (id) => api.get(`/api/reports/${id}`),
  updateStatus: (id, statusData) => api.put(`/api/reports/${id}`, statusData),
};

// Admin API - Note: These endpoints need to be implemented in backend
export const adminAPI = {
  getUsers: async (params) => {
    // In production, this would be a dedicated admin endpoint
    // For now, we'll use the regular users endpoint
    return userAPI.getUsers(params);
  },

  updateUserStatus: async (id, statusData) => {
    // This would need to be implemented in backend
    console.log("Admin update user status:", id, statusData);
    return { data: { success: true } };
  },

  getListings: async (params) => {
    // In production, this would be a dedicated admin endpoint
    // For now, we'll use the regular listings endpoint
    return listingAPI.getAll(params);
  },

  updateListingStatus: async (id, statusData) => {
    // This would need to be implemented in backend
    console.log("Admin update listing status:", id, statusData);
    return { data: { success: true } };
  },

  getTransactions: async () => {
    // In production, this would be a dedicated admin endpoint
    // For now, we'll use the regular transactions endpoint
    return transactionAPI.getMyTransactions();
  },

  getStats: async () => {
    // This would need to be implemented in backend
    // For now, return empty stats
    return {
      data: {
        overview: {
          totalUsers: 0,
          activeUsers: 0,
          totalListings: 0,
          activeListings: 0,
          totalTransactions: 0,
          completedTransactions: 0,
          pendingReports: 0,
        },
        recentActivities: {
          users: [],
          listings: [],
          transactions: [],
        },
      },
    };
  },

  getReports: async (params) => {
    // This would need to be implemented in backend
    console.log("Get reports with params:", params);
    return { data: { reports: [], total: 0 } };
  },
};

export default api;
