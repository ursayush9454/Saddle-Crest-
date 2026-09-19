import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  UserRound,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";

import "./Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useShop } from "../ShopContext/ShopContext";
import { getUser } from "../services/api";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const Navbar = ({
  navbarBackground = "transparent",
  top = "0",
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(getUser());

  // SEARCH
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchSearched, setSearchSearched] = useState(false);

  const searchInputRef = useRef(null);
  const searchTimerRef = useRef(null);

  const { cartCount, wishlistCount } = useShop();

  // =========================================
  // NAVIGATION ITEMS
  // =========================================

  const navItems = [
    {
      label: "Shop",
      path: "/shop",
    },
    {
      label: "About",
      path: "/about",
    },
    {
      label: "Our Story",
      path: "/story",
    },
    {
      label: "Collections",
      path: "/collections",
    },
    {
      label: "Journal",
      path: "/journal",
    },
  ];

  // =========================================
  // AUTH STATE
  // =========================================

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getUser());
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

  const isLoggedIn = Boolean(
    localStorage.getItem("token")
  );

  // =========================================
  // MOBILE MENU BODY SCROLL
  // =========================================

  useEffect(() => {
    document.body.style.overflow =
      menuOpen || searchOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  // =========================================
  // NAVBAR SCROLL
  // =========================================

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  // =========================================
  // CLOSE MOBILE MENU
  // =========================================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // =========================================
  // ACCOUNT CLICK
  // =========================================

  const handleAccountClick = () => {
    closeMenu();

    if (isLoggedIn) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  // =========================================
  // OPEN SEARCH
  // =========================================

  const openSearch = () => {
    closeMenu();
    setSearchOpen(true);

    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  // =========================================
  // CLOSE SEARCH
  // =========================================

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchValue("");
    setSearchResults([]);
    setSearchSearched(false);
    setSearchLoading(false);
  };

  // =========================================
  // SEARCH PRODUCTS
  // =========================================

  const searchProducts = async (value) => {
    const keyword = value.trim();

    if (!keyword) {
      setSearchResults([]);
      setSearchSearched(false);
      setSearchLoading(false);
      return;
    }

    try {
      setSearchLoading(true);
      setSearchSearched(true);

      const response = await fetch(
        `${API_URL}/products?search=${encodeURIComponent(
          keyword
        )}&limit=8`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to search products"
        );
      }

      setSearchResults(
        Array.isArray(data?.products)
          ? data.products
          : []
      );
    } catch (error) {
      console.error(
        "Navbar Search Error:",
        error
      );

      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // =========================================
  // SEARCH INPUT
  // =========================================

  const handleSearchChange = (event) => {
    const value = event.target.value;

    setSearchValue(value);

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    if (!value.trim()) {
      setSearchResults([]);
      setSearchSearched(false);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);

    searchTimerRef.current = setTimeout(() => {
      searchProducts(value);
    }, 350);
  };

  // =========================================
  // SEARCH SUBMIT
  // =========================================

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const keyword = searchValue.trim();

    if (!keyword) return;

    closeSearch();

    navigate(
      `/shop?search=${encodeURIComponent(
        keyword
      )}`
    );
  };

  // =========================================
  // PRODUCT CLICK
  // =========================================

  const handleProductClick = (product) => {
    const id =
      product?._id ||
      product?.id ||
      product?.productId;

    if (!id) return;

    closeSearch();

    navigate(`/product/${id}`);
  };

  // =========================================
  // ESCAPE KEY
  // =========================================

  useEffect(() => {
    if (!searchOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeSearch();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [searchOpen]);

  // =========================================
  // CLEANUP SEARCH TIMER
  // =========================================

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  // =========================================
  // FORMAT PRICE
  // =========================================

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(price || 0));
  };

  // =========================================
  // PRODUCT IMAGE
  // =========================================

  const getProductImage = (product) => {
    return (
      product?.image ||
      product?.images?.[0] ||
      "/placeholder-product.jpg"
    );
  };

  return (
    <>
      {/* =====================================
          NAVBAR
      ====================================== */}

      <header
        className={`navbar ${
          scrolled ? "navbar-scrolled" : ""
        }`}
        style={{
          "--navbar-bg": navbarBackground,
          top: top,
        }}
      >
        {/* LEFT */}

        <div className="navbar-left">
          {/* MOBILE MENU */}

          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            type="button"
          >
            <Menu
              size={21}
              strokeWidth={1.5}
            />
          </button>

          {/* DESKTOP NAVIGATION */}

          <nav className="desktop-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* CENTER LOGO */}

        <Link
          to="/"
          className="brand-logo"
        >
          <span>SADDLE</span>
          <small>&</small>
          <span>CREST</span>
        </Link>

        {/* RIGHT ACTIONS */}

        <div className="navbar-actions">
          {/* SEARCH */}

          <button
            aria-label="Search"
            type="button"
            onClick={openSearch}
          >
            <Search
              size={19}
              strokeWidth={1.5}
            />
          </button>

          {/* ACCOUNT */}

          <button
            className="navbar-account-button"
            aria-label={
              isLoggedIn
                ? "View Profile"
                : "Login"
            }
            type="button"
            onClick={handleAccountClick}
          >
            <UserRound
              size={19}
              strokeWidth={1.5}
            />
          </button>

          {/* WISHLIST */}

          <Link
            to="/wishlist"
            className="navbar-icon-link desktop-action"
            aria-label="Wishlist"
          >
            <Heart
              size={19}
              strokeWidth={1.5}
            />

            {wishlistCount > 0 && (
              <span className="bag-count wishlist-count">
                {wishlistCount > 99
                  ? "99+"
                  : wishlistCount}
              </span>
            )}
          </Link>

          {/* SHOPPING BAG */}

          <Link
            to="/cart"
            className="navbar-icon-link bag-button"
            aria-label="Shopping Bag"
          >
            <ShoppingBag
              size={19}
              strokeWidth={1.5}
            />

            <span className="bag-count">
              {cartCount > 99
                ? "99+"
                : cartCount}
            </span>
          </Link>
        </div>
      </header>

      {/* =====================================
          SEARCH OVERLAY
      ====================================== */}

      <div
        className={`navbar-search-overlay ${
          searchOpen ? "active" : ""
        }`}
      >
        <div
          className="navbar-search-backdrop"
          onClick={closeSearch}
        />

        <section className="navbar-search-panel">
          {/* SEARCH HEADER */}

          <div className="navbar-search-header">
            <span>SEARCH SADDLE & CREST</span>

            <button
              type="button"
              onClick={closeSearch}
              aria-label="Close search"
              className="navbar-search-close"
            >
              <X
                size={22}
                strokeWidth={1.4}
              />
            </button>
          </div>

          {/* SEARCH FORM */}

          <form
            className="navbar-search-form"
            onSubmit={handleSearchSubmit}
          >
            <Search
              size={21}
              strokeWidth={1.4}
            />

            <input
              ref={searchInputRef}
              type="search"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search saddles, bridles, boots..."
              autoComplete="off"
              aria-label="Search products"
            />

            {searchValue && (
              <button
                type="button"
                className="navbar-search-clear"
                onClick={() => {
                  setSearchValue("");
                  setSearchResults([]);
                  setSearchSearched(false);
                  searchInputRef.current?.focus();
                }}
                aria-label="Clear search"
              >
                <X size={17} />
              </button>
            )}

            <button
              type="submit"
              className="navbar-search-submit"
            >
              Search
            </button>
          </form>

          {/* SEARCH CONTENT */}

          <div className="navbar-search-content">
            {!searchValue.trim() && (
              <div className="navbar-search-empty">
                <span>EXPLORE THE COLLECTION</span>

                <p>
                  Search our collection of
                  handcrafted equestrian pieces.
                </p>
              </div>
            )}

            {searchLoading && (
              <div className="navbar-search-loading">
                <span className="search-loader" />
                <p>Searching the collection...</p>
              </div>
            )}

            {!searchLoading &&
              searchSearched &&
              searchResults.length > 0 && (
                <div className="navbar-search-results">
                  <div className="navbar-search-result-title">
                    <span>
                      SEARCH RESULTS
                    </span>

                    <small>
                      {searchResults.length}{" "}
                      {searchResults.length === 1
                        ? "item"
                        : "items"}
                    </small>
                  </div>

                  <div className="navbar-search-grid">
                    {searchResults.map(
                      (product) => {
                        const productId =
                          product?._id ||
                          product?.id ||
                          product?.productId;

                        const price =
                          product?.salePrice !==
                            null &&
                          product?.salePrice !==
                            undefined
                            ? product.salePrice
                            : product?.price;

                        return (
                          <button
                            key={productId}
                            type="button"
                            className="navbar-search-product"
                            onClick={() =>
                              handleProductClick(
                                product
                              )
                            }
                          >
                            <div className="navbar-search-product-image">
                              <img
                                src={getProductImage(
                                  product
                                )}
                                alt={
                                  product?.name ||
                                  "Product"
                                }
                              />

                              {product?.badge && (
                                <span>
                                  {product.badge}
                                </span>
                              )}
                            </div>

                            <div className="navbar-search-product-info">
                              <h4>
                                {product?.name}
                              </h4>

                              <p>
                                {formatPrice(
                                  price
                                )}
                              </p>
                            </div>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

            {!searchLoading &&
              searchSearched &&
              searchResults.length === 0 && (
                <div className="navbar-search-no-results">
                  <Search
                    size={25}
                    strokeWidth={1.2}
                  />

                  <span>
                    NO PRODUCTS FOUND
                  </span>

                  <p>
                    We couldn't find anything
                    matching "{searchValue.trim()}".
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      const keyword =
                        searchValue.trim();

                      closeSearch();

                      navigate(
                        `/shop?search=${encodeURIComponent(
                          keyword
                        )}`
                      );
                    }}
                  >
                    VIEW SHOP
                  </button>
                </div>
              )}
          </div>
        </section>
      </div>

      {/* =====================================
          MOBILE MENU BACKDROP
      ====================================== */}

      <div
        className={`mobile-menu-backdrop ${
          menuOpen ? "active" : ""
        }`}
        onClick={closeMenu}
      />

      {/* =====================================
          MOBILE MENU
      ====================================== */}

      <aside
        className={`mobile-menu ${
          menuOpen ? "active" : ""
        }`}
      >
        {/* MOBILE MENU HEADER */}

        <div className="mobile-menu-header">
          <Link
            to="/"
            className="mobile-menu-logo"
            onClick={closeMenu}
          >
            <span>SADDLE</span>
            <small>&</small>
            <span>CREST</span>
          </Link>

          <button
            onClick={closeMenu}
            aria-label="Close menu"
            type="button"
          >
            <X
              size={23}
              strokeWidth={1.4}
            />
          </button>
        </div>

        {/* MOBILE NAVIGATION */}

        <nav className="mobile-menu-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMenu}
            >
              <span>{item.label}</span>
              <ArrowUpRight size={17} />
            </Link>
          ))}

          {/* ACCOUNT */}

          <button
            className="mobile-account-link"
            onClick={handleAccountClick}
            type="button"
          >
            <span>
              {isLoggedIn
                ? "My Profile"
                : "Login"}
            </span>

            <UserRound
              size={17}
              strokeWidth={1.4}
            />
          </button>

          {/* WISHLIST */}

          <Link
            to="/wishlist"
            onClick={closeMenu}
          >
            <span>
              Wishlist

              {wishlistCount > 0 && (
                <small className="mobile-count">
                  {wishlistCount}
                </small>
              )}
            </span>

            <Heart
              size={17}
              strokeWidth={1.4}
            />
          </Link>

          {/* SHOPPING BAG */}

          <Link
            to="/cart"
            onClick={closeMenu}
          >
            <span>
              Shopping Bag

              {cartCount > 0 && (
                <small className="mobile-count">
                  {cartCount}
                </small>
              )}
            </span>

            <ShoppingBag
              size={17}
              strokeWidth={1.4}
            />
          </Link>
        </nav>

        {/* MOBILE MENU FOOTER */}

        <div className="mobile-menu-footer">
          <span>
            THE WORLD OF SADDLE & CREST
          </span>

          <p>
            Crafted in India. Made for the journey.
          </p>
        </div>
      </aside>
    </>
  );
};

export default Navbar;