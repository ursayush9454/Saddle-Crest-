import React, { useState } from "react";
import { Menu, RefreshCw } from "lucide-react";
import { useLocation } from "react-router-dom";
import "./Topbar.css";

const titles = {
  "/": "Overview",
  "/products": "Products",
  "/orders": "Orders",
  "/customers": "Customers",
  "/categories": "Categories",
  "/coupons": "Coupons",
};

const Topbar = ({ setSidebarOpen }) => {
  const location = useLocation();

  const [refreshing, setRefreshing] = useState(false);

  const title = titles[location.pathname] || "Overview";

  const refresh = () => {
    if (refreshing) return;

    setRefreshing(true);

    window.location.reload();
  };

  return (
    <header className="topbar">
      {/* Mobile Menu */}
      <button
        type="button"
        className="mobile-menu-button"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Page Title */}
      <div className="topbar-title">
        <span className="eyebrow">CONTROL ROOM</span>

        <h2>{title}</h2>
      </div>

      {/* Refresh */}
      <button
        type="button"
        className={`topbar-refresh-button ${
          refreshing ? "is-refreshing" : ""
        }`}
        onClick={refresh}
        disabled={refreshing}
        aria-label="Refresh page"
      >
        <RefreshCw size={17} />

        <span>Refresh</span>
      </button>
    </header>
  );
};

export default Topbar;