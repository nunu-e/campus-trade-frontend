import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

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
      setUser(JSON.parse(storedUser));
      setupAxiosHeaders(JSON.parse(storedUser).token);
    }
    setLoading(false);
  }, []);

  const setupAxiosHeaders = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/auth/register", userData);

      if (response.data) {
        const userObj = {
          ...response.data,
          token: response.data.token,
        };

        localStorage.setItem("user", JSON.stringify(userObj));
        setUser(userObj);
        setupAxiosHeaders(userObj.token);

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
      const response = await axios.post("/api/auth/login", { email, password });

      if (response.data) {
        const userObj = {
          ...response.data,
          token: response.data.token,
        };

        localStorage.setItem("user", JSON.stringify(userObj));
        setUser(userObj);
        setupAxiosHeaders(userObj.token);

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
    setupAxiosHeaders(null);
    toast.info("Logged out successfully");
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await axios.put("/api/auth/profile", profileData);

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

  // ✅ Fix: verifyEmail toast triggers only once
  // In AuthContext.js, modify verifyEmail function:
  const verifyEmail = async (code) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/auth/verify/${code}`);

      if (response.data.success) {
        // Update user verification status
        if (user && !user.isVerified) {
          const updatedUser = { ...user, isVerified: true };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
          toast.success("Email verified successfully!");
        }
        return { success: true };
      } else {
        toast.error(response.data.message || "Verification failed");
        return { success: false, error: response.data.message };
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
    isVerified: user?.isVerified,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
