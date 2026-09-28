
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Check,
  Truck,
  Star,
  ThumbsUp,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import { useShop } from "../ShopContext/ShopContext";

import {
  getProduct,
  getProductReviews,
  getReviewEligibility,
  createReview,
  deleteReview,
  markReviewHelpful,
} from "../services/api";

import "./ProductDetails.css";
import Navbar from "../components/Navbar";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    addToCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useShop();

  // ========================================
  // PRODUCT STATE
  // ========================================

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [addingCart, setAddingCart] = useState(false);

  // Product ID
  const productId = product?._id || product?.id;

  // ========================================
  // REVIEW STATE
  // ========================================

  const [reviews, setReviews] = useState([]);

  const [distribution, setDistribution] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });

  const [reviewLoading, setReviewLoading] =
    useState(true);

  const [reviewEligibility, setReviewEligibility] =
    useState({
      eligible: false,
      orderId: null,
      reason: "",
    });

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: "",
    comment: "",
  });

  const [submittingReview, setSubmittingReview] =
    useState(false);

  // ========================================
  // FETCH PRODUCT
  // ========================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProduct(id);

        const fetchedProduct =
          data.product || data;

        setProduct(fetchedProduct);

        const firstImage =
          fetchedProduct.images?.[0] ||
          fetchedProduct.image ||
          "";

        setSelectedImage(firstImage);
        setQuantity(1);
      } catch (err) {
        setError(
          err.message ||
            "Unable to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // ========================================
  // FETCH REVIEWS
  // ========================================

  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;

      try {
        setReviewLoading(true);

        const data =
          await getProductReviews(id);

        setReviews(data.reviews || []);

        setDistribution(
          data.distribution || {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0,
          }
        );
      } catch (error) {
        console.error(
          "Reviews fetch error:",
          error
        );

        setReviews([]);

        setDistribution({
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        });
      } finally {
        setReviewLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  // ========================================
  // CHECK REVIEW ELIGIBILITY
  // ========================================

  useEffect(() => {
    const checkEligibility = async () => {
      if (!id) return;

      try {
        const data =
          await getReviewEligibility(id);

        console.log(
          "Review eligibility:",
          data
        );

        setReviewEligibility({
          eligible: Boolean(data.eligible),
          orderId: data.orderId || null,
          reason: data.reason || "",
        });
      } catch (error) {
        console.log(
          "Review eligibility check:",
          error.message
        );

        setReviewEligibility({
          eligible: false,
          orderId: null,
          reason:
            "Login and receive this product to write a review.",
        });
      }
    };

    checkEligibility();
  }, [id]);

  // ========================================
  // PRICE
  // ========================================

  const getPrice = () => {
    if (!product) return 0;

    return Number(
      product.salePrice ||
        product.price ||
        0
    );
  };

  const getOriginalPrice = () => {
    if (!product) return 0;

    return Number(product.price || 0);
  };

  const hasDiscount =
    product &&
    product.salePrice &&
    Number(product.salePrice) <
      Number(product.price);

  // ========================================
  // IMAGES
  // ========================================

  const images =
    product?.images?.length
      ? product.images
      : product?.image
      ? [product.image]
      : [];

  // ========================================
  // QUANTITY
  // ========================================

  const handleQuantity = (type) => {
    if (type === "increase") {
      if (
        quantity <
        (product?.stock || 1)
      ) {
        setQuantity(
          (prev) => prev + 1
        );
      }
    } else {
      setQuantity((prev) =>
        Math.max(1, prev - 1)
      );
    }
  };

  // ========================================
  // ADD TO CART
  // ========================================

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setAddingCart(true);

      await addToCart(
        product,
        quantity
      );

      navigate("/cart");
    } catch (err) {
      alert(
        err.message ||
          "Unable to add product to cart"
      );
    } finally {
      setAddingCart(false);
    }
  };

  // ========================================
  // WISHLIST
  // ========================================

  const handleWishlist = async () => {
    if (!product) return;

    try {
      if (
        isInWishlist(productId)
      ) {
        await removeFromWishlist(
          productId
        );
      } else {
        await addToWishlist(product);
      }
    } catch (err) {
      alert(
        err.message ||
          "Wishlist update failed"
      );
    }
  };

  // ========================================
  // REVIEW SUBMIT
  // ========================================

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!reviewEligibility.eligible) {
      alert(
        "You can review this product after receiving your order."
      );
      return;
    }

    if (!reviewForm.comment.trim()) {
      alert(
        "Please write your review."
      );
      return;
    }

    if (!reviewEligibility.orderId) {
      alert(
        "Your delivered order could not be found."
      );
      return;
    }

    if (!productId) {
      alert(
        "Product information is missing."
      );
      return;
    }

    try {
      setSubmittingReview(true);

      await createReview({
        productId,
        orderId:
          reviewEligibility.orderId,
        rating: reviewForm.rating,
        title: reviewForm.title,
        comment: reviewForm.comment,
      });

      const refreshed =
        await getProductReviews(productId);

      const refreshedReviews =
        refreshed.reviews || [];

      setReviews(refreshedReviews);

      setDistribution(
        refreshed.distribution || {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        }
      );

      const refreshedRating =
        refreshedReviews.length > 0
          ? Number(
              (
                refreshedReviews.reduce(
                  (sum, review) =>
                    sum +
                    Number(
                      review.rating || 0
                    ),
                  0
                ) /
                refreshedReviews.length
              ).toFixed(1)
            )
          : 0;

      setProduct((prev) => ({
        ...prev,
        rating: refreshedRating,
        reviewCount:
          refreshedReviews.length,
      }));

      setReviewForm({
        rating: 5,
        title: "",
        comment: "",
      });

      setReviewEligibility({
        eligible: false,
        orderId: null,
        reason:
          "You have already reviewed this product.",
      });

      alert(
        "Review submitted successfully."
      );
    } catch (error) {
      console.error(
        "Review submit error:",
        error
      );

      alert(
        error.message ||
          "Unable to submit review."
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  // ========================================
  // DELETE REVIEW
  // ========================================

  const handleDeleteReview = async (
    reviewId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your review?"
    );

    if (!confirmed) return;

    try {
      await deleteReview(reviewId);

      const refreshed =
        await getProductReviews(productId);

      const refreshedReviews =
        refreshed.reviews || [];

      setReviews(refreshedReviews);

      setDistribution(
        refreshed.distribution || {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        }
      );

      const refreshedRating =
        refreshedReviews.length > 0
          ? Number(
              (
                refreshedReviews.reduce(
                  (sum, review) =>
                    sum +
                    Number(
                      review.rating || 0
                    ),
                  0
                ) /
                refreshedReviews.length
              ).toFixed(1)
            )
          : 0;

      setProduct((prev) => ({
        ...prev,
        rating: refreshedRating,
        reviewCount:
          refreshedReviews.length,
      }));

      setReviewEligibility({
        eligible: true,
        orderId:
          reviewEligibility.orderId,
        reason: "",
      });

      alert(
        "Review deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete review error:",
        error
      );

      alert(
        error.message ||
          "Unable to delete review."
      );
    }
  };

  // ========================================
  // HELPFUL
  // ========================================

  const handleHelpful = async (
    reviewId
  ) => {
    try {
      const data =
        await markReviewHelpful(
          reviewId
        );

      setReviews((prev) =>
        prev.map((review) =>
          review._id === reviewId
            ? {
                ...review,
                helpfulCount:
                  data.helpfulCount,
              }
            : review
        )
      );
    } catch (error) {
      alert(
        error.message ||
          "Unable to mark review as helpful."
      );
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="product-details-loading">
        <div className="product-loader"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error || !product) {
    return (
      <div className="product-details-error">
        <h2>Product Not Found</h2>

        <p>
          {error ||
            "This product is no longer available."}
        </p>

        <button
          onClick={() =>
            navigate("/shop")
          }
        >
          <ArrowLeft size={18} />
          Back to Shop
        </button>
      </div>
    );
  }

  // ========================================
  // RENDER
  // ========================================

  return (
    <main className="product-details-page">

      <Navbar />

      {/* ========================================
          BACK
      ======================================== */}

      <div className="product-details-container">
        <button
          className="back-shop-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      {/* ========================================
          PRODUCT MAIN
      ======================================== */}

      <section className="product-details-container product-main">

        {/* ========================================
            LEFT - GALLERY
        ======================================== */}

        <div className="product-gallery">

          <div className="product-thumbnails">

            {images.map(
              (image, index) => (
                <button
                  key={`${image}-${index}`}
                  className={
                    selectedImage === image
                      ? "thumbnail active"
                      : "thumbnail"
                  }
                  onClick={() =>
                    setSelectedImage(image)
                  }
                >
                  <img
                    src={image}
                    alt={`${product.name} ${
                      index + 1
                    }`}
                  />
                </button>
              )
            )}

          </div>

          <div className="product-main-image">

            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.name}
              />
            ) : (
              <div className="no-product-image">
                No Image
              </div>
            )}

            {product.badge && (
              <span className="product-badge">
                {product.badge}
              </span>
            )}

          </div>

        </div>

        {/* ========================================
            RIGHT - PRODUCT INFO
        ======================================== */}

        <div className="product-info">

          {product.category && (
            <span className="product-category">
              {product.category}
            </span>
          )}

          <h1>{product.name}</h1>

          {/* PRODUCT RATING */}

          <div className="product-rating-summary">

            <div className="rating-stars">

              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <Star
                    key={star}
                    size={17}
                    fill={
                      star <=
                      Math.round(
                        product.rating || 0
                      )
                        ? "currentColor"
                        : "none"
                    }
                  />
                )
              )}

            </div>

            <strong>
              {Number(
                product.rating || 0
              ).toFixed(1)}
            </strong>

            <span>
              (
              {product.reviewCount ||
                0}{" "}
              reviews)
            </span>

          </div>

          {/* PRICE */}

          <div className="product-price-row">

            <span className="product-current-price">
              ₹
              {getPrice().toLocaleString(
                "en-IN"
              )}
            </span>

            {hasDiscount && (
              <span className="product-original-price">
                ₹
                {getOriginalPrice().toLocaleString(
                  "en-IN"
                )}
              </span>
            )}

            {hasDiscount && (
              <span className="discount-label">
                {Math.round(
                  ((getOriginalPrice() -
                    getPrice()) /
                    getOriginalPrice()) *
                    100
                )}
                % OFF
              </span>
            )}

          </div>

          {/* SHORT DESCRIPTION */}

          {product.shortDescription && (
            <p className="product-short-description">
              {product.shortDescription}
            </p>
          )}

          {/* DESCRIPTION */}

          {product.description && (
            <div className="product-description">

              <h3>
                Description
              </h3>

              <p>
                {product.description}
              </p>

            </div>
          )}

          {/* SIZES */}

          {product.sizes?.length > 0 && (
            <div className="product-option">

              <div className="option-heading">
                <span>Size</span>
              </div>

              <div className="size-options">

                {product.sizes.map(
                  (size) => (
                    <button
                      key={size}
                    >
                      {size}
                    </button>
                  )
                )}

              </div>

            </div>
          )}

          {/* COLORS */}

          {product.colors?.length > 0 && (
            <div className="product-option">

              <div className="option-heading">
                <span>Color</span>
              </div>

              <div className="color-options">

                {product.colors.map(
                  (color) => (
                    <span
                      key={color}
                      className="color-option"
                    >
                      {color}
                    </span>
                  )
                )}

              </div>

            </div>
          )}

          {/* STOCK */}

          <div className="stock-info">

            {product.stock > 0 ? (
              <>
                <Check size={17} />

                {product.stock <=
                (product.lowStockThreshold ||
                  5)
                  ? `Only ${product.stock} left in stock`
                  : "In stock"}
              </>
            ) : (
              "Out of stock"
            )}

          </div>

          {/* QUANTITY */}

          {product.stock > 0 && (
            <div className="quantity-section">

              <span>
                Quantity
              </span>

              <div className="quantity-control">

                <button
                  onClick={() =>
                    handleQuantity(
                      "decrease"
                    )
                  }
                  disabled={
                    quantity <= 1
                  }
                >
                  <Minus size={16} />
                </button>

                <span>
                  {quantity}
                </span>

                <button
                  onClick={() =>
                    handleQuantity(
                      "increase"
                    )
                  }
                  disabled={
                    quantity >=
                    product.stock
                  }
                >
                  <Plus size={16} />
                </button>

              </div>

            </div>
          )}

          {/* ACTIONS */}

          <div className="product-actions">

            <button
              className="add-cart-btn"
              onClick={
                handleAddToCart
              }
              disabled={
                product.stock <= 0 ||
                addingCart
              }
            >
              <ShoppingBag
                size={20}
              />

              {addingCart
                ? "Adding..."
                : product.stock <= 0
                ? "Out of Stock"
                : "Add to Cart"}
            </button>

            <button
              className={
                isInWishlist(productId)
                  ? "wishlist-btn active"
                  : "wishlist-btn"
              }
              onClick={
                handleWishlist
              }
            >
              <Heart
                size={21}
                fill={
                  isInWishlist(
                    productId
                  )
                    ? "currentColor"
                    : "none"
                }
              />
            </button>

          </div>

          {/* BENEFITS */}

          <div className="product-benefits">

            <div>

              <Truck size={22} />

              <div>

                <strong>
                  Reliable Delivery
                </strong>

                <span>
                  Carefully packed and
                  delivered to your
                  doorstep.
                </span>

              </div>

            </div>

            <div>

              <Check size={22} />

              <div>

                <strong>
                  Quality Assured
                </strong>

                <span>
                  Crafted with attention
                  to detail.
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ========================================
          REVIEWS SECTION
      ======================================== */}

      <section className="reviews-section">

        <div className="reviews-container">

          {/* HEADING */}

          <div className="reviews-heading">

            <div>

              <span className="reviews-eyebrow">
                CUSTOMER EXPERIENCE
              </span>

              <h2>
                Reviews & Ratings
              </h2>

              <p>
                Hear from riders and
                equestrian enthusiasts
                who chose Saddle & Crest.
              </p>

            </div>

          </div>

          {/* RATING OVERVIEW */}

          <div className="reviews-overview">

            <div className="overall-rating">

              <strong>
                {Number(
                  product.rating || 0
                ).toFixed(1)}
              </strong>

              <div className="large-stars">

                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <Star
                      key={star}
                      size={20}
                      fill={
                        star <=
                        Math.round(
                          product.rating || 0
                        )
                          ? "currentColor"
                          : "none"
                      }
                    />
                  )
                )}

              </div>

              <span>
                {product.reviewCount ||
                  0}{" "}
                verified reviews
              </span>

            </div>

            <div className="rating-distribution">

              {[5, 4, 3, 2, 1].map(
                (rating) => {

                  const count =
                    distribution[
                      rating
                    ] || 0;

                  const total =
                    reviews.length || 1;

                  const percentage =
                    (count / total) *
                    100;

                  return (
                    <div
                      className="rating-row"
                      key={rating}
                    >

                      <span>
                        {rating}
                      </span>

                      <Star
                        size={14}
                        fill="currentColor"
                      />

                      <div className="rating-bar">

                        <span
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                      <small>
                        {count}
                      </small>

                    </div>
                  );
                }
              )}

            </div>

          </div>

          {/* ========================================
              WRITE REVIEW
          ======================================== */}

          <div className="write-review-card">

            <div>

              <span className="reviews-eyebrow">
                YOUR EXPERIENCE
              </span>

              <h3>
                Share your experience
              </h3>

              <p>
                Your review helps other
                riders make better
                choices.
              </p>

            </div>

            {reviewEligibility.eligible ? (
              <form
                className="review-form"
                onSubmit={
                  handleReviewSubmit
                }
              >

                {/* RATING */}

                <div className="review-rating-selector">

                  <span>
                    Your Rating
                  </span>

                  <div>

                    {[1, 2, 3, 4, 5].map(
                      (star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() =>
                            setReviewForm(
                              (prev) => ({
                                ...prev,
                                rating:
                                  star,
                              })
                            )
                          }
                        >
                          <Star
                            size={25}
                            fill={
                              star <=
                              reviewForm.rating
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>
                      )
                    )}

                  </div>

                </div>

                {/* TITLE */}

                <input
                  type="text"
                  placeholder="Review title"
                  value={
                    reviewForm.title
                  }
                  maxLength={120}
                  onChange={(e) =>
                    setReviewForm(
                      (prev) => ({
                        ...prev,
                        title:
                          e.target.value,
                      })
                    )
                  }
                />

                {/* COMMENT */}

                <textarea
                  placeholder="Tell us about your experience..."
                  value={
                    reviewForm.comment
                  }
                  maxLength={2000}
                  rows={5}
                  onChange={(e) =>
                    setReviewForm(
                      (prev) => ({
                        ...prev,
                        comment:
                          e.target.value,
                      })
                    )
                  }
                />

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={
                    submittingReview
                  }
                >
                  {submittingReview
                    ? "Submitting..."
                    : "Submit Review"}
                </button>

              </form>
            ) : (
              <div className="review-not-eligible">

                <div className="review-not-eligible-icon">
                  <Star size={24} />
                </div>

                <h4>
                  Review after your purchase
                </h4>

                <p>
                  You can share your experience
                  once you have received and
                  completed your order.
                </p>

                {reviewEligibility.reason && (
                  <span className="review-eligibility-reason">
                    {reviewEligibility.reason}
                  </span>
                )}

                <button
                  type="button"
                  className="review-login-btn"
                  onClick={() =>
                    navigate("/login")
                  }
                >
                  Login to Review
                </button>

              </div>
            )}

          </div>

          {/* ========================================
              REVIEWS LIST
          ======================================== */}

          <div className="reviews-list">

            {reviewLoading ? (
              <div className="reviews-loading">
                Loading reviews...
              </div>
            ) : reviews.length ===
              0 ? (
              <div className="no-reviews">

                <Star size={32} />

                <h3>
                  No reviews yet
                </h3>

                <p>
                  Be the first customer
                  to share your
                  experience.
                </p>

              </div>
            ) : (
              reviews.map(
                (review) => (
                  <article
                    className="review-card"
                    key={review._id}
                  >

                    {/* TOP */}

                    <div className="review-card-top">

                      <div className="review-user">

                        <div className="review-avatar">
                          {review.user?.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "C"}
                        </div>

                        <div>

                          <strong>
                            {review.user
                              ?.name ||
                              "Customer"}
                          </strong>

                          {review.isVerifiedPurchase && (
                            <span className="verified-review">
                              <Check
                                size={13}
                              />
                              Verified
                              Purchase
                            </span>
                          )}

                        </div>

                      </div>

                      <div className="review-stars">

                        {[1, 2, 3, 4, 5].map(
                          (star) => (
                            <Star
                              key={star}
                              size={15}
                              fill={
                                star <=
                                review.rating
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          )
                        )}

                      </div>

                    </div>

                    {/* TITLE */}

                    {review.title && (
                      <h3 className="review-title">
                        {review.title}
                      </h3>
                    )}

                    {/* COMMENT */}

                    <p className="review-comment">
                      {review.comment}
                    </p>

                    {/* BOTTOM */}

                    <div className="review-card-bottom">

                      <button
                        type="button"
                        onClick={() =>
                          handleHelpful(
                            review._id
                          )
                        }
                      >
                        <ThumbsUp
                          size={15}
                        />

                        Helpful (
                        {
                          review.helpfulCount ||
                          0
                        }
                        )
                      </button>

                      <span>
                        {new Date(
                          review.createdAt
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>

                    </div>

                  </article>
                )
              )
            )}

          </div>

        </div>

      </section>

    </main>
  );
};

export default ProductDetails;
