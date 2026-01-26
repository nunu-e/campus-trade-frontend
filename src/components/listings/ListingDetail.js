import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Image,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import {
  FaCalendar,
  FaCheckCircle,
  FaEnvelope,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaPhone,
  FaStar,
  FaUser,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { listingAPI } from "../../services/api";

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isVerified } = useAuth();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [reserving, setReserving] = useState(false);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const response = await listingAPI.getById(id);
      setListing(response.data);
    } catch (error) {
      console.error("Error fetching listing:", error);
      setError("Failed to load listing");
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = () => {
    if (!user) {
      toast.info("Please login to reserve this item");
      navigate("/login");
      return;
    }

    if (!isVerified) {
      toast.error("Please verify your email first");
      return;
    }

    if (listing.sellerId._id === user._id) {
      toast.error("Cannot reserve your own listing");
      return;
    }

    setShowReserveModal(true);
  };

  const confirmReserve = async () => {
    try {
      setReserving(true);
      await listingAPI.reserve(listing._id);

      toast.success(
        "Listing reserved successfully! Contact the seller to complete the transaction.",
      );
      fetchListing(); // Refresh listing to show reserved status
      setShowReserveModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reserve listing");
    } finally {
      setReserving(false);
    }
  };

  const handleMessageSeller = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!isVerified) {
      toast.error("Please verify your email first");
      return;
    }

    navigate(
      `/messages?userId=${listing.sellerId._id}&listingId=${listing._id}`,
    );
  };

  const handleReport = () => {
    navigate(`/report?listingId=${listing._id}&userId=${listing.sellerId._id}`);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading listing...</p>
      </Container>
    );
  }

  if (error || !listing) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <h5>Error Loading Listing</h5>
          <p>{error || "Listing not found"}</p>
          <Button
            variant="outline-danger"
            onClick={() => navigate("/marketplace")}
          >
            Back to Marketplace
          </Button>
        </Alert>
      </Container>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("et-ET", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = () => {
    const variants = {
      Available: "success",
      Reserved: "warning",
      Sold: "secondary",
    };

    return (
      <Badge bg={variants[listing.status]} className="fs-6 px-3 py-2">
        {listing.status}
      </Badge>
    );
  };

  const isOwner = user && listing.sellerId._id === user._id;
  const canReserve =
    !isOwner && listing.status === "Available" && user && isVerified;

  return (
    <Container fluid="lg" className="py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/marketplace" className="text-decoration-none">
              Marketplace
            </a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {listing.title.substring(0, 50)}...
          </li>
        </ol>
      </nav>

      <Row>
        {/* Images */}
        <Col lg={6} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body className="p-0">
              <div className="position-relative">
                <Image
                  src={listing.images[selectedImage]}
                  alt={listing.title}
                  className="img-fluid rounded-top"
                  style={{
                    width: "100%",
                    height: "400px",
                    objectFit: "cover",
                  }}
                />
                {getStatusBadge()}
              </div>

              {/* Thumbnails */}
              {listing.images.length > 1 && (
                <div className="p-3">
                  <Row className="g-2">
                    {listing.images.map((image, index) => (
                      <Col xs={3} key={index}>
                        <Image
                          src={image}
                          alt={`${listing.title} - ${index + 1}`}
                          className={`img-thumbnail cursor-pointer ${selectedImage === index ? "border-primary" : ""}`}
                          onClick={() => setSelectedImage(index)}
                          style={{
                            width: "100%",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Details */}
        <Col lg={6}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h2 className="h3 mb-2">{listing.title}</h2>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <Badge bg="info" className="fs-6">
                      {listing.category}
                    </Badge>
                    <span className="text-muted">{listing.subcategory}</span>
                  </div>
                </div>
                <h3 className="text-primary fw-bold">
                  {formatPrice(listing.price)}
                </h3>
              </div>

              {/* Seller Info */}
              <Card className="mb-4 border-primary">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <div
                      className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: "50px", height: "50px" }}
                    >
                      <FaUser size={20} />
                    </div>
                    <div>
                      <h5 className="mb-0">{listing.sellerId.name}</h5>
                      <div className="d-flex align-items-center text-muted small">
                        <FaStar className="me-1 text-warning" />
                        <span>
                          {listing.sellerId.rating || "No rating yet"}
                        </span>
                        <span className="mx-2">•</span>
                        <span>
                          {listing.sellerId.totalReviews || 0} reviews
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="row small">
                    <div className="col-6">
                      <p className="mb-1">
                        <FaEnvelope className="me-2" />
                        {listing.sellerId.email}
                      </p>
                    </div>
                    <div className="col-6">
                      {listing.sellerId.phoneNumber && (
                        <p className="mb-1">
                          <FaPhone className="me-2" />
                          {listing.sellerId.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Listing Details */}
              <div className="mb-4">
                <h5 className="mb-3">Description</h5>
                <p className="text-muted" style={{ whiteSpace: "pre-line" }}>
                  {listing.description}
                </p>
              </div>

              {/* Additional Details */}
              <Row className="mb-4">
                <Col md={6}>
                  <div className="mb-3">
                    <h6 className="text-muted">Condition</h6>
                    <p className="mb-0">{listing.condition || "N/A"}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <h6 className="text-muted">
                      <FaMapMarkerAlt className="me-2" />
                      Location
                    </h6>
                    <p className="mb-0">
                      {listing.location} - {listing.specificLocation}
                    </p>
                  </div>
                </Col>
              </Row>

              {listing.category === "Rentals" && listing.rentalPeriod && (
                <div className="mb-4">
                  <h6 className="text-muted d-flex align-items-center">
                    <FaCalendar className="me-2" />
                    Rental Period
                  </h6>
                  <p className="mb-0">
                    {new Date(listing.rentalPeriod.start).toLocaleDateString()}
                    {" to "}
                    {new Date(listing.rentalPeriod.end).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-auto">
                {listing.status === "Available" ? (
                  <div className="d-grid gap-2">
                    {canReserve ? (
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={handleReserve}
                      >
                        Reserve This Item
                      </Button>
                    ) : (
                      <Alert variant={isOwner ? "info" : "warning"}>
                        {isOwner
                          ? "This is your listing. You can edit or delete it from your profile."
                          : !user
                            ? "Please login to reserve this item"
                            : !isVerified
                              ? "Please verify your email to reserve items"
                              : "This item is not available for reservation"}
                      </Alert>
                    )}

                    <Button
                      variant="outline-primary"
                      size="lg"
                      onClick={handleMessageSeller}
                      disabled={!user || !isVerified}
                    >
                      Message Seller
                    </Button>
                  </div>
                ) : listing.status === "Reserved" ? (
                  <Alert variant="warning">
                    <h5>This item is currently reserved</h5>
                    <p className="mb-0">
                      Another student has reserved this item. Check back later
                      if it becomes available again.
                    </p>
                  </Alert>
                ) : (
                  <Alert variant="secondary">
                    <h5>This item has been sold</h5>
                    <p className="mb-0">
                      This item is no longer available. Check out similar items
                      in the marketplace.
                    </p>
                  </Alert>
                )}

                {/* Report Button */}
                {user && !isOwner && (
                  <div className="mt-3 text-end">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={handleReport}
                    >
                      <FaExclamationTriangle className="me-1" />
                      Report Listing
                    </Button>
                  </div>
                )}
              </div>
            </Card.Body>

            <Card.Footer className="bg-white text-muted small">
              Listed on {new Date(listing.createdAt).toLocaleDateString()} •
              Last updated {new Date(listing.updatedAt).toLocaleDateString()}
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      {/* Reserve Confirmation Modal */}
      <Modal
        show={showReserveModal}
        onHide={() => !reserving && setShowReserveModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Reservation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <FaCheckCircle size={48} className="text-primary mb-3" />
            <h5>Reserve this item?</h5>
            <p className="text-muted">
              You are about to reserve <strong>{listing.title}</strong> for{" "}
              {formatPrice(listing.price)}.
            </p>
          </div>

          <Alert variant="info">
            <h6>Important Notes:</h6>
            <ul className="mb-0 small">
              <li>Contact the seller via messages to arrange payment</li>
              <li>Complete payment offline (cash, mobile banking, etc.)</li>
              <li>After payment, seller will mark item as sold</li>
              <li>
                If payment is not completed within 3 days, reservation will
                expire
              </li>
            </ul>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowReserveModal(false)}
            disabled={reserving}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={confirmReserve}
            disabled={reserving}
          >
            {reserving ? (
              <>
                <Spinner size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              "Confirm Reservation"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListingDetail;
