import React from "react";
import {
  ShieldCheck,
  HandHeart,
  Sparkles,
  RefreshCcw,
} from "lucide-react";

import "./WhyUs.css";

const reasons = [
  {
    icon: HandHeart,
    number: "01",
    title: "Handcrafted",
    text: "Every piece is carefully made with an uncompromising attention to detail.",
  },
  {
    icon: ShieldCheck,
    number: "02",
    title: "Built to Last",
    text: "Premium materials selected to perform beautifully ride after ride.",
  },
  {
    icon: Sparkles,
    number: "03",
    title: "Royal Heritage",
    text: "Indian equestrian tradition reinterpreted through a contemporary lens.",
  },
  {
    icon: RefreshCcw,
    number: "04",
    title: "Made for You",
    text: "Personalised fitting and custom details for a truly considered experience.",
  },
];

const WhyUs = () => {
  return (
    <section className="why-us">

      <div className="why-header">

        <span>06 — THE SADDLE & CREST STANDARD</span>

        <h2>
          Why
          <em> Saddle & Crest?</em>
        </h2>

        <p>
          Because exceptional riding deserves exceptional
          craftsmanship.
        </p>

      </div>

      <div className="why-grid">

        {reasons.map((item) => {
          const Icon = item.icon;

          return (
            <article className="why-card" key={item.number}>

              <div className="why-top">
                <span>{item.number}</span>

                <Icon size={24} strokeWidth={1} />
              </div>

              <h3>{item.title}</h3>

              <p>{item.text}</p>

              <div className="why-line" />

            </article>
          );
        })}

      </div>

    </section>
  );
};

export default WhyUs;