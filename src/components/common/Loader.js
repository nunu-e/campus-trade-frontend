import { Spinner } from "react-bootstrap";

const Loader = ({ size = "md", variant = "primary", message }) => {
  const spinnerSize = size === "sm" ? "sm" : size === "lg" ? "lg" : undefined;

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <Spinner
        animation="border"
        variant={variant}
        size={spinnerSize}
        className="mb-3"
      />
      {message && <p className="text-muted mb-0">{message}</p>}
    </div>
  );
};

export const InlineLoader = ({ size = "sm", variant = "primary" }) => {
  return (
    <Spinner
      animation="border"
      variant={variant}
      size={size}
      className="ms-2"
    />
  );
};

export const PageLoader = () => {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <Spinner
        animation="border"
        variant="primary"
        style={{ width: "3rem", height: "3rem" }}
      />
    </div>
  );
};

export default Loader;
