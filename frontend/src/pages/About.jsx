import React from "react";
import { ArrowUpRight } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./About.css";

const About = () => {
  return (
    <div className="about-page">

      <Navbar />

      {/* =========================
          HERO
      ========================= */}
      <section className="about-hero">

        <div className="about-hero-overlay" />

        <div className="about-hero-content">

          <span className="about-eyebrow">
            THE HOUSE OF SADDLE & CREST
          </span>

          <h1>
            Crafted for the
            <br />
            <em>Rider & Horse.</em>
          </h1>

          <p>
            An Indian equestrian house inspired by heritage,
            craftsmanship and the timeless bond between horse and rider.
          </p>

        </div>

        <div className="about-hero-scroll">
          <span>DISCOVER OUR STORY</span>
          <div className="about-scroll-line" />
        </div>

      </section>


      {/* =========================
          INTRO
      ========================= */}
      <section className="about-intro">

        <div className="about-intro-label">
          <span>01</span>
          <span>OUR STORY</span>
        </div>

        <div className="about-intro-content">

          <h2>
            Where Indian heritage
            <br />
            meets modern equestrian craft.
          </h2>

          <div className="about-intro-text">

            <p>
              Saddle & Crest was created with a simple belief:
              equestrian products should carry the same character
              as the people and horses who use them.
            </p>

            <p>
              Inspired by India's rich equestrian traditions and
              the craftsmanship associated with Rajasthan's royal
              heritage, we create and curate pieces that balance
              timeless aesthetics with everyday functionality.
            </p>

            <p>
              From the saddle beneath you to the leather goods
              beside you, every detail is considered as part of
              the riding experience.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          HERITAGE IMAGE
      ========================= */}
      <section className="about-heritage">

        <div className="about-heritage-image">

          <img
            src="https://images.news9live.com/wp-content/uploads/2023/04/India-Heritage-sites.jpg"
            alt="Indian equestrian heritage"
          />

        </div>

        <div className="about-heritage-content">

          <span className="about-eyebrow dark">
            ROOTED IN INDIA
          </span>

          <h2>
            A heritage that
            <br />
            continues to move.
          </h2>

          <p>
            India's relationship with the horse has always been
            more than functional. Horses have been companions of
            warriors, royalty, travellers and generations of riders.
          </p>

          <p>
            Saddle & Crest draws from this heritage without being
            bound by it. We reinterpret its spirit for a new
            generation of equestrians.
          </p>

        </div>

      </section>


      {/* =========================
          CRAFTSMANSHIP
      ========================= */}
      <section className="about-craft">

        <div className="about-section-heading">

          <span className="about-eyebrow">
            THE CRAFT
          </span>

          <h2>
            Made with intention.
          </h2>

          <p>
            Good equestrian equipment should disappear beneath
            the experience — dependable, considered and built
            to become part of the journey.
          </p>

        </div>


        <div className="about-craft-grid">

          <div className="craft-card">

            <span>01</span>

            <h3>
              Materials
            </h3>

            <p>
              We pay close attention to the materials that become
              part of a rider's everyday experience, from leather
              and hardware to finishing details.
            </p>

          </div>


          <div className="craft-card">

            <span>02</span>

            <h3>
              Precision
            </h3>

            <p>
              Equestrian equipment demands precision. Every
              proportion, connection and functional detail matters.
            </p>

          </div>


          <div className="craft-card">

            <span>03</span>

            <h3>
              Character
            </h3>

            <p>
              We believe the best pieces develop character with
              time — becoming uniquely connected to their rider.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          BRAND STATEMENT
      ========================= */}
      <section className="about-statement">

        <div className="about-statement-inner">

          <span className="about-eyebrow">
            OUR PHILOSOPHY
          </span>

          <h2>
            "The finest things
            <br />
            become part of the journey."
          </h2>

          <div className="about-statement-line" />

          <p>
            We don't believe in creating products simply to fill
            a catalogue. We believe in creating pieces that riders
            can trust, appreciate and carry with them for years.
          </p>

        </div>

      </section>


      {/* =========================
          RIDER / HORSE
      ========================= */}
      <section className="about-rider">

        <div className="about-rider-content">

          <span className="about-eyebrow dark">
            FOR BOTH
          </span>

          <h2>
            Because the journey
            <br />
            belongs to two.
          </h2>

          <p>
            Every equestrian product exists between rider and horse.
            Comfort, confidence and connection matter on both sides.
          </p>

          <p>
            That is why our approach considers the complete
            experience — not just the product itself.
          </p>

        </div>


        <div className="about-rider-image">

          <img
            src="https://anequestrianlife.com/wp-content/uploads/2023/08/show-rider-595x425.jpg"
            alt="Rider and horse"
          />

        </div>

      </section>


      {/* =========================
          VALUES
      ========================= */}
      <section className="about-values">

        <div className="about-section-heading">

          <span className="about-eyebrow">
            WHAT GUIDES US
          </span>

          <h2>
            Our values.
          </h2>

        </div>


        <div className="about-values-list">

          <div className="value-item">
            <span>01</span>
            <h3>Heritage</h3>
            <p>
              Respecting the traditions that shaped equestrian
              culture in India.
            </p>
          </div>

          <div className="value-item">
            <span>02</span>
            <h3>Craft</h3>
            <p>
              Paying attention to the details that make a product
              worthy of long-term use.
            </p>
          </div>

          <div className="value-item">
            <span>03</span>
            <h3>Purpose</h3>
            <p>
              Designing around the real needs of riders and horses.
            </p>
          </div>

          <div className="value-item">
            <span>04</span>
            <h3>Timelessness</h3>
            <p>
              Creating a visual language that doesn't depend on
              passing trends.
            </p>
          </div>

        </div>

      </section>


      {/* =========================
          CTA
      ========================= */}
      <section className="about-cta">

        <div className="about-cta-inner">

          <span className="about-eyebrow">
            SADDLE & CREST
          </span>

          <h2>
            Begin your
            <br />
            <em>journey.</em>
          </h2>

          <p>
            Explore our collection of equestrian essentials,
            crafted and selected for the modern rider.
          </p>

          <a href="/shop" className="about-cta-button">
            <span>EXPLORE THE COLLECTION</span>
            <ArrowUpRight size={17} strokeWidth={1.4} />
          </a>

        </div>

      </section>


      <Footer />

    </div>
  );
};

export default About;