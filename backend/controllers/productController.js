const Product = require("../models/Product");
const cloudinary = require("cloudinary").v2;

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "saddle-crest/products",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    stream.end(fileBuffer);
  });
};

const normalizeArray = (value) => {
  if (value === undefined || value === null) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean);
      }
    } catch (error) {
      // Not JSON, continue
    }

    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["true", "1", "yes", "on"].includes(normalized)) {
      return true;
    }

    if (["false", "0", "no", "off"].includes(normalized)) {
      return false;
    }
  }

  return Boolean(value);
};

const parsePrice = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    return undefined;
  }

  return number;
};

const parseSalePrice = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    value === "null"
  ) {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    return null;
  }

  return number;
};

/*
|--------------------------------------------------------------------------
| PUBLIC - GET ACTIVE PRODUCTS
|--------------------------------------------------------------------------
*/

exports.list = async (req, res) => {
  try {
    const {
      search,
      category,
      featured,
      bestSeller,
      newArrival,
      minPrice,
      maxPrice,
      sort = "newest",
      page = 1,
      limit = 12,
    } = req.query;

    // PUBLIC STORE ONLY SHOWS ACTIVE PRODUCTS
    const query = {
      isActive: true,
    };

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");

      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { shortDescription: searchRegex },
        { category: searchRegex },
        { sku: searchRegex },
      ];
    }

    /*
    |--------------------------------------------------------------------------
    | Category
    |--------------------------------------------------------------------------
    */

    if (category && category.trim()) {
      query.category = category.trim();
    }

    /*
    |--------------------------------------------------------------------------
    | Featured
    |--------------------------------------------------------------------------
    */

    if (featured !== undefined) {
      query.featured = parseBoolean(featured);
    }

    /*
    |--------------------------------------------------------------------------
    | Best Seller
    |--------------------------------------------------------------------------
    */

    if (bestSeller !== undefined) {
      query.bestSeller = parseBoolean(bestSeller);
    }

    /*
    |--------------------------------------------------------------------------
    | New Arrival
    |--------------------------------------------------------------------------
    */

    if (newArrival !== undefined) {
      query.newArrival = parseBoolean(newArrival);
    }

    /*
    |--------------------------------------------------------------------------
    | Price Filter
    |--------------------------------------------------------------------------
    */

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};

      if (minPrice !== undefined && minPrice !== "") {
        const min = Number(minPrice);

        if (Number.isFinite(min)) {
          query.price.$gte = min;
        }
      }

      if (maxPrice !== undefined && maxPrice !== "") {
        const max = Number(maxPrice);

        if (Number.isFinite(max)) {
          query.price.$lte = max;
        }
      }

      if (Object.keys(query.price).length === 0) {
        delete query.price;
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Sorting
    |--------------------------------------------------------------------------
    */

    let sortOption = {
      createdAt: -1,
    };

    switch (sort) {
      case "priceLow":
        sortOption = {
          price: 1,
        };
        break;

      case "priceHigh":
        sortOption = {
          price: -1,
        };
        break;

      case "name":
        sortOption = {
          name: 1,
        };
        break;

      case "newest":
      default:
        sortOption = {
          createdAt: -1,
        };
        break;
    }

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    const currentPage = Math.max(Number(page) || 1, 1);
    const perPage = Math.min(
      Math.max(Number(limit) || 12, 1),
      100
    );

    const skip = (currentPage - 1) * perPage;

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(perPage)
        .lean(),

      Product.countDocuments(query),
    ]);

    return res.status(200).json({
      message: "Products fetched successfully",
      products,
      pagination: {
        page: currentPage,
        limit: perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    console.error("List products error:", error);

    return res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| ADMIN - GET ALL PRODUCTS
|--------------------------------------------------------------------------
|
| status:
| active   -> only active products
| inactive -> only inactive products
| all      -> active + inactive
|
*/

exports.adminList = async (req, res) => {
  try {
    const {
      search,
      category,
      status = "active",
      featured,
      bestSeller,
      newArrival,
      sort = "newest",
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    /*
    |--------------------------------------------------------------------------
    | Product Status
    |--------------------------------------------------------------------------
    */

    if (status === "inactive") {
      query.isActive = false;
    } else if (status === "all") {
      // No isActive filter
    } else {
      // Default admin view = active products
      query.isActive = true;
    }

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");

      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { shortDescription: searchRegex },
        { category: searchRegex },
        { sku: searchRegex },
      ];
    }

    /*
    |--------------------------------------------------------------------------
    | Category
    |--------------------------------------------------------------------------
    */

    if (category && category.trim()) {
      query.category = category.trim();
    }

    /*
    |--------------------------------------------------------------------------
    | Featured
    |--------------------------------------------------------------------------
    */

    if (featured !== undefined) {
      query.featured = parseBoolean(featured);
    }

    /*
    |--------------------------------------------------------------------------
    | Best Seller
    |--------------------------------------------------------------------------
    */

    if (bestSeller !== undefined) {
      query.bestSeller = parseBoolean(bestSeller);
    }

    /*
    |--------------------------------------------------------------------------
    | New Arrival
    |--------------------------------------------------------------------------
    */

    if (newArrival !== undefined) {
      query.newArrival = parseBoolean(newArrival);
    }

    /*
    |--------------------------------------------------------------------------
    | Sorting
    |--------------------------------------------------------------------------
    */

    let sortOption = {
      createdAt: -1,
    };

    switch (sort) {
      case "priceLow":
        sortOption = {
          price: 1,
        };
        break;

      case "priceHigh":
        sortOption = {
          price: -1,
        };
        break;

      case "name":
        sortOption = {
          name: 1,
        };
        break;

      case "stockLow":
        sortOption = {
          stock: 1,
        };
        break;

      case "newest":
      default:
        sortOption = {
          createdAt: -1,
        };
        break;
    }

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    const currentPage = Math.max(Number(page) || 1, 1);

    const perPage = Math.min(
      Math.max(Number(limit) || 20, 1),
      100
    );

    const skip = (currentPage - 1) * perPage;

    /*
    |--------------------------------------------------------------------------
    | Fetch Products + Counts
    |--------------------------------------------------------------------------
    */

    const [products, total, activeCount, inactiveCount] =
      await Promise.all([
        Product.find(query)
          .sort(sortOption)
          .skip(skip)
          .limit(perPage)
          .lean(),

        Product.countDocuments(query),

        Product.countDocuments({
          isActive: true,
        }),

        Product.countDocuments({
          isActive: false,
        }),
      ]);

    return res.status(200).json({
      message: "Admin products fetched successfully",

      products,

      counts: {
        active: activeCount,
        inactive: inactiveCount,
        total: activeCount + inactiveCount,
      },

      pagination: {
        page: currentPage,
        limit: perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    console.error("Admin list products error:", error);

    return res.status(500).json({
      message: "Failed to fetch admin products",
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| PUBLIC - GET SINGLE ACTIVE PRODUCT
|--------------------------------------------------------------------------
*/

exports.getOne = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
    }).lean();

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);

    return res.status(500).json({
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| ADMIN - CREATE PRODUCT
|--------------------------------------------------------------------------
*/

exports.create = async (req, res) => {
  try {
    /*
    |--------------------------------------------------------------------------
    | Images
    |--------------------------------------------------------------------------
    */

    let uploadedImages = [];

    if (req.files && req.files.length > 0) {
      uploadedImages = await Promise.all(
        req.files.map((file) =>
          uploadToCloudinary(file.buffer)
        )
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Image URLs
    |--------------------------------------------------------------------------
    */

    const imageUrls = normalizeArray(req.body.images);

    const allImages = [
      ...uploadedImages,
      ...imageUrls,
    ].filter(Boolean);

    const primaryImage =
      req.body.image ||
      allImages[0] ||
      "";

    if (!primaryImage) {
      return res.status(400).json({
        message: "At least one product image is required",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Price
    |--------------------------------------------------------------------------
    */

    const price = parsePrice(req.body.price);

    if (price === undefined) {
      return res.status(400).json({
        message: "Valid product price is required",
      });
    }

    const salePrice = parseSalePrice(
      req.body.salePrice
    );

    /*
    |--------------------------------------------------------------------------
    | Product Data
    |--------------------------------------------------------------------------
    */

    const productData = {
      name: req.body.name,
      slug: req.body.slug,
      sku: req.body.sku,

      description: req.body.description,

      shortDescription:
        req.body.shortDescription || "",

      price,

      salePrice,

      category: req.body.category,

      categoryId:
        req.body.categoryId || null,

      image: primaryImage,

      images: allImages,

      stock:
        Number(req.body.stock) >= 0
          ? Number(req.body.stock)
          : 0,

      lowStockThreshold:
        Number(req.body.lowStockThreshold) >= 0
          ? Number(req.body.lowStockThreshold)
          : 5,

      badge:
        req.body.badge || "",

      tags: normalizeArray(req.body.tags),

      sizes: normalizeArray(req.body.sizes),

      colors: normalizeArray(req.body.colors),

      featured: parseBoolean(
        req.body.featured,
        false
      ),

      bestSeller: parseBoolean(
        req.body.bestSeller,
        false
      ),

      newArrival: parseBoolean(
        req.body.newArrival,
        false
      ),

      /*
      |--------------------------------------------------------------------------
      | ACTIVE PRODUCT CHECKBOX
      |--------------------------------------------------------------------------
      |
      | If checkbox is unchecked -> false
      | If not provided -> true
      |
      */

      isActive: parseBoolean(
        req.body.isActive,
        true
      ),
    };

    /*
    |--------------------------------------------------------------------------
    | Sale Price Validation
    |--------------------------------------------------------------------------
    */

    if (
      salePrice !== null &&
      salePrice >= price
    ) {
      return res.status(400).json({
        message:
          "Sale price must be lower than regular price",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Create
    |--------------------------------------------------------------------------
    */

    const product = await Product.create(
      productData
    );

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);

    /*
    |--------------------------------------------------------------------------
    | Duplicate SKU
    |--------------------------------------------------------------------------
    */

    if (error.code === 11000) {
      return res.status(400).json({
        message:
          "A product with this SKU already exists",
      });
    }

    return res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| ADMIN - UPDATE PRODUCT
|--------------------------------------------------------------------------
*/

exports.update = async (req, res) => {
  try {
    const product =
      await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Images
    |--------------------------------------------------------------------------
    */

    let uploadedImages = [];

    if (req.files && req.files.length > 0) {
      uploadedImages = await Promise.all(
        req.files.map((file) =>
          uploadToCloudinary(file.buffer)
        )
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Existing Images
    |--------------------------------------------------------------------------
    */

    let existingImages = normalizeArray(
      req.body.existingImages
    );

    /*
    |--------------------------------------------------------------------------
    | New Image URLs
    |--------------------------------------------------------------------------
    */

    const newImageUrls = normalizeArray(
      req.body.images
    );

    let allImages = [
      ...existingImages,
      ...newImageUrls,
      ...uploadedImages,
    ].filter(Boolean);

    /*
    |--------------------------------------------------------------------------
    | Primary Image
    |--------------------------------------------------------------------------
    */

    let primaryImage =
      req.body.image ||
      allImages[0] ||
      product.image;

    /*
    |--------------------------------------------------------------------------
    | Price
    |--------------------------------------------------------------------------
    */

    const parsedPrice =
      parsePrice(req.body.price);

    const price =
      parsedPrice !== undefined
        ? parsedPrice
        : product.price;

    const parsedSalePrice =
      parseSalePrice(req.body.salePrice);

    let salePrice;

    if (
      req.body.salePrice === undefined
    ) {
      salePrice = product.salePrice;
    } else {
      salePrice = parsedSalePrice;
    }

    /*
    |--------------------------------------------------------------------------
    | Sale Price Validation
    |--------------------------------------------------------------------------
    */

    if (
      salePrice !== null &&
      salePrice !== undefined &&
      salePrice >= price
    ) {
      return res.status(400).json({
        message:
          "Sale price must be lower than regular price",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Update Fields
    |--------------------------------------------------------------------------
    */

    product.name =
      req.body.name ?? product.name;

    product.slug =
      req.body.slug ?? product.slug;

    product.sku =
      req.body.sku ?? product.sku;

    product.description =
      req.body.description ??
      product.description;

    product.shortDescription =
      req.body.shortDescription ??
      product.shortDescription;

    product.price = price;

    product.salePrice = salePrice;

    product.category =
      req.body.category ??
      product.category;

    product.categoryId =
      req.body.categoryId !== undefined
        ? req.body.categoryId || null
        : product.categoryId;

    product.image = primaryImage;

    /*
    |--------------------------------------------------------------------------
    | Only update images if new/existing image data was sent
    |--------------------------------------------------------------------------
    */

    if (
      req.body.images !== undefined ||
      req.body.existingImages !== undefined ||
      uploadedImages.length > 0
    ) {
      if (allImages.length > 0) {
        product.images = allImages;
        product.image = allImages[0];
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Stock
    |--------------------------------------------------------------------------
    */

    if (req.body.stock !== undefined) {
      const stock = Number(req.body.stock);

      if (
        Number.isFinite(stock) &&
        stock >= 0
      ) {
        product.stock = stock;
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Low Stock Threshold
    |--------------------------------------------------------------------------
    */

    if (
      req.body.lowStockThreshold !==
      undefined
    ) {
      const threshold = Number(
        req.body.lowStockThreshold
      );

      if (
        Number.isFinite(threshold) &&
        threshold >= 0
      ) {
        product.lowStockThreshold =
          threshold;
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Other Fields
    |--------------------------------------------------------------------------
    */

    if (req.body.badge !== undefined) {
      product.badge = req.body.badge;
    }

    if (req.body.tags !== undefined) {
      product.tags = normalizeArray(
        req.body.tags
      );
    }

    if (req.body.sizes !== undefined) {
      product.sizes = normalizeArray(
        req.body.sizes
      );
    }

    if (req.body.colors !== undefined) {
      product.colors = normalizeArray(
        req.body.colors
      );
    }

    if (req.body.featured !== undefined) {
      product.featured = parseBoolean(
        req.body.featured
      );
    }

    if (req.body.bestSeller !== undefined) {
      product.bestSeller = parseBoolean(
        req.body.bestSeller
      );
    }

    if (req.body.newArrival !== undefined) {
      product.newArrival = parseBoolean(
        req.body.newArrival
      );
    }

    /*
    |--------------------------------------------------------------------------
    | ACTIVE / INACTIVE
    |--------------------------------------------------------------------------
    |
    | This is important.
    |
    | Admin can edit an inactive product and
    | activate it again.
    |
    */

    product.isActive = parseBoolean(
      req.body.isActive,
      product.isActive
    );

    /*
    |--------------------------------------------------------------------------
    | Save
    |--------------------------------------------------------------------------
    */

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message:
          "A product with this SKU already exists",
      });
    }

    return res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| ADMIN - ARCHIVE / DEACTIVATE PRODUCT
|--------------------------------------------------------------------------
*/

exports.remove = async (req, res) => {
  try {
    const product =
      await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    product.isActive = false;

    await product.save();

    return res.status(200).json({
      message: "Product archived successfully",
      product,
    });
  } catch (error) {
    console.error(
      "Archive product error:",
      error
    );

    return res.status(500).json({
      message: "Failed to archive product",
      error: error.message,
    });
  }
};