
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
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) return;

    /*
     * Remove authentication data
     */
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    /*
     * Redirect user to login page
     */
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

      /*
       * IMPORTANT:
       * Database uses addressLine1.
       * UI uses address.
       */
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
     CLOSE FORM
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

      /*
       * IMPORTANT:
       *
       * UI field:
       * address
       *
       * Backend / MongoDB field:
       * addressLine1
       */
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

      console.log(
        "ADDRESS PAYLOAD:",
        payload
      );

      let response;

      /* =========================
         UPDATE
      ========================= */

      if (editingAddressId) {
        response = await apiRequest(
          `/auth/addresses/${editingAddressId}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );
      }

      /* =========================
         ADD
      ========================= */

      else {
        response = await apiRequest(
          "/auth/addresses",
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );
      }

      console.log(
        "ADDRESS RESPONSE:",
        response
      );

      /*
       * Backend returns:
       *
       * {
       *   message,
       *   addresses
       * }
       */

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

            {/* =================================================
                EMPTY
            ================================================= */}

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

              /* =================================================
                 ADDRESS LIST
              ================================================= */

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

                        {/* =========================
                            ADDRESS TOP
                        ========================= */}

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

                        {/* =========================
                            ADDRESS CONTENT
                        ========================= */}

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

                        {/* =========================
                            MAKE DEFAULT
                        ========================= */}

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

                {/* =========================
                    MODAL HEADER
                ========================= */}

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

                {/* =========================
                    FORM
                ========================= */}

                <form
                  onSubmit={
                    handleSaveAddress
                  }
                >

                  <div className="address-form-grid">

                    {/* FULL NAME */}

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

                    {/* PHONE */}

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

                    {/* ADDRESS */}

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

                    {/* ADDRESS LINE 2 */}

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

                    {/* CITY */}

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

                    {/* STATE */}

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

                    {/* PINCODE */}

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

                  {/* =========================
                      FORM ACTIONS
                  ========================= */}

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

        </div>
      </main>
    </>
  );
};

export default Profile;
