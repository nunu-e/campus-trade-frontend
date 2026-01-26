import api from "./api";

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post("/api/auth/login", { email, password });

      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
        api.defaults.headers.common["Authorization"] =
          `Bearer ${response.data.token}`;
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post("/api/auth/register", userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put("/api/auth/profile", profileData);

      // Update stored user data
      const user = authService.getCurrentUser();
      if (user) {
        const updatedUser = { ...user, ...response.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifyEmail: async (code) => {
    try {
      const response = await api.get(`/api/auth/verify/${code}`);

      // Update user verification status
      const user = authService.getCurrentUser();
      if (user) {
        user.isVerified = true;
        localStorage.setItem("user", JSON.stringify(user));
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  isAuthenticated: () => {
    const user = authService.getCurrentUser();
    return !!(user && user.token);
  },

  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.role === "admin";
  },

  isVerified: () => {
    const user = authService.getCurrentUser();
    return user && user.isVerified === true;
  },
};
