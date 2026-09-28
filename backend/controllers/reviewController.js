const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");
const cloudinary = require("../config/cloudinary");

// ========================================
// CLOUDINARY REVIEW IMAGE UPLOAD
// ========================================

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "saddle-and-crest/reviews",
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

// ========================================
// RECALCULATE PRODUCT RATING
// ========================================

const updateProductRating = async (productId) => {
  const result = await Review.aggregate([
    {
      $match: {
        product: productId,
      },
    },
    {
      $group: {
        _id: "$product",
        averageRating: {
          $avg: "$rating",
        },
        reviewCount: {
          $sum: 1,
        },
      },
    },
  ]);

  if (!result.length) {
    await Product.findByIdAndUpdate(productId, {
      rating: 0,
      reviewCount: 0,
    });

    return;
  }

  const rating =
    Math.round(
      (result[0].averageRating + Number.EPSILON) * 10
    ) / 10;

  await Product.findByIdAndUpdate(productId, {
    rating,
    reviewCount: result[0].reviewCount,
  });
};

// ========================================
// UPLOAD REVIEW PHOTOS
// ========================================

exports.uploadReviewImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "Please select at least one image.",
      });
    }

    if (req.files.length > 5) {
      return res.status(400).json({
        message: "You can upload maximum 5 photos.",
      });
    }

    const invalidFile = req.files.find(
      (file) =>
        !file.mimetype ||
        !file.mimetype.startsWith("image/")
    );

    if (invalidFile) {
      return res.status(400).json({
        message: "Only image files are allowed.",
      });
    }

    const oversizedFile = req.files.find(
      (file) => file.size > 5 * 1024 * 1024
    );

    if (oversizedFile) {
      return res.status(400).json({
        message:
          "Each review photo must be smaller than 5MB.",
      });
    }

    const images = await Promise.all(
      req.files.map((file) =>
        uploadToCloudinary(file.buffer)
      )
    );

    return res.status(201).json({
      message: "Review photos uploaded successfully.",
      images,
    });
  } catch (error) {
    console.error(
      "Review image upload error:",
      error
    );

    return res.status(500).json({
      message: "Unable to upload review photos.",
    });
  }
};

// ========================================
// GET PRODUCT REVIEWS
// ========================================

exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({
      product: productId,
    })
      .populate("user", "name")
      .sort({
        createdAt: -1,
      });

    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    reviews.forEach((review) => {
      distribution[review.rating] =
        (distribution[review.rating] || 0) + 1;
    });

    res.json({
      reviews,
      distribution,
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.error(
      "Get product reviews error:",
      error
    );

    res.status(500).json({
      message: "Unable to fetch reviews.",
    });
  }
};

// ========================================
// CHECK REVIEW ELIGIBILITY
// ========================================

exports.getReviewEligibility = async (req, res) => {
  try {
    const { productId } = req.params;

    const orders = await Order.find({
      user: req.user._id,
      status: "Delivered",
      "items.product": productId,
    }).sort({
      createdAt: -1,
    });

    if (!orders.length) {
      return res.json({
        eligible: false,
        reason:
          "You need a delivered order containing this product to write a review.",
      });
    }

    for (const order of orders) {
      const existingReview = await Review.findOne({
        user: req.user._id,
        product: productId,
        order: order._id,
      });

      if (!existingReview) {
        return res.json({
          eligible: true,
          orderId: order._id,
          isVerifiedPurchase: true,
        });
      }
    }

    return res.json({
      eligible: false,
      reason: "You have already reviewed this product.",
    });
  } catch (error) {
    console.error(
      "Review eligibility error:",
      error
    );

    res.status(500).json({
      message: "Unable to check review eligibility.",
    });
  }
};

// ========================================
// CREATE REVIEW
// ========================================

exports.createReview = async (req, res) => {
  try {
    const {
      productId,
      orderId,
      rating,
      title,
      comment,
      images = [],
    } = req.body;

    if (!productId || !orderId) {
      return res.status(400).json({
        message: "Product and order are required.",
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5.",
      });
    }

    if (!comment?.trim()) {
      return res.status(400).json({
        message: "Review comment is required.",
      });
    }

    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
      status: "Delivered",
      "items.product": productId,
    });

    if (!order) {
      return res.status(403).json({
        message:
          "You can review this product only after receiving your order.",
      });
    }

    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId,
      order: orderId,
    });

    if (existingReview) {
      return res.status(409).json({
        message:
          "You have already reviewed this product for this order.",
      });
    }

    const safeImages = Array.isArray(images)
      ? images
          .filter(
            (image) =>
              typeof image === "string" &&
              image.trim()
          )
          .slice(0, 5)
      : [];

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      order: orderId,
      rating: numericRating,
      title: title?.trim() || "",
      comment: comment.trim(),
      images: safeImages,
      isVerifiedPurchase: true,
    });

    await updateProductRating(product._id);

    const populatedReview =
      await Review.findById(review._id).populate(
        "user",
        "name"
      );

    res.status(201).json({
      message: "Review submitted successfully.",
      review: populatedReview,
    });
  } catch (error) {
    console.error(
      "Create review error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        message:
          "You have already submitted this review.",
      });
    }

    res.status(500).json({
      message: "Unable to submit review.",
    });
  }
};

// ========================================
// UPDATE OWN REVIEW
// ========================================

exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      rating,
      title,
      comment,
      images = [],
    } = req.body;

    const review = await Review.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found.",
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5.",
      });
    }

    if (!comment?.trim()) {
      return res.status(400).json({
        message: "Review comment is required.",
      });
    }

    review.rating = numericRating;
    review.title = title?.trim() || "";
    review.comment = comment.trim();

    if (Array.isArray(images)) {
      review.images = images
        .filter(
          (image) =>
            typeof image === "string" &&
            image.trim()
        )
        .slice(0, 5);
    }

    await review.save();

    await updateProductRating(review.product);

    const updatedReview =
      await Review.findById(review._id).populate(
        "user",
        "name"
      );

    res.json({
      message: "Review updated successfully.",
      review: updatedReview,
    });
  } catch (error) {
    console.error(
      "Update review error:",
      error
    );

    res.status(500).json({
      message: "Unable to update review.",
    });
  }
};

// ========================================
// DELETE OWN REVIEW
// ========================================

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found.",
      });
    }

    const productId = review.product;

    await Review.deleteOne({
      _id: review._id,
    });

    await updateProductRating(productId);

    res.json({
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete review error:",
      error
    );

    res.status(500).json({
      message: "Unable to delete review.",
    });
  }
};

// ========================================
// HELPFUL REVIEW
// ========================================

exports.markHelpful = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found.",
      });
    }

    const alreadyHelpful =
      review.helpfulUsers.some(
        (userId) =>
          userId.toString() ===
          req.user._id.toString()
      );

    if (alreadyHelpful) {
      return res.status(400).json({
        message:
          "You have already marked this review as helpful.",
      });
    }

    review.helpfulUsers.push(req.user._id);
    review.helpfulCount += 1;

    await review.save();

    res.json({
      message: "Review marked as helpful.",
      helpfulCount: review.helpfulCount,
    });
  } catch (error) {
    console.error(
      "Mark helpful error:",
      error
    );

    res.status(500).json({
      message:
        "Unable to mark review as helpful.",
    });
  }
};