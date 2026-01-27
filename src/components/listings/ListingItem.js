import { Badge, Button, Card } from "react-bootstrap";
import { FaEye, FaHeart, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const ListingItem = ({ listing }) => {
  if (!listing) return null; // safety check

  const formatPrice = (price) => {
    if (!price && price !== 0) return "-";
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

  const getStatusBadge = (status) => {
    const variants = {
      Available: "success",
      Reserved: "warning",
      Sold: "secondary",
    };
    return (
      <Badge
        bg={variants[status] || "secondary"}
        className="position-absolute top-0 end-0 m-2"
      >
        {status || "N/A"}
      </Badge>
    );
  };

  const firstImage =
    listing.images && listing.images.length > 0 ? listing.images[0] : null;

  const sellerName =
    listing.sellerId && listing.sellerId.name
      ? listing.sellerId.name.split(" ")[0]
      : "Unknown";

  return (
    <Card className="h-100 shadow-sm hover-shadow">
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={normalizeImage(firstImage)}
          alt={listing.title || "Listing"}
          style={{ height: "200px", objectFit: "cover" }}
        />
        {getStatusBadge(listing.status)}

        {listing.category && (
          <Badge bg="info" className="position-absolute top-0 start-0 m-2">
            {listing.category}
          </Badge>
        )}
      </div>

      <Card.Body className="d-flex flex-column">
        <Card.Title className="h6 mb-2 text-truncate" title={listing.title}>
          {listing.title || "Untitled"}
        </Card.Title>

        <Card.Subtitle className="mb-2 text-primary fw-bold">
          {formatPrice(listing.price)}
        </Card.Subtitle>

        <Card.Text className="small text-muted mb-3 flex-grow-1">
          {listing.description
            ? listing.description.length > 100
              ? `${listing.description.substring(0, 100)}...`
              : listing.description
            : "No description"}
        </Card.Text>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center small text-muted">
              <FaMapMarkerAlt className="me-1" />
              <span>{listing.location || "Unknown"}</span>
            </div>

            <div className="d-flex align-items-center small text-muted">
              <FaUser className="me-1" />
              <span>{sellerName}</span>
            </div>
          </div>

          <div className="d-flex gap-2">
            <Button
              as={Link}
              to={`/listing/${listing._id}`}
              variant="primary"
              size="sm"
              className="flex-grow-1"
            >
              <FaEye className="me-1" /> View Details
            </Button>

            <Button
              variant="outline-secondary"
              size="sm"
              className="p-2"
              title="Add to favorites"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // TODO: Implement favorite functionality
                alert("Favorite functionality coming soon!");
              }}
            >
              <FaHeart />
            </Button>
          </div>
        </div>
      </Card.Body>

      <Card.Footer className="bg-white border-top-0">
        <small className="text-muted">
          Listed{" "}
          {isNaN(new Date(listing.createdAt).getTime())
            ? "-"
            : new Date(listing.createdAt).toLocaleDateString()}
        </small>
      </Card.Footer>
    </Card>
  );
};

export default ListingItem;
