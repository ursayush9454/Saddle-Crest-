import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  RefreshCw,
  Trash2,
  Edit3,
  Package,
  Search,
  X,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  Archive,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { apiRequest } from "../services/api";

import "./Products.css";


const Products = () => {
  const navigate = useNavigate();


  // =========================================================
  // PRODUCTS
  // =========================================================

  const [products, setProducts] =
    useState([]);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  // =========================================================
  // PRODUCT STATUS TAB
  // =========================================================

  const [productStatus, setProductStatus] =
    useState("active");


  const [productCounts, setProductCounts] =
    useState({
      active: 0,
      inactive: 0,
      total: 0,
    });


  // =========================================================
  // ACTION LOADING
  // =========================================================

  const [deletingId, setDeletingId] =
    useState(null);


  const [activatingId, setActivatingId] =
    useState(null);


  // =========================================================
  // FILTERS
  // =========================================================

  const [search, setSearch] =
    useState("");


  const [categoryFilter, setCategoryFilter] =
    useState("all");


  const [stockFilter, setStockFilter] =
    useState("all");


  const [typeFilter, setTypeFilter] =
    useState("all");


  // =========================================================
  // HIGHLY ORDERED
  // =========================================================

  const [highlyOrdered, setHighlyOrdered] =
    useState([]);


  const [
    highlyOrderedLoading,
    setHighlyOrderedLoading,
  ] = useState(false);


  const [
    showHighlyOrdered,
    setShowHighlyOrdered,
  ] = useState(false);


  // =========================================================
  // LOAD PRODUCTS
  // =========================================================

  const loadProducts = async (
    status = productStatus
  ) => {
    try {
      setError("");
      setLoading(true);

      const result =
        await apiRequest(
          `/products/admin/all?status=${status}`
        );

      setProducts(
        result?.products || []
      );

      setProductCounts(
        result?.counts || {
          active: 0,
          inactive: 0,
          total: 0,
        }
      );
    } catch (err) {
      console.error(
        "Load products error:",
        err
      );

      setError(
        err.message ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // LOAD HIGHLY ORDERED
  // =========================================================

  const loadHighlyOrdered =
    async () => {
      try {
        setHighlyOrderedLoading(
          true
        );

        const result =
          await apiRequest(
            "/admin/products/highly-ordered"
          );

        setHighlyOrdered(
          result?.products || []
        );
      } catch (err) {
        console.error(
          "Load highly ordered products error:",
          err
        );

        setError(
          err.message ||
            "Failed to load highly ordered products."
        );
      } finally {
        setHighlyOrderedLoading(
          false
        );
      }
    };


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadProducts("active");
  }, []);


  // =========================================================
  // CHANGE PRODUCT STATUS TAB
  // =========================================================

  const changeProductStatus = (
    status
  ) => {
    if (
      status === productStatus
    ) {
      return;
    }

    setProductStatus(status);

    // Reset filters when switching tabs
    setSearch("");
    setCategoryFilter("all");
    setStockFilter("all");
    setTypeFilter("all");

    loadProducts(status);
  };


  // =========================================================
  // UNIQUE CATEGORIES
  // =========================================================

  const categories = useMemo(() => {
    const categorySet =
      new Set();

    products.forEach(
      (product) => {
        const category =
          product.category?.trim();

        if (category) {
          categorySet.add(
            category
          );
        }
      }
    );

    return Array.from(
      categorySet
    ).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [products]);


  // =========================================================
  // FILTER PRODUCTS
  // =========================================================

  const filteredProducts =
    useMemo(() => {
      const searchValue =
        search
          .trim()
          .toLowerCase();

      return products.filter(
        (product) => {

          // =================================================
          // SEARCH
          // =================================================

          const matchesSearch =
            !searchValue ||
            product.name
              ?.toLowerCase()
              .includes(searchValue) ||
            product.category
              ?.toLowerCase()
              .includes(searchValue) ||
            product.sku
              ?.toLowerCase()
              .includes(searchValue);


          // =================================================
          // CATEGORY
          // =================================================

          const productCategory =
            product.category?.trim() ||
            "Uncategorized";

          const matchesCategory =
            categoryFilter ===
              "all" ||
            productCategory ===
              categoryFilter;


          // =================================================
          // STOCK
          // =================================================

          const stock =
            Number(
              product.stock ?? 0
            );

          const threshold =
            Number(
              product.lowStockThreshold ||
                5
            );

          let matchesStock =
            true;

          if (
            stockFilter ===
            "in-stock"
          ) {
            matchesStock =
              stock > threshold;
          }

          if (
            stockFilter ===
            "low-stock"
          ) {
            matchesStock =
              stock > 0 &&
              stock <= threshold;
          }

          if (
            stockFilter ===
            "out-of-stock"
          ) {
            matchesStock =
              stock <= 0;
          }


          // =================================================
          // TYPE
          // =================================================

          let matchesType =
            true;

          if (
            typeFilter ===
            "featured"
          ) {
            matchesType =
              product.featured ===
              true;
          }

          if (
            typeFilter ===
            "bestseller"
          ) {
            matchesType =
              product.bestSeller ===
              true;
          }

          if (
            typeFilter ===
            "new"
          ) {
            matchesType =
              product.newArrival ===
              true;
          }


          return (
            matchesSearch &&
            matchesCategory &&
            matchesStock &&
            matchesType
          );
        }
      );
    }, [
      products,
      search,
      categoryFilter,
      stockFilter,
      typeFilter,
    ]);


  // =========================================================
  // GROUP PRODUCTS BY CATEGORY
  // =========================================================

  const groupedProducts =
    useMemo(() => {
      return filteredProducts.reduce(
        (
          groups,
          product
        ) => {
          const category =
            product.category?.trim() ||
            "Uncategorized";

          if (!groups[category]) {
            groups[category] =
              [];
          }

          groups[category].push(
            product
          );

          return groups;
        },
        {}
      );
    }, [filteredProducts]);


  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("all");
    setStockFilter("all");
    setTypeFilter("all");
  };


  const hasActiveFilters =
    search ||
    categoryFilter !==
      "all" ||
    stockFilter !==
      "all" ||
    typeFilter !==
      "all";


  // =========================================================
  // EDIT PRODUCT
  // =========================================================

  const editProduct = (
    product
  ) => {
    navigate(
      "/add-product",
      {
        state: {
          product,
        },
      }
    );
  };


  // =========================================================
  // ARCHIVE / DEACTIVATE PRODUCT
  // =========================================================

  const removeProduct =
    async (id) => {
      if (!id) {
        setError(
          "Product ID is missing."
        );

        return;
      }

      const confirmed =
        window.confirm(
          "Are you sure you want to archive this product?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setError("");

        setDeletingId(id);


        await apiRequest(
          `/products/${id}`,
          {
            method: "DELETE",
          }
        );


        // Remove immediately
        setProducts(
          (currentProducts) =>
            currentProducts.filter(
              (product) =>
                product._id !== id
            )
        );


        // Update count immediately
        setProductCounts(
          (current) => ({
            ...current,
            active:
              Math.max(
                current.active - 1,
                0
              ),
            inactive:
              current.inactive + 1,
          })
        );


        // Sync backend
        await loadProducts(
          productStatus
        );
      } catch (err) {
        console.error(
          "Archive product error:",
          err
        );

        setError(
          err.message ||
            "Failed to archive product."
        );
      } finally {
        setDeletingId(
          null
        );
      }
    };


  // =========================================================
  // ACTIVATE PRODUCT
  // =========================================================

  const activateProduct =
    async (product) => {
      if (!product?._id) {
        setError(
          "Product ID is missing."
        );

        return;
      }

      const confirmed =
        window.confirm(
          `Activate "${product.name}" and make it visible on the storefront?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setError("");

        setActivatingId(
          product._id
        );


        /*
        |--------------------------------------------------------------------------
        | Update inactive product
        |--------------------------------------------------------------------------
        |
        | We send the existing product data back
        | with isActive = true.
        |
        */

        const formData =
          new FormData();

        formData.append(
          "name",
          product.name || ""
        );

        formData.append(
          "slug",
          product.slug || ""
        );

        formData.append(
          "sku",
          product.sku || ""
        );

        formData.append(
          "description",
          product.description || ""
        );

        formData.append(
          "shortDescription",
          product.shortDescription || ""
        );

        formData.append(
          "price",
          product.price ?? 0
        );

        formData.append(
          "salePrice",
          product.salePrice ?? ""
        );

        formData.append(
          "category",
          product.category || ""
        );

        formData.append(
          "categoryId",
          product.categoryId || ""
        );

        formData.append(
          "image",
          product.image || ""
        );

        formData.append(
          "stock",
          product.stock ?? 0
        );

        formData.append(
          "lowStockThreshold",
          product.lowStockThreshold ?? 5
        );

        formData.append(
          "badge",
          product.badge || ""
        );

        formData.append(
          "featured",
          product.featured
            ? "true"
            : "false"
        );

        formData.append(
          "bestSeller",
          product.bestSeller
            ? "true"
            : "false"
        );

        formData.append(
          "newArrival",
          product.newArrival
            ? "true"
            : "false"
        );

        formData.append(
          "isActive",
          "true"
        );


        /*
        |--------------------------------------------------------------------------
        | Existing images
        |--------------------------------------------------------------------------
        */

        if (
          product.images &&
          Array.isArray(
            product.images
          )
        ) {
          product.images.forEach(
            (image) => {
              formData.append(
                "existingImages",
                image
              );
            }
          );
        }


        /*
        |--------------------------------------------------------------------------
        | Arrays
        |--------------------------------------------------------------------------
        */

        if (
          Array.isArray(
            product.tags
          )
        ) {
          formData.append(
            "tags",
            JSON.stringify(
              product.tags
            )
          );
        }

        if (
          Array.isArray(
            product.sizes
          )
        ) {
          formData.append(
            "sizes",
            JSON.stringify(
              product.sizes
            )
          );
        }

        if (
          Array.isArray(
            product.colors
          )
        ) {
          formData.append(
            "colors",
            JSON.stringify(
              product.colors
            )
          );
        }


        await apiRequest(
          `/products/${product._id}`,
          {
            method: "PUT",
            body: formData,
          }
        );


        // Refresh inactive list
        await loadProducts(
          "inactive"
        );


        // Update counts
        setProductCounts(
          (current) => ({
            ...current,
            active:
              current.active + 1,
            inactive:
              Math.max(
                current.inactive - 1,
                0
              ),
          })
        );
      } catch (err) {
        console.error(
          "Activate product error:",
          err
        );

        setError(
          err.message ||
            "Failed to activate product."
        );
      } finally {
        setActivatingId(
          null
        );
      }
    };


  // =========================================================
  // HIGHLY ORDERED TOGGLE
  // =========================================================

  const toggleHighlyOrdered =
    () => {
      const nextState =
        !showHighlyOrdered;

      setShowHighlyOrdered(
        nextState
      );

      if (
        nextState &&
        !highlyOrdered.length
      ) {
        loadHighlyOrdered();
      }
    };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="products-loading">
        Loading products...
      </div>
    );
  }


  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="products-page">

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="products-error">
          {error}

          <button
            type="button"
            onClick={() =>
              setError("")
            }
          >
            <X size={14} />
          </button>
        </div>
      )}


      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="products-header">

        <div>

          <span className="products-eyebrow">
            CATALOGUE
          </span>

          <h1>
            Products
          </h1>

          <p>
            Manage your complete
            product catalogue.
          </p>

        </div>


        <div className="products-header-actions">

          {/* HIGHLY ORDERED */}

          <button
            type="button"
            className="products-highly-btn"
            onClick={
              toggleHighlyOrdered
            }
          >
            <Flame
              size={15}
            />

            Highly Ordered
          </button>


          {/* REFRESH */}

          <button
            className="products-refresh-btn"
            onClick={() =>
              loadProducts(
                productStatus
              )
            }
            disabled={
              deletingId !==
                null ||
              activatingId !==
                null
            }
          >
            <RefreshCw
              size={15}
            />

            Refresh
          </button>


          {/* ADD */}

          <button
            className="products-add-btn"
            onClick={() =>
              navigate(
                "/add-product"
              )
            }
          >
            + Add Product
          </button>

        </div>

      </section>


      {/* =====================================================
          ACTIVE / INACTIVE TABS
      ===================================================== */}

      <section className="products-status-tabs">

        <button
          type="button"
          className={
            productStatus ===
            "active"
              ? "products-status-tab active"
              : "products-status-tab"
          }
          onClick={() =>
            changeProductStatus(
              "active"
            )
          }
        >

          <span className="products-status-icon active-icon">
            <CheckCircle2
              size={16}
            />
          </span>

          <span className="products-status-content">

            <strong>
              Active Products
            </strong>

            <small>
              Visible on storefront
            </small>

          </span>

          <span className="products-status-count">
            {
              productCounts.active
            }
          </span>

        </button>


        <button
          type="button"
          className={
            productStatus ===
            "inactive"
              ? "products-status-tab inactive active"
              : "products-status-tab inactive"
          }
          onClick={() =>
            changeProductStatus(
              "inactive"
            )
          }
        >

          <span className="products-status-icon inactive-icon">
            <Archive
              size={16}
            />
          </span>

          <span className="products-status-content">

            <strong>
              Inactive Products
            </strong>

            <small>
              Hidden from storefront
            </small>

          </span>

          <span className="products-status-count">
            {
              productCounts.inactive
            }
          </span>

        </button>

      </section>


      {/* =====================================================
          HIGHLY ORDERED PANEL
      ===================================================== */}

      {showHighlyOrdered && (
        <section className="highly-ordered-panel">

          <div className="highly-ordered-heading">

            <div>

              <span>
                SALES INSIGHTS
              </span>

              <h2>
                Highly Ordered Products
              </h2>

              <p>
                Products ranked by
                total quantity sold.
              </p>

            </div>


            <button
              type="button"
              onClick={
                loadHighlyOrdered
              }
              disabled={
                highlyOrderedLoading
              }
            >

              <RefreshCw
                size={14}
                className={
                  highlyOrderedLoading
                    ? "spin"
                    : ""
                }
              />

              Refresh

            </button>

          </div>


          {/* LOADING */}

          {highlyOrderedLoading ? (
            <div className="highly-ordered-loading">
              Loading sales data...
            </div>

          ) : !highlyOrdered.length ? (

            /* EMPTY */

            <div className="highly-ordered-empty">

              <Flame
                size={30}
              />

              <h3>
                No order data yet
              </h3>

              <p>
                Highly ordered products
                will appear here once
                customers start placing
                orders.
              </p>

            </div>

          ) : (

            /* TABLE */

            <div className="highly-ordered-table-wrapper">

              <table className="highly-ordered-table">

                <thead>

                  <tr>

                    <th>
                      Product
                    </th>

                    <th>
                      Category
                    </th>

                    <th>
                      Orders
                    </th>

                    <th>
                      Units Sold
                    </th>

                    <th>
                      Revenue
                    </th>

                    <th>
                      Stock
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {highlyOrdered.map(
                    (
                      product,
                      index
                    ) => {

                      const stock =
                        Number(
                          product.stock ??
                            0
                        );


                      const threshold =
                        5;


                      const stockClass =
                        stock <=
                        threshold
                          ? "product-stock-low"
                          : "product-stock-ok";


                      return (

                        <tr
                          key={
                            product._id ||
                            index
                          }
                        >

                          {/* PRODUCT */}

                          <td>

                            <div className="highly-product-info">

                              {product.image ? (

                                <img
                                  src={
                                    product.image
                                  }
                                  alt={
                                    product.productName
                                  }
                                />

                              ) : (

                                <div className="highly-product-placeholder">

                                  <Package
                                    size={
                                      17
                                    }
                                  />

                                </div>

                              )}


                              <div>

                                <strong>
                                  {
                                    product.productName
                                  }
                                </strong>


                                {product.sku && (
                                  <small>
                                    SKU:{" "}
                                    {
                                      product.sku
                                    }
                                  </small>
                                )}

                              </div>

                            </div>

                          </td>


                          {/* CATEGORY */}

                          <td>

                            <span className="product-category-badge">

                              {product.category ||
                                "Uncategorized"}

                            </span>

                          </td>


                          {/* ORDERS */}

                          <td>

                            <strong>
                              {
                                product.totalOrders
                              }
                            </strong>

                          </td>


                          {/* QUANTITY */}

                          <td>

                            <strong>
                              {
                                product.totalQuantitySold
                              }
                            </strong>

                          </td>


                          {/* REVENUE */}

                          <td>

                            <strong>
                              ₹
                              {Number(
                                product.totalRevenue ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </strong>

                          </td>


                          {/* STOCK */}

                          <td>

                            <span
                              className={
                                stockClass
                              }
                            >
                              {
                                stock
                              }
                            </span>

                          </td>

                        </tr>

                      );

                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>
      )}


      {/* =====================================================
          FILTERS
      ===================================================== */}

      {products.length > 0 && (

        <section className="products-filter-panel">

          <div className="products-filter-top">

            <div className="products-filter-title">

              <SlidersHorizontal
                size={15}
              />

              <span>
                FILTER PRODUCTS
              </span>

            </div>


            <div className="products-result-count">

              Showing{" "}

              <strong>
                {
                  filteredProducts.length
                }
              </strong>{" "}

              of{" "}

              <strong>
                {
                  products.length
                }
              </strong>

            </div>

          </div>


          <div className="products-filters">

            {/* SEARCH */}

            <div className="product-search-box">

              <Search
                size={15}
              />

              <input
                type="text"
                placeholder="Search product, SKU or category..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />


              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="product-search-clear"
                >
                  <X
                    size={14}
                  />
                </button>
              )}

            </div>


            {/* CATEGORY */}

            <div className="product-filter-control">

              <label>
                Category
              </label>


              <select
                value={
                  categoryFilter
                }
                onChange={(e) =>
                  setCategoryFilter(
                    e.target.value
                  )
                }
              >

                <option value="all">
                  All Categories
                </option>


                {categories.map(
                  (category) => (

                    <option
                      value={
                        category
                      }
                      key={
                        category
                      }
                    >
                      {
                        category
                      }
                    </option>

                  )
                )}


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

              <label>
                Stock
              </label>


              <select
                value={
                  stockFilter
                }
                onChange={(e) =>
                  setStockFilter(
                    e.target.value
                  )
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

              <label>
                Product Type
              </label>


              <select
                value={
                  typeFilter
                }
                onChange={(e) =>
                  setTypeFilter(
                    e.target.value
                  )
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
                onClick={
                  clearFilters
                }
              >

                <X
                  size={14}
                />

                Clear

              </button>

            )}

          </div>

        </section>

      )}


      {/* =====================================================
          EMPTY
      ===================================================== */}

      {!products.length ? (

        <section className="products-empty">

          {productStatus ===
          "inactive" ? (

            <>

              <Archive
                size={35}
              />

              <h3>
                No inactive products
              </h3>

              <p>
                Products you archive
                will appear here.
              </p>

              <button
                type="button"
                onClick={() =>
                  changeProductStatus(
                    "active"
                  )
                }
                className="products-add-btn"
              >
                View Active Products
              </button>

            </>

          ) : (

            <>

              <Package
                size={35}
              />

              <h3>
                No products found
              </h3>

              <p>
                Start adding products
                to your catalogue.
              </p>

              <button
                onClick={() =>
                  navigate(
                    "/add-product"
                  )
                }
                className="products-add-btn"
              >
                + Add Product
              </button>

            </>

          )}

        </section>

      ) : !filteredProducts.length ? (

        <section className="products-empty products-no-results">

          <Search
            size={35}
          />

          <h3>
            No matching products
          </h3>

          <p>
            Try changing your
            search or filters.
          </p>

          <button
            onClick={
              clearFilters
            }
            className="products-clear-empty-btn"
          >
            Clear Filters
          </button>

        </section>

      ) : (

        /* ===================================================
           CATEGORY LIST
        =================================================== */

        <div className="products-category-list">

          {Object.entries(
            groupedProducts
          ).map(
            ([
              category,
              categoryProducts,
            ]) => (

              <section
                className="product-category-section"
                key={
                  category
                }
              >

                {/* CATEGORY HEADER */}

                <div className="product-category-heading">

                  <div>

                    <span>
                      CATEGORY
                    </span>

                    <h2>
                      {
                        category
                      }
                    </h2>

                  </div>


                  <strong>

                    {
                      categoryProducts.length
                    }{" "}

                    {
                      categoryProducts.length ===
                      1
                        ? "Product"
                        : "Products"
                    }

                  </strong>

                </div>


                {/* TABLE */}

                <div className="products-table-wrapper">

                  <table className="products-table">

                    <thead>

                      <tr>

                        <th>
                          Product
                        </th>

                        <th>
                          Category
                        </th>

                        <th>
                          Price
                        </th>

                        <th>
                          Stock
                        </th>

                        <th>
                          Flags
                        </th>

                        <th>
                          Actions
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {categoryProducts.map(
                        (
                          product
                        ) => {

                          const stock =
                            Number(
                              product.stock ??
                                0
                            );


                          const threshold =
                            Number(
                              product.lowStockThreshold ||
                                5
                            );


                          const stockClass =
                            stock <=
                            threshold
                              ? "product-stock-low"
                              : "product-stock-ok";


                          const isDeleting =
                            deletingId ===
                            product._id;


                          const isActivating =
                            activatingId ===
                            product._id;


                          return (

                            <tr
                              key={
                                product._id
                              }
                            >

                              {/* PRODUCT */}

                              <td>

                                <div className="product-info">

                                  {product.image ? (

                                    <img
                                      src={
                                        product.image
                                      }
                                      alt={
                                        product.name
                                      }
                                    />

                                  ) : (

                                    <div className="product-placeholder">

                                      <Package
                                        size={
                                          18
                                        }
                                      />

                                    </div>

                                  )}


                                  <div>

                                    <strong>
                                      {
                                        product.name
                                      }
                                    </strong>


                                    {product.sku && (

                                      <small>
                                        SKU:{" "}
                                        {
                                          product.sku
                                        }
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
                                  {
                                    stock
                                  }
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

                                  {/* EDIT */}

                                  <button
                                    type="button"
                                    onClick={() =>
                                      editProduct(
                                        product
                                      )
                                    }
                                    title="Edit product"
                                    disabled={
                                      isDeleting ||
                                      isActivating
                                    }
                                  >

                                    <Edit3
                                      size={
                                        14
                                      }
                                    />

                                  </button>


                                  {/* ACTIVE PRODUCT -> ARCHIVE */}

                                  {productStatus ===
                                    "active" && (

                                    <button
                                      type="button"
                                      className="delete"
                                      onClick={() =>
                                        removeProduct(
                                          product._id
                                        )
                                      }
                                      title={
                                        isDeleting
                                          ? "Archiving..."
                                          : "Archive product"
                                      }
                                      disabled={
                                        isDeleting ||
                                        isActivating
                                      }
                                    >

                                      {isDeleting ? (

                                        <RefreshCw
                                          size={
                                            14
                                          }
                                          className="spin"
                                        />

                                      ) : (

                                        <Trash2
                                          size={
                                            14
                                          }
                                        />

                                      )}

                                    </button>

                                  )}


                                  {/* INACTIVE PRODUCT -> ACTIVATE */}

                                  {productStatus ===
                                    "inactive" && (

                                    <button
                                      type="button"
                                      className="product-activate-btn"
                                      onClick={() =>
                                        activateProduct(
                                          product
                                        )
                                      }
                                      title={
                                        isActivating
                                          ? "Activating..."
                                          : "Activate product"
                                      }
                                      disabled={
                                        isActivating ||
                                        isDeleting
                                      }
                                    >

                                      {isActivating ? (

                                        <RefreshCw
                                          size={
                                            14
                                          }
                                          className="spin"
                                        />

                                      ) : (

                                        <CheckCircle2
                                          size={
                                            14
                                          }
                                        />

                                      )}

                                    </button>

                                  )}

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