import { useState } from "react";
import { Button, Dropdown, Form, InputGroup } from "react-bootstrap";
import { FaFilter, FaSearch, FaTimes } from "react-icons/fa";

const SearchBar = ({
  onSearch,
  placeholder = "Search listings...",
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

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
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch &&
      onSearch({
        q: searchTerm.trim() || undefined,
        category: category || undefined,
        location: location || undefined,
      });
  };

  const handleClear = () => {
    setSearchTerm("");
    setCategory("");
    setLocation("");
    onSearch && onSearch({});
  };

  const hasFilters = category || location;

  return (
    <Form onSubmit={handleSearch}>
      <InputGroup className={`shadow-sm ${className}`}>
        <InputGroup.Text className="bg-white border-end-0">
          <FaSearch />
        </InputGroup.Text>

        <Form.Control
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-start-0"
        />

        <Dropdown>
          <Dropdown.Toggle
            variant="outline-secondary"
            className="border-start-0"
          >
            <FaFilter className="me-2" />
            Filters
            {hasFilters && (
              <span className="ms-2 badge bg-primary">Active</span>
            )}
          </Dropdown.Toggle>

          <Dropdown.Menu className="p-3" style={{ width: "300px" }}>
            {/* Category Filter */}
            <div className="mb-3">
              <label className="form-label small text-muted mb-2">
                Category
              </label>
              <div className="d-flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    className={`btn btn-sm ${
                      category === cat.value
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setCategory(cat.value)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div className="mb-3">
              <label className="form-label small text-muted mb-2">
                Location
              </label>
              <div className="d-flex flex-wrap gap-2">
                {locations.map((loc) => (
                  <button
                    key={loc.value}
                    type="button"
                    className={`btn btn-sm ${
                      location === loc.value
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setLocation(loc.value)}
                  >
                    {loc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="d-flex justify-content-between">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleClear}
              >
                <FaTimes className="me-1" />
                Clear All
              </Button>
              <Button variant="primary" size="sm" onClick={handleSearch}>
                Apply Filters
              </Button>
            </div>
          </Dropdown.Menu>
        </Dropdown>

        <Button type="submit" variant="primary" className="px-4">
          Search
        </Button>
      </InputGroup>

      {/* Active Filters Display */}
      {(category || location) && (
        <div className="mt-2 d-flex align-items-center">
          <small className="text-muted me-3">Active filters:</small>
          <div className="d-flex gap-2">
            {category && (
              <span className="badge bg-primary">
                Category:{" "}
                {categories.find((c) => c.value === category)?.label ||
                  category}
              </span>
            )}
            {location && (
              <span className="badge bg-primary">
                Location:{" "}
                {locations.find((l) => l.value === location)?.label || location}
              </span>
            )}
            <Button
              variant="link"
              size="sm"
              className="p-0 text-danger"
              onClick={handleClear}
            >
              Clear all
            </Button>
          </div>
        </div>
      )}
    </Form>
  );
};

export default SearchBar;
