const router = require("express").Router();

const reviewController = require("../controllers/reviewController");
const { auth } = require("../middleware/auth");

// Public
router.get(
  "/product/:productId",
  reviewController.getProductReviews
);

// Logged-in user
router.get(
  "/eligibility/:productId",
  auth,
  reviewController.getReviewEligibility
);

router.post(
  "/",
  auth,
  reviewController.createReview
);

router.put(
  "/:id",
  auth,
  reviewController.updateReview
);

router.delete(
  "/:id",
  auth,
  reviewController.deleteReview
);

router.post(
  "/:id/helpful",
  auth,
  reviewController.markHelpful
);

module.exports = router;