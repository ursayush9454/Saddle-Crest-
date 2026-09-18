import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ArrowUpRight,
  Heart,
  ShoppingBag,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./Shop.css";
import Navbar from "../components/Navbar";
import {
  getProducts,
  getCategories,
} from "../services/api";
import { useShop } from "../ShopContext/ShopContext";
import Footer from "../components/Footer";

const sortOptions = [
  "Featured",
  "Price: Low to High",
  "Price: High to Low",
  "Newest",
];

const Shop = () => {
  const navigate = useNavigate();

  const {
    wishlist: contextWishlist,
    addToCart,
    toggleWishlist,
  } = useShop();

  // =====================================================
  // STATES
  // =====================================================

  const [categories, setCategories] = useState(["ALL"]);
  const [activeCategory, setActiveCategory] = useState("ALL");

  const [search, setSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [sortBy, setSortBy] = useState("Featured");
  const [sortOpen, setSortOpen] = useState(false);

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] =
    useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // FETCH CATEGORIES
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const fetchCategories = async () => {
      try {
        setCategoryLoading(true);

        const data = await getCategories();

        if (!mounted) return;

        const categoryData =
          data?.categories ||
          data?.data ||
          data?.items ||
          [];

        const categoryNames = categoryData
          .map((category) => {
            if (typeof category === "string") {
              return category;
            }

            return (
              category?.name ||
              category?.title ||
              category?.slug ||
              ""
            );
          })
          .filter(Boolean)
          .map((category) =>
            String(category).toUpperCase()
          );

        setCategories([
          "ALL",
          ...Array.from(
            new Set(categoryNames)
          ),
        ]);
      } catch (err) {
        console.error(
          "Categories fetch error:",
          err
        );

        // Fallback categories
        if (mounted) {
          setCategories([
            "ALL",
            "SADDLES",
            "BRIDLES",
            "RIDER",
            "HORSE CARE",
            "LEATHER GOODS",
          ]);
        }
      } finally {
        if (mounted) {
          setCategoryLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      mounted = false;
    };
  }, []);

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {
          limit: 100,
        };

        // SEARCH
        if (search.trim()) {
          params.search = search.trim();
        }

        // CATEGORY
        if (activeCategory !== "ALL") {
          params.category = activeCategory;
        }

        const data = await getProducts(params);

        if (!mounted) return;

        const fetchedProducts =
          data?.products ||
          data?.data ||
          data?.items ||
          [];

        setProducts(fetchedProducts);
      } catch (err) {
        console.error(
          "Shop products error:",
          err
        );

        if (mounted) {
          setError(
            err.message ||
              "Unable to load products."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, [search, activeCategory]);

  // =====================================================
  // SEARCH INPUT
  // =====================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchValue);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // =====================================================
  // NORMALIZE PRODUCT
  // =====================================================

  const normalizeProduct = (product) => {
    const id =
      product?._id ||
      product?.id;

    const price = Number(
      product?.salePrice ??
        product?.price ??
        0
    );

    const originalPrice =
      product?.salePrice &&
      Number(product?.price) >
        Number(product?.salePrice)
        ? Number(product.price)
        : null;

    const category =
      product?.category?.name ||
      product?.category ||
      "OTHER";

    const images =
      Array.isArray(product?.images) &&
      product.images.length > 0
        ? product.images
        : product?.image
        ? [product.image]
        : [];

    return {
      ...product,

      id,

      name:
        product?.name ||
        "Unnamed Product",

      category: String(
        category
      ).toUpperCase(),

      price,

      originalPrice,

      image:
        images[0] || "",

      images,

      badge:
        product?.badge ||
        (product?.bestSeller
          ? "BESTSELLER"
          : product?.newArrival
          ? "NEW"
          : product?.featured
          ? "FEATURED"
          : ""),
    };
  };

  // =====================================================
  // NORMALIZED PRODUCTS
  // =====================================================

  const normalizedProducts = useMemo(() => {
    return products
      .filter(Boolean)
      .map(normalizeProduct)
      .filter(
        (product) => product.id
      );
  }, [products]);

  // =====================================================
  // SORT PRODUCTS
  // =====================================================

  const filteredProducts = useMemo(() => {
    const result = [
      ...normalizedProducts,
    ];

    // PRICE LOW TO HIGH
    if (
      sortBy ===
      "Price: Low to High"
    ) {
      result.sort(
        (a, b) =>
          a.price - b.price
      );
    }

    // PRICE HIGH TO LOW
    if (
      sortBy ===
      "Price: High to Low"
    ) {
      result.sort(
        (a, b) =>
          b.price - a.price
      );
    }

    // NEWEST
    if (sortBy === "Newest") {
      result.sort((a, b) => {
        const dateA = new Date(
          a.createdAt || 0
        ).getTime();

        const dateB = new Date(
          b.createdAt || 0
        ).getTime();

        return dateB - dateA;
      });
    }

    // FEATURED
    if (sortBy === "Featured") {
      result.sort((a, b) => {
        if (
          a.featured &&
          !b.featured
        ) {
          return -1;
        }

        if (
          !a.featured &&
          b.featured
        ) {
          return 1;
        }

        return 0;
      });
    }

    return result;
  }, [
    normalizedProducts,
    sortBy,
  ]);

  // =====================================================
  // PRICE FORMAT
  // =====================================================

  const formatPrice = (price) => {
    return `₹${Number(
      price || 0
    ).toLocaleString("en-IN")}`;
  };

  // =====================================================
  // OPEN PRODUCT
  // =====================================================

  const openProduct = (product) => {
    if (!product?.id) return;

    navigate(
      `/product/${product.id}`,
      {
        state: {
          product,
        },
      }
    );
  };

  // =====================================================
  // WISHLIST CHECK
  // =====================================================

  const isWishlisted = (
    productId
  ) => {
    if (
      !Array.isArray(
        contextWishlist
      )
    ) {
      return false;
    }

    return contextWishlist.some(
      (item) => {
        const id =
          item?._id ||
          item?.id ||
          item?.productId?._id ||
          item?.productId?.id ||
          item?.productId;

        return (
          String(id) ===
          String(productId)
        );
      }
    );
  };

  // =====================================================
  // WISHLIST
  // =====================================================

  const handleWishlist = async (
    e,
    product
  ) => {
    e.stopPropagation();

    try {
      await toggleWishlist(
        product
      );
    } catch (err) {
      console.error(
        "Wishlist error:",
        err
      );
    }
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = async (
    e,
    product
  ) => {
    e.stopPropagation();

    try {
      await addToCart(
        product,
        1
      );
    } catch (err) {
      console.error(
        "Add to cart error:",
        err
      );
    }
  };

  // =====================================================
  // CHANGE CATEGORY
  // =====================================================

  const handleCategoryChange = (
    category
  ) => {
    setActiveCategory(category);

    // Scroll product section into view
    setTimeout(() => {
      document
        .getElementById(
          "shop-products"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearchValue("");
    setSearch("");
    setActiveCategory("ALL");
    setSortBy("Featured");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="shop-page">
        <Navbar />

        <section className="shop-loading">
          <div className="shop-loading-inner">
            <span>
              THE HOUSE COLLECTION
            </span>

            <h2>
              Preparing the
              <br />
              <em>
                collection.
              </em>
            </h2>

            <div className="loading-line"></div>
          </div>
        </section>
      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <main className="shop-page">
        <Navbar />

        <section className="empty-results shop-error">
          <span>
            COLLECTION UNAVAILABLE
          </span>

          <h3>
            We couldn't load
            <br />
            <em>
              the collection.
            </em>
          </h3>

          <p>
            {error}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
          >
            TRY AGAIN
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="shop-page">
      <Navbar />

      {/* =====================================================
          HERO
      ===================================================== */}


      {/* =====================================================
          INTRO
      ===================================================== */}

      

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <section
        className="shop-products"
        id="shop-products"
      >
        {/* HEADER */}

        <div className="shop-products-header">
          <div>
            <span className="shop-gold-label">
              THE FULL EDIT
            </span>

            <h2>
              Shop
              <em> all.</em>
            </h2>
          </div>

          <div className="shop-count">
            {filteredProducts.length}{" "}
            /{" "}
            {normalizedProducts.length}{" "}
            PIECES
          </div>
        </div>

        {/* =====================================================
            CATEGORY BAR
        ===================================================== */}

        <div className="shop-category-bar">
          <div className="category-scroll">
            {categoryLoading ? (
              <button
                className="category-active"
                type="button"
              >
                ALL
              </button>
            ) : (
              categories.map(
                (category) => (
                  <button
                    key={category}
                    type="button"
                    className={
                      activeCategory ===
                      category
                        ? "category-active"
                        : ""
                    }
                    onClick={() =>
                      handleCategoryChange(
                        category
                      )
                    }
                  >
                    {category}
                  </button>
                )
              )
            )}
          </div>
        </div>

        {/* =====================================================
            TOOLBAR
        ===================================================== */}

        <div className="shop-toolbar">
          {/* SEARCH */}

          <div className="search-box">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search the collection..."
              value={searchValue}
              onChange={(e) =>
                setSearchValue(
                  e.target.value
                )
              }
            />

            {searchValue && (
              <button
                type="button"
                onClick={() => {
                  setSearchValue("");
                  setSearch("");
                }}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* RIGHT TOOLBAR */}

          <div className="toolbar-right">
            <button
              className="filter-button"
              type="button"
              onClick={() =>
                handleCategoryChange(
                  "ALL"
                )
              }
            >
              <SlidersHorizontal
                size={15}
              />

              FILTER
            </button>

            {/* SORT */}

            <div className="sort-container">
              <button
                type="button"
                className="sort-button"
                onClick={() =>
                  setSortOpen(
                    (current) =>
                      !current
                  )
                }
              >
                SORT:{" "}
                {sortBy.toUpperCase()}

                <ChevronDown
                  size={15}
                  className={
                    sortOpen
                      ? "sort-rotate"
                      : ""
                  }
                />
              </button>

              {sortOpen && (
                <div className="sort-menu">
                  {sortOptions.map(
                    (option) => (
                      <button
                        type="button"
                        key={option}
                        onClick={() => {
                          setSortBy(
                            option
                          );
                          setSortOpen(
                            false
                          );
                        }}
                      >
                        {option}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =====================================================
            ACTIVE FILTER INFO
        ===================================================== */}

        {(activeCategory !==
          "ALL" ||
          search.trim()) && (
          <div
            style={{
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "space-between",
              gap: "15px",
              padding:
                "0 0 25px",
              fontSize: "9px",
              letterSpacing:
                "1.5px",
              color: "#7e766c",
            }}
          >
            <span>
              {activeCategory !==
                "ALL" &&
                `CATEGORY: ${activeCategory}`}
              {activeCategory !==
                "ALL" &&
                search.trim() &&
                "  •  "}
              {search.trim() &&
                `SEARCH: "${search.trim()}"`}
            </span>

            <button
              type="button"
              onClick={
                clearFilters
              }
              style={{
                border: "none",
                background:
                  "transparent",
                cursor: "pointer",
                color:
                  "#5c2a2a",
                fontFamily:
                  '"Jost", sans-serif',
                fontSize: "9px",
                letterSpacing:
                  "1.5px",
              }}
            >
              CLEAR
            </button>
          </div>
        )}

        {/* =====================================================
            PRODUCT GRID
        ===================================================== */}

        {filteredProducts.length >
        0 ? (
          <div className="shop-product-grid">
            {filteredProducts.map(
              (product) => (
                <article
                  className="shop-card"
                  key={product.id}
                  onClick={() =>
                    openProduct(
                      product
                    )
                  }
                >
                  {/* IMAGE */}

                  <div className="shop-card-image">
                    {product.image ? (
                      <img
                        src={
                          product.image
                        }
                        alt={
                          product.name
                        }
                        loading="lazy"
                      />
                    ) : (
                      <div className="product-image-placeholder">
                        NO IMAGE
                      </div>
                    )}

                    {product.badge && (
                      <span className="product-badge">
                        {
                          product.badge
                        }
                      </span>
                    )}

                    <span className="product-index">
                      {String(
                        product.id
                      )
                        .slice(-2)
                        .padStart(
                          2,
                          "0"
                        )}
                    </span>

                    {/* ACTIONS */}

                    <div className="card-actions">
                      <button
                        type="button"
                        className={
                          isWishlisted(
                            product.id
                          )
                            ? "wish-active"
                            : ""
                        }
                        onClick={(e) =>
                          handleWishlist(
                            e,
                            product
                          )
                        }
                        aria-label="Add to wishlist"
                      >
                        <Heart
                          size={17}
                          fill={
                            isWishlisted(
                              product.id
                            )
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>

                      <button
                        type="button"
                        onClick={(e) =>
                          handleAddToCart(
                            e,
                            product
                          )
                        }
                        aria-label="Add to cart"
                      >
                        <ShoppingBag
                          size={17}
                        />
                      </button>
                    </div>

                    {/* QUICK SHOP */}

                    <button
                      type="button"
                      className="quick-shop"
                      onClick={(e) => {
                        e.stopPropagation();

                        openProduct(
                          product
                        );
                      }}
                    >
                      QUICK SHOP

                      <ArrowUpRight
                        size={15}
                      />
                    </button>
                  </div>

                  {/* INFO */}

                  <div className="shop-card-info">
                    <div>
                      <span className="card-category">
                        {
                          product.category
                        }
                      </span>

                      <h3>
                        {
                          product.name
                        }
                      </h3>
                    </div>

                    <div className="card-price">
                      <strong>
                        {formatPrice(
                          product.price
                        )}
                      </strong>

                      {product.originalPrice && (
                        <del>
                          {formatPrice(
                            product.originalPrice
                          )}
                        </del>
                      )}
                    </div>
                  </div>

                  {/* VIEW PRODUCT */}

                  <button
                    type="button"
                    className="card-view"
                    onClick={(e) => {
                      e.stopPropagation();

                      openProduct(
                        product
                      );
                    }}
                  >
                    VIEW PRODUCT

                    <ArrowUpRight
                      size={15}
                    />
                  </button>
                </article>
              )
            )}
          </div>
        ) : (
          <div className="empty-results">
            <span>
              NO RESULTS
            </span>

            <h3>
              Nothing found in
              <br />
              <em>
                the collection.
              </em>
            </h3>

            <button
              type="button"
              onClick={
                clearFilters
              }
            >
              VIEW ALL PRODUCTS
            </button>
          </div>
        )}
      </section>

      {/* =====================================================
          EDITORIAL
      ===================================================== */}

      <section className="shop-editorial">
        <div className="shop-editorial-image">
          <img
            src="https://media.admiddleeast.com/photos/651abd627d01c0bd22201f5e/1:1/w_3056,h_3056,c_limit/Suryagarh%20Akshay%20Shoot-7A%20Retouched.jpg"
            alt="Saddle and Crest Indian equestrian heritage"
            loading="lazy"
          />
        </div>

        <div className="shop-editorial-content">
          <span className="shop-gold-label">
            THE HOUSE PHILOSOPHY
          </span>

          <h2>
            Not simply
            <br />
            <em>
              equipment.
            </em>
          </h2>

          <p>
            We believe equestrian
            pieces should feel as
            considered as the ride
            itself — purposeful,
            enduring and
            unmistakably personal.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/collections"
              )
            }
          >
            DISCOVER OUR STORY

            <ArrowUpRight
              size={17}
            />
          </button>
        </div>
      </section>

      {/* =====================================================
          STATEMENT
      ===================================================== */}

      <section className="shop-statement">
        <div className="statement-number">
          03
        </div>

        <div>
          <span className="shop-gold-label">
            FIVE WORLDS
          </span>

          <h2>
            One standard of
            <br />
            <em>
              craftsmanship.
            </em>
          </h2>

          <div className="statement-categories">
            <span>
              SADDLES
            </span>

            <span>
              BRIDLES
            </span>

            <span>
              RIDER
            </span>

            <span>
              HORSE CARE
            </span>

            <span>
              LEATHER GOODS
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          BESPOKE
      ===================================================== */}

      <section className="shop-bespoke">
        <div>
          <span className="shop-gold-label">
            BESPOKE SERVICE
          </span>

          <h2>
            Some pieces
            <br />
            deserve to be
            <br />
            <em>
              entirely yours.
            </em>
          </h2>

          <p>
            Custom dimensions,
            selected leathers and
            personalised finishing.
            Speak with our concierge
            about creating something
            made around you.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/collections"
              )
            }
          >
            EXPLORE BESPOKE

            <ArrowUpRight
              size={17}
            />
          </button>
        </div>

      </section>
      <Footer/>
    </main>
  );
};

export default Shop;