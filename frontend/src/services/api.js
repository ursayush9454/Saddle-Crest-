// frontend/src/services/api.js

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* =========================================================
   AUTH
========================================================= */

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

export const setAuth = (token, user) => {
  localStorage.setItem("token", token);

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  window.dispatchEvent(new Event("auth-change"));
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.dispatchEvent(new Event("auth-change"));
};

/* =========================================================
   MAIN API REQUEST
========================================================= */

export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    clearAuth();
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        data.error ||
        "Something went wrong"
    );
  }

  return data;
};

/* =========================================================
   AUTH APIs
========================================================= */

export const registerUser = async (userData) => {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const loginUser = async (userData) => {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const getCurrentUser = async () => {
  return apiRequest("/auth/me");
};

export const updateProfile = async (profileData) => {
  return apiRequest("/auth/profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
};

export const changePassword = async (passwordData) => {
  return apiRequest("/auth/change-password", {
    method: "PUT",
    body: JSON.stringify(passwordData),
  });
};

/* =========================================================
   PRODUCTS
========================================================= */

export const getProducts = async (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      query.append(key, value);
    }
  });

  const queryString = query.toString();

  return apiRequest(
    `/products${queryString ? `?${queryString}` : ""}`
  );
};

export const getProduct = async (productId) => {
  return apiRequest(`/products/${productId}`);
};

/* =========================================================
   CATEGORIES
========================================================= */

export const getCategories = async () => {
  return apiRequest("/categories");
};

/* =========================================================
   CART
========================================================= */

export const getCart = async () => {
  return apiRequest("/cart");
};

export const addToCart = async (productId, quantity = 1) => {
  return apiRequest("/cart", {
    method: "POST",
    body: JSON.stringify({
      productId,
      quantity,
    }),
  });
};

export const updateCartItem = async (
  productId,
  quantity
) => {
  return apiRequest(`/cart/${productId}`, {
    method: "PUT",
    body: JSON.stringify({
      quantity,
    }),
  });
};

export const removeFromCart = async (productId) => {
  return apiRequest(`/cart/${productId}`, {
    method: "DELETE",
  });
};

export const clearCart = async () => {
  return apiRequest("/cart", {
    method: "DELETE",
  });
};

/* =========================================================
   WISHLIST
========================================================= */

export const getWishlist = async () => {
  return apiRequest("/wishlist");
};

export const addToWishlist = async (productId) => {
  return apiRequest("/wishlist", {
    method: "POST",
    body: JSON.stringify({
      productId,
    }),
  });
};

export const removeFromWishlist = async (productId) => {
  return apiRequest(`/wishlist/${productId}`, {
    method: "DELETE",
  });
};

/* =========================================================
   COUPONS
========================================================= */

export const validateCoupon = async (couponCode, cartTotal) => {
  return apiRequest("/coupons/validate", {
    method: "POST",
    body: JSON.stringify({
      code: couponCode,
      cartTotal,
    }),
  });
};

/* =========================================================
   ORDERS
========================================================= */

export const placeOrder = async (orderData) => {
  return apiRequest("/orders/place", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
};

export const getMyOrders = async () => {
  return apiRequest("/orders/my-orders");
};

export const getOrderById = async (orderId) => {
  return apiRequest(`/orders/${orderId}`);
};

export const cancelOrder = async (
  orderId,
  reason = ""
) => {
  return apiRequest(`/orders/cancel/${orderId}`, {
    method: "PUT",
    body: JSON.stringify({
      reason,
    }),
  });
};

/* =========================================================
   REVIEWS
========================================================= */

/*
  Get all reviews for a product
*/
export const getProductReviews = async (productId) => {
  return apiRequest(
    `/reviews/product/${productId}`
  );
};

/*
  Check whether logged-in user can review product
*/
export const getReviewEligibility = async (productId) => {
  return apiRequest(
    `/reviews/eligibility/${productId}`
  );
};

/*
  Create review
*/
export const createReview = async (reviewData) => {
  return apiRequest("/reviews", {
    method: "POST",
    body: JSON.stringify(reviewData),
  });
};

/*
  Update review
*/
export const updateReview = async (
  reviewId,
  reviewData
) => {
  return apiRequest(`/reviews/${reviewId}`, {
    method: "PUT",
    body: JSON.stringify(reviewData),
  });
};

/*
  Delete review
*/
export const deleteReview = async (reviewId) => {
  return apiRequest(`/reviews/${reviewId}`, {
    method: "DELETE",
  });
};

/*
  Mark review helpful
*/
export const markReviewHelpful = async (reviewId) => {
  return apiRequest(`/reviews/${reviewId}/helpful`, {
    method: "POST",
  });
};

/* =========================================================
   REVIEW PHOTO UPLOAD
========================================================= */

/*
  Upload review photos to Cloudinary

  files = [
    File,
    File,
    File
  ]

  Backend endpoint:
  POST /reviews/upload-images
*/

export const uploadReviewImages = async (files) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  return apiRequest("/reviews/upload-images", {
    method: "POST",
    body: formData,
  });
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default API_URL;