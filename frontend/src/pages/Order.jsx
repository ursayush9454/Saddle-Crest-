import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Package,
  Truck,
  Check,
  Clock,
  X,
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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await apiRequest("/orders/my-orders");

        setOrders(
          data.orders ||
            data.data?.orders ||
            data.data ||
            []
        );
      } catch (err) {
        console.error("ORDERS ERROR:", err);
        setError(
          err.message || "Unable to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <Check size={16} />;

      case "Shipped":
        return <Truck size={16} />;

      case "Cancelled":
        return <X size={16} />;

      default:
        return <Clock size={16} />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "delivered";

      case "Shipped":
        return "shipped";

      case "Cancelled":
        return "cancelled";

      case "Processing":
        return "processing";

      default:
        return "pending";
    }
  };

  if (loading) {
    return (
      <main className="orders-page">
        <Navbar />

        <div className="orders-loading">
          <div className="orders-loader"></div>
          <p>Loading your orders...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="orders-page">
    <Navbar navbarBackground={'#000'} top="0"/>

      <section className="orders-header">
        <Link to="/" className="orders-back">
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <span>YOUR JOURNEY</span>

        <h1>
          My
          <em>Orders.</em>
        </h1>

        <p>
          Every order, every piece, and every journey
          with Saddle & Crest.
        </p>
      </section>

      <section className="orders-container">

        {error && (
          <div className="orders-error">
            {error}

            <button
              onClick={() => window.location.reload()}
            >
              TRY AGAIN
            </button>
          </div>
        )}

        {!error && orders.length === 0 && (
          <div className="orders-empty">
            <div className="orders-empty-icon">
              <Package size={32} />
            </div>

            <span>NO ORDERS YET</span>

            <h2>
              Your first journey
              <em>starts here.</em>
            </h2>

            <p>
              You haven't placed an order yet.
              Explore our collection and find something
              made for your next ride.
            </p>

            <Link to="/shop">
              EXPLORE COLLECTION
            </Link>
          </div>
        )}

        {!error && orders.length > 0 && (
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
              </Link>
            </div>

            {orders.map((order) => {
              const orderId =
                order._id || order.id;

              const status =
                order.status || "Pending";

              const orderItems =
                order.items || [];

              const date = order.createdAt
                ? new Date(
                    order.createdAt
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )
                : "—";

              return (
                <article
                  className="order-card"
                  key={orderId}
                >

                  {/* HEADER */}

                  <div className="order-card-header">

                    <div>
                      <span>ORDER</span>

                      <strong>
                        #{orderId}
                      </strong>
                    </div>

                    <div>
                      <span>PLACED ON</span>

                      <strong>
                        {date}
                      </strong>
                    </div>

                    <div
                      className={`order-status ${getStatusClass(
                        status
                      )}`}
                    >
                      {getStatusIcon(status)}
                      {status}
                    </div>

                  </div>

                  {/* PRODUCTS */}

                  <div className="order-products">

                    {orderItems.map(
                      (item, index) => {
                        const product =
                          item.product || {};

                        const image =
                          product.image ||
                          product.images?.[0] ||
                          item.image ||
                          "";

                        const name =
                          product.name ||
                          item.name ||
                          "Product";

                        const price =
                          Number(
                            item.price ||
                              product.salePrice ||
                              product.price ||
                              0
                          );

                        return (
                          <div
                            className="order-product"
                            key={
                              item._id ||
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
                                {item.quantity || 1}
                              </span>
                            </div>

                            <div className="order-product-info">
                              <strong>
                                {name}
                              </strong>

                              <span>
                                Quantity:{" "}
                                {item.quantity ||
                                  1}
                              </span>
                            </div>

                            <strong className="order-product-price">
                              ₹
                              {(
                                price *
                                Number(
                                  item.quantity ||
                                    1
                                )
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </strong>

                          </div>
                        );
                      }
                    )}

                  </div>

                  {/* FOOTER */}

                  <div className="order-card-footer">

                    <div>
                      <span>
                        PAYMENT
                      </span>

                      <strong>
                        {order.paymentMethod ||
                          "COD"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        TOTAL
                      </span>

                      <strong>
                        ₹
                        {Number(
                          order.totalAmount ||
                            order.total ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>
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