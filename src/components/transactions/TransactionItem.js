import { Badge, Button, Card } from "react-bootstrap";
import {
  FaCalendar,
  FaCheckCircle,
  FaExchangeAlt,
  FaTimesCircle,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatters";

const TransactionItem = ({ transaction, currentUserId }) => {
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
      <Badge bg={variants[transaction.status]}>
        {icons[transaction.status] || <FaExchangeAlt className="me-1" />}
        {transaction.status}
      </Badge>
    );
  };

  const formatDate = (date) => new Date(date).toLocaleDateString();

  const isBuyer = transaction.buyerId?._id === currentUserId;

  const otherUserName = isBuyer
    ? transaction.sellerId?.name
    : transaction.buyerId?.name;

  const role = isBuyer ? "Seller" : "Buyer";

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between mb-3">
          <div>
            <h6>{transaction.listingId?.title}</h6>
            <small className="text-muted">
              #{transaction._id.substring(0, 8)}
            </small>
          </div>
          {getStatusBadge()}
        </div>

        <div className="mb-3">
          <div className="text-muted small">
            <FaUser className="me-2" />
            {role}: {otherUserName}
          </div>
          <div className="text-muted small">
            <FaCalendar className="me-2" />
            {formatDate(transaction.createdAt)}
          </div>
        </div>

        <h5 className="text-primary">{formatPrice(transaction.amount)}</h5>

        <Button
          as={Link}
          to={`/transactions/${transaction._id}`}
          variant="outline-primary"
          size="sm"
          className="w-100 mt-3"
        >
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
};

export default TransactionItem;
