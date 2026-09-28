import React, { useEffect, useState } from "react";
import {
  MapPin,
  User,
  Phone,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Loader2,
  LogOut,
  ShoppingBag,
  Info,
  Package,
  Truck,
  CreditCard,
  FileText,
  Printer,
  ChevronRight,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { apiRequest } from "../services/api";
import "./Profile.css";

const emptyAddress = {
  fullName: "",
  phone: "",
  address: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

const Profile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [addresses, setAddresses] = useState([]);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderModalLoading, setOrderModalLoading] = useState(false);

  const [showOrders, setShowOrders] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  const [loading, setLoading] = useState(true);
  const [addressLoading, setAddressLoading] = useState(false);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const [addressForm, setAddressForm] = useState({
    ...emptyAddress,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* =========================================================
     LOAD PROFILE
  ========================================================= */

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest("/auth/me");

      const user =
        response?.user ||
        response?.data?.user ||
        response?.data ||
        response;

      setCurrentUser(user);
      setAddresses(user?.addresses || []);

      console.log("PROFILE USER:", user);
      console.log("SAVED ADDRESSES:", user?.addresses || []);
    } catch (err) {
      console.error("Profile load error:", err);

      setError(
        err?.message ||
          "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  /* =========================================================
     LOAD ORDERS
  ========================================================= */

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);

      const response = await apiRequest(
        "/orders/my-orders"
      );

      const userOrders =
        response?.orders ||
        response?.data?.orders ||
        response?.data ||
        [];

      setOrders(
        Array.isArray(userOrders)
          ? userOrders
          : []
      );
    } catch (err) {
      console.error(
        "Orders load error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load your orders."
      );
    } finally {
      setOrdersLoading(false);
    }
  };

  /* =========================================================
     OPEN MY ORDERS
  ========================================================= */

  const handleOpenOrders = async () => {
    setMessage("");
    setError("");

    setShowOrders(true);

    await loadOrders();
  };

  /* =========================================================
     GET SINGLE ORDER
  ========================================================= */

  const handleOpenOrderDetails = async (
    orderId
  ) => {
    try {
      setOrderModalLoading(true);
      setError("");

      const response = await apiRequest(
        `/orders/${orderId}`
      );

      const order =
        response?.order ||
        response?.data?.order ||
        response?.data ||
        response;

      setSelectedOrder(order);
    } catch (err) {
      console.error(
        "Order details error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load order details."
      );
    } finally {
      setOrderModalLoading(false);
    }
  };

  /* =========================================================
     CLOSE ORDER MODAL
  ========================================================= */

  const closeOrderModal = () => {
    setSelectedOrder(null);
    setShowInvoice(false);
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    window.location.href = "/login";
  };

  /* =========================================================
     ADDRESS INPUT
  ========================================================= */

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     OPEN ADD ADDRESS
  ========================================================= */

  const openAddAddress = () => {
    setEditingAddressId(null);

    setAddressForm({
      ...emptyAddress,
    });

    setMessage("");
    setError("");

    setShowAddressForm(true);
  };

  /* =========================================================
     OPEN EDIT ADDRESS
  ========================================================= */

  const openEditAddress = (address) => {
    setEditingAddressId(
      address._id || address.id
    );

    setAddressForm({
      fullName: address.fullName || "",

      phone: address.phone || "",

      address:
        address.addressLine1 ||
        address.address ||
        "",

      addressLine2:
        address.addressLine2 || "",

      city:
        address.city || "",

      state:
        address.state || "",

      pincode:
        address.pincode || "",

      country:
        address.country || "India",
    });

    setMessage("");
    setError("");

    setShowAddressForm(true);
  };

  /* =========================================================
     CLOSE ADDRESS FORM
  ========================================================= */

  const closeAddressForm = () => {
    setShowAddressForm(false);

    setEditingAddressId(null);

    setAddressForm({
      ...emptyAddress,
    });
  };

  /* =========================================================
     VALIDATE ADDRESS
  ========================================================= */

  const validateAddress = () => {
    if (!addressForm.fullName.trim()) {
      return "Please enter full name.";
    }

    if (!addressForm.phone.trim()) {
      return "Please enter phone number.";
    }

    if (
      !/^[6-9]\d{9}$/.test(
        addressForm.phone.trim()
      )
    ) {
      return "Please enter a valid 10-digit phone number.";
    }

    if (!addressForm.address.trim()) {
      return "Please enter your address.";
    }

    if (!addressForm.city.trim()) {
      return "Please enter city.";
    }

    if (!addressForm.state.trim()) {
      return "Please enter state.";
    }

    if (
      !/^\d{6}$/.test(
        addressForm.pincode.trim()
      )
    ) {
      return "Please enter a valid 6-digit pincode.";
    }

    return "";
  };

  /* =========================================================
     SAVE ADDRESS
  ========================================================= */

  const handleSaveAddress = async (e) => {
    e.preventDefault();

    const validationError =
      validateAddress();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setAddressLoading(true);

      setError("");
      setMessage("");

      const payload = {
        fullName:
          addressForm.fullName.trim(),

        phone:
          addressForm.phone.trim(),

        addressLine1:
          addressForm.address.trim(),

        addressLine2:
          addressForm.addressLine2?.trim() ||
          "",

        city:
          addressForm.city.trim(),

        state:
          addressForm.state.trim(),

        pincode:
          addressForm.pincode.trim(),

        country:
          addressForm.country?.trim() ||
          "India",
      };

      let response;

      if (editingAddressId) {
        response = await apiRequest(
          `/auth/addresses/${editingAddressId}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );
      } else {
        response = await apiRequest(
          "/auth/addresses",
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );
      }

      if (response?.addresses) {
        setAddresses(
          response.addresses
        );

        setCurrentUser((prev) => ({
          ...prev,
          addresses:
            response.addresses,
        }));
      } else {
        await loadProfile();
      }

      setMessage(
        editingAddressId
          ? "Address updated successfully."
          : "Address added successfully."
      );

      closeAddressForm();
    } catch (err) {
      console.error(
        "Save address error:",
        err
      );

      setError(
        err?.message ||
          "Unable to save address."
      );
    } finally {
      setAddressLoading(false);
    }
  };

  /* =========================================================
     DELETE ADDRESS
  ========================================================= */

  const handleDeleteAddress = async (
    addressId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this address?"
      );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const response =
        await apiRequest(
          `/auth/addresses/${addressId}`,
          {
            method: "DELETE",
          }
        );

      if (response?.addresses) {
        setAddresses(
          response.addresses
        );

        setCurrentUser((prev) => ({
          ...prev,
          addresses:
            response.addresses,
        }));
      } else {
        await loadProfile();
      }

      setMessage(
        "Address deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete address error:",
        err
      );

      setError(
        err?.message ||
          "Unable to delete address."
      );
    }
  };

  /* =========================================================
     SET DEFAULT ADDRESS
  ========================================================= */

  const handleSetDefault = async (
    addressId
  ) => {
    try {
      setError("");
      setMessage("");

      const response =
        await apiRequest(
          `/auth/addresses/${addressId}/default`,
          {
            method: "PUT",
          }
        );

      if (response?.addresses) {
        setAddresses(
          response.addresses
        );

        setCurrentUser((prev) => ({
          ...prev,
          addresses:
            response.addresses,
        }));
      } else {
        await loadProfile();
      }

      setMessage(
        "Default address updated."
      );
    } catch (err) {
      console.error(
        "Default address error:",
        err
      );

      setError(
        err?.message ||
          "Unable to update default address."
      );
    }
  };

  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =========================================================
     FORMAT CURRENCY
  ========================================================= */

  const formatCurrency = (amount) => {
    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;
  };

  /* =========================================================
     STATUS CLASS
  ========================================================= */

  const getStatusClass = (status) => {
    return String(status || "")
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  /* =========================================================
     ORDER ITEM COUNT
  ========================================================= */

  const getItemCount = (order) => {
    return (
      order?.items?.reduce(
        (total, item) =>
          total + Number(item.quantity || 0),
        0
      ) || 0
    );
  };

  /* =========================================================
     PRINT INVOICE
  ========================================================= */

  const handlePrintInvoice = () => {
    window.print();
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <>
        <Navbar
          navbarBackground="#000"
          top="0"
        />

        <main className="profile-page">
          <div className="profile-loading">
            <Loader2
              className="spin"
              size={30}
            />

            <p>
              Loading profile...
            </p>
          </div>
        </main>
      </>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <>
      <Navbar
        navbarBackground="#000"
        top="0"
      />

      <main className="profile-page">
        <div className="profile-container">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="profile-header">
            <span className="profile-eyebrow">
              MY ACCOUNT
            </span>

            <h1>
              My Profile
            </h1>

            <p>
              Manage your personal information
              and saved delivery addresses.
            </p>
          </div>

          {/* =================================================
              MESSAGES
          ================================================= */}

          {message && (
            <div className="profile-message">
              <Check size={17} />

              {message}
            </div>
          )}

          {error && (
            <div className="profile-error">
              {error}
            </div>
          )}

          {/* =================================================
              PROFILE INFORMATION
          ================================================= */}

          <section className="profile-card">

            <div className="profile-card-heading">

              <div className="profile-heading-icon">
                <User size={20} />
              </div>

              <div>
                <span>
                  ACCOUNT
                </span>

                <h2>
                  Personal Information
                </h2>
              </div>

            </div>

            <div className="profile-info-grid">

              <div className="profile-info-item">
                <small>
                  FULL NAME
                </small>

                <strong>
                  {currentUser?.name ||
                    currentUser?.fullName ||
                    "Not available"}
                </strong>
              </div>

              <div className="profile-info-item">
                <small>
                  EMAIL
                </small>

                <strong>
                  {currentUser?.email ||
                    "Not available"}
                </strong>
              </div>

              {currentUser?.phone && (
                <div className="profile-info-item">
                  <small>
                    PHONE
                  </small>

                  <strong>
                    {currentUser.phone}
                  </strong>
                </div>
              )}

            </div>

            {/* =================================================
                MY ORDERS BUTTON
            ================================================= */}

            <div className="my-orders-button-wrapper">

              <button
                type="button"
                className="my-orders-button"
                onClick={
                  handleOpenOrders
                }
              >
                <div className="my-orders-button-left">

                  <div className="my-orders-icon">
                    <ShoppingBag size={19} />
                  </div>

                  <div>
                    <span>
                      PURCHASE HISTORY
                    </span>

                    <strong>
                      My Orders
                    </strong>
                  </div>

                </div>

                <ChevronRight size={19} />

              </button>

            </div>

            {/* =================================================
                LOGOUT
            ================================================= */}

            <div className="profile-logout-wrapper">

              <button
                type="button"
                className="profile-logout-btn"
                onClick={handleLogout}
              >
                <LogOut size={17} />

                <span>
                  LOGOUT
                </span>
              </button>

            </div>

          </section>

          {/* =================================================
              SAVED ADDRESSES
          ================================================= */}

          <section className="profile-card addresses-card">

            <div className="addresses-header">

              <div className="profile-card-heading">

                <div className="profile-heading-icon">
                  <MapPin size={20} />
                </div>

                <div>
                  <span>
                    DELIVERY
                  </span>

                  <h2>
                    Saved Addresses
                  </h2>
                </div>

              </div>

              <button
                type="button"
                className="add-address-btn"
                onClick={openAddAddress}
              >
                <Plus size={17} />

                ADD ADDRESS
              </button>

            </div>

            {addresses.length === 0 ? (

              <div className="empty-addresses">

                <MapPin size={35} />

                <h3>
                  No Saved Addresses
                </h3>

                <p>
                  Add a delivery address
                  to make checkout faster.
                </p>

                <button
                  type="button"
                  onClick={
                    openAddAddress
                  }
                >
                  <Plus size={17} />

                  ADD YOUR FIRST ADDRESS
                </button>

              </div>

            ) : (

              <div className="address-list">

                {addresses.map(
                  (address) => {

                    const addressId =
                      address._id ||
                      address.id;

                    const isDefault =
                      address.isDefault ===
                      true;

                    return (
                      <div
                        className={`saved-address ${
                          isDefault
                            ? "default-address"
                            : ""
                        }`}
                        key={addressId}
                      >

                        <div className="saved-address-top">

                          <div className="saved-address-title">

                            <div className="address-icon">
                              <MapPin
                                size={18}
                              />
                            </div>

                            <div>

                              <h3>
                                {address.fullName}
                              </h3>

                              {isDefault && (
                                <span className="default-badge">
                                  DEFAULT
                                </span>
                              )}

                            </div>

                          </div>

                          <div className="address-actions">

                            <button
                              type="button"
                              title="Edit address"
                              onClick={() =>
                                openEditAddress(
                                  address
                                )
                              }
                            >
                              <Pencil
                                size={16}
                              />
                            </button>

                            <button
                              type="button"
                              title="Delete address"
                              onClick={() =>
                                handleDeleteAddress(
                                  addressId
                                )
                              }
                            >
                              <Trash2
                                size={16}
                              />
                            </button>

                          </div>

                        </div>

                        <div className="saved-address-content">

                          <p>
                            {address.addressLine1 ||
                              address.address ||
                              "Address not available"}
                          </p>

                          {address.addressLine2 && (
                            <p>
                              {
                                address.addressLine2
                              }
                            </p>
                          )}

                          <p>
                            {address.city},{" "}
                            {address.state}{" "}
                            -{" "}
                            {address.pincode}
                          </p>

                          <p className="saved-phone">

                            <Phone
                              size={14}
                            />

                            {address.phone}

                          </p>

                        </div>

                        {!isDefault && (
                          <button
                            type="button"
                            className="make-default-btn"
                            onClick={() =>
                              handleSetDefault(
                                addressId
                              )
                            }
                          >
                            MAKE DEFAULT
                          </button>
                        )}

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </section>

          {/* =================================================
              ADDRESS MODAL
          ================================================= */}

          {showAddressForm && (
            <div className="address-modal-overlay">

              <div className="address-modal">

                <div className="address-modal-header">

                  <div>

                    <span>
                      {editingAddressId
                        ? "UPDATE ADDRESS"
                        : "NEW ADDRESS"}
                    </span>

                    <h2>
                      {editingAddressId
                        ? "Edit Address"
                        : "Add New Address"}
                    </h2>

                  </div>

                  <button
                    type="button"
                    onClick={
                      closeAddressForm
                    }
                  >
                    <X size={20} />
                  </button>

                </div>

                <form
                  onSubmit={
                    handleSaveAddress
                  }
                >

                  <div className="address-form-grid">

                    <div className="form-field">

                      <label>
                        FULL NAME
                      </label>

                      <input
                        type="text"
                        name="fullName"
                        value={
                          addressForm.fullName
                        }
                        onChange={
                          handleAddressChange
                        }
                        placeholder="Enter full name"
                      />

                    </div>

                    <div className="form-field">

                      <label>
                        PHONE NUMBER
                      </label>

                      <input
                        type="tel"
                        name="phone"
                        value={
                          addressForm.phone
                        }
                        onChange={
                          handleAddressChange
                        }
                        placeholder="10-digit mobile number"
                        maxLength={10}
                      />

                    </div>

                    <div className="form-field full-width">

                      <label>
                        ADDRESS
                      </label>

                      <textarea
                        name="address"
                        value={
                          addressForm.address
                        }
                        onChange={
                          handleAddressChange
                        }
                        placeholder="House no., street, area"
                        rows={3}
                      />

                    </div>

                    <div className="form-field full-width">

                      <label>
                        ADDRESS LINE 2
                        <span>
                          {" "}
                          (OPTIONAL)
                        </span>
                      </label>

                      <input
                        type="text"
                        name="addressLine2"
                        value={
                          addressForm.addressLine2
                        }
                        onChange={
                          handleAddressChange
                        }
                        placeholder="Apartment, landmark, etc."
                      />

                    </div>

                    <div className="form-field">

                      <label>
                        CITY
                      </label>

                      <input
                        type="text"
                        name="city"
                        value={
                          addressForm.city
                        }
                        onChange={
                          handleAddressChange
                        }
                        placeholder="City"
                      />

                    </div>

                    <div className="form-field">

                      <label>
                        STATE
                      </label>

                      <input
                        type="text"
                        name="state"
                        value={
                          addressForm.state
                        }
                        onChange={
                          handleAddressChange
                        }
                        placeholder="State"
                      />

                    </div>

                    <div className="form-field">

                      <label>
                        PINCODE
                      </label>

                      <input
                        type="text"
                        name="pincode"
                        value={
                          addressForm.pincode
                        }
                        onChange={
                          handleAddressChange
                        }
                        placeholder="6-digit pincode"
                        maxLength={6}
                      />

                    </div>

                  </div>

                  <div className="address-form-actions">

                    <button
                      type="button"
                      className="cancel-address-btn"
                      onClick={
                        closeAddressForm
                      }
                    >
                      CANCEL
                    </button>

                    <button
                      type="submit"
                      className="save-address-btn"
                      disabled={
                        addressLoading
                      }
                    >

                      {addressLoading ? (
                        <>
                          <Loader2
                            size={17}
                            className="spin"
                          />

                          SAVING...
                        </>
                      ) : (
                        <>
                          <Check
                            size={17}
                          />

                          {editingAddressId
                            ? "UPDATE ADDRESS"
                            : "SAVE ADDRESS"}
                        </>
                      )}

                    </button>

                  </div>

                </form>

              </div>

            </div>
          )}

          {/* =================================================
              MY ORDERS MODAL
          ================================================= */}

          {showOrders && (
            <div className="orders-modal-overlay">

              <div className="orders-modal">

                <div className="orders-modal-header">

                  <div>

                    <span>
                      PURCHASE HISTORY
                    </span>

                    <h2>
                      My Orders
                    </h2>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowOrders(false)
                    }
                  >
                    <X size={21} />
                  </button>

                </div>

                <div className="orders-modal-body">

                  {ordersLoading ? (

                    <div className="orders-loading">

                      <Loader2
                        size={28}
                        className="spin"
                      />

                      <p>
                        Loading your orders...
                      </p>

                    </div>

                  ) : orders.length === 0 ? (

                    <div className="orders-empty">

                      <ShoppingBag
                        size={42}
                      />

                      <h3>
                        No Orders Yet
                      </h3>

                      <p>
                        Your completed purchases
                        will appear here.
                      </p>

                    </div>

                  ) : (

                    <div className="orders-list">

                      {orders.map(
                        (order) => {

                          const orderId =
                            order._id ||
                            order.id;

                          const itemCount =
                            getItemCount(
                              order
                            );

                          return (
                            <div
                              className="order-overview-card"
                              key={orderId}
                            >

                              <div className="order-overview-top">

                                <div>

                                  <span className="order-overview-label">
                                    ORDER
                                  </span>

                                  <strong>
                                    #
                                    {String(
                                      orderId
                                    ).slice(-8).toUpperCase()}
                                  </strong>

                                </div>

                                <span className="order-date">
                                  {formatDate(
                                    order.createdAt
                                  )}
                                </span>

                              </div>

                              <div className="order-overview-middle">

                                <div className="order-products-preview">

                                  {order.items
                                    ?.slice(0, 3)
                                    .map(
                                      (
                                        item,
                                        index
                                      ) => (
                                        <div
                                          className="order-product-mini"
                                          key={`${orderId}-${index}`}
                                        >

                                          <div className="order-product-image">

                                            {item.image ? (
                                              <img
                                                src={
                                                  item.image
                                                }
                                                alt={
                                                  item.name
                                                }
                                              />
                                            ) : (
                                              <Package
                                                size={18}
                                              />
                                            )}

                                          </div>

                                          <div>

                                            <strong>
                                              {
                                                item.name
                                              }
                                            </strong>

                                            <span>
                                              Qty:{" "}
                                              {
                                                item.quantity
                                              }
                                            </span>

                                          </div>

                                        </div>
                                      )
                                    )}

                                </div>

                                {order.items?.length >
                                  3 && (
                                  <span className="more-items">
                                    +
                                    {order.items.length -
                                      3}{" "}
                                    more
                                  </span>
                                )}

                              </div>

                              <div className="order-overview-bottom">

                                <div className="order-total-box">

                                  <small>
                                    TOTAL
                                  </small>

                                  <strong>
                                    {formatCurrency(
                                      order.totalAmount
                                    )}
                                  </strong>

                                  <span>
                                    {itemCount}{" "}
                                    {itemCount === 1
                                      ? "item"
                                      : "items"}
                                  </span>

                                </div>

                                <div className="order-status-box">

                                  <span
                                    className={`order-status ${getStatusClass(
                                      order.status
                                    )}`}
                                  >
                                    {order.status ||
                                      "Pending"}
                                  </span>

                                  <span className="payment-status">
                                    {order.paymentStatus ||
                                      "Pending"}
                                  </span>

                                </div>

                                <button
                                  type="button"
                                  className="order-info-btn"
                                  title="View order details"
                                  onClick={() =>
                                    handleOpenOrderDetails(
                                      orderId
                                    )
                                  }
                                >
                                  <Info
                                    size={18}
                                  />
                                </button>

                              </div>

                            </div>
                          );
                        }
                      )}

                    </div>

                  )}

                </div>

              </div>

            </div>
          )}

          {/* =================================================
              ORDER DETAILS MODAL
          ================================================= */}

          {(selectedOrder ||
            orderModalLoading) && (
            <div className="order-details-overlay">

              <div className="order-details-modal">

                {orderModalLoading ? (

                  <div className="order-details-loading">

                    <Loader2
                      size={30}
                      className="spin"
                    />

                    <p>
                      Loading order details...
                    </p>

                  </div>

                ) : (

                  <>
                    <div className="order-details-header">

                      <div>

                        <span>
                          ORDER DETAILS
                        </span>

                        <h2>
                          #
                          {String(
                            selectedOrder?._id ||
                              selectedOrder?.id ||
                              ""
                          )
                            .slice(-8)
                            .toUpperCase()}
                        </h2>

                        <small>
                          Placed on{" "}
                          {formatDate(
                            selectedOrder?.createdAt
                          )}
                        </small>

                      </div>

                      <button
                        type="button"
                        onClick={
                          closeOrderModal
                        }
                      >
                        <X size={21} />
                      </button>

                    </div>

                    <div className="order-details-body">

                      {/* STATUS */}

                      <div className="order-detail-status-row">

                        <div>
                          <small>
                            ORDER STATUS
                          </small>

                          <strong
                            className={`order-status-large ${getStatusClass(
                              selectedOrder?.status
                            )}`}
                          >
                            {selectedOrder?.status ||
                              "Pending"}
                          </strong>
                        </div>

                        <div>
                          <small>
                            PAYMENT
                          </small>

                          <strong>
                            {selectedOrder?.paymentStatus ||
                              "Pending"}
                          </strong>
                        </div>

                        <div>
                          <small>
                            METHOD
                          </small>

                          <strong>
                            {selectedOrder?.paymentMethod ||
                              "COD"}
                          </strong>
                        </div>

                      </div>

                      {/* ITEMS */}

                      <div className="order-detail-section">

                        <div className="order-detail-section-title">
                          <Package
                            size={17}
                          />

                          <h3>
                            Order Items
                          </h3>
                        </div>

                        <div className="order-detail-items">

                          {selectedOrder?.items?.map(
                            (
                              item,
                              index
                            ) => (

                              <div
                                className="order-detail-item"
                                key={`${item.product || index}-${index}`}
                              >

                                <div className="order-detail-product-image">

                                  {item.image ? (
                                    <img
                                      src={
                                        item.image
                                      }
                                      alt={
                                        item.name
                                      }
                                    />
                                  ) : (
                                    <Package
                                      size={20}
                                    />
                                  )}

                                </div>

                                <div className="order-detail-product-info">

                                  <strong>
                                    {
                                      item.name
                                    }
                                  </strong>

                                  <span>
                                    Qty:{" "}
                                    {
                                      item.quantity
                                    }
                                  </span>

                                </div>

                                <strong>
                                  {formatCurrency(
                                    Number(
                                      item.price
                                    ) *
                                      Number(
                                        item.quantity
                                      )
                                  )}
                                </strong>

                              </div>

                            )
                          )}

                        </div>

                      </div>

                      {/* DELIVERY */}

                      <div className="order-detail-section">

                        <div className="order-detail-section-title">

                          <Truck
                            size={17}
                          />

                          <h3>
                            Delivery Address
                          </h3>

                        </div>

                        <div className="order-detail-address">

                          <strong>
                            {
                              selectedOrder
                                ?.shippingAddress
                                ?.fullName
                            }
                          </strong>

                          <p>
                            {
                              selectedOrder
                                ?.shippingAddress
                                ?.addressLine1
                            }
                          </p>

                          {selectedOrder
                            ?.shippingAddress
                            ?.addressLine2 && (
                            <p>
                              {
                                selectedOrder
                                  ?.shippingAddress
                                  ?.addressLine2
                              }
                            </p>
                          )}

                          <p>
                            {
                              selectedOrder
                                ?.shippingAddress
                                ?.city
                            }
                            ,{" "}
                            {
                              selectedOrder
                                ?.shippingAddress
                                ?.state
                            }{" "}
                            -{" "}
                            {
                              selectedOrder
                                ?.shippingAddress
                                ?.pincode
                            }
                          </p>

                          <p>
                            {
                              selectedOrder
                                ?.shippingAddress
                                ?.country
                            }
                          </p>

                          <p className="order-phone">
                            <Phone
                              size={13}
                            />

                            {
                              selectedOrder
                                ?.shippingAddress
                                ?.phone
                            }
                          </p>

                        </div>

                      </div>

                      {/* SUMMARY */}

                      <div className="order-detail-summary">

                        <div>
                          <span>
                            Subtotal
                          </span>

                          <strong>
                            {formatCurrency(
                              selectedOrder?.subtotal
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Shipping
                          </span>

                          <strong>
                            {selectedOrder?.shipping ===
                            0
                              ? "FREE"
                              : formatCurrency(
                                  selectedOrder?.shipping
                                )}
                          </strong>
                        </div>

                        {Number(
                          selectedOrder?.discount
                        ) > 0 && (
                          <div className="discount-row">
                            <span>
                              Discount
                              {selectedOrder?.couponCode
                                ? ` (${selectedOrder.couponCode})`
                                : ""}
                            </span>

                            <strong>
                              -
                              {formatCurrency(
                                selectedOrder?.discount
                              )}
                            </strong>
                          </div>
                        )}

                        <div className="order-grand-total">

                          <span>
                            TOTAL
                          </span>

                          <strong>
                            {formatCurrency(
                              selectedOrder?.totalAmount
                            )}
                          </strong>

                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div className="order-details-actions">

                        <button
                          type="button"
                          className="invoice-btn"
                          onClick={() =>
                            setShowInvoice(
                              true
                            )
                          }
                        >
                          <FileText
                            size={17}
                          />

                          VIEW INVOICE
                        </button>

                        <button
                          type="button"
                          className="close-order-btn"
                          onClick={
                            closeOrderModal
                          }
                        >
                          CLOSE
                        </button>

                      </div>

                    </div>
                  </>
                )}

              </div>

            </div>
          )}

          {/* =================================================
              INVOICE
          ================================================= */}

          {showInvoice &&
            selectedOrder && (
              <div className="invoice-overlay">

                <div className="invoice-modal">

                  <div className="invoice-toolbar">

                    <button
                      type="button"
                      onClick={() =>
                        setShowInvoice(false)
                      }
                    >
                      <X size={19} />
                      CLOSE
                    </button>

                    <button
                      type="button"
                      onClick={
                        handlePrintInvoice
                      }
                    >
                      <Printer size={17} />
                      PRINT / SAVE PDF
                    </button>

                  </div>

                  <div className="invoice-paper">

                    <div className="invoice-header">

                      <div>

                        <span className="invoice-brand">
                          SADDLE & CREST
                        </span>

                        <p>
                          Jaipur · Rajasthan · India
                        </p>

                        <p>
                          concierge@saddleandcrest.com
                        </p>

                      </div>

                      <div className="invoice-title">

                        <span>
                          INVOICE
                        </span>

                        <strong>
                          #
                          {String(
                            selectedOrder._id
                          )
                            .slice(-8)
                            .toUpperCase()}
                        </strong>

                      </div>

                    </div>

                    <div className="invoice-meta">

                      <div>
                        <small>
                          BILL TO
                        </small>

                        <strong>
                          {
                            selectedOrder
                              ?.shippingAddress
                              ?.fullName
                          }
                        </strong>

                        <p>
                          {
                            selectedOrder
                              ?.shippingAddress
                              ?.addressLine1
                          }
                        </p>

                        {selectedOrder
                          ?.shippingAddress
                          ?.addressLine2 && (
                          <p>
                            {
                              selectedOrder
                                ?.shippingAddress
                                ?.addressLine2
                            }
                          </p>
                        )}

                        <p>
                          {
                            selectedOrder
                              ?.shippingAddress
                              ?.city
                          }
                          ,{" "}
                          {
                            selectedOrder
                              ?.shippingAddress
                              ?.state
                          }{" "}
                          -{" "}
                          {
                            selectedOrder
                              ?.shippingAddress
                              ?.pincode
                          }
                        </p>

                        <p>
                          Phone:{" "}
                          {
                            selectedOrder
                              ?.shippingAddress
                              ?.phone
                          }
                        </p>

                      </div>

                      <div>

                        <small>
                          INVOICE DATE
                        </small>

                        <strong>
                          {formatDate(
                            selectedOrder.createdAt
                          )}
                        </strong>

                        <small>
                          PAYMENT METHOD
                        </small>

                        <strong>
                          {
                            selectedOrder.paymentMethod
                          }
                        </strong>

                        <small>
                          PAYMENT STATUS
                        </small>

                        <strong>
                          {
                            selectedOrder.paymentStatus
                          }
                        </strong>

                      </div>

                    </div>

                    <table className="invoice-table">

                      <thead>
                        <tr>
                          <th>
                            ITEM
                          </th>

                          <th>
                            QTY
                          </th>

                          <th>
                            PRICE
                          </th>

                          <th>
                            TOTAL
                          </th>
                        </tr>
                      </thead>

                      <tbody>

                        {selectedOrder.items?.map(
                          (
                            item,
                            index
                          ) => (

                            <tr
                              key={index}
                            >

                              <td>
                                <strong>
                                  {
                                    item.name
                                  }
                                </strong>
                              </td>

                              <td>
                                {
                                  item.quantity
                                }
                              </td>

                              <td>
                                {formatCurrency(
                                  item.price
                                )}
                              </td>

                              <td>
                                {formatCurrency(
                                  Number(
                                    item.price
                                  ) *
                                    Number(
                                      item.quantity
                                    )
                                )}
                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                    <div className="invoice-summary">

                      <div>
                        <span>
                          Subtotal
                        </span>

                        <strong>
                          {formatCurrency(
                            selectedOrder.subtotal
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Shipping
                        </span>

                        <strong>
                          {selectedOrder.shipping ===
                          0
                            ? "FREE"
                            : formatCurrency(
                                selectedOrder.shipping
                              )}
                        </strong>
                      </div>

                      {Number(
                        selectedOrder.discount
                      ) > 0 && (
                        <div>
                          <span>
                            Discount
                          </span>

                          <strong>
                            -
                            {formatCurrency(
                              selectedOrder.discount
                            )}
                          </strong>
                        </div>
                      )}

                      <div className="invoice-total">
                        <span>
                          GRAND TOTAL
                        </span>

                        <strong>
                          {formatCurrency(
                            selectedOrder.totalAmount
                          )}
                        </strong>
                      </div>

                    </div>

                    <div className="invoice-footer">

                      <strong>
                        Thank you for choosing
                        Saddle & Crest.
                      </strong>

                      <p>
                        This is a computer-generated
                        invoice and does not require
                        a physical signature.
                      </p>

                    </div>

                  </div>

                </div>

              </div>
            )}

        </div>
      </main>
    </>
  );
};

export default Profile;