import { useEffect, useState } from "react";
import { Badge, Button, Card, ListGroup, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getConversations, getUnreadCount } from "../../services/api";

const MessageList = () => {
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      fetchConversations();
    }
  }, [userInfo]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const [conversationsRes, unreadRes] = await Promise.all([
        getConversations(),
        getUnreadCount(),
      ]);

      setConversations(conversationsRes.data);
      setUnreadCount(unreadRes.data.unreadCount);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Card>
      <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-0">
            <i className="fas fa-envelope me-2"></i>
            Messages
          </h5>
        </div>
        <div>
          {unreadCount > 0 && (
            <Badge bg="danger" pill>
              {unreadCount} unread
            </Badge>
          )}
          <Button
            variant="outline-light"
            size="sm"
            onClick={fetchConversations}
            className="ms-2"
          >
            <i className="fas fa-sync-alt"></i>
          </Button>
        </div>
      </Card.Header>

      <Card.Body className="p-0">
        {conversations.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-comments fa-3x text-muted mb-3"></i>
            <p className="text-muted">No conversations yet</p>
            <p className="text-muted small">
              Start a conversation by messaging a seller from their listing
            </p>
          </div>
        ) : (
          <ListGroup variant="flush">
            {conversations.map((conv) => (
              <ListGroup.Item
                key={conv.userId}
                action
                onClick={() => navigate(`/messages/${conv.userId}`)}
                className="py-3"
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between">
                      <strong>{conv.userName}</strong>
                      <small className="text-muted">
                        {formatTime(conv.lastMessageTime)}
                      </small>
                    </div>
                    <p
                      className="mb-1 text-truncate"
                      style={{ maxWidth: "300px" }}
                    >
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <Badge bg="primary" pill className="ms-2">
                      {conv.unreadCount}
                    </Badge>
                  )}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};

export default MessageList;
