
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Package,
  Truck,
  Check,
  Clock,
  X,
  Eye,
  RefreshCw,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { apiRequest } from "../services/api";
import "./Orders.css";
import Navbar from "../components/Navbar";

const Orders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/orders/my-orders");

      setOrders(
        data?.orders ||
          data?.data?.orders ||
          data?.data ||
          []
      );
    } catch (err) {
      console.error("ORDERS ERROR:", err);

      setError(
        err?.message || "Unable to load your orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <Check size={15} />;

      case "Shipped":
        return <Truck size={15} />;

      case "Cancelled":
        return <X size={15} />;

      case "Processing":
        return <Package size={15} />;

      default:
        return <Clock size={15} />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "delivered";

      case "Shipped":
        return "shipped";

      case "Processing":
        return "processing";

      case "Cancelled":
        return "cancelled";

      default:
        return "pending";
    }
  };

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

  const formatPrice = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN");
  };

  const getOrderTotal = (order) => {
    return Number(
      order?.totalAmount ??
        order?.total ??
        0
    );
  };

  const getItemImage = (item) => {
    return (
      item?.product?.image ||
      item?.product?.images?.[0] ||
      item?.image ||
      ""
    );
  };

  const getItemName = (item) => {
    return (
      item?.product?.name ||
      item?.name ||
      "Product"
    );
  };

  const handleCancelOrder = async (order) => {
    const orderId = order?._id || order?.id;

    if (!orderId) return;

    const status = order?.status || "Pending";

    if (
      ["Delivered", "Shipped", "Cancelled"].includes(
        status
      )
    ) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setCancellingId(orderId);

      await apiRequest(
        `/orders/cancel/${orderId}`,
        {
          method: "PUT",
        }
      );

      await fetchOrders();
    } catch (err) {
      console.error("CANCEL ORDER ERROR:", err);

      window.alert(
        err?.message ||
          "Unable to cancel this order."
      );
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <main className="orders-page">
        <Navbar
          navbarBackground="#000"
          top="0"
        />

        <section className="orders-loading">
          <div className="orders-loader"></div>

          <span>YOUR JOURNEY</span>

          <p>Loading your orders...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <Navbar
        navbarBackground="#000"
        top="0"
      />

      {/* HEADER */}

      <section className="orders-header">
        <div className="orders-header-inner">

          <Link
            to="/"
            className="orders-back"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="orders-heading">
            <span>YOUR JOURNEY</span>

            <h1>
              My <em>Orders.</em>
            </h1>

            <p>
              Every order, every piece, and every
              journey with Saddle & Crest.
            </p>
          </div>

        </div>
      </section>

      {/* CONTENT */}

      <section className="orders-container">

        {/* ERROR */}

        {error && (
          <div className="orders-error">

            <div>
              <strong>
                Something went wrong
              </strong>

              <p>{error}</p>
            </div>

            <button
              onClick={fetchOrders}
            >
              <RefreshCw size={15} />
              TRY AGAIN
            </button>

          </div>
        )}

        {/* EMPTY */}

        {!error &&
          orders.length === 0 && (
            <div className="orders-empty">

              <div className="orders-empty-icon">
                <Package size={30} />
              </div>

              <span>NO ORDERS YET</span>

              <h2>
                Your first journey
                <em>starts here.</em>
              </h2>

              <p>
                You haven't placed an order yet.
                Explore our collection and find
                something made for your next ride.
              </p>

              <Link to="/shop">
                EXPLORE COLLECTION
                <ArrowRight size={16} />
              </Link>

            </div>
          )}

        {/* ORDERS */}

        {!error &&
          orders.length > 0 && (
            <div className="orders-list">

              <div className="orders-list-top">

                <div>
                  <span>ORDER HISTORY</span>

                  <h2>
                    {orders.length}{" "}
                    {orders.length === 1
                      ? "Order"
                      : "Orders"}
                  </h2>
                </div>

                <Link to="/shop">
                  CONTINUE SHOPPING
                  <ArrowRight size={15} />
                </Link>

              </div>

              {orders.map((order) => {
                const orderId =
                  order?._id ||
                  order?.id;

                const status =
                  order?.status ||
                  "Pending";

                const orderItems =
                  order?.items || [];

                const total =
                  getOrderTotal(order);

                return (
                  <article
                    className="order-card"
                    key={orderId}
                  >

                    {/* CARD HEADER */}

                    <div className="order-card-header">

                      <div className="order-number">
                        <span>ORDER</span>

                        <strong>
                          #{String(
                            orderId || ""
                          ).slice(-10)}
                        </strong>
                      </div>

                      <div className="order-date">
                        <span>PLACED ON</span>

                        <strong>
                          {formatDate(
                            order?.createdAt
                          )}
                        </strong>
                      </div>

                      <div
                        className={`order-status ${getStatusClass(
                          status
                        )}`}
                      >
                        {getStatusIcon(status)}

                        <span>
                          {status}
                        </span>
                      </div>

                    </div>

                    {/* PRODUCTS */}

                    <div className="order-products">

                      {orderItems
                        .slice(0, 3)
                        .map(
                          (
                            item,
                            index
                          ) => {
                            const image =
                              getItemImage(
                                item
                              );

                            const name =
                              getItemName(
                                item
                              );

                            const quantity =
                              Number(
                                item?.quantity ||
                                  1
                              );

                            const price =
                              Number(
                                item?.price ||
                                  item?.product
                                    ?.salePrice ||
                                  item?.product
                                    ?.price ||
                                  0
                              );

                            return (
                              <div
                                className="order-product"
                                key={
                                  item?._id ||
                                  `${orderId}-${index}`
                                }
                              >

                                <div className="order-product-image">

                                  {image ? (
                                    <img
                                      src={image}
                                      alt={name}
                                    />
                                  ) : (
                                    <Package
                                      size={20}
                                    />
                                  )}

                                  <span>
                                    {quantity}
                                  </span>

                                </div>

                                <div className="order-product-info">

                                  <strong>
                                    {name}
                                  </strong>

                                  <span>
                                    Qty:{" "}
                                    {quantity}
                                  </span>

                                </div>

                                <strong className="order-product-price">
                                  ₹
                                  {formatPrice(
                                    price *
                                      quantity
                                  )}
                                </strong>

                              </div>
                            );
                          }
                        )}

                    </div>

                    {orderItems.length > 3 && (
                      <button
                        className="more-items-btn"
                        onClick={() =>
                          navigate(
                            `/orders/${orderId}`
                          )
                        }
                      >
                        +{" "}
                        {orderItems.length -
                          3}{" "}
                        more items
                      </button>
                    )}

                    {/* FOOTER */}

                    <div className="order-card-footer">

                      <div className="order-payment">
                        <span>
                          PAYMENT
                        </span>

                        <strong>
                          {order?.paymentMethod ||
                            "COD"}
                        </strong>

                        <small>
                          {order?.paymentStatus ||
                            "Pending"}
                        </small>
                      </div>

                      <div className="order-total">
                        <span>
                          TOTAL
                        </span>

                        <strong>
                          ₹
                          {formatPrice(
                            total
                          )}
                        </strong>
                      </div>

                      <div className="order-actions">

                        <button
                          className="view-order-btn"
                          onClick={() =>
                            navigate(
                              `/orders/${orderId}`
                            )
                          }
                        >
                          VIEW DETAILS
                          <Eye size={15} />
                        </button>

                        {![
                          "Delivered",
                          "Shipped",
                          "Cancelled",
                        ].includes(status) && (
                          <button
                            className="cancel-order-btn"
                            disabled={
                              cancellingId ===
                              orderId
                            }
                            onClick={() =>
                              handleCancelOrder(
                                order
                              )
                            }
                          >
                            {cancellingId ===
                            orderId
                              ? "CANCELLING..."
                              : "CANCEL ORDER"}
                          </button>
                        )}

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>
          )}

      </section>
    </main>
  );
};

export default Orders;

