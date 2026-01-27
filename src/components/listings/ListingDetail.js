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
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
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

  const fetchListing = async () => {
    try {
      setLoading(true);
      setError(""); // Clear previous errors
      const response = await listingAPI.getById(id);
      setListing(response.data);
    } catch (err) {
      console.error("Error fetching listing:", err);
      setError(err.response?.data?.message || "Failed to load listing");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // guard: only fetch when id looks valid
    if (id && id !== "new") fetchListing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
    if (listing?.sellerId?._id === user._id) {
      toast.error("Cannot reserve your own listing");
      return;
    }
    setShowReserveModal(true);
  };

  const confirmReserve = async () => {
    try {
      setReserving(true);
      await listingAPI.reserveListing(listing._id);
      toast.success(
        "Listing reserved successfully! Contact the seller to complete the transaction.",
      );
      fetchListing();
      setShowReserveModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reserve listing");
    } finally {
      setReserving(false);
    }
  };

  const handleMessageSeller = () => {
    if (!user) {
      toast.info("Please login to message the seller");
      navigate("/login");
      return;
    }
    if (!isVerified) {
      toast.error("Please verify your email to message sellers");
      navigate("/profile");
      return;
    }
    if (!listing?.sellerId?._id) {
      toast.error("Seller information not available");
      return;
    }
    navigate(
      `/messages?userId=${listing.sellerId._id}&listingId=${listing._id}`,
    );
  };

  const handleReport = () => {
    navigate(
      `/report?listingId=${listing?._id}&userId=${listing?.sellerId?._id}`,
    );
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading listing...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <h5>Error Loading Listing</h5>
          <p>{error}</p>
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

  if (!listing) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <h5>Listing Not Found</h5>
          <p>The listing you're looking for doesn't exist or has been removed.</p>
          <Button
            variant="outline-primary"
            onClick={() => navigate("/marketplace")}
          >
            Back to Marketplace
          </Button>
        </Alert>
      </Container>
    );
  }

  const formatPrice = (price) => {
    if (!price && price !== 0) return "N/A";
    return new Intl.NumberFormat("et-ET", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const normalizeImage = (img) => {
    if (!img) return "/logo192.png";
    const s = String(img);
    // If it's already a full URL, return as is
    if (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("data:")) {
      return s;
    }
    // If it starts with /, it's a relative path
    if (s.startsWith("/")) {
      return s;
    }
    // If it's a relative path without /, try to construct full URL
    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
    // Check if it looks like a file path that needs the API base URL
    if (s.includes("uploads") || s.includes("images")) {
      return `${API_BASE_URL}/${s}`;
    }
    // Default fallback
    return "/logo192.png";
  };

  const getStatusBadge = () => {
    const variants = {
      Available: "success",
      Reserved: "warning",
      Sold: "secondary",
    };
    return (
      <Badge
        bg={variants[listing.status]}
        className="fs-6 px-3 py-2 position-absolute top-0 end-0 m-2"
      >
        {listing.status}
      </Badge>
    );
  };

  const isOwner = user && listing?.sellerId?._id === user._id;
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
            <Card.Body className="p-0 position-relative">
              <Image
                src={normalizeImage(listing.images?.[selectedImage])}
                alt={listing.title}
                className="img-fluid rounded-top"
                style={{ width: "100%", height: "400px", objectFit: "cover" }}
                loading="lazy"
              />
              {getStatusBadge()}

              {listing.images?.length > 1 && (
                <div className="p-3">
                  <Row className="g-2">
                    {listing.images.map((image, index) => (
                      <Col xs={3} key={index}>
                        <Image
                          src={normalizeImage(image)}
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
            <Card.Body className="d-flex flex-column">
              <h2 className="mb-3">{listing.title}</h2>
              
              <div className="mb-3">
                <h3 className="text-primary mb-2">{formatPrice(listing.price)}</h3>
                <div className="d-flex gap-2 mb-2">
                  <Badge bg="info">{listing.category}</Badge>
                  {listing.subcategory && <Badge bg="secondary">{listing.subcategory}</Badge>}
                  {listing.condition && <Badge bg="warning">{listing.condition}</Badge>}
                </div>
              </div>

              <div className="mb-3">
                <h5>Description</h5>
                <p className="text-muted">{listing.description}</p>
              </div>

              <div className="mb-3">
                <Row>
                  <Col md={6}>
                    <p className="mb-2">
                      <strong>Location:</strong> {listing.location}
                    </p>
                    {listing.specificLocation && (
                      <p className="mb-2">
                        <strong>Specific Location:</strong> {listing.specificLocation}
                      </p>
                    )}
                  </Col>
                  <Col md={6}>
                    {listing.serviceType && (
                      <p className="mb-2">
                        <strong>Service Type:</strong> {listing.serviceType}
                      </p>
                    )}
                    {listing.rentalPeriod && typeof listing.rentalPeriod === 'object' && (
                      <p className="mb-2">
                        <strong>Rental Period:</strong>{" "}
                        {new Date(listing.rentalPeriod.start).toLocaleDateString()} -{" "}
                        {new Date(listing.rentalPeriod.end).toLocaleDateString()}
                      </p>
                    )}
                  </Col>
                </Row>
              </div>

              {/* Action buttons */}
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
              Listed on{" "}
              {isNaN(new Date(listing.createdAt).getTime())
                ? "-"
                : new Date(listing.createdAt).toLocaleDateString()}{" "}
              • Last updated{" "}
              {isNaN(new Date(listing.updatedAt).getTime())
                ? "-"
                : new Date(listing.updatedAt).toLocaleDateString()}
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      {/* Reserve Modal */}
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
            {reserving ? <>Processing...</> : "Confirm Reservation"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListingDetail;
