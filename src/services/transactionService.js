import api from "./api";

export const transactionService = {
  // Create a new transaction
  create: async (transactionData) => {
    try {
      const response = await api.post("/api/transactions", transactionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user's transactions
  getMyTransactions: async () => {
    try {
      const response = await api.get("/api/transactions/my-transactions");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get transaction by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/api/transactions/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update transaction status
  updateStatus: async (id, status) => {
    try {
      const response = await api.put(`/api/transactions/${id}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cancel transaction
  cancel: async (id, reason) => {
    try {
      const response = await api.put(`/api/transactions/${id}/cancel`, {
        reason,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Complete transaction
  complete: async (id) => {
    try {
      const response = await api.put(`/api/transactions/${id}/complete`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get transaction statistics
  getStats: async () => {
    try {
      const transactions = await transactionService.getMyTransactions();

      const stats = {
        total: transactions.length,
        completed: transactions.filter((t) => t.status === "Completed").length,
        reserved: transactions.filter((t) => t.status === "Reserved").length,
        cancelled: transactions.filter((t) => t.status === "Cancelled").length,
        totalAmount: transactions.reduce((sum, t) => sum + (t.amount || 0), 0),
      };

      return stats;
    } catch (error) {
      throw error;
    }
  },

  // Check if user can review a transaction
  canReview: (transaction, userId) => {
    if (!transaction || transaction.status !== "Completed") {
      return false;
    }

    // Check if user is part of the transaction
    const isBuyer = transaction.buyerId._id === userId;
    const isSeller = transaction.sellerId._id === userId;

    if (!isBuyer && !isSeller) {
      return false;
    }

    // Check if review was already left
    // This would need to check the reviews collection
    return true;
  },
};
