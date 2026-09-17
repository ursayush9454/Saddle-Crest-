import React, { useState } from "react";
import {
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";

import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./FAQ.css";

const faqData = [
  {
    category: "ORDERS",
    questions: [
      {
        question: "How can I place an order?",
        answer:
          "Browse our collection, select the product you wish to purchase, choose the required options where available, and add it to your cart. Continue to checkout to complete your order.",
      },
      {
        question: "Can I modify my order after placing it?",
        answer:
          "If your order has not yet been processed or dispatched, we may be able to help with certain changes. Please contact our concierge team as soon as possible with your order number.",
      },
      {
        question: "How can I check my order status?",
        answer:
          "Once your order is confirmed and processed, available tracking or order updates will be shared through the contact details associated with your order.",
      },
    ],
  },

  {
    category: "SHIPPING",
    questions: [
      {
        question: "How long does delivery take?",
        answer:
          "Orders generally require 1–3 business days for processing. Standard delivery within India generally takes around 3–7 business days after dispatch. Delivery timelines are estimates and may vary by location.",
      },
      {
        question: "Do you offer international shipping?",
        answer:
          "International shipping may be available for selected locations. Any applicable customs duties, taxes or import charges are generally the responsibility of the customer unless otherwise stated at checkout.",
      },
      {
        question: "How can I track my order?",
        answer:
          "Where tracking is available, tracking details will be shared through the contact information provided with your order or through your account.",
      },
    ],
  },

  {
    category: "RETURNS",
    questions: [
      {
        question: "What is your return policy?",
        answer:
          "Eligible products can generally be returned within 7 days of delivery, subject to our Returns & Refunds Policy and the product meeting the applicable return conditions.",
      },
      {
        question: "Which products are not eligible for return?",
        answer:
          "Customized, personalized, made-to-order or altered products may not be eligible for return once production or customization has begun, except where required by applicable law or otherwise agreed by Saddle & Crest.",
      },
      {
        question: "When will I receive my refund?",
        answer:
          "Refunds are processed after the returned product has been received and inspected. The time for the amount to appear in your account can depend on the payment method and financial institution.",
      },
    ],
  },

  {
    category: "PRODUCTS",
    questions: [
      {
        question: "How do I choose the right saddle?",
        answer:
          "Saddle selection depends on the horse, rider, discipline, fit and intended use. If you are unsure, contact our concierge team before purchasing so we can help you understand the available options.",
      },
      {
        question: "Do you offer product guidance?",
        answer:
          "Yes. Our concierge team can assist with product information, general sizing guidance, care information and other questions about our collection.",
      },
      {
        question: "Do your products come with care instructions?",
        answer:
          "Care requirements vary by material and product. Where applicable, care information will be provided with the product or can be requested from our concierge team.",
      },
    ],
  },

  {
    category: "CUSTOM",
    questions: [
      {
        question: "Do you accept custom orders?",
        answer:
          "Selected products may be available for customization or made-to-order requests. Availability, pricing, production timelines and cancellation or return conditions may vary by product.",
      },
      {
        question: "Can I request a personalized product?",
        answer:
          "Personalization may be available on selected products. Please contact our concierge team with your requirements before placing the order.",
      },
    ],
  },

  {
    category: "PAYMENTS",
    questions: [
      {
        question: "Which payment methods do you accept?",
        answer:
          "Available payment methods are displayed during checkout. The options shown may vary depending on your location, order and payment provider.",
      },
      {
        question: "Is my payment information secure?",
        answer:
          "Payments are processed through available payment service providers. Saddle & Crest does not intend to store complete payment card information on its own systems unless specifically stated.",
      },
    ],
  },
];

const FAQ = () => {
  const [openItem, setOpenItem] = useState(null);

  const toggleItem = (categoryIndex, questionIndex) => {
    const id = `${categoryIndex}-${questionIndex}`;

    setOpenItem((current) =>
      current === id ? null : id
    );
  };

  return (
    <div className="faq-page">
      <Navbar />

      {/* HERO */}
      <section className="faq-hero">
        <div className="faq-hero-overlay" />

        <div className="faq-hero-content">
          <span className="faq-eyebrow">
            SADDLE & CREST
          </span>

          <h1>
            Frequently
            <br />
            <em>Asked.</em>
          </h1>

          <p>
            Everything you need to know about our products,
            orders, shipping and services.
          </p>
        </div>

        <div className="faq-hero-scroll">
          <span>EXPLORE QUESTIONS</span>
          <div />
        </div>
      </section>

      {/* INTRO */}
      <section className="faq-intro">
        <div className="faq-intro-number">
          <span>01</span>
          <span>THE FAQ</span>
        </div>

        <div>
          <h2>
            Answers for the
            <br />
            <em>journey ahead.</em>
          </h2>

          <p>
            We've gathered answers to some of the most common
            questions from our riders and customers.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-content">
        {faqData.map((group, categoryIndex) => (
          <div
            className="faq-category"
            key={group.category}
          >
            <div className="faq-category-title">
              <span>
                {String(categoryIndex + 1).padStart(2, "0")}
              </span>

              <h3>{group.category}</h3>
            </div>

            <div className="faq-list">
              {group.questions.map(
                (item, questionIndex) => {
                  const id = `${categoryIndex}-${questionIndex}`;
                  const isOpen = openItem === id;

                  return (
                    <div
                      className={`faq-item ${
                        isOpen ? "open" : ""
                      }`}
                      key={item.question}
                    >
                      <button
                        className="faq-question"
                        onClick={() =>
                          toggleItem(
                            categoryIndex,
                            questionIndex
                          )
                        }
                        aria-expanded={isOpen}
                      >
                        <span>{item.question}</span>

                        <span className="faq-icon">
                          <ChevronDown
                            size={18}
                            strokeWidth={1.3}
                          />
                        </span>
                      </button>

                      <div className="faq-answer">
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        ))}
      </section>

      {/* CONTACT CTA */}
      <section className="faq-contact">
        <div>
          <span className="faq-eyebrow">
            STILL HAVE A QUESTION?
          </span>

          <h2>
            Speak with
            <br />
            <em>our concierge.</em>
          </h2>
        </div>

        <div className="faq-contact-right">
          <p>
            If you couldn't find what you were looking for,
            our team will be happy to assist you directly.
          </p>

          <Link
            to="/contact"
            className="faq-contact-button"
          >
            <span>CONTACT US</span>

            <ArrowUpRight
              size={17}
              strokeWidth={1.4}
            />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;