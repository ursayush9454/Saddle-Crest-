import React from "react";
import { Quote, Star } from "lucide-react";
import "./Reviews.css";

const reviews = [
  {
    text: "The craftsmanship is exceptional. The leather, stitching and finish feel like something made to be kept for generations.",
    name: "Arjun Rathore",
    role: "Jaipur · Dressage Rider",
  },
  {
    text: "Beautifully made and incredibly comfortable. Saddle & Crest has brought a completely different level of refinement to riding gear.",
    name: "Kabir Singh",
    role: "Mumbai · Polo Player",
  },
  {
    text: "From the fitting consultation to the final piece, everything felt personal and considered. Truly a luxury experience.",
    name: "Vikram Chauhan",
    role: "Jodhpur · Equestrian",
  },
];

const Reviews = () => {
  return (
    <section className="reviews-section">

      <div className="reviews-header">
        <span>07 — WORDS FROM THE RIDE</span>

        <h2>
          Worn with
          <em> distinction.</em>
        </h2>

        <p>
          A few words from riders who believe that
          craftsmanship makes every ride memorable.
        </p>
      </div>

      <div className="reviews-grid">
        {reviews.map((review, index) => (
          <article className="review-card" key={index}>

            <Quote className="quote-icon" size={30} strokeWidth={1} />

            <div className="review-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={11}
                  fill="currentColor"
                  strokeWidth={1}
                />
              ))}
            </div>

            <p className="review-text">
              “{review.text}”
            </p>

            <div className="review-person">
              <div className="review-avatar">
                {review.name.charAt(0)}
              </div>

              <div>
                <h3>{review.name}</h3>
                <span>{review.role}</span>
              </div>
            </div>

          </article>
        ))}
      </div>

    </section>
  );
};

export default Reviews;