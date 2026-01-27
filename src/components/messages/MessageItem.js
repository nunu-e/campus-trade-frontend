import moment from "moment";
import { Badge } from "react-bootstrap";
import { FaCheck, FaCheckDouble, FaClock, FaUserCircle } from "react-icons/fa";

const MessageItem = ({ message, isOwnMessage, showDate = false }) => {
  const formatTime = (timestamp) => {
    return moment(timestamp).format("h:mm A");
  };

  const formatDate = (timestamp) => {
    return moment(timestamp).format("MMM D, YYYY");
  };

  return (
    <>
      {showDate && (
        <div className="text-center my-3">
          <Badge bg="light" text="dark" className="px-3 py-1">
            {formatDate(message.createdAt)}
          </Badge>
        </div>
      )}

      <div
        className={`d-flex mb-3 ${isOwnMessage ? "justify-content-end" : "justify-content-start"}`}
      >
        {!isOwnMessage && (
          <div className="me-2">
            <div
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "36px", height: "36px" }}
            >
              <FaUserCircle size={18} />
            </div>
          </div>
        )}

        <div className={`max-w-75 ${isOwnMessage ? "order-1" : "order-2"}`}>
          <div
            className={`rounded p-3 ${isOwnMessage ? "bg-primary text-white" : "bg-light"}`}
            style={{ maxWidth: "100%", wordBreak: "break-word" }}
          >
            <div className="mb-1">{message.content}</div>
            <div
              className={`small d-flex align-items-center justify-content-end ${isOwnMessage ? "text-white-50" : "text-muted"}`}
            >
              <FaClock className="me-1" size={10} />
              {formatTime(message.createdAt)}

              {isOwnMessage && (
                <span className="ms-2">
                  {message.isRead ? (
                    <FaCheckDouble size={12} className="text-info" />
                  ) : (
                    <FaCheck size={12} />
                  )}
                </span>
              )}
            </div>
          </div>

          {!isOwnMessage && (
            <div className="mt-1 small text-muted">
              {message.senderId?.name || "User"}
            </div>
          )}
        </div>

        {isOwnMessage && (
          <div className="ms-2 order-3">
            <div
              className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "36px", height: "36px" }}
            >
              <FaUserCircle size={18} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MessageItem;
