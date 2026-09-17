import React from "react";
import {
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
} from "react-icons/fa";

import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      {/* =========================
          FOOTER MAIN
      ========================= */}
      <div className="footer-main">

        {/* BRAND */}
        <div className="footer-brand">

          <div className="footer-logo">
            <span>SADDLE</span>
            <small>&</small>
            <span>CREST</span>
          </div>

          <p>
            Equestrian craftsmanship rooted in Indian heritage,
            created for riders who value tradition, precision
            and timeless style.
          </p>

          <Link to="/contact" className="footer-concierge">
            <span>SPEAK WITH OUR CONCIERGE</span>
            <ArrowUpRight size={15} strokeWidth={1.4} />
          </Link>

        </div>


        {/* =========================
            COLLECTIONS
        ========================= */}
        <div className="footer-column">

          <h4>Collections</h4>

          <Link to="/shop?category=saddles">
            Saddles
          </Link>

          <Link to="/shop?category=bridles">
            Bridles
          </Link>

          <Link to="/rider">
            Rider
          </Link>

          <Link to="/shop?category=horse-care">
            Horse Care
          </Link>

          <Link to="/shop?category=leather-goods">
            Leather Goods
          </Link>

          <Link to="/shop?category=custom">
            Custom
          </Link>

        </div>


        {/* =========================
            THE HOUSE
        ========================= */}
        <div className="footer-column">

          <h4>The House</h4>

          <Link to="/about">
            Our Story
          </Link>

          <a href="#craftsmanship">
            Craftsmanship
          </a>

          <Link to="/collections">
          Our Heritage
          </Link>

          <Link to="/journal">
            Journal
          </Link>

<Link to="/reviews"> Reviews</Link>
          <a
            href="#instagram"
            className="footer-link-external"
          >
            Instagram
          </a>

        </div>


        {/* =========================
            CLIENT SERVICES
        ========================= */}
        <div className="footer-column">

          <h4>Client Services</h4>

          <Link to="/contact">
            Contact Us
          </Link>

          <Link to="/shipping-delivery">
            Shipping & Delivery
          </Link>

          <Link to="/returns-refunds">
            Returns & Refunds
          </Link>

            <Link to="/horse">Product-care</Link> 

          <Link to ="/Faq">
            FAQs
          </Link>

          <a href="#fitting">
            Fitting Consultation
          </a>

        </div>

      </div>


      {/* =========================
          CONTACT STRIP
      ========================= */}
      <div className="footer-contact">

        {/* LOCATION */}
        <div className="footer-contact-item">

          <div className="contact-icon">
            <MapPin
              size={17}
              strokeWidth={1.2}
            />
          </div>

          <div>
            <span>VISIT THE HOUSE</span>
            <p>
              Kanpur · Uttar Pradesh · India
            </p>
          </div>

        </div>


        {/* EMAIL */}
        <div className="footer-contact-item">

          <div className="contact-icon">
            <Mail
              size={17}
              strokeWidth={1.2}
            />
          </div>

          <div>
            <span>EMAIL</span>

            <a
              href="mailto:deific.solution@hotmail.com"
            >
              deific.solution@hotmail.com
            </a>
          </div>

        </div>


        {/* PHONE */}
        <div className="footer-contact-item">

          <div className="contact-icon">
            <Phone
              size={17}
              strokeWidth={1.2}
            />
          </div>

          <div>
            <span>CONCIERGE</span>

            <a href="tel:+918750200899">
              +91 8750200899
            </a>
          </div>

        </div>

      </div>


      {/* =========================
          FOOTER BOTTOM
      ========================= */}
      <div className="footer-bottom">

        <p className="footer-copy">
          © 2026 Saddle & Crest. All rights reserved.
        </p>


        {/* LEGAL */}
        <div className="footer-legal">

          <Link to="/privacy-policy">
            Privacy
          </Link>

          <Link to="/terms">
            Terms
          </Link>

          <Link to="/cancellation-policy">
            Cancellation
          </Link>

          <Link to="/shipping-delivery">
            Shipping
          </Link>

          <Link to="/returns-refunds">
            Returns
          </Link>

        </div>


        {/* SOCIAL */}
        <div className="footer-social">

          <a
            href="#instagram"
            aria-label="Instagram"
            className="social-icon"
          >
            <FaInstagram />
          </a>

          <a
            href="#facebook"
            aria-label="Facebook"
            className="social-icon"
          >
            <FaFacebookF />
          </a>

          <a
            href="#youtube"
            aria-label="YouTube"
            className="social-icon"
          >
            <FaYoutube />
          </a>

        </div>

      </div>

    </footer>
  );
};

export default Footer;