import moment from "moment";
import { useEffect, useState } from "react";
import { Badge, Form, InputGroup, ListGroup, Spinner } from "react-bootstrap";
import { FaClock, FaSearch, FaUserCircle } from "react-icons/fa";
import { useMessage } from "../../context/MessageContext";

const ConversationList = ({ onSelectConversation, selectedUserId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredConversations, setFilteredConversations] = useState([]);
  const { conversations, refreshConversations, loading } = useMessage();

  useEffect(() => {
    refreshConversations();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = conversations.filter(
        (conv) =>
          conv.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(conversations);
    }
  }, [conversations, searchTerm]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    const now = moment();
    const messageTime = moment(timestamp);

    if (now.diff(messageTime, "days") < 1) {
      return messageTime.format("h:mm A");
    } else if (now.diff(messageTime, "days") < 7) {
      return messageTime.format("ddd");
    } else {
      return messageTime.format("MMM D");
    }
  };

  const truncateText = (text, maxLength = 40) => {
    if (!text) return "No messages yet";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="h-100 d-flex flex-column">
      <div className="p-3 border-bottom">
        <h5 className="mb-3">Messages</h5>
        <InputGroup>
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </div>

      <div className="flex-grow-1 overflow-auto">
        {filteredConversations.length === 0 ? (
          <div className="text-center p-5 text-muted">
            <FaUserCircle size={48} className="mb-3" />
            <p>No conversations yet</p>
            <small>Start a conversation from a listing</small>
          </div>
        ) : (
          <ListGroup variant="flush">
            {filteredConversations.map((conversation) => (
              <ListGroup.Item
                key={conversation.userId}
                action
                active={selectedUserId === conversation.userId}
                onClick={() => onSelectConversation(conversation)}
                className="py-3 border-bottom"
              >
                <div className="d-flex align-items-center">
                  <div className="position-relative me-3">
                    <div
                      className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "50px", height: "50px" }}
                    >
                      <FaUserCircle size={24} />
                    </div>
                    {conversation.unreadCount > 0 && (
                      <Badge
                        bg="danger"
                        pill
                        className="position-absolute top-0 end-0 translate-middle"
                      >
                        {conversation.unreadCount > 9
                          ? "9+"
                          : conversation.unreadCount}
                      </Badge>
                    )}
                  </div>

                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <h6 className="mb-0">{conversation.userName}</h6>
                      <small className="text-muted">
                        <FaClock className="me-1" size={10} />
                        {formatTime(conversation.lastMessageTime)}
                      </small>
                    </div>

                    <p className="text-muted mb-0 small">
                      {truncateText(conversation.lastMessage)}
                    </p>

                    <div className="d-flex justify-content-between align-items-center mt-1">
                      <small className="text-muted">
                        {conversation.userEmail}
                      </small>
                    </div>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
