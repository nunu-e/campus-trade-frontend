import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ListingForm = ({ listingId, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "Goods",
    subcategory: "",
    location: "Main Campus",
    specificLocation: "",
    condition: "Good",
    serviceType: "",
    rentalPeriod: {
      start: "",
      end: "",
    },
    images: [],
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const categories = {
    Goods: [
      "Textbooks",
      "Electronics",
      "Dorm Essentials",
      "Clothing",
      "Furniture",
      "Stationery",
      "Sports Equipment",
      "Other",
    ],
    Services: [
      "Tutoring",
      "Writing Assistance",
      "Graphic Design",
      "Programming",
      "Research Assistance",
      "Photography",
      "Transportation",
      "Other",
    ],
    Rentals: [
      "Books",
      "Electronics",
      "Clothing",
      "Kitchen Appliances",
      "Sports Equipment",
      "Furniture",
      "Other",
    ],
  };

  const campusLocations = [
    "Main Campus",
    "Engineering Campus",
    "Science Campus",
    "Medical Campus",
    "Other",
  ];

  const conditions = ["New", "Like New", "Good", "Fair", "Poor"];

  useEffect(() => {
    if (listingId) {
      fetchListing();
    }
  }, [listingId]);

  const fetchListing = async () => {
    try {
      const response = await axios.get(`/api/listings/${listingId}`);
      setFormData(response.data);
      if (response.data.images) {
        setImagePreviews(response.data.images);
      }
    } catch (error) {
      toast.error("Failed to load listing");
      navigate("/marketplace");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    else if (formData.title.length < 3)
      newErrors.title = "Title must be at least 3 characters";

    if (!formData.description.trim())
      newErrors.description = "Description is required";

    if (!formData.price || formData.price <= 0)
      newErrors.price = "Valid price is required";

    if (!formData.subcategory.trim())
      newErrors.subcategory = "Subcategory is required";

    if (!formData.specificLocation.trim())
      newErrors.specificLocation = "Please specify meeting location";

    if (formData.category === "Goods" && !formData.condition) {
      newErrors.condition = "Condition is required for goods";
    }

    if (formData.category === "Services" && !formData.serviceType.trim()) {
      newErrors.serviceType = "Service type is required";
    }

    if (formData.category === "Rentals") {
      if (!formData.rentalPeriod.start)
        newErrors.rentalStart = "Start date is required";
      if (!formData.rentalPeriod.end)
        newErrors.rentalEnd = "End date is required";
      if (formData.rentalPeriod.start && formData.rentalPeriod.end) {
        const start = new Date(formData.rentalPeriod.start);
        const end = new Date(formData.rentalPeriod.end);
        if (end <= start)
          newErrors.rentalEnd = "End date must be after start date";
      }
    }

    if (!listingId && imageFiles.length === 0 && imagePreviews.length === 0) {
      newErrors.images = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate file types and size
    const validFiles = files.filter((file) => {
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        toast.error(
          `${file.name}: Invalid file type. Only images are allowed.`,
        );
        return false;
      }

      if (file.size > maxSize) {
        toast.error(`${file.name}: File too large. Maximum size is 5MB.`);
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    setImageFiles([...imageFiles, ...validFiles]);

    // Create previews
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];

    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // In production, you would upload images to S3 first
      // For now, we'll use placeholder URLs
      const imageUrls = imagePreviews.map((url, index) =>
        url.startsWith("blob:")
          ? `https://via.placeholder.com/300x200?text=Image+${index + 1}`
          : url,
      );

      const submitData = {
        ...formData,
        images: imageUrls,
        price: parseFloat(formData.price),
      };

      let response;

      if (listingId) {
        response = await axios.put(`/api/listings/${listingId}`, submitData);
        toast.success("Listing updated successfully!");
      } else {
        response = await axios.post("/api/listings", submitData);
        toast.success("Listing created successfully!");
      }

      if (onSuccess) {
        onSuccess(response.data);
      } else {
        navigate(`/listing/${response.data._id}`);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to save listing";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">
            {listingId ? "Edit Listing" : "Create New Listing"}
          </h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                isInvalid={!!errors.title}
                placeholder="e.g., Calculus Textbook - Like New"
                maxLength={100}
              />
              <Form.Control.Feedback type="invalid">
                {errors.title}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Be specific and descriptive (3-100 characters)
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                isInvalid={!!errors.description}
                placeholder="Describe your item/service in detail..."
                maxLength={1000}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                {formData.description.length}/1000 characters
              </Form.Text>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price (ETB) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    isInvalid={!!errors.price}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.price}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="Goods">Goods (Items for Sale)</option>
                    <option value="Services">Services</option>
                    <option value="Rentals">Rentals</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Subcategory *</Form.Label>
              <Form.Select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                isInvalid={!!errors.subcategory}
              >
                <option value="">Select {formData.category} type</option>
                {categories[formData.category]?.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.subcategory}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Campus Location *</Form.Label>
                  <Form.Select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                  >
                    {campusLocations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Specific Meeting Point *</Form.Label>
                  <Form.Control
                    type="text"
                    name="specificLocation"
                    value={formData.specificLocation}
                    onChange={handleChange}
                    isInvalid={!!errors.specificLocation}
                    placeholder="e.g., Main Library entrance, Cafeteria, etc."
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.specificLocation}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            {formData.category === "Goods" && (
              <Form.Group className="mb-3">
                <Form.Label>Condition *</Form.Label>
                <Form.Select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  isInvalid={!!errors.condition}
                >
                  {conditions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.condition}
                </Form.Control.Feedback>
              </Form.Group>
            )}

            {formData.category === "Services" && (
              <Form.Group className="mb-3">
                <Form.Label>Service Type *</Form.Label>
                <Form.Control
                  type="text"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  isInvalid={!!errors.serviceType}
                  placeholder="e.g., Python Tutoring, Research Paper Writing"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.serviceType}
                </Form.Control.Feedback>
              </Form.Group>
            )}

            {formData.category === "Rentals" && (
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Rental Start Date *</Form.Label>
                    <Form.Control
                      type="date"
                      name="rentalPeriod.start"
                      value={formData.rentalPeriod.start}
                      onChange={handleChange}
                      isInvalid={!!errors.rentalStart}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.rentalStart}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Rental End Date *</Form.Label>
                    <Form.Control
                      type="date"
                      name="rentalPeriod.end"
                      value={formData.rentalPeriod.end}
                      onChange={handleChange}
                      isInvalid={!!errors.rentalEnd}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.rentalEnd}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            )}

            <Form.Group className="mb-4">
              <Form.Label>
                Images {!listingId && "*"}{" "}
                <small className="text-muted">(Max 5 images, 5MB each)</small>
              </Form.Label>

              {imagePreviews.length > 0 && (
                <div className="mb-3">
                  <Row>
                    {imagePreviews.map((preview, index) => (
                      <Col xs={6} md={4} lg={3} key={index} className="mb-3">
                        <div className="position-relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="img-thumbnail w-100"
                            style={{ height: "150px", objectFit: "cover" }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0 m-1"
                            onClick={() => removeImage(index)}
                            style={{ padding: "2px 6px" }}
                          >
                            ×
                          </Button>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}

              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                multiple
                isInvalid={!!errors.images}
                disabled={imagePreviews.length >= 5}
              />
              <Form.Control.Feedback type="invalid">
                {errors.images}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                {imagePreviews.length}/5 images uploaded. Supported formats:
                JPG, PNG, GIF, WebP
              </Form.Text>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : listingId
                    ? "Update Listing"
                    : "Create Listing"}
              </Button>

              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => navigate("/marketplace")}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ListingForm;
