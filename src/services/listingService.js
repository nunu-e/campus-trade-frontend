import api from "./api";

export const listingService = {
  // Get all listings with optional filters
  getAll: async (filters = {}) => {
    try {
      const params = {
        status: "Available",
        ...filters,
      };

      const response = await api.get("/api/listings", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single listing by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/api/listings/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new listing
  create: async (listingData) => {
    try {
      const response = await api.post("/api/listings", listingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update listing
  update: async (id, listingData) => {
    try {
      const response = await api.put(`/api/listings/${id}`, listingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete listing
  delete: async (id) => {
    try {
      const response = await api.delete(`/api/listings/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search listings
  search: async (searchParams) => {
    try {
      const response = await api.get("/api/listings/search", {
        params: searchParams,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Reserve a listing
  reserve: async (id) => {
    try {
      const response = await api.post(`/api/listings/${id}/reserve`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user's listings
  getMyListings: async () => {
    try {
      const response = await api.get("/api/listings/my-listings");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload listing images
  uploadImages: async (images) => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await api.post("/api/listings/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
