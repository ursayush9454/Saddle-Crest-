import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  MapPin,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../ShopContext/ShopContext";
import { apiRequest, getUser } from "../services/api";
import "./Checkout.css";
import Navbar from "../components/Navbar";

const Checkout = () => {
  const navigate = useNavigate();

  const {
    cart,
    cartSubtotal,
    clearCart,
  } = useShop();

  const user = getUser();

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const shipping = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    return cartSubtotal >= 10000 ? 0 : 450;
  }, [cartSubtotal]);

  const total = cartSubtotal + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const validateForm = () => {
    if (!form.fullName.trim()) {
      return "Please enter your full name.";
    }

    if (!form.phone.trim()) {
      return "Please enter your phone number.";
    }

    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      return "Please enter a valid 10-digit phone number.";
    }

    if (!form.address.trim()) {
      return "Please enter your complete address.";
    }

    if (!form.city.trim()) {
      return "Please enter your city.";
    }

    if (!form.state.trim()) {
      return "Please enter your state.";
    }

    if (!/^\d{6}$/.test(form.pincode.trim())) {
      return "Please enter a valid 6-digit pincode.";
    }

    return "";
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!cart || cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      /*
        Backend Order API expects:
        {
          items,
          shippingAddress,
          paymentMethod
        }
      */

      const orderItems = cart.map((item) => ({
        product:
          item.productId ||
          item.product?._id ||
          item.product?.id ||
          item._id ||
          item.id,

        quantity: Number(item.quantity),

        price: Number(
          item.salePrice ||
          item.product?.salePrice ||
          item.price ||
          item.product?.price ||
          0
        ),
      }));

      const orderData = {
        items: orderItems,

        shippingAddress: {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
        },

        paymentMethod,
      };

      const response = await apiRequest("/orders/place", {
        method: "POST",
        body: JSON.stringify(orderData),
      });

      const createdOrder =
        response.order ||
        response.data?.order ||
        response.data ||
        response;

      const createdOrderId =
        createdOrder?._id ||
        createdOrder?.id ||
        response.orderId ||
        "";

      setOrderId(createdOrderId);

      /*
        Only clear cart after backend confirms
        that the order was successfully created.
      */
      await clearCart();

      setOrderSuccess(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error("PLACE ORDER ERROR:", err);

      setError(
        err.message ||
          "Unable to place your order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     SUCCESS
  ========================================= */

  if (orderSuccess) {
    return (
      <main className="checkout-page">
        <Navbar />

        <section className="checkout-success">
          <div className="checkout-success-icon">
            <Check size={34} />
          </div>

          <span>ORDER CONFIRMED</span>

          <h1>
            Thank you for
            <em>choosing us.</em>
          </h1>

          <p>
            Your Saddle & Crest order has been successfully
            placed. We will carefully prepare your pieces for
            their journey to you.
          </p>

          {orderId && (
            <div className="checkout-order-number">
              <span>ORDER NUMBER</span>
              <strong>#{orderId}</strong>
            </div>
          )}

          <div className="checkout-success-actions">
            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="checkout-primary-btn"
            >
              VIEW MY ORDERS
              <ArrowRight size={17} />
            </button>

            <Link
              to="/shop"
              className="checkout-secondary-btn"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </section>
      </main>
    );
  }

  /* =========================================
     EMPTY CART
  ========================================= */

  if (!cart || cart.length === 0) {
    return (
      <main className="checkout-page">
        <Navbar />

        <section className="checkout-empty">
          <ShoppingBag size={40} strokeWidth={1.2} />

          <h1>Your cart is empty.</h1>

          <p>
            Add something beautiful to your trunk before
            proceeding to checkout.
          </p>

          <Link to="/shop">
            EXPLORE COLLECTION
            <ArrowRight size={17} />
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <Navbar navbarBackground={'#000'} top="0"/>

      {/* =========================================
          HEADER
      ========================================= */}


      {/* =========================================
          CHECKOUT CONTENT
      ========================================= */}

      <section className="checkout-layout">

        {/* =====================================
            FORM
        ===================================== */}

        <form
          className="checkout-form"
          onSubmit={handlePlaceOrder}
        >
          <div className="checkout-section">

            <div className="checkout-section-heading">
              <div className="checkout-section-number">
                01
              </div>

              <div>
                <span>DELIVERY DETAILS</span>
                <h2>Where should we deliver?</h2>
              </div>
            </div>

            <div className="checkout-fields">

              <div className="checkout-field full">
                <label>Full Name</label>

                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </div>

              <div className="checkout-field">
                <label>Phone Number</label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  maxLength="10"
                  autoComplete="tel"
                />
              </div>

              <div className="checkout-field">
                <label>Pincode</label>

                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                  maxLength="6"
                  inputMode="numeric"
                  autoComplete="postal-code"
                />
              </div>

              <div className="checkout-field full">
                <label>Complete Address</label>

                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="House / Flat / Street / Area"
                  rows="4"
                  autoComplete="street-address"
                />
              </div>

              <div className="checkout-field">
                <label>City</label>

                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  autoComplete="address-level2"
                />
              </div>

              <div className="checkout-field">
                <label>State</label>

                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="State"
                  autoComplete="address-level1"
                />
              </div>

            </div>
          </div>

          {/* =====================================
              PAYMENT
          ===================================== */}

          <div className="checkout-section">

            <div className="checkout-section-heading">
              <div className="checkout-section-number">
                02
              </div>

              <div>
                <span>PAYMENT</span>
                <h2>Choose your payment.</h2>
              </div>
            </div>

            <div className="payment-options">

              <button
                type="button"
                className={
                  paymentMethod === "COD"
                    ? "payment-option active"
                    : "payment-option"
                }
                onClick={() => setPaymentMethod("COD")}
              >
                <div className="payment-icon">
                  <Truck size={20} />
                </div>

                <div>
                  <strong>
                    Cash on Delivery
                  </strong>

                  <span>
                    Pay when your order arrives.
                  </span>
                </div>

                <div className="payment-radio">
                  {paymentMethod === "COD" && (
                    <span></span>
                  )}
                </div>
              </button>

              <button
                type="button"
                className={
                  paymentMethod === "Online"
                    ? "payment-option active"
                    : "payment-option"
                }
                onClick={() =>
                  setPaymentMethod("Online")
                }
              >
                <div className="payment-icon">
                  <CreditCard size={20} />
                </div>

                <div>
                  <strong>
                    Online Payment
                  </strong>

                  <span>
                    Secure digital payment.
                  </span>
                </div>

                <div className="payment-radio">
                  {paymentMethod === "Online" && (
                    <span></span>
                  )}
                </div>
              </button>

            </div>

            {paymentMethod === "Online" && (
              <div className="payment-notice">
                Online payment gateway can be connected
                when the payment provider is configured.
                The order will still be sent with
                <strong> Online </strong>
                as the selected payment method.
              </div>
            )}
          </div>

          {/* ERROR */}

          {error && (
            <div className="checkout-error">
              {error}
            </div>
          )}

          {/* PLACE ORDER */}

          <button
            type="submit"
            className="place-order-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="checkout-spinner"></span>
                PLACING ORDER...
              </>
            ) : (
              <>
                PLACE ORDER
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <p className="checkout-secure-note">
            <Check size={15} />
            Your order information is securely processed.
          </p>
        </form>

        {/* =====================================
            ORDER SUMMARY
        ===================================== */}

        <aside className="checkout-summary">

          <div className="checkout-summary-heading">
            <span>YOUR SELECTION</span>
            <h2>Order Summary</h2>
          </div>

          <div className="checkout-products">

            {cart.map((item) => {
              const productId =
                item.productId ||
                item.product?._id ||
                item.product?.id ||
                item._id ||
                item.id;

              const image =
                item.image ||
                item.product?.image ||
                item.product?.images?.[0] ||
                "";

              const price = Number(
                item.salePrice ||
                item.product?.salePrice ||
                item.price ||
                item.product?.price ||
                0
              );

              return (
                <div
                  className="checkout-product"
                  key={productId}
                >
                  <div className="checkout-product-image">
                    {image ? (
                      <img
                        src={image}
                        alt={item.name}
                      />
                    ) : (
                      <ShoppingBag size={20} />
                    )}

                    <span>
                      {item.quantity}
                    </span>
                  </div>

                  <div className="checkout-product-info">
                    <strong>
                      {item.name ||
                        item.product?.name}
                    </strong>

                    <span>
                      ₹{price.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <strong className="checkout-product-total">
                    ₹
                    {(
                      price *
                      Number(item.quantity)
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>
              );
            })}

          </div>

          <div className="checkout-summary-lines">

            <div>
              <span>Subtotal</span>

              <strong>
                ₹{cartSubtotal.toLocaleString("en-IN")}
              </strong>
            </div>

            <div>
              <span>Shipping</span>

              <strong>
                {shipping === 0
                  ? "Complimentary"
                  : `₹${shipping.toLocaleString(
                      "en-IN"
                    )}`}
              </strong>
            </div>

          </div>

          <div className="checkout-total">
            <span>Total</span>

            <strong>
              ₹{total.toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="checkout-shipping-note">
            <MapPin size={17} />

            <span>
              Complimentary shipping on orders above
              ₹10,000.
            </span>
          </div>

        </aside>
      </section>
    </main>
  );
};

export default Checkout;