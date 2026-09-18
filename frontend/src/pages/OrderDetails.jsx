
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { apiRequest } from "../services/api";
import "./OrderDetails.css";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest(`/orders/${id}`);

        setOrder(data?.order || null);
      } catch (err) {
        console.error("ORDER DETAILS ERROR:", err);
        setError(err?.message || "Unable to load order details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadOrder();
    }
  }, [id]);

  const formatPrice = (price) => {
    return `₹${Number(price || 0).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="order-details-page">
          <div className="order-details-loading">
            <div className="loader"></div>
            <p>Loading order...</p>
          </div>
        </main>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Navbar />

        <main className="order-details-page">
          <div className="order-error">
            <XCircle size={42} />

            <h2>Order Not Found</h2>

            <p>{error || "We couldn't find this order."}</p>

            <button onClick={() => navigate("/orders")}>
              <ArrowLeft size={17} />
              Back to Orders
            </button>
          </div>
        </main>
      </>
    );
  }

  const address = order.shippingAddress || {};

  return (
    <>
      <Navbar />

      <main className="order-details-page">
        <div className="order-details-container">

          {/* HEADER */}
          <div className="order-header">

            <button
              className="back-btn"
              onClick={() => navigate("/orders")}
            >
              <ArrowLeft size={17} />
              Orders
            </button>

            <div className="order-title">

              <div>
                <span>ORDER DETAILS</span>

                <h1>
                  #{order._id?.slice(-8).toUpperCase()}
                </h1>
              </div>

              <div
                className={`order-status status-${order.status?.toLowerCase()}`}
              >
                {order.status === "Delivered" ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <Package size={16} />
                )}

                {order.status}
              </div>

            </div>

            <div className="order-meta">
              <span>
                Placed on {formatDate(order.createdAt)}
              </span>

              <span>•</span>

              <span>
                {order.items?.length || 0} items
              </span>
            </div>

          </div>

          {/* MAIN CONTENT */}
          <div className="order-main-grid">

            {/* PRODUCTS */}
            <section className="order-products card">

              <div className="card-heading">

                <div>
                  <span className="eyebrow">
                    YOUR PURCHASE
                  </span>

                  <h2>Items Ordered</h2>
                </div>

                <Package size={21} />

              </div>

              <div className="products-list">

                {order.items?.map((item, index) => (
                  <div
                    className="order-product"
                    key={item._id || index}
                  >

                    <div className="product-image">

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                        />
                      ) : (
                        <Package size={25} />
                      )}

                    </div>

                    <div className="product-info">

                      <h3>{item.name}</h3>

                      <div className="product-meta">
                        <span>
                          Qty: {item.quantity}
                        </span>

                        <span>×</span>

                        <span>
                          {formatPrice(item.price)}
                        </span>
                      </div>

                    </div>

                    <strong>
                      {formatPrice(
                        item.price * item.quantity
                      )}
                    </strong>

                  </div>
                ))}

              </div>

            </section>

            {/* SIDEBAR */}
            <aside className="order-sidebar">

              {/* SUMMARY */}
              <section className="card summary-card">

                <div className="card-heading">

                  <div>
                    <span className="eyebrow">
                      PAYMENT
                    </span>

                    <h2>Order Summary</h2>
                  </div>

                  <CreditCard size={20} />

                </div>

                <div className="summary-lines">

                  <div>
                    <span>Subtotal</span>
                    <strong>
                      {formatPrice(order.subtotal)}
                    </strong>
                  </div>

                  <div>
                    <span>Shipping</span>

                    <strong>
                      {order.shipping === 0
                        ? "FREE"
                        : formatPrice(order.shipping)}
                    </strong>
                  </div>

                  {order.discount > 0 && (
                    <div>
                      <span>Discount</span>

                      <strong>
                        -{formatPrice(order.discount)}
                      </strong>
                    </div>
                  )}

                </div>

                <div className="total-row">
                  <span>Total</span>

                  <strong>
                    {formatPrice(order.totalAmount)}
                  </strong>
                </div>

                <div className="payment-method">

                  <CreditCard size={16} />

                  <div>
                    <small>
                      Payment Method
                    </small>

                    <strong>
                      {order.paymentMethod || "COD"}
                    </strong>
                  </div>

                </div>

              </section>

              {/* ADDRESS */}
              <section className="card shipping-card">

                <div className="card-heading">

                  <div>
                    <span className="eyebrow">
                      DELIVERY
                    </span>

                    <h2>Shipping Address</h2>
                  </div>

                  <MapPin size={20} />

                </div>

                <div className="address">

                  <strong>
                    {address.fullName || "-"}
                  </strong>

                  <p>
                    {address.addressLine1 || ""}

                    {address.addressLine2
                      ? `, ${address.addressLine2}`
                      : ""}
                  </p>

                  <p>
                    {address.city || ""},{" "}
                    {address.state || ""}{" "}
                    {address.pincode || ""}
                  </p>

                  <p>
                    {address.country || "India"}
                  </p>

                  {address.phone && (
                    <span className="phone">
                      {address.phone}
                    </span>
                  )}

                </div>

              </section>

            </aside>

          </div>

          {/* DELIVERY BAR */}
          <div className="delivery-bar">

            <div className="delivery-icon">
              <Truck size={20} />
            </div>

            <div>

              <strong>
                {order.status === "Delivered"
                  ? "Your order has been delivered"
                  : order.status === "Shipped"
                  ? "Your order is on the way"
                  : "Your order is being processed"}
              </strong>

              <span>
                We'll keep you updated about your order status.
              </span>

            </div>

            <button
              onClick={() => navigate("/orders")}
            >
              View All Orders
            </button>

          </div>

        </div>
      </main>
    </>
  );
};

export default OrderDetails;

