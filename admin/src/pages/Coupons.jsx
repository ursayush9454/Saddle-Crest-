import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Power,
  X,
  TicketPercent,
  RefreshCw,
} from "lucide-react";
import { apiRequest } from "../services/api";
import "./Coupons.css";

const initialForm = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  minimumOrder: "",
  maximumDiscount: "",
  startDate: "",
  expiryDate: "",
  usageLimit: "",
  perUserLimit: "1",
  active: true,
};

const toDateInput = (value) => {
  if (!value) return "";
  return String(value).slice(0, 10);
};

const emptyForm = () => ({
  ...initialForm,
});

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const [form, setForm] = useState(emptyForm());

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // FETCH COUPONS
  // =========================

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (statusFilter !== "all") {
        params.set(
          "active",
          statusFilter === "active"
            ? "true"
            : "false"
        );
      }

      const query = params.toString();

      const data = await apiRequest(
        `/coupons${query ? `?${query}` : ""}`
      );

      setCoupons(data.coupons || []);
    } catch (err) {
      setError(
        err.message || "Failed to load coupons"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCoupons();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  // =========================
  // FORM
  // =========================

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const openCreateModal = () => {
    setEditingCoupon(null);
    setForm(emptyForm());
    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);

    setForm({
      code: coupon.code || "",

      discountType:
        coupon.discountType || "percentage",

      discountValue:
        coupon.discountValue ?? "",

      minimumOrder:
        coupon.minimumOrder ?? "",

      maximumDiscount:
        coupon.maximumDiscount ?? "",

      startDate:
        toDateInput(coupon.startDate),

      expiryDate:
        toDateInput(coupon.expiryDate),

      usageLimit:
        coupon.usageLimit ?? "",

      perUserLimit:
        coupon.perUserLimit ?? "1",

      active:
        coupon.active !== false,
    });

    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingCoupon(null);
    setForm(emptyForm());
  };

  // =========================
  // CREATE / UPDATE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload = {
        code: form.code.trim().toUpperCase(),

        discountType: form.discountType,

        discountValue:
          Number(form.discountValue),

        minimumOrder:
          Number(form.minimumOrder) || 0,

        maximumDiscount:
          Number(form.maximumDiscount) || 0,

        startDate:
          form.startDate || null,

        expiryDate:
          form.expiryDate || null,

        usageLimit:
          Number(form.usageLimit) || 0,

        perUserLimit:
          Math.max(
            1,
            Number(form.perUserLimit) || 1
          ),

        active: Boolean(form.active),
      };

      let data;

      if (editingCoupon) {
        data = await apiRequest(
          `/coupons/${editingCoupon._id}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );
      } else {
        data = await apiRequest(
          "/coupons",
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );
      }

      setSuccess(
        data.message ||
          (editingCoupon
            ? "Coupon updated successfully"
            : "Coupon created successfully")
      );

      setModalOpen(false);
      setEditingCoupon(null);
      setForm(emptyForm());

      await fetchCoupons();
    } catch (err) {
      setError(
        err.message || "Failed to save coupon"
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // TOGGLE
  // =========================

  const toggleCoupon = async (coupon) => {
    try {
      setError("");
      setSuccess("");

      const data = await apiRequest(
        `/coupons/${coupon._id}/status`,
        {
          method: "PATCH",
        }
      );

      setSuccess(
        data.message ||
          "Coupon status updated"
      );

      await fetchCoupons();
    } catch (err) {
      setError(
        err.message ||
          "Failed to update coupon status"
      );
    }
  };

  // =========================
  // DELETE
  // =========================

  const deleteCoupon = async (coupon) => {
    const confirmed = window.confirm(
      `Delete coupon "${coupon.code}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const data = await apiRequest(
        `/coupons/${coupon._id}`,
        {
          method: "DELETE",
        }
      );

      setSuccess(
        data.message ||
          "Coupon deleted successfully"
      );

      await fetchCoupons();
    } catch (err) {
      setError(
        err.message ||
          "Failed to delete coupon"
      );
    }
  };

  // =========================
  // STATS
  // =========================

  const stats = useMemo(() => {
    const total = coupons.length;

    const active = coupons.filter(
      (coupon) => coupon.active
    ).length;

    const inactive = total - active;

    const used = coupons.reduce(
      (sum, coupon) =>
        sum + Number(coupon.usedCount || 0),
      0
    );

    return {
      total,
      active,
      inactive,
      used,
    };
  }, [coupons]);

  // =========================
  // HELPERS
  // =========================

  const formatDiscount = (coupon) => {
    if (coupon.discountType === "percentage") {
      return `${coupon.discountValue}%`;
    }

    return `₹${Number(
      coupon.discountValue || 0
    ).toLocaleString("en-IN")}`;
  };

  const formatDate = (value) => {
    if (!value) return "No expiry";

    return new Date(value).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <section className="coupons-page">

      {/* HEADER */}

      <div className="coupons-header">

        <div>
          <span className="coupons-eyebrow">
            SALES & PROMOTIONS
          </span>

          <h1>Coupons</h1>

          <p>
            Create and manage discount codes
            for Saddle & Crest customers.
          </p>
        </div>

        <button
          className="coupon-primary-button"
          onClick={openCreateModal}
        >
          <Plus size={18} />
          Create Coupon
        </button>

      </div>

      {/* MESSAGES */}

      {error && (
        <div className="coupon-message error">
          <span>{error}</span>

          <button
            onClick={() => setError("")}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {success && (
        <div className="coupon-message success">
          <span>{success}</span>

          <button
            onClick={() => setSuccess("")}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* STATS */}

      <div className="coupon-stats">

        <div className="coupon-stat-card">
          <div className="coupon-stat-icon">
            <TicketPercent size={19} />
          </div>

          <div>
            <span>Total Coupons</span>
            <strong>{stats.total}</strong>
          </div>
        </div>

        <div className="coupon-stat-card">
          <div className="coupon-stat-icon active">
            <Power size={18} />
          </div>

          <div>
            <span>Active</span>
            <strong>{stats.active}</strong>
          </div>
        </div>

        <div className="coupon-stat-card">
          <div className="coupon-stat-icon inactive">
            <Power size={18} />
          </div>

          <div>
            <span>Inactive</span>
            <strong>{stats.inactive}</strong>
          </div>
        </div>

        <div className="coupon-stat-card">
          <div className="coupon-stat-icon used">
            <TicketPercent size={18} />
          </div>

          <div>
            <span>Total Uses</span>
            <strong>{stats.used}</strong>
          </div>
        </div>

      </div>

      {/* TOOLBAR */}

      <div className="coupon-toolbar">

        <div className="coupon-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search coupon code..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <div className="coupon-toolbar-right">

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="all">
              All Status
            </option>

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>

          <button
            className="refresh-button"
            onClick={fetchCoupons}
            title="Refresh"
          >
            <RefreshCw
              size={17}
              className={
                loading
                  ? "spin"
                  : ""
              }
            />
          </button>

        </div>

      </div>

      {/* TABLE */}

      <div className="coupon-table-card">

        {loading ? (
          <div className="coupon-loading">
            <RefreshCw
              size={22}
              className="spin"
            />
            <span>
              Loading coupons...
            </span>
          </div>
        ) : coupons.length === 0 ? (
          <div className="coupon-empty">

            <div className="coupon-empty-icon">
              <TicketPercent size={26} />
            </div>

            <h3>No coupons found</h3>

            <p>
              Create your first discount
              coupon to get started.
            </p>

            <button
              className="coupon-primary-button"
              onClick={openCreateModal}
            >
              <Plus size={17} />
              Create Coupon
            </button>

          </div>
        ) : (
          <div className="coupon-table-wrapper">

            <table className="coupon-table">

              <thead>
                <tr>
                  <th>Coupon</th>
                  <th>Discount</th>
                  <th>Minimum Order</th>
                  <th>Validity</th>
                  <th>Usage</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {coupons.map((coupon) => (
                  <tr key={coupon._id}>

                    <td>
                      <div className="coupon-code-cell">

                        <span className="coupon-code">
                          {coupon.code}
                        </span>

                        <small>
                          {coupon.discountType ===
                          "percentage"
                            ? "Percentage discount"
                            : "Fixed amount discount"}
                        </small>

                      </div>
                    </td>

                    <td>
                      <strong className="discount-value">
                        {formatDiscount(
                          coupon
                        )}
                      </strong>

                      {coupon.maximumDiscount >
                        0 &&
                        coupon.discountType ===
                          "percentage" && (
                          <small className="table-subtext">
                            Max ₹
                            {Number(
                              coupon.maximumDiscount
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </small>
                        )}
                    </td>

                    <td>
                      ₹
                      {Number(
                        coupon.minimumOrder || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td>
                      <div className="validity-cell">

                        <span>
                          {coupon.startDate
                            ? formatDate(
                                coupon.startDate
                              )
                            : "Immediately"}
                        </span>

                        <small>
                          →{" "}
                          {formatDate(
                            coupon.expiryDate
                          )}
                        </small>

                      </div>
                    </td>

                    <td>
                      <div className="usage-cell">
                        <strong>
                          {coupon.usedCount || 0}
                        </strong>

                        <span>
                          {coupon.usageLimit > 0
                            ? ` / ${coupon.usageLimit}`
                            : " / Unlimited"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <button
                        className={`status-pill ${
                          coupon.active
                            ? "active"
                            : "inactive"
                        }`}
                        onClick={() =>
                          toggleCoupon(coupon)
                        }
                      >
                        <span />
                        {coupon.active
                          ? "Active"
                          : "Inactive"}
                      </button>
                    </td>

                    <td>
                      <div className="coupon-actions">

                        <button
                          className="icon-action edit"
                          onClick={() =>
                            openEditModal(
                              coupon
                            )
                          }
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="icon-action toggle"
                          onClick={() =>
                            toggleCoupon(
                              coupon
                            )
                          }
                          title={
                            coupon.active
                              ? "Deactivate"
                              : "Activate"
                          }
                        >
                          <Power size={16} />
                        </button>

                        <button
                          className="icon-action delete"
                          onClick={() =>
                            deleteCoupon(
                              coupon
                            )
                          }
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* MODAL */}

      {modalOpen && (
        <div
          className="coupon-modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget
            ) {
              closeModal();
            }
          }}
        >

          <div className="coupon-modal">

            <div className="coupon-modal-header">

              <div>
                <span>
                  {editingCoupon
                    ? "EDIT COUPON"
                    : "NEW PROMOTION"}
                </span>

                <h2>
                  {editingCoupon
                    ? "Edit Coupon"
                    : "Create Coupon"}
                </h2>
              </div>

              <button
                className="modal-close"
                onClick={closeModal}
              >
                <X size={19} />
              </button>

            </div>

            <form
              className="coupon-form"
              onSubmit={handleSubmit}
            >

              {/* CODE */}

              <div className="form-section">

                <h3>Coupon Details</h3>

                <div className="form-grid">

                  <label className="full">
                    Coupon Code

                    <input
                      type="text"
                      placeholder="e.g. ROYAL20"
                      value={form.code}
                      onChange={(e) =>
                        updateField(
                          "code",
                          e.target.value
                            .toUpperCase()
                        )
                      }
                      required
                    />
                  </label>

                  <label>
                    Discount Type

                    <select
                      value={
                        form.discountType
                      }
                      onChange={(e) =>
                        updateField(
                          "discountType",
                          e.target.value
                        )
                      }
                    >
                      <option value="percentage">
                        Percentage (%)
                      </option>

                      <option value="fixed">
                        Fixed Amount (₹)
                      </option>
                    </select>
                  </label>

                  <label>
                    Discount Value

                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder={
                        form.discountType ===
                        "percentage"
                          ? "20"
                          : "500"
                      }
                      value={
                        form.discountValue
                      }
                      onChange={(e) =>
                        updateField(
                          "discountValue",
                          e.target.value
                        )
                      }
                      required
                    />
                  </label>

                </div>

              </div>

              {/* ORDER RULES */}

              <div className="form-section">

                <h3>Order Rules</h3>

                <div className="form-grid">

                  <label>
                    Minimum Order (₹)

                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={
                        form.minimumOrder
                      }
                      onChange={(e) =>
                        updateField(
                          "minimumOrder",
                          e.target.value
                        )
                      }
                    />
                  </label>

                  <label>
                    Maximum Discount (₹)

                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0 = No limit"
                      value={
                        form.maximumDiscount
                      }
                      onChange={(e) =>
                        updateField(
                          "maximumDiscount",
                          e.target.value
                        )
                      }
                    />
                  </label>

                </div>

              </div>

              {/* VALIDITY */}

              <div className="form-section">

                <h3>Validity</h3>

                <div className="form-grid">

                  <label>
                    Start Date

                    <input
                      type="date"
                      value={
                        form.startDate
                      }
                      onChange={(e) =>
                        updateField(
                          "startDate",
                          e.target.value
                        )
                      }
                    />
                  </label>

                  <label>
                    Expiry Date

                    <input
                      type="date"
                      value={
                        form.expiryDate
                      }
                      onChange={(e) =>
                        updateField(
                          "expiryDate",
                          e.target.value
                        )
                      }
                    />
                  </label>

                </div>

              </div>

              {/* USAGE */}

              <div className="form-section">

                <h3>Usage Limits</h3>

                <div className="form-grid">

                  <label>
                    Total Usage Limit

                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0 = Unlimited"
                      value={
                        form.usageLimit
                      }
                      onChange={(e) =>
                        updateField(
                          "usageLimit",
                          e.target.value
                        )
                      }
                    />
                  </label>

                  <label>
                    Per User Limit

                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={
                        form.perUserLimit
                      }
                      onChange={(e) =>
                        updateField(
                          "perUserLimit",
                          e.target.value
                        )
                      }
                    />
                  </label>

                </div>

              </div>

              {/* STATUS */}

              <label className="active-toggle">

                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) =>
                    updateField(
                      "active",
                      e.target.checked
                    )
                  }
                />

                <span className="toggle-ui" />

                <div>
                  <strong>
                    Coupon Active
                  </strong>

                  <small>
                    Customers can use this
                    coupon when active.
                  </small>
                </div>

              </label>

              {/* FOOTER */}

              <div className="coupon-modal-footer">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="coupon-primary-button"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <RefreshCw
                        size={16}
                        className="spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <TicketPercent
                        size={17}
                      />
                      {editingCoupon
                        ? "Update Coupon"
                        : "Create Coupon"}
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </section>
  );
};

export default Coupons;