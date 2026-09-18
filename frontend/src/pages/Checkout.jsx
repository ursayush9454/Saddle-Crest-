
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Plus,
  Check,
  ArrowLeft,
  CreditCard,
  Banknote,
  Loader2,
  Package,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { apiRequest } from "../services/api";
import { useShop } from "../ShopContext/ShopContext";

import "./Checkout.css";

const emptyForm = {
  fullName: "",
  phone: "",
  address: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cart } = useShop();

  const [checkoutData, setCheckoutData] = useState(emptyForm);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showNewAddress, setShowNewAddress] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [error, setError] = useState("");

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const price = Number(
        item.salePrice ??
          item.product?.salePrice ??
          item.price ??
          item.product?.price ??
          0
      );

      return total + price * Number(item.quantity || 1);
    }, 0);
  }, [cart]);

  const shipping = subtotal >= 10000 ? 0 : 450;
  const total = subtotal + shipping;

  /* =========================
     SELECT SAVED ADDRESS
  ========================= */

  const selectSavedAddress = (address) => {
    if (!address) return;

    const id = address._id || address.id;

    setSelectedAddressId(id);

    /*
      Profile currently saves:
      address

      Backend order model uses:
      addressLine1

      So we support BOTH formats here.
    */

    const addressLine1 =
      address.address ||
      address.addressLine1 ||
      "";

    const addressLine2 =
      address.addressLine2 || "";

    const mappedAddress = {
      fullName: address.fullName || "",
      phone: address.phone || "",
      address: addressLine1,
      addressLine2,
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      country: address.country || "India",
    };

    setCheckoutData(mappedAddress);
    setShowNewAddress(false);
    setError("");

    /*
      Also keep the selected address immediately
      available for the review page.
    */

    sessionStorage.setItem(
      "saddleCheckoutData",
      JSON.stringify({
        ...mappedAddress,
        paymentMethod,
      })
    );
  };

  /* =========================
     LOAD SAVED ADDRESSES
  ========================= */

  useEffect(() => {
    const loadAddresses = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", {
          state: {
            from: "/checkout",
          },
        });

        return;
      }

      try {
        setLoadingAddresses(true);
        setError("");

        const data = await apiRequest("/auth/me");

        const currentUser =
          data?.user ||
          data?.data?.user ||
          data?.data ||
          data;

        const userAddresses = Array.isArray(
          currentUser?.addresses
        )
          ? currentUser.addresses
          : [];

        setAddresses(userAddresses);

        /*
          Automatically select:
          1. Default address
          2. Otherwise first address
        */

        const defaultAddress =
          userAddresses.find(
            (address) =>
              address.isDefault === true ||
              address.default === true
          ) || userAddresses[0];

        if (defaultAddress) {
          selectSavedAddress(defaultAddress);
        } else {
          setShowNewAddress(true);
          setCheckoutData(emptyForm);
        }
      } catch (err) {
        console.error(
          "CHECKOUT ADDRESS ERROR:",
          err
        );

        setError(
          err?.message ||
            "Unable to load saved addresses."
        );
      } finally {
        setLoadingAddresses(false);
      }
    };

    loadAddresses();
  }, [navigate]);

  /* =========================
     INPUT CHANGE
  ========================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setCheckoutData((prev) => ({
      ...prev,
      [name]: value,
    }));

    /*
      User is creating/editing a new address,
      so remove saved-address selection.
    */

    setSelectedAddressId(null);
    setError("");
  };

  /* =========================
     NEW ADDRESS
  ========================= */

  const handleNewAddress = () => {
    setShowNewAddress(true);
    setSelectedAddressId(null);
    setCheckoutData(emptyForm);
    setError("");
  };

  /* =========================
     VALIDATION
  ========================= */

  const validateForm = () => {
    if (!checkoutData.fullName?.trim()) {
      setError("Please enter your full name.");
      return false;
    }

    if (
      !/^[6-9]\d{9}$/.test(
        checkoutData.phone?.trim()
      )
    ) {
      setError(
        "Please enter a valid 10-digit phone number."
      );
      return false;
    }

    if (!checkoutData.address?.trim()) {
      setError("Please enter your address.");
      return false;
    }

    if (!checkoutData.city?.trim()) {
      setError("Please enter your city.");
      return false;
    }

    if (!checkoutData.state?.trim()) {
      setError("Please enter your state.");
      return false;
    }

    if (
      !/^\d{6}$/.test(
        checkoutData.pincode?.trim()
      )
    ) {
      setError(
        "Please enter a valid 6-digit pincode."
      );
      return false;
    }

    return true;
  };

  /* =========================
     CONTINUE TO REVIEW
  ========================= */

  const continueToReview = (event) => {
    event.preventDefault();

    setError("");

    if (!cart?.length) {
      setError("Your shopping bag is empty.");
      return;
    }

    if (!validateForm()) return;

    const finalCheckoutData = {
      fullName: checkoutData.fullName.trim(),
      phone: checkoutData.phone.trim(),
      address: checkoutData.address.trim(),
      addressLine2:
        checkoutData.addressLine2?.trim() || "",
      city: checkoutData.city.trim(),
      state: checkoutData.state.trim(),
      pincode: checkoutData.pincode.trim(),
      country: checkoutData.country || "India",
      paymentMethod,
    };

    /*
      This is the exact object ReviewOrder will read.
    */

    sessionStorage.setItem(
      "saddleCheckoutData",
      JSON.stringify(finalCheckoutData)
    );

    navigate("/review-order");
  };

  /* =========================
     LOADING
  ========================= */

  if (loadingAddresses) {
    return (
      <>
        <Navbar />

        <main className="checkout-page">
          <div className="checkout-loading">
            <Loader2
              size={28}
              className="spin"
            />

            <p>
              Loading your saved addresses...
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="checkout-page">
        <div className="checkout-container">

          {/* HEADER */}

          <div className="checkout-header">
            <button
              type="button"
              className="checkout-back"
              onClick={() => navigate("/cart")}
            >
              <ArrowLeft size={17} />
              Back to Bag
            </button>

            <div>
              <span className="checkout-label">
                SADDLE & CREST
              </span>

              <h1>Checkout</h1>
            </div>
          </div>

          <form
            className="checkout-layout"
            onSubmit={continueToReview}
          >

            {/* =========================
                LEFT
            ========================= */}

            <div className="checkout-main">

              {/* SAVED ADDRESSES */}

              <section className="checkout-card">

                <div className="checkout-card-header">
                  <div>
                    <span className="checkout-label">
                      DELIVERY
                    </span>

                    <h2>Saved Addresses</h2>
                  </div>

                  <MapPin size={20} />
                </div>

                {addresses.length > 0 ? (
                  <div className="saved-addresses">

                    {addresses.map(
                      (address, index) => {
                        const addressId =
                          address._id ||
                          address.id ||
                          `address-${index}`;

                        const isSelected =
                          selectedAddressId ===
                          addressId;

                        const isDefault =
                          address.isDefault === true ||
                          address.default === true;

                        const displayAddress =
                          address.address ||
                          address.addressLine1 ||
                          "";

                        return (
                          <button
                            type="button"
                            key={addressId}
                            className={`saved-address ${
                              isSelected
                                ? "selected"
                                : ""
                            }`}
                            onClick={() =>
                              selectSavedAddress(
                                address
                              )
                            }
                          >

                            <div className="saved-address-top">

                              <div className="saved-address-name">

                                <span className="saved-address-icon">
                                  <MapPin size={16} />
                                </span>

                                <strong>
                                  {address.fullName ||
                                    "Delivery Address"}
                                </strong>

                                {isDefault && (
                                  <span className="default-address-badge">
                                    Default
                                  </span>
                                )}
                              </div>

                              <span
                                className={`address-radio ${
                                  isSelected
                                    ? "active"
                                    : ""
                                }`}
                              >
                                {isSelected && (
                                  <Check size={13} />
                                )}
                              </span>

                            </div>

                            <div className="saved-address-details">

                              <p>
                                {displayAddress}
                              </p>

                              {address.addressLine2 && (
                                <p>
                                  {address.addressLine2}
                                </p>
                              )}

                              <p>
                                {address.city},{" "}
                                {address.state} -{" "}
                                {address.pincode}
                              </p>

                              <span>
                                {address.phone}
                              </span>

                            </div>

                          </button>
                        );
                      }
                    )}

                  </div>
                ) : (
                  <div className="no-saved-address">

                    <MapPin size={26} />

                    <p>
                      You don't have any saved
                      addresses yet.
                    </p>

                  </div>
                )}

                <button
                  type="button"
                  className="new-address-btn"
                  onClick={handleNewAddress}
                >
                  <Plus size={16} />
                  Use a New Address
                </button>

              </section>

              {/* NEW ADDRESS */}

              {showNewAddress && (
                <section className="checkout-card">

                  <div className="checkout-card-header">

                    <div>
                      <span className="checkout-label">
                        NEW ADDRESS
                      </span>

                      <h2>Delivery Details</h2>
                    </div>

                    <MapPin size={20} />

                  </div>

                  <div className="checkout-form">

                    <div className="checkout-field">
                      <label>
                        Full Name
                      </label>

                      <input
                        type="text"
                        name="fullName"
                        value={
                          checkoutData.fullName
                        }
                        onChange={handleChange}
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="checkout-field">
                      <label>
                        Phone Number
                      </label>

                      <input
                        type="tel"
                        name="phone"
                        value={
                          checkoutData.phone
                        }
                        onChange={handleChange}
                        placeholder="10-digit phone number"
                        maxLength={10}
                      />
                    </div>

                    <div className="checkout-field checkout-field-full">
                      <label>
                        Address
                      </label>

                      <textarea
                        name="address"
                        value={
                          checkoutData.address
                        }
                        onChange={handleChange}
                        placeholder="House no., street, area..."
                        rows="3"
                      />
                    </div>

                    <div className="checkout-field checkout-field-full">
                      <label>
                        Address Line 2
                        <span>Optional</span>
                      </label>

                      <input
                        type="text"
                        name="addressLine2"
                        value={
                          checkoutData.addressLine2
                        }
                        onChange={handleChange}
                        placeholder="Apartment, landmark..."
                      />
                    </div>

                    <div className="checkout-field">
                      <label>City</label>

                      <input
                        type="text"
                        name="city"
                        value={
                          checkoutData.city
                        }
                        onChange={handleChange}
                        placeholder="City"
                      />
                    </div>

                    <div className="checkout-field">
                      <label>State</label>

                      <input
                        type="text"
                        name="state"
                        value={
                          checkoutData.state
                        }
                        onChange={handleChange}
                        placeholder="State"
                      />
                    </div>

                    <div className="checkout-field">
                      <label>Pincode</label>

                      <input
                        type="text"
                        name="pincode"
                        value={
                          checkoutData.pincode
                        }
                        onChange={handleChange}
                        placeholder="6-digit pincode"
                        maxLength={6}
                      />
                    </div>

                  </div>

                </section>
              )}

              {/* PAYMENT */}

              <section className="checkout-card">

                <div className="checkout-card-header">

                  <div>
                    <span className="checkout-label">
                      PAYMENT
                    </span>

                    <h2>Payment Method</h2>
                  </div>

                  <CreditCard size={20} />

                </div>

                <div className="payment-options">

                  <button
                    type="button"
                    className={`payment-option ${
                      paymentMethod === "COD"
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      setPaymentMethod("COD")
                    }
                  >
                    <Banknote size={20} />

                    <div>
                      <strong>
                        Cash on Delivery
                      </strong>

                      <span>
                        Pay when your order arrives
                      </span>
                    </div>

                    <span className="payment-radio">
                      {paymentMethod === "COD" && (
                        <Check size={13} />
                      )}
                    </span>
                  </button>

                  <button
                    type="button"
                    className={`payment-option ${
                      paymentMethod === "ONLINE"
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      setPaymentMethod("ONLINE")
                    }
                  >
                    <CreditCard size={20} />

                    <div>
                      <strong>
                        Online Payment
                      </strong>

                      <span>
                        Secure online payment
                      </span>
                    </div>

                    <span className="payment-radio">
                      {paymentMethod === "ONLINE" && (
                        <Check size={13} />
                      )}
                    </span>
                  </button>

                </div>

              </section>

            </div>

            {/* =========================
                RIGHT SUMMARY
            ========================= */}

            <aside className="checkout-summary">

              <div className="checkout-summary-card">

                <span className="checkout-label">
                  YOUR ORDER
                </span>

                <h2>Order Summary</h2>

                <div className="checkout-items">

                  {cart.map((item, index) => {

                    const price = Number(
                      item.salePrice ??
                        item.product?.salePrice ??
                        item.price ??
                        item.product?.price ??
                        0
                    );

                    return (
                      <div
                        className="checkout-item"
                        key={
                          item._id ||
                          item.product?._id ||
                          index
                        }
                      >

                        <div className="checkout-item-image">

                          {(
                            item.image ||
                            item.product?.image
                          ) ? (
                            <img
                              src={
                                item.image ||
                                item.product?.image
                              }
                              alt={
                                item.name ||
                                item.product?.name ||
                                "Product"
                              }
                            />
                          ) : (
                            <Package size={20} />
                          )}

                        </div>

                        <div>
                          <strong>
                            {item.name ||
                              item.product?.name}
                          </strong>

                          <span>
                            Qty:{" "}
                            {item.quantity || 1}
                          </span>
                        </div>

                        <strong>
                          ₹
                          {(
                            price *
                            Number(
                              item.quantity || 1
                            )
                          ).toLocaleString("en-IN")}
                        </strong>

                      </div>
                    );
                  })}

                </div>

                <div className="checkout-total-lines">

                  <div>
                    <span>Subtotal</span>

                    <strong>
                      ₹
                      {subtotal.toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Shipping</span>

                    <strong>
                      {shipping === 0
                        ? "FREE"
                        : `₹${shipping}`}
                    </strong>
                  </div>

                </div>

                <div className="checkout-grand-total">

                  <span>Total</span>

                  <strong>
                    ₹
                    {total.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

                {error && (
                  <div className="checkout-error">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="place-review-btn"
                >
                  Continue to Review
                </button>

                <p className="checkout-secure">
                  Your order details are securely
                  processed.
                </p>

              </div>

            </aside>

          </form>

        </div>
      </main>
    </>
  );
};

export default Checkout;

