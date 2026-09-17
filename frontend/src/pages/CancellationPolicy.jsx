import React from "react";
import PolicyPage from "../components/PolicyPage";

const CancellationPolicy = () => {
  return (
    <PolicyPage
      eyebrow="SADDLE & CREST"
      title="Cancellation Policy"
      intro="Plans change. We make cancellations simple wherever the order stage allows."
    >
      <p className="policy-updated">
        Last Updated: 17 September 2026
      </p>

      <section>
        <h2>1. Cancelling a Standard Order</h2>

        <p>
          A standard order may generally be cancelled before it has been
          dispatched.
        </p>

        <p>
          To request cancellation, contact Saddle & Crest as soon as possible
          with your order number.
        </p>
      </section>

      <section>
        <h2>2. Cancellation Before Dispatch</h2>

        <p>
          If your cancellation request is received and accepted before
          dispatch, the order will be cancelled and the applicable amount will
          be refunded.
        </p>
      </section>

      <section>
        <h2>3. Orders Already Dispatched</h2>

        <p>
          Once an order has been dispatched, cancellation may not be possible.
        </p>

        <p>
          If the product is eligible for return, you may request a return
          after delivery in accordance with our Returns & Refunds Policy.
        </p>
      </section>

      <section>
        <h2>4. Customized Products</h2>

        <p>
          Customized, personalized, or made-to-order products may enter
          production shortly after the order is confirmed.
        </p>

        <p>
          Once production or customization has started, cancellation may not
          be available except where required by applicable law or where Saddle
          & Crest agrees otherwise.
        </p>
      </section>

      <section>
        <h2>5. Cancellation by Saddle & Crest</h2>

        <p>Saddle & Crest may cancel an order because of:</p>

        <ul>
          <li>Product unavailability.</li>
          <li>Incorrect pricing caused by a technical error.</li>
          <li>Payment authorization failure.</li>
          <li>Suspected fraudulent or unauthorized activity.</li>
          <li>Incorrect or incomplete customer information.</li>
          <li>Delivery restrictions.</li>
          <li>Circumstances beyond our reasonable control.</li>
        </ul>
      </section>

      <section>
        <h2>6. Refund After Cancellation</h2>

        <p>
          Where a cancellation is approved, the applicable refund will
          generally be processed through the original payment method or
          another appropriate method.
        </p>

        <p>
          The time taken for the refund to appear may depend on the payment
          gateway, bank, card issuer, or financial institution.
        </p>
      </section>

      <section>
        <h2>7. Promotional Orders</h2>

        <p>
          Orders placed using promotional offers, discount codes, gift
          vouchers, or special pricing may be subject to additional
          cancellation and refund conditions.
        </p>
      </section>

      <section>
        <h2>8. Partial Cancellation</h2>

        <p>
          If an order contains multiple products, cancellation of individual
          products may be possible before dispatch depending on the order
          status and product availability.
        </p>
      </section>

      <section>
        <h2>9. Duplicate Orders</h2>

        <p>
          If you accidentally place duplicate orders, contact us immediately
          with the relevant order numbers.
        </p>
      </section>

      <section>
        <h2>10. Contact Us</h2>

        <p>
          <strong>Saddle & Crest</strong>
          <br />
          Jaipur · Rajasthan · India
          <br />
          Email: concierge@saddleandcrest.com
        </p>
      </section>
    </PolicyPage>
  );
};

export default CancellationPolicy;