import React, {
  useEffect,
  useState,
} from "react";

import {
  IndianRupee,
  ShoppingCart,
  Users,
  Package,
  Clock,
  AlertTriangle,
  ArrowRight,
  Flame,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { apiRequest } from "../services/api";

import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [data, setData] = useState(null);

  const [highlyOrdered, setHighlyOrdered] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [highlyLoading, setHighlyLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        const result =
          await apiRequest(
            "/admin/dashboard"
          );

        if (mounted) {
          setData(result);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const loadHighlyOrdered =
      async () => {
        try {
          const result =
            await apiRequest(
              "/admin/products/highly-ordered"
            );

          if (mounted) {
            setHighlyOrdered(
              (
                result?.products || []
              ).slice(0, 5)
            );
          }
        } catch (err) {
          console.error(
            "Highly ordered dashboard error:",
            err
          );
        } finally {
          if (mounted) {
            setHighlyLoading(false);
          }
        }
      };

    loadDashboard();

    loadHighlyOrdered();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h3>
          Unable to load dashboard
        </h3>

        <p>{error}</p>
      </div>
    );
  }

  const stats =
    data?.stats || {};

  const statCards = [
    {
      title: "Revenue",
      value: `₹${Number(
        stats.revenue || 0
      ).toLocaleString("en-IN")}`,
      icon: IndianRupee,
    },

    {
      title: "Orders",
      value: stats.orders || 0,
      icon: ShoppingCart,
    },

    {
      title: "Customers",
      value:
        stats.customers || 0,
      icon: Users,
    },

    {
      title: "Products",
      value:
        stats.products || 0,
      icon: Package,
    },

    {
      title: "Pending Orders",
      value:
        stats.pendingOrders || 0,
      icon: Clock,
    },

    {
      title: "Low Stock",
      value:
        stats.lowStock || 0,
      icon: AlertTriangle,
    },
  ];

  const quickActions = [
    {
      path: "/products",
      title: "Products",
      description:
        "Manage catalogue",
    },

    {
      path: "/add-product",
      title: "Add Product",
      description:
        "Add new products",
    },

    {
      path: "/orders",
      title: "Orders",
      description:
        "Manage fulfilment",
    },

    {
      path: "/categories",
      title: "Categories",
      description:
        "Manage categories",
    },
  ];

  return (
    <div className="dashboard-page">

      {/* =========================
          HERO
      ========================= */}

      <section className="dashboard-hero">
        <span className="dashboard-eyebrow">
          SADDLE & CREST
        </span>

        <h1>
          Welcome to the Dashboard.
        </h1>

        <p>
          Monitor your store operations
          from one place.
        </p>
      </section>


      {/* =========================
          STATS
      ========================= */}

      <section className="dashboard-stats">
        {statCards.map(
          ({
            title,
            value,
            icon: Icon,
          }) => (
            <div
              className="dashboard-stat-card"
              key={title}
            >
              <div className="dashboard-stat-top">
                <span>
                  {title}
                </span>

                <div className="dashboard-stat-icon">
                  <Icon size={15} />
                </div>
              </div>

              <strong>
                {value}
              </strong>

              <small>
                Live data
              </small>
            </div>
          )
        )}
      </section>


      {/* =========================
          HIGHLY ORDERED
      ========================= */}

      <section className="dashboard-highly-panel">

        <div className="dashboard-panel-heading">
          <div>
            <span className="dashboard-eyebrow">
              SALES INSIGHTS
            </span>

            <h3>
              Highly Ordered Products
            </h3>

            <p>
              Your most ordered products
              based on units sold.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/products")
            }
            className="dashboard-view-all"
          >
            View All

            <ArrowRight size={15} />
          </button>
        </div>


        {highlyLoading ? (
          <div className="dashboard-highly-loading">
            Loading sales data...
          </div>
        ) : !highlyOrdered.length ? (
          <div className="dashboard-highly-empty">
            <Flame size={28} />

            <h4>
              No order data yet
            </h4>

            <p>
              Highly ordered products
              will appear here after
              customers place orders.
            </p>
          </div>
        ) : (
          <div className="dashboard-highly-list">
            {highlyOrdered.map(
              (
                product,
                index
              ) => (
                <div
                  className="dashboard-highly-item"
                  key={
                    product._id ||
                    index
                  }
                >

                  <div className="dashboard-highly-rank">
                    {index + 1}
                  </div>


                  <div className="dashboard-highly-image">
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
                      <Package
                        size={17}
                      />
                    )}
                  </div>


                  <div className="dashboard-highly-info">
                    <strong>
                      {
                        product.productName
                      }
                    </strong>

                    <span>
                      {
                        product.totalOrders
                      } orders
                    </span>
                  </div>


                  <div className="dashboard-highly-sales">
                    <strong>
                      {
                        product.totalQuantitySold
                      }
                    </strong>

                    <span>
                      Units Sold
                    </span>
                  </div>


                  <div className="dashboard-highly-revenue">
                    <strong>
                      ₹
                      {Number(
                        product.totalRevenue ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                    <span>
                      Revenue
                    </span>
                  </div>

                </div>
              )
            )}
          </div>
        )}

      </section>


      {/* =========================
          QUICK ACCESS
      ========================= */}

      <section className="dashboard-quick-panel">

        <div className="dashboard-panel-heading">
          <div>
            <span className="dashboard-eyebrow">
              OPERATIONS
            </span>

            <h3>
              Quick Access
            </h3>
          </div>
        </div>

        <div className="dashboard-quick-grid">
          {quickActions.map(
            (item) => (
              <button
                key={item.path}
                className="dashboard-quick-card"
                onClick={() =>
                  navigate(
                    item.path
                  )
                }
              >
                <div>
                  <strong>
                    {item.title}
                  </strong>

                  <span>
                    {
                      item.description
                    }
                  </span>
                </div>

                <ArrowRight
                  size={16}
                />
              </button>
            )
          )}
        </div>

      </section>

    </div>
  );
};

export default Dashboard;