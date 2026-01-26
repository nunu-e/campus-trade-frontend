import { useEffect, useState } from "react";
import { Alert, Button, Card, Container, Spinner } from "react-bootstrap";
import { FaCheckCircle, FaEnvelope, FaExclamationCircle } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const VerifyEmail = () => {
  const { code } = useParams();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      if (!code) {
        setStatus("error");
        setMessage("No verification code provided");
        return;
      }

      try {
        const result = await verifyEmail(code);
        if (result.success) {
          setStatus("success");
          setMessage("Your email has been verified successfully!");
        } else {
          setStatus("error");
          setMessage(result.error || "Verification failed");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An error occurred during verification");
      }
    };

    verify();
  }, [code, verifyEmail]);

  const handleResendVerification = () => {
    // Implement resend verification logic
    console.log("Resend verification requested");
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
                    {message}
                  </Alert>
                  <div className="d-flex gap-2 justify-content-center">
                    <Button
                      variant="outline-primary"
                      onClick={handleResendVerification}
                    >
                      <FaEnvelope className="me-2" />
                      Resend Verification
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => navigate("/login")}
                    >
                      Go to Login
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
