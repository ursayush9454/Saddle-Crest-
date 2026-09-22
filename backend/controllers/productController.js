const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

/*
|--------------------------------------------------------------------------
| CLOUDINARY IMAGE UPLOAD
|--------------------------------------------------------------------------
*/

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "saddle-and-crest/products",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });
};

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

const normalizeArray = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  return [value].filter(Boolean);
};

const parseBoolean = (
  value,
  defaultValue = false
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return defaultValue;
  }

  if (value === true || value === "true") {
    return true;
  }

  if (value === false || value === "false") {
    return false;
  }

  return defaultValue;
};

/*
|--------------------------------------------------------------------------
| GET ALL PRODUCTS
|--------------------------------------------------------------------------
*/

exports.list = async (req, res, next) => {
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

    const query = {
      isActive: true,
    };

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    if (search) {
      query.$or = [
        {
          name: new RegExp(search, "i"),
        },
        {
          description: new RegExp(search, "i"),
        },
        {
          tags: new RegExp(search, "i"),
        },
      ];
    }

    /*
    |--------------------------------------------------------------------------
    | Category
    |--------------------------------------------------------------------------
    */

    if (category) {
      query.category = category;
    }

    /*
    |--------------------------------------------------------------------------
    | Featured
    |--------------------------------------------------------------------------
    */

    if (featured !== undefined) {
      query.featured = featured === "true";
    }

    /*
    |--------------------------------------------------------------------------
    | Best Seller
    |--------------------------------------------------------------------------
    */

    if (bestSeller !== undefined) {
      query.bestSeller = bestSeller === "true";
    }

    /*
    |--------------------------------------------------------------------------
    | New Arrival
    |--------------------------------------------------------------------------
    */

    if (newArrival !== undefined) {
      query.newArrival = newArrival === "true";
    }

    /*
    |--------------------------------------------------------------------------
    | Price Filter
    |--------------------------------------------------------------------------
    */

    if (minPrice || maxPrice) {
      query.price = {
        ...(minPrice
          ? {
              $gte: Number(minPrice),
            }
          : {}),

        ...(maxPrice
          ? {
              $lte: Number(maxPrice),
            }
          : {}),
      };
    }

    /*
    |--------------------------------------------------------------------------
    | Sorting
    |--------------------------------------------------------------------------
    */

    const sorts = {
      newest: {
        createdAt: -1,
      },

      priceLow: {
        price: 1,
      },

      priceHigh: {
        price: -1,
      },

      name: {
        name: 1,
      },
    };

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    const currentPage = Math.max(
      1,
      Number(page)
    );

    const perPage = Math.min(
      100,
      Math.max(1, Number(limit))
    );

    const [products, total] =
      await Promise.all([
        Product.find(query)
          .sort(
            sorts[sort] ||
              sorts.newest
          )
          .skip(
            (currentPage - 1) *
              perPage
          )
          .limit(perPage),

        Product.countDocuments(query),
      ]);

    res.json({
      message:
        "Products fetched successfully",

      products,

      pagination: {
        page: currentPage,
        limit: perPage,
        total,
        pages: Math.ceil(
          total / perPage
        ),
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| GET SINGLE PRODUCT
|--------------------------------------------------------------------------
*/

exports.getOne = async (
  req,
  res,
  next
) => {
  try {
    const product =
      await Product.findOne({
        _id: req.params.id,
        isActive: true,
      });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message:
        "Product fetched successfully",

      product,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| CREATE PRODUCT
|--------------------------------------------------------------------------
*/

exports.create = async (
  req,
  res,
  next
) => {
  try {
    console.log(
      "Creating product..."
    );

    console.log(
      "Uploaded files:",
      req.files?.length || 0
    );

    /*
    |--------------------------------------------------------------------------
    | Upload selected files to Cloudinary
    |--------------------------------------------------------------------------
    */

    let uploadedImages = [];

    if (
      req.files &&
      req.files.length > 0
    ) {
      uploadedImages =
        await Promise.all(
          req.files.map((file) =>
            uploadToCloudinary(
              file.buffer
            )
          )
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Support image URLs
    |--------------------------------------------------------------------------
    */

    const urlImages =
      normalizeArray(
        req.body.images
      );

    /*
    |--------------------------------------------------------------------------
    | Combine images
    |--------------------------------------------------------------------------
    */

    const imageUrls = [
      ...uploadedImages,
      ...urlImages,
    ];

    /*
    |--------------------------------------------------------------------------
    | Image required
    |--------------------------------------------------------------------------
    */

    if (imageUrls.length === 0) {
      return res.status(400).json({
        message:
          "At least one product image is required",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Product data
    |--------------------------------------------------------------------------
    */

    const productData = {
      name: req.body.name,

      slug:
        req.body.slug || "",

      sku:
        req.body.sku || undefined,

      description:
        req.body.description,

      shortDescription:
        req.body.shortDescription ||
        "",

      price: Number(
        req.body.price
      ),

      salePrice:
        req.body.salePrice !==
          undefined &&
        req.body.salePrice !== ""
          ? Number(
              req.body.salePrice
            )
          : null,

      category:
        req.body.category,

      categoryId:
        req.body.categoryId ||
        null,

      image: imageUrls[0],

      images: imageUrls,

      stock: Number(
        req.body.stock || 0
      ),

      lowStockThreshold:
        Number(
          req.body
            .lowStockThreshold ||
            5
        ),

      badge:
        req.body.badge || "",

      tags: normalizeArray(
        req.body.tags
      ),

      sizes: normalizeArray(
        req.body.sizes
      ),

      colors: normalizeArray(
        req.body.colors
      ),

      featured: parseBoolean(
        req.body.featured
      ),

      bestSeller: parseBoolean(
        req.body.bestSeller
      ),

      newArrival: parseBoolean(
        req.body.newArrival
      ),

      isActive: parseBoolean(
        req.body.isActive,
        true
      ),
    };

    /*
    |--------------------------------------------------------------------------
    | Save product
    |--------------------------------------------------------------------------
    */

    const product =
      await Product.create(
        productData
      );

    console.log(
      "Product created:",
      product._id
    );

    res.status(201).json({
      message:
        "Product created successfully",

      product,
    });
  } catch (error) {
    console.error(
      "Create product error:",
      error
    );

    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE PRODUCT
|--------------------------------------------------------------------------
*/

exports.update = async (
  req,
  res,
  next
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        message:
          "Product not found",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Upload new files
    |--------------------------------------------------------------------------
    */

    let uploadedImages = [];

    if (
      req.files &&
      req.files.length > 0
    ) {
      uploadedImages =
        await Promise.all(
          req.files.map((file) =>
            uploadToCloudinary(
              file.buffer
            )
          )
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Existing images
    |--------------------------------------------------------------------------
    */

    const existingImages =
      normalizeArray(
        req.body.existingImages
      );

    /*
    |--------------------------------------------------------------------------
    | URL images
    |--------------------------------------------------------------------------
    */

    const urlImages =
      normalizeArray(
        req.body.images
      );

    /*
    |--------------------------------------------------------------------------
    | Combine images
    |--------------------------------------------------------------------------
    */

    let imageUrls = [
      ...existingImages,
      ...urlImages,
      ...uploadedImages,
    ];

    /*
    |--------------------------------------------------------------------------
    | Keep old images if none sent
    |--------------------------------------------------------------------------
    */

    if (imageUrls.length === 0) {
      imageUrls =
        product.images?.length
          ? product.images
          : product.image
          ? [product.image]
          : [];
    }

    /*
    |--------------------------------------------------------------------------
    | Still no image
    |--------------------------------------------------------------------------
    */

    if (imageUrls.length === 0) {
      return res.status(400).json({
        message:
          "Product must have at least one image",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Update data
    |--------------------------------------------------------------------------
    */

    const updateData = {
      name:
        req.body.name,

      slug:
        req.body.slug || "",

      sku:
        req.body.sku || undefined,

      description:
        req.body.description,

      shortDescription:
        req.body.shortDescription ||
        "",

      price: Number(
        req.body.price
      ),

      salePrice:
        req.body.salePrice !==
          undefined &&
        req.body.salePrice !== ""
          ? Number(
              req.body.salePrice
            )
          : null,

      category:
        req.body.category,

      categoryId:
        req.body.categoryId ||
        null,

      image:
        imageUrls[0],

      images:
        imageUrls,

      stock: Number(
        req.body.stock || 0
      ),

      lowStockThreshold:
        Number(
          req.body
            .lowStockThreshold ||
            5
        ),

      badge:
        req.body.badge || "",

      tags: normalizeArray(
        req.body.tags
      ),

      sizes: normalizeArray(
        req.body.sizes
      ),

      colors: normalizeArray(
        req.body.colors
      ),

      featured: parseBoolean(
        req.body.featured,
        product.featured
      ),

      bestSeller: parseBoolean(
        req.body.bestSeller,
        product.bestSeller
      ),

      newArrival: parseBoolean(
        req.body.newArrival,
        product.newArrival
      ),

      isActive: parseBoolean(
        req.body.isActive,
        product.isActive
      ),
    };

    /*
    |--------------------------------------------------------------------------
    | Update database
    |--------------------------------------------------------------------------
    */

    const updatedProduct =
      await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          returnDocument: "after",
          runValidators: true,
        }
      );

    if (!updatedProduct) {
      return res.status(404).json({
        message:
          "Product not found",
      });
    }

    res.json({
      message:
        "Product updated successfully",

      product:
        updatedProduct,
    });
  } catch (error) {
    console.error(
      "Update product error:",
      error
    );

    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| DELETE / ARCHIVE PRODUCT
|--------------------------------------------------------------------------
|
| Admin delete = soft delete/archive.
|
| Product is NOT physically removed from
| MongoDB. isActive becomes false.
|
| Public product API already returns only
| isActive: true products.
|--------------------------------------------------------------------------
*/

exports.remove = async (
  req,
  res,
  next
) => {
  try {
    console.log(
      "Archive product request:",
      req.params.id
    );

    const product =
      await Product.findByIdAndUpdate(
        req.params.id,
        {
          isActive: false,
        },
        {
          returnDocument: "after",
          runValidators: true,
        }
      );

    if (!product) {
      return res.status(404).json({
        message:
          "Product not found",
      });
    }

    console.log(
      "Product archived successfully:",
      product._id
    );

    return res.status(200).json({
      success: true,
      message:
        "Product archived successfully",
      product,
    });
  } catch (error) {
    console.error(
      "Archive product error:",
      error
    );

    next(error);
  }
};