import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api"; // Import the configured axios instance

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Token is now handled by axios interceptor
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post("/api/auth/register", userData);

      if (response.data) {
        const user = {
          ...response.data,
          token: response.data.token,
        };

        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);

        toast.success(
          response.data.message ||
            "Registration successful! Please check your email for verification.",
        );
        return { success: true, data: response.data };
      }
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post("/api/auth/login", { email, password });

      if (response.data) {
        const user = {
          ...response.data,
          token: response.data.token,
        };

        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);

        toast.success("Login successful!");
        return { success: true, data: response.data };
      }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.info("Logged out successfully");
    window.location.href = "/login"; // Redirect to login
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await api.put("/api/auth/profile", profileData);

      if (response.data) {
        const updatedUser = { ...user, ...response.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        toast.success("Profile updated successfully!");
        return { success: true, user: updatedUser };
      }
    } catch (error) {
      const message = error.response?.data?.message || "Update failed";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (code) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/auth/verify/${code}`);

      if (response.data) {
        const updatedUser = { ...user, isVerified: true };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        toast.success("Email verified successfully!");
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || "Verification failed";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Add password reset functionality
  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      const response = await api.post("/api/auth/forgot-password", { email });

      toast.success(
        response.data?.message ||
          "Password reset instructions sent to your email",
      );
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to send reset email";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      const response = await api.post("/api/auth/reset-password", {
        token,
        newPassword,
      });

      toast.success(response.data?.message || "Password reset successfully");
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to reset password";
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isVerified: user?.isVerified,
    // Helper to refresh user data
    refreshUser: async () => {
      try {
        if (user) {
          const response = await api.get("/api/auth/profile");
          const updatedUser = { ...user, ...response.data };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
      } catch (error) {
        console.error("Failed to refresh user:", error);
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
