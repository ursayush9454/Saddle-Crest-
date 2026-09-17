import React from "react";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Story.css";

const Story = () => {
  return (
    <div className="story-page">
      <Navbar />

      <main>

        {/* =========================================
            HERO
        ========================================= */}

        <section className="story-hero">
          <div className="story-hero-image">
            <img
              src="https://images4.alphacoders.com/900/thumb-1920-900530.jpg"
              alt="Horse and rider representing Saddle & Crest heritage"
            />
          </div>

          <div className="story-hero-overlay" />

          <div className="story-hero-content">
            <span className="story-eyebrow">
              THE HOUSE OF SADDLE & CREST
            </span>

            <h1>
              Born from
              <br />
              <em>a feeling.</em>
            </h1>

            <p>
              A story of horses, hands, leather and an enduring
              connection to Indian equestrian heritage.
            </p>
          </div>

          <div className="story-hero-bottom">
            <span>OUR STORY</span>

            <div />

            <span>EST. 2026</span>
          </div>

          <div className="story-scroll">
            <span>SCROLL TO EXPLORE</span>
            <ArrowDown size={15} strokeWidth={1.2} />
          </div>
        </section>


        {/* =========================================
            OPENING
        ========================================= */}

        <section className="story-opening">
          <div className="story-opening-label">
            <span>01</span>
            <span>THE BEGINNING</span>
          </div>

          <div className="story-opening-content">
            <p className="story-large-text">
              Some stories begin with a business idea.
              Ours began with a horse.
            </p>

            <p>
              Long before there was a name, a website or a
              collection, there was simply an appreciation for
              the relationship between a rider and a horse.
            </p>

            <p>
              There was something difficult to explain about
              watching a rider prepare before sunrise. The quiet
              tightening of a girth. The sound of leather being
              adjusted. The familiar weight of a saddle being
              placed carefully on a horse's back.
            </p>

            <p>
              These were ordinary moments to some people.
              But to us, they represented something much bigger.
            </p>
          </div>
        </section>


        {/* =========================================
            HERITAGE IMAGE
        ========================================= */}

        <section className="story-image-section">
          <div className="story-full-image">
            <img
              src="https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2022/08/21205407/Humayuns-Tomb-Inside-Image.png"
              alt="Indian equestrian heritage"
            />

            <div className="story-image-caption">
              <span>INDIAN EQUESTRIAN HERITAGE</span>
              <span>01 / 04</span>
            </div>
          </div>
        </section>


        {/* =========================================
            ROOTS
        ========================================= */}

        <section className="story-section story-roots">
          <div className="story-section-number">
            <span>02</span>
            <span>ROOTS</span>
          </div>

          <div className="story-section-content">

            <h2>
              Raised around
              <br />
              <em>tradition.</em>
            </h2>

            <p>
              India has always had a deep relationship with the
              horse.
            </p>

            <p>
              From the royal stables of Rajasthan to the riding
              grounds of old estates, horses were once woven into
              everyday life, ceremony and identity.
            </p>

            <p>
              Saddles were not simply functional objects.
              Bridles were not simply equipment. Leather goods
              were often made with the same patience given to
              objects meant to last for generations.
            </p>

            <p>
              We became fascinated by that philosophy.
            </p>

            <p>
              Not by the idea of recreating the past exactly as
              it was, but by understanding why certain things
              from the past still feel relevant today.
            </p>

            <div className="story-highlight">
              <span>“</span>

              <p>
                The finest objects do not ask for attention.
                They earn it slowly.
              </p>
            </div>

          </div>
        </section>


        {/* =========================================
            CRAFT IMAGE
        ========================================= */}

        <section className="story-split-image">
          <div className="story-split-image-item">
            <img
              src="https://img.freepik.com/premium-photo/world-handmade-leather-craftsmanship_960080-5830.jpg?w=900"
              alt="Leather craftsmanship"
            />

            <span>THE HAND</span>
          </div>

          <div className="story-split-image-copy">
            <span className="story-eyebrow dark">
              THE CRAFT
            </span>

            <h2>
              Made slowly.
              <br />
              <em>Made properly.</em>
            </h2>

            <p>
              There is a temptation in modern manufacturing to
              make everything faster.
            </p>

            <p>
              We chose a different direction.
            </p>

            <p>
              Leather has its own rhythm. It changes with time,
              responds to touch and develops a character that
              cannot be manufactured overnight.
            </p>

            <p>
              That is why our approach begins with the material
              itself.
            </p>
          </div>
        </section>


        {/* =========================================
            ARTISANS
        ========================================= */}

        <section className="story-artisans">

          <div className="story-artisans-heading">
            <span className="story-eyebrow dark">
              03 — THE MAKERS
            </span>

            <h2>
              Behind every
              <br />
              <em>piece.</em>
            </h2>
          </div>

          <div className="story-artisans-content">

            <p className="story-artisans-lead">
              A product may carry a brand name, but its character
              comes from the hands that made it.
            </p>

            <p>
              At Saddle & Crest, we believe craftsmanship deserves
              to remain visible.
            </p>

            <p>
              Cutting, stitching, shaping, polishing and finishing
              are not invisible processes to us. They are part of
              the identity of every piece.
            </p>

            <p>
              Our vision is to work with skilled craftspeople who
              understand leather not simply as a material, but as
              something that needs to be respected.
            </p>

            <p>
              Small imperfections in natural leather are not always
              something to hide. They can be evidence of its
              character, its origin and the fact that no two hides
              are exactly alike.
            </p>

            <div className="story-artisan-note">
              <span>THE PHILOSOPHY</span>

              <p>
                “If an object is made to last, the process of
                making it should matter.”
              </p>
            </div>

          </div>

        </section>


        {/* =========================================
            SECOND IMAGE
        ========================================= */}

        <section className="story-wide-image">
          <img
            src="/assets/story-rider.jpg"
            alt="Indian rider with horse"
          />

          <div className="story-wide-image-text">
            <span>THE RIDER & THE HORSE</span>

            <h2>
              More than
              <br />
              <em>equipment.</em>
            </h2>
          </div>
        </section>


        {/* =========================================
            THE RELATIONSHIP
        ========================================= */}

        <section className="story-section story-relationship">

          <div className="story-section-number">
            <span>04</span>
            <span>THE RELATIONSHIP</span>
          </div>

          <div className="story-section-content">

            <h2>
              It starts with
              <br />
              <em>trust.</em>
            </h2>

            <p>
              Every rider knows that equipment becomes part of a
              routine.
            </p>

            <p>
              The same bridle is handled before every ride.
              The same boots become familiar. A saddle begins to
              carry marks that belong only to its rider and horse.
            </p>

            <p>
              Over time, these objects stop feeling new.
              They become personal.
            </p>

            <p>
              This is what we want our products to become.
            </p>

            <p>
              Not pieces that look impressive for a season,
              but objects that become better companions with
              every mile, every ride and every season.
            </p>

          </div>

        </section>


        {/* =========================================
            BRAND BIRTH
        ========================================= */}

        <section className="story-birth">

          <div className="story-birth-inner">

            <span className="story-eyebrow">
              05 — THE HOUSE
            </span>

            <h2>
              And then,
              <br />
              <em>Saddle & Crest.</em>
            </h2>

            <p>
              The idea was simple:
            </p>

            <p className="story-birth-big">
              What if Indian heritage could meet modern
              equestrian design without losing the soul of either?
            </p>

            <p>
              That question became the beginning of Saddle & Crest.
            </p>

            <p>
              We wanted to create a house that felt distinctly
              Indian without becoming dependent on nostalgia.
            </p>

            <p>
              Something refined, but not cold.
              Traditional, but not old-fashioned.
              Modern, but not disposable.
            </p>

          </div>

        </section>


        {/* =========================================
            NAME
        ========================================= */}

        <section className="story-name">

          <div className="story-name-left">
            <span className="story-eyebrow dark">
              THE NAME
            </span>

            <h2>
              Saddle
              <br />
              <span>&</span>
              <br />
              Crest
            </h2>
          </div>

          <div className="story-name-right">

            <p>
              A saddle represents the journey.
            </p>

            <p>
              A crest represents identity, belonging and heritage.
            </p>

            <p>
              Together, Saddle & Crest represents what we believe
              modern equestrian life can be:
            </p>

            <strong>
              A journey rooted in heritage, carried forward
              with purpose.
            </strong>

          </div>

        </section>


        {/* =========================================
            TODAY
        ========================================= */}

        <section className="story-today">

          <div className="story-today-image">
            <img
              src="/assets/story-today.jpg"
              alt="Modern Indian equestrian lifestyle"
            />
          </div>

          <div className="story-today-content">

            <span className="story-eyebrow">
              06 — TODAY
            </span>

            <h2>
              The story is
              <br />
              <em>still being written.</em>
            </h2>

            <p>
              Today, Saddle & Crest is growing from that original
              idea into a complete equestrian house.
            </p>

            <p>
              Saddles, bridles, riding essentials and leather
              goods are being developed with the same philosophy:
              make fewer things, make them thoughtfully, and make
              them worthy of being kept.
            </p>

            <p>
              We are building for riders who appreciate details.
              For people who notice the feel of leather, the
              balance of a saddle and the difference between
              something manufactured and something crafted.
            </p>

            <p>
              And most importantly, we are building for the
              relationship between rider and horse.
            </p>

          </div>

        </section>


        {/* =========================================
            FUTURE
        ========================================= */}

        <section className="story-future">

          <div className="story-future-inner">

            <span className="story-eyebrow dark">
              07 — WHAT COMES NEXT
            </span>

            <h2>
              Heritage is not
              <br />
              something we
              <br />
              <em>look back at.</em>
            </h2>

            <p>
              It is something we carry forward.
            </p>

            <p>
              Our ambition is to build an Indian equestrian house
              recognised not only for how its products look, but
              for how they feel, perform and age.
            </p>

            <p>
              There is still much to learn.
              More craftspeople to meet.
              More riders to listen to.
              More horses to understand.
              More products to create.
            </p>

            <p>
              And that is exactly how we want it.
            </p>

          </div>

        </section>


        {/* =========================================
            CLOSING
        ========================================= */}

        <section className="story-closing">

          <div className="story-closing-mark">
            <span>SC</span>
          </div>

          <span className="story-eyebrow">
            SADDLE & CREST
          </span>

          <h2>
            Made for the
            <br />
            <em>journey.</em>
          </h2>

          <p>
            From our hands to yours.
            <br />
            From one generation to the next.
          </p>

          <Link
            to="/shop"
            className="story-closing-button"
          >
            <span>EXPLORE THE COLLECTION</span>
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

export default Story;