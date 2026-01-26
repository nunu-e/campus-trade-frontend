import { useParams } from "react-router-dom";
import ListingDetail from "../components/listings/ListingDetail";

const ListingPage = () => {
  const { id } = useParams();

  return <ListingDetail />;
};

export default ListingPage;
