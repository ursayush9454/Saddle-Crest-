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

  const getRegularPrice = (product) => {
    return Number(product?.price ?? 0);
  };

  const getSalePrice = (product) => {
    const regularPrice = getRegularPrice(product);
    const salePrice = Number(product?.salePrice ?? 0);

    if (
      Number.isFinite(salePrice) &&
      salePrice > 0 &&
      salePrice < regularPrice
    ) {
      return salePrice;
    }

    return null;
  };

  const formatPrice = (price) => {
    return `₹${Number(price || 0).toLocaleString("en-IN")}`;
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
    <section className="bs-section" id="best-sellers">
      {/* HEADER */}
      <div className="bs-header">
        <div className="bs-heading">
          <span className="bs-eyebrow">
            03 — CURATED ESSENTIALS
          </span>

          <h2 className="bs-title">
            Best <em>Sellers</em>
          </h2>
        </div>

        <button
          type="button"
          className="bs-view-all"
          onClick={() => navigate("/shop")}
        >
          <span>View All</span>

          <ArrowUpRight
            size={15}
            strokeWidth={1.5}
          />
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="bs-loading">
          Loading best sellers...
        </div>
      )}

      {/* EMPTY */}
      {!loading && products.length === 0 && (
        <div className="bs-empty">
          <p>Our best sellers are being curated.</p>

          <button
            type="button"
            onClick={() => navigate("/shop")}
          >
            Explore Shop
          </button>
        </div>
      )}

      {/* PRODUCTS */}
      {!loading && products.length > 0 && (
        <div className="bs-grid">
          {products.map((product, index) => {
            const productId = product._id || product.id;

            const image =
              product.images?.[0] ||
              product.image ||
              "https://via.placeholder.com/800x1000?text=Saddle+%26+Crest";

            const regularPrice = getRegularPrice(product);
            const salePrice = getSalePrice(product);

            const hasSale = salePrice !== null;

            const currentPrice = hasSale
              ? salePrice
              : regularPrice;

            const discountPercentage = hasSale
              ? Math.round(
                  ((regularPrice - salePrice) /
                    regularPrice) *
                    100
                )
              : 0;

            return (
              <article
                className="bs-card"
                key={productId}
                onClick={() => openProduct(productId)}
              >
                {/* IMAGE */}
                <div className="bs-image-box">
                  <img
                    className="bs-image"
                    src={image}
                    alt={product.name || "Saddle & Crest product"}
                    loading={index === 0 ? "eager" : "lazy"}
                  />

                  {/* SALE */}
                  {hasSale && (
                    <span className="bs-sale-badge">
                      {discountPercentage}% OFF
                    </span>
                  )}

                  {/* NORMAL BADGE */}
                  <span className="bs-product-badge">
                    {product.badge || "BEST SELLER"}
                  </span>

                  {/* WISHLIST */}
                  <button
                    type="button"
                    className={`bs-wishlist ${
                      isInWishlist(productId)
                        ? "is-active"
                        : ""
                    }`}
                    aria-label={`Wishlist ${product.name}`}
                    onClick={(event) =>
                      handleWishlist(event, product)
                    }
                  >
                    {isInWishlist(productId)
                      ? "♥"
                      : "♡"}
                  </button>

                  {/* ARROW */}
                  <button
                    type="button"
                    className="bs-arrow"
                    aria-label={`View ${product.name}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      openProduct(productId);
                    }}
                  >
                    <ArrowUpRight
                      size={18}
                      strokeWidth={1.5}
                    />
                  </button>

                  {/* QUICK SHOP */}
                  <button
                    type="button"
                    className="bs-quick-shop"
                    onClick={(event) => {
                      event.stopPropagation();
                      openProduct(productId);
                    }}
                  >
                    <span>Quick Shop</span>

                    <ArrowUpRight
                      size={14}
                      strokeWidth={1.5}
                    />
                  </button>
                </div>

                {/* DETAILS */}
                <div className="bs-details">
                  <span className="bs-category">
                    {product.category || "SADDLE & CREST"}
                  </span>

                  <h3 className="bs-name">
                    {product.name}
                  </h3>

                  {/* PRICE */}
                  <div className="bs-price-row">
                    <strong className="bs-current-price">
                      {formatPrice(currentPrice)}
                    </strong>

                    {hasSale && (
                      <>
                        <span className="bs-old-price">
                          {formatPrice(regularPrice)}
                        </span>

                        <span className="bs-discount">
                          {discountPercentage}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  {/* RATING */}
                  <div className="bs-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={12}
                        fill="currentColor"
                        strokeWidth={1.2}
                      />
                    ))}

                    <span>
                      {product.rating || "4.9"}
                    </span>
                  </div>

                  {/* CART */}
                  <button
                    type="button"
                    className="bs-cart"
                    onClick={(event) =>
                      handleAddToCart(event, product)
                    }
                  >
                    Add to Cart
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ProductSection;