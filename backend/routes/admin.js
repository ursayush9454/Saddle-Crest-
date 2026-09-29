const r = require("express").Router();

const c = require("../controllers/adminController");

const {
  auth,
  adminOnly,
} = require("../middleware/auth");


// =========================================================
// ADMIN AUTH
// =========================================================

r.use(auth, adminOnly);


// =========================================================
// DASHBOARD
// =========================================================

r.get(
  "/dashboard",
  c.dashboard
);

r.get(
  "/stats",
  c.dashboard
);


// =========================================================
// PRODUCTS
// =========================================================

r.get(
  "/products",
  c.products
);

r.get(
  "/products/highly-ordered",
  c.highlyOrdered
);


// =========================================================
// CATEGORIES
// =========================================================

r.get(
  "/categories",
  c.categories
);


// =========================================================
// ORDERS
// =========================================================

r.get(
  "/orders",
  c.orders
);

r.put(
  "/orders/:id/status",
  c.updateOrder
);


// =========================================================
// CUSTOMERS
// =========================================================

r.get(
  "/customers",
  c.customers
);

r.delete(
  "/customers/:id",
  c.deleteCustomer
);


module.exports = r;