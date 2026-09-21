const r = require("express").Router();

const c = require("../controllers/couponController");

const {
  auth,
  adminOnly,
} = require("../middleware/auth");

// =========================
// CUSTOMER COUPON VALIDATION
// =========================

r.post(
  "/validate",
  auth,
  c.validateCoupon
);

// =========================
// ADMIN COUPON ROUTES
// =========================

r.get(
  "/",
  auth,
  adminOnly,
  c.list
);

r.get(
  "/:id",
  auth,
  adminOnly,
  c.getOne
);

r.post(
  "/",
  auth,
  adminOnly,
  c.create
);

r.put(
  "/:id",
  auth,
  adminOnly,
  c.update
);

r.patch(
  "/:id/status",
  auth,
  adminOnly,
  c.toggleStatus
);

r.delete(
  "/:id",
  auth,
  adminOnly,
  c.remove
);

module.exports = r;