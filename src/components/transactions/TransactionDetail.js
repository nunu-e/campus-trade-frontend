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
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  cancelTransaction,
  completeTransaction,
  getTransactionById,
  updateTransactionStatus,
} from "../../services/api";
import { formatPrice } from "../../utils/formatters";

const TransactionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  const fetchTransaction = async () => {
    try {
      setLoading(true);
      const response = await getTransactionById(id);
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
    ) {
      return;
    }

    try {
      setUpdating(true);
      await updateTransactionStatus(id, "Completed");
      fetchTransaction(); // Refresh data
      alert(
        "Transaction marked as completed. Funds will be considered transferred.",
      );
    } catch (error) {
      console.error("Error marking as sold:", error);
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
    ) {
      return;
    }

    try {
      setUpdating(true);
      await completeTransaction(id);
      fetchTransaction();
      alert("Transaction completed successfully.");
    } catch (error) {
      console.error("Error confirming receipt:", error);
      setError("Failed to complete transaction");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async () => {
    const reason = window.prompt("Please enter reason for cancellation:");
    if (!reason) return;

    try {
      setUpdating(true);
      await cancelTransaction(id, reason);
      fetchTransaction();
      alert("Transaction cancelled.");
    } catch (error) {
      console.error("Error cancelling transaction:", error);
      setError("Failed to cancel transaction");
    } finally {
      setUpdating(false);
    }
  };

  const isSeller = transaction && transaction.sellerId._id === userInfo._id;
  const isBuyer = transaction && transaction.buyerId._id === userInfo._id;

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
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

              {/* Transaction Info */}
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
                  <p>
                    <strong>Created:</strong>{" "}
                    {new Date(transaction.createdAt).toLocaleString()}
                  </p>
                </Col>

                <Col md={6}>
                  <h5>Party Information</h5>
                  <p>
                    <strong>Buyer:</strong> {transaction.buyerId.name}
                  </p>
                  <p>
                    <strong>Buyer Email:</strong> {transaction.buyerId.email}
                  </p>
                  <p>
                    <strong>Seller:</strong> {transaction.sellerId.name}
                  </p>
                  <p>
                    <strong>Seller Email:</strong> {transaction.sellerId.email}
                  </p>
                </Col>
              </Row>

              {/* Status Information */}
              <Alert variant="info">
                <h5>
                  <i className="fas fa-info-circle me-2"></i>
                  Transaction Status: {transaction.status}
                </h5>
                {transaction.status === "Reserved" && (
                  <p className="mb-0">
                    The item is reserved for you. Please contact the seller via
                    the messaging system to arrange payment and pickup. Once
                    payment is complete, the seller will mark the transaction as
                    completed.
                  </p>
                )}
                {transaction.status === "Completed" && (
                  <p className="mb-0">
                    This transaction has been completed. Please leave feedback
                    for the other party.
                  </p>
                )}
                {transaction.status === "Cancelled" && (
                  <p className="mb-0">
                    This transaction has been cancelled.{" "}
                    {transaction.cancellationReason &&
                      `Reason: ${transaction.cancellationReason}`}
                  </p>
                )}
              </Alert>

              {/* Action Buttons */}
              <div className="d-flex justify-content-between mt-4">
                <div>
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </Button>
                </div>

                <div>
                  {/* Messaging Button */}
                  <Button
                    variant="outline-primary"
                    className="me-2"
                    onClick={() => {
                      const otherUserId = isSeller
                        ? transaction.buyerId._id
                        : transaction.sellerId._id;
                      navigate(`/messages/${otherUserId}`);
                    }}
                  >
                    <i className="fas fa-comments me-2"></i>
                    Message {isSeller ? "Buyer" : "Seller"}
                  </Button>

                  {/* Status-specific actions */}
                  {transaction.status === "Reserved" && (
                    <>
                      {isSeller && (
                        <Button
                          variant="success"
                          onClick={handleMarkAsSold}
                          disabled={updating}
                          className="me-2"
                        >
                          {updating ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                              />
                              Updating...
                            </>
                          ) : (
                            "Mark as Sold & Received Payment"
                          )}
                        </Button>
                      )}

                      {isBuyer && (
                        <Button
                          variant="success"
                          onClick={handleConfirmReceipt}
                          disabled={updating}
                          className="me-2"
                        >
                          {updating ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                              />
                              Updating...
                            </>
                          ) : (
                            "Confirm Item Received"
                          )}
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
              </div>
            </Card.Body>
          </Card>

          {/* Instructions Card */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">Transaction Instructions</h5>
            </Card.Header>
            <Card.Body>
              <ol>
                <li className="mb-2">
                  <strong>Communication:</strong> Use the messaging system to
                  discuss meeting details, item condition, and payment
                  arrangement.
                </li>
                <li className="mb-2">
                  <strong>Meeting:</strong> Arrange to meet in a public campus
                  location during daylight hours.
                </li>
                <li className="mb-2">
                  <strong>Inspection:</strong> Inspect the item thoroughly
                  before making payment.
                </li>
                <li className="mb-2">
                  <strong>Payment:</strong> Complete payment offline (cash or
                  mobile money as agreed).
                </li>
                <li className="mb-2">
                  <strong>Confirmation:</strong>
                  {isSeller
                    ? " After receiving payment, mark the transaction as completed."
                    : " After receiving the item, confirm receipt in the system."}
                </li>
                <li className="mb-2">
                  <strong>Feedback:</strong> Leave feedback for the other party
                  to build community trust.
                </li>
              </ol>

              <Alert variant="warning" className="mt-3">
                <i className="fas fa-exclamation-triangle me-2"></i>
                <strong>Safety First:</strong> Never share personal information
                unnecessarily. Report any suspicious behavior to campus security
                and use the platform's reporting feature.
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TransactionDetail;
