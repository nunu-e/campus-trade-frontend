import { useEffect, useState } from "react";
import { Alert, Button, Container, Form, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { listingAPI } from "../../services/api";

const ListingForm = () => {
  const { id } = useParams(); // for editing
  const navigate = useNavigate();
  const { user, isVerified } = useAuth();

  const [listing, setListing] = useState({
    title: "",
    description: "",
    price: "",
    rentalPeriod: "Daily",
    images: [],
    category: "",
    subcategory: "",
    location: "",
    condition: "",
    serviceType: "",
    rentalStart: "",
    rentalEnd: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // only fetch when editing an existing listing (id should be a real id, not the literal 'new')
    if (id && id !== "new") fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      setFetching(true);
      const response = await listingAPI.getById(id);
      const data = response && response.data ? response.data : response;
      setListing({
        title: data.title || "",
        description: data.description || "",
        price: data.price || "",
        rentalPeriod: data.rentalPeriod || "Daily",
        images: data.images || [],
        category: data.category || "",
        subcategory: data.subcategory || "",
        location: data.location || "",
      });
    } catch (err) {
      setError("Failed to load listing for editing");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setListing((prev) => ({ ...prev, images: [...files] }));
    } else {
      setListing((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info("Please login first");
      navigate("/login");
      return;
    }
    if (!isVerified) {
      toast.error("Please verify your email first");
      return;
    }

    try {
      setLoading(true);

      // Prepare payload as JSON. Backend expects images array; file upload isn't configured here.
      const payload = {
        title: listing.title,
        description: listing.description,
        price: listing.price,
        rentalPeriod: listing.rentalPeriod,
        category: listing.category,
        subcategory: listing.subcategory,
        location: listing.location,
        images: [],
        condition: listing.condition || undefined,
        serviceType: listing.serviceType || undefined,
      };

      // Validate category-specific fields
      if (listing.category === "Goods" && !listing.condition) {
        throw new Error("Condition is required for goods");
      }

      if (listing.category === "Services" && !listing.serviceType) {
        throw new Error("Service type is required for services");
      }

      if (listing.category === "Rentals") {
        if (!listing.rentalStart || !listing.rentalEnd) {
          throw new Error(
            "Rental start and end dates are required for rentals",
          );
        }
        payload.rentalPeriod = {
          start: listing.rentalStart,
          end: listing.rentalEnd,
        };
      }

      if (listing.images && listing.images.length > 0) {
        // If File objects, use file names as placeholders; backend stores whatever is provided.
        payload.images = Array.from(listing.images).map((f) => f.name || f);
      }

      if (id) {
        await listingAPI.update(id, payload);
        toast.success("Listing updated successfully!");
      } else {
        await listingAPI.create(payload);
        toast.success("Listing created successfully!");
      }
      navigate("/marketplace");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit listing");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading listing...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {error && <Alert variant="danger">{error}</Alert>}

      <h3>{id ? "Edit Listing" : "Create New Listing"}</h3>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={listing.title}
            onChange={handleChange}
            placeholder="Enter listing title"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={listing.description}
            onChange={handleChange}
            placeholder="Enter description"
            rows={5}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Price (ETB)</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={listing.price}
            onChange={handleChange}
            placeholder="Enter price"
            required
            min={0}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Rental Period</Form.Label>
          <Form.Select
            name="rentalPeriod"
            value={listing.rentalPeriod}
            onChange={handleChange}
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            name="category"
            value={listing.category}
            onChange={handleChange}
            placeholder="Enter category"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Subcategory</Form.Label>
          <Form.Control
            type="text"
            name="subcategory"
            value={listing.subcategory}
            onChange={handleChange}
            placeholder="Enter subcategory"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            name="location"
            value={listing.location}
            onChange={handleChange}
            placeholder="Enter location"
            required
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Images</Form.Label>
          <Form.Control
            type="file"
            name="images"
            onChange={handleChange}
            multiple
            accept="image/*"
          />
          {listing.images?.length > 0 && (
            <div className="mt-2">
              <strong>Selected Images:</strong>
              <ul>
                {Array.from(listing.images).map((file, idx) => (
                  <li key={idx}>{file.name || file}</li>
                ))}
              </ul>
            </div>
          )}
        </Form.Group>

        {/* Conditional fields based on category */}
        {listing.category === "Goods" && (
          <Form.Group className="mb-3">
            <Form.Label>Condition</Form.Label>
            <Form.Select
              name="condition"
              value={listing.condition}
              onChange={handleChange}
              required
            >
              <option value="">Select condition</option>
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </Form.Select>
          </Form.Group>
        )}

        {listing.category === "Services" && (
          <Form.Group className="mb-3">
            <Form.Label>Service Type</Form.Label>
            <Form.Control
              type="text"
              name="serviceType"
              value={listing.serviceType}
              onChange={handleChange}
              placeholder="e.g., Tutoring, Repair"
              required
            />
          </Form.Group>
        )}

        {listing.category === "Rentals" && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Rental Start</Form.Label>
              <Form.Control
                type="date"
                name="rentalStart"
                value={listing.rentalStart}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rental End</Form.Label>
              <Form.Control
                type="date"
                name="rentalEnd"
                value={listing.rentalEnd}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </>
        )}

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? (
            <>Submitting...</>
          ) : id ? (
            "Update Listing"
          ) : (
            "Create Listing"
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default ListingForm;
