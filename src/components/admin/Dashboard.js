import { useEffect, useState } from "react";
import {
  Alert,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import {
  FaChartLine,
  FaExchangeAlt,
  FaExclamationTriangle,
  FaShoppingCart,
  FaUsers,
} from "react-icons/fa";
import { listingAPI, transactionAPI, userAPI } from "../../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState({
    users: [],
    listings: [],
    transactions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch data from multiple endpoints
      const [usersResponse, listingsResponse, transactionsResponse] =
        await Promise.all([
          userAPI.getUsers({ limit: 5 }),
          listingAPI.getAll({ limit: 5 }),
          transactionAPI.getMyTransactions(),
        ]);

      // Calculate stats from the data
      const totalUsers = usersResponse.data?.length || 0;
      const totalListings = listingsResponse.data?.listings?.length || 0;
      const totalTransactions = transactionsResponse.data?.length || 0;

      setStats({
        totalUsers,
        totalListings,
        totalTransactions,
        // These would come from a dedicated stats endpoint in production
        activeListings: totalListings,
        completedTransactions:
          transactionsResponse.data?.filter((t) => t.status === "Completed")
            .length || 0,
        pendingReports: 0, // Would come from reports API
      });

      setRecentActivities({
        users: usersResponse.data?.slice(0, 5) || [],
        listings: listingsResponse.data?.listings?.slice(0, 5) || [],
        transactions: transactionsResponse.data?.slice(0, 5) || [],
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
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

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
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
                  <h3 className="mb-0">{stats?.totalListings || 0}</h3>
                  <small className="text-muted">Total Listings</small>
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
                  <h3 className="mb-0">{stats?.totalTransactions || 0}</h3>
                  <small className="text-muted">Total Transactions</small>
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
              {recentActivities.users.length > 0 ? (
                <Table hover size="sm">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivities.users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted text-center mb-0">No users yet</p>
              )}
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
              {recentActivities.listings.length > 0 ? (
                <Table hover size="sm">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Price</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivities.listings.map((listing) => (
                      <tr key={listing._id}>
                        <td
                          className="text-truncate"
                          style={{ maxWidth: "150px" }}
                          title={listing.title}
                        >
                          {listing.title}
                        </td>
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
              ) : (
                <p className="text-muted text-center mb-0">No listings yet</p>
              )}
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
              {recentActivities.transactions.length > 0 ? (
                <Table hover>
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivities.transactions.map((transaction) => (
                      <tr key={transaction._id}>
                        <td>{transaction._id.substring(0, 8)}...</td>
                        <td>ETB {transaction.amount}</td>
                        <td>
                          <span
                            className={`badge bg-${transaction.status === "Completed" ? "success" : "warning"}`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                        <td>
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted text-center mb-0">
                  No transactions yet
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
