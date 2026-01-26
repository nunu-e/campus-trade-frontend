import { Badge, Button, Card } from "react-bootstrap";
import {
  FaCalendar,
  FaCheckCircle,
  FaExchangeAlt,
  FaTimesCircle,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const TransactionItem = ({ transaction }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("et-ET", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = () => {
    const variants = {
      Initiated: "info",
      Reserved: "warning",
      Completed: "success",
      Cancelled: "danger",
    };

    const icons = {
      Completed: <FaCheckCircle className="me-1" />,
      Cancelled: <FaTimesCircle className="me-1" />,
    };

    return (
      <Badge
        bg={variants[transaction.status]}
        className="d-flex align-items-center"
      >
        {icons[transaction.status] || <FaExchangeAlt className="me-1" />}
        {transaction.status}
      </Badge>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRoleInfo = (isSeller) => {
    const otherUser = isSeller ? transaction.buyerId : transaction.sellerId;
    const role = isSeller ? "Buyer" : "Seller";

    return {
      user: otherUser,
      role: role,
      verb: isSeller ? "sold to" : "bought from",
    };
  };

  const isSeller =
    transaction.sellerId._id === JSON.parse(localStorage.getItem("user"))?._id;
  const roleInfo = getRoleInfo(isSeller);

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h6 className="mb-1">
              {transaction.listingId?.title || "Listing"}
            </h6>
            <p className="text-muted small mb-0">
              Transaction #{transaction._id.substring(0, 8)}
            </p>
          </div>
          {getStatusBadge()}
        </div>

        <div className="mb-3">
          <div className="d-flex align-items-center text-muted small mb-2">
            <FaUser className="me-2" />
            <span>
              {roleInfo.role}: {roleInfo.user?.name}
            </span>
          </div>

          <div className="d-flex align-items-center text-muted small">
            <FaCalendar className="me-2" />
            <span>{formatDate(transaction.createdAt)}</span>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="text-primary mb-0">
              {formatPrice(transaction.amount)}
            </h5>
            <small className="text-muted">Total amount</small>
          </div>

          {transaction.paymentStatus && (
            <div>
              <Badge
                bg={
                  transaction.paymentStatus === "Completed"
                    ? "success"
                    : "warning"
                }
              >
                {transaction.paymentStatus}
              </Badge>
            </div>
          )}
        </div>

        <div className="mt-auto">
          <Button
            as={Link}
            to={`/transactions/${transaction._id}`}
            variant="outline-primary"
            size="sm"
            className="w-100"
          >
            View Details
          </Button>
        </div>
      </Card.Body>

      <Card.Footer className="bg-white border-top-0 pt-0">
        <small className="text-muted d-flex justify-content-between">
          <span>{isSeller ? "You sold" : "You bought"} this item</span>
        </small>
      </Card.Footer>
    </Card>
  );
};

export default TransactionItem;
