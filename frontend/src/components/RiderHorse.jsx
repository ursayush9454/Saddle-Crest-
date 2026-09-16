import React from "react";
import { ArrowRight } from "lucide-react";
import "./RiderHorse.css";
import nobleCompanionsImage from "../assets/nobel.png";

const RiderHorse = () => {
  return (
    <section className="rider-horse" id="rider">

      {/* Rider */}
      <div className="rh-card rider-card">
        <img
          src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1400&q=90"
          alt="Royal rider"
        />

        <div className="rh-overlay" />

        <div className="rh-content">
          <span>FOR THE RIDER</span>

          <h2>
            The Royal
            <br />
            <em>Rider</em>
          </h2>

          <p>
            Refined riding essentials inspired by
            India's timeless equestrian heritage.
          </p>

          <a href="#shop">
            Shop Rider
            <ArrowRight size={15} strokeWidth={1.5} />
          </a>
        </div>
      </div>

      {/* Noble Companions */}
      <div className="rh-card horse-card" id="horse">
        <img
          src={nobleCompanionsImage}
          alt="Noble black horse and rider"
        />

        <div className="rh-overlay" />

        <div className="rh-content">
          <span>FOR THE HORSE</span>

          <h2>
            Noble
            <br />
            <em>Companions</em>
          </h2>

          <p>
            Thoughtfully crafted equipment for
            comfort, connection and performance.
          </p>

          <a href="#shop">
            Shop Horse
            <ArrowRight size={15} strokeWidth={1.5} />
          </a>
        </div>
      </div>

    </section>
  );
};

export default RiderHorse;