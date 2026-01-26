import { Alert } from "react-bootstrap";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimesCircle,
} from "react-icons/fa";

const Message = ({ variant, children, dismissible, onClose, className }) => {
  const getIcon = () => {
    switch (variant) {
      case "success":
        return <FaCheckCircle className="me-2" />;
      case "danger":
        return <FaTimesCircle className="me-2" />;
      case "warning":
        return <FaExclamationTriangle className="me-2" />;
      default:
        return <FaInfoCircle className="me-2" />;
    }
  };

  return (
    <Alert
      variant={variant}
      dismissible={dismissible}
      onClose={onClose}
      className={`d-flex align-items-center ${className}`}
    >
      {getIcon()}
      <div className="flex-grow-1">{children}</div>
    </Alert>
  );
};

export const SuccessMessage = ({ children, ...props }) => (
  <Message variant="success" {...props}>
    {children}
  </Message>
);

export const ErrorMessage = ({ children, ...props }) => (
  <Message variant="danger" {...props}>
    {children}
  </Message>
);

export const WarningMessage = ({ children, ...props }) => (
  <Message variant="warning" {...props}>
    {children}
  </Message>
);

export const InfoMessage = ({ children, ...props }) => (
  <Message variant="info" {...props}>
    {children}
  </Message>
);

export default Message;
