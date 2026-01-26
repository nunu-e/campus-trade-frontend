import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const MessageContext = createContext({});

export const useMessage = () => useContext(MessageContext);

export const MessageProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.token) {
      const newSocket = io("http://localhost:5000", {
        auth: { token: user.token },
      });

      newSocket.on("connect", () => {
        console.log("Connected to WebSocket server");
      });

      newSocket.on("newMessage", (message) => {
        // Update conversations
        setConversations((prev) => {
          const updated = [...prev];
          const convIndex = updated.findIndex(
            (c) =>
              c.userId === message.senderId._id ||
              c.userId === message.receiverId._id,
          );

          if (convIndex > -1) {
            updated[convIndex].lastMessage = message.content;
            updated[convIndex].lastMessageTime = message.createdAt;
            updated[convIndex].unreadCount += 1;
          }

          return updated;
        });

        setUnreadCount((prev) => prev + 1);
      });

      newSocket.on("notification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      });

      setSocket(newSocket);

      // Load initial data
      loadConversations();
      loadUnreadCount();

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  const loadConversations = async () => {
    try {
      const response = await axios.get("/api/messages/conversations");
      setConversations(response.data);
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await axios.get("/api/messages/unread-count");
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error("Error loading unread count:", error);
    }
  };

  const sendMessage = async (receiverId, content, listingId = null) => {
    try {
      const response = await axios.post("/api/messages", {
        receiverId,
        content,
        listingId,
      });

      if (socket) {
        socket.emit("sendMessage", {
          receiverId,
          content,
          listingId,
        });
      }

      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error sending message:", error);
      return { success: false, error: error.response?.data?.message };
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await axios.put(`/api/messages/${messageId}/read`);
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const value = {
    socket,
    conversations,
    unreadCount,
    notifications,
    sendMessage,
    markAsRead,
    refreshConversations: loadConversations,
  };

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
};
