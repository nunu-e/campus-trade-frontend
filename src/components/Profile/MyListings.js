import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Dropdown,
  Modal,
  Spinner,
  Table,
} from "react-bootstrap";
import { FaEdit, FaEllipsisV, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { listingAPI } from "../../services/api";

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const response = await listingAPI.getMyListings();
      setListings(response.data);
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast.error("Failed to load your listings");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (listing) => {
    setListingToDelete(listing);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!listingToDelete) return;

    try {
      setDeleting(true);
      await listingAPI.delete(listingToDelete._id);
      toast.success("Listing deleted successfully");
      fetchMyListings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete listing");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setListingToDelete(null);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      Available: "success",
      Reserved: "warning",
      Sold: "secondary",
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("et-ET", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const normalizeImage = (img) => {
    if (!img) return "/placeholder.png";
    const s = String(img);
    if (s.startsWith("http") || s.startsWith("/") || s.startsWith("data:"))
      return s;
    return "/placeholder.png";
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading your listings...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>My Listings</h4>
        <Button
          as={Link}
          to="/profile/listings/new"
          variant="primary"
          className="d-flex align-items-center"
        >
          <FaPlus className="me-2" />
          Create New Listing
        </Button>
      </div>

      {listings.length === 0 ? (
        <Alert variant="info" className="text-center">
          <h5>No Listings Yet</h5>
          <p className="mb-3">
            You haven't created any listings yet. Start selling by creating your
            first listing!
          </p>
          <Button as={Link} to="/profile/listings/new" variant="primary">
            Create Your First Listing
          </Button>
        </Alert>
      ) : (
        <div className="table-responsive">
          <Table hover>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Category</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing._id}>
                  <td>
                    {listing.images?.[0] ? (
                      <img
                        src={normalizeImage(listing.images[0])}
                        onError={(e) => (e.target.src = "/placeholder.png")}
                        alt={listing.title}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    ) : (
                      <img
                        src="/placeholder.png"
                        alt="placeholder"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    )}
                  </td>
                  <td>
                    <div
                      className="text-truncate"
                      style={{ maxWidth: "200px" }}
                      title={listing.title}
                    >
                      <Link
                        to={`/listing/${listing._id}`}
                        className="text-decoration-none"
                      >
                        {listing.title}
                      </Link>
                    </div>
                  </td>
                  <td>{formatPrice(listing.price)}</td>
                  <td>
                    <Badge bg="info">{listing.category}</Badge>
                  </td>
                  <td>{getStatusBadge(listing.status)}</td>
                  <td>
                    {isNaN(new Date(listing.createdAt).getTime())
                      ? "-"
                      : new Date(listing.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="light"
                        size="sm"
                        id={`dropdown-${listing._id}`}
                      >
                        <FaEllipsisV />
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item as={Link} to={`/listing/${listing._id}`}>
                          <FaEye className="me-2" />
                          View
                        </Dropdown.Item>

                        {listing.status === "Available" && (
                          <Dropdown.Item
                            as={Link}
                            to={`/profile/listings/edit/${listing._id}`}
                          >
                            <FaEdit className="me-2" />
                            Edit
                          </Dropdown.Item>
                        )}

                        <Dropdown.Item
                          onClick={() => handleDeleteClick(listing)}
                          className="text-danger"
                        >
                          <FaTrash className="me-2" />
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => !deleting && setShowDeleteModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Listing</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete the listing "
            <strong>{listingToDelete?.title}</strong>"?
          </p>
          {listingToDelete?.status === "Reserved" && (
            <Alert variant="warning">
              <strong>Warning:</strong> This listing has an active reservation.
              Deleting it may affect the ongoing transaction.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleting}>
            {deleting ? (
              <>
                <Spinner size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              "Delete Listing"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyListings;
