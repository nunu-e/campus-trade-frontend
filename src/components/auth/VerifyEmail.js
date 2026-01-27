import { useEffect, useState } from "react";
import { Alert, Button, Card, Container, Form, Spinner } from "react-bootstrap";
import { FaCheckCircle, FaEnvelope, FaExclamationCircle } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const VerifyEmail = () => {
  const { code } = useParams();
  const [status, setStatus] = useState(code ? "verifying" : "idle");
  const [message, setMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resending, setResending] = useState(false);
  const { verifyEmail, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const verify = async () => {
      if (!code) {
        setStatus("error");
        setMessage("No verification code provided");
        return;
      }

      try {
        const result = await verifyEmail(code);
        if (!isMounted) return;

        if (result.success) {
          setStatus("success");
          setMessage("Your email has been verified successfully!");
        } else {
          setStatus("error");
          setMessage(result.error || "Verification failed");
        }
      } catch (error) {
        if (!isMounted) return;
        setStatus("error");
        setMessage("An error occurred during verification");
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [code, verifyEmail]);

  const handleResendVerification = async (e) => {
    e?.preventDefault();
    
    const emailToUse = resendEmail || user?.email || "";
    
    if (!emailToUse) {
      toast.error("Please enter your email address");
      return;
    }

    setResending(true);
    try {
      const response = await api.post("/api/auth/resend-verification", {
        email: emailToUse,
      });

      if (response.data.success) {
        toast.success(response.data.message || "Verification email sent successfully!");
        setMessage("Verification email sent! Please check your inbox.");
        if (response.data.verificationLink) {
          console.log("Development mode - Verification link:", response.data.verificationLink);
          alert(`Development Mode - Verification Link:\n${response.data.verificationLink}`);
        }
      } else {
        toast.error(response.data.message || "Failed to send verification email");
        setMessage(response.data.message || "Failed to send verification email");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to resend verification email";
      toast.error(errorMessage);
      setMessage(errorMessage);
    } finally {
      setResending(false);
    }
  };

  return (
    <Container className="py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <Card className="shadow">
            <Card.Header className="bg-primary text-white text-center">
              <h4 className="mb-0">Email Verification</h4>
            </Card.Header>
            <Card.Body className="text-center py-5">
              {status === "verifying" && (
                <>
                  <Spinner
                    animation="border"
                    variant="primary"
                    className="mb-3"
                  />
                  <h5>Verifying your email...</h5>
                  <p className="text-muted">
                    Please wait while we verify your AAU email address.
                  </p>
                </>
              )}

              {status === "success" && (
                <>
                  <div className="text-success mb-3">
                    <FaCheckCircle size={64} />
                  </div>
                  <h5>Verification Successful!</h5>
                  <p className="text-muted mb-4">
                    Your AAU email address has been verified. You can now access
                    all features of CampusTrade.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => navigate("/marketplace")}
                    className="px-4"
                  >
                    Go to Marketplace
                  </Button>
                </>
              )}

              {status === "error" && (
                <>
                  <div className="text-danger mb-3">
                    <FaExclamationCircle size={64} />
                  </div>
                  <h5>Verification Failed</h5>
                  <Alert variant="danger" className="mb-4">
                    {message || "Invalid or expired verification code"}
                  </Alert>
                  
                  <div className="mb-4">
                    <h6>Didn't receive the email?</h6>
                    <Form onSubmit={handleResendVerification}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter your email"
                          value={resendEmail}
                          onChange={(e) => setResendEmail(e.target.value)}
                          defaultValue={user?.email || ""}
                          required
                        />
                      </Form.Group>
                      <Button
                        type="submit"
                        variant="outline-primary"
                        disabled={resending}
                        className="w-100"
                      >
                        {resending ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <FaEnvelope className="me-2" />
                            Resend Verification Email
                          </>
                        )}
                      </Button>
                    </Form>
                  </div>
                  
                  <div className="d-flex gap-2 justify-content-center">
                    <Button
                      variant="primary"
                      onClick={() => navigate("/login")}
                    >
                      Go to Login
                    </Button>
                  </div>
                </>
              )}

              {status === "idle" && (
                <>
                  <div className="text-primary mb-3">
                    <FaEnvelope size={64} />
                  </div>
                  <h5>Resend Verification Email</h5>
                  <p className="text-muted mb-4">
                    Enter your email address to receive a new verification link.
                  </p>
                  <Form onSubmit={handleResendVerification} className="text-start">
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={resendEmail}
                        onChange={(e) => setResendEmail(e.target.value)}
                        defaultValue={user?.email || ""}
                        required
                      />
                    </Form.Group>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={resending}
                      className="w-100"
                    >
                      {resending ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <FaEnvelope className="me-2" />
                          Send Verification Email
                        </>
                      )}
                    </Button>
                  </Form>
                  <div className="mt-3">
                    <Button
                      variant="link"
                      onClick={() => navigate("/login")}
                      className="text-decoration-none"
                    >
                      Back to Login
                    </Button>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default VerifyEmail;
