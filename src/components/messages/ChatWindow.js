import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Form, InputGroup, Spinner } from "react-bootstrap";
import { FaClock, FaPaperPlane, FaUser } from "react-icons/fa";
import { useMessage } from "../../context/MessageContext";

const ChatWindow = ({ otherUser, listingId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const { sendMessage, socket } = useMessage();

  useEffect(() => {
    if (otherUser) {
      loadMessages();
    }
  }, [otherUser]);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (message) => {
        if (
          message.senderId === otherUser?._id ||
          message.receiverId === otherUser?._id
        ) {
          setMessages((prev) => [...prev, message]);
          scrollToBottom();
        }
      });

      return () => {
        socket.off("newMessage");
      };
    }
  }, [socket, otherUser]);

  const loadMessages = async () => {
    if (!otherUser) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `/api/messages/conversation/${otherUser._id}`,
      );
      setMessages(response.data);
      scrollToBottom();
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !otherUser || sending) return;

    setSending(true);

    const result = await sendMessage(otherUser._id, newMessage, listingId);

    if (result.success) {
      setMessages((prev) => [...prev, result.data]);
      setNewMessage("");
      scrollToBottom();
    }

    setSending(false);
  };

  const formatTime = (timestamp) => {
    return moment(timestamp).format("h:mm A");
  };

  const formatDate = (timestamp) => {
    return moment(timestamp).format("MMM D, YYYY");
  };

  if (!otherUser) {
    return (
      <Card className="h-100 shadow">
        <Card.Body className="d-flex align-items-center justify-content-center">
          <div className="text-center text-muted">
            <h5>Select a conversation</h5>
            <p>Choose a user from the list to start chatting</p>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="h-100 shadow">
      <Card.Header className="bg-white border-bottom">
        <div className="d-flex align-items-center">
          <div className="me-3">
            <div
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "40px", height: "40px" }}
            >
              <FaUser />
            </div>
          </div>
          <div>
            <h6 className="mb-0">{otherUser.name}</h6>
            <small className="text-muted">{otherUser.email}</small>
          </div>
        </div>
      </Card.Header>

      <Card.Body className="p-0" style={{ overflow: "hidden" }}>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <div
            className="p-3"
            style={{
              height: "400px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {messages.length === 0 ? (
              <div className="text-center text-muted mt-5">
                <h6>No messages yet</h6>
                <p>Start the conversation by sending a message</p>
              </div>
            ) : (
              <>
                {messages.map((message, index) => {
                  const isMyMessage = message.senderId._id !== otherUser._id;
                  const showDate =
                    index === 0 ||
                    formatDate(messages[index - 1].createdAt) !==
                      formatDate(message.createdAt);

                  return (
                    <React.Fragment key={message._id}>
                      {showDate && (
                        <div className="text-center my-3">
                          <Badge bg="light" text="dark" className="px-3 py-1">
                            {formatDate(message.createdAt)}
                          </Badge>
                        </div>
                      )}

                      <div
                        className={`d-flex mb-3 ${isMyMessage ? "justify-content-end" : "justify-content-start"}`}
                      >
                        <div
                          className={`rounded p-3 max-w-75 ${isMyMessage ? "bg-primary text-white" : "bg-light"}`}
                          style={{ maxWidth: "75%" }}
                        >
                          <div className="mb-1">{message.content}</div>
                          <div
                            className={`small d-flex align-items-center ${isMyMessage ? "text-white-50" : "text-muted"}`}
                          >
                            <FaClock className="me-1" size={12} />
                            {formatTime(message.createdAt)}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        )}
      </Card.Body>

      <Card.Footer className="bg-white border-top">
        <Form onSubmit={handleSendMessage}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Type your message here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={sending}
            />
            <Button
              type="submit"
              variant="primary"
              disabled={!newMessage.trim() || sending}
            >
              {sending ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <FaPaperPlane />
              )}
            </Button>
          </InputGroup>
        </Form>
      </Card.Footer>
    </Card>
  );
};

export default ChatWindow;
