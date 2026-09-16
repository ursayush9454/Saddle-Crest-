import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, LoaderCircle } from "lucide-react";


import { loginUser, setAuth } from "../services/api";

import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(email, password);

      if (!data?.token) {
        throw new Error("Login failed. Authentication token was not received.");
      }

      if (data.user?.role === "admin") {
        setError(
          "Admin account detected. Please use the admin panel to continue."
        );
        return;
      }

      setAuth(data.token, data.user);

      const redirectTo = location.state?.from || "/";

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      

      <main className="auth-main">
        <div className="auth-wrapper">
          {/* LEFT SIDE */}
          <section className="auth-brand-panel">
            <div className="auth-brand-content">
              <span className="auth-eyebrow">SADDLE & CREST</span>

              <h1>
                Crafted for
                <br />
                <em>the journey.</em>
              </h1>

              <p>
                Premium equestrian essentials, thoughtfully crafted for riders
                and horses who deserve nothing ordinary.
              </p>

              <div className="auth-brand-line" />

              <span className="auth-brand-note">
                Heritage · Craftsmanship · Performance
              </span>
            </div>
          </section>

          {/* RIGHT SIDE */}
          <section className="auth-form-panel">
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
                <span>WELCOME BACK</span>

                <h2>Sign in.</h2>

                <p>
                  Enter your details to continue your Saddle & Crest journey.
                </p>
              </div>

              {error && <div className="auth-error">{error}</div>}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="auth-field">
                  <label htmlFor="login-email">Email Address</label>

                  <input
                    id="login-email"
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
                  <div className="auth-label-row">
                    <label htmlFor="login-password">Password</label>

                    <button
                      type="button"
                      className="forgot-password"
                      onClick={() =>
                        setError(
                          "Password reset is available through your account support flow."
                        )
                      }
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="password-input">
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={loading}
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
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

                <button
                  type="submit"
                  className="auth-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="auth-spinner" size={18} />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <div className="auth-switch">
                <span>Don't have an account?</span>

                <Link to="/register">Create an account</Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Login;