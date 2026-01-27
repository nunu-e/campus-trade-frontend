// src/components/transactions/TransactionDetail.js
import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { transactionAPI } from "../../services/api";
import { formatPrice } from "../../utils/formatters";

const TransactionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  const fetchTransaction = async () => {
    try {
      setLoading(true);
      const response = await transactionAPI.getById(id);
      setTransaction(response.data);
    } catch (error) {
      console.error("Error fetching transaction:", error);
      setError("Failed to load transaction details");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsSold = async () => {
    if (
      !window.confirm(
        "Have you received payment from the buyer and delivered the item?",
      )
    )
      return;

    try {
      setUpdating(true);
      await transactionAPI.updateStatus(id, "Completed");
      await fetchTransaction();
      alert("Transaction marked as completed.");
    } catch (error) {
      console.error(error);
      setError("Failed to update transaction");
    } finally {
      setUpdating(false);
    }
  };

  const handleConfirmReceipt = async () => {
    if (
      !window.confirm(
        "Have you received the item and made payment to the seller?",
      )
    )
      return;

    try {
      setUpdating(true);
      await transactionAPI.complete(id);
      await fetchTransaction();
      alert("Transaction completed successfully.");
    } catch (error) {
      console.error(error);
      setError("Failed to complete transaction");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async () => {
    const reason = window.prompt("Please enter reason for cancellation:");
    if (!reason || !reason.trim()) return;

    try {
      setUpdating(true);
      await transactionAPI.cancelTransaction(id, reason);
      await fetchTransaction();
      alert("Transaction cancelled.");
    } catch (error) {
      console.error(error);
      setError("Failed to cancel transaction");
    } finally {
      setUpdating(false);
    }
  };

  const isSeller = transaction?.sellerId?._id === user?._id;
  const isBuyer = transaction?.buyerId?._id === user?._id;

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!transaction) {
    return (
      <Container>
        <Alert variant="danger">Transaction not found</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col lg={10}>
          <Card className="mb-4">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Transaction Details</h4>
              <Badge
                bg={
                  transaction.status === "Completed"
                    ? "success"
                    : transaction.status === "Cancelled"
                      ? "danger"
                      : "warning"
                }
              >
                {transaction.status}
              </Badge>
            </Card.Header>

            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}

              <Row className="mb-4">
                <Col md={6}>
                  <h5>Item Information</h5>
                  <p>
                    <strong>Listing:</strong>{" "}
                    <Link to={`/listing/${transaction.listingId?._id}`}>
                      {transaction.listingId?.title || "N/A"}
                    </Link>
                  </p>
                  <p>
                    <strong>Amount:</strong> {formatPrice(transaction.amount)}
                  </p>
                  <p>
                    <strong>Transaction ID:</strong> {transaction._id}
                  </p>
                </Col>

                <Col md={6}>
                  <h5>Party Information</h5>
                  <p>
                    <strong>Buyer:</strong> {transaction.buyerId?.name}
                  </p>
                  <p>
                    <strong>Seller:</strong> {transaction.sellerId?.name}
                  </p>
                </Col>
              </Row>

              <div className="d-flex justify-content-between mt-4">
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate(-1)}
                >
                  Back
                </Button>

                {transaction.status === "Reserved" && (
                  <>
                    {isSeller && (
                      <Button
                        variant="success"
                        onClick={handleMarkAsSold}
                        disabled={updating}
                        className="me-2"
                      >
                        Mark as Sold
                      </Button>
                    )}

                    {isBuyer && (
                      <Button
                        variant="success"
                        onClick={handleConfirmReceipt}
                        disabled={updating}
                        className="me-2"
                      >
                        Confirm Receipt
                      </Button>
                    )}

                    <Button
                      variant="danger"
                      onClick={handleCancel}
                      disabled={updating}
                    >
                      Cancel Transaction
                    </Button>
                  </>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TransactionDetail;
