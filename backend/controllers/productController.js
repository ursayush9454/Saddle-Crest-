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

  if (
    value === true ||
    value === "true"
  ) {
    return true;
  }

  if (
    value === false ||
    value === "false"
  ) {
    return false;
  }

  return defaultValue;
};

/*
|--------------------------------------------------------------------------
| PRICE HELPER
|--------------------------------------------------------------------------
|
| Converts incoming FormData/string values into safe numbers.
|
*/

const parsePrice = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const normalizedValue = String(value)
    .replace(/,/g, "")
    .trim();

  const parsedValue = Number(normalizedValue);

  if (!Number.isFinite(parsedValue)) {
    return null;
  }

  return parsedValue;
};

/*
|--------------------------------------------------------------------------
| SALE PRICE HELPER
|--------------------------------------------------------------------------
|
| Rules:
|
| Regular Price = ₹3900
| Sale Price    = ₹3700
|
| This is VALID.
|
| Sale Price must:
| - be greater than 0
| - be strictly lower than regular price
|
*/

const parseSalePrice = (
  value,
  regularPrice
) => {
  /*
   * Empty sale price means:
   * product is not on sale.
   */

  if (
    value === undefined ||
    value === null ||
    String(value).trim() === ""
  ) {
    return null;
  }

  const salePrice = parsePrice(value);

  if (
    salePrice === null ||
    salePrice <= 0
  ) {
    throw new Error(
      "Please enter a valid sale price."
    );
  }

  if (
    !Number.isFinite(regularPrice) ||
    regularPrice <= 0
  ) {
    throw new Error(
      "Please enter a valid regular price."
    );
  }

  /*
   * IMPORTANT:
   *
   * Sale price must be LOWER than
   * regular price.
   *
   * Example:
   *
   * 3900 > 3700 = VALID
   * 3900 = 3900 = INVALID
   * 3900 < 4000 = INVALID
   */

  if (salePrice >= regularPrice) {
    throw new Error(
      "Sale price must be lower than the regular price."
    );
  }

  return salePrice;
};

/*
|--------------------------------------------------------------------------
| GET ALL PRODUCTS
|--------------------------------------------------------------------------
*/

