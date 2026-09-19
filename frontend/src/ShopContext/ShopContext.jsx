import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useLocation, useNavigate } from "react-router-dom";

import {
  apiRequest,
  getToken,
  clearAuth,
} from "../services/api";

const ShopContext = createContext(null);

const getProductId = (product) => {
  return product?._id || product?.id || product?.productId;
};

const normalizeProduct = (product) => {
  if (!product) return null;

  const id = getProductId(product);

  return {
    ...product,
    id,
    productId: id,
    _id: product._id || id,
    price: Number(product.price || 0),
    salePrice:
      product.salePrice !== undefined &&
      product.salePrice !== null
        ? Number(product.salePrice)
        : null,
    stock: Number(product.stock || 0),
  };
};

const normalizeCartItems = (items = []) => {
  return items
    .map((item) => {
      const product = normalizeProduct(
        item.product || item
      );

      if (!product) return null;

      return {
        ...product,
        quantity: Number(item.quantity || 1),
      };
    })
    .filter(Boolean);
};

const normalizeWishlistItems = (items = []) => {
  return items
    .map((item) => {
      return normalizeProduct(
        item.product || item
      );
    })
    .filter(Boolean);
};

export const ShopProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingWishlist, setLoadingWishlist] =
    useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // LOGIN REQUIRED HELPER
  // =====================================================

  const requireLogin = (message) => {
    const token = getToken();

    if (token) {
      return true;
    }

    setError("");

    navigate("/login", {
      state: {
        from:
          location.pathname +
          location.search,
        message:
          message ||
          "Please login to continue.",
      },
    });

    return false;
  };

  // =====================================================
  // GUEST CART
  // =====================================================

  const loadGuestCart = () => {
    /*
     * Guest cart is intentionally disabled.
     *
     * Users must login before using cart.
     */

    setCart([]);
  };

  // =====================================================
  // GUEST WISHLIST
  // =====================================================

  const loadGuestWishlist = () => {
    /*
     * Guest wishlist is intentionally disabled.
     *
     * Users must login before using wishlist.
     */

    setWishlist([]);
  };

  // =====================================================
  // LOAD CART
  // =====================================================

  const loadCart = async () => {
    const token = getToken();

    if (!token) {
      loadGuestCart();
      return;
    }

    try {
      setLoadingCart(true);
      setError("");

      const data = await apiRequest("/cart");

      const items =
        data?.cart?.items ||
        data?.items ||
        [];

      setCart(normalizeCartItems(items));
    } catch (err) {
      console.error(
        "Load Cart Error:",
        err
      );

      if (
        err.message
          ?.toLowerCase()
          .includes("token")
      ) {
        clearAuth();

        setCart([]);
        setWishlist([]);

        navigate("/login", {
          replace: true,
          state: {
            from:
              location.pathname +
              location.search,
            message:
              "Your session has expired. Please login again.",
          },
        });

        return;
      }

      setError(
        err.message ||
          "Unable to load cart"
      );
    } finally {
      setLoadingCart(false);
    }
  };

  // =====================================================
  // LOAD WISHLIST
  // =====================================================

  const loadWishlist = async () => {
    const token = getToken();

    if (!token) {
      loadGuestWishlist();
      return;
    }

    try {
      setLoadingWishlist(true);
      setError("");

      const data = await apiRequest(
        "/wishlist"
      );

      const items =
        data?.wishlist?.products ||
        data?.wishlist ||
        data?.products ||
        [];

      setWishlist(
        normalizeWishlistItems(items)
      );
    } catch (err) {
      console.error(
        "Load Wishlist Error:",
        err
      );

      if (
        err.message
          ?.toLowerCase()
          .includes("token")
      ) {
        clearAuth();

        setCart([]);
        setWishlist([]);

        navigate("/login", {
          replace: true,
          state: {
            from:
              location.pathname +
              location.search,
            message:
              "Your session has expired. Please login again.",
          },
        });

        return;
      }

      setError(
        err.message ||
          "Unable to load wishlist"
      );
    } finally {
      setLoadingWishlist(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadCart();
    loadWishlist();

    const handleAuthChange = () => {
      loadCart();
      loadWishlist();
    };

    window.addEventListener(
      "auth-change",
      handleAuthChange
    );

    return () => {
      window.removeEventListener(
        "auth-change",
        handleAuthChange
      );
    };
  }, []);

  // =====================================================
  // REMOVE OLD GUEST STORAGE
  // =====================================================

  useEffect(() => {
    /*
     * Old guest cart/wishlist data should not remain
     * after we switch to login-required behavior.
     */

    if (!getToken()) {
      localStorage.removeItem(
        "saddleCart"
      );

      localStorage.removeItem(
        "saddleWishlist"
      );
    }
  }, [cart, wishlist]);

  // =====================================================
  // ADD TO WISHLIST
  // =====================================================

  const addToWishlist = async (product) => {
    /*
     * LOGIN REQUIRED
     */

    if (
      !requireLogin(
        "Please login to add products to your wishlist."
      )
    ) {
      return;
    }

    const normalized =
      normalizeProduct(product);

    if (!normalized?.id) {
      throw new Error(
        "Invalid product"
      );
    }

    try {
      setLoadingWishlist(true);
      setError("");

      await apiRequest("/wishlist", {
        method: "POST",
        body: JSON.stringify({
          productId: normalized.id,
        }),
      });

      await loadWishlist();
    } catch (err) {
      console.error(
        "Add Wishlist Error:",
        err
      );

      setError(
        err.message ||
          "Unable to add to wishlist"
      );

      throw err;
    } finally {
      setLoadingWishlist(false);
    }
  };

  // =====================================================
  // REMOVE FROM WISHLIST
  // =====================================================

  const removeFromWishlist = async (id) => {
    /*
     * LOGIN REQUIRED
     */

    if (
      !requireLogin(
        "Please login to manage your wishlist."
      )
    ) {
      return;
    }

    try {
      setLoadingWishlist(true);
      setError("");

      await apiRequest(
        `/wishlist/${id}`,
        {
          method: "DELETE",
        }
      );

      setWishlist((prev) =>
        prev.filter(
          (item) => item.id !== id
        )
      );
    } catch (err) {
      console.error(
        "Remove Wishlist Error:",
        err
      );

      setError(
        err.message ||
          "Unable to remove from wishlist"
      );

      throw err;
    } finally {
      setLoadingWishlist(false);
    }
  };

  // =====================================================
  // TOGGLE WISHLIST
  // =====================================================

  const toggleWishlist = async (
    product
  ) => {
    /*
     * LOGIN REQUIRED
     */

    if (
      !requireLogin(
        "Please login to use your wishlist."
      )
    ) {
      return;
    }

    const normalized =
      normalizeProduct(product);

    if (!normalized?.id) {
      throw new Error(
        "Invalid product"
      );
    }

    const exists = wishlist.some(
      (item) =>
        item.id === normalized.id
    );

    if (exists) {
      await removeFromWishlist(
        normalized.id
      );
    } else {
      await addToWishlist(
        normalized
      );
    }
  };

  // =====================================================
  // IS IN WISHLIST
  // =====================================================

  const isInWishlist = (id) => {
    return wishlist.some(
      (item) => item.id === id
    );
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const addToCart = async (
    product,
    quantity = 1
  ) => {
    /*
     * LOGIN REQUIRED
     */

    if (
      !requireLogin(
        "Please login to add products to your cart."
      )
    ) {
      return;
    }

    const normalized =
      normalizeProduct(product);

    if (!normalized?.id) {
      throw new Error(
        "Invalid product"
      );
    }

    if (normalized.stock <= 0) {
      throw new Error(
        "Product is out of stock"
      );
    }

    const safeQuantity = Math.max(
      1,
      Number(quantity || 1)
    );

    try {
      setLoadingCart(true);
      setError("");

      await apiRequest("/cart", {
        method: "POST",
        body: JSON.stringify({
          productId:
            normalized.id,
          quantity:
            safeQuantity,
        }),
      });

      await loadCart();
    } catch (err) {
      console.error(
        "Add Cart Error:",
        err
      );

      setError(
        err.message ||
          "Unable to add to cart"
      );

      throw err;
    } finally {
      setLoadingCart(false);
    }
  };

  // =====================================================
  // REMOVE FROM CART
  // =====================================================

  const removeFromCart = async (
    id
  ) => {
    /*
     * LOGIN REQUIRED
     */

    if (
      !requireLogin(
        "Please login to manage your cart."
      )
    ) {
      return;
    }

    try {
      setLoadingCart(true);
      setError("");

      await apiRequest(
        `/cart/remove/${id}`,
        {
          method: "DELETE",
        }
      );

      setCart((prev) =>
        prev.filter(
          (item) => item.id !== id
        )
      );
    } catch (err) {
      console.error(
        "Remove Cart Error:",
        err
      );

      setError(
        err.message ||
          "Unable to remove from cart"
      );

      throw err;
    } finally {
      setLoadingCart(false);
    }
  };

  // =====================================================
  // UPDATE QUANTITY
  // =====================================================

  const updateQuantity = async (
    id,
    quantity
  ) => {
    /*
     * LOGIN REQUIRED
     */

    if (
      !requireLogin(
        "Please login to update your cart."
      )
    ) {
      return;
    }

    const safeQuantity =
      Number(quantity);

    if (
      !Number.isFinite(
        safeQuantity
      )
    ) {
      return;
    }

    if (safeQuantity <= 0) {
      await removeFromCart(id);
      return;
    }

    try {
      setLoadingCart(true);
      setError("");

      await apiRequest(
        "/cart/update",
        {
          method: "PUT",
          body: JSON.stringify({
            productId: id,
            quantity:
              safeQuantity,
          }),
        }
      );

      await loadCart();
    } catch (err) {
      console.error(
        "Update Cart Error:",
        err
      );

      setError(
        err.message ||
          "Unable to update cart"
      );

      throw err;
    } finally {
      setLoadingCart(false);
    }
  };

  // =====================================================
  // INCREASE
  // =====================================================

  const increaseQuantity = async (
    id
  ) => {
    if (
      !requireLogin(
        "Please login to update your cart."
      )
    ) {
      return;
    }

    const item = cart.find(
      (product) =>
        product.id === id
    );

    if (!item) return;

    if (
      item.stock &&
      item.quantity >= item.stock
    ) {
      return;
    }

    await updateQuantity(
      id,
      item.quantity + 1
    );
  };

  // =====================================================
  // DECREASE
  // =====================================================

  const decreaseQuantity = async (
    id
  ) => {
    if (
      !requireLogin(
        "Please login to update your cart."
      )
    ) {
      return;
    }

    const item = cart.find(
      (product) =>
        product.id === id
    );

    if (!item) return;

    if (item.quantity <= 1) {
      return;
    }

    await updateQuantity(
      id,
      item.quantity - 1
    );
  };

  // =====================================================
  // CLEAR CART
  // =====================================================

  const clearCart = async () => {
    if (
      !requireLogin(
        "Please login to manage your cart."
      )
    ) {
      return;
    }

    try {
      setLoadingCart(true);
      setError("");

      await apiRequest(
        "/cart/clear",
        {
          method: "DELETE",
        }
      );

      setCart([]);
    } catch (err) {
      console.error(
        "Clear Cart Error:",
        err
      );

      setError(
        err.message ||
          "Unable to clear cart"
      );

      throw err;
    } finally {
      setLoadingCart(false);
    }
  };

  // =====================================================
  // COUNTS
  // =====================================================

  const cartCount = cart.reduce(
    (total, item) =>
      total +
      Number(
        item.quantity || 0
      ),
    0
  );

  const wishlistCount =
    wishlist.length;

  // =====================================================
  // SUBTOTAL
  // =====================================================

  const cartSubtotal =
    cart.reduce(
      (total, item) => {
        const price =
          item.salePrice !== null &&
          item.salePrice !== undefined
            ? item.salePrice
            : item.price;

        return (
          total +
          Number(price || 0) *
            Number(
              item.quantity || 0
            )
        );
      },
      0
    );

  // =====================================================
  // CLEAR ERROR
  // =====================================================

  const clearError = () => {
    setError("");
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,

        loadingCart,
        loadingWishlist,

        error,
        setError,
        clearError,

        loadCart,
        loadWishlist,

        addToCart,
        removeFromCart,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity,
        clearCart,

        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,

        cartCount,
        wishlistCount,
        cartSubtotal,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context =
    useContext(ShopContext);

  if (!context) {
    throw new Error(
      "useShop must be used inside ShopProvider"
    );
  }

  return context;
};

export default ShopContext;