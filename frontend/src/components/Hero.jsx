import React, { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "./Hero.css";

import heroImage1 from "../assets/image.png";
import heroImage2 from "../assets/hero2.png";
import heroImage3 from "../assets/hero3.jpg";
import heroImage4 from "../assets/Hero4.jpg";
import heroImage5 from "../assets/hero6.png";

const SLIDE_DURATION = 5000;

const slides = [
  {
    image: heroImage1,
    position: "center center",
    mobilePosition: "62% center",

    eyebrow: "Premium Equestrian Essentials",

    title: (
      <>
        Built for
        <br />
        <em>a Higher Standard</em>
      </>
    ),

    description: (
      <>
        Timeless gear. Modern performance.
        <br />
        For riders who expect more.
      </>
    ),
  },

  {
    image: heroImage2,
    position: "center center",
    mobilePosition: "58% center",

    eyebrow: "The Art of Equestrian",

    title: (
      <>
        Crafted for
        <br />
        <em>the Journey</em>
      </>
    ),

    description: (
      <>
        Exceptional leather. Refined details.
        <br />
        Made for horse and rider.
      </>
    ),
  },

  {
    image: heroImage3,
    position: "center center",
    mobilePosition: "50% center",

    eyebrow: "Heritage in Every Detail",

    title: (
      <>
        Tradition
        <br />
        <em>Reimagined</em>
      </>
    ),

    description: (
      <>
        Indian craftsmanship meets
        <br />
        contemporary equestrian design.
      </>
    ),
  },

  {
    image: heroImage4,
    position: "center center",
    mobilePosition: "55% center",

    eyebrow: "Saddle & Crest",

    title: (
      <>
        Born in India.
        <br />
        <em>Made to Last.</em>
      </>
    ),

    description: (
      <>
        Timeless craftsmanship for
        <br />
        those who ride differently.
      </>
    ),
  },

  {
    image: heroImage5,
    position: "center center",
    mobilePosition: "50% center",

    eyebrow: "Heritage in Every Detail",

    title: (
      <>
        Tradition
        <br />
        <em>Reimagined</em>
      </>
    ),

    description: (
      <>
        Indian craftsmanship meets
        <br />
        contemporary equestrian design.
      </>
    ),
  },
];

const Hero = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

  /* =====================================================
     AUTO SLIDER

     Every slide gets a fresh 5 second timer.
  ===================================================== */

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveSlide((prev) => {
        if (prev === slides.length - 1) {
          return 0;
        }

        return prev + 1;
      });
    }, SLIDE_DURATION);

    return () => clearTimeout(timer);
  }, [activeSlide]);

  /* =====================================================
     NEXT SLIDE
  ===================================================== */

  const nextSlide = () => {
    setActiveSlide((prev) => {
      if (prev === slides.length - 1) {
        return 0;
      }

      return prev + 1;
    });

    setProgressKey((prev) => prev + 1);
  };

  /* =====================================================
     PREVIOUS SLIDE
  ===================================================== */

  const prevSlide = () => {
    setActiveSlide((prev) => {
      if (prev === 0) {
        return slides.length - 1;
      }

      return prev - 1;
    });

    setProgressKey((prev) => prev + 1);
  };

  /* =====================================================
     GO TO SPECIFIC SLIDE
  ===================================================== */

  const goToSlide = (index) => {
    setActiveSlide(index);
    setProgressKey((prev) => prev + 1);
  };

  const slide = slides[activeSlide];

  return (
    <section className="hero">

      {/* =================================================
          HERO IMAGE
      ================================================= */}

      <div
        key={`image-${activeSlide}`}
        className="hero-image"
        style={{
          backgroundImage: `url(${slide.image})`,
          "--desktop-position": slide.position,
          "--mobile-position": slide.mobilePosition,
        }}
      />

      {/* =================================================
          OVERLAY
      ================================================= */}

      <div className="hero-overlay" />

      {/* =================================================
          HERO CONTENT
      ================================================= */}

      <div
        key={`content-${activeSlide}`}
        className="hero-content"
      >
        <p className="hero-eyebrow">
          {slide.eyebrow}
        </p>

        <h1>{slide.title}</h1>

        <p className="hero-description">
          {slide.description}
        </p>

        <a
          href="#collections"
          className="hero-button"
        >
          Explore Collection
          <ArrowRight size={16} />
        </a>
      </div>

      {/* =================================================
          SLIDER CONTROLS
      ================================================= */}

      <div className="hero-controls">

        <button
          type="button"
          className="hero-arrow"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <ChevronLeft size={17} />
        </button>

        <button
          type="button"
          className="hero-arrow"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <ChevronRight size={17} />
        </button>

      </div>

      {/* =================================================
          BOTTOM
      ================================================= */}

      <div className="hero-bottom">

        {/* SLIDE NUMBERS */}

        <div className="hero-location">

          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={
                activeSlide === index
                  ? "active"
                  : ""
              }
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            >
              0{index + 1}
            </button>
          ))}

        </div>

        {/* SCROLL */}

        <div className="scroll-indicator">

          <div className="scroll-circle">
            <ArrowDown size={14} />
          </div>

          <span>SCROLL</span>

        </div>

        {/* EST */}

        <div className="hero-est">
          EST. MMXXVI
        </div>

      </div>

      {/* =================================================
          PROGRESS BAR
      ================================================= */}

      <div className="hero-progress">

        <div
          key={`progress-${activeSlide}-${progressKey}`}
          className="hero-progress-bar"
        />

      </div>

    </section>
  );
};

export default Hero;