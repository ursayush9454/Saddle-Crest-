import React from "react";
import { ArrowUpRight } from "lucide-react";

import "./Collections.css";
import Navbar from "../components/Navbar";

const collections = [
  {
    number: "01",
    title: "The Black Label",
    subtitle: "SIGNATURE COLLECTION",
    description:
      "Our most refined expression of Saddle & Crest — dark leather, understated hardware and uncompromising craftsmanship.",
    image:
      "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1600&q=90",
  },
  {
    number: "02",
    title: "Rajputana",
    subtitle: "HERITAGE COLLECTION",
    description:
      "Inspired by India's royal equestrian traditions and the timeless elegance of Rajasthan.",
    image:
      "https://media.admiddleeast.com/photos/651abd627d01c0bd22201f5e/1:1/w_3056,h_3056,c_limit/Suryagarh%20Akshay%20Shoot-7A%20Retouched.jpg",
  },
  {
    number: "03",
    title: "Stable Essentials",
    subtitle: "EVERYDAY COLLECTION",
    description:
      "Practical pieces for everyday riding, grooming and stable life — designed without compromising on style.",
    image:
      "https://www.equus-journeys.com/photos/400x400/rider-and-marwari-horse-rajasthan-6526.jpg",
  },
];

const Collections = () => {
  return (
    <main className="collections-page">
        <Navbar/>

      <section className="collections-hero">

        <div className="collections-hero-content">

          <span>THE HOUSE OF SADDLE & CREST</span>

          <h1>
            Collections
            <em> with character.</em>
          </h1>

          <p>
            Distinct worlds of equestrian craftsmanship,
            brought together by a shared respect for heritage.
          </p>

        </div>

        <div className="collections-hero-bottom">
          <span>04 — COLLECTIONS</span>
          <span>CRAFT · HERITAGE · PERFORMANCE</span>
        </div>

      </section>


      <section className="collections-intro">

        <span>OUR WORLDS</span>

        <h2>
          Different expressions.
          <br />
          One <em>standard.</em>
        </h2>

        <p>
          Each Saddle & Crest collection tells a different story.
          Together they form a modern interpretation of India's
          equestrian culture.
        </p>

      </section>


      <section className="collections-list">

        {collections.map((collection, index) => (
          <article
            className={`collection-card ${
              index % 2 !== 0 ? "reverse" : ""
            }`}
            key={collection.number}
          >

            <div className="collection-image">

              <img
                src={collection.image}
                alt={collection.title}
              />

              <span>{collection.number}</span>

            </div>

            <div className="collection-content">

              <span className="collection-subtitle">
                {collection.subtitle}
              </span>

              <h2>{collection.title}</h2>

              <p>{collection.description}</p>

              <a href="/shop">
                EXPLORE COLLECTION
                <ArrowUpRight size={17} />
              </a>

            </div>

          </article>
        ))}

      </section>


      <section className="collections-custom">

        <span>BESPOKE</span>

        <h2>
          Made around
          <br />
          <em>your story.</em>
        </h2>

        <p>
          For riders who want something truly their own,
          our bespoke service brings together custom fit,
          materials and finishing.
        </p>

        <a href="/shop">
          DISCOVER BESPOKE
          <ArrowUpRight size={17} />
        </a>

      </section>

    </main>
  );
};

export default Collections;