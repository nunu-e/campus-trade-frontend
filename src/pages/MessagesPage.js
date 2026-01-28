import { useState } from "react";
import { Alert, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { FaComments } from "react-icons/fa";
import ChatWindow from "../components/messages/ChatWindow";
import ConversationList from "../components/messages/ConversationList";
import { useAuth } from "../context/AuthContext";

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading] = useState(false);
  const { isVerified } = useAuth();

  const handleSelectConversation = (conversation) => {
    setSelectedConversation({
      _id: conversation.userId,
      name: conversation.userName,
      email: conversation.userEmail,
    });
  };

  if (!isVerified) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <h5>Email Verification Required</h5>
          <p>
            Please verify your AAU email address to access messaging features.
          </p>
          <p>
            Check your email for the verification link or request a new one from
            your profile.
          </p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid="lg" className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="fw-bold d-flex align-items-center">
            <FaComments className="me-3" /> Messages
          </h2>
          <p className="text-muted">
            Communicate with buyers and sellers securely
          </p>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading messages...</p>
        </div>
      ) : (
        <Row>
          <Col lg={4} className="mb-4 mb-lg-0">
            <Card className="h-100 shadow">
              <Card.Body className="p-0">
                <ConversationList
                  onSelectConversation={handleSelectConversation}
                  selectedUserId={selectedConversation?._id}
                />
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8}>
            {selectedConversation ? (
              <ChatWindow otherUser={selectedConversation} listingId={null} />
            ) : (
              <Card className="h-100 shadow d-flex align-items-center justify-content-center">
                <Card.Body className="text-center">
                  <FaComments size={64} className="text-muted mb-3" />
                  <h5>Select a conversation</h5>
                  <p className="text-muted">
                    Choose a conversation from the list to start messaging
                  </p>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default MessagesPage;
