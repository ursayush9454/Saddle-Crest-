const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Category = require("../models/Category");


// =========================================================
// DASHBOARD
// =========================================================

exports.dashboard = async (req, res) => {
  try {
    const [
      users,
      products,
      orders,
      categories,
      revenueAgg,
      pending,
      lowStock,
    ] = await Promise.all([
      User.countDocuments({
        role: "user",
      }),

      Product.countDocuments({
        isActive: true,
      }),

      Order.countDocuments(),

      Category.countDocuments({
        isActive: true,
      }),

      Order.aggregate([
        {
          $match: {
            status: {
              $ne: "Cancelled",
            },
          },
        },

        {
          $group: {
            _id: null,

            total: {
              $sum: "$totalAmount",
            },
          },
        },
      ]),

      Order.countDocuments({
        status: "Pending",
      }),

      Product.countDocuments({
        isActive: true,

        $expr: {
          $lte: [
            "$stock",
            "$lowStockThreshold",
          ],
        },
      }),
    ]);

    res.json({
      stats: {
        customers: users,

        products,

        orders,

        categories,

        revenue:
          revenueAgg[0]?.total || 0,

        pendingOrders: pending,

        lowStock,
      },
    });
  } catch (error) {
    console.error(
      "Dashboard error:",
      error
    );

    res.status(500).json({
      message:
        "Unable to load dashboard.",
    });
  }
};


// =========================================================
// PRODUCTS
// =========================================================

exports.products = async (req, res) => {
  try {
    const products =
      await Product.find({
        isActive: true,
      }).sort({
        createdAt: -1,
      });

    res.json({
      products,
    });
  } catch (error) {
    console.error(
      "Admin products error:",
      error
    );

    res.status(500).json({
      message:
        "Unable to load products.",
    });
  }
};


// =========================================================
// HIGHLY ORDERED PRODUCTS
// =========================================================

exports.highlyOrdered = async (
  req,
  res
) => {
  try {
    const products =
      await Order.aggregate([
        // =================================================
        // 1. CANCELLED ORDERS IGNORE
        // =================================================

        {
          $match: {
            status: {
              $ne: "Cancelled",
            },
          },
        },


        // =================================================
        // 2. ORDER ITEMS SEPARATE
        // =================================================

        {
          $unwind: "$items",
        },


        // =================================================
        // 3. PRODUCT-WISE SALES
        // =================================================

        {
          $group: {
            _id: "$items.product",

            productName: {
              $first:
                "$items.name",
            },

            image: {
              $first:
                "$items.image",
            },

            // Total units sold
            totalQuantitySold: {
              $sum:
                "$items.quantity",
            },

            // Number of orders
            totalOrders: {
              $sum: 1,
            },

            // Revenue
            totalRevenue: {
              $sum: {
                $multiply: [
                  "$items.price",
                  "$items.quantity",
                ],
              },
            },

            // Latest order date
            lastOrdered: {
              $max: "$createdAt",
            },
          },
        },


        // =================================================
        // 4. MOST ORDERED FIRST
        // =================================================

        {
          $sort: {
            totalQuantitySold: -1,

            totalOrders: -1,
          },
        },


        // =================================================
        // 5. TOP 20
        // =================================================

        {
          $limit: 20,
        },


        // =================================================
        // 6. CURRENT PRODUCT DATA
        // =================================================

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

            preserveNullAndEmptyArrays:
              true,
          },
        },


        // =================================================
        // 7. FINAL RESPONSE
        // =================================================

        {
          $project: {
            _id: 1,

            productName: 1,

            image: 1,

            totalQuantitySold: 1,

            totalOrders: 1,

            totalRevenue: 1,

            lastOrdered: 1,

            sku:
              "$product.sku",

            category:
              "$product.category",

            stock:
              "$product.stock",

            price:
              "$product.price",

            salePrice:
              "$product.salePrice",

            isActive:
              "$product.isActive",
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


// =========================================================
// CATEGORIES
// =========================================================

exports.categories = async (
  req,
  res
) => {
  try {
    res.json({
      categories:
        await Category.find().sort({
          createdAt: -1,
        }),
    });
  } catch (error) {
    console.error(
      "Admin categories error:",
      error
    );

    res.status(500).json({
      message:
        "Unable to load categories.",
    });
  }
};


// =========================================================
// ORDERS
// =========================================================

exports.orders = async (
  req,
  res
) => {
  try {
    const orders =
      await Order.find()
        .populate(
          "user",
          "name email phone"
        )
        .sort({
          createdAt: -1,
        });

    res.json({
      orders,
    });
  } catch (error) {
    console.error(
      "Admin orders error:",
      error
    );

    res.status(500).json({
      message:
        "Unable to load orders.",
    });
  }
};


// =========================================================
// CUSTOMERS
// =========================================================

exports.customers = async (
  req,
  res
) => {
  try {
    const customers =
      await User.find({
        role: "user",
      })
        .select("-password")
        .sort({
          createdAt: -1,
        });

    res.json({
      customers,
    });
  } catch (error) {
    console.error(
      "Admin customers error:",
      error
    );

    res.status(500).json({
      message:
        "Unable to load customers.",
    });
  }
};


// =========================================================
// UPDATE ORDER STATUS
// =========================================================

exports.updateOrder = async (
  req,
  res
) => {
  try {
    const allowed = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (
      !allowed.includes(
        req.body.status
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid order status",
      });
    }

    const o =
      await Order.findByIdAndUpdate(
        req.params.id,

        {
          status:
            req.body.status,
        },

        {
          new: true,
        }
      ).populate(
        "user",
        "name email"
      );

    if (!o) {
      return res.status(404).json({
        message:
          "Order not found",
      });
    }

    res.json({
      message:
        "Order status updated",

      order: o,
    });
  } catch (error) {
    console.error(
      "Update order error:",
      error
    );

    res.status(500).json({
      message:
        "Unable to update order.",
    });
  }
};


// =========================================================
// DELETE / DISABLE CUSTOMER
// =========================================================

exports.deleteCustomer = async (
  req,
  res
) => {
  try {
    const u =
      await User.findOneAndUpdate(
        {
          _id: req.params.id,

          role: "user",
        },

        {
          isActive: false,
        },

        {
          new: true,
        }
      ).select("-password");

    if (!u) {
      return res.status(404).json({
        message:
          "Customer not found",
      });
    }

    res.json({
      message:
        "Customer disabled",

      customer: u,
    });
  } catch (error) {
    console.error(
      "Delete customer error:",
      error
    );

    res.status(500).json({
      message:
        "Unable to disable customer.",
    });
  }
};