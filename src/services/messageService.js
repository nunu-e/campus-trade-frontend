import { io } from "socket.io-client";
import api from "./api";

class MessageService {
  constructor() {
    this.socket = null;
    this.messageListeners = [];
    this.notificationListeners = [];
  }

  // Connect to WebSocket
  connect(token) {
    if (this.socket) {
      this.disconnect();
    }

    // Socket.IO accepts http/https URLs, not ws/wss
    // It will automatically use the correct protocol (ws/wss) internally
    let socketUrl = process.env.REACT_APP_WS_URL || "http://localhost:5000";
    
    // Convert wss:// to https:// and ws:// to http:// for Socket.IO
    socketUrl = socketUrl.replace(/^wss?:\/\//, (match) => 
      match === 'wss://' ? 'https://' : 'http://'
    );

    this.socket = io(socketUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    this.socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    this.socket.on("newMessage", (message) => {
      this.messageListeners.forEach((listener) => listener(message));
    });

    this.socket.on("notification", (notification) => {
      this.notificationListeners.forEach((listener) => listener(notification));
    });

    this.socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  }

  // Disconnect from WebSocket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Send a message
  async sendMessage(receiverId, content, listingId = null) {
    try {
      const response = await api.post("/api/messages", {
        receiverId,
        content,
        listingId,
      });

      // Emit via WebSocket if connected
      if (this.socket) {
        this.socket.emit("sendMessage", {
          receiverId,
          content,
          listingId,
        });
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get conversations
  async getConversations() {
    try {
      const response = await api.get("/api/messages/conversations");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get conversation with specific user
  async getConversation(userId) {
    try {
      const response = await api.get(`/api/messages/conversation/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get unread message count
  async getUnreadCount() {
    try {
      const response = await api.get("/api/messages/unread-count");
      return response.data.unreadCount;
    } catch (error) {
      throw error;
    }
  }

  // Mark message as read
  async markAsRead(messageId) {
    try {
      const response = await api.put(`/api/messages/${messageId}/read`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Add message listener
  onMessage(listener) {
    this.messageListeners.push(listener);
    return () => {
      this.messageListeners = this.messageListeners.filter(
        (l) => l !== listener,
      );
    };
  }

  // Add notification listener
  onNotification(listener) {
    this.notificationListeners.push(listener);
    return () => {
      this.notificationListeners = this.notificationListeners.filter(
        (l) => l !== listener,
      );
    };
  }

  // Send typing indicator
  sendTyping(receiverId, isTyping) {
    if (this.socket) {
      this.socket.emit("typing", { receiverId, isTyping });
    }
  }

  // Send read receipt
  sendReadReceipt(messageId) {
    if (this.socket) {
      this.socket.emit("markAsRead", messageId);
    }
  }

  // Send transaction notification
  sendTransactionNotification(transactionId, userId, message) {
    if (this.socket) {
      this.socket.emit("transactionUpdate", { transactionId, userId, message });
    }
  }
}

export default new MessageService();
