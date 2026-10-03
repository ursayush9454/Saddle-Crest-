import React, { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getProducts } from "../services/api";

import "./NewArrivals.css";

const NewArrivals = () => {
  const navigate = useNavigate();

  const [arrivals, setArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNewArrivals = async () => {
      try {
        setLoading(true);

        const data = await getProducts({
          newArrival: true,
          limit: 8,
        });

        setArrivals(data?.products || []);
      } catch (error) {
        console.error("New arrivals fetch failed:", error);
        setArrivals([]);
      } finally {
        setLoading(false);
      }
    };

    loadNewArrivals();
  }, []);

  const getRegularPrice = (product) => {
    return Number(product?.price || 0);
  };

  const getSalePrice = (product) => {
    const regularPrice = getRegularPrice(product);
    const salePrice = Number(product?.salePrice || 0);

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

  const getProductImage = (item) => {
    return (
      item.images?.[0] ||
      item.image ||
      item.images?.[1] ||
      "https://via.placeholder.com/800x1000?text=Saddle+%26+Crest"
    );
  };

  const openProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <section className="new-arrivals" id="new-arrivals">
      {/* =========================================
          HEADER
      ========================================= */}

      <div className="new-header">
        <div className="new-heading">
          <span>05 — JUST ARRIVED</span>

          <h2>
            New
            <em> Arrivals</em>
          </h2>
        </div>

        <p>
          A new chapter in the Saddle & Crest collection,
          inspired by heritage and designed for today's rider.
        </p>
      </div>

      {/* =========================================
          LOADING
      ========================================= */}

      {loading ? (
        <div className="new-arrivals-loading">
          <span>Discovering new arrivals...</span>
        </div>
      ) : arrivals.length === 0 ? (
        /* =========================================
           EMPTY
        ========================================= */

        <div className="new-arrivals-empty">
          <p>New arrivals are being prepared.</p>

          <button
            type="button"
            onClick={() => navigate("/shop")}
          >
            Explore Collection
          </button>
        </div>
      ) : (
        /* =========================================
           PRODUCT GRID
        ========================================= */

        <div className="arrival-grid">
          {arrivals.map((item, index) => {
            const productId = item._id || item.id;

            const image = getProductImage(item);

            const regularPrice = getRegularPrice(item);
            const salePrice = getSalePrice(item);
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
                className="arrival-card"
                key={productId}
                onClick={() => openProduct(productId)}
              >
                {/* =========================================
                    IMAGE
                ========================================= */}

                <div className="arrival-image">
                  <img
                    src={image}
                    alt={
                      item.name ||
                      "Saddle & Crest product"
                    }
                    loading="lazy"
                  />

                  <span className="arrival-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* SALE BADGE */}

                  {hasSale && (
                    <span className="arrival-sale-badge">
                      {discountPercentage}% OFF
                    </span>
                  )}

                  {/* EXISTING ARROW */}

                  <button
                    type="button"
                    className="arrival-arrow"
                    aria-label={`View ${
                      item.name || "product"
                    }`}
                    onClick={(event) => {
                      event.stopPropagation();

                      openProduct(productId);
                    }}
                  >
                    <ArrowUpRight
                      size={19}
                      strokeWidth={1.5}
                    />
                  </button>

                  {/* QUICK SHOP */}

                  <button
                    type="button"
                    className="arrival-quick-shop"
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

                {/* =========================================
                    PRODUCT INFO
                ========================================= */}

                <div className="arrival-info">
                  <div className="arrival-details">
                    <span>
                      {item.category ||
                        "NEW COLLECTION"}
                    </span>

                    <h3>
                      {item.name ||
                        "Untitled Product"}
                    </h3>
                  </div>

                  {/* PRICE */}

                  <div className="arrival-price">
                    <strong>
                      {formatPrice(currentPrice)}
                    </strong>

                    {hasSale && (
                      <span className="arrival-old-price">
                        {formatPrice(regularPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default NewArrivals;