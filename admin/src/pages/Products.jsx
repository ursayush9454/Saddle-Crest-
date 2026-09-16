import React, { useEffect, useMemo, useState } from "react";
import {
  RefreshCw,
  Trash2,
  Edit3,
  Package,
  Search,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { apiRequest } from "../services/api";
import "./Products.css";

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const loadProducts = async () => {
    try {
      setError("");
      setLoading(true);

      const result = await apiRequest("/admin/products");

      setProducts(result?.products || []);
    } catch (err) {
      setError(err.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const result = await apiRequest("/admin/products");

        if (mounted) {
          setProducts(result?.products || []);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to load products.");
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================
     UNIQUE CATEGORIES
  ========================= */

  const categories = useMemo(() => {
    const categorySet = new Set();

    products.forEach((product) => {
      const category = product.category?.trim();

      if (category) {
        categorySet.add(category);
      }
    });

    return Array.from(categorySet).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [products]);

  /* =========================
     FILTER PRODUCTS
  ========================= */

  const filteredProducts = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return products.filter((product) => {
      /* Search */

      const matchesSearch =
        !searchValue ||
        product.name?.toLowerCase().includes(searchValue) ||
        product.category?.toLowerCase().includes(searchValue) ||
        product.sku?.toLowerCase().includes(searchValue);

      /* Category */

      const productCategory =
        product.category?.trim() || "Uncategorized";

      const matchesCategory =
        categoryFilter === "all" ||
        productCategory === categoryFilter;

      /* Stock */

      const stock = Number(product.stock ?? 0);

      const threshold = Number(
        product.lowStockThreshold || 5
      );

      let matchesStock = true;

      if (stockFilter === "in-stock") {
        matchesStock = stock > threshold;
      }

      if (stockFilter === "low-stock") {
        matchesStock =
          stock > 0 && stock <= threshold;
      }

      if (stockFilter === "out-of-stock") {
        matchesStock = stock <= 0;
      }

      /* Type */

      let matchesType = true;

      if (typeFilter === "featured") {
        matchesType = product.featured === true;
      }

      if (typeFilter === "bestseller") {
        matchesType = product.bestSeller === true;
      }

      if (typeFilter === "new") {
        matchesType = product.newArrival === true;
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStock &&
        matchesType
      );
    });
  }, [
    products,
    search,
    categoryFilter,
    stockFilter,
    typeFilter,
  ]);

  /* =========================
     GROUP FILTERED PRODUCTS
  ========================= */

  const groupedProducts = useMemo(() => {
    return filteredProducts.reduce((groups, product) => {
      const category =
        product.category?.trim() || "Uncategorized";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(product);

      return groups;
    }, {});
  }, [filteredProducts]);

  /* =========================
     CLEAR FILTERS
  ========================= */

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("all");
    setStockFilter("all");
    setTypeFilter("all");
  };

  const hasActiveFilters =
    search ||
    categoryFilter !== "all" ||
    stockFilter !== "all" ||
    typeFilter !== "all";

  /* =========================
     EDIT
  ========================= */

  const editProduct = (product) => {
    navigate("/add-product", {
      state: {
        product,
      },
    });
  };

  /* =========================
     DELETE
  ========================= */

  const removeProduct = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to archive this product?"
    );

    if (!confirmed) return;

    try {
      await apiRequest(`/products/${id}`, {
        method: "DELETE",
      });

      await loadProducts();
    } catch (err) {
      setError(
        err.message || "Failed to delete product."
      );
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="products-loading">
        Loading products...
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* ERROR */}

      {error && (
        <div className="products-error">
          {error}
        </div>
      )}

      {/* =========================
          HEADER
      ========================= */}

      <section className="products-header">
        <div>
          <span className="products-eyebrow">
            CATALOGUE
          </span>

          <h1>Products</h1>

          <p>
            Manage your complete product catalogue.
          </p>
        </div>

        <div className="products-header-actions">
          <button
            className="products-refresh-btn"
            onClick={loadProducts}
          >
            <RefreshCw size={15} />
            Refresh
          </button>

          <button
            className="products-add-btn"
            onClick={() => navigate("/add-product")}
          >
            + Add Product
          </button>
        </div>
      </section>

      {/* =========================
          FILTERS
      ========================= */}

      {products.length > 0 && (
        <section className="products-filter-panel">
          <div className="products-filter-top">
            <div className="products-filter-title">
              <SlidersHorizontal size={15} />

              <span>FILTER PRODUCTS</span>
            </div>

            <div className="products-result-count">
              Showing{" "}
              <strong>{filteredProducts.length}</strong>{" "}
              of{" "}
              <strong>{products.length}</strong>
            </div>
          </div>

          <div className="products-filters">
            {/* SEARCH */}

            <div className="product-search-box">
              <Search size={15} />

              <input
                type="text"
                placeholder="Search product, SKU or category..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="product-search-clear"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* CATEGORY */}

            <div className="product-filter-control">
              <label>Category</label>

              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value)
                }
              >
                <option value="all">
                  All Categories
                </option>

                {categories.map((category) => (
                  <option
                    value={category}
                    key={category}
                  >
                    {category}
                  </option>
                ))}

                {products.some(
                  (product) =>
                    !product.category?.trim()
                ) && (
                  <option value="Uncategorized">
                    Uncategorized
                  </option>
                )}
              </select>
            </div>

            {/* STOCK */}

            <div className="product-filter-control">
              <label>Stock</label>

              <select
                value={stockFilter}
                onChange={(e) =>
                  setStockFilter(e.target.value)
                }
              >
                <option value="all">
                  All Stock
                </option>

                <option value="in-stock">
                  In Stock
                </option>

                <option value="low-stock">
                  Low Stock
                </option>

                <option value="out-of-stock">
                  Out of Stock
                </option>
              </select>
            </div>

            {/* TYPE */}

            <div className="product-filter-control">
              <label>Product Type</label>

              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value)
                }
              >
                <option value="all">
                  All Products
                </option>

                <option value="featured">
                  Featured
                </option>

                <option value="bestseller">
                  Bestseller
                </option>

                <option value="new">
                  New Arrival
                </option>
              </select>
            </div>

            {/* CLEAR */}

            {hasActiveFilters && (
              <button
                className="products-clear-btn"
                onClick={clearFilters}
              >
                <X size={14} />
                Clear
              </button>
            )}
          </div>
        </section>
      )}

      {/* =========================
          EMPTY
      ========================= */}

      {!products.length ? (
        <section className="products-empty">
          <Package size={35} />

          <h3>No products found</h3>

          <p>
            Start adding products to your catalogue.
          </p>

          <button
            onClick={() => navigate("/add-product")}
            className="products-add-btn"
          >
            + Add Product
          </button>
        </section>
      ) : !filteredProducts.length ? (
        <section className="products-empty products-no-results">
          <Search size={35} />

          <h3>No matching products</h3>

          <p>
            Try changing your search or filters.
          </p>

          <button
            onClick={clearFilters}
            className="products-clear-empty-btn"
          >
            Clear Filters
          </button>
        </section>
      ) : (
        /* =========================
           CATEGORY LIST
        ========================= */

        <div className="products-category-list">
          {Object.entries(groupedProducts).map(
            ([category, categoryProducts]) => (
              <section
                className="product-category-section"
                key={category}
              >
                {/* CATEGORY HEADER */}

                <div className="product-category-heading">
                  <div>
                    <span>CATEGORY</span>

                    <h2>{category}</h2>
                  </div>

                  <strong>
                    {categoryProducts.length}{" "}
                    {categoryProducts.length === 1
                      ? "Product"
                      : "Products"}
                  </strong>
                </div>

                {/* TABLE */}

                <div className="products-table-wrapper">
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th>Product</th>

                        {/* NEW CATEGORY COLUMN */}

                        <th>Category</th>

                        <th>Price</th>

                        <th>Stock</th>

                        <th>Flags</th>

                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {categoryProducts.map(
                        (product) => {
                          const stock = Number(
                            product.stock ?? 0
                          );

                          const threshold = Number(
                            product.lowStockThreshold ||
                              5
                          );

                          const stockClass =
                            stock <= threshold
                              ? "product-stock-low"
                              : "product-stock-ok";

                          return (
                            <tr key={product._id}>
                              {/* PRODUCT */}

                              <td>
                                <div className="product-info">
                                  {product.image ? (
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                    />
                                  ) : (
                                    <div className="product-placeholder">
                                      <Package size={18} />
                                    </div>
                                  )}

                                  <div>
                                    <strong>
                                      {product.name}
                                    </strong>

                                    {product.sku && (
                                      <small>
                                        SKU:{" "}
                                        {product.sku}
                                      </small>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* CATEGORY */}

                              <td>
                                <span className="product-category-badge">
                                  {product.category?.trim() ||
                                    "Uncategorized"}
                                </span>
                              </td>

                              {/* PRICE */}

                              <td>
                                <div className="product-price">
                                  <strong>
                                    ₹
                                    {Number(
                                      product.salePrice ??
                                        product.price ??
                                        0
                                    ).toLocaleString(
                                      "en-IN"
                                    )}
                                  </strong>

                                  {product.salePrice &&
                                    product.price &&
                                    Number(
                                      product.salePrice
                                    ) <
                                      Number(
                                        product.price
                                      ) && (
                                      <small>
                                        ₹
                                        {Number(
                                          product.price
                                        ).toLocaleString(
                                          "en-IN"
                                        )}
                                      </small>
                                    )}
                                </div>
                              </td>

                              {/* STOCK */}

                              <td>
                                <span
                                  className={
                                    stockClass
                                  }
                                >
                                  {stock}
                                </span>
                              </td>

                              {/* FLAGS */}

                              <td>
                                <div className="product-flags">
                                  {product.featured && (
                                    <span>
                                      Featured
                                    </span>
                                  )}

                                  {product.bestSeller && (
                                    <span>
                                      Bestseller
                                    </span>
                                  )}

                                  {product.newArrival && (
                                    <span>
                                      New
                                    </span>
                                  )}

                                  {!product.featured &&
                                    !product.bestSeller &&
                                    !product.newArrival && (
                                      <span className="no-flag">
                                        —
                                      </span>
                                    )}
                                </div>
                              </td>

                              {/* ACTIONS */}

                              <td>
                                <div className="product-actions">
                                  <button
                                    onClick={() =>
                                      editProduct(
                                        product
                                      )
                                    }
                                    title="Edit product"
                                  >
                                    <Edit3
                                      size={14}
                                    />
                                  </button>

                                  <button
                                    className="delete"
                                    onClick={() =>
                                      removeProduct(
                                        product._id
                                      )
                                    }
                                    title="Delete product"
                                  >
                                    <Trash2
                                      size={14}
                                    />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Products;