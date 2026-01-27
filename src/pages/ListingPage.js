import ListingDetail from "../components/listings/ListingDetail";

const ListingPage = () => {
  // ListingDetail uses useParams internally, so we just render it
  return <ListingDetail />;
};

export default ListingPage;
