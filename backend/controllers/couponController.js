const Coupon = require("../models/Coupon");

// =========================
// GET ALL COUPONS
// =========================

exports.list = async (req, res, next) => {
  try {
    const {
      search = "",
      active,
    } = req.query;

    const query = {};

    if (search.trim()) {
      query.code = new RegExp(
        search.trim(),
        "i"
      );
    }

    if (active !== undefined) {
      query.active = active === "true";
    }

    const coupons = await Coupon.find(query)
      .sort({
        createdAt: -1,
      });

    res.json({
      message: "Coupons fetched successfully",
      coupons,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// GET SINGLE COUPON
// =========================

exports.getOne = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(
      req.params.id
    );

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found",
      });
    }

    res.json({
      message: "Coupon fetched successfully",
      coupon,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// CREATE COUPON
// =========================

exports.create = async (req, res, next) => {
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

    if (!code?.trim()) {
      return res.status(400).json({
        message: "Coupon code is required",
      });
    }

    if (
      !discountType ||
      !["percentage", "fixed"].includes(
        discountType
      )
    ) {
      return res.status(400).json({
        message: "Invalid discount type",
      });
    }

    const value = Number(discountValue);

    if (
      !Number.isFinite(value) ||
      value <= 0
    ) {
      return res.status(400).json({
        message:
          "Discount value must be greater than 0",
      });
    }

    if (
      discountType === "percentage" &&
      value > 100
    ) {
      return res.status(400).json({
        message:
          "Percentage discount cannot be greater than 100",
      });
    }

    const normalizedCode =
      code.trim().toUpperCase();

    const existingCoupon =
      await Coupon.findOne({
        code: normalizedCode,
      });

    if (existingCoupon) {
      return res.status(409).json({
        message: "Coupon code already exists",
      });
    }

    const start = startDate
      ? new Date(startDate)
      : null;

    const expiry = expiryDate
      ? new Date(expiryDate)
      : null;

    if (
      start &&
      Number.isNaN(start.getTime())
    ) {
      return res.status(400).json({
        message: "Invalid start date",
      });
    }

    if (
      expiry &&
      Number.isNaN(expiry.getTime())
    ) {
      return res.status(400).json({
        message: "Invalid expiry date",
      });
    }

    if (
      start &&
      expiry &&
      expiry < start
    ) {
      return res.status(400).json({
        message:
          "Expiry date cannot be before start date",
      });
    }

    const minimum =
      Number(minimumOrder) || 0;

    const maximum =
      Number(maximumDiscount) || 0;

    const usage =
      Number(usageLimit) || 0;

    const perUser = Math.max(
      1,
      Number(perUserLimit) || 1
    );

    if (minimum < 0) {
      return res.status(400).json({
        message:
          "Minimum order cannot be negative",
      });
    }

    if (maximum < 0) {
      return res.status(400).json({
        message:
          "Maximum discount cannot be negative",
      });
    }

    if (usage < 0) {
      return res.status(400).json({
        message:
          "Usage limit cannot be negative",
      });
    }

    const coupon = await Coupon.create({
      code: normalizedCode,

      discountType,

      discountValue: value,

      minimumOrder: minimum,

      maximumDiscount: maximum,

      startDate: start,

      expiryDate: expiry,

      usageLimit: usage,

      perUserLimit: perUser,

      active:
        active === undefined
          ? true
          : active === true ||
            active === "true",
    });

    res.status(201).json({
      message:
        "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// UPDATE COUPON
// =========================

exports.update = async (req, res, next) => {
  try {
    const coupon =
      await Coupon.findById(
        req.params.id
      );

    if (!coupon) {
      return res.status(404).json({
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

    // CODE

    if (code !== undefined) {
      const normalizedCode =
        String(code)
          .trim()
          .toUpperCase();

      if (!normalizedCode) {
        return res.status(400).json({
          message:
            "Coupon code is required",
        });
      }

      const duplicate =
        await Coupon.findOne({
          code: normalizedCode,
          _id: {
            $ne: coupon._id,
          },
        });

      if (duplicate) {
        return res.status(409).json({
          message:
            "Coupon code already exists",
        });
      }

      coupon.code = normalizedCode;
    }

    // DISCOUNT TYPE

    if (discountType !== undefined) {
      if (
        !["percentage", "fixed"].includes(
          discountType
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid discount type",
        });
      }

      coupon.discountType =
        discountType;
    }

    // DISCOUNT VALUE

    if (
      discountValue !== undefined
    ) {
      const value =
        Number(discountValue);

      if (
        !Number.isFinite(value) ||
        value <= 0
      ) {
        return res.status(400).json({
          message:
            "Discount value must be greater than 0",
        });
      }

      coupon.discountValue = value;
    }

    if (
      coupon.discountType ===
        "percentage" &&
      coupon.discountValue > 100
    ) {
      return res.status(400).json({
        message:
          "Percentage discount cannot be greater than 100",
      });
    }

    // MINIMUM ORDER

    if (
      minimumOrder !== undefined
    ) {
      const value =
        Number(minimumOrder);

      if (
        !Number.isFinite(value) ||
        value < 0
      ) {
        return res.status(400).json({
          message:
            "Minimum order must be 0 or greater",
        });
      }

      coupon.minimumOrder = value;
    }

    // MAXIMUM DISCOUNT

    if (
      maximumDiscount !==
      undefined
    ) {
      const value =
        Number(maximumDiscount);

      if (
        !Number.isFinite(value) ||
        value < 0
      ) {
        return res.status(400).json({
          message:
            "Maximum discount must be 0 or greater",
        });
      }

      coupon.maximumDiscount =
        value;
    }

    // START DATE

    if (startDate !== undefined) {
      if (!startDate) {
        coupon.startDate = null;
      } else {
        const start =
          new Date(startDate);

        if (
          Number.isNaN(
            start.getTime()
          )
        ) {
          return res.status(400).json({
            message:
              "Invalid start date",
          });
        }

        coupon.startDate = start;
      }
    }

    // EXPIRY DATE

    if (expiryDate !== undefined) {
      if (!expiryDate) {
        coupon.expiryDate = null;
      } else {
        const expiry =
          new Date(expiryDate);

        if (
          Number.isNaN(
            expiry.getTime()
          )
        ) {
          return res.status(400).json({
            message:
              "Invalid expiry date",
          });
        }

        coupon.expiryDate = expiry;
      }
    }

    if (
      coupon.startDate &&
      coupon.expiryDate &&
      coupon.expiryDate <
        coupon.startDate
    ) {
      return res.status(400).json({
        message:
          "Expiry date cannot be before start date",
      });
    }

    // USAGE LIMIT

    if (
      usageLimit !== undefined
    ) {
      const value =
        Number(usageLimit);

      if (
        !Number.isFinite(value) ||
        value < 0
      ) {
        return res.status(400).json({
          message:
            "Usage limit must be 0 or greater",
        });
      }

      coupon.usageLimit = value;
    }

    // PER USER LIMIT

    if (
      perUserLimit !== undefined
    ) {
      const value =
        Number(perUserLimit);

      if (
        !Number.isFinite(value) ||
        value < 1
      ) {
        return res.status(400).json({
          message:
            "Per user limit must be at least 1",
        });
      }

      coupon.perUserLimit =
        value;
    }

    // ACTIVE

    if (active !== undefined) {
      coupon.active =
        active === true ||
        active === "true";
    }

    await coupon.save();

    res.json({
      message:
        "Coupon updated successfully",
      coupon,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// DELETE COUPON
// =========================

exports.remove = async (
  req,
  res,
  next
) => {
  try {
    const coupon =
      await Coupon.findById(
        req.params.id
      );

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found",
      });
    }

    await Coupon.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "Coupon deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// TOGGLE STATUS
// =========================

exports.toggleStatus = async (
  req,
  res,
  next
) => {
  try {
    const coupon =
      await Coupon.findById(
        req.params.id
      );

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found",
      });
    }

    coupon.active =
      !coupon.active;

    await coupon.save();

    res.json({
      message:
        "Coupon status updated successfully",
      coupon,
    });
  } catch (error) {
    next(error);
  }
};