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
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      setFetching(true);
      const response = await listingAPI.getById(id);
      setListing({
        title: response.data.title || "",
        description: response.data.description || "",
        price: response.data.price || "",
        rentalPeriod: response.data.rentalPeriod || "Daily",
        images: response.data.images || [],
        category: response.data.category || "",
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

      const formData = new FormData();
      formData.append("title", listing.title);
      formData.append("description", listing.description);
      formData.append("price", listing.price);
      formData.append("rentalPeriod", listing.rentalPeriod);
      formData.append("category", listing.category);

      // Append images
      if (listing.images.length > 0) {
        for (let i = 0; i < listing.images.length; i++) {
          formData.append("images", listing.images[i]);
        }
      }

      if (id) {
        await listingAPI.update(id, formData);
        toast.success("Listing updated successfully!");
      } else {
        await listingAPI.create(formData);
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

      <Form onSubmit={handleSubmit} encType="multipart/form-data">
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
