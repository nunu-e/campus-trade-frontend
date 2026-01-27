import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Tab,
  Tabs,
} from "react-bootstrap";
import { FaExchangeAlt } from "react-icons/fa";
import TransactionList from "../components/transactions/TransactionList";
import { transactionAPI } from "../services/api";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchTransactions();
  }, [activeTab]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionAPI.getMyTransactions();

      // transactionAPI returns response.data (array) or wrapped object
      let items = [];
      if (Array.isArray(data)) {
        items = data;
      } else if (data && Array.isArray(data.data)) {
        items = data.data;
      }

      if (items.length >= 0) {
        let filtered = items;
        if (activeTab !== "all") {
          filtered = filtered.filter((t) => t.status === activeTab);
        }
        setTransactions(filtered);
      } else {
        setError("No transactions data received");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to load transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const getTransactionStats = () => {
    const stats = {
      all: transactions.length,
      Completed: transactions.filter((t) => t.status === "Completed").length,
      Reserved: transactions.filter((t) => t.status === "Reserved").length,
      Initiated: transactions.filter((t) => t.status === "Initiated").length,
      Cancelled: transactions.filter((t) => t.status === "Cancelled").length,
    };

    return stats;
  };

  const stats = getTransactionStats();

  return (
    <Container fluid="lg" className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold d-flex align-items-center">
            <FaExchangeAlt className="me-3" /> My Transactions
          </h2>
          <p className="text-muted">Track your buying and selling activities</p>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="border-primary text-center">
            <Card.Body>
              <h3 className="text-primary mb-1">{stats.all}</h3>
              <p className="text-muted mb-0">Total</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="border-success text-center">
            <Card.Body>
              <h3 className="text-success mb-1">{stats.Completed}</h3>
              <p className="text-muted mb-0">Completed</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="border-warning text-center">
            <Card.Body>
              <h3 className="text-warning mb-1">{stats.Reserved}</h3>
              <p className="text-muted mb-0">Reserved</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="border-info text-center">
            <Card.Body>
              <h3 className="text-info mb-1">
                {stats.Initiated + stats.Cancelled}
              </h3>
              <p className="text-muted mb-0">Other</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <Card className="shadow-sm">
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            <Tab eventKey="all" title={`All (${stats.all})`}>
              <div className="mt-3">
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Loading transactions...</p>
                  </div>
                ) : error ? (
                  <Alert variant="danger">{error}</Alert>
                ) : (
                  <TransactionList
                    transactions={transactions}
                    emptyMessage="You don't have any transactions yet."
                  />
                )}
              </div>
            </Tab>

            <Tab eventKey="Completed" title={`Completed (${stats.Completed})`}>
              <div className="mt-3">
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  <TransactionList
                    transactions={transactions.filter(
                      (t) => t.status === "Completed",
                    )}
                    emptyMessage="No completed transactions yet."
                  />
                )}
              </div>
            </Tab>

            <Tab eventKey="Reserved" title={`Reserved (${stats.Reserved})`}>
              <div className="mt-3">
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  <TransactionList
                    transactions={transactions.filter(
                      (t) => t.status === "Reserved",
                    )}
                    emptyMessage="No reserved transactions."
                  />
                )}
              </div>
            </Tab>

            <Tab
              eventKey="Other"
              title={`Other (${stats.Initiated + stats.Cancelled})`}
            >
              <div className="mt-3">
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  <TransactionList
                    transactions={transactions.filter(
                      (t) =>
                        t.status === "Initiated" || t.status === "Cancelled",
                    )}
                    emptyMessage="No other transactions."
                  />
                )}
              </div>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TransactionsPage;
