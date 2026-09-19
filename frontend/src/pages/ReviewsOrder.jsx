import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  CreditCard,
  MapPin,
  Package,
  Phone,
  User,
  ShieldCheck,
  Tag,
  X,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { useShop } from "../ShopContext/ShopContext";
import { apiRequest } from "../services/api";
import "./ReviewsOrder.css";

const ReviewOrder = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useShop();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Customer consent
  const [consentAccepted, setConsentAccepted] = useState(false);

  // =========================================
  // COUPON
  // =========================================

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  // =========================================
  // CHECKOUT DATA
  // =========================================

  const checkoutData = useMemo(() => {
    try {
      const saved = sessionStorage.getItem("saddleCheckoutData");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, []);

  // =========================================
  // PRICE HELPER
  // =========================================

  const getItemPrice = (item) => {
    return Number(
      item.salePrice ??
        item.product?.salePrice ??
        item.price ??
        item.product?.price ??
        0
    );
  };

  // =========================================
  // SUBTOTAL
  // =========================================

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = getItemPrice(item);
      const quantity = Number(item.quantity || 1);

      return sum + price * quantity;
    }, 0);
  }, [cart]);

  // =========================================
  // SHIPPING
  // =========================================

  const shipping = useMemo(() => {
    if (subtotal === 0) return 0;

    return subtotal >= 10000 ? 0 : 450;
  }, [subtotal]);

  // =========================================
  // DISCOUNT
  // =========================================

  const discount = Number(appliedCoupon?.discount || 0);

  // Never allow discount to exceed subtotal
  const safeDiscount = Math.min(discount, subtotal);

  // =========================================
  // FINAL TOTAL
  // =========================================

  const total = Math.max(
    0,
    subtotal + shipping - safeDiscount
  );

  // =========================================
  // APPLY COUPON
  // =========================================

  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();

    setCouponError("");
    setError("");

    if (!code) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    if (!cart.length) {
      setCouponError("Your cart is empty.");
      return;
    }

    try {
      setCouponLoading(true);

      /*
       * Backend should validate:
       * - coupon exists
       * - active status
       * - expiry
       * - minimum order
       * - usage limit
       * - discount rules
       */

      const response = await apiRequest(
        "/coupons/validate",
        {
          method: "POST",
          body: JSON.stringify({
            code,
            cartTotal: subtotal,
          }),
        }
      );

      const validatedCoupon =
        response?.coupon ||
        response?.data?.coupon ||
        null;

      const validatedDiscount = Number(
        response?.discount ??
          response?.data?.discount ??
          validatedCoupon?.discount ??
          0
      );

      if (
        response?.valid === false ||
        response?.data?.valid === false
      ) {
        throw new Error(
          response?.message ||
            response?.data?.message ||
            "This coupon is not valid."
        );
      }

      if (validatedDiscount <= 0) {
        throw new Error(
          response?.message ||
            response?.data?.message ||
            "This coupon cannot be applied."
        );
      }

      setAppliedCoupon({
        code:
          validatedCoupon?.code ||
          response?.code ||
          code,

        discount: Math.min(
          validatedDiscount,
          subtotal
        ),

        discountType:
          validatedCoupon?.discountType ||
          response?.discountType ||
          "",

        discountValue:
          validatedCoupon?.discountValue ??
          response?.discountValue ??
          null,
      });

      setCouponCode("");

    } catch (err) {
      console.error(
        "Coupon validation error:",
        err
      );

      setAppliedCoupon(null);

      setCouponError(
        err?.message ||
          "Unable to validate this coupon."
      );
    } finally {
      setCouponLoading(false);
    }
  };

  // =========================================
  // REMOVE COUPON
  // =========================================

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    setError("");
  };

  // =========================================
  // PLACE ORDER
  // =========================================

  const handlePlaceOrder = async () => {
    // Consent validation
    if (!consentAccepted) {
      setError(
        "Please accept the Terms & Conditions and Privacy Policy before placing your order."
      );
      return;
    }

    // Checkout validation
    if (!checkoutData) {
      setError(
        "Checkout details are missing. Please go back and enter your details."
      );
      return;
    }

    // Cart validation
    if (!cart.length) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      /*
       * Coupon code is sent to backend.
       *
       * IMPORTANT:
       * Backend should validate the coupon again while
       * creating the order. Frontend discount is only UI data.
       */

      const orderData = {
        shippingAddress: {
          fullName: checkoutData.fullName || "",
          phone: checkoutData.phone || "",
          addressLine1: checkoutData.address || "",
          addressLine2: checkoutData.addressLine2 || "",
          city: checkoutData.city || "",
          state: checkoutData.state || "",
          pincode: checkoutData.pincode || "",
          country: checkoutData.country || "India",
        },

        paymentMethod:
          checkoutData.paymentMethod || "COD",

        // Customer consent
        termsAccepted: consentAccepted,
        privacyPolicyAccepted: consentAccepted,

        // Coupon
        couponCode:
          appliedCoupon?.code || null,
      };

      const response = await apiRequest(
        "/orders/place",
        {
          method: "POST",
          body: JSON.stringify(orderData),
        }
      );

      // =========================================
      // GET CREATED ORDER ID
      // =========================================

      const createdOrderId =
        response?.order?._id ||
        response?.order?.id ||
        response?.orderId ||
        response?.data?._id ||
        response?.data?.orderId ||
        "";

      setOrderId(createdOrderId);

      // =========================================
      // CLEAR CART
      // =========================================

      await clearCart();

      // Remove checkout session data
      sessionStorage.removeItem(
        "saddleCheckoutData"
      );

      // Show success screen
      setOrderSuccess(true);

    } catch (err) {
      console.error(
        "Place order error:",
        err
      );

      setError(
        err?.message ||
          "Unable to place your order right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // ORDER SUCCESS
  // =========================================

  if (orderSuccess) {
    return (
      <>
        <Navbar />

        <main className="review-success-page">
          <div className="review-success-card">

            <div className="success-icon">
              <Check size={34} />
            </div>

            <span className="review-eyebrow">
              ORDER CONFIRMED
            </span>

            <h1>
              Thank You For Your Order
            </h1>

            <p>
              Your order has been successfully
              placed. We will start preparing it
              shortly.
            </p>

            {orderId && (
              <div className="success-order-id">
                <span>Order ID</span>
                <strong>{orderId}</strong>
              </div>
            )}

            <div className="success-actions">

              <button
                type="button"
                onClick={() =>
                  navigate("/orders")
                }
              >
                VIEW MY ORDERS
              </button>

              <button
                type="button"
                className="secondary-success-btn"
                onClick={() =>
                  navigate("/shop")
                }
              >
                CONTINUE SHOPPING
              </button>

            </div>

          </div>
        </main>
      </>
    );
  }

  // =========================================
  // NO CHECKOUT DATA
  // =========================================

  if (!checkoutData) {
    return (
      <>
        <Navbar />

        <main className="review-empty-page">
          <div className="review-empty-card">

            <Package size={42} />

            <span className="review-eyebrow">
              CHECKOUT
            </span>

            <h1>
              Review Details Not Found
            </h1>

            <p>
              Please return to checkout and enter
              your delivery details before
              reviewing your order.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/checkout")
              }
            >
              BACK TO CHECKOUT
            </button>

          </div>
        </main>
      </>
    );
  }

  // =========================================
  // MAIN REVIEW PAGE
  // =========================================

  return (
    <>
      <Navbar />

      <main className="review-page">
        <div className="review-container">

          {/* HEADER */}

          <div className="review-header">

            <button
              type="button"
              className="back-checkout-btn"
              onClick={() =>
                navigate("/checkout")
              }
            >
              <ArrowLeft size={17} />
              Back to Checkout
            </button>

            <div className="review-title-wrap">

              <span className="review-eyebrow">
                FINAL REVIEW
              </span>

              <h1>
                Review Your Order
              </h1>

              <p>
                Please verify your delivery details
                and order information before placing
                your order.
              </p>

            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div className="review-error">
              {error}
            </div>
          )}

          <div className="review-layout">

            {/* LEFT SIDE */}

            <div className="review-main">

              {/* DELIVERY */}

              <section className="review-card">

                <div className="review-card-heading">

                  <div className="heading-icon">
                    <MapPin size={19} />
                  </div>

                  <div>
                    <span>DELIVERY</span>
                    <h2>
                      Delivery Details
                    </h2>
                  </div>

                </div>

                <div className="delivery-details">

                  <div className="detail-row">
                    <User size={17} />

                    <div>
                      <small>FULL NAME</small>

                      <strong>
                        {checkoutData.fullName}
                      </strong>
                    </div>
                  </div>

                  <div className="detail-row">
                    <Phone size={17} />

                    <div>
                      <small>PHONE</small>

                      <strong>
                        {checkoutData.phone}
                      </strong>
                    </div>
                  </div>

                  <div className="detail-row address-row">
                    <MapPin size={17} />

                    <div>
                      <small>ADDRESS</small>

                      <strong>
                        {checkoutData.address}

                        <br />

                        {checkoutData.city},{" "}
                        {checkoutData.state}

                        <br />

                        {checkoutData.pincode}
                      </strong>
                    </div>
                  </div>

                </div>

                <button
                  type="button"
                  className="edit-details-btn"
                  onClick={() =>
                    navigate("/checkout")
                  }
                >
                  EDIT DETAILS
                </button>

              </section>

              {/* PAYMENT */}

              <section className="review-card">

                <div className="review-card-heading">

                  <div className="heading-icon">
                    <CreditCard size={19} />
                  </div>

                  <div>
                    <span>PAYMENT</span>

                    <h2>
                      Payment Method
                    </h2>
                  </div>

                </div>

                <div className="payment-review">

                  <div className="payment-check">
                    <Check size={16} />
                  </div>

                  <div>

                    <strong>
                      {checkoutData.paymentMethod ===
                      "COD"
                        ? "Cash on Delivery"
                        : "Online Payment"}
                    </strong>

                    <p>
                      {checkoutData.paymentMethod ===
                      "COD"
                        ? "Pay when your order is delivered."
                        : "Payment will be processed through the available online payment method."}
                    </p>

                  </div>

                </div>

              </section>

              {/* ORDER ITEMS */}

              <section className="review-card">

                <div className="review-card-heading">

                  <div className="heading-icon">
                    <Package size={19} />
                  </div>

                  <div>
                    <span>
                      YOUR SELECTION
                    </span>

                    <h2>
                      Order Items
                    </h2>
                  </div>

                </div>

                <div className="review-items">

                  {cart.map((item) => {

                    const quantity =
                      Number(
                        item.quantity || 1
                      );

                    const itemTotal =
                      getItemPrice(item) *
                      quantity;

                    return (
                      <div
                        className="review-item"
                        key={
                          item._id ||
                          item.id
                        }
                      >

                        <div className="review-item-image">

                          <img
                            src={
                              item.image ||
                              item.product?.image ||
                              ""
                            }
                            alt={
                              item.name ||
                              item.product?.name ||
                              "Product"
                            }
                          />

                        </div>

                        <div className="review-item-info">

                          <h3>
                            {item.name ||
                              item.product?.name ||
                              "Product"}
                          </h3>

                          <span>
                            Quantity:{" "}
                            {quantity}
                          </span>

                        </div>

                        <strong className="review-item-price">
                          ₹
                          {itemTotal.toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>
                    );
                  })}

                </div>

              </section>

            </div>

            {/* RIGHT SIDE */}

            <aside className="review-summary-card">

              {/* SUMMARY HEADER */}

              <div className="summary-top">

                <span>
                  ORDER SUMMARY
                </span>

                <h2>
                  Your Order
                </h2>

              </div>

              {/* SUMMARY ITEMS */}

              <div className="summary-items">

                {cart.map((item) => {

                  const itemPrice =
                    getItemPrice(item);

                  const itemQuantity =
                    Number(
                      item.quantity || 1
                    );

                  return (
                    <div
                      className="summary-item"
                      key={
                        item._id ||
                        item.id
                      }
                    >

                      <div>

                        <strong>
                          {item.name ||
                            item.product?.name ||
                            "Product"}
                        </strong>

                        <span>
                          Qty {itemQuantity}
                        </span>

                      </div>

                      <strong>
                        ₹
                        {(
                          itemPrice *
                          itemQuantity
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>
                  );
                })}

              </div>

              <div className="summary-divider" />

              {/* SUBTOTAL */}

              <div className="summary-row">

                <span>
                  Subtotal
                </span>

                <strong>
                  ₹
                  {subtotal.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

              {/* SHIPPING */}

              <div className="summary-row">

                <span>
                  Shipping
                </span>

                <strong>
                  {shipping === 0
                    ? "FREE"
                    : `₹${shipping.toLocaleString(
                        "en-IN"
                      )}`}
                </strong>

              </div>

              {/* COUPON DISCOUNT */}

              {appliedCoupon && (
                <div className="summary-row coupon-discount-row">

                  <span>
                    Discount
                  </span>

                  <strong>
                    -₹
                    {safeDiscount.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>
              )}

              <div className="summary-divider" />

              {/* TOTAL */}

              <div className="summary-total">

                <span>
                  Total
                </span>

                <div className="summary-total-price">

                  {appliedCoupon && (
                    <span className="original-total-price">
                      ₹
                      {(
                        subtotal + shipping
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  )}

                  <strong>
                    ₹
                    {total.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

              </div>

              {/* SAVINGS */}

              {appliedCoupon &&
                safeDiscount > 0 && (
                  <div className="coupon-savings">
                    You saved ₹
                    {safeDiscount.toLocaleString(
                      "en-IN"
                    )}{" "}
                    on this order
                  </div>
                )}

              {/* =========================================
                  CUSTOMER CONSENT
              ========================================= */}

              <div className="consent-box">

                <label className="consent-label">

                  <input
                    type="checkbox"
                    checked={consentAccepted}
                    onChange={(e) => {

                      setConsentAccepted(
                        e.target.checked
                      );

                      if (e.target.checked) {
                        setError("");
                      }

                    }}
                  />

                  <span className="custom-checkbox">

                    {consentAccepted && (
                      <Check
                        size={13}
                        strokeWidth={3}
                      />
                    )}

                  </span>

                  <span className="consent-text">

                    I agree to the{" "}

                    <button
                      type="button"
                      className="consent-link"
                      onClick={() =>
                        navigate("/terms")
                      }
                    >
                      Terms & Conditions
                    </button>{" "}

                    and{" "}

                    <button
                      type="button"
                      className="consent-link"
                      onClick={() =>
                        navigate(
                          "/privacy-policy"
                        )
                      }
                    >
                      Privacy Policy
                    </button>
                    .

                  </span>

                </label>


              </div>

              {/* =========================================
                  COUPON
              ========================================= */}

              <div className="coupon-box">

                <div className="coupon-heading">

                  <div className="coupon-heading-icon">
                    <Tag size={16} />
                  </div>

                  <div>
                    <span>
                      HAVE A COUPON?
                    </span>

                    <p>
                      Apply your discount code
                    </p>
                  </div>

                </div>

                {!appliedCoupon ? (
                  <>
                    <div className="coupon-input-row">

                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(
                            e.target.value.toUpperCase()
                          );
                          setCouponError("");
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter"
                          ) {
                            e.preventDefault();
                            handleApplyCoupon();
                          }
                        }}
                        placeholder="Enter coupon code"
                        maxLength={30}
                        disabled={couponLoading}
                      />

                      <button
                        type="button"
                        onClick={
                          handleApplyCoupon
                        }
                        disabled={couponLoading}
                      >
                        {couponLoading ? (
                          <Loader2
                            size={15}
                            className="coupon-spinner"
                          />
                        ) : (
                          "APPLY"
                        )}
                      </button>

                    </div>

                    {couponError && (
                      <p className="coupon-error">
                        {couponError}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="coupon-applied">

                    <div className="coupon-applied-left">

                      <div className="coupon-success-icon">
                        <Check size={14} />
                      </div>

                      <div>

                        <strong>
                          {appliedCoupon.code}
                        </strong>

                        <span>
                          Coupon applied successfully
                        </span>

                      </div>

                    </div>

                    <button
                      type="button"
                      className="remove-coupon-btn"
                      onClick={
                        handleRemoveCoupon
                      }
                      title="Remove coupon"
                    >
                      <X size={15} />
                    </button>

                  </div>
                )}

              </div>

              {/* =========================================
                  PLACE ORDER
              ========================================= */}

              <button
                type="button"
                className="confirm-order-btn"
                onClick={handlePlaceOrder}
                disabled={
                  loading ||
                  !consentAccepted
                }
              >

                {loading ? (
                  <>
                    <span className="review-spinner" />
                    PLACING ORDER...
                  </>
                ) : (
                  <>
                    CONFIRM & PLACE ORDER
                    <Check size={18} />
                  </>
                )}

              </button>

              {/* SECURE NOTE */}

              <p className="secure-note">
                By placing this order, you confirm
                that all the above information is
                correct.
              </p>

            </aside>

          </div>
        </div>
      </main>
    </>
  );
};

export default ReviewOrder;