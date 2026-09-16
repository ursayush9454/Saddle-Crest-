import React from "react";
import {
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

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

          <a href="#contact" className="footer-concierge">
            <span>SPEAK WITH OUR CONCIERGE</span>
            <ArrowUpRight size={15} strokeWidth={1.4} />
          </a>

        </div>


        {/* COLLECTIONS */}
        <div className="footer-column">
          <h4>Collections</h4>

          <a href="#saddles">Saddles</a>
          <a href="#bridles">Bridles</a>
          <a href="#rider">Rider</a>
          <a href="#horse-care">Horse Care</a>
          <a href="#leather">Leather Goods</a>
          <a href="#custom">Custom</a>
        </div>


        {/* THE HOUSE */}
        <div className="footer-column">
          <h4>The House</h4>

          <a href="#story">Our Story</a>
          <a href="#craftsmanship">Craftsmanship</a>
          <a href="#heritage">Our Heritage</a>
          <a href="#journal">Journal</a>
          <a href="#reviews">Reviews</a>
          <a href="#instagram">Instagram</a>
        </div>


        {/* CLIENT SERVICES */}
        <div className="footer-column">
          <h4>Client Services</h4>

          <a href="#contact">Contact Us</a>
          <a href="#shipping">Shipping & Delivery</a>
          <a href="#returns">Returns & Exchange</a>
          <a href="#care">Product Care</a>
          <a href="#faq">FAQs</a>
          <a href="#fitting">Fitting Consultation</a>
        </div>

      </div>


      {/* =========================
          CONTACT STRIP
      ========================= */}
      <div className="footer-contact">

        <div className="footer-contact-item">

          <div className="contact-icon">
            <MapPin size={17} strokeWidth={1.2} />
          </div>

          <div>
            <span>VISIT THE HOUSE</span>
            <p>Kanpur · Uttar Pradesh · India</p>
          </div>

        </div>


        <div className="footer-contact-item">

          <div className="contact-icon">
            <Mail size={17} strokeWidth={1.2} />
          </div>

          <div>
            <span>EMAIL</span>
            <p>deific.solution@hotmail.com</p>
          </div>

        </div>


        <div className="footer-contact-item">

          <div className="contact-icon">
            <Phone size={17} strokeWidth={1.2} />
          </div>

          <div>
            <span>CONCIERGE</span>
            <p>+91 8750200899</p>
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


        <div className="footer-legal">
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <a href="#cookies">Cookies</a>
        </div>


        {/* SOCIAL ICONS */}
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
            aria-label="Youtube"
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