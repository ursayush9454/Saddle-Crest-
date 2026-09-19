import React, { useEffect, useState } from "react";
import {
  RefreshCw,
  Info,
  X,
  Package,
  User,
  MapPin,
  CreditCard,
  CalendarDays,
} from "lucide-react";
import { apiRequest } from "../services/api";
import "./Orders.css";

const statuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const formatCurrency = (value) => {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
};

const formatDate = (value) => {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getCustomerName = (order) => {
  return (
    order?.user?.name ||
    order?.customer?.name ||
    order?.customerName ||
    "Customer"
  );
};

const getCustomerEmail = (order) => {
  return (
    order?.user?.email ||
    order?.customer?.email ||
    order?.email ||
    "—"
  );
};

const getCustomerPhone = (order) => {
  return (
    order?.user?.phone ||
    order?.customer?.phone ||
    order?.phone ||
    "—"
  );
};

const getOrderItems = (order) => {
  return order?.items || order?.orderItems || [];
};

const getItemName = (item) => {
  return (
    item?.product?.name ||
    item?.productName ||
    item?.name ||
    "Product"
  );
};

const getItemImage = (item) => {
  return (
    item?.image ||
    item?.product?.image ||
    item?.product?.images?.[0] ||
    ""
  );
};

const getItemQuantity = (item) => {
  return item?.quantity || item?.qty || 1;
};

const getItemPrice = (item) => {
  return (
    item?.price ||
    item?.salePrice ||
    item?.unitPrice ||
    0
  );
};

const getAddress = (order) => {
  const address =
    order?.shippingAddress ||
    order?.billingAddress ||
    order?.address;

  if (!address) return null;

  if (typeof address === "string") {
    return address;
  }

  return [
    address.name,
    address.address,
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.state,
    address.pincode || address.zipCode,
    address.country,
    address.phone,
  ]
    .filter(Boolean)
    .join(", ");
};

const Orders = () => {
  const [data, setData] = useState({
    orders: [],
  });

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  useEffect(() => {
    if (!selectedOrder) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedOrder(null);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [selectedOrder]);

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

      setSelectedOrder((current) => {
        if (!current || current._id !== orderId) {
          return current;
        }

        return {
          ...current,
          status,
        };
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div className="loading-state">
        Loading orders...
      </div>
    );
  }

  const items = selectedOrder
    ? getOrderItems(selectedOrder)
    : [];

  const address = selectedOrder
    ? getAddress(selectedOrder)
    : null;

  const subtotal =
    selectedOrder?.subtotal ??
    selectedOrder?.subTotal ??
    selectedOrder?.itemsPrice ??
    0;

  const shipping =
    selectedOrder?.shippingFee ??
    selectedOrder?.shippingCost ??
    selectedOrder?.shippingAmount ??
    0;

  const discount =
    selectedOrder?.discount ??
    selectedOrder?.discountAmount ??
    0;

  const total =
    selectedOrder?.totalAmount ??
    selectedOrder?.total ??
    selectedOrder?.grandTotal ??
    0;

  return (
    <>
      <div className="orders-page">
        {error && (
          <div className="error-panel">
            <p>{error}</p>
          </div>
        )}

        <section className="panel table-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">
                FULFILMENT
              </span>

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
                  <th className="order-info-heading">
                    Info
                  </th>
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
                            ?.slice(-8)
                            .toUpperCase()}
                        </strong>
                      </td>

                      <td>
                        <div className="orders-page-customer-cell">
                          <strong>
                            {getCustomerName(order)}
                          </strong>

                          <small>
                            {getCustomerEmail(order)}
                          </small>
                        </div>
                      </td>

                      <td>
                        {formatCurrency(
                          order.totalAmount ||
                            order.total ||
                            order.grandTotal
                        )}
                      </td>

                      <td>
                        <span className="pill">
                          {order.paymentMethod ||
                            "COD"}
                        </span>
                      </td>

                      <td>
                        <select
                          className="status-select"
                          value={
                            order.status || "Pending"
                          }
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
                        {formatDate(order.createdAt)}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="order-info-button"
                          title="View complete order details"
                          onClick={() =>
                            setSelectedOrder(order)
                          }
                        >
                          <Info size={17} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">
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

      {selectedOrder && (
        <div
          className="order-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              closeModal();
            }
          }}
        >
          <div className="order-modal">
            <div className="order-modal-header">
              <div>
                <span className="eyebrow">
                  ORDER INFORMATION
                </span>

                <h2>
                  #
                  {selectedOrder._id
                    ?.slice(-8)
                    .toUpperCase()}
                </h2>

                <p>
                  Placed on{" "}
                  {formatDate(
                    selectedOrder.createdAt
                  )}
                </p>
              </div>

              <button
                type="button"
                className="order-modal-close"
                onClick={closeModal}
                aria-label="Close"
              >
                <X size={21} />
              </button>
            </div>

            <div className="order-modal-body">
              <div className="order-detail-grid">
                <div className="order-detail-card">
                  <div className="order-detail-card-title">
                    <User size={17} />
                    <span>Customer</span>
                  </div>

                  <div className="order-detail-content">
                    <strong>
                      {getCustomerName(
                        selectedOrder
                      )}
                    </strong>

                    <span>
                      {getCustomerEmail(
                        selectedOrder
                      )}
                    </span>

                    <span>
                      {getCustomerPhone(
                        selectedOrder
                      )}
                    </span>
                  </div>
                </div>

                <div className="order-detail-card">
                  <div className="order-detail-card-title">
                    <CreditCard size={17} />
                    <span>Payment</span>
                  </div>

                  <div className="order-detail-content">
                    <strong>
                      {selectedOrder.paymentMethod ||
                        "COD"}
                    </strong>

                    <span>
                      Payment Status:{" "}
                      {selectedOrder.paymentStatus ||
                        "—"}
                    </span>
                  </div>
                </div>

                <div className="order-detail-card">
                  <div className="order-detail-card-title">
                    <CalendarDays size={17} />
                    <span>Order Status</span>
                  </div>

                  <div className="order-detail-content">
                    <span
                      className={`order-status-badge ${String(
                        selectedOrder.status ||
                          "Pending"
                      )
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {selectedOrder.status ||
                        "Pending"}
                    </span>

                    {selectedOrder.updatedAt && (
                      <span>
                        Updated:{" "}
                        {formatDate(
                          selectedOrder.updatedAt
                        )}
                      </span>
                    )}
                  </div>
                </div>

                <div className="order-detail-card">
                  <div className="order-detail-card-title">
                    <MapPin size={17} />
                    <span>Shipping Address</span>
                  </div>

                  <div className="order-detail-content">
                    <span>
                      {address || "Address not available"}
                    </span>
                  </div>
                </div>
              </div>

              <section className="order-items-section">
                <div className="order-section-heading">
                  <div>
                    <span className="eyebrow">
                      PRODUCTS
                    </span>

                    <h3>
                      Ordered Items
                    </h3>
                  </div>

                  <span className="order-items-count">
                    {items.length} item
                    {items.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {items.length ? (
                  <div className="order-items-list">
                    {items.map((item, index) => {
                      const quantity =
                        getItemQuantity(item);

                      const price =
                        getItemPrice(item);

                      return (
                        <div
                          className="order-item-row"
                          key={
                            item._id ||
                            item.product?._id ||
                            index
                          }
                        >
                          <div className="order-item-image">
                            {getItemImage(item) ? (
                              <img
                                src={getItemImage(
                                  item
                                )}
                                alt={getItemName(item)}
                              />
                            ) : (
                              <Package size={22} />
                            )}
                          </div>

                          <div className="order-item-info">
                            <strong>
                              {getItemName(item)}
                            </strong>

                            <span>
                              Qty: {quantity}
                            </span>
                          </div>

                          <div className="order-item-price">
                            <span>
                              {formatCurrency(price)}
                            </span>

                            <strong>
                              {formatCurrency(
                                price * quantity
                              )}
                            </strong>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="order-no-items">
                    No item details available.
                  </div>
                )}
              </section>

              <section className="order-summary">
                <div className="order-summary-row">
                  <span>Subtotal</span>
                  <strong>
                    {formatCurrency(subtotal)}
                  </strong>
                </div>

                <div className="order-summary-row">
                  <span>Shipping</span>
                  <strong>
                    {formatCurrency(shipping)}
                  </strong>
                </div>

                <div className="order-summary-row">
                  <span>Discount</span>
                  <strong>
                    -{formatCurrency(discount)}
                  </strong>
                </div>

                <div className="order-summary-divider" />

                <div className="order-summary-row total">
                  <span>Total</span>
                  <strong>
                    {formatCurrency(total)}
                  </strong>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Orders;