exports.list = async (
  req,
  res,
  next
) => {
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
    | SEARCH
    |--------------------------------------------------------------------------
    */

    if (search) {
      query.$or = [
        {
          name: new RegExp(
            search,
            "i"
          ),
        },
        {
          description: new RegExp(
            search,
            "i"
          ),
        },
        {
          tags: new RegExp(
            search,
            "i"
          ),
        },
      ];
    }

    /*
    |--------------------------------------------------------------------------
    | CATEGORY
    |--------------------------------------------------------------------------
    */

    if (category) {
      query.category = category;
    }

    /*
    |--------------------------------------------------------------------------
    | FEATURED
    |--------------------------------------------------------------------------
    */

    if (featured !== undefined) {
      query.featured =
        featured === "true";
    }

    /*
    |--------------------------------------------------------------------------
    | BEST SELLER
    |--------------------------------------------------------------------------
    */

    if (bestSeller !== undefined) {
      query.bestSeller =
        bestSeller === "true";
    }

    /*
    |--------------------------------------------------------------------------
    | NEW ARRIVAL
    |--------------------------------------------------------------------------
    */

    if (newArrival !== undefined) {
      query.newArrival =
        newArrival === "true";
    }

    /*
    |--------------------------------------------------------------------------
    | PRICE FILTER
    |--------------------------------------------------------------------------
    */

    const parsedMinPrice =
      parsePrice(minPrice);

    const parsedMaxPrice =
      parsePrice(maxPrice);

    if (
      parsedMinPrice !== null ||
      parsedMaxPrice !== null
    ) {
      query.price = {};

      if (
        parsedMinPrice !== null
      ) {
        query.price.$gte =
          parsedMinPrice;
      }

      if (
        parsedMaxPrice !== null
      ) {
        query.price.$lte =
          parsedMaxPrice;
      }
    }

    /*
    |--------------------------------------------------------------------------
    | SORTING
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
    | PAGINATION
    |--------------------------------------------------------------------------
    */

    const parsedPage =
      Number(page);

    const parsedLimit =
      Number(limit);

    const currentPage =
      Number.isFinite(
        parsedPage
      ) && parsedPage > 0
        ? Math.floor(parsedPage)
        : 1;

    const perPage =
      Number.isFinite(
        parsedLimit
      ) && parsedLimit > 0
        ? Math.min(
            100,
            Math.floor(
              parsedLimit
            )
          )
        : 12;

    /*
    |--------------------------------------------------------------------------
    | FETCH
    |--------------------------------------------------------------------------
    */

    const [
      products,
      total,
    ] = await Promise.all([
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

      Product.countDocuments(
        query
      ),
    ]);

    /*
    |--------------------------------------------------------------------------
    | RESPONSE
    |--------------------------------------------------------------------------
    */

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
        message:
          "Product not found",
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
    | UPLOAD FILES
    |--------------------------------------------------------------------------
    */

    let uploadedImages = [];

    if (
      req.files &&
      req.files.length > 0
    ) {
      uploadedImages =
        await Promise.all(
          req.files.map(
            (file) =>
              uploadToCloudinary(
                file.buffer
              )
          )
        );
    }

    /*
    |--------------------------------------------------------------------------
    | IMAGE URLS
    |--------------------------------------------------------------------------
    */

    const urlImages =
      normalizeArray(
        req.body.images
      );

    const imageUrls = [
      ...uploadedImages,
      ...urlImages,
    ];

    /*
    |--------------------------------------------------------------------------
    | IMAGE REQUIRED
    |--------------------------------------------------------------------------
    */

    if (
      imageUrls.length === 0
    ) {
      return res.status(400).json({
        message:
          "At least one product image is required",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | REGULAR PRICE
    |--------------------------------------------------------------------------
    */

    const price =
      parsePrice(
        req.body.price
      );

    if (
      price === null ||
      price <= 0
    ) {
      return res.status(400).json({
        message:
          "Please enter a valid product price.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | SALE PRICE
    |--------------------------------------------------------------------------
    */

    let salePrice = null;

    try {
      salePrice =
        parseSalePrice(
          req.body.salePrice,
          price
        );
    } catch (error) {
      return res.status(400).json({
        message:
          error.message,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | PRODUCT DATA
    |--------------------------------------------------------------------------
    */

    const productData = {
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

      /*
       * REGULAR PRICE
       */
      price,

      /*
       * SALE PRICE
       *
       * null = no sale
       */
      salePrice,

      category:
        req.body.category,

      categoryId:
        req.body.categoryId ||
        null,

      image:
        imageUrls[0],

      images:
        imageUrls,

      stock:
        parsePrice(
          req.body.stock
        ) ?? 0,

      lowStockThreshold:
        parsePrice(
          req.body
            .lowStockThreshold
        ) ?? 5,

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

      featured:
        parseBoolean(
          req.body.featured
        ),

      bestSeller:
        parseBoolean(
          req.body.bestSeller
        ),

      newArrival:
        parseBoolean(
          req.body.newArrival
        ),

      isActive:
        parseBoolean(
          req.body.isActive,
          true
        ),
    };

    /*
    |--------------------------------------------------------------------------
    | SAVE
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
    | UPLOAD NEW FILES
    |--------------------------------------------------------------------------
    */

    let uploadedImages = [];

    if (
      req.files &&
      req.files.length > 0
    ) {
      uploadedImages =
        await Promise.all(
          req.files.map(
            (file) =>
              uploadToCloudinary(
                file.buffer
              )
          )
        );
    }

    /*
    |--------------------------------------------------------------------------
    | EXISTING IMAGES
    |--------------------------------------------------------------------------
    */

    const existingImages =
      normalizeArray(
        req.body.existingImages
      );

    /*
    |--------------------------------------------------------------------------
    | NEW URL IMAGES
    |--------------------------------------------------------------------------
    */

    const urlImages =
      normalizeArray(
        req.body.images
      );

    /*
    |--------------------------------------------------------------------------
    | COMBINE IMAGES
    |--------------------------------------------------------------------------
    */

    let imageUrls = [
      ...existingImages,
      ...urlImages,
      ...uploadedImages,
    ];

    /*
    |--------------------------------------------------------------------------
    | KEEP OLD IMAGES
    |--------------------------------------------------------------------------
    */

    if (
      imageUrls.length === 0
    ) {
      imageUrls =
        product.images?.length
          ? product.images
          : product.image
          ? [product.image]
          : [];
    }

    /*
    |--------------------------------------------------------------------------
    | IMAGE REQUIRED
    |--------------------------------------------------------------------------
    */

    if (
      imageUrls.length === 0
    ) {
      return res.status(400).json({
        message:
          "Product must have at least one image",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | REGULAR PRICE
    |--------------------------------------------------------------------------
    */

    const price =
      parsePrice(
        req.body.price
      );

    if (
      price === null ||
      price <= 0
    ) {
      return res.status(400).json({
        message:
          "Please enter a valid product price.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | SALE PRICE
    |--------------------------------------------------------------------------
    */

    let salePrice = null;

    try {
      salePrice =
        parseSalePrice(
          req.body.salePrice,
          price
        );
    } catch (error) {
      return res.status(400).json({
        message:
          error.message,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE DATA
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

      /*
       * REGULAR PRICE
       */
      price,

      /*
       * SALE PRICE
       *
       * ₹3900 regular
       * ₹3700 sale
       *
       * salePrice = 3700
       */
      salePrice,

      category:
        req.body.category,

      categoryId:
        req.body.categoryId ||
        null,

      image:
        imageUrls[0],

      images:
        imageUrls,

      stock:
        parsePrice(
          req.body.stock
        ) ?? 0,

      lowStockThreshold:
        parsePrice(
          req.body
            .lowStockThreshold
        ) ?? 5,

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

      featured:
        parseBoolean(
          req.body.featured,
          product.featured
        ),

      bestSeller:
        parseBoolean(
          req.body.bestSeller,
          product.bestSeller
        ),

      newArrival:
        parseBoolean(
          req.body.newArrival,
          product.newArrival
        ),

      isActive:
        parseBoolean(
          req.body.isActive,
          product.isActive
        ),
    };

    /*
    |--------------------------------------------------------------------------
    | UPDATE DATABASE
    |--------------------------------------------------------------------------
    */

    const updatedProduct =
      await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          returnDocument:
            "after",

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
          returnDocument:
            "after",

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