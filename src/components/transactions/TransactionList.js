import { Alert, Col, Row } from "react-bootstrap";
import TransactionItem from "./TransactionItem";

const TransactionList = ({ transactions, loading, error, emptyMessage }) => {
  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        <h5>Error Loading Transactions</h5>
        <p>{error}</p>
      </Alert>
    );
  }

  if (!loading && transactions.length === 0) {
    return (
      <Alert variant="info" className="text-center">
        <h5>No Transactions Yet</h5>
        <p>{emptyMessage || "You haven't made any transactions yet."}</p>
      </Alert>
    );
  }

  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {transactions.map((transaction) => (
        <Col key={transaction._id}>
          <TransactionItem transaction={transaction} />
        </Col>
      ))}
    </Row>
  );
};

export default TransactionList;
