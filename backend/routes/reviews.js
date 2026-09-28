const router = require("express").Router();
const multer = require("multer");

const reviewController = require("../controllers/reviewController");
const { auth } = require("../middleware/auth");

// ========================================
// MULTER
// ========================================

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    files: 5,
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (
      file.mimetype &&
      file.mimetype.startsWith("image/")
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only image files are allowed."
        )
      );
    }
  },
});

// ========================================
// PUBLIC
// ========================================

router.get(
  "/product/:productId",
  reviewController.getProductReviews
);

// ========================================
// LOGGED-IN USER
// ========================================

router.get(
  "/eligibility/:productId",
  auth,
  reviewController.getReviewEligibility
);

// ========================================
// REVIEW PHOTO UPLOAD
// ========================================

router.post(
  "/upload-images",
  auth,
  upload.array("images", 5),
  reviewController.uploadReviewImages
);

// ========================================
// CREATE REVIEW
// ========================================

router.post(
  "/",
  auth,
  reviewController.createReview
);

// ========================================
// UPDATE REVIEW
// ========================================

router.put(
  "/:id",
  auth,
  reviewController.updateReview
);

// ========================================
// DELETE REVIEW
// ========================================

router.delete(
  "/:id",
  auth,
  reviewController.deleteReview
);

// ========================================
// HELPFUL
// ========================================

router.post(
  "/:id/helpful",
  auth,
  reviewController.markHelpful
);

module.exports = router;