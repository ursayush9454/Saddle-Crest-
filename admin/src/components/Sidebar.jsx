import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tags,
  PlusCircle,
  TicketPercent,
  LogOut,
  X,
} from "lucide-react";

import "./Sidebar.css";

const links = [
  {
    path: "/",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    path: "/products",
    label: "Products",
    icon: Package,
  },
  {
    path: "/add-product",
    label: "Add Product",
    icon: PlusCircle,
  },
  {
    path: "/orders",
    label: "Orders",
    icon: ShoppingCart,
  },
  {
    path: "/customers",
    label: "Customers",
    icon: Users,
  },
  {
    path: "/categories",
    label: "Categories",
    icon: Tags,
  },
  {
    path: "/coupons",
    label: "Coupons",
    icon: TicketPercent,
  },
];

const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${open ? "show" : ""}`}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`sidebar ${open ? "open" : ""}`}
      >
        {/* BRAND */}

        <div className="sidebar-brand">
          <div className="brand-mark">
            S&C
          </div>

          <div className="brand-info">
            <strong>Saddle & Crest</strong>
            <span>ADMIN ATELIER</span>
          </div>

          <button
            className="sidebar-close"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* NAVIGATION */}

        <nav className="sidebar-nav">
          {links.map(
            ({
              path,
              label,
              icon: Icon,
            }) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/"}
                onClick={() =>
                  setOpen(false)
                }
                className={({
                  isActive,
                }) =>
                  `sidebar-link ${
                    isActive
                      ? "active"
                      : ""
                  }`
                }
              >
                <Icon size={17} />

                <span>{label}</span>
              </NavLink>
            )
          )}
        </nav>

        {/* LOGOUT */}

        <div className="sidebar-bottom">
          <button
            className="logout-button"
            onClick={logout}
          >
            <LogOut size={17} />

            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;