import React, { useState } from "react";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";


import "./PolicyPage.css";

const PolicyPage = ({
  eyebrow,
  title,
  intro,
  children,
  faq = [],
}) => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="policy-page">
      <Navbar />

      <main>
        {/* =========================
            POLICY HERO
        ========================= */}
        <section className="policy-hero">
          <div className="policy-hero-inner">
            <span className="policy-eyebrow">
              {eyebrow}
            </span>
            
            <h1>{title}</h1>

            <p>{intro}</p>
          </div>

          <div className="policy-hero-line">
      
            <div />
          </div>
          
        </section>

        {/* =========================
            POLICY CONTENT
        ========================= */}
        <section className="policy-content">
          <div className="policy-container">
            {children}
          </div>
        </section>

        {/* =========================
            OPTIONAL FAQ
        ========================= */}
        {faq.length > 0 && (
          <section className="policy-faq">
            <div className="policy-faq-heading">
              <span className="policy-eyebrow dark">
                COMMON QUESTIONS
              </span>

              <h2>
                Good to
                <br />
                <em>know.</em>
              </h2>

              <p>
                A few answers to questions you may have
                about this policy.
              </p>
            </div>

            <div className="policy-faq-list">
              {faq.map((item, index) => {
                const isOpen = openFaq === index;

                return (
                  <div
                    className={`policy-faq-item ${
                      isOpen ? "open" : ""
                    }`}
                    key={item.question}
                  >
                    <button
                      type="button"
                      className="policy-faq-question"
                      onClick={() => toggleFaq(index)}
                      aria-expanded={isOpen}
                    >
                      <span>{item.question}</span>

                      <span className="policy-faq-icon">
                        <ChevronDown
                          size={18}
                          strokeWidth={1.3}
                        />
                      </span>
                    </button>

                    <div className="policy-faq-answer">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* =========================
            CONTACT CTA
        ========================= */}
        <section className="policy-contact">
          <div>
            <span className="policy-eyebrow">
              NEED MORE HELP?
            </span>

            <h2>
              We're here
              <br />
              <em>to assist.</em>
            </h2>
          </div>

          <div className="policy-contact-right">
            <p>
              Have a question that isn't covered here?
              Speak with the Saddle & Crest concierge team.
            </p>

            <Link
              to="/contact"
              className="policy-contact-button"
            >
              <span>CONTACT US</span>

              <ArrowUpRight
                size={17}
                strokeWidth={1.4}
              />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PolicyPage;