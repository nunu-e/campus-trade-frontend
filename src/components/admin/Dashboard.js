import { useEffect, useState } from "react";
import { Card, Col, Container, Row, Spinner, Table } from "react-bootstrap";
import {
  FaChartLine,
  FaExchangeAlt,
  FaExclamationTriangle,
  FaShoppingCart,
  FaUsers,
} from "react-icons/fa";
import { adminAPI } from "../../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getStats();
      setStats(response.data.overview);
      setRecentActivities(response.data.recentActivities);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading dashboard...</p>
      </Container>
    );
  }

  return (
    <Container fluid="lg">
      <h2 className="fw-bold mb-4">Admin Dashboard</h2>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="border-primary">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="bg-primary text-white rounded-circle p-3 me-3">
                  <FaUsers size={24} />
                </div>
                <div>
                  <h3 className="mb-0">{stats?.totalUsers || 0}</h3>
                  <small className="text-muted">Total Users</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="border-success">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="bg-success text-white rounded-circle p-3 me-3">
                  <FaShoppingCart size={24} />
                </div>
                <div>
                  <h3 className="mb-0">{stats?.activeListings || 0}</h3>
                  <small className="text-muted">Active Listings</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="border-warning">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="bg-warning text-white rounded-circle p-3 me-3">
                  <FaExchangeAlt size={24} />
                </div>
                <div>
                  <h3 className="mb-0">{stats?.completedTransactions || 0}</h3>
                  <small className="text-muted">Completed Transactions</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-3">
          <Card className="border-danger">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="bg-danger text-white rounded-circle p-3 me-3">
                  <FaExclamationTriangle size={24} />
                </div>
                <div>
                  <h3 className="mb-0">{stats?.pendingReports || 0}</h3>
                  <small className="text-muted">Pending Reports</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activities */}
      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header className="bg-white">
              <h5 className="mb-0 d-flex align-items-center">
                <FaUsers className="me-2" /> Recent Users
              </h5>
            </Card.Header>
            <Card.Body>
              <Table hover size="sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities?.users?.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Header className="bg-white">
              <h5 className="mb-0 d-flex align-items-center">
                <FaShoppingCart className="me-2" /> Recent Listings
              </h5>
            </Card.Header>
            <Card.Body>
              <Table hover size="sm">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities?.listings?.map((listing) => (
                    <tr key={listing._id}>
                      <td>{listing.title}</td>
                      <td>ETB {listing.price}</td>
                      <td>
                        <span
                          className={`badge bg-${listing.status === "Available" ? "success" : "warning"}`}
                        >
                          {listing.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Transactions */}
      <Row>
        <Col>
          <Card>
            <Card.Header className="bg-white">
              <h5 className="mb-0 d-flex align-items-center">
                <FaChartLine className="me-2" /> Recent Transactions
              </h5>
            </Card.Header>
            <Card.Body>
              <Table hover>
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Buyer</th>
                    <th>Seller</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities?.transactions?.map((transaction) => (
                    <tr key={transaction._id}>
                      <td>{transaction._id.substring(0, 8)}...</td>
                      <td>{transaction.buyerId?.name}</td>
                      <td>{transaction.sellerId?.name}</td>
                      <td>ETB {transaction.amount}</td>
                      <td>
                        <span
                          className={`badge bg-${transaction.status === "Completed" ? "success" : "warning"}`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
