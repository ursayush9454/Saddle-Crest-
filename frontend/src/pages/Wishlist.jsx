import React from "react";
import {
  ArrowRight,
  Heart,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useShop } from "../ShopContext/ShopContext";
import "./Wishlist.css";
import Navbar from "../components/Navbar";
const Wishlist = () => {
  const {
    wishlist,
    removeFromWishlist,
    addToCart,
  } = useShop();

  const handleAddToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  return (
    <main className="wishlist-page">
      {/* HERO */}
      <Navbar navbarBackground={'#000'} top="0"/>
      

      {/* CONTENT */}
      <section className="wishlist-content">
        {wishlist.length === 0 ? (
          <div className="wishlist-empty">
            <div className="wishlist-empty-icon">
              <Heart size={30} strokeWidth={1.2} />
            </div>

            <span>YOUR WISHLIST IS EMPTY</span>

            <h2>
              Nothing saved
              <em>yet.</em>
            </h2>

            <p>
              Discover our collection of handcrafted equestrian
              essentials and save the pieces that speak to you.
            </p>

            <Link to="/shop" className="wishlist-shop-btn">
              <span>EXPLORE THE COLLECTION</span>
              <ArrowRight size={17} strokeWidth={1.5} />
            </Link>
          </div>
        ) : (
          <>
            <div className="wishlist-topline">
              <div>
                <span>YOUR SELECTION</span>
                <h2>
                  {wishlist.length}{" "}
                  {wishlist.length === 1 ? "Piece" : "Pieces"}
                </h2>
              </div>

              <Link to="/shop" className="wishlist-continue">
                Continue Shopping
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="wishlist-grid">
              {wishlist.map((product, index) => (
                <article
                  className="wishlist-card"
                  key={product.id}
                >
                  <div className="wishlist-image-wrap">
                    <img
                      src={product.image}
                      alt={product.name}
                    />

                    <span className="wishlist-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <button
                      className="wishlist-remove"
                      onClick={() =>
                        removeFromWishlist(product.id)
                      }
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={17} />
                    </button>

                    <button
                      className="wishlist-add-cart"
                      onClick={() =>
                        handleAddToCart(product)
                      }
                    >
                      <ShoppingBag size={17} />
                      <span>ADD TO CART</span>
                    </button>
                  </div>

                  <div className="wishlist-product-info">
                    <span className="wishlist-category">
                      {product.category}
                    </span>

                    <h3>{product.name}</h3>

                    <strong>
                      ₹{product.price.toLocaleString("en-IN")}
                    </strong>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default Wishlist;