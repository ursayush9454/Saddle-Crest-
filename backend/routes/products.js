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

// Get single active product
r.get("/:id", c.getOne);

/*
|--------------------------------------------------------------------------
| ADMIN PRODUCT ROUTES
|--------------------------------------------------------------------------
*/

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

// Archive product
r.delete(
  "/:id",
  auth,
  adminOnly,
  c.remove
);

module.exports = r;