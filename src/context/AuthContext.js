import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for stored user on mount
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setupApiHeaders(parsed.token);
      }
    } catch (error) {
      // Invalid JSON in localStorage, clear it
      console.error("Error parsing user from localStorage:", error);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  const setupApiHeaders = (token) => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post("/api/auth/register", userData);

      if (response.data && response.data.data) {
        const userObj = response.data.data;
        // ensure token is top-level on stored object
        userObj.token = userObj.token || response.data.data.token;

        localStorage.setItem("user", JSON.stringify(userObj));
        setUser(userObj);
        setupApiHeaders(userObj.token);

        toast.success(
          "Registration successful! Please check your email for verification.",
        );
        return { success: true };
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

      if (response.data && response.data.data) {
        const userObj = response.data.data;
        userObj.token = userObj.token || response.data.data.token;

        localStorage.setItem("user", JSON.stringify(userObj));
        setUser(userObj);
        setupApiHeaders(userObj.token);

        toast.success("Login successful!");
        return { success: true };
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
    setupApiHeaders(null);
    toast.info("Logged out successfully");
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await api.put("/api/auth/profile", profileData);

      if (response.data && response.data.data) {
        const updatedUser = { ...user, ...response.data.data };
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

  // ✅ Fix: verifyEmail toast triggers only once
  // In AuthContext.js, modify verifyEmail function:
  const verifyEmail = async (code) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/auth/verify/${code}`);

      if (response.data && response.data.success) {
        // Update user verification status
        if (user && !user.isVerified) {
          const updatedUser = { ...user, isVerified: true };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
          toast.success("Email verified successfully!");
        }
        return { success: true };
      } else {
        toast.error(response.data?.message || "Verification failed");
        return { success: false, error: response.data?.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || "Verification failed";
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
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isVerified: user?.isVerified === true,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
