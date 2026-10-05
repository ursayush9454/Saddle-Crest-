import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useShop } from "../ShopContext/ShopContext";

import "./Cart.css";
import Navbar from "../components/Navbar";

const Cart = () => {
  const navigate = useNavigate();

  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    cartSubtotal,
  } = useShop();

  const shipping =
    cartSubtotal >= 10000 ||
    cartSubtotal === 0
      ? 0
      : 450;

  const total =
    cartSubtotal + shipping;

  const handleCheckout = () => {
    if (!cart || cart.length === 0) {
      return;
    }

    navigate("/checkout");
  };

  /* ========================================
     PRICE HELPERS
  ======================================== */

  const getRegularPrice = (
    item
  ) => {
    return Number(
      item.price ??
        item.product?.price ??
        0
    );
  };

  const getSalePrice = (
    item
  ) => {
    const salePrice = Number(
      item.salePrice ??
        item.product?.salePrice
    );

    const regularPrice =
      getRegularPrice(item);

    if (
      Number.isFinite(salePrice) &&
      salePrice > 0 &&
      salePrice < regularPrice
    ) {
      return salePrice;
    }

    return null;
  };

  const getEffectivePrice = (
    item
  ) => {
    const salePrice =
      getSalePrice(item);

    return (
      salePrice ??
      getRegularPrice(item)
    );
  };

  const getDiscountPercentage = (
    item
  ) => {
    const regularPrice =
      getRegularPrice(item);

    const salePrice =
      getSalePrice(item);

    if (
      !regularPrice ||
      salePrice === null
    ) {
      return 0;
    }

    return Math.round(
      ((regularPrice - salePrice) /
        regularPrice) *
        100
    );
  };

  return (
    <main className="cart-page">
      <Navbar
        navbarBackground="#000"
        top="0"
      />

      {/* EMPTY CART */}

      {!cart ||
      cart.length === 0 ? (
        <section className="cart-empty-section">
          <div className="cart-empty-icon">
            <ShoppingBag
              size={30}
              strokeWidth={1.2}
            />
          </div>

          <span>
            YOUR CART IS EMPTY
          </span>

          <h2>
            Your journey
            <em>starts here.</em>
          </h2>

          <p>
            Explore handcrafted
            saddlery, riding essentials
            and timeless leather goods
            made for the modern
            equestrian.
          </p>

          <Link
            to="/shop"
            className="cart-shop-btn"
          >
            EXPLORE THE COLLECTION

            <ArrowRight size={17} />
          </Link>
        </section>
      ) : (
        <section className="cart-content">
          {/* CART */}

          <div className="cart-main">
            <div className="cart-heading">
              <div>
                <span>
                  YOUR SELECTION
                </span>

                <h2>
                  {cart.length}{" "}
                  {cart.length === 1
                    ? "Piece"
                    : "Pieces"}
                </h2>
              </div>

              <Link to="/shop">
                <ArrowLeft size={15} />
                Continue Shopping
              </Link>
            </div>

            <div className="cart-items">
              {cart.map((item) => {
                const productId =
                  item.productId ||
                  item.product?._id ||
                  item.product?.id ||
                  item._id ||
                  item.id;

                const itemImage =
                  item.image ||
                  item.product?.image ||
                  item.product?.images?.[0] ||
                  "";

                const regularPrice =
                  getRegularPrice(item);

                const salePrice =
                  getSalePrice(item);

                const itemPrice =
                  getEffectivePrice(
                    item
                  );

                const discountPercentage =
                  getDiscountPercentage(
                    item
                  );

                const itemStock =
                  Number(
                    item.stock ||
                      item.product
                        ?.stock ||
                      999
                  );

                const quantity =
                  Number(
                    item.quantity || 1
                  );

                const itemTotal =
                  itemPrice *
                  quantity;

                return (
                  <article
                    className="cart-item"
                    key={productId}
                  >
                    {/* IMAGE */}

                    <Link
                      to={`/product/${productId}`}
                      className="cart-item-image"
                    >
                      {itemImage ? (
                        <img
                          src={itemImage}
                          alt={
                            item.name ||
                            "Product"
                          }
                        />
                      ) : (
                        <div className="cart-no-image">
                          <ShoppingBag
                            size={25}
                          />
                        </div>
                      )}
                    </Link>

                    {/* INFO */}

                    <div className="cart-item-info">
                      <span>
                        {item.category ||
                          item.product
                            ?.category ||
                          "Saddle & Crest"}
                      </span>

                      <h3>
                        {item.name ||
                          item.product
                            ?.name ||
                          "Product"}
                      </h3>

                      <p>
                        Handcrafted with
                        attention to detail,
                        designed for a lifetime
                        of riding.
                      </p>

                      <button
                        type="button"
                        className="cart-remove"
                        onClick={() =>
                          removeFromCart(
                            productId
                          )
                        }
                      >
                        <Trash2 size={14} />
                        REMOVE
                      </button>
                    </div>

                    {/* PRICE */}

                    <div className="cart-item-price">
                      <div
                        style={{
                          display: "flex",
                          flexDirection:
                            "column",
                          alignItems:
                            "flex-end",
                          gap: "10px",
                        }}
                      >
                        <strong>
                          ₹
                          {itemPrice.toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                        {salePrice !==
                          null && (
                          <>
                            <span
                              style={{
                                textDecoration:
                                  "line-through",
                                opacity: 0.55,
                                fontSize:
                                  "12px",
                              }}
                            >
                              ₹
                              {regularPrice.toLocaleString(
                                "en-IN"
                              )}
                            </span>

                            <small
                              style={{
                                fontSize:
                                  "10px",
                                fontWeight: 700,
                                letterSpacing:
                                  "0.05em",
                              }}
                            >
                              {
                                discountPercentage
                              }
                              % OFF
                            </small>
                          </>
                        )}
                      </div>
                    </div>

                    {/* QUANTITY */}

                    <div className="cart-quantity">
                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(
                            productId
                          )
                        }
                        disabled={
                          quantity <= 1
                        }
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>

                      <span>
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          if (
                            quantity <
                            itemStock
                          ) {
                            increaseQuantity(
                              productId
                            );
                          }
                        }}
                        disabled={
                          quantity >=
                          itemStock
                        }
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* TOTAL */}

                    <div className="cart-item-total">
                      ₹
                      {itemTotal.toLocaleString(
                        "en-IN"
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* SUMMARY */}

          <aside className="cart-summary">
            <div className="cart-summary-top">
              <span>
                ORDER SUMMARY
              </span>

              <h2>
                Your Order
              </h2>
            </div>

            <div className="cart-summary-lines">
              <div>
                <span>
                  Subtotal
                </span>

                <strong>
                  ₹
                  {cartSubtotal.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Shipping
                </span>

                <strong>
                  {shipping === 0
                    ? "Complimentary"
                    : `₹${shipping.toLocaleString(
                        "en-IN"
                      )}`}
                </strong>
              </div>
            </div>

            <div className="cart-summary-total">
              <span>
                Total
              </span>

              <strong>
                ₹
                {total.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

            <button
              type="button"
              className="cart-checkout"
              onClick={
                handleCheckout
              }
            >
              <span>
                PROCEED TO CHECKOUT
              </span>

              <ArrowRight size={17} />
            </button>

            <div className="cart-note">
              <span>✦</span>

              Complimentary shipping on
              orders above ₹10,000
            </div>

            <div className="cart-trust">
              <div>
                <strong>
                  01
                </strong>

                <span>
                  SECURE PAYMENT
                </span>
              </div>

              <div>
                <strong>
                  02
                </strong>

                <span>
                  HANDCRAFTED GOODS
                </span>
              </div>

              <div>
                <strong>
                  03
                </strong>

                <span>
                  CONCIERGE SUPPORT
                </span>
              </div>
            </div>
          </aside>
        </section>
      )}
    </main>
  );
};

export default Cart;