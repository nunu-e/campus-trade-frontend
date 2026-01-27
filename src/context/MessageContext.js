import axios from "axios";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const MessageContext = createContext({});
export const useMessage = () => useContext(MessageContext);

export const MessageProvider = ({ children }) => {
  const { user } = useAuth();

  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const authAxios = useMemo(() => {
    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
    return axios.create({
      baseURL: API_BASE_URL,
      headers: {
        Authorization: user?.token ? `Bearer ${user.token}` : "",
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
  }, [user?.token]);

  const loadConversations = useCallback(async () => {
    try {
      const res = await authAxios.get("/api/messages/conversations");
      setConversations(res.data || []);
    } catch (err) {
      console.error("❌ Load conversations failed:", err);
    }
  }, [authAxios]);

  const loadUnreadCount = useCallback(async () => {
    try {
      const res = await authAxios.get("/api/messages/unread-count");
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error("❌ Load unread count failed:", err);
    }
  }, [authAxios]);

  useEffect(() => {
    if (!user?.token) return;

    // Socket.IO accepts http/https URLs, not ws/wss
    // It will automatically use the correct protocol (ws/wss) internally
    const socketUrl = process.env.REACT_APP_WS_URL || "http://localhost:5000";
    
    // Convert wss:// to https:// and ws:// to http:// for Socket.IO
    const normalizedUrl = socketUrl.replace(/^wss?:\/\//, (match) => 
      match === 'wss://' ? 'https://' : 'http://'
    );

    const newSocket = io(normalizedUrl, {
      auth: { token: user.token },
    });

    const handleNewMessage = (message) => {
      const senderId =
        typeof message.senderId === "object"
          ? message.senderId._id
          : message.senderId;

      setConversations((prev) => {
        const filtered = prev.filter((c) => c.userId !== senderId);
        const existing = prev.find((c) => c.userId === senderId);

        const updatedConversation = {
          userId: senderId,
          userName: message.senderId?.name || existing?.userName || "User",
          userEmail: message.senderId?.email || existing?.userEmail || "",
          lastMessage: message.content,
          lastMessageTime: message.createdAt,
          unreadCount: (existing?.unreadCount || 0) + 1,
        };

        return [updatedConversation, ...filtered];
      });

      setUnreadCount((prev) => prev + 1);
    };

    const handleNotification = (notification) => {
      // ✅ Ignore email verification notifications
      if (notification.type === "emailVerified") return;
      setNotifications((prev) => [notification, ...prev]);
    };

    newSocket.on("connect", () => {
      console.log("✅ Connected to WebSocket");
    });

    newSocket.on("newMessage", handleNewMessage);
    newSocket.on("notification", handleNotification);

    setSocket(newSocket);

    loadConversations();
    loadUnreadCount();

    return () => {
      newSocket.off("newMessage", handleNewMessage);
      newSocket.off("notification", handleNotification);
      newSocket.disconnect();
    };
  }, [user?.token, authAxios, loadConversations, loadUnreadCount]);

  const fetchConversationMessages = async (userId) => {
    try {
      const res = await authAxios.get(`/api/messages/conversation/${userId}`);
      return res.data;
    } catch (err) {
      console.error("❌ Load messages failed:", err);
      return [];
    }
  };

  const sendMessage = async (receiverId, content, listingId = null) => {
    try {
      const res = await authAxios.post("/api/messages", {
        receiverId,
        content,
        listingId,
      });

      return { success: true, data: res.data };
    } catch (err) {
      console.error("❌ Send message failed:", err);
      return {
        success: false,
        error: err.response?.data?.message || "Send failed",
      };
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await authAxios.put(`/api/messages/${messageId}/read`);
      loadUnreadCount(); // resync instead of guessing
    } catch (err) {
      console.error("❌ Mark as read failed:", err);
    }
  };

  const value = {
    socket,
    conversations,
    unreadCount,
    notifications,
    sendMessage,
    fetchConversationMessages,
    markAsRead,
    refreshConversations: loadConversations,
    currentUser: user,
  };

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
};
