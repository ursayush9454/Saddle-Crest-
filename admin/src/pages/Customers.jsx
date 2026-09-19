import React, { useEffect, useMemo, useState } from "react";
import {
  RefreshCw,
  UserX,
  Info,
  X,
  Mail,
  Phone,
  CalendarDays,
  User,
  MapPin,
} from "lucide-react";
import { apiRequest } from "../services/api";
import "./Customers.css";

const Customers = () => {
  const [data, setData] = useState({
    customers: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [selectedCustomer, setSelectedCustomer] =
    useState(null);

  const loadCustomers = async () => {
    try {
      setError("");

      const result = await apiRequest(
        "/admin/customers"
      );

      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const result = await apiRequest(
          "/admin/customers"
        );

        if (mounted) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedCustomer) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedCustomer(null);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [selectedCustomer]);

  const disableCustomer = async (id) => {
    const confirmed = window.confirm(
      "Disable this customer account?"
    );

    if (!confirmed) return;

    try {
      await apiRequest(
        `/admin/customers/${id}`,
        {
          method: "DELETE",
        }
      );

      await loadCustomers();

      setSelectedCustomer((current) => {
        if (!current || current._id !== id) {
          return current;
        }

        return {
          ...current,
          isActive: false,
        };
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredCustomers = useMemo(() => {
    const customers = data.customers || [];

    const searchValue = search
      .trim()
      .toLowerCase();

    return customers.filter((customer) => {
      const name = String(
        customer.name || ""
      ).toLowerCase();

      const email = String(
        customer.email || ""
      ).toLowerCase();

      const phone = String(
        customer.phone || ""
      ).toLowerCase();

      const matchesSearch =
        !searchValue ||
        name.includes(searchValue) ||
        email.includes(searchValue) ||
        phone.includes(searchValue);

      const isActive =
        customer.isActive !== false;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" &&
          isActive) ||
        (statusFilter === "disabled" &&
          !isActive);

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    data.customers,
    search,
    statusFilter,
  ]);

  const getAddress = (customer) => {
    const address =
      customer.address ||
      customer.shippingAddress;

    if (!address) return "—";

    if (typeof address === "string") {
      return address;
    }

    return [
      address.address,
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.state,
      address.pincode ||
        address.zipCode,
      address.country,
    ]
      .filter(Boolean)
      .join(", ");
  };

  if (loading) {
    return (
      <div className="loading-state">
        Loading customers...
      </div>
    );
  }

  return (
    <>
      <div className="customers-page">
        {error && (
          <div className="error-panel">
            <p>{error}</p>
          </div>
        )}

        <section className="panel table-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">
                CUSTOMER BASE
              </span>

              <h3>Customers</h3>
            </div>

            <button
              className="outline-button"
              onClick={loadCustomers}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          <div className="customers-toolbar">
            <div className="customer-search">
              <SearchIcon />

              <input
                type="text"
                placeholder="Search by name, email or phone..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            <div className="customer-filter">
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
              >
                <option value="all">
                  All Customers
                </option>

                <option value="active">
                  Active
                </option>

                <option value="disabled">
                  Disabled
                </option>
              </select>
            </div>
          </div>

          <div className="customers-result-count">
            Showing{" "}
            <strong>
              {filteredCustomers.length}
            </strong>{" "}
            customer
            {filteredCustomers.length !== 1
              ? "s"
              : ""}
          </div>

          <div className="table-wrapper">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th className="customer-info-heading">
                    Info
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.length ? (
                  filteredCustomers.map(
                    (customer) => (
                      <tr key={customer._id}>
                        <td>
                          <div className="customer-name-cell">
                            <div className="customer-avatar">
                              {String(
                                customer.name ||
                                  "U"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>
                                {customer.name ||
                                  "Unnamed Customer"}
                              </strong>

                              <small>
                                {customer.email ||
                                  "No email available"}
                              </small>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="customer-info-cell">
                            <button
                              type="button"
                              className="customer-info-button"
                              title="View customer details"
                              onClick={() =>
                                setSelectedCustomer(
                                  customer
                                )
                              }
                            >
                              <Info size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan="2">
                      <div className="empty-state">
                        No customers found.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {selectedCustomer && (
        <div
          className="customer-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              setSelectedCustomer(null);
            }
          }}
        >
          <div className="customer-modal">
            <div className="customer-modal-header">
              <div>
                <span className="eyebrow">
                  CUSTOMER PROFILE
                </span>

                <h2>
                  {selectedCustomer.name ||
                    "Unnamed Customer"}
                </h2>

                <span
                  className={`customer-modal-status ${
                    selectedCustomer.isActive ===
                    false
                      ? "inactive"
                      : "active"
                  }`}
                >
                  {selectedCustomer.isActive ===
                  false
                    ? "Disabled"
                    : "Active"}
                </span>
              </div>

              <button
                type="button"
                className="customer-modal-close"
                onClick={() =>
                  setSelectedCustomer(null)
                }
                aria-label="Close"
              >
                <X size={21} />
              </button>
            </div>

            <div className="customer-modal-body">
              <div className="customer-details-grid">
                <div className="customer-detail-card">
                  <div className="customer-detail-icon">
                    <User size={18} />
                  </div>

                  <div>
                    <span>Name</span>
                    <strong>
                      {selectedCustomer.name ||
                        "—"}
                    </strong>
                  </div>
                </div>

                <div className="customer-detail-card">
                  <div className="customer-detail-icon">
                    <Mail size={18} />
                  </div>

                  <div>
                    <span>Email</span>
                    <strong>
                      {selectedCustomer.email ||
                        "—"}
                    </strong>
                  </div>
                </div>

                <div className="customer-detail-card">
                  <div className="customer-detail-icon">
                    <Phone size={18} />
                  </div>

                  <div>
                    <span>Phone</span>
                    <strong>
                      {selectedCustomer.phone ||
                        "—"}
                    </strong>
                  </div>
                </div>

                <div className="customer-detail-card">
                  <div className="customer-detail-icon">
                    <CalendarDays size={18} />
                  </div>

                  <div>
                    <span>Joined</span>
                    <strong>
                      {selectedCustomer.createdAt
                        ? new Date(
                            selectedCustomer.createdAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "—"}
                    </strong>
                  </div>
                </div>

                <div className="customer-detail-card customer-detail-full">
                  <div className="customer-detail-icon">
                    <MapPin size={18} />
                  </div>

                  <div>
                    <span>Address</span>
                    <strong>
                      {getAddress(
                        selectedCustomer
                      )}
                    </strong>
                  </div>
                </div>

                <div className="customer-detail-card customer-detail-full">
                  <div className="customer-detail-icon">
                    <User size={18} />
                  </div>

                  <div>
                    <span>Customer ID</span>
                    <strong className="customer-id">
                      {selectedCustomer._id ||
                        "—"}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="customer-modal-footer">
                <button
                  type="button"
                  className="outline-button"
                  onClick={() =>
                    setSelectedCustomer(null)
                  }
                >
                  Close
                </button>

                {selectedCustomer.isActive !==
                  false && (
                  <button
                    type="button"
                    className="customer-disable-button"
                    onClick={() =>
                      disableCustomer(
                        selectedCustomer._id
                      )
                    }
                  >
                    <UserX size={15} />
                    Disable Customer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const SearchIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export default Customers;