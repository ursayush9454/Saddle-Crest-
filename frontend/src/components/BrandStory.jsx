import React from "react";
import { ArrowRight } from "lucide-react";
import "./BrandStory.css";
import brandStoryImage from "../assets/Brandstory.png";

const BrandStory = () => {
  return (
    <section className="brand-story" id="story">
      <div className="story-image">
        <img
          src={brandStoryImage}
          alt="Royal Indian equestrian heritage"
        />
      </div>

      <div className="story-content">
        <span>04 — OUR CRAFT</span>

        <h2>
          Crafted by hand.
          <br />
          <em>Built for legacy.</em>
        </h2>

        <div className="story-line" />

        <p>
          At Saddle & Crest, every piece begins with a respect
          for the craft. From carefully selected leather to
          precision stitching, every detail is considered for
          the rider and the horse.
        </p>

        <p>
          Inspired by India's royal riding heritage, we believe
          exceptional equipment should not simply perform. It
          should age beautifully, feel personal, and become part
          of the journey.
        </p>

        <a href="#journal">
          Discover Our Story
          <ArrowRight size={15} strokeWidth={1.5} />
        </a>
      </div>
    </section>
  );
};

export default BrandStory;