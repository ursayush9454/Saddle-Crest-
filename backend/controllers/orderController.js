const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");

// =========================
// HELPER: VALIDATE COUPON
// =========================

const calculateCouponDiscount = async ({
  code,
  cartTotal,
  userId,
}) => {
  if (!code?.trim()) {
    return {
      coupon: null,
      discount: 0,
    };
  }

  const normalizedCode = code.trim().toUpperCase();

  const coupon = await Coupon.findOne({
    code: normalizedCode,
  });

  if (!coupon) {
    throw new Error("Invalid coupon code");
  }

  // =========================
  // ACTIVE
  // =========================

  if (!coupon.active) {
    throw new Error("This coupon is currently inactive");
  }

  // =========================
  // DATE
  // =========================

  const now = new Date();

  if (coupon.startDate && now < coupon.startDate) {
    throw new Error("This coupon is not active yet");
  }

  if (coupon.expiryDate && now > coupon.expiryDate) {
    throw new Error("This coupon has expired");
  }

  // =========================
  // GLOBAL USAGE LIMIT
  // =========================

  if (
    coupon.usageLimit > 0 &&
    coupon.usedCount >= coupon.usageLimit
  ) {
    throw new Error(
      "This coupon usage limit has been reached"
    );
  }

  // =========================
  // MINIMUM ORDER
  // =========================

  if (cartTotal < coupon.minimumOrder) {
    throw new Error(
      `Minimum order value for this coupon is ₹${coupon.minimumOrder}`
    );
  }

  // =========================
  // PER USER LIMIT
  // =========================

  if (userId && coupon.perUserLimit > 0) {
    const userUsageCount = await Order.countDocuments({
      user: userId,
      couponCode: normalizedCode,
      status: {
        $ne: "Cancelled",
      },
    });

    if (userUsageCount >= coupon.perUserLimit) {
      throw new Error(
        "You have already used this coupon the maximum number of times"
      );
    }
  }

  // =========================
  // DISCOUNT
  // =========================

  let discount = 0;

  if (coupon.discountType === "percentage") {
    discount =
      (cartTotal * coupon.discountValue) / 100;
  } else {
    discount = coupon.discountValue;
  }

  // =========================
  // MAXIMUM DISCOUNT
  // =========================

  if (
    coupon.maximumDiscount > 0 &&
    discount > coupon.maximumDiscount
  ) {
    discount = coupon.maximumDiscount;
  }

  // Never discount more than subtotal
  discount = Math.min(discount, cartTotal);

  // Round
  discount =
    Math.round(
      (discount + Number.EPSILON) * 100
    ) / 100;

  return {
    coupon,
    discount,
  };
};

// =========================
// PLACE ORDER
// =========================

