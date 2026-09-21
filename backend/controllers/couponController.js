const Coupon = require("../models/Coupon");
const Order = require("../models/Order");

// =====================================================
// LIST COUPONS - ADMIN
// =====================================================

exports.list = async (req, res) => {
  try {
    const coupons = await Coupon.find({})
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      coupons,
    });
  } catch (error) {
    console.error("List coupons error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch coupons",
    });
  }
};

// =====================================================
// GET SINGLE COUPON - ADMIN
// =====================================================

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    return res.json({
      success: true,
      coupon,
    });
  } catch (error) {
    console.error("Get coupon error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch coupon",
    });
  }
};

// =====================================================
// CREATE COUPON - ADMIN
// =====================================================

exports.create = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minimumOrder,
      maximumDiscount,
      startDate,
      expiryDate,
      usageLimit,
      perUserLimit,
      active,
    } = req.body;

    // -------------------------
    // BASIC VALIDATION
    // -------------------------

    if (!code?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
    }

    if (!["percentage", "fixed"].includes(discountType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid discount type",
      });
    }

    const parsedDiscountValue = Number(discountValue);

    if (
      !Number.isFinite(parsedDiscountValue) ||
      parsedDiscountValue < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid discount value",
      });
    }

    if (
      discountType === "percentage" &&
      parsedDiscountValue > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Percentage discount cannot exceed 100%",
      });
    }

    const parsedMinimumOrder =
      minimumOrder === undefined ||
      minimumOrder === null ||
      minimumOrder === ""
        ? 0
        : Number(minimumOrder);

    const parsedMaximumDiscount =
      maximumDiscount === undefined ||
      maximumDiscount === null ||
      maximumDiscount === ""
        ? 0
        : Number(maximumDiscount);

    const parsedUsageLimit =
      usageLimit === undefined ||
      usageLimit === null ||
      usageLimit === ""
        ? 0
        : Number(usageLimit);

    const parsedPerUserLimit =
      perUserLimit === undefined ||
      perUserLimit === null ||
      perUserLimit === ""
        ? 1
        : Number(perUserLimit);

    if (
      !Number.isFinite(parsedMinimumOrder) ||
      parsedMinimumOrder < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid minimum order value",
      });
    }

    if (
      !Number.isFinite(parsedMaximumDiscount) ||
      parsedMaximumDiscount < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid maximum discount",
      });
    }

    if (
      !Number.isFinite(parsedUsageLimit) ||
      parsedUsageLimit < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid usage limit",
      });
    }

    if (
      !Number.isFinite(parsedPerUserLimit) ||
      parsedPerUserLimit < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Per-user limit must be at least 1",
      });
    }

    // -------------------------
    // NORMALIZE CODE
    // -------------------------

    const normalizedCode = code.trim().toUpperCase();

    // -------------------------
    // CHECK DUPLICATE
    // -------------------------

    const existingCoupon = await Coupon.findOne({
      code: normalizedCode,
    });

    if (existingCoupon) {
      return res.status(409).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    // -------------------------
    // DATE VALIDATION
    // -------------------------

    let parsedStartDate = null;
    let parsedExpiryDate = null;

    if (startDate) {
      parsedStartDate = new Date(startDate);

      if (Number.isNaN(parsedStartDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid start date",
        });
      }
    }

    if (expiryDate) {
      parsedExpiryDate = new Date(expiryDate);

      if (Number.isNaN(parsedExpiryDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid expiry date",
        });
      }
    }

    if (
      parsedStartDate &&
      parsedExpiryDate &&
      parsedExpiryDate < parsedStartDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Expiry date cannot be before start date",
      });
    }

    // -------------------------
    // CREATE
    // -------------------------

    const coupon = await Coupon.create({
      code: normalizedCode,
      discountType,
      discountValue: parsedDiscountValue,
      minimumOrder: parsedMinimumOrder,
      maximumDiscount: parsedMaximumDiscount,
      startDate: parsedStartDate,
      expiryDate: parsedExpiryDate,
      usageLimit: parsedUsageLimit,
      perUserLimit: parsedPerUserLimit,
      active: active !== false,
      usedCount: 0,
    });

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    console.error("Create coupon error:", error);

    // Mongo duplicate key
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create coupon",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE COUPON - ADMIN
// =====================================================

exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    const {
      code,
      discountType,
      discountValue,
      minimumOrder,
      maximumDiscount,
      startDate,
      expiryDate,
      usageLimit,
      perUserLimit,
      active,
    } = req.body;

    // -------------------------
    // CODE
    // -------------------------

    if (code !== undefined) {
      if (!String(code).trim()) {
        return res.status(400).json({
          success: false,
          message: "Coupon code is required",
        });
      }

      coupon.code = String(code).trim().toUpperCase();
    }

    // -------------------------
    // DISCOUNT TYPE
    // -------------------------

    if (discountType !== undefined) {
      if (!["percentage", "fixed"].includes(discountType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid discount type",
        });
      }

      coupon.discountType = discountType;
    }

    // -------------------------
    // DISCOUNT VALUE
    // -------------------------

    if (discountValue !== undefined) {
      const value = Number(discountValue);

      if (!Number.isFinite(value) || value < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid discount value",
        });
      }

      coupon.discountValue = value;
    }

    if (
      coupon.discountType === "percentage" &&
      coupon.discountValue > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Percentage discount cannot exceed 100%",
      });
    }

    // -------------------------
    // MINIMUM ORDER
    // -------------------------

    if (minimumOrder !== undefined) {
      const value = Number(minimumOrder);

      if (!Number.isFinite(value) || value < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid minimum order value",
        });
      }

      coupon.minimumOrder = value;
    }

    // -------------------------
    // MAXIMUM DISCOUNT
    // -------------------------

    if (maximumDiscount !== undefined) {
      const value = Number(maximumDiscount);

      if (!Number.isFinite(value) || value < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid maximum discount",
        });
      }

      coupon.maximumDiscount = value;
    }

    // -------------------------
    // USAGE LIMIT
    // -------------------------

    if (usageLimit !== undefined) {
      const value = Number(usageLimit);

      if (!Number.isFinite(value) || value < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid usage limit",
        });
      }

      coupon.usageLimit = value;
    }

    // -------------------------
    // PER USER LIMIT
    // -------------------------

    if (perUserLimit !== undefined) {
      const value = Number(perUserLimit);

      if (!Number.isFinite(value) || value < 1) {
        return res.status(400).json({
          success: false,
          message: "Per-user limit must be at least 1",
        });
      }

      coupon.perUserLimit = value;
    }

    // -------------------------
    // START DATE
    // -------------------------

    if (startDate !== undefined) {
      if (!startDate) {
        coupon.startDate = null;
      } else {
        const date = new Date(startDate);

        if (Number.isNaN(date.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid start date",
          });
        }

        coupon.startDate = date;
      }
    }

    // -------------------------
    // EXPIRY DATE
    // -------------------------

    if (expiryDate !== undefined) {
      if (!expiryDate) {
        coupon.expiryDate = null;
      } else {
        const date = new Date(expiryDate);

        if (Number.isNaN(date.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid expiry date",
          });
        }

        coupon.expiryDate = date;
      }
    }

    // -------------------------
    // DATE ORDER CHECK
    // -------------------------

    if (
      coupon.startDate &&
      coupon.expiryDate &&
      coupon.expiryDate < coupon.startDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Expiry date cannot be before start date",
      });
    }

    // -------------------------
    // ACTIVE
    // -------------------------

    if (active !== undefined) {
      coupon.active = Boolean(active);
    }

    await coupon.save();

    return res.json({
      success: true,
      message: "Coupon updated successfully",
      coupon,
    });
  } catch (error) {
    console.error("Update coupon error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to update coupon",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE COUPON - ADMIN
// =====================================================

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    await Coupon.findByIdAndDelete(id);

    return res.json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    console.error("Delete coupon error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete coupon",
    });
  }
};

// =====================================================
// TOGGLE COUPON STATUS - ADMIN
// =====================================================

