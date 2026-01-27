import { Badge, Card, ListGroup, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../../context/MessageContext";

const MessageList = () => {
  const { conversations, unreadCount, refreshConversations, loading } =
    useMessage();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner />
      </div>
    );
  }

  return (
    <Card>
      <Card.Header className="bg-primary text-white d-flex justify-content-between">
        <h5 className="mb-0">Messages</h5>
        {unreadCount > 0 && (
          <Badge bg="danger" pill>
            {unreadCount}
          </Badge>
        )}
      </Card.Header>

      <Card.Body className="p-0">
        {conversations.length === 0 ? (
          <div className="text-center py-5 text-muted">
            No conversations yet
          </div>
        ) : (
          <ListGroup variant="flush">
            {conversations.map((conv) => (
              <ListGroup.Item
                key={conv.userId}
                action
                onClick={() => navigate(`/messages/${conv.userId}`)}
              >
                <strong>{conv.userName}</strong>
                <div className="small text-muted">{conv.lastMessage}</div>
                {conv.unreadCount > 0 && (
                  <Badge bg="primary" pill className="float-end">
                    {conv.unreadCount}
                  </Badge>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};

export default MessageList;
