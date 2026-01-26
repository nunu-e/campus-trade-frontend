import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import { MessageProvider } from "./context/MessageContext";

// Components
import Footer from "./components/common/Footer";
import Header from "./components/common/Header";

// Pages
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import ListingPage from "./pages/ListingPage";
import LoginPage from "./pages/LoginPage";
import MarketplacePage from "./pages/MarketplacePage";
import MessagesPage from "./pages/MessagesPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import TransactionsPage from "./pages/TransactionsPage";

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.token) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

const VerifiedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.token) {
    return <Navigate to="/login" />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" />;
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

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin={true}>
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
