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
        console.error(
          "New arrivals fetch failed:",
          error
        );

        setArrivals([]);
      } finally {
        setLoading(false);
      }
    };

    loadNewArrivals();
  }, []);

  const getPrice = (product) => {
    return Number(
      product.salePrice || product.price || 0
    );
  };

  const formatPrice = (price) => {
    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  return (
    <section className="new-arrivals" id="new-arrivals">
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

      {loading ? (
        <div className="new-arrivals-loading">
          Discovering new arrivals...
        </div>
      ) : arrivals.length === 0 ? (
        <div className="new-arrivals-empty">
          <p>
            New arrivals are being prepared.
          </p>

          <button
            type="button"
            onClick={() => navigate("/shop")}
          >
            Explore Collection
          </button>
        </div>
      ) : (
        <div className="arrival-grid">
          {arrivals.map((item, index) => {
            const productId =
              item._id || item.id;

            const image =
              item.images?.[0] ||
              item.image ||
              "https://via.placeholder.com/600x700?text=Saddle+%26+Crest";

            return (
              <article
                className="arrival-card"
                key={productId}
                onClick={() =>
                  navigate(`/product/${productId}`)
                }
              >
                <div className="arrival-image">
                  <img
                    src={image}
                    alt={item.name}
                    loading="lazy"
                  />

                  <span className="arrival-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <button
                    type="button"
                    aria-label={`View ${item.name}`}
                    onClick={(event) => {
                      event.stopPropagation();

                      navigate(
                        `/product/${productId}`
                      );
                    }}
                  >
                    <ArrowUpRight
                      size={18}
                      strokeWidth={1.5}
                    />
                  </button>
                </div>

                <div className="arrival-info">
                  <div className="arrival-details">
                    <span>
                      {item.category ||
                        "NEW COLLECTION"}
                    </span>

                    <h3>{item.name}</h3>
                  </div>

                  <strong>
                    {formatPrice(
                      getPrice(item)
                    )}
                  </strong>
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