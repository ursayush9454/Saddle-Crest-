const r = require("express").Router(),
  c = require("../controllers/categoryController"),
  { auth, adminOnly } = require("../middleware/auth");
r.get("/", c.list);
r.post("/", auth, adminOnly, c.create);
r.put("/:id", auth, adminOnly, c.update);
r.delete("/:id", auth, adminOnly, c.remove);
module.exports = r;
