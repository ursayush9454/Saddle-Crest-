import React, { useEffect, useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../ShopContext/ShopContext";
import { getUser } from "../services/api";

const Navbar = ({
  navbarBackground = "transparent",
  top = "0",
}) => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(getUser());

  const { cartCount, wishlistCount } = useShop();

  // --------------------------------
  // AUTH STATE
  // --------------------------------
  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getUser());
    };

    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener(
        "auth-change",
        handleAuthChange
      );
    };
  }, []);

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  // --------------------------------
  // MOBILE MENU BODY SCROLL
  // --------------------------------
  useEffect(() => {
    document.body.style.overflow = menuOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // --------------------------------
  // NAVBAR SCROLL EFFECT
  // --------------------------------
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  // --------------------------------
  // CLOSE MOBILE MENU
  // --------------------------------
  const closeMenu = () => {
    setMenuOpen(false);
  };

  // --------------------------------
  // ACCOUNT CLICK
  // --------------------------------
  const handleAccountClick = () => {
    closeMenu();

    if (isLoggedIn) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
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
        {/* =====================================
            LEFT
        ====================================== */}

        <div className="navbar-left">
          {/* MOBILE MENU BUTTON */}

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
            <Link to="/shop">
              Shop
            </Link>

            <Link to="/about">
              About
            </Link>

            <Link to="/Story">
              Our Story
            </Link>

            <Link to="/collections">
              Collections
            </Link>

            <Link to="/journal">
              Journal
            </Link>
          </nav>
        </div>

        {/* =====================================
            CENTER LOGO
        ====================================== */}

        <Link
          to="/"
          className="brand-logo"
        >
          <span>
            SADDLE
          </span>

          <small>
            &
          </small>

          <span>
            CREST
          </span>
        </Link>

        {/* =====================================
            RIGHT ACTIONS
        ====================================== */}

        <div className="navbar-actions">
          {/* SEARCH */}

          <button
            aria-label="Search"
            type="button"
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
            <span>
              SADDLE
            </span>

            <small>
              &
            </small>

            <span>
              CREST
            </span>
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

        {/* =====================================
            MOBILE NAVIGATION
        ====================================== */}

        <nav className="mobile-menu-nav">
          {/* SHOP */}

          <Link
            to="/shop"
            onClick={closeMenu}
          >
            <span>
              Shop
            </span>

            <ArrowUpRight size={17} />
          </Link>

          {/* RIDER */}

          <Link
            to="/rider"
            onClick={closeMenu}
          >
            <span>
              Rider
            </span>

            <ArrowUpRight size={17} />
          </Link>

          {/* HORSE */}

          <Link
            to="/horse"
            onClick={closeMenu}
          >
            <span>
              Horse
            </span>

            <ArrowUpRight size={17} />
          </Link>

          {/* COLLECTIONS */}

          <Link
            to="/collections"
            onClick={closeMenu}
          >
            <span>
              Collections
            </span>

            <ArrowUpRight size={17} />
          </Link>

          {/* JOURNAL */}

          <Link
            to="/journal"
            onClick={closeMenu}
          >
            <span>
              Journal
            </span>

            <ArrowUpRight size={17} />
          </Link>

          {/* ACCOUNT / PROFILE */}

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

        {/* =====================================
            MOBILE MENU FOOTER
        ====================================== */}

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