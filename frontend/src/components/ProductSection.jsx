import React, { useEffect, useState } from "react";
import { ArrowUpRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getProducts } from "../services/api";
import { useShop } from "../ShopContext/ShopContext";

import "./ProductSection.css";

const ProductSection = () => {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBestSellers = async () => {
      try {
        setLoading(true);

        const data = await getProducts({
          bestSeller: true,
          limit: 8,
        });

        setProducts(data?.products || []);
      } catch (error) {
        console.error("Best sellers fetch failed:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadBestSellers();
  }, []);

  const getPrice = (product) => {
    return Number(product.salePrice || product.price || 0);
  };

  const formatPrice = (price) => {
    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  const openProduct = (id) => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = async (event, product) => {
    event.stopPropagation();

    try {
      await addToCart(product, 1);
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  };

  const handleWishlist = async (event, product) => {
    event.stopPropagation();

    try {
      await toggleWishlist(product);
    } catch (error) {
      console.error("Wishlist failed:", error);
    }
  };

  return (
    <section className="products-section" id="best-sellers">
      <div className="products-header">
        <div>
          <span>03 — CURATED ESSENTIALS</span>

          <h2>
            Best
            <em> Sellers</em>
          </h2>
        </div>

        <button
          type="button"
          className="products-view-all"
          onClick={() => navigate("/shop")}
        >
          View All
          <ArrowUpRight
            size={15}
            strokeWidth={1.5}
          />
        </button>
      </div>

      {loading ? (
        <div className="products-loading">
          Loading best sellers...
        </div>
      ) : products.length === 0 ? (
        <div className="products-empty">
          <p>
            Our best sellers are being curated.
          </p>

          <button
            type="button"
            onClick={() => navigate("/shop")}
          >
            Explore Shop
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product, index) => {
            const productId = product._id || product.id;

            const image =
              product.images?.[0] ||
              product.image ||
              "https://via.placeholder.com/600x700?text=Saddle+%26+Crest";

            const price = getPrice(product);

            return (
              <article
                className="product-card"
                key={productId}
                onClick={() => openProduct(productId)}
              >
                <div className="product-image">
                  <img
                    src={image}
                    alt={product.name}
                    loading={
                      index === 0 ? "eager" : "lazy"
                    }
                  />

                  <button
                    className="product-arrow"
                    type="button"
                    aria-label={`View ${product.name}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      openProduct(productId);
                    }}
                  >
                    <ArrowUpRight
                      size={17}
                      strokeWidth={1.5}
                    />
                  </button>

                  <button
                    type="button"
                    className={`product-wishlist ${
                      isInWishlist(productId)
                        ? "active"
                        : ""
                    }`}
                    onClick={(event) =>
                      handleWishlist(event, product)
                    }
                  >
                    {isInWishlist(productId)
                      ? "♥"
                      : "♡"}
                  </button>

                  <span className="product-tag">
                    {product.badge || "BEST SELLER"}
                  </span>
                </div>

                <div className="product-info">
                  <div>
                    <span>
                      {product.category ||
                        "SADDLE & CREST"}
                    </span>

                    <h3>{product.name}</h3>
                  </div>

                  <strong>
                    {formatPrice(price)}
                  </strong>
                </div>

                <div className="product-rating">
                  <Star
                    size={11}
                    fill="currentColor"
                  />
                  <Star
                    size={11}
                    fill="currentColor"
                  />
                  <Star
                    size={11}
                    fill="currentColor"
                  />
                  <Star
                    size={11}
                    fill="currentColor"
                  />
                  <Star
                    size={11}
                    fill="currentColor"
                  />

                  <span>
                    {product.rating || "4.9"}
                  </span>
                </div>

                <button
                  type="button"
                  className="home-add-cart"
                  onClick={(event) =>
                    handleAddToCart(event, product)
                  }
                >
                  Add to Cart
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ProductSection;