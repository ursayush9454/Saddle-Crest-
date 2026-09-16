import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LoaderCircle,
  Check,
} from "lucide-react";


import { registerUser, setAuth } from "../services/api";

import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const validateForm = () => {
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();

    if (!name || !email || !phone || !form.password || !form.confirmPassword) {
      return "Please fill in all fields.";
    }

    if (name.length < 2) {
      return "Please enter your full name.";
    }

    if (!email.includes("@")) {
      return "Please enter a valid email address.";
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return "Please enter a valid 10-digit Indian mobile number.";
    }

    if (form.password.length < 6) {
      return "Password must contain at least 6 characters.";
    }

    if (form.password !== form.confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const data = await registerUser({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
      });

      /*
        Depending on backend response, registration may either:
        1. Return token + user
        2. Return only success message
      */

      if (data?.token) {
        setAuth(data.token, data.user);
        navigate("/", { replace: true });
        return;
      }

      navigate("/login", {
        replace: true,
        state: {
          registered: true,
        },
      });
    } catch (err) {
      setError(err.message || "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page register-page">
      

      <main className="auth-main">
        <div className="auth-wrapper register-wrapper">
          {/* LEFT */}
          <section className="auth-brand-panel register-brand-panel">
            <div className="auth-brand-content">
              <span className="auth-eyebrow">JOIN THE CREST</span>

              <h1>
                Your
                <br />
                <em>journey</em>
                <br />
                begins here.
              </h1>

              <p>
                Create your Saddle & Crest account and discover carefully
                crafted essentials for every ride.
              </p>

              <div className="register-perks">
                <div>
                  <span className="perk-icon">
                    <Check size={13} />
                  </span>
                  <span>Save your favourite pieces</span>
                </div>

                <div>
                  <span className="perk-icon">
                    <Check size={13} />
                  </span>
                  <span>Track every order</span>
                </div>

                <div>
                  <span className="perk-icon">
                    <Check size={13} />
                  </span>
                  <span>Faster checkout</span>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT */}
          <section className="auth-form-panel register-form-panel">
            <button
              type="button"
              className="auth-back"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <div className="auth-form-container">
              <div className="auth-heading">
                <span>CREATE YOUR ACCOUNT</span>

                <h2>Join us.</h2>

                <p>
                  Become part of the Saddle & Crest community.
                </p>
              </div>

              {error && <div className="auth-error">{error}</div>}

              <form onSubmit={handleSubmit} className="auth-form register-form">
                <div className="register-two-column">
                  <div className="auth-field">
                    <label htmlFor="register-name">Full Name</label>

                    <input
                      id="register-name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      autoComplete="name"
                      disabled={loading}
                    />
                  </div>

                  <div className="auth-field">
                    <label htmlFor="register-phone">Phone</label>

                    <input
                      id="register-phone"
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="10 digit number"
                      maxLength="10"
                      autoComplete="tel"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="auth-field">
                  <label htmlFor="register-email">Email Address</label>

                  <input
                    id="register-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="register-password">Password</label>

                  <div className="password-input">
                    <input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Minimum 6 characters"
                      autoComplete="new-password"
                      disabled={loading}
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="auth-field">
                  <label htmlFor="register-confirm-password">
                    Confirm Password
                  </label>

                  <div className="password-input">
                    <input
                      id="register-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat your password"
                      autoComplete="new-password"
                      disabled={loading}
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowConfirmPassword((prev) => !prev)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <p className="register-terms">
                  By creating an account, you agree to our terms and privacy
                  policy.
                </p>

                <button
                  type="submit"
                  className="auth-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="auth-spinner" size={18} />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              <div className="auth-switch">
                <span>Already have an account?</span>

                <Link to="/login">Sign in</Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Register;