import React from "react";
import { ArrowRight } from "lucide-react";
import "./PromoBanner.css";

const PromoBanner = () => {
  return (
    <section className="promo-banner" id="heritage">

      {/* Royal Rajasthan Image */}
      <div className="promo-image">
        <img
          src="https://cdn.getyourguide.com/img/tour/64a52fe89ac7d.jpeg/148.jpg"
          alt="Royal equestrian ceremony at a Rajasthan palace"
        />
      </div>

      <div className="promo-overlay" />

      <div className="promo-border">
        <div className="promo-content">

          <span>THE ROYAL HERITAGE COLLECTION</span>

          <h2>
            Born from
            <br />
            <em>Indian Heritage</em>
          </h2>

          <p>
            Inspired by the grand equestrian traditions
            of Rajasthan, reimagined for the modern rider.
          </p>

          <a href="#collections">
            Explore Heritage
            <ArrowRight size={15} strokeWidth={1.5} />
          </a>

        </div>
      </div>

    </section>
  );
};

export default PromoBanner;