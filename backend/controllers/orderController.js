const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.place = async (req, res) => {
  try {
    const {
      shippingAddress,
      paymentMethod = "COD",

      // =========================
      // CUSTOMER CONSENT
      // =========================
      termsAccepted,
      privacyPolicyAccepted,
      consentAcceptedAt,
    } = req.body;

    // =========================
    // VALIDATE CONSENT
    // =========================

    if (termsAccepted !== true) {
      return res.status(400).json({
        message: "You must accept the Terms & Conditions.",
      });
    }

    if (privacyPolicyAccepted !== true) {
      return res.status(400).json({
        message: "You must accept the Privacy Policy.",
      });
    }

    // Backend should create the timestamp itself.
    // Do not trust the timestamp sent by frontend.
    const consentDate = new Date();

    // =========================
    // GET CART
    // =========================

    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart?.items.length) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // =========================
    // CREATE ORDER ITEMS
    // =========================

    const items = [];
    let subtotal = 0;

    for (const i of cart.items) {
      const p = await Product.findOneAndUpdate(
        {
          _id: i.product._id,
          isActive: true,
          stock: {
            $gte: i.quantity,
          },
        },
        {
          $inc: {
            stock: -i.quantity,
          },
        },
        {
          new: true,
        }
      );

      if (!p) {
        return res.status(400).json({
          message: `Insufficient stock for ${i.product.name}`,
        });
      }

      const price = p.salePrice ?? p.price;

      items.push({
        product: p._id,
        name: p.name,
        image: p.image,
        quantity: i.quantity,
        price,
      });

      subtotal += price * i.quantity;
    }

    // =========================
    // SHIPPING
    // =========================

    const shipping = subtotal >= 10000 ? 0 : 450;

    // =========================
    // CREATE ORDER
    // =========================

    const order = await Order.create({
      user: req.user._id,

      items,

      subtotal,

      shipping,

      totalAmount: subtotal + shipping,

      shippingAddress,

      paymentMethod,

      // =========================
      // CONSENT RECORD
      // =========================

      termsAccepted: true,
      privacyPolicyAccepted: true,
      consentAcceptedAt: consentDate,
    });

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
    console.error("Place order error:", error);

    return res.status(500).json({
      message: "Unable to place order right now.",
    });
  }
};

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
    console.error("Get orders error:", error);

    res.status(500).json({
      message: "Unable to fetch orders.",
    });
  }
};

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
    console.error("Get order error:", error);

    res.status(500).json({
      message: "Unable to fetch order.",
    });
  }
};

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

    if (
      ["Delivered", "Shipped", "Cancelled"].includes(
        order.status
      )
    ) {
      return res.status(400).json({
        message: "Order cannot be cancelled now",
      });
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: item.quantity,
          },
        }
      );
    }

    order.status = "Cancelled";
    order.cancelledAt = new Date();

    await order.save();

    res.json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);

    res.status(500).json({
      message: "Unable to cancel order.",
    });
  }
};