require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

const app = express();

app.disable("x-powered-by");

// =========================
// CORS
// =========================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// =========================
// BODY PARSER
// =========================

app.use(
  express.json({
    limit: "1mb",
  })
);

// =========================
// ROOT
// =========================

app.get("/", (req, res) => {
  res.json({
    message: "Saddle & Crest Backend API is Running 🚀",
    version: "2.0.0",
  });
});

// =========================
// API ROUTES
// =========================

app.use("/api/auth", require("./routes/auth"));

app.use("/api/products", require("./routes/products"));

app.use("/api/categories", require("./routes/categories"));

app.use("/api/cart", require("./routes/cart"));

app.use("/api/wishlist", require("./routes/wishlist"));

app.use("/api/orders", require("./routes/orders"));

app.use("/api/admin", require("./routes/admin"));

// =========================
// 404
// =========================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// =========================
// ERROR HANDLER
// =========================

app.use(errorHandler);

// =========================
// SERVER
// =========================

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Saddle & Crest API running on port ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "Failed to start server:",
      error.message
    );

    process.exit(1);
  });