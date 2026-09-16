
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : {
          "Content-Type": "application/json",
        }),
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
      data.message || data.error || "Something went wrong"
    );
  }

  return data;
};

export const getProducts = async (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();

  return apiRequest(
    `/products${query ? `?${query}` : ""}`
  );
};

export const getProduct = async (id) => {
  return apiRequest(`/products/${id}`);
};

export const getCategories = async () => {
  return apiRequest("/categories");
};

export const loginUser = async (email, password) => {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

export const registerUser = async (userData) => {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const getCurrentUser = async () => {
  return apiRequest("/auth/me");
};

export default API_URL;

