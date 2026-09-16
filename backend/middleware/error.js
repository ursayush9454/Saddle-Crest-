const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.name === "CastError") return res.status(400).json({ message: "Invalid ID" });
  if (err.code === 11000) return res.status(409).json({ message: "Duplicate value already exists" });
  if (err.name === "ValidationError") return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join(", ") });
  res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
};
module.exports = errorHandler;
