import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Form,
  Image,
  InputGroup,
  Modal,
  Spinner,
  Table,
} from "react-bootstrap";
import { FaBan, FaCheck, FaEye, FaSearch, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { adminAPI } from "../../services/api";

const ListingManagement = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [actionType, setActionType] = useState("");

  useEffect(() => {
    fetchListings();
  }, [filter]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== "all") {
        params.status = filter;
      }
      const response = await adminAPI.getListings(params);
      setListings(response.data.listings);
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (listing, action) => {
    setSelectedListing(listing);
    setActionType(action);
    setShowModal(true);
  };

  const confirmAction = async () => {
    try {
      let newStatus;
      switch (actionType) {
        case "hide":
          newStatus = "Hidden";
          break;
        case "remove":
          newStatus = "Removed";
          break;
        case "approve":
          newStatus = "Available";
          break;
        default:
          return;
      }

      await adminAPI.updateListingStatus(selectedListing._id, {
        status: newStatus,
        reason: `Admin action: ${actionType}`,
      });

      toast.success(`Listing ${actionType}d successfully`);
      fetchListings();
      setShowModal(false);
      setSelectedListing(null);
    } catch (error) {
      toast.error(`Failed to ${actionType} listing`);
    }
  };

  const filteredListings = listings.filter(
    (listing) =>
      listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusBadge = (status) => {
    const variants = {
      Available: "success",
      Reserved: "warning",
      Sold: "secondary",
      Hidden: "info",
      Removed: "danger",
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  const getCategoryBadge = (category) => {
    const colors = {
      Goods: "primary",
      Services: "success",
      Rentals: "warning",
    };
    return <Badge bg={colors[category]}>{category}</Badge>;
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Listing Management</h4>
        <div className="d-flex gap-3">
          <div style={{ width: "250px" }}>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </div>

          <Form.Select
            style={{ width: "200px" }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Available">Available</option>
            <option value="Reserved">Reserved</option>
            <option value="Sold">Sold</option>
            <option value="Hidden">Hidden</option>
            <option value="Removed">Removed</option>
          </Form.Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <Table hover responsive>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Seller</th>
                <th>Price</th>
                <th>Category</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredListings.map((listing) => (
                <tr key={listing._id}>
                  <td>
                    {listing.images?.[0] && (
                      <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        width={50}
                        height={50}
                        className="rounded"
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </td>
                  <td>
                    <div
                      className="text-truncate"
                      style={{ maxWidth: "200px" }}
                      title={listing.title}
                    >
                      {listing.title}
                    </div>
                  </td>
                  <td>{listing.sellerId?.name || "Unknown"}</td>
                  <td>ETB {listing.price}</td>
                  <td>{getCategoryBadge(listing.category)}</td>
                  <td>{getStatusBadge(listing.status)}</td>
                  <td>{new Date(listing.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        as={Link}
                        to={`/listing/${listing._id}`}
                        size="sm"
                        variant="info"
                        target="_blank"
                        title="View Listing"
                      >
                        <FaEye />
                      </Button>

                      {listing.status === "Available" && (
                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() => handleAction(listing, "hide")}
                          title="Hide Listing"
                        >
                          <FaBan />
                        </Button>
                      )}

                      {listing.status === "Hidden" && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleAction(listing, "approve")}
                          title="Approve Listing"
                        >
                          <FaCheck />
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleAction(listing, "remove")}
                        title="Remove Listing"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {filteredListings.length === 0 && (
            <Alert variant="info" className="text-center">
              No listings found matching your criteria.
            </Alert>
          )}
        </>
      )}

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionType === "hide" && "Hide Listing"}
            {actionType === "remove" && "Remove Listing"}
            {actionType === "approve" && "Approve Listing"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to {actionType} the listing "
            <strong>{selectedListing?.title}</strong>"?
          </p>
          {selectedListing && (
            <div className="mt-3">
              <p>
                <strong>Seller:</strong> {selectedListing.sellerId?.name}
              </p>
              <p>
                <strong>Price:</strong> ETB {selectedListing.price}
              </p>
              <p>
                <strong>Category:</strong> {selectedListing.category}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant={actionType === "remove" ? "danger" : "warning"}
            onClick={confirmAction}
          >
            Confirm {actionType}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListingManagement;
