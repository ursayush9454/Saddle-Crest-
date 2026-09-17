import React, { useState } from "react";
import {
  ArrowUpRight,
  Star,
  Quote,
  CheckCircle2,
} from "lucide-react";

import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./ReviewsPage.css";

const reviewsData = [
  {
    name: "Arjun Mehta",
    location: "Jaipur, Rajasthan",
    product: "The Heritage Saddle",
    rating: 5,
    review:
      "The craftsmanship is exceptional. The leather feels premium, the finishing is beautiful, and the saddle has a character that becomes more noticeable with every ride.",
  },
  {
    name: "Rohan Singh",
    location: "New Delhi, India",
    product: "Black Label Bridle",
    rating: 5,
    review:
      "Beautifully made and very refined. The detailing feels luxurious without being excessive. It looks even better in person.",
  },
  {
    name: "Karan Rathore",
    location: "Jodhpur, Rajasthan",
    product: "Rajputana Dressage Saddle",
    rating: 5,
    review:
      "A beautifully balanced piece. The attention to detail and traditional influence are exactly what I was looking for.",
  },
  {
    name: "Meera Kapoor",
    location: "Mumbai, Maharashtra",
    product: "Jodhpur Riding Boots",
    rating: 5,
    review:
      "The boots have a timeless look and feel extremely well finished. They work beautifully both around the stable and beyond it.",
  },
  {
    name: "Vikram Chauhan",
    location: "Udaipur, Rajasthan",
    product: "The Maharaja Saddle",
    rating: 5,
    review:
      "There is a real sense of heritage in the product. From the leather to the smallest details, everything feels thoughtfully made.",
  },
  {
    name: "Aarav Malhotra",
    location: "Gurugram, Haryana",
    product: "Leather Goods",
    rating: 5,
    review:
      "The quality and presentation are outstanding. Saddle & Crest has managed to make equestrian leather goods feel genuinely distinctive.",
  },
];

const ReviewsPage = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="reviews-page">

     
      <Navbar />

      <main>
        {/* HERO */}
        <section className="reviews-hero">
          <div className="reviews-hero-content">
            <span className="reviews-eyebrow">
              THE SADDLE & CREST JOURNEY
            </span>

            <h1>
              Words from
              <br />
              <em>the stable.</em>
            </h1>

            <p>
              Stories, experiences and reflections from riders
              who have welcomed Saddle & Crest into their journey.
            </p>
          </div>

          <div className="reviews-hero-mark">
            <span>SC</span>
          </div>

          <div className="reviews-hero-bottom">
            <span>CLIENT REVIEWS</span>
            <div />
            <span>01 — 06</span>
          </div>
        </section>

        {/* RATING INTRO */}
        <section className="reviews-summary">
          <div className="reviews-summary-left">
            <span className="reviews-label">
              OUR CLIENTS
            </span>

            <h2>
              Crafted for
              <br />
              <em>confidence.</em>
            </h2>
          </div>

          <div className="reviews-summary-right">
            <div className="reviews-rating">
              <strong>5.0</strong>

              <div className="reviews-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    fill="currentColor"
                    strokeWidth={1}
                  />
                ))}
              </div>

              <span>Based on client experiences</span>
            </div>

            <p>
              Every Saddle & Crest piece is designed to become
              part of a rider's everyday relationship with horse,
              craft and tradition.
            </p>
          </div>
        </section>

        {/* FEATURED REVIEW */}
        <section className="featured-review">
          <div className="featured-review-image">
            <img
              src="/assets/review-featured.jpg"
              alt="Saddle & Crest equestrian craftsmanship"
            />

            <div className="featured-image-caption">
              <span>THE HERITAGE SADDLE</span>
              <span>01</span>
            </div>
          </div>

          <div className="featured-review-content">
            <Quote
              className="featured-quote"
              size={48}
              strokeWidth={0.8}
            />

            <blockquote>
              “There is something remarkably personal about
              a beautifully made saddle. Saddle & Crest has
              captured that feeling perfectly.”
            </blockquote>

            <div className="featured-review-author">
              <div>
                <strong>Aditya Rathore</strong>
                <span>Jaipur · Rajasthan</span>
              </div>

              <div className="featured-review-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={13}
                    fill="currentColor"
                    strokeWidth={1}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* REVIEWS GRID */}
        <section className="reviews-list-section">
          <div className="reviews-list-heading">
            <div>
              <span className="reviews-label">
                RIDER STORIES
              </span>

              <h2>
                From the
                <br />
                <em>community.</em>
              </h2>
            </div>

            <p>
              A selection of experiences shared by our clients
              across India.
            </p>
          </div>

          <div className="reviews-grid">
            {reviewsData.map((item, index) => (
              <article
                className={`review-card ${
                  index === 1 ? "review-card-dark" : ""
                }`}
                key={item.name}
              >
                <div className="review-card-top">
                  <div className="review-stars-small">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={13}
                        fill="currentColor"
                        strokeWidth={1}
                      />
                    ))}
                  </div>

                  <span className="review-number">
                    0{index + 1}
                  </span>
                </div>

                <p className="review-text">
                  “{item.review}”
                </p>

                <div className="review-product">
                  {item.product}
                </div>

                <div className="review-card-bottom">
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.location}</span>
                  </div>

                  <span className="verified-review">
                    <CheckCircle2 size={13} strokeWidth={1.4} />
                    Verified
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* REVIEW CTA */}
        <section className="review-cta">
          <div className="review-cta-inner">
            <span className="reviews-eyebrow">
              YOUR EXPERIENCE
            </span>

            <h2>
              Have a story
              <br />
              <em>to share?</em>
            </h2>

            <p>
              We would love to hear about your experience with
              Saddle & Crest.
            </p>

            <button
              type="button"
              className="review-cta-button"
              onClick={() => setShowForm(!showForm)}
            >
              <span>
                {showForm ? "CLOSE FORM" : "WRITE A REVIEW"}
              </span>

              <ArrowUpRight
                size={17}
                strokeWidth={1.3}
              />
            </button>

            {showForm && (
              <form className="review-form">
                <input
                  type="text"
                  placeholder="Your name"
                  required
                />

                <input
                  type="email"
                  placeholder="Your email"
                  required
                />

                <input
                  type="text"
                  placeholder="Product purchased"
                />

                <select defaultValue="">
                  <option value="" disabled>
                    Rating
                  </option>
                  <option value="5">★★★★★ — 5</option>
                  <option value="4">★★★★☆ — 4</option>
                  <option value="3">★★★☆☆ — 3</option>
                  <option value="2">★★☆☆☆ — 2</option>
                  <option value="1">★☆☆☆☆ — 1</option>
                </select>

                <textarea
                  rows="5"
                  placeholder="Tell us about your experience..."
                  required
                />

                <button type="submit">
                  SUBMIT REVIEW
                </button>
              </form>
            )}
          </div>
        </section>

        {/* SHOP CTA */}
        <section className="reviews-shop-cta">
          <div>
            <span className="reviews-label">
              DISCOVER THE COLLECTION
            </span>

            <h2>
              Find your
              <br />
              <em>piece.</em>
            </h2>
          </div>

          <Link
            to="/shop"
            className="reviews-shop-button"
          >
            <span>EXPLORE COLLECTION</span>
            <ArrowUpRight
              size={17}
              strokeWidth={1.3}
            />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ReviewsPage;