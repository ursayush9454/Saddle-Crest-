import React, { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { apiRequest } from "../services/api";

const statuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const Orders = () => {
  const [data, setData] = useState({ orders: [] });

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setError("");

      const result = await apiRequest("/admin/orders");

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
        const result = await apiRequest("/admin/orders");

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

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);

      await apiRequest(
        `/admin/orders/${orderId}/status`,
        {
          method: "PUT",
          body: JSON.stringify({ status }),
        }
      );

      await loadOrders();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <div className="loading-state">Loading orders...</div>;
  }

  return (
    <div className="orders-page">
      {error && (
        <div className="error-panel">
          <p>{error}</p>
        </div>
      )}

      <section className="panel table-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">FULFILMENT</span>
            <h3>Orders</h3>
          </div>

          <button
            className="outline-button"
            onClick={loadOrders}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {data.orders?.length ? (
                data.orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <strong>
                        #
                        {order._id
                          .slice(-8)
                          .toUpperCase()}
                      </strong>
                    </td>

                    <td>
                      <div className="customer-cell">
                        <strong>
                          {order.user?.name ||
                            "Customer"}
                        </strong>

                        <small>
                          {order.user?.email || "—"}
                        </small>
                      </div>
                    </td>

                    <td>
                      ₹
                      {Number(
                        order.totalAmount || 0
                      ).toLocaleString("en-IN")}
                    </td>

                    <td>
                      <span className="pill">
                        {order.paymentMethod || "COD"}
                      </span>
                    </td>

                    <td>
                      <select
                        className="status-select"
                        value={order.status}
                        disabled={
                          updatingId === order._id
                        }
                        onChange={(e) =>
                          updateStatus(
                            order._id,
                            e.target.value
                          )
                        }
                      >
                        {statuses.map((status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">
                      No orders found.
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

export default Orders;