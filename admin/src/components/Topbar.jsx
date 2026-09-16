import React from "react";
import { Menu, RefreshCw } from "lucide-react";
import { useLocation } from "react-router-dom";

const titles = {
  "/": "Overview",
  "/products": "Products",
  "/orders": "Orders",
  "/customers": "Customers",
  "/categories": "Categories",
};

const Topbar = ({ setSidebarOpen }) => {
  const location = useLocation();

  const title = titles[location.pathname] || "Overview";

  const refresh = () => {
    window.location.reload();
  };

  return (
    <header className="topbar">
      <button
        className="mobile-menu-button"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={22} />
      </button>

      <div className="topbar-title">
        <span className="eyebrow">CONTROL ROOM</span>
        <h2>{title}</h2>
      </div>

      <button className="refresh-button" onClick={refresh}>
        <RefreshCw size={17} />
        <span>Refresh</span>
      </button>
    </header>
  );
};

export default Topbar;