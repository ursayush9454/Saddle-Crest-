import React from "react";
import { ArrowUpRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./InstagramPage.css";

const instagramPosts = [
  {
    image:
      "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1000&q=90",
    category: "THE RIDE",
  },
  {
    image:
      "https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?auto=format&fit=crop&w=1000&q=90",
    category: "HERITAGE",
  },
  {
    image:
      "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&w=1000&q=90",
    category: "CRAFT",
  },
  {
    image:
      "https://images.unsplash.com/photo-1553284965-5c0c6f4c5b7e?auto=format&fit=crop&w=1000&q=90",
    category: "THE STABLE",
  },
  {
    image:
      "https://images.unsplash.com/photo-1534773728080-33d31da27ae5?auto=format&fit=crop&w=1000&q=90",
    category: "SADDLE & CREST",
  },
  {
    image:
      "https://images.unsplash.com/photo-1534773728080-33d31da27ae5?auto=format&fit=crop&w=1000&q=90",
    category: "EQUESTRIAN",
  },
];

const InstagramPage = () => {
  return (
    <>
      <Navbar navbarBackground="#171410" />

      <main className="instagram-page">

        {/* HERO */}
        <section className="instagram-hero">
          <div className="instagram-hero-content">

            <span className="instagram-eyebrow">
              THE SADDLE & CREST JOURNAL
            </span>

            <div className="instagram-icon">
              <span className="instagram-page-icon">◎</span>
            </div>

            <h1>
              Life beyond
              <em> the saddle.</em>
            </h1>

            <p>
              Follow the world of Saddle & Crest — from
              handcrafted leather and Indian equestrian
              heritage to the quiet moments between rides.
            </p>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              className="instagram-follow"
            >
              Follow us on Instagram
              <ArrowUpRight size={16} />
            </a>

          </div>
        </section>

        {/* GALLERY */}
        <section className="instagram-gallery-section">

          <div className="instagram-section-heading">

            <div>
              <span>01 — OUR WORLD</span>

              <h2>
                From our
                <em> stable.</em>
              </h2>
            </div>

            <p>
              A visual collection of craftsmanship,
              horsemanship and the Indian equestrian spirit.
            </p>

          </div>

          <div className="instagram-gallery">

            {instagramPosts.map((post, index) => (
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                className={`instagram-card ${
                  index === 0 ? "instagram-card-large" : ""
                }`}
                key={index}
              >

                <img
                  src={post.image}
                  alt={post.category}
                  loading="lazy"
                />

                <div className="instagram-overlay">
                  <span>{post.category}</span>

                  <ArrowUpRight
                    size={20}
                    strokeWidth={1.3}
                  />
                </div>

              </a>
            ))}

          </div>

        </section>

        {/* BRAND CTA */}
        <section className="instagram-cta">

          <span>FOLLOW THE JOURNEY</span>

          <h2>
            Crafted in India.
            <br />
            <em>Made for the ride.</em>
          </h2>

          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
            className="instagram-cta-button"
          >
            <span className="instagram-page-icon-small">◎</span>

            @saddleandcrest

            <ArrowUpRight size={16} />
          </a>

        </section>

      </main>

      <Footer />
    </>
  );
};

export default InstagramPage;