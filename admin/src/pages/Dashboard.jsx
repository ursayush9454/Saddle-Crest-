
import React, { useEffect, useState } from "react";
import {
  IndianRupee,
  ShoppingCart,
  Users,
  Package,
  Clock,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { apiRequest } from "../services/api";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        const result = await apiRequest("/admin/dashboard");

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

    loadDashboard();

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
        <h3>Unable to load dashboard</h3>
        <p>{error}</p>
      </div>
    );
  }

  const stats = data?.stats || {};

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
      value: stats.customers || 0,
      icon: Users,
    },
    {
      title: "Products",
      value: stats.products || 0,
      icon: Package,
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders || 0,
      icon: Clock,
    },
    {
      title: "Low Stock",
      value: stats.lowStock || 0,
      icon: AlertTriangle,
    },
  ];

  const quickActions = [
    {
      path: "/products",
      title: "Products",
      description: "Manage catalogue",
    },
    {
      path: "/add-product",
      title: "Add Product",
      description: "Add new products",
    },
    {
      path: "/orders",
      title: "Orders",
      description: "Manage fulfilment",
    },
    {
      path: "/categories",
      title: "Categories",
      description: "Manage categories",
    },
  ];

  return (
    <div className="dashboard-page">

      <section className="dashboard-hero">
        <span className="dashboard-eyebrow">
          SADDLE & CREST
        </span>

        <h1>Welcome to the Dashboard.</h1>

        <p>
          Monitor your store operations from one place.
        </p>
      </section>

      <section className="dashboard-stats">
        {statCards.map(
          ({ title, value, icon: Icon }) => (
            <div
              className="dashboard-stat-card"
              key={title}
            >
              <div className="dashboard-stat-top">
                <span>{title}</span>

                <div className="dashboard-stat-icon">
                  <Icon size={15} />
                </div>
              </div>

              <strong>{value}</strong>

              <small>Live data</small>
            </div>
          )
        )}
      </section>

      <section className="dashboard-quick-panel">

        <div className="dashboard-panel-heading">
          <div>
            <span className="dashboard-eyebrow">
              OPERATIONS
            </span>

            <h3>Quick Access</h3>
          </div>
        </div>

        <div className="dashboard-quick-grid">
          {quickActions.map((item) => (
            <button
              key={item.path}
              className="dashboard-quick-card"
              onClick={() => navigate(item.path)}
            >
              <div>
                <strong>{item.title}</strong>

                <span>{item.description}</span>
              </div>

              <ArrowRight size={16} />
            </button>
          ))}
        </div>

      </section>
    </div>
  );
};

export default Dashboard;

