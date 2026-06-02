import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Optional: Create an axios instance with base URL
// If you have a proxy in package.json, you can use plain axios.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5001",
  headers: { "Content-Type": "application/json" },
});

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get email from navigation state or localStorage
    const storedEmail =
      location.state?.email || localStorage.getItem("pendingVerificationEmail");
    if (storedEmail) {
      setEmail(storedEmail);
      localStorage.setItem("pendingVerificationEmail", storedEmail);
    } else {
      navigate("/register");
    }

    // Start 60-second cooldown for resend button
    setTimeLeft(60);
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [location, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log(`Verifying OTP for ${email}: ${otp}`);
      const response = await api.post("/api/auth/verify-otp", { email, otp });

      if (response.data.success) {
        // Store token and user info only after successful verification
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.removeItem("pendingVerificationEmail");

        toast.success("Email verified successfully! You are now logged in.");
        navigate("/profile");
      } else {
        setError(response.data.message || "Verification failed");
        toast.error(response.data.message || "Verification failed");
      }
    } catch (err) {
      console.error("Verification error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Verification failed. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);

      // If the server returned a 500, also log the full error for debugging
      if (err.response?.status === 500) {
        console.error("Server error details:", err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendLoading || timeLeft > 0) return;

    setResendLoading(true);
    try {
      const response = await api.post("/api/auth/send-otp", { email });
      if (response.data.success) {
        toast.success("Verification code resent. Check your email.");
        setTimeLeft(60);

        // Restart the countdown timer
        let timer = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) clearInterval(timer);
            return prev > 0 ? prev - 1 : 0;
          });
        }, 1000);
      } else {
        toast.error(response.data.message || "Failed to resend code");
      }
    } catch (err) {
      console.error("Resend error:", err);
      toast.error("Failed to resend code. Please try again later.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Verify Your Email</h2>
              <p className="text-muted text-center">
                We've sent a 6-digit verification code to{" "}
                <strong>{email}</strong>
              </p>
              <form onSubmit={handleVerify}>
                <div className="mb-3">
                  <label className="form-label">Verification Code</label>
                  <input
                    type="text"
                    className={`form-control form-control-lg text-center ${error ? "is-invalid" : ""}`}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    autoFocus
                  />
                  {error && <div className="invalid-feedback">{error}</div>}
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify Email"}
                </button>
              </form>
              <div className="text-center mt-3">
                <button
                  className="btn btn-link"
                  onClick={handleResend}
                  disabled={resendLoading || timeLeft > 0}
                >
                  {resendLoading
                    ? "Sending..."
                    : timeLeft > 0
                      ? `Resend code in ${timeLeft}s`
                      : "Resend verification code"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
