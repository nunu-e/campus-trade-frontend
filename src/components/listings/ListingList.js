import { Alert, Col, Row } from "react-bootstrap";
import ListingItem from "./ListingItem";

const ListingList = ({ listings = [], loading, error, emptyMessage }) => {
  // Error state
  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        <h5>Error Loading Listings</h5>
        <p>{error}</p>
      </Alert>
    );
  }

  // No listings found
  if (!loading && (!listings || listings.length === 0)) {
    return (
      <Alert variant="info" className="text-center">
        <h5>No Listings Found</h5>
        <p>{emptyMessage || "Try adjusting your search filters"}</p>
      </Alert>
    );
  }

  return (
    <Row xs={1} md={2} lg={3} xl={4} className="g-4">
      {listings.map((listing) => (
        <Col key={listing._id || Math.random()}>
          <ListingItem listing={listing} />
        </Col>
      ))}
    </Row>
  );
};

export default ListingList;
