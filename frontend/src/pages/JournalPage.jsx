import React from "react";
import {
  ArrowUpRight,
  Clock,
  BookOpen,
} from "lucide-react";

import "./JournalPage.css";
import Navbar from "../components/Navbar";

const articles = [
  {
    category: "HERITAGE",
    title: "The Marwari Horse: An Indian Icon",
    date: "SEPTEMBER 2026",
    read: "6 MIN READ",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1500&q=90",
  },
  {
    category: "CRAFT",
    title: "Inside the Art of Indian Leather",
    date: "AUGUST 2026",
    read: "5 MIN READ",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1500&q=90",
  },
  {
    category: "EQUESTRIAN",
    title: "The Quiet Discipline of Riding",
    date: "JULY 2026",
    read: "7 MIN READ",
    image:
      "https://images.unsplash.com/photo-1708916340019-98d25a1451ad?auto=format&fit=crop&w=1500&q=90",
  },
  {
    category: "STYLE",
    title: "A Modern Guide to Jodhpur Style",
    date: "JUNE 2026",
    read: "4 MIN READ",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1500&q=90",
  },
];

const JournalPage = () => {
  return (
    <main className="journal-page">
        <Navbar/>

      <section className="journal-page-hero">

        <div>

          <span>THE SADDLE & CREST JOURNAL</span>

          <h1>
            Stories of
            <em> the ride.</em>
          </h1>

          <p>
            Heritage, craftsmanship, horsemanship and the
            people who keep India's equestrian culture moving.
          </p>

        </div>

        <div className="journal-page-hero-bottom">
          <span>05 — JOURNAL</span>
          <span>READ · LEARN · DISCOVER</span>
        </div>

      </section>


      <section className="journal-featured">

        <div className="journal-featured-image">

          <img
            src={articles[0].image}
            alt={articles[0].title}
          />

        </div>

        <div className="journal-featured-content">

          <span>{articles[0].category}</span>

          <h2>{articles[0].title}</h2>

          <p>
            From royal courts to modern arenas, discover the
            history and enduring character of one of India's
            most distinctive horse breeds.
          </p>

          <div className="journal-meta">
            <span>{articles[0].date}</span>
            <span>{articles[0].read}</span>
          </div>

          <a href="#journal-articles">
            READ STORY
            <ArrowUpRight size={17} />
          </a>

        </div>

      </section>


      <section
        className="journal-articles"
        id="journal-articles"
      >

        <div className="journal-heading">

          <div>
            <span>FROM THE JOURNAL</span>

            <h2>
              Recent
              <em> stories.</em>
            </h2>
          </div>

          <BookOpen size={25} strokeWidth={1} />

        </div>


        <div className="journal-grid">

          {articles.slice(1).map((article) => (
            <article
              className="journal-card"
              key={article.title}
            >

              <div className="journal-card-image">

                <img
                  src={article.image}
                  alt={article.title}
                />

                <span>{article.category}</span>

              </div>

              <div className="journal-card-content">

                <div className="journal-card-meta">
                  <span>{article.date}</span>
                  <span>
                    <Clock size={12} />
                    {article.read}
                  </span>
                </div>

                <h3>{article.title}</h3>

                <a href="#">
                  READ ARTICLE
                  <ArrowUpRight size={15} />
                </a>

              </div>

            </article>
          ))}

        </div>

      </section>


      <section className="journal-manifesto">

        <span>THE SADDLE & CREST PHILOSOPHY</span>

        <h2>
          We believe the
          <br />
          <em>ride</em> is more than
          <br />
          movement.
        </h2>

        <p>
          It is culture. It is discipline. It is a relationship
          between rider, horse, craft and place.
        </p>

      </section>

    </main>
  );
};

export default JournalPage;