exports.place = async (req, res) => {
  try {
    const {
      shippingAddress,
      paymentMethod = "COD",

      // Coupon
      couponCode,

      // CUSTOMER CONSENT
      termsAccepted,
      privacyPolicyAccepted,
    } = req.body;

    // =========================
    // VALIDATE CONSENT
    // =========================

    if (termsAccepted !== true) {
      return res.status(400).json({
        message:
          "You must accept the Terms & Conditions.",
      });
    }

    if (privacyPolicyAccepted !== true) {
      return res.status(400).json({
        message:
          "You must accept the Privacy Policy.",
      });
    }

    // Backend creates timestamp
    const consentDate = new Date();

    // =========================
    // GET CART
    // =========================

    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart?.items?.length) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // =========================
    // CHECK PRODUCTS
    // + CALCULATE SUBTOTAL
    // BEFORE STOCK UPDATE
    // =========================

    let subtotal = 0;

    const availableProducts = [];

    for (const i of cart.items) {
      if (!i.product) {
        return res.status(400).json({
          message:
            "One of the products in your cart is no longer available. Please remove it from your cart and try again.",
        });
      }

      const product = await Product.findOne({
        _id: i.product._id,
        isActive: true,
      });

      if (!product) {
        return res.status(400).json({
          message: `Product ${
            i.product.name || "in your cart"
          } is no longer available`,
        });
      }

      // =========================
      // STOCK CHECK
      // =========================

      if (product.stock < i.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
      }

      // =========================
      // PRICE
      // =========================

      const price =
        product.salePrice ?? product.price;

      subtotal += price * i.quantity;

      availableProducts.push({
        cartItem: i,
        product,
        price,
      });
    }

    // =========================
    // SHIPPING
    // =========================

    const shipping =
      subtotal >= 10000 ? 0 : 450;

    // =========================
    // COUPON VALIDATION
    // =========================

    let coupon = null;
    let discount = 0;
    let normalizedCouponCode = null;

    if (couponCode?.trim()) {
      try {
        const result =
          await calculateCouponDiscount({
            code: couponCode,
            cartTotal: subtotal,
            userId: req.user._id,
          });

        coupon = result.coupon;
        discount = result.discount;

        normalizedCouponCode =
          coupon?.code || null;
      } catch (couponError) {
        return res.status(400).json({
          message:
            couponError.message ||
            "Invalid coupon",
        });
      }
    }

    // =========================
    // FINAL TOTAL
    // =========================

    const totalAmount = Math.max(
      0,
      subtotal + shipping - discount
    );

    // =========================
    // NOW DECREMENT STOCK
    // =========================

    const items = [];

    for (const item of availableProducts) {
      const updatedProduct =
        await Product.findOneAndUpdate(
          {
            _id: item.product._id,
            isActive: true,
            stock: {
              $gte: item.cartItem.quantity,
            },
          },
          {
            $inc: {
              stock: -item.cartItem.quantity,
            },
          },
          {
            returnDocument: "after",
          }
        );

      if (!updatedProduct) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.product.name}`,
        });
      }

      items.push({
        product: updatedProduct._id,
        name: updatedProduct.name,
        image: updatedProduct.image,
        quantity: item.cartItem.quantity,
        price: item.price,
      });
    }

    // =========================
    // CREATE ORDER
    // =========================

    const order = await Order.create({
      user: req.user._id,

      items,

      subtotal,

      shipping,

      discount,

      couponCode: normalizedCouponCode,

      totalAmount,

      shippingAddress,

      paymentMethod,

      // CONSENT
      termsAccepted: true,
      privacyPolicyAccepted: true,
      consentAcceptedAt: consentDate,
    });

    // =========================
    // INCREMENT COUPON USAGE
    // =========================

    if (coupon) {
      await Coupon.findByIdAndUpdate(
        coupon._id,
        {
          $inc: {
            usedCount: 1,
          },
        }
      );
    }

    // =========================
    // CLEAR CART
    // =========================

    cart.items = [];

    await cart.save();

    // =========================
    // RESPONSE
    // =========================

    return res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Place order error:",
      error
    );

    return res.status(500).json({
      message:
        error?.message ||
        "Unable to place order right now.",
    });
  }
};

// =========================
// MY ORDERS
// =========================

exports.mine = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json({
      orders,
    });
  } catch (error) {
    console.error(
      "Get orders error:",
      error
    );

    res.status(500).json({
      message:
        "Unable to fetch orders.",
    });
  }
};

// =========================
// SINGLE ORDER
// =========================

exports.one = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      order,
    });
  } catch (error) {
    console.error(
      "Get order error:",
      error
    );

    res.status(500).json({
      message:
        "Unable to fetch order.",
    });
  }
};

// =========================
// CANCEL ORDER
// =========================

exports.cancel = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // =========================
    // CHECK ORDER STATUS
    // =========================

    if (
      [
        "Delivered",
        "Shipped",
        "Cancelled",
      ].includes(order.status)
    ) {
      return res.status(400).json({
        message:
          "Order cannot be cancelled now",
      });
    }

    // =========================
    // RESTORE PRODUCT STOCK
    // =========================

    for (const item of order.items) {
      if (!item.product) {
        continue;
      }

      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: item.quantity,
          },
        }
      );
    }

    // =========================
    // RESTORE COUPON USAGE
    // =========================

    if (order.couponCode) {
      await Coupon.findOneAndUpdate(
        {
          code: order.couponCode,
          usedCount: {
            $gt: 0,
          },
        },
        {
          $inc: {
            usedCount: -1,
          },
        }
      );
    }

    // =========================
    // UPDATE ORDER
    // =========================

    order.status = "Cancelled";
    order.cancelledAt = new Date();

    await order.save();

    return res.json({
      message:
        "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Cancel order error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to cancel order.",
    });
  }
};

// =========================================================
// ADMIN: HIGHLY ORDERED PRODUCTS
// =========================================================

exports.highlyOrdered = async (req, res) => {
  try {
    const products = await Order.aggregate([
      // Cancelled orders should not count
      {
        $match: {
          status: {
            $ne: "Cancelled",
          },
        },
      },

      // Split order items
      {
        $unwind: "$items",
      },

      // Group by product
      {
        $group: {
          _id: "$items.product",

          productName: {
            $first: "$items.name",
          },

          image: {
            $first: "$items.image",
          },

          totalQuantitySold: {
            $sum: "$items.quantity",
          },

          totalOrders: {
            $sum: 1,
          },

          totalRevenue: {
            $sum: {
              $multiply: [
                "$items.price",
                "$items.quantity",
              ],
            },
          },

          lastOrdered: {
            $max: "$createdAt",
          },
        },
      },

      // Most ordered first
      {
        $sort: {
          totalQuantitySold: -1,
          totalOrders: -1,
        },
      },

      // Return top 20
      {
        $limit: 20,
      },

      // Get current product details
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },

      {
        $unwind: {
          path: "$product",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Final response
      {
        $project: {
          _id: 1,

          productName: 1,
          image: 1,

          totalQuantitySold: 1,
          totalOrders: 1,
          totalRevenue: 1,
          lastOrdered: 1,

          sku: "$product.sku",
          category: "$product.category",
          stock: "$product.stock",
          price: "$product.price",
          salePrice: "$product.salePrice",
          isActive: "$product.isActive",
        },
      },
    ]);

    return res.json({
      products,
    });
  } catch (error) {
    console.error(
      "Highly ordered products error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to fetch highly ordered products.",
    });
  }
};