exports.toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    coupon.active = !coupon.active;

    await coupon.save();

    return res.json({
      success: true,
      message: coupon.active
        ? "Coupon activated successfully"
        : "Coupon deactivated successfully",
      coupon,
    });
  } catch (error) {
    console.error("Toggle coupon status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update coupon status",
    });
  }
};

// =====================================================
// VALIDATE COUPON - CUSTOMER
// =====================================================

exports.validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    // -------------------------
    // BASIC VALIDATION
    // -------------------------

    if (!code?.trim()) {
      return res.status(400).json({
        valid: false,
        message: "Coupon code is required",
      });
    }

    const total = Number(cartTotal);

    if (!Number.isFinite(total) || total < 0) {
      return res.status(400).json({
        valid: false,
        message: "Invalid cart total",
      });
    }

    const normalizedCode = code.trim().toUpperCase();

    // -------------------------
    // FIND COUPON
    // -------------------------

    const coupon = await Coupon.findOne({
      code: normalizedCode,
    });

    if (!coupon) {
      return res.status(404).json({
        valid: false,
        message: "Invalid coupon code",
      });
    }

    // -------------------------
    // ACTIVE CHECK
    // -------------------------

    if (!coupon.active) {
      return res.status(400).json({
        valid: false,
        message: "This coupon is currently inactive",
      });
    }

    // -------------------------
    // DATE CHECK
    // -------------------------

    const now = new Date();

    if (coupon.startDate && now < coupon.startDate) {
      return res.status(400).json({
        valid: false,
        message: "This coupon is not active yet",
      });
    }

    if (coupon.expiryDate && now > coupon.expiryDate) {
      return res.status(400).json({
        valid: false,
        message: "This coupon has expired",
      });
    }

    // -------------------------
    // TOTAL USAGE LIMIT
    // 0 = UNLIMITED
    // -------------------------

    if (
      coupon.usageLimit > 0 &&
      coupon.usedCount >= coupon.usageLimit
    ) {
      return res.status(400).json({
        valid: false,
        message: "This coupon usage limit has been reached",
      });
    }

    // -------------------------
    // MINIMUM ORDER
    // -------------------------

    if (total < coupon.minimumOrder) {
      return res.status(400).json({
        valid: false,
        message: `Minimum order value for this coupon is ₹${coupon.minimumOrder}`,
      });
    }

    // -------------------------
    // PER USER LIMIT
    // -------------------------

    if (req.user?._id && coupon.perUserLimit > 0) {
      const userUsageCount = await Order.countDocuments({
        user: req.user._id,
        couponCode: normalizedCode,
        status: {
          $ne: "Cancelled",
        },
      });

      if (userUsageCount >= coupon.perUserLimit) {
        return res.status(400).json({
          valid: false,
          message:
            "You have already used this coupon the maximum number of times",
        });
      }
    }

    // -------------------------
    // CALCULATE DISCOUNT
    // -------------------------

    let discount = 0;

    if (coupon.discountType === "percentage") {
      discount =
        (total * Number(coupon.discountValue)) / 100;
    } else if (coupon.discountType === "fixed") {
      discount = Number(coupon.discountValue);
    }

    // -------------------------
    // MAXIMUM DISCOUNT
    // 0 = NO LIMIT
    // -------------------------

    if (
      Number(coupon.maximumDiscount) > 0 &&
      discount > Number(coupon.maximumDiscount)
    ) {
      discount = Number(coupon.maximumDiscount);
    }

    // Discount cannot exceed cart total
    discount = Math.min(discount, total);

    // Round to 2 decimals
    discount =
      Math.round((discount + Number.EPSILON) * 100) / 100;

    if (discount <= 0) {
      return res.status(400).json({
        valid: false,
        message: "This coupon does not provide a valid discount",
      });
    }

    // -------------------------
    // SUCCESS RESPONSE
    // -------------------------

    return res.json({
      valid: true,

      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minimumOrder: coupon.minimumOrder,
        maximumDiscount: coupon.maximumDiscount,
      },

      discount,
    });
  } catch (error) {
    console.error("Validate coupon error:", error);

    return res.status(500).json({
      valid: false,
      message: "Unable to validate coupon right now",
    });
  }
};