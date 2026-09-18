import React from "react";
import PolicyPage from "../components/PolicyPage";

const PrivacyPolicy = () => {
  return (
    <PolicyPage
      eyebrow="Privacy"
      title="Privacy Policy"
      intro="Your privacy matters to us. Learn how Saddle & Crest collects, uses, and protects your information."
    >
      <div className="policy-section">
        <h2>Information We Collect</h2>
        
        <p>
          We may collect information such as your name, email address,
          phone number, shipping address, billing details, and information
          required to process your orders.
        </p>
      </div>

      <div className="policy-section">
        <h2>How We Use Your Information</h2>
        <p>
          We use your information to process orders, provide customer
          support, improve our services, and communicate important updates
          related to your purchases.
        </p>
      </div>

      <div className="policy-section">
        <h2>Data Security</h2>
        <p>
          We take reasonable measures to protect your personal information
          against unauthorized access, alteration, disclosure, or misuse.
        </p>
      </div>

      <div className="policy-section">
        <h2>Cookies</h2>
        <p>
          Our website may use cookies and similar technologies to improve
          your browsing experience and understand how visitors use our
          website.
        </p>
      </div>

      <div className="policy-section">
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please
          contact our support team.
        </p>
      </div>
    </PolicyPage>
  );
};

export default PrivacyPolicy;