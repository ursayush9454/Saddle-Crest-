import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./FeaturedCollection.css";
import featuredImage from "../assets/Featured.jpg";

const FeaturedCollection = () => {
  const navigate = useNavigate();

  return (
    <section
      className="featured-section"
      id="collections"
    >
      <div className="featured-image">
        <img
          src={featuredImage}
          alt="Saddle & Crest Royal Equestrian Collection"
        />
      </div>

      <div className="featured-overlay" />

      <div className="featured-content">
        <span className="featured-label">
          THE SIGNATURE COLLECTION
        </span>

        <h2>
          The
          <br />
          <em>Black Label</em>
        </h2>

        <p>
          Refined equestrian essentials inspired by
          India's royal riding heritage, crafted around
          performance, precision and timeless form.
        </p>

        <button
          type="button"
          onClick={() => navigate("/collections")}
        >
          Discover Black Label
          <ArrowRight
            size={16}
            strokeWidth={1.5}
          />
        </button>
      </div>

      <div className="featured-number">
        02 / 06
      </div>
    </section>
  );
};

export default FeaturedCollection;