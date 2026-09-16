const Category = require("../models/Category");
const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
exports.list = async (req, res) =>
  res.json({
    categories: await Category.find({ isActive: true }).sort({ name: 1 }),
  });
exports.create = async (req, res) => {
  const { name, description, image } = req.body;
  if (!name)
    return res.status(400).json({ message: "Category name is required" });
  const c = await Category.create({
    name,
    slug: slugify(name),
    description,
    image,
  });
  res.status(201).json({ message: "Category created", category: c });
};
exports.update = async (req, res) => {
  const data = { ...req.body };
  if (data.name) data.slug = slugify(data.name);
  const c = await Category.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });
  if (!c) return res.status(404).json({ message: "Category not found" });
  res.json({ message: "Category updated", category: c });
};
exports.remove = async (req, res) => {
  const c = await Category.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true },
  );
  if (!c) return res.status(404).json({ message: "Category not found" });
  res.json({ message: "Category archived", category: c });
};
