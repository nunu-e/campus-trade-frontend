import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { FaFilter, FaPlus, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import ListingList from "../components/listings/ListingList";
import SearchBar from "../components/listings/SearchBar";
import { listingAPI } from "../services/api";

const MarketplacePage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    location: "",
    sort: "-createdAt",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async (searchParams = {}) => {
    setLoading(true);
    setError("");

    try {
      const params = {
        status: "Available",
        ...filters,
        ...searchParams,
      };

      const response = await listingAPI.getAll(params);
      setListings(response.data.listings || []);
    } catch (error) {
      console.error("Error fetching listings:", error);
      setError("Failed to load listings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    fetchListings({ q: searchTerm });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    fetchListings();
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      location: "",
      sort: "-createdAt",
    });
    fetchListings();
  };

  const categories = [
    { value: "", label: "All Categories" },
    { value: "Goods", label: "Goods" },
    { value: "Services", label: "Services" },
    { value: "Rentals", label: "Rentals" },
  ];

  const locations = [
    { value: "", label: "All Locations" },
    { value: "Main Campus", label: "Main Campus" },
    { value: "Engineering Campus", label: "Engineering Campus" },
    { value: "Science Campus", label: "Science Campus" },
    { value: "Medical Campus", label: "Medical Campus" },
    { value: "Other", label: "Other" },
  ];

  const sortOptions = [
    { value: "-createdAt", label: "Newest First" },
    { value: "createdAt", label: "Oldest First" },
    { value: "price", label: "Price: Low to High" },
    { value: "-price", label: "Price: High to Low" },
  ];

  return (
    <Container fluid="lg" className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold">Marketplace</h2>
          <p className="text-muted">
            Browse items, services, and rentals from fellow AAU students
          </p>
        </Col>
        <Col xs="auto" className="d-flex align-items-center">
          <Button
            as={Link}
            to="/profile/listings/new"
            variant="primary"
            className="d-flex align-items-center"
          >
            <FaPlus className="me-2" /> Sell Something
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <SearchBar onSearch={handleSearch} />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Button
            variant="outline-secondary"
            onClick={() => setShowFilters(!showFilters)}
            className="d-flex align-items-center"
          >
            <FaFilter className="me-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </Col>
      </Row>

      {showFilters && (
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Row className="g-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                  >
                    {categories.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Location</Form.Label>
                  <Form.Select
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                  >
                    {locations.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group>
                  <Form.Label>Min Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    min="0"
                  />
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group>
                  <Form.Label>Max Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    min="0"
                  />
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group>
                  <Form.Label>Sort By</Form.Label>
                  <Form.Select
                    name="sort"
                    value={filters.sort}
                    onChange={handleFilterChange}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={12} className="d-flex justify-content-end gap-2">
                <Button variant="outline-secondary" onClick={resetFilters}>
                  Reset
                </Button>
                <Button variant="primary" onClick={applyFilters}>
                  <FaSearch className="me-2" /> Apply Filters
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading listings...</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-5">
          <h5>No listings found</h5>
          <p className="text-muted">
            Try adjusting your search filters or create the first listing!
          </p>
          <Button
            as={Link}
            to="/profile/listings/new"
            variant="primary"
            className="mt-2"
          >
            Create Listing
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-3">
            <p className="text-muted">
              Showing {listings.length}{" "}
              {listings.length === 1 ? "listing" : "listings"}
            </p>
          </div>
          <ListingList listings={listings} />
        </>
      )}
    </Container>
  );
};

export default MarketplacePage;
