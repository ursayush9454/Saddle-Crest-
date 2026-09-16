import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import "./Newsletter.css";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    setEmail("");
  };

  return (
    <section className="newsletter">

      <div className="newsletter-inner">

        <span>THE SADDLE & CREST LETTER</span>

        <h2>
          Enter the
          <br />
          <em>Inner Circle.</em>
        </h2>

        <p>
          Be the first to discover new collections,
          private releases, craftsmanship stories and
          equestrian journals.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit">
            Subscribe
            <ArrowRight size={15} />
          </button>

        </form>

        <small>
          By subscribing, you agree to receive updates from
          Saddle & Crest.
        </small>

      </div>

    </section>
  );
};

export default Newsletter;