const r = require("express").Router();

const c = require("../controllers/productController");
const { auth, adminOnly } = require("../middleware/auth");
const upload = require("../middleware/upload");

/*
|--------------------------------------------------------------------------
| PUBLIC PRODUCT ROUTES
|--------------------------------------------------------------------------
*/

// Get all active products
r.get("/", c.list);

/*
|--------------------------------------------------------------------------
| ADMIN PRODUCT ROUTES
|--------------------------------------------------------------------------
*/

// Get all products for admin
// status = active | inactive | all
// IMPORTANT: This must come before /:id
r.get(
  "/admin/all",
  auth,
  adminOnly,
  c.adminList
);

// Get single active product
r.get("/:id", c.getOne);

// Create product
r.post(
  "/",
  auth,
  adminOnly,
  upload.array("images", 10),
  c.create
);

// Update product
r.put(
  "/:id",
  auth,
  adminOnly,
  upload.array("images", 10),
  c.update
);

// Archive / deactivate product
r.delete(
  "/:id",
  auth,
  adminOnly,
  c.remove
);

module.exports = r;