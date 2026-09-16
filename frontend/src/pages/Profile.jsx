import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  Package,
  Heart,
  ShoppingBag,
  LogOut,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Home,
  LockKeyhole,
  Check,
  Loader2,
  ChevronRight,
} from "lucide-react";

import Navbar from "../components/Navbar";
import {
  apiRequest,
  clearAuth,
  getUser,
} from "../services/api";

import "./Profile.css";

const emptyAddress = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(getUser());

  const [loading, setLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);

  const [editingProfile, setEditingProfile] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordSaving, setPasswordSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [addresses, setAddresses] = useState([]);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState(emptyAddress);

  const [addressSaving, setAddressSaving] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState(null);
  const [defaultAddressId, setDefaultAddressId] = useState(null);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });

    window.clearTimeout(window.__profileMessageTimer);

    window.__profileMessageTimer = window.setTimeout(() => {
      setMessage({
        type: "",
        text: "",
      });
    }, 3500);
  };

  const loadProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        state: {
          from: "/profile",
        },
      });
      return;
    }

    try {
      setLoading(true);

      const data = await apiRequest("/auth/me");

      const currentUser =
        data?.user ||
        data?.data?.user ||
        data?.data ||
        data;

      if (currentUser) {
        setUser(currentUser);

        localStorage.setItem(
          "user",
          JSON.stringify(currentUser)
        );

        setProfileForm({
          name: currentUser.name || "",
          phone: currentUser.phone || "",
        });

        const userAddresses = currentUser.addresses || [];

        setAddresses(userAddresses);

        const defaultAddress =
          userAddresses.find((item) => item.isDefault) ||
          userAddresses.find((item) => item.default);

        setDefaultAddressId(
          defaultAddress?._id ||
            defaultAddress?.id ||
            null
        );
      }
    } catch (error) {
      showMessage(
        "error",
        error.message || "Unable to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();

    if (!profileForm.name.trim()) {
      showMessage("error", "Please enter your name.");
      return;
    }

    try {
      setProfileSaving(true);

      const data = await apiRequest("/auth/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: profileForm.name.trim(),
          phone: profileForm.phone.trim(),
        }),
      });

      const updatedUser =
        data?.user ||
        data?.data?.user ||
        data?.data ||
        data;

      if (updatedUser) {
        setUser(updatedUser);

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );

        setProfileForm({
          name: updatedUser.name || "",
          phone: updatedUser.phone || "",
        });
      }

      setEditingProfile(false);

      window.dispatchEvent(new Event("auth-change"));

      showMessage(
        "success",
        "Profile updated successfully."
      );
    } catch (error) {
      showMessage(
        "error",
        error.message || "Unable to update profile."
      );
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const changePassword = async (event) => {
    event.preventDefault();

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      showMessage(
        "error",
        "Please fill all password fields."
      );
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showMessage(
        "error",
        "New password must be at least 6 characters."
      );
      return;
    }

    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      showMessage(
        "error",
        "New passwords do not match."
      );
      return;
    }

    try {
      setPasswordSaving(true);

      await apiRequest("/auth/change-password", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword:
            passwordForm.currentPassword,
          newPassword:
            passwordForm.newPassword,
        }),
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowPasswordForm(false);

      showMessage(
        "success",
        "Password changed successfully."
      );
    } catch (error) {
      showMessage(
        "error",
        error.message || "Unable to change password."
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;

    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm(emptyAddress);
    setShowAddressForm(true);
  };

  const openEditAddress = (address) => {
    setEditingAddressId(
      address._id || address.id
    );

    setAddressForm({
      fullName: address.fullName || "",
      phone: address.phone || "",
      address: address.address || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
    });

    setShowAddressForm(true);
  };

  const closeAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddressId(null);
    setAddressForm(emptyAddress);
  };

  const validateAddress = () => {
    if (
      !addressForm.fullName.trim() ||
      !addressForm.phone.trim() ||
      !addressForm.address.trim() ||
      !addressForm.city.trim() ||
      !addressForm.state.trim() ||
      !addressForm.pincode.trim()
    ) {
      showMessage(
        "error",
        "Please fill all address fields."
      );
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(addressForm.phone)) {
      showMessage(
        "error",
        "Please enter a valid 10-digit phone number."
      );
      return false;
    }

    if (!/^\d{6}$/.test(addressForm.pincode)) {
      showMessage(
        "error",
        "Please enter a valid 6-digit pincode."
      );
      return false;
    }

    return true;
  };

  const saveAddress = async (event) => {
    event.preventDefault();

    if (!validateAddress()) return;

    try {
      setAddressSaving(true);

      let data;

      if (editingAddressId) {
        data = await apiRequest(
          `/auth/addresses/${editingAddressId}`,
          {
            method: "PUT",
            body: JSON.stringify(addressForm),
          }
        );
      } else {
        data = await apiRequest("/auth/addresses", {
          method: "POST",
          body: JSON.stringify(addressForm),
        });
      }

      const updatedAddresses =
        data?.addresses ||
        data?.user?.addresses ||
        data?.data?.addresses ||
        data?.data?.user?.addresses;

      if (Array.isArray(updatedAddresses)) {
        setAddresses(updatedAddresses);
      } else {
        await loadProfile();
      }

      closeAddressForm();

      showMessage(
        "success",
        editingAddressId
          ? "Address updated successfully."
          : "Address added successfully."
      );
    } catch (error) {
      showMessage(
        "error",
        error.message || "Unable to save address."
      );
    } finally {
      setAddressSaving(false);
    }
  };

  const deleteAddress = async (addressId) => {
    if (!addressId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) return;

    try {
      setDeletingAddressId(addressId);

      const data = await apiRequest(
        `/auth/addresses/${addressId}`,
        {
          method: "DELETE",
        }
      );

      const updatedAddresses =
        data?.addresses ||
        data?.user?.addresses ||
        data?.data?.addresses ||
        data?.data?.user?.addresses;

      if (Array.isArray(updatedAddresses)) {
        setAddresses(updatedAddresses);
      } else {
        await loadProfile();
      }

      if (defaultAddressId === addressId) {
        setDefaultAddressId(null);
      }

      showMessage(
        "success",
        "Address deleted successfully."
      );
    } catch (error) {
      showMessage(
        "error",
        error.message || "Unable to delete address."
      );
    } finally {
      setDeletingAddressId(null);
    }
  };

  const makeDefaultAddress = async (addressId) => {
    if (!addressId) return;

    try {
      const data = await apiRequest(
        `/auth/addresses/${addressId}/default`,
        {
          method: "PUT",
        }
      );

      const updatedAddresses =
        data?.addresses ||
        data?.user?.addresses ||
        data?.data?.addresses ||
        data?.data?.user?.addresses;

      if (Array.isArray(updatedAddresses)) {
        setAddresses(updatedAddresses);
      } else {
        await loadProfile();
      }

      setDefaultAddressId(addressId);

      showMessage(
        "success",
        "Default address updated."
      );
    } catch (error) {
      showMessage(
        "error",
        error.message ||
          "Unable to update default address."
      );
    }
  };

  const logout = () => {
    clearAuth();
    navigate("/");
  };

  const getInitials = () => {
    const name = user?.name || "User";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="profile-page">
          <div className="profile-loading">
            <Loader2 className="profile-spinner" size={32} />
            <p>Loading your profile...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
     <Navbar navbarBackground={'#000'} top="0"/>

      <main className="profile-page">
        {message.text && (
          <div
            className={`profile-toast ${message.type}`}
          >
            {message.type === "success" ? (
              <Check size={17} />
            ) : (
              <X size={17} />
            )}

            <span>{message.text}</span>
          </div>
        )}


        <section className="profile-container">
          <div className="profile-grid">
            {/* LEFT SIDE */}
            <aside className="profile-sidebar">
              <div className="profile-user-card">
                <div className="profile-avatar">
                  {getInitials()}
                </div>

                <div>
                  <h2>
                    {user?.name || "Saddle Rider"}
                  </h2>

                  <p>{user?.email}</p>
                </div>
              </div>

              <nav className="profile-navigation">
                <Link to="/orders">
                  <Package size={18} />
                  <span>My Orders</span>
                  <ChevronRight size={16} />
                </Link>

                <Link to="/wishlist">
                  <Heart size={18} />
                  <span>Wishlist</span>
                  <ChevronRight size={16} />
                </Link>

                <Link to="/cart">
                  <ShoppingBag size={18} />
                  <span>Shopping Bag</span>
                  <ChevronRight size={16} />
                </Link>
              </nav>

              <button
                className="profile-logout"
                onClick={logout}
              >
                <LogOut size={18} />
                Logout
              </button>
            </aside>

            {/* RIGHT SIDE */}
            <div className="profile-content">
              {/* PERSONAL INFORMATION */}
              <section className="profile-card">
                <div className="profile-card-header">
                  <div>
                    <span className="profile-section-label">
                      ACCOUNT
                    </span>

                    <h2>Personal Information</h2>
                  </div>

                  {!editingProfile && (
                    <button
                      className="profile-edit-btn"
                      onClick={() =>
                        setEditingProfile(true)
                      }
                    >
                      <Edit3 size={16} />
                      Edit
                    </button>
                  )}
                </div>

                {editingProfile ? (
                  <form
                    className="profile-form"
                    onSubmit={saveProfile}
                  >
                    <div className="profile-form-grid">
                      <div className="profile-field">
                        <label>Full Name</label>

                        <div className="profile-input-wrap">
                          <UserRound size={17} />

                          <input
                            type="text"
                            name="name"
                            value={profileForm.name}
                            onChange={
                              handleProfileChange
                            }
                            placeholder="Your name"
                          />
                        </div>
                      </div>

                      <div className="profile-field">
                        <label>Email Address</label>

                        <div className="profile-input-wrap disabled">
                          <Mail size={17} />

                          <input
                            type="email"
                            value={user?.email || ""}
                            disabled
                          />
                        </div>

                        <small>
                          Email cannot be changed here.
                        </small>
                      </div>

                      <div className="profile-field">
                        <label>Phone Number</label>

                        <div className="profile-input-wrap">
                          <Phone size={17} />

                          <input
                            type="tel"
                            name="phone"
                            value={profileForm.phone}
                            onChange={
                              handleProfileChange
                            }
                            placeholder="10-digit phone number"
                            maxLength={10}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="profile-form-actions">
                      <button
                        type="button"
                        className="profile-cancel-btn"
                        onClick={() => {
                          setEditingProfile(false);

                          setProfileForm({
                            name: user?.name || "",
                            phone: user?.phone || "",
                          });
                        }}
                      >
                        <X size={16} />
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="profile-save-btn"
                        disabled={profileSaving}
                      >
                        {profileSaving ? (
                          <>
                            <Loader2
                              size={16}
                              className="profile-btn-spinner"
                            />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={16} />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="profile-info-grid">
                    <div className="profile-info-item">
                      <span className="profile-info-icon">
                        <UserRound size={18} />
                      </span>

                      <div>
                        <small>Full Name</small>
                        <strong>
                          {user?.name || "Not added"}
                        </strong>
                      </div>
                    </div>

                    <div className="profile-info-item">
                      <span className="profile-info-icon">
                        <Mail size={18} />
                      </span>

                      <div>
                        <small>Email Address</small>
                        <strong>
                          {user?.email || "Not added"}
                        </strong>
                      </div>
                    </div>

                    <div className="profile-info-item">
                      <span className="profile-info-icon">
                        <Phone size={18} />
                      </span>

                      <div>
                        <small>Phone Number</small>
                        <strong>
                          {user?.phone || "Not added"}
                        </strong>
                      </div>
                    </div>

                    <div className="profile-info-item">
                      <span className="profile-info-icon">
                        <UserRound size={18} />
                      </span>

                      <div>
                        <small>Account Type</small>
                        <strong>
                          {user?.role === "admin"
                            ? "Administrator"
                            : "Customer"}
                        </strong>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* PASSWORD */}
              <section className="profile-card">
                <div className="profile-card-header">
                  <div>
                    <span className="profile-section-label">
                      SECURITY
                    </span>

                    <h2>Password & Security</h2>
                  </div>

                  {!showPasswordForm && (
                    <button
                      className="profile-edit-btn"
                      onClick={() =>
                        setShowPasswordForm(true)
                      }
                    >
                      <LockKeyhole size={16} />
                      Change Password
                    </button>
                  )}
                </div>

                {showPasswordForm ? (
                  <form
                    className="profile-form"
                    onSubmit={changePassword}
                  >
                    <div className="profile-form-grid">
                      <div className="profile-field">
                        <label>
                          Current Password
                        </label>

                        <input
                          className="profile-plain-input"
                          type="password"
                          name="currentPassword"
                          value={
                            passwordForm.currentPassword
                          }
                          onChange={
                            handlePasswordChange
                          }
                          placeholder="Current password"
                        />
                      </div>

                      <div className="profile-field">
                        <label>New Password</label>

                        <input
                          className="profile-plain-input"
                          type="password"
                          name="newPassword"
                          value={
                            passwordForm.newPassword
                          }
                          onChange={
                            handlePasswordChange
                          }
                          placeholder="Minimum 6 characters"
                        />
                      </div>

                      <div className="profile-field">
                        <label>
                          Confirm New Password
                        </label>

                        <input
                          className="profile-plain-input"
                          type="password"
                          name="confirmPassword"
                          value={
                            passwordForm.confirmPassword
                          }
                          onChange={
                            handlePasswordChange
                          }
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>

                    <div className="profile-form-actions">
                      <button
                        type="button"
                        className="profile-cancel-btn"
                        onClick={() => {
                          setShowPasswordForm(false);

                          setPasswordForm({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                        }}
                      >
                        <X size={16} />
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="profile-save-btn"
                        disabled={passwordSaving}
                      >
                        {passwordSaving ? (
                          <>
                            <Loader2
                              size={16}
                              className="profile-btn-spinner"
                            />
                            Updating...
                          </>
                        ) : (
                          <>
                            <LockKeyhole size={16} />
                            Update Password
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="profile-security-row">
                    <div className="profile-security-icon">
                      <LockKeyhole size={20} />
                    </div>

                    <div>
                      <strong>Password</strong>
                      <p>
                        Keep your account secure with
                        a strong password.
                      </p>
                    </div>
                  </div>
                )}
              </section>

              {/* ADDRESSES */}
              <section className="profile-card">
                <div className="profile-card-header">
                  <div>
                    <span className="profile-section-label">
                      DELIVERY
                    </span>

                    <h2>Saved Addresses</h2>
                  </div>

                  <button
                    className="profile-add-address-btn"
                    onClick={openAddAddress}
                  >
                    <Plus size={17} />
                    Add Address
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="profile-empty-address">
                    <div>
                      <MapPin size={28} />
                    </div>

                    <h3>No saved addresses</h3>

                    <p>
                      Add a delivery address for a
                      faster checkout experience.
                    </p>

                    <button
                      onClick={openAddAddress}
                      className="profile-save-btn"
                    >
                      <Plus size={16} />
                      Add Your First Address
                    </button>
                  </div>
                ) : (
                  <div className="profile-address-list">
                    {addresses.map((address, index) => {
                      const addressId =
                        address._id ||
                        address.id ||
                        `address-${index}`;

                      const isDefault =
                        address.isDefault ||
                        address.default ||
                        defaultAddressId ===
                          addressId;

                      return (
                        <div
                          className={`profile-address ${
                            isDefault
                              ? "is-default"
                              : ""
                          }`}
                          key={addressId}
                        >
                          <div className="profile-address-top">
                            <div className="profile-address-title">
                              <span className="profile-address-icon">
                                <Home size={17} />
                              </span>

                              <strong>
                                {address.fullName ||
                                  "Delivery Address"}
                              </strong>

                              {isDefault && (
                                <span className="default-badge">
                                  Default
                                </span>
                              )}
                            </div>

                            <div className="profile-address-actions">
                              <button
                                onClick={() =>
                                  openEditAddress(
                                    address
                                  )
                                }
                                aria-label="Edit address"
                              >
                                <Edit3 size={16} />
                              </button>

                              <button
                                onClick={() =>
                                  deleteAddress(
                                    addressId
                                  )
                                }
                                disabled={
                                  deletingAddressId ===
                                  addressId
                                }
                                aria-label="Delete address"
                              >
                                {deletingAddressId ===
                                addressId ? (
                                  <Loader2
                                    size={16}
                                    className="profile-btn-spinner"
                                  />
                                ) : (
                                  <Trash2 size={16} />
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="profile-address-body">
                            <p>
                              {address.address}
                            </p>

                            <p>
                              {address.city},{" "}
                              {address.state} -{" "}
                              {address.pincode}
                            </p>

                            <p>
                              Phone: {address.phone}
                            </p>
                          </div>

                          {!isDefault && (
                            <button
                              className="make-default-btn"
                              onClick={() =>
                                makeDefaultAddress(
                                  addressId
                                )
                              }
                            >
                              Make Default
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ADDRESS FORM */}
                {showAddressForm && (
                  <div className="address-form-overlay">
                    <div className="address-form-card">
                      <div className="address-form-header">
                        <div>
                          <span>
                            {editingAddressId
                              ? "EDIT ADDRESS"
                              : "NEW ADDRESS"}
                          </span>

                          <h3>
                            {editingAddressId
                              ? "Update Address"
                              : "Add Delivery Address"}
                          </h3>
                        </div>

                        <button
                          onClick={
                            closeAddressForm
                          }
                        >
                          <X size={20} />
                        </button>
                      </div>

                      <form
                        onSubmit={saveAddress}
                        className="profile-form"
                      >
                        <div className="profile-form-grid">
                          <div className="profile-field">
                            <label>
                              Full Name
                            </label>

                            <input
                              className="profile-plain-input"
                              type="text"
                              name="fullName"
                              value={
                                addressForm.fullName
                              }
                              onChange={
                                handleAddressChange
                              }
                              placeholder="Full name"
                            />
                          </div>

                          <div className="profile-field">
                            <label>Phone</label>

                            <input
                              className="profile-plain-input"
                              type="tel"
                              name="phone"
                              value={
                                addressForm.phone
                              }
                              onChange={
                                handleAddressChange
                              }
                              placeholder="10-digit phone"
                              maxLength={10}
                            />
                          </div>

                          <div className="profile-field profile-field-full">
                            <label>Address</label>

                            <textarea
                              name="address"
                              value={
                                addressForm.address
                              }
                              onChange={
                                handleAddressChange
                              }
                              placeholder="House no., street, area..."
                              rows="3"
                            />
                          </div>

                          <div className="profile-field">
                            <label>City</label>

                            <input
                              className="profile-plain-input"
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

                          <div className="profile-field">
                            <label>State</label>

                            <input
                              className="profile-plain-input"
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

                          <div className="profile-field">
                            <label>Pincode</label>

                            <input
                              className="profile-plain-input"
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

                        <div className="profile-form-actions">
                          <button
                            type="button"
                            className="profile-cancel-btn"
                            onClick={
                              closeAddressForm
                            }
                          >
                            <X size={16} />
                            Cancel
                          </button>

                          <button
                            type="submit"
                            className="profile-save-btn"
                            disabled={addressSaving}
                          >
                            {addressSaving ? (
                              <>
                                <Loader2
                                  size={16}
                                  className="profile-btn-spinner"
                                />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save size={16} />
                                {editingAddressId
                                  ? "Update Address"
                                  : "Save Address"}
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Profile;