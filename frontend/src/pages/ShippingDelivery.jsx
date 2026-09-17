import React from "react";
import PolicyPage from "../components/PolicyPage";

const ShippingDelivery = () => {
  return (
    <PolicyPage
      eyebrow="SADDLE & CREST"
      title="Shipping & Delivery"
      intro="Every order is prepared with care and delivered with the attention your purchase deserves."
    >
      <p className="policy-updated">
        Last Updated: 17 September 2026
      </p>

      <section>
        <h2>1. Order Processing</h2>

        <p>
          Orders are generally processed after successful payment and order
          confirmation.
        </p>

        <p>
          Most standard orders are processed within <strong>1–3 business days</strong>.
        </p>

        <p>
          Orders containing customized, made-to-order, or specially prepared
          products may require additional processing time. The applicable
          estimated timeline will be communicated or displayed before or after
          order confirmation.
        </p>
      </section>

      <section>
        <h2>2. Delivery Timeline</h2>

        <p>
          Once your order has been dispatched, delivery generally takes
          approximately:
        </p>

        <div className="policy-highlight">
          3–7 business days for most locations in India.
        </div>

        <p>
          Delivery timelines may vary depending on the destination, courier
          availability, weather, public holidays, remote-area delivery
          conditions, and other logistical circumstances.
        </p>
      </section>

      <section>
        <h2>3. Shipping Charges</h2>

        <p>
          Applicable shipping charges, if any, will be displayed during
          checkout before you complete your purchase.
        </p>

        <p>
          From time to time, Saddle & Crest may offer promotional
          free-shipping or reduced-shipping offers.
        </p>
      </section>

      <section>
        <h2>4. Delivery Areas</h2>

        <p>
          We currently aim to deliver across eligible locations within India.
        </p>

        <p>
          Certain remote, restricted, or otherwise inaccessible locations may
          have limited delivery availability.
        </p>
      </section>

      <section>
        <h2>5. Order Tracking</h2>

        <p>
          Once your order has been dispatched, tracking information may be
          shared with you through email, SMS, WhatsApp, or your customer
          account, depending on the communication options available.
        </p>
      </section>

      <section>
        <h2>6. Accurate Delivery Information</h2>

        <p>
          Customers are responsible for providing accurate delivery
          information, including:
        </p>

        <ul>
          <li>Full name</li>
          <li>Complete shipping address</li>
          <li>City</li>
          <li>State</li>
          <li>Postal code</li>
          <li>Valid phone number</li>
        </ul>
      </section>

      <section>
        <h2>7. Delayed Deliveries</h2>

        <p>
          Although we work to deliver orders within the estimated timeframe,
          delays may occur because of weather conditions, courier delays,
          public holidays, regional restrictions, natural events, high-volume
          periods, address-related issues, or events beyond our reasonable
          control.
        </p>
      </section>

      <section>
        <h2>8. Damaged Package</h2>

        <p>
          If your package appears visibly damaged at the time of delivery,
          we recommend documenting the condition before opening it.
        </p>

        <p>
          Where possible, please take clear photographs or video of the outer
          packaging, shipping label, visible damage, and product after opening.
        </p>
      </section>

      <section>
        <h2>9. Missing or Incorrect Items</h2>

        <p>
          If your order contains a missing, incorrect, or materially different
          item, please contact us promptly with your order number and relevant
          photographs.
        </p>
      </section>

      <section>
        <h2>10. Multiple Products in One Order</h2>

        <p>
          Items may occasionally be shipped separately depending on product
          availability, warehouse processing, or logistics requirements.
        </p>
      </section>

      <section>
        <h2>11. International Shipping</h2>

        <p>
          International shipping availability, if introduced, will be subject
          to destination, customs requirements, applicable duties, taxes, and
          logistics availability.
        </p>
      </section>

      <section>
        <h2>12. Contact Us</h2>

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

export default ShippingDelivery;