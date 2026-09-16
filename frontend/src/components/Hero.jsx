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
];


const Hero = () => {
  const [activeSlide, setActiveSlide] = useState(0);


  /* =========================
     AUTO SLIDER
  ========================= */

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);


  /* =========================
     NEXT
  ========================= */

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };


  /* =========================
     PREVIOUS
  ========================= */

  const prevSlide = () => {
    setActiveSlide(
      (prev) => (prev - 1 + slides.length) % slides.length
    );
  };


  const slide = slides[activeSlide];


  return (
    <section className="hero">

      {/* =========================
          HERO IMAGE
      ========================= */}

      <div
        key={`image-${activeSlide}`}
        className="hero-image"
        style={{
          backgroundImage: `url(${slide.image})`,
          "--desktop-position": slide.position,
          "--mobile-position": slide.mobilePosition,
        }}
      />


      {/* =========================
          OVERLAY
      ========================= */}

      <div className="hero-overlay" />


      {/* =========================
          HERO CONTENT
      ========================= */}

      <div
        key={`content-${activeSlide}`}
        className="hero-content"
      >

        <p className="hero-eyebrow">
          {slide.eyebrow}
        </p>

        <h1>
          {slide.title}
        </h1>

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


      {/* =========================
          SLIDER ARROWS
      ========================= */}

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


      {/* =========================
          BOTTOM
      ========================= */}

      <div className="hero-bottom">

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
              onClick={() => setActiveSlide(index)}
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


      {/* =========================
          PROGRESS BAR
      ========================= */}

      <div className="hero-progress">

        <div
          key={`progress-${activeSlide}`}
          className="hero-progress-bar"
        />

      </div>

    </section>
  );
};


export default Hero;