import React from "react";
import {
  ArrowUpRight,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import "./Horse.css";
import Navbar from "../components/Navbar";

const horseProducts = [
  {
    title: "Heritage Leather Halter",
    category: "HALTERS",
    price: "₹8,900",
    image:
      "https://tiimg.tistatic.com/fp/1/009/282/premium-leather-horse-bridle-with-braided-reins-746.jpg",
  },
  {
    title: "Royal Grooming Set",
    category: "HORSE CARE",
    price: "₹6,800",
    image:
      "https://c.ndtvimg.com/2024-02/3u1k306_marwar-horse-show_625x300_01_February_24.jpg?im=FitAndFill%2Calgorithm%3Ddnn%2Cwidth%3D1200%2Cheight%3D675",
  },
  {
    title: "Ceremonial Bridle",
    category: "BRIDLES",
    price: "₹12,800",
    image:
      "https://www.cheval-daventure.com/photos/600x400/cheval-en-inde-11062.jpg",
  },
];

const Horse = () => {
  return (
    <main className="horse-page">
        <Navbar/>

      <section className="horse-hero">

        <div className="horse-hero-overlay"></div>

        <div className="horse-hero-content">

          <span className="horse-eyebrow">
            FOR THE HORSE
          </span>

          <h1>
            Noble by
            <em> nature.</em>
          </h1>

          <p>
            Thoughtfully crafted essentials for the horse —
            from everyday care to moments worthy of ceremony.
          </p>

          <a href="#horse-collection">
            EXPLORE THE HORSE COLLECTION
            <ArrowUpRight size={17} />
          </a>

        </div>

        <div className="horse-hero-bottom">
          <span>03 — HORSE</span>
          <span>HERITAGE · CARE · CRAFT</span>
        </div>

      </section>


      <section className="horse-intro">

        <div className="horse-label">
          <span>01</span>
          <span>THE HORSE</span>
        </div>

        <div>
          <h2>
            Respect the
            <br />
            <em>partnership.</em>
          </h2>

          <p>
            A great ride begins long before the saddle. Our horse
            collection is built around comfort, durability and
            the quiet rituals that strengthen the bond between
            horse and rider.
          </p>
        </div>

      </section>


      <section className="horse-values">

        <div>
          <HeartHandshake size={28} strokeWidth={1} />
          <h3>Horse First</h3>
          <p>
            Comfort and natural movement guide every decision.
          </p>
        </div>

        <div>
          <ShieldCheck size={28} strokeWidth={1} />
          <h3>Trusted Materials</h3>
          <p>
            Durable materials selected for everyday equestrian use.
          </p>
        </div>

        <div>
          <Sparkles size={28} strokeWidth={1} />
          <h3>Timeless Detail</h3>
          <p>
            Refined finishing inspired by India's equestrian traditions.
          </p>
        </div>

      </section>


      <section
        className="horse-collection"
        id="horse-collection"
      >

        <div className="horse-heading">

          <div>
            <span className="horse-eyebrow">
              EQUINE ESSENTIALS
            </span>

            <h2>
              Made for
              <em> the stable.</em>
            </h2>
          </div>

          <a href="/shop">
            SHOP ALL
            <ArrowUpRight size={16} />
          </a>

        </div>


        <div className="horse-products">

          {horseProducts.map((product) => (
            <article key={product.title}>

              <div className="horse-product-image">

                <img
                  src={product.image}
                  alt={product.title}
                />

                <span>DISCOVER</span>

              </div>

              <div className="horse-product-info">

                <div>
                  <small>{product.category}</small>
                  <h3>{product.title}</h3>
                </div>

                <strong>{product.price}</strong>

              </div>

            </article>
          ))}

        </div>

      </section>


      <section className="horse-story">

        <div className="horse-story-image">
          <img
            src="https://www.equus-journeys.com/photos/400x400/rider-and-marwari-horse-rajasthan-6526.jpg"
            alt="Marwari horse and rider"
          />
        </div>

        <div className="horse-story-content">

          <span className="horse-eyebrow">
            INDIAN EQUINE HERITAGE
          </span>

          <h2>
            A bond
            <br />
            <em>older than us.</em>
          </h2>

          <p>
            India's relationship with the horse is woven into
            its history — from royal processions and cavalry
            traditions to modern polo and sport.
          </p>

          <p>
            Saddle & Crest celebrates that heritage through
            contemporary craftsmanship.
          </p>

          <a href="/collections">
            EXPLORE THE HERITAGE
            <ArrowUpRight size={16} />
          </a>

        </div>

      </section>


      <section className="horse-cta">

        <span className="horse-eyebrow">
          CARE IS CRAFT
        </span>

        <h2>
          Give your horse
          <br />
          the <em>standard</em> they deserve.
        </h2>

        <a href="/shop">
          SHOP HORSE CARE
          <ArrowUpRight size={16} />
        </a>

      </section>

    </main>
  );
};

export default Horse;