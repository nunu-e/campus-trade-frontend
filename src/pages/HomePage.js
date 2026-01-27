import { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import {
  FaComment,
  FaHandshake,
  FaSearch,
  FaShieldAlt,
  FaShoppingCart,
  FaUniversity,
  FaUserFriends,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { listingAPI } from "../services/api";

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await listingAPI.getAll({ limit: 1 });
      setStats({ activeListings: response.data.total || 0 });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <FaShoppingCart size={40} />,
      title: "Buy & Sell",
      description:
        "Find textbooks, electronics, dorm essentials and more from fellow AAU students.",
    },
    {
      icon: <FaHandshake size={40} />,
      title: "Services",
      description:
        "Offer or book tutoring, writing assistance, graphic design, and other student services.",
    },
    {
      icon: <FaShieldAlt size={40} />,
      title: "Verified Users",
      description:
        "All users are verified with their official AAU email address (@aau.edu.et).",
    },
    {
      icon: <FaUserFriends size={40} />,
      title: "Student Community",
      description:
        "Connect with other AAU students in a safe and trusted campus marketplace.",
    },
    {
      icon: <FaSearch size={40} />,
      title: "Easy Search",
      description:
        "Find exactly what you need with advanced filtering and search capabilities.",
    },
    {
      icon: <FaComment size={40} />,
      title: "Secure Messaging",
      description:
        "Communicate safely within the platform without sharing personal contact details.",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-4 fw-bold mb-4">
                Welcome to <span className="text-warning">CampusTrade</span>
              </h1>
              <p className="lead mb-4">
                AAU's official student-to-student marketplace. Buy, sell, rent,
                and exchange goods and services within our secure campus
                community.
              </p>
              <div className="d-flex gap-3">
                {isAuthenticated ? (
                  <>
                    <Button
                      as={Link}
                      to="/marketplace"
                      variant="light"
                      size="lg"
                      className="px-4"
                    >
                      Browse Marketplace
                    </Button>
                    <Button
                      as={Link}
                      to="/profile/listings/new"
                      variant="outline-light"
                      size="lg"
                      className="px-4"
                    >
                      Sell Something
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      as={Link}
                      to="/register"
                      variant="light"
                      size="lg"
                      className="px-4"
                    >
                      Join Now
                    </Button>
                    <Button
                      as={Link}
                      to="/login"
                      variant="outline-light"
                      size="lg"
                      className="px-4"
                    >
                      Login
                    </Button>
                  </>
                )}
              </div>
              <div className="mt-4">
                <Badge bg="light" text="dark" className="me-2 p-2">
                  <FaShieldAlt className="me-1" /> AAU Verified Only
                </Badge>
                <Badge bg="light" text="dark" className="me-2 p-2">
                  <FaHandshake className="me-1" /> Secure Transactions
                </Badge>
                <Badge bg="light" text="dark" className="p-2">
                  <FaUserFriends className="me-1" /> Campus Community
                </Badge>
              </div>
            </Col>
            <Col lg={6} className="mt-4 mt-lg-0">
              <div className="bg-white text-dark rounded p-4 shadow">
                <h4 className="text-primary mb-3">
                  <FaUniversity className="me-2" /> Exclusively for AAU Students
                </h4>
                <p className="mb-3">
                  CampusTrade is a verified marketplace platform designed
                  specifically for Addis Ababa University students.
                </p>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <FaShieldAlt className="text-success me-2" /> Secure
                    @aau.edu.et email verification
                  </li>
                  <li className="mb-2">
                    <FaUserFriends className="text-primary me-2" /> Connect with
                    fellow AAU students
                  </li>
                  <li>
                    <FaHandshake className="text-warning me-2" /> Safe and
                    reliable transactions
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <h2 className="text-center mb-5">Why Choose CampusTrade?</h2>
        <Row>
          {features.map((feature, index) => (
            <Col md={6} lg={4} key={index} className="mb-4">
              <Card className="h-100 shadow-sm border-0 text-center">
                <Card.Body className="p-4">
                  <div className="text-primary mb-3">{feature.icon}</div>
                  <Card.Title className="h5">{feature.title}</Card.Title>
                  <Card.Text className="text-muted">
                    {feature.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* CTA Section */}
      <Container className="py-5 text-center">
        <h2 className="mb-4">Ready to Get Started?</h2>
        <p className="lead mb-4">
          Join the AAU student community and start trading on CampusTrade.
        </p>
        {isAuthenticated ? (
          <div>
            <p className="text-muted mb-4">
              Welcome back, {user?.name}! What would you like to do today?
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Button as={Link} to="/marketplace" variant="primary" size="lg">
                Browse Marketplace
              </Button>
              <Button
                as={Link}
                to="/profile/listings/new"
                variant="outline-primary"
                size="lg"
              >
                Create Listing
              </Button>
            </div>
          </div>
        ) : (
          <div className="d-flex justify-content-center gap-3">
            <Button
              as={Link}
              to="/register"
              variant="primary"
              size="lg"
              className="px-5"
            >
              Register Now
            </Button>
            <Button
              as={Link}
              to="/marketplace"
              variant="outline-primary"
              size="lg"
              className="px-5"
            >
              Browse Listings
            </Button>
          </div>
        )}
      </Container>

      {/* Stats Section */}
      {!loading && stats && stats.activeListings > 0 && (
        <div className="bg-dark text-white py-4">
          <Container>
            <Row className="text-center">
              <Col md={4} className="mb-3 mb-md-0">
                <h3 className="fw-bold text-warning">
                  {stats.activeListings}+
                </h3>
                <p className="mb-0">Active Listings</p>
              </Col>
              <Col md={4} className="mb-3 mb-md-0">
                <h3 className="fw-bold text-warning">AAU</h3>
                <p className="mb-0">Verified Students Only</p>
              </Col>
              <Col md={4}>
                <h3 className="fw-bold text-warning">100%</h3>
                <p className="mb-0">Secure Platform</p>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
};

export default HomePage;
