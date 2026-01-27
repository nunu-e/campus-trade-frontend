// Listing statuses
export const LISTING_STATUS = {
  AVAILABLE: "Available",
  RESERVED: "Reserved",
  SOLD: "Sold",
};

// Transaction statuses
export const TRANSACTION_STATUS = {
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  PENDING: "Pending",
  RESERVED: "Reserved",
};

// User roles
export const USER_ROLE = {
  ADMIN: "admin",
  USER: "user",
};

// API defaults
export const API_DEFAULTS = {
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:5000",
};

// WebSocket defaults
export const WS_DEFAULTS = {
  URL: process.env.REACT_APP_WS_URL || "http://localhost:5000",
};
