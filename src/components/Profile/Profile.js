import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Row,
  Spinner,
  Tab,
  Tabs,
} from "react-bootstrap";
import {
  FaCalendar,
  FaEdit,
  FaEnvelope,
  FaPhone,
  FaShoppingCart,
  FaStar,
  FaUniversity,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { reviewAPI, userAPI } from "../../services/api";
import MyListings from "./MyListings";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchReviews();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getById(user._id);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewAPI.getForUser(user._id);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Alert variant="warning" className="text-center">
        <h5>Not Logged In</h5>
        <p>Please login to view your profile</p>
        <Button as={Link} to="/login" variant="primary">
          Login
        </Button>
      </Alert>
    );
  }

  return (
    <div className="py-4">
      {/* Profile Header */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={3} className="text-center mb-3 mb-md-0">
              <div
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto"
                style={{ width: "120px", height: "120px" }}
              >
                <FaUser size={48} />
              </div>
            </Col>

            <Col md={9}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h2 className="mb-1">{user.name}</h2>
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <Badge bg={user.role === "admin" ? "primary" : "secondary"}>
                      {user.role}
                    </Badge>
                    <Badge
                      bg={user.status === "active" ? "success" : "warning"}
                    >
                      {user.status}
                    </Badge>
                    {user.isVerified ? (
                      <Badge bg="success">
                        <FaStar className="me-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge bg="warning">Unverified</Badge>
                    )}
                  </div>

                  <div className="row mt-3">
                    <Col md={6}>
                      <p className="mb-2">
                        <FaEnvelope className="me-2 text-muted" />
                        {user.email}
                      </p>
                      {user.phoneNumber && (
                        <p className="mb-2">
                          <FaPhone className="me-2 text-muted" />
                          {user.phoneNumber}
                        </p>
                      )}
                    </Col>
                    <Col md={6}>
                      <p className="mb-2">
                        <FaUniversity className="me-2 text-muted" />
                        {user.department}
                      </p>
                      <p className="mb-2">
                        <FaCalendar className="me-2 text-muted" />
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </Col>
                  </div>
                </div>

                <Button
                  as={Link}
                  to="/profile/edit"
                  variant="outline-primary"
                  size="sm"
                  className="d-flex align-items-center"
                >
                  <FaEdit className="me-2" />
                  Edit Profile
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Stats Row */}
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <div className="text-primary mb-2">
                <FaShoppingCart size={32} />
              </div>
              <h3 className="mb-1">{profile?.totalListings || 0}</h3>
              <p className="text-muted mb-0">Total Listings</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <div className="text-warning mb-2">
                <FaStar size={32} />
              </div>
              <h3 className="mb-1">{calculateAverageRating()}</h3>
              <p className="text-muted mb-0">Average Rating</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card className="text-center h-100">
            <Card.Body>
              <div className="text-success mb-2">
                <FaShoppingCart size={32} />
              </div>
              <h3 className="mb-1">{reviews.length}</h3>
              <p className="text-muted mb-0">Total Reviews</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="profile" title="Profile Details">
          <Card>
            <Card.Body>
              <h5 className="mb-3">Account Information</h5>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="text-muted small">Full Name</label>
                    <p className="mb-0">{user.name}</p>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small">Email Address</label>
                    <p className="mb-0">{user.email}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <label className="text-muted small">Department</label>
                    <p className="mb-0">{user.department}</p>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small">Student ID</label>
                    <p className="mb-0">{user.studentID}</p>
                  </div>
                </Col>
              </Row>

              <div className="mt-4">
                <h5 className="mb-3">Account Status</h5>
                <Row>
                  <Col md={4}>
                    <div className="mb-2">
                      <Badge
                        bg={user.isVerified ? "success" : "warning"}
                        className="w-100"
                      >
                        {user.isVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-2">
                      <Badge
                        bg={user.status === "active" ? "success" : "warning"}
                        className="w-100"
                      >
                        {user.status}
                      </Badge>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="mb-2">
                      <Badge
                        bg={user.role === "admin" ? "primary" : "secondary"}
                        className="w-100"
                      >
                        {user.role}
                      </Badge>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="listings" title="My Listings">
          <MyListings />
        </Tab>

        <Tab eventKey="reviews" title="Reviews">
          <Card>
            <Card.Body>
              <h5 className="mb-3">Reviews Received</h5>
              {reviews.length === 0 ? (
                <Alert variant="info">
                  No reviews yet. Complete transactions to receive reviews.
                </Alert>
              ) : (
                reviews.map((review) => (
                  <Card key={review._id} className="mb-3">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="mb-0">{review.reviewerId?.name}</h6>
                          <small className="text-muted">
                            {review.type === "BuyerToSeller"
                              ? "Buyer"
                              : "Seller"}
                          </small>
                        </div>
                        <div className="d-flex align-items-center">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={
                                i < review.rating
                                  ? "text-warning"
                                  : "text-muted"
                              }
                            />
                          ))}
                          <span className="ms-2">{review.rating}.0</span>
                        </div>
                      </div>

                      <p className="mb-2">{review.comment}</p>

                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          For: {review.listingId?.title}
                        </small>
                        <small className="text-muted">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                    </Card.Body>
                  </Card>
                ))
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Profile;
