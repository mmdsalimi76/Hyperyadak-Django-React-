// services/api.js
import axios from "axios";

// Base configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to extract data from paginated or plain responses
const extractData = (response) => {
  const data = response.data;
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
};

// Request interceptor – attach auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (process.env.NODE_ENV === "development") {
    console.log(`➡️ ${config.method.toUpperCase()} ${config.url}`);
  }
  return config;
});

// Response interceptor – token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const { data } = await axios.post(
          `${API_BASE_URL}/api/token/refresh/`,
          { refresh: refreshToken },
        );
        if (data.access) {
          localStorage.setItem("access_token", data.access);
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

// ---------- Auth API ----------
export const authAPI = {
  login: async (phone_number, password) => {
    try {
      const response = await api.post("/api/token/", {
        phone_number,
        password,
      });
      const { access, refresh } = response.data;
      if (access) {
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        api.defaults.headers.common.Authorization = `Bearer ${access}`;
      }
      return response;
    } catch (error) {
      console.error("Login error:", error.response?.data);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    delete api.defaults.headers.common.Authorization;
  },

  refreshToken: async () => {
    const refresh = localStorage.getItem("refresh_token");
    const response = await api.post("/api/token/refresh/", { refresh });
    if (response.data.access) {
      localStorage.setItem("access_token", response.data.access);
      api.defaults.headers.common.Authorization = `Bearer ${response.data.access}`;
    }
    return response;
  },

  getProfile: () => api.get("/accounts/api/v1/profile/"),
  updateProfile: (profileData) =>
    api.put("/accounts/api/v1/profile/", profileData),
  changePassword: (passwordData) =>
    api.post("/accounts/api/v1/change-password/", passwordData),
  getDashboard: () => api.get("/accounts/api/v1/dashboard/"),

  // Address (single)
  addAddress: (addressData) =>
    api.post("/accounts/api/v1/address/", addressData),
  updateAddress: (addressData) =>
    api.put("/accounts/api/v1/address/", addressData),
  deleteAddress: () => api.delete("/accounts/api/v1/address/"),

  payOrder: (orderId) => api.post(`/accounts/api/v1/orders/${orderId}/pay/`),
  cancelOrder: (orderId) =>
    api.post(`/accounts/api/v1/orders/${orderId}/cancel/`),
};

// ---------- Products API ----------
export const productAPI = {
  getCategories: () => api.get("/products/api/v1/categories/"),
  getCategoryBySlug: (slug) => api.get(`/products/api/v1/categories/${slug}/`),

  getCarBrands: () => api.get("/products/api/v1/brands/"),
  getCarBrandBySlug: (slug) => api.get(`/products/api/v1/brands/${slug}/`),
  getCarModels: (params = {}) =>
    api.get("/products/api/v1/models/", { params }),
  getCarModelBySlug: (slug) => api.get(`/products/api/v1/models/${slug}/`),

  getProductBrands: () => api.get("/products/api/v1/product-brands/"),
  getProductBrandBySlug: (slug) =>
    api.get(`/products/api/v1/product-brands/${slug}/`),

  getProducts: (params = {}) =>
    api.get("/products/api/v1/products/", { params }),
  getProductBySlug: (slug) => api.get(`/products/api/v1/products/${slug}/`),

  getHomepageData: () => api.get("/products/api/v1/homepage-data/"),
  getProductComments: async (productId) => {
    try {
      const response = await api.get(
        `/products/api/v1/products/${productId}/comments/`,
      );
      return response.data.results || response.data || [];
    } catch (error) {
      console.error("Get comments error:", error.response?.data);
      throw error;
    }
  },
  createProductComment: async (productId, text) => {
    try {
      const response = await api.post(
        `/products/api/v1/products/${productId}/comments/`,
        {
          product: productId,
          text,
        },
      );
      return response;
    } catch (error) {
      console.error("Create comment error:", error.response?.data);
      throw error;
    }
  },
};

// ---------- Cart API ----------
export const cartAPI = {
  // Get current user's cart
  getCart: async () => {
    const response = await api.get("/cart/api/v1/");
    return response.data;
  },

  // Add product to cart
  addToCart: async (productId, quantity = 1) => {
    const response = await api.post("/cart/api/v1/add/", {
      product: productId,
      quantity,
    });
    return response.data;
  },

  // Update quantity of a cart item
  updateCartItem: async (itemId, quantity) => {
    const response = await api.put(`/cart/api/v1/update/${itemId}/`, {
      quantity,
    });
    return response.data;
  },

  // Remove item from cart
  removeCartItem: async (itemId) => {
    const response = await api.delete(`/cart/api/v1/remove/${itemId}/`);
    return response.data;
  },

  // NEW: Refactored checkout to submit local/authenticated items to the order builder
  checkout: async (addressId, itemsPayload) => {
    const response = await api.post("/accounts/api/v1/orders/create/", {
      address_id: addressId,
      items: itemsPayload,
    });
    return response.data;
  },
};

// ---------- Tickets API ----------
export const ticketAPI = {
  getTickets: () => api.get("/tickets/api/v1/"),
  createTicket: (ticketData) => api.post("/tickets/api/v1/", ticketData),
  getTicketDetails: (id) => api.get(`/tickets/api/v1/${id}/`),
  replyTicket: (id, message) =>
    api.post(`/tickets/api/v1/${id}/reply/`, { message }),
};

export default api;
