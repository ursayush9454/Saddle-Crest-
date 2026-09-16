import React from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ShieldCheck,
  Ruler,
} from "lucide-react";

import "./Rider.css";
import Navbar from "../components/Navbar";

const riderProducts = [
  {
    name: "Jodhpur Riding Boots",
    type: "FOOTWEAR",
    price: "₹18,900",
    image:
      "https://www.blkbrdshoemaker.com/cdn/shop/files/Umaid-X-Jodhpuri-Boot-Toscanello-Horserump.jpg",
  },
  {
    name: "Heritage Riding Jacket",
    type: "APPAREL",
    price: "₹24,500",
    image:
      "https://images.unsplash.com/photo-1520975958225-5f61d3b9c1b1?auto=format&fit=crop&w=1000&q=85",
  },
  {
    name: "Classic Leather Gloves",
    type: "ACCESSORIES",
    price: "₹4,800",
    image:
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=85",
  },
];

const Rider = () => {
  return (
    <main className="rider-page">
      <Navbar/>

      {/* HERO */}
      <section className="rider-hero">

        <div className="rider-hero-overlay"></div>

        <div className="rider-hero-content">

          <span className="rider-eyebrow">
            THE RIDER EDIT
          </span>

          <h1>
            Ride with
            <em> distinction.</em>
          </h1>

          <p>
            Refined riding essentials created for those who
            believe performance and presence should ride together.
          </p>

          <a href="#rider-products" className="rider-hero-link">
            <span>EXPLORE RIDER ESSENTIALS</span>
            <ArrowRight size={17} />
          </a>

        </div>

        <div className="rider-hero-bottom">
          <span>02 — RIDER</span>
          <span>INDIA · EST. MMXXVI</span>
        </div>

      </section>


      {/* INTRO */}
      <section className="rider-intro">

        <div className="rider-section-number">
          <span>01</span>
          <span>FOR THE RIDER</span>
        </div>

        <div>
          <h2>
            Performance,
            <br />
            with <em>presence.</em>
          </h2>

          <p>
            From the riding arena to the polo field, every
            Saddle & Crest rider piece is designed around
            movement, comfort and timeless Indian elegance.
          </p>
        </div>

      </section>


      {/* FEATURES */}
      <section className="rider-features">

        <div className="rider-feature">

          <Ruler size={28} strokeWidth={1} />

          <span>01</span>

          <h3>Designed to Fit</h3>

          <p>
            Thoughtful proportions and riding-focused
            construction for unrestricted movement.
          </p>

        </div>


        <div className="rider-feature">

          <ShieldCheck size={28} strokeWidth={1} />

          <span>02</span>

          <h3>Built for the Ride</h3>

          <p>
            Selected materials designed to perform through
            long days in the saddle.
          </p>

        </div>


        <div className="rider-feature">

          <Check size={28} strokeWidth={1} />

          <span>03</span>

          <h3>Made with Intent</h3>

          <p>
            Every detail exists for a reason — nothing
            excessive, nothing accidental.
          </p>

        </div>

      </section>


      {/* PRODUCTS */}
      <section
        className="rider-products"
        id="rider-products"
      >

        <div className="rider-products-heading">

          <div>
            <span className="rider-eyebrow">
              ESSENTIALS
            </span>

            <h2>
              The rider's
              <em> wardrobe.</em>
            </h2>
          </div>

          <a href="/shop">
            VIEW ALL
            <ArrowUpRight size={16} />
          </a>

        </div>


        <div className="rider-product-grid">

          {riderProducts.map((product) => (
            <article
              className="rider-product"
              key={product.name}
            >

              <div className="rider-product-image">

                <img
                  src={product.image}
                  alt={product.name}
                />

                <button>
                  <ArrowUpRight size={18} />
                </button>

              </div>

              <div className="rider-product-info">

                <div>
                  <span>{product.type}</span>
                  <h3>{product.name}</h3>
                </div>

                <strong>{product.price}</strong>

              </div>

            </article>
          ))}

        </div>

      </section>


      {/* EDITORIAL */}
      <section className="rider-editorial">

        <div className="rider-editorial-image">

          <img
            src="https://media.admiddleeast.com/photos/651abd627d01c0bd22201f5e/1:1/w_3056,h_3056,c_limit/Suryagarh%20Akshay%20Shoot-7A%20Retouched.jpg"
            alt="Indian equestrian rider"
          />

        </div>

        <div className="rider-editorial-content">

          <span className="rider-eyebrow">
            THE RIDER'S CODE
          </span>

          <h2>
            Elegance is not
            <br />
            <em>decoration.</em>
          </h2>

          <p>
            It is discipline. It is preparation. It is knowing
            exactly what belongs — and leaving everything else
            behind.
          </p>

          <a href="/collections">
            DISCOVER COLLECTIONS
            <ArrowUpRight size={16} />
          </a>

        </div>

      </section>


      {/* CTA */}
      <section className="rider-cta">

        <span className="rider-eyebrow">
          PERSONAL SERVICE
        </span>

        <h2>
          Your ride.
          <br />
          Your <em>standard.</em>
        </h2>

        <p>
          Speak with our equestrian concierge for fit,
          product and custom recommendations.
        </p>

        <button>
          SPEAK WITH OUR CONCIERGE
          <ArrowUpRight size={16} />
        </button>

      </section>

    </main>
  );
};

export default Rider;