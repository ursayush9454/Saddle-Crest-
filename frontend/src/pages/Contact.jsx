import React, { useState } from "react";
import { ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./Contact.css";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="contact-page">
      <Navbar />

      {/* HERO */}
      <section className="contact-hero">
        <div className="contact-hero-overlay" />

        <div className="contact-hero-content">
          <span className="contact-eyebrow">
            SADDLE & CREST CONCIERGE
          </span>

          <h1>
            We are here
            <br />
            <em>to assist.</em>
          </h1>

          <p>
            Questions about a product, an order, or finding the right
            piece for your riding journey? Our concierge team is here
            to help.
          </p>
        </div>

        <div className="contact-hero-scroll">
          <span>GET IN TOUCH</span>
          <div />
        </div>
      </section>

      {/* CONTACT INTRO */}
      <section className="contact-intro">
        <div className="contact-intro-label">
          <span>01</span>
          <span>CONTACT US</span>
        </div>

        <div className="contact-intro-content">
          <h2>
            A conversation
            <br />
            <em>begins here.</em>
          </h2>

          <p>
            Whether you're looking for product guidance, need help
            with an existing order, or simply want to learn more
            about Saddle & Crest, we'd be pleased to hear from you.
          </p>
        </div>
      </section>

      {/* CONTACT DETAILS + FORM */}
      <section className="contact-main">
        <div className="contact-details">
          <span className="contact-eyebrow dark">
            SPEAK WITH US
          </span>

          <h2>
            The House
            <br />
            Concierge
          </h2>

          <p className="contact-details-intro">
            Our team can assist with product information, sizing,
            orders, returns and general enquiries.
          </p>

          <div className="contact-info-list">
            <a
              href="mailto:deific.solution@hotmail.com"
              className="contact-info"
            >
              <div className="contact-info-icon">
                <Mail size={18} strokeWidth={1.2} />
              </div>

              <div>
                <span>EMAIL</span>
                <p>deific.solution@hotmail.com</p>
              </div>
            </a>

            <a
              href="tel:+918750200899"
              className="contact-info"
            >
              <div className="contact-info-icon">
                <Phone size={18} strokeWidth={1.2} />
              </div>

              <div>
                <span>CONCIERGE</span>
                <p>+91 8750200899</p>
              </div>
            </a>

            <div className="contact-info">
              <div className="contact-info-icon">
                <MapPin size={18} strokeWidth={1.2} />
              </div>

              <div>
                <span>THE HOUSE</span>
                <p>Kanpur · Uttar Pradesh · India</p>
              </div>
            </div>
          </div>

          <div className="contact-hours">
            <span>CONCIERGE HOURS</span>
            <p>Monday — Saturday</p>
            <p>10:00 AM — 6:00 PM IST</p>
          </div>
        </div>

        <div className="contact-form-wrap">
          <span className="contact-eyebrow dark">
            SEND AN ENQUIRY
          </span>

          <h3>
            How may we
            <br />
            help you?
          </h3>

          {submitted ? (
            <div className="contact-success">
              <div className="contact-success-mark">✓</div>

              <h4>Thank you.</h4>

              <p>
                Your enquiry has been received. Our concierge
                team will get back to you shortly.
              </p>
            </div>
          ) : (
            <form
              className="contact-form"
              onSubmit={handleSubmit}
            >
              <div className="contact-form-row">
                <div className="contact-field">
                  <label>YOUR NAME</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="contact-field">
                  <label>EMAIL ADDRESS</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="contact-form-row">
                <div className="contact-field">
                  <label>PHONE NUMBER</label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="contact-field">
                  <label>SUBJECT</label>

                  <select defaultValue="" required>
                    <option value="" disabled>
                      Select an enquiry
                    </option>
                    <option>Product Enquiry</option>
                    <option>Order Assistance</option>
                    <option>Shipping</option>
                    <option>Returns & Refunds</option>
                    <option>Custom Order</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="contact-field">
                <label>YOUR MESSAGE</label>

                <textarea
                  rows="6"
                  placeholder="Tell us how we can assist..."
                  required
                />
              </div>

              <button
                type="submit"
                className="contact-submit"
              >
                <span>SEND ENQUIRY</span>
                <ArrowUpRight
                  size={17}
                  strokeWidth={1.4}
                />
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="contact-faq">
        <div>
          <span className="contact-eyebrow">
            NEED A QUICK ANSWER?
          </span>

          <h2>
            Before you
            <br />
            <em>write to us.</em>
          </h2>
        </div>

        <div className="contact-faq-right">
          <p>
            Find answers to common questions about orders,
            shipping, returns, products and custom requests.
          </p>

          <Link to="/faq" className="contact-outline-button">
            <span>VISIT FAQ</span>
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

export default Contact;