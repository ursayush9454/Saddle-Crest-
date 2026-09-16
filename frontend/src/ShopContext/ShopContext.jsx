
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

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
      return normalizeProduct(item.product || item);
    })
    .filter(Boolean);
};

export const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingWishlist, setLoadingWishlist] =
    useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // GUEST CART
  // =====================================================

  const loadGuestCart = () => {
    try {
      const savedCart =
        JSON.parse(
          localStorage.getItem("saddleCart")
        ) || [];

      setCart(
        savedCart.map((item) => ({
          ...normalizeProduct(item),
          quantity: Number(item.quantity || 1),
        }))
      );
    } catch {
      setCart([]);
    }
  };

  // =====================================================
  // GUEST WISHLIST
  // =====================================================

  const loadGuestWishlist = () => {
    try {
      const savedWishlist =
        JSON.parse(
          localStorage.getItem("saddleWishlist")
        ) || [];

      setWishlist(
        savedWishlist
          .map(normalizeProduct)
          .filter(Boolean)
      );
    } catch {
      setWishlist([]);
    }
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
      console.error("Load Cart Error:", err);

      if (err.message?.toLowerCase().includes("token")) {
        clearAuth();
        loadGuestCart();
      }

      setError(err.message || "Unable to load cart");
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

      const data = await apiRequest("/wishlist");

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

      if (err.message?.toLowerCase().includes("token")) {
        clearAuth();
        loadGuestWishlist();
      }

      setError(
        err.message || "Unable to load wishlist"
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
  // GUEST LOCAL STORAGE
  // =====================================================

  useEffect(() => {
    if (!getToken()) {
      localStorage.setItem(
        "saddleCart",
        JSON.stringify(cart)
      );
    }
  }, [cart]);

  useEffect(() => {
    if (!getToken()) {
      localStorage.setItem(
        "saddleWishlist",
        JSON.stringify(wishlist)
      );
    }
  }, [wishlist]);

  // =====================================================
  // ADD TO WISHLIST
  // =====================================================

  const addToWishlist = async (product) => {
    const normalized = normalizeProduct(product);

    if (!normalized?.id) {
      throw new Error("Invalid product");
    }

    const token = getToken();

    // Guest
    if (!token) {
      setWishlist((prev) => {
        const exists = prev.some(
          (item) => item.id === normalized.id
        );

        if (exists) return prev;

        return [...prev, normalized];
      });

      return;
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
        err.message || "Unable to add to wishlist"
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
    const token = getToken();

    if (!token) {
      setWishlist((prev) =>
        prev.filter((item) => item.id !== id)
      );

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
        prev.filter((item) => item.id !== id)
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

  const toggleWishlist = async (product) => {
    const normalized = normalizeProduct(product);

    const exists = wishlist.some(
      (item) => item.id === normalized.id
    );

    if (exists) {
      await removeFromWishlist(normalized.id);
    } else {
      await addToWishlist(normalized);
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
    const normalized = normalizeProduct(product);

    if (!normalized?.id) {
      throw new Error("Invalid product");
    }

    if (normalized.stock <= 0) {
      throw new Error("Product is out of stock");
    }

    const safeQuantity = Math.max(
      1,
      Number(quantity || 1)
    );

    const token = getToken();

    // Guest cart
    if (!token) {
      setCart((prev) => {
        const exists = prev.find(
          (item) => item.id === normalized.id
        );

        if (exists) {
          const newQuantity =
            exists.quantity + safeQuantity;

          if (
            normalized.stock &&
            newQuantity > normalized.stock
          ) {
            return prev;
          }

          return prev.map((item) =>
            item.id === normalized.id
              ? {
                  ...item,
                  quantity: newQuantity,
                }
              : item
          );
        }

        return [
          ...prev,
          {
            ...normalized,
            quantity: safeQuantity,
          },
        ];
      });

      return;
    }

    try {
      setLoadingCart(true);
      setError("");

      await apiRequest("/cart", {
        method: "POST",
        body: JSON.stringify({
          productId: normalized.id,
          quantity: safeQuantity,
        }),
      });

      await loadCart();
    } catch (err) {
      console.error(
        "Add Cart Error:",
        err
      );

      setError(
        err.message || "Unable to add to cart"
      );

      throw err;
    } finally {
      setLoadingCart(false);
    }
  };

  // =====================================================
  // REMOVE FROM CART
  // =====================================================

  const removeFromCart = async (id) => {
    const token = getToken();

    if (!token) {
      setCart((prev) =>
        prev.filter((item) => item.id !== id)
      );

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
        prev.filter((item) => item.id !== id)
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
    const safeQuantity = Number(quantity);

    if (!Number.isFinite(safeQuantity)) {
      return;
    }

    if (safeQuantity <= 0) {
      await removeFromCart(id);
      return;
    }

    const token = getToken();

    // Guest
    if (!token) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: Math.min(
                  safeQuantity,
                  item.stock || safeQuantity
                ),
              }
            : item
        )
      );

      return;
    }

    try {
      setLoadingCart(true);
      setError("");

      await apiRequest("/cart/update", {
        method: "PUT",
        body: JSON.stringify({
          productId: id,
          quantity: safeQuantity,
        }),
      });

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

  const increaseQuantity = async (id) => {
    const item = cart.find(
      (product) => product.id === id
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

  const decreaseQuantity = async (id) => {
    const item = cart.find(
      (product) => product.id === id
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
    const token = getToken();

    if (!token) {
      setCart([]);
      return;
    }

    try {
      setLoadingCart(true);
      setError("");

      await apiRequest("/cart/clear", {
        method: "DELETE",
      });

      setCart([]);
    } catch (err) {
      console.error(
        "Clear Cart Error:",
        err
      );

      setError(
        err.message || "Unable to clear cart"
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
      total + Number(item.quantity || 0),
    0
  );

  const wishlistCount =
    wishlist.length;

  // =====================================================
  // SUBTOTAL
  // =====================================================

  const cartSubtotal = cart.reduce(
    (total, item) => {
      const price =
        item.salePrice !== null &&
        item.salePrice !== undefined
          ? item.salePrice
          : item.price;

      return (
        total +
        Number(price || 0) *
          Number(item.quantity || 0)
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
  const context = useContext(ShopContext);

  if (!context) {
    throw new Error(
      "useShop must be used inside ShopProvider"
    );
  }

  return context;
};

export default ShopContext;

