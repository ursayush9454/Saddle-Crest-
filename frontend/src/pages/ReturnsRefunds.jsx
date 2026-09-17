import React from "react";
import PolicyPage from "../components/PolicyPage";
import "./ReturnsRefunds.css";
const ReturnsRefunds = () => {
  return (
    <PolicyPage
      eyebrow="CLIENT SERVICES"
      title={
        <>
          Returns
          <br />
          <em>& Refunds</em>
        </>
      }
      intro="Our approach to returns, exchanges and refunds is designed to keep your experience with Saddle & Crest simple and transparent."
      faq={[
        {
          question: "How long do I have to request a return?",
          answer:
            "Eligible products can generally be returned within 7 days of delivery, subject to the conditions of our Returns & Refunds Policy."
        },
        {
          question: "What condition must the product be in?",
          answer:
            "Products should generally be unused, unworn and returned in their original condition with packaging, tags and accessories where applicable."
        },
        {
          question: "Are customized products returnable?",
          answer:
            "Customized, personalized, made-to-order or altered products may not be eligible for return once production or customization has started, except where required by applicable law."
        },
        {
          question: "When will my refund be processed?",
          answer:
            "Refunds are processed after the returned product has been received and inspected. The time for the amount to appear in your account may depend on your payment method and financial institution."
        }
      ]}
    >
      <div className="policy-updated">
        <span>LAST UPDATED</span>
        <p>17 September 2026</p>
      </div>

      <div className="policy-section">
        <span className="policy-number">01</span>

        <div>
          <h2>Our Returns Approach</h2>

          <p>
            At Saddle & Crest, we want you to feel confident when
            purchasing from us. If a product does not meet the
            applicable return conditions, you may request a return
            within the eligible return period.
          </p>

          <p>
            Unless otherwise stated for a particular product,
            eligible products can generally be returned within
            <strong> 7 days of delivery.</strong>
          </p>

          <p>
            All returns are subject to product eligibility,
            condition and inspection.
          </p>
        </div>
      </div>

      <div className="policy-section">
        <span className="policy-number">02</span>

        <div>
          <h2>Eligible Returns</h2>

          <p>
            A return may generally be considered in circumstances
            including:
          </p>

          <ul>
            <li>Wrong product received.</li>
            <li>Product damaged during transit.</li>
            <li>Manufacturing defect.</li>
            <li>Product materially different from its description.</li>
            <li>Another qualifying reason accepted under our policy.</li>
          </ul>

          <p>
            Eligibility may vary depending on the product and the
            circumstances of the request.
          </p>
        </div>
      </div>

      <div className="policy-section">
        <span className="policy-number">03</span>

        <div>
          <h2>Condition of the Product</h2>

          <p>
            To be eligible for a return, products should generally
            be:
          </p>

          <ul>
            <li>Unused and unworn.</li>
            <li>In their original condition.</li>
            <li>Returned with original packaging where applicable.</li>
            <li>Returned with tags, accessories and documentation where applicable.</li>
          </ul>

          <p>
            Products showing signs of use, damage, alteration or
            misuse may not qualify for a return.
          </p>
        </div>
      </div>

      <div className="policy-section">
        <span className="policy-number">04</span>

        <div>
          <h2>Non-Returnable Products</h2>

          <p>
            Certain products may not be eligible for return,
            including where applicable:
          </p>

          <ul>
            <li>Customized products.</li>
            <li>Personalized products.</li>
            <li>Made-to-order products.</li>
            <li>Products altered specifically to customer requirements.</li>
            <li>Certain hygiene-related products.</li>
            <li>Products specifically identified as non-returnable.</li>
          </ul>

          <p>
            This does not affect any rights or remedies that may
            apply under applicable law.
          </p>
        </div>
      </div>

      <div className="policy-section">
        <span className="policy-number">05</span>

        <div>
          <h2>How to Request a Return</h2>

          <p>
            To initiate a return, contact our concierge team with
            the following information:
          </p>

          <ul>
            <li>Order number.</li>
            <li>Product name.</li>
            <li>Reason for the return.</li>
            <li>Relevant photographs or videos where applicable.</li>
          </ul>

          <p>
            Our team will review the request and provide the next
            steps if the return is eligible.
          </p>
        </div>
      </div>

      <div className="policy-section">
        <span className="policy-number">06</span>

        <div>
          <h2>Return Shipping</h2>

          <p>
            Depending on the reason for the return, return shipping
            may be handled differently.
          </p>

          <p>
            For verified cases involving a wrong product, confirmed
            manufacturing defect or transit damage, Saddle & Crest
            may arrange or bear the applicable return shipping cost.
          </p>

          <p>
            For other approved returns, the applicable return
            shipping arrangement or cost will be communicated by
            our concierge team.
          </p>
        </div>
      </div>

      <div className="policy-section">
        <span className="policy-number">07</span>

        <div>
          <h2>Exchanges</h2>

          <p>
            Exchanges may be available for eligible products,
            subject to product availability and applicable return
            conditions.
          </p>

          <p>
            If the requested replacement is unavailable, we may
            offer another appropriate resolution depending on the
            circumstances.
          </p>
        </div>
      </div>

      <div className="policy-section">
        <span className="policy-number">08</span>

        <div>
          <h2>Refunds</h2>

          <p>
            Once an approved return has been received and inspected,
            the applicable refund will be processed.
          </p>

          <p>
            Refunds will generally be made through the original
            payment method or another appropriate method where
            necessary.
          </p>

          <p>
            The time taken for the refund to reflect in your account
            depends on the payment provider, bank or financial
            institution involved.
          </p>
        </div>
      </div>

      <div className="policy-section">
        <span className="policy-number">09</span>

        <div>
          <h2>Damaged or Incorrect Products</h2>

          <p>
            If your order arrives damaged or you receive an incorrect
            product, please contact us as soon as reasonably possible.
          </p>

          <p>
            We may request photographs or videos of the product,
            packaging and shipping label to help us investigate the
            issue.
          </p>

          <p>
            Please retain the original packaging until the matter
            has been resolved.
          </p>
        </div>
      </div>

      <div className="policy-section">
        <span className="policy-number">10</span>

        <div>
          <h2>Custom & Made-to-Order Products</h2>

          <p>
            Custom, personalized and made-to-order products are
            created specifically according to customer requirements.
          </p>

          <p>
            Such orders may not be eligible for cancellation,
            exchange or return once production or customization has
            started, except where required by applicable law or
            otherwise agreed by Saddle & Crest.
          </p>
        </div>
      </div>

      <div className="policy-section">
        <span className="policy-number">11</span>

        <div>
          <h2>Contact Our Concierge</h2>

          <p>
            For questions regarding a return, exchange or refund,
            please contact the Saddle & Crest concierge team.
          </p>

          <p>
            <strong>Email:</strong>{" "}
            deific.solution@hotmail.com
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            +91 8750200899
          </p>
        </div>
      </div>
    </PolicyPage>
  );
};

export default ReturnsRefunds;