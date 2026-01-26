import { Badge, Button, Card } from "react-bootstrap";
import { FaEye, FaHeart, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const ListingItem = ({ listing }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("et-ET", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status) => {
    const variants = {
      Available: "success",
      Reserved: "warning",
      Sold: "secondary",
    };

    return (
      <Badge
        bg={variants[status]}
        className="position-absolute top-0 end-0 m-2"
      >
        {status}
      </Badge>
    );
  };

  return (
    <Card className="h-100 shadow-sm hover-shadow">
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={
            listing.images && listing.images.length > 0
              ? listing.images[0]
              : "/placeholder.jpg"
          }
          alt={listing.title}
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
          {listing.title}
        </Card.Title>

        <Card.Subtitle className="mb-2 text-primary fw-bold">
          {formatPrice(listing.price)}
        </Card.Subtitle>

        <Card.Text className="small text-muted mb-3 flex-grow-1">
          {listing.description.length > 100
            ? `${listing.description.substring(0, 100)}...`
            : listing.description}
        </Card.Text>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center small text-muted">
              <FaMapMarkerAlt className="me-1" />
              <span>{listing.location}</span>
            </div>

            {listing.sellerId?.name && (
              <div className="d-flex align-items-center small text-muted">
                <FaUser className="me-1" />
                <span>{listing.sellerId.name.split(" ")[0]}</span>
              </div>
            )}
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
            >
              <FaHeart />
            </Button>
          </div>
        </div>
      </Card.Body>

      <Card.Footer className="bg-white border-top-0">
        <small className="text-muted">
          Listed {new Date(listing.createdAt).toLocaleDateString()}
        </small>
      </Card.Footer>
    </Card>
  );
};

export default ListingItem;
