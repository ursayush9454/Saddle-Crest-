import React from "react";
import PolicyPage from "../components/PolicyPage";
import "./Terms.css";

const Terms = () => {
  return (
    <PolicyPage
      eyebrow="LEGAL"
      title={
        <>
          Terms
          <br />
          <em>& Conditions</em>
        </>
      }
      intro="These terms govern your use of the Saddle & Crest website, services and purchases. Please read them carefully before using our website."
      faq={[
        {
          question: "Do I need an account to place an order?",
          answer:
            "You may be able to browse and purchase products without creating an account, depending on the features available on the website."
        },
        {
          question: "When is my order confirmed?",
          answer:
            "An order is considered accepted only after Saddle & Crest has successfully processed the order and issued an appropriate confirmation."
        },
        {
          question: "Can an order be cancelled?",
          answer:
            "Eligible orders may generally be cancelled before dispatch. Custom, personalized or made-to-order products may have different cancellation conditions."
        },
        {
          question: "Where can I find information about returns?",
          answer:
            "Please refer to our Returns & Refunds Policy for information about eligibility, return conditions, exchanges and refunds."
        }
      ]}
    >
      <div className="policy-updated">
        <span>LAST UPDATED</span>
        <p>17 September 2026</p>
      </div>

      {/* 01 */}
      <div className="policy-section">
        <span className="policy-number">01</span>

        <div>
          <h2>About These Terms</h2>

          <p>
            These Terms & Conditions govern your access to and use of
            the Saddle & Crest website, products and related services.
          </p>

          <p>
            By accessing our website or placing an order, you agree
            to comply with these terms and any applicable policies
            referenced on the website.
          </p>
        </div>
      </div>

      {/* 02 */}
      <div className="policy-section">
        <span className="policy-number">02</span>

        <div>
          <h2>Use of Our Website</h2>

          <p>
            You agree to use the Saddle & Crest website only for
            lawful purposes and in a manner that does not interfere
            with the operation, security or availability of the
            website.
          </p>

          <p>
            You must not attempt to gain unauthorized access to any
            part of the website, its systems or services.
          </p>

          <p>
            We may restrict or suspend access where reasonably
            necessary to protect our website, customers or business.
          </p>
        </div>
      </div>

      {/* 03 */}
      <div className="policy-section">
        <span className="policy-number">03</span>

        <div>
          <h2>Products & Information</h2>

          <p>
            We make reasonable efforts to ensure that product
            descriptions, images, dimensions, colours and other
            information displayed on the website are accurate.
          </p>

          <p>
            However, slight differences may occur due to screen
            settings, photography, natural materials or manufacturing
            characteristics.
          </p>

          <p>
            Product availability may change without prior notice.
          </p>
        </div>
      </div>

      {/* 04 */}
      <div className="policy-section">
        <span className="policy-number">04</span>

        <div>
          <h2>Prices & Payments</h2>

          <p>
            Product prices displayed on the website are shown in
            Indian Rupees unless otherwise stated.
          </p>

          <p>
            Applicable shipping charges, taxes or other charges will
            be displayed during the relevant stage of checkout where
            applicable.
          </p>

          <p>
            We may update prices, offers or promotions from time to
            time without prior notice.
          </p>

          <p>
            If a pricing or technical error affects an order, we may
            contact you before processing the order or cancel the
            affected order where appropriate.
          </p>
        </div>
      </div>

      {/* 05 */}
      <div className="policy-section">
        <span className="policy-number">05</span>

        <div>
          <h2>Orders & Acceptance</h2>

          <p>
            Placing an order on our website constitutes a request to
            purchase the selected products. Order acceptance is
            subject to product availability, payment confirmation
            and other applicable conditions.
          </p>

          <p>
            We reserve the right to refuse or cancel an order in
            circumstances including:
          </p>

          <ul>
            <li>Product unavailability.</li>
            <li>Payment failure.</li>
            <li>Incorrect customer or delivery information.</li>
            <li>Pricing or technical errors.</li>
            <li>Suspected fraudulent or unauthorized activity.</li>
            <li>Delivery restrictions.</li>
          </ul>
        </div>
      </div>

      {/* 06 */}
      <div className="policy-section">
        <span className="policy-number">06</span>

        <div>
          <h2>Custom & Made-to-Order</h2>

          <p>
            Certain Saddle & Crest products may be customized,
            personalized or made specifically according to customer
            requirements.
          </p>

          <p>
            Once production or customization has started, such
            orders may not be eligible for cancellation, exchange or
            return except where required by applicable law or
            otherwise agreed by Saddle & Crest.
          </p>

          <p>
            Any specific terms applicable to a custom order will be
            communicated to the customer where appropriate.
          </p>
        </div>
      </div>

      {/* 07 */}
      <div className="policy-section">
        <span className="policy-number">07</span>

        <div>
          <h2>Shipping & Delivery</h2>

          <p>
            Delivery estimates are provided for convenience and are
            not guaranteed unless expressly stated otherwise.
          </p>

          <p>
            Customers are responsible for providing complete and
            accurate delivery information.
          </p>

          <p>
            For detailed information about processing times,
            delivery, tracking and shipping conditions, please refer
            to our Shipping & Delivery Policy.
          </p>
        </div>
      </div>

      {/* 08 */}
      <div className="policy-section">
        <span className="policy-number">08</span>

        <div>
          <h2>Returns & Refunds</h2>

          <p>
            Returns, exchanges and refunds are governed by our
            Returns & Refunds Policy.
          </p>

          <p>
            Customers should review the applicable eligibility
            requirements and return conditions before submitting a
            return request.
          </p>
        </div>
      </div>

      {/* 09 */}
      <div className="policy-section">
        <span className="policy-number">09</span>

        <div>
          <h2>Intellectual Property</h2>

          <p>
            Unless otherwise stated, the Saddle & Crest name,
            branding, logos, product imagery, photographs, text,
            graphics, designs and other website content are owned by
            or licensed to Saddle & Crest.
          </p>

          <p>
            You may not reproduce, distribute, modify, publish,
            commercially exploit or otherwise use our content without
            prior written permission, except where permitted by
            applicable law.
          </p>
        </div>
      </div>

      {/* 10 */}
      <div className="policy-section">
        <span className="policy-number">10</span>

        <div>
          <h2>Third-Party Services</h2>

          <p>
            Our website may use third-party services for payment
            processing, shipping, analytics, communication,
            authentication or other business functions.
          </p>

          <p>
            Your use of certain third-party services may also be
            subject to the terms and privacy policies of those
            providers.
          </p>
        </div>
      </div>

      {/* 11 */}
      <div className="policy-section">
        <span className="policy-number">11</span>

        <div>
          <h2>Website Availability</h2>

          <p>
            We aim to keep the website available and functioning
            reliably, but we do not guarantee uninterrupted access
            at all times.
          </p>

          <p>
            Website availability may be affected by maintenance,
            technical issues, network failures, security incidents or
            circumstances beyond our reasonable control.
          </p>
        </div>
      </div>

      {/* 12 */}
      <div className="policy-section">
        <span className="policy-number">12</span>

        <div>
          <h2>Limitation of Liability</h2>

          <p>
            To the extent permitted by applicable law, Saddle & Crest
            will not be responsible for losses arising from events
            outside our reasonable control or from misuse of the
            website or products.
          </p>

          <p>
            Nothing in these terms is intended to exclude or limit
            any liability or consumer right that cannot legally be
            excluded or limited.
          </p>
        </div>
      </div>

      {/* 13 */}
      <div className="policy-section">
        <span className="policy-number">13</span>

        <div>
          <h2>Changes to These Terms</h2>

          <p>
            We may update these Terms & Conditions from time to time
            to reflect changes to our website, services, business
            practices or applicable requirements.
          </p>

          <p>
            The updated version will be published on this page with
            the relevant "Last Updated" date.
          </p>
        </div>
      </div>

      {/* 14 */}
      <div className="policy-section">
        <span className="policy-number">14</span>

        <div>
          <h2>Governing Law</h2>

          <p>
            These terms are intended to be governed by the applicable
            laws of India, subject to the rights and protections
            available to consumers under applicable law.
          </p>

          <p>
            Any disputes will be handled in accordance with the
            applicable legal framework and jurisdiction.
          </p>
        </div>
      </div>

      {/* 15 */}
      <div className="policy-section">
        <span className="policy-number">15</span>

        <div>
          <h2>Contact Us</h2>

          <p>
            If you have questions regarding these Terms & Conditions,
            please contact our concierge team.
          </p>

          <p>
            <strong>Email:</strong>{" "}
            deific.solution@hotmail.com
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            +91 8750200899
          </p>

          <p>
            <strong>Location:</strong>{" "}
            Kanpur · Uttar Pradesh · India
          </p>
        </div>
      </div>
    </PolicyPage>
  );
};

export default Terms;