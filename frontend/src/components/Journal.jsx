import React from "react";
import { ArrowUpRight } from "lucide-react";
import "./Journal.css";

const stories = [
  {
    category: "HERITAGE",
    title: "The Royal Riding Traditions of Rajasthan",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1400&q=90",
  },
  {
    category: "CRAFT",
    title: "Inside the Art of Handcrafted Leather",
    image:
      "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=1400&q=90",
  },
  {
    category: "THE RIDE",
    title: "A Morning at the Stables",
    image:
      "https://images.unsplash.com/photo-1708916340019-98d25a1451ad?auto=format&fit=crop&w=1400&q=90",
  },
];

const Journal = () => {
  return (
    <section className="journal-section" id="journal">

      {/* Header */}
      <div className="journal-header">

        <div className="journal-heading">
          <span>08 — THE JOURNAL</span>

          <h2>
            Stories from
            <em> the saddle.</em>
          </h2>
        </div>

        <a href="#journal" className="journal-view-all">
          View Journal
          <ArrowUpRight size={15} strokeWidth={1.5} />
        </a>

      </div>

      {/* Stories */}
      <div className="journal-grid">

        {stories.map((story, index) => (
          <article
            className={`journal-card ${
              index === 0 ? "journal-featured" : ""
            }`}
            key={story.title}
          >

            <div className="journal-image">

              <img
                src={story.image}
                alt={story.title}
                loading="lazy"
              />

              <div className="journal-image-overlay" />

              <span className="journal-category">
                {story.category}
              </span>

              <button
                type="button"
                aria-label={`Read ${story.title}`}
              >
                <ArrowUpRight
                  size={17}
                  strokeWidth={1.5}
                />
              </button>

            </div>

            <div className="journal-info">

              <span className="journal-date">
                SEPTEMBER 2026
              </span>

              <h3>{story.title}</h3>

              <a href="#journal" className="journal-read">
                Read story
                <span>→</span>
              </a>

            </div>

          </article>
        ))}

      </div>

    </section>
  );
};

export default Journal;