import { Navigate } from "react-router-dom";
import AdminDashboard from "../components/admin/Dashboard";
import { useAuth } from "../context/AuthContext";

const AdminPage = () => {
  const { isAuthenticated, isVerified, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isVerified) {
    return <Navigate to="/profile" replace />;
  }

  return <AdminDashboard />;
};

export default AdminPage;
