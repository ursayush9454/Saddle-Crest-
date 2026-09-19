const r = require("express").Router();

const c = require("../controllers/productController");
const { auth, adminOnly } = require("../middleware/auth");
const upload = require("../middleware/upload");

/*
|--------------------------------------------------------------------------
| PUBLIC PRODUCT ROUTES
|--------------------------------------------------------------------------
*/

// Get all products
r.get("/", c.list);

// Get single product
r.get("/:id", c.getOne);


/*
|--------------------------------------------------------------------------
| ADMIN PRODUCT ROUTES
|--------------------------------------------------------------------------
*/

// Create product
// Images are uploaded using field name: "images"
r.post(
  "/",
  auth,
  adminOnly,
  upload.array("images", 10),
  c.create
);

// Update product
// New images can again be uploaded using "images"
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