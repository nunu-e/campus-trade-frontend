import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { MessageProvider } from "./context/MessageContext";

// Components
import VerifyEmail from "./components/auth/VerifyEmail";
import Footer from "./components/common/Footer";
import Header from "./components/common/Header";

// Pages
import TransactionDetail from "./components/transactions/TransactionDetail";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import ListingPage from "./pages/ListingPage";
import LoginPage from "./pages/LoginPage";
import MarketplacePage from "./pages/MarketplacePage";
import MessagesPage from "./pages/MessagesPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import TransactionsPage from "./pages/TransactionsPage";

// ✅ Protected Route (auth only)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ✅ Verified Route (auth + email verified)
const VerifiedRoute = ({ children }) => {
  const { isAuthenticated, isVerified, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isVerified) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <MessageProvider>
        <Router>
          <div className="app-container d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/listing/:id" element={<ListingPage />} />
                <Route path="/verify/:code" element={<VerifyEmail />} />

                <Route
                  path="/transactions/:id"
                  element={
                    <VerifiedRoute>
                      <TransactionDetail />
                    </VerifiedRoute>
                  }
                />

                <Route
                  path="/messages"
                  element={
                    <VerifiedRoute>
                      <MessagesPage />
                    </VerifiedRoute>
                  }
                />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/transactions"
                  element={
                    <VerifiedRoute>
                      <TransactionsPage />
                    </VerifiedRoute>
                  }
                />

                {/* ✅ AdminPage handles its own protection */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
            <ToastContainer position="top-right" autoClose={3000} />
          </div>
        </Router>
      </MessageProvider>
    </AuthProvider>
  );
}

export default App;
