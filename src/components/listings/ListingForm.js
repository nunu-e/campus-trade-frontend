import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Container, Form, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { listingAPI } from "../../services/api";

// Map frontend category to backend enum
const categoryMap = {
  Sell: "Goods",
  Rent: "Rentals",
  Service: "Services",
};

// Helper: convert file to base64 string
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const ListingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isVerified } = useAuth();

  const [listing, setListing] = useState({
    title: "",
    description: "",
    price: "",
    images: [],
    category: "", // "Sell", "Rent", "Service"
    subcategory: "",
    location: "",
    condition: "",
    serviceType: "",
    rentalDuration: "",
    rentalUnit: "Day",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");

  const fetchListing = useCallback(async () => {
    try {
      setFetching(true);
      const response = await listingAPI.getById(id);
      const data = response && response.data ? response.data : response;
      let frontendCategory = "";
      if (data.category === "Goods") frontendCategory = "Sell";
      else if (data.category === "Rentals") frontendCategory = "Rent";
      else if (data.category === "Services") frontendCategory = "Service";

      setListing({
        title: data.title || "",
        description: data.description || "",
        price: data.price || "",
        images: data.images || [], // existing base64 strings for editing
        category: frontendCategory,
        subcategory: data.subcategory || "",
        location: data.location || "",
        condition: data.condition || "",
        serviceType: data.serviceType || "",
        rentalDuration: data.rentalPeriod?.duration || "",
        rentalUnit: data.rentalPeriod?.unit || "Day",
      });
    } catch (err) {
      setError("Failed to load listing for editing");
    } finally {
      setFetching(false);
    }
  }, [id]);

  useEffect(() => {
    if (id && id !== "new") fetchListing();
  }, [id, fetchListing]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      // Store File objects temporarily
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

      const backendCategory = categoryMap[listing.category];
      if (!backendCategory) {
        throw new Error("Please select a valid category (Sell, Rent, Service)");
      }

      // --- Convert images to base64 ---
      let imageBase64Array = [];
      if (listing.images && listing.images.length > 0) {
        const firstItem = listing.images[0];
        // If the first item is a string starting with "data:image", it's already base64 (editing case)
        if (
          typeof firstItem === "string" &&
          firstItem.startsWith("data:image")
        ) {
          imageBase64Array = listing.images;
        } else {
          // Convert File objects to base64
          const files = Array.from(listing.images);
          imageBase64Array = await Promise.all(files.map(fileToBase64));
        }
      } else if (!id) {
        throw new Error("At least one image is required");
      }

      // Build payload
      const payload = {
        title: listing.title,
        description: listing.description,
        price: parseFloat(listing.price),
        category: backendCategory,
        subcategory: listing.subcategory,
        location: listing.location,
        images: imageBase64Array,
        condition: undefined,
        serviceType: undefined,
        rentalPeriod: undefined,
      };

      // Category‑specific fields
      if (backendCategory === "Goods") {
        if (!listing.condition)
          throw new Error("Condition is required for goods");
        payload.condition = listing.condition;
      } else if (backendCategory === "Services") {
        if (!listing.serviceType) throw new Error("Service type is required");
        payload.serviceType = listing.serviceType;
      } else if (backendCategory === "Rentals") {
        if (!listing.rentalDuration || !listing.rentalUnit) {
          throw new Error("Rental duration and unit are required");
        }
        payload.rentalPeriod = {
          duration: parseInt(listing.rentalDuration),
          unit: listing.rentalUnit,
        };
      }

      if (id && id !== "new") {
        await listingAPI.update(id, payload);
        toast.success("Listing updated successfully!");
      } else {
        await listingAPI.create(payload);
        toast.success("Listing created successfully!");
      }
      navigate("/marketplace");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to submit listing",
      );
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
      <h3>{id && id !== "new" ? "Edit Listing" : "Create New Listing"}</h3>
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
          <Form.Label>Category *</Form.Label>
          <Form.Select
            name="category"
            value={listing.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            <option value="Sell">Sell (Goods)</option>
            <option value="Rent">Rent (Items)</option>
            <option value="Service">Offer a Service</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Subcategory</Form.Label>
          <Form.Control
            type="text"
            name="subcategory"
            value={listing.subcategory}
            onChange={handleChange}
            placeholder="e.g., Electronics, Tutoring, Books"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Select
            name="location"
            value={listing.location}
            onChange={handleChange}
            required
          >
            <option value="">Select campus location</option>
            <option value="Main Campus">Main Campus</option>
            <option value="Engineering Campus">Engineering Campus</option>
            <option value="Science Campus">Science Campus</option>
            <option value="Medical Campus">Medical Campus</option>
            <option value="Other">Other</option>
          </Form.Select>
        </Form.Group>

        {listing.category === "Sell" && (
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

        {listing.category === "Service" && (
          <Form.Group className="mb-3">
            <Form.Label>Service Type</Form.Label>
            <Form.Control
              type="text"
              name="serviceType"
              value={listing.serviceType}
              onChange={handleChange}
              placeholder="e.g., Tutoring, Repair, Design"
              required
            />
          </Form.Group>
        )}

        {listing.category === "Rent" && (
          <Form.Group className="mb-3">
            <Form.Label>Rental Duration</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control
                type="number"
                name="rentalDuration"
                value={listing.rentalDuration}
                onChange={handleChange}
                placeholder="e.g., 1"
                min="1"
                style={{ width: "120px" }}
                required
              />
              <Form.Select
                name="rentalUnit"
                value={listing.rentalUnit}
                onChange={handleChange}
                style={{ width: "120px" }}
                required
              >
                <option value="Day">Day(s)</option>
                <option value="Week">Week(s)</option>
                <option value="Month">Month(s)</option>
              </Form.Select>
            </div>
            <Form.Text className="text-muted">
              Example: 2 Weeks, 1 Month, 3 Days
            </Form.Text>
          </Form.Group>
        )}

        <Form.Group className="mb-4">
          <Form.Label>Images</Form.Label>
          <Form.Control
            type="file"
            name="images"
            onChange={handleChange}
            multiple
            accept="image/*"
            required={!id}
          />
          {listing.images?.length > 0 && (
            <div className="mt-2">
              <strong>Selected Images:</strong>
              <ul>
                {Array.from(listing.images).map((img, idx) => (
                  <li key={idx}>
                    {typeof img === "string" && img.startsWith("data:image")
                      ? "Image (base64)"
                      : img.name || "Image"}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Form.Text className="text-muted">
            Supported formats: JPG, PNG, GIF, WEBP. Images are stored as base64.
          </Form.Text>
        </Form.Group>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading
            ? "Submitting..."
            : id && id !== "new"
              ? "Update Listing"
              : "Create Listing"}
        </Button>
      </Form>
    </Container>
  );
};

export default ListingForm;
