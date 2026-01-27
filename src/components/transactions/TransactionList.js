import { Alert, Col, Row, Spinner } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import TransactionItem from "./TransactionItem";

const TransactionList = ({
  transactions = [],
  loading,
  error,
  emptyMessage,
}) => {
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        {error}
      </Alert>
    );
  }

  if (transactions.length === 0) {
    return (
      <Alert variant="info" className="text-center">
        {emptyMessage || "No transactions yet"}
      </Alert>
    );
  }

  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {transactions.map((transaction) => (
        <Col key={transaction._id}>
          <TransactionItem
            transaction={transaction}
            currentUserId={user?._id}
          />
        </Col>
      ))}
    </Row>
  );
};

export default TransactionList;
