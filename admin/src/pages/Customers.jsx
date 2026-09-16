import React, { useEffect, useState } from "react";
import { RefreshCw, UserX } from "lucide-react";
import { apiRequest } from "../services/api";

const Customers = () => {
  const [data, setData] = useState({
    customers: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        Loading customers...
      </div>
    );
  }

  return (
    <div className="customers-page">
      {error && (
        <div className="error-panel">
          <p>{error}</p>
        </div>
      )}

      <section className="panel table-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">CUSTOMER BASE</span>
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

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {data.customers?.length ? (
                data.customers.map((customer) => (
                  <tr key={customer._id}>
                    <td>
                      <div className="customer-cell">
                        <strong>
                          {customer.name ||
                            "Unnamed"}
                        </strong>

                        <small>
                          {customer.email}
                        </small>
                      </div>
                    </td>

                    <td>
                      {customer.phone || "—"}
                    </td>

                    <td>
                      {customer.createdAt
                        ? new Date(
                            customer.createdAt
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "—"}
                    </td>

                    <td>
                      <span
                        className={`status-pill ${
                          customer.isActive === false
                            ? "inactive"
                            : "active"
                        }`}
                      >
                        {customer.isActive === false
                          ? "Disabled"
                          : "Active"}
                      </span>
                    </td>

                    <td>
                      {customer.isActive !== false && (
                        <button
                          className="tiny-button danger"
                          title="Disable customer"
                          onClick={() =>
                            disableCustomer(
                              customer._id
                            )
                          }
                        >
                          <UserX size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">
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
  );
};

export default Customers;