
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
  ImagePlus,
  X,
  Loader2,
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
  uploadReviewImages,
  getUser,
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

  const productId = product?._id || product?.id;

  // ========================================
  // AUTH STATE
  // ========================================

  const [currentUser, setCurrentUser] = useState(() =>
    getUser()
  );

  const isLoggedIn = Boolean(currentUser);

  const currentUserId =
    currentUser?._id || currentUser?.id;

  // ========================================
  // REVIEW STATE
  // ========================================

  const [reviews, setReviews] = useState([]);

  const [distribution, setDistribution] =
    useState({
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
  // REVIEW PHOTO STATE
  // ========================================

  const [reviewPhotos, setReviewPhotos] =
    useState([]);

  const [uploadingPhotos, setUploadingPhotos] =
    useState(false);

  const [reviewImageViewer, setReviewImageViewer] =
    useState(null);

  // ========================================
  // CHECK AUTH CHANGE
  // ========================================

  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(getUser());
    };

    window.addEventListener(
      "auth-change",
      handleAuthChange
    );

    return () => {
      window.removeEventListener(
        "auth-change",
        handleAuthChange
      );
    };
  }, []);

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

      // ----------------------------------------
      // NOT LOGGED IN
      // ----------------------------------------

      if (!isLoggedIn) {
        setReviewEligibility({
          eligible: false,
          orderId: null,
          reason:
            "Please login to write a review.",
        });

        return;
      }

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
            "You need to purchase and receive this product before reviewing it.",
        });
      }
    };

    checkEligibility();
  }, [id, isLoggedIn]);

  // ========================================
  // CHECK WHETHER CURRENT USER ALREADY REVIEWED
  // ========================================

  const hasUserReviewed = reviews.some(
    (review) => {
      const reviewUserId =
        review.user?._id ||
        review.user?.id ||
        review.user;

      return (
        currentUserId &&
        reviewUserId &&
        String(reviewUserId) ===
          String(currentUserId)
      );
    }
  );

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
  // REVIEW PHOTO SELECT
  // ========================================

  const handleReviewPhotoSelect = (e) => {
    const selectedFiles =
      Array.from(
        e.target.files || []
      );

    if (!selectedFiles.length) return;

    const availableSlots =
      5 - reviewPhotos.length;

    if (availableSlots <= 0) {
      alert(
        "You can upload maximum 5 photos."
      );
      e.target.value = "";
      return;
    }

    const filesToAdd =
      selectedFiles.slice(
        0,
        availableSlots
      );

    const validPhotos = [];

    for (const file of filesToAdd) {
      if (
        !file.type?.startsWith(
          "image/"
        )
      ) {
        alert(
          `${file.name} is not an image file.`
        );
        continue;
      }

      if (
        file.size >
        5 * 1024 * 1024
      ) {
        alert(
          `${file.name} is larger than 5MB.`
        );
        continue;
      }

      validPhotos.push({
        file,
        preview:
          URL.createObjectURL(file),
      });
    }

    setReviewPhotos((prev) => [
      ...prev,
      ...validPhotos,
    ]);

    e.target.value = "";
  };

  // ========================================
  // REMOVE REVIEW PHOTO
  // ========================================

  const removeReviewPhoto = (index) => {
    setReviewPhotos((prev) => {
      const photo = prev[index];

      if (photo?.preview) {
        URL.revokeObjectURL(
          photo.preview
        );
      }

      return prev.filter(
        (_, photoIndex) =>
          photoIndex !== index
      );
    });
  };

  // ========================================
  // CLEAN PHOTO PREVIEWS
  // ========================================

  useEffect(() => {
    return () => {
      reviewPhotos.forEach((photo) => {
        if (photo.preview) {
          URL.revokeObjectURL(
            photo.preview
          );
        }
      });
    };
  }, [reviewPhotos]);

  // ========================================
  // REVIEW SUBMIT
  // ========================================

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    // ----------------------------------------
    // LOGIN CHECK
    // ----------------------------------------

    if (!isLoggedIn) {
      alert(
        "Please login to write a review."
      );

      navigate("/login");
      return;
    }

    // ----------------------------------------
    // ALREADY REVIEWED
    // ----------------------------------------

    if (hasUserReviewed) {
      alert(
        "You have already reviewed this product."
      );
      return;
    }

    // ----------------------------------------
    // ELIGIBILITY
    // ----------------------------------------

    if (!reviewEligibility.eligible) {
      alert(
        reviewEligibility.reason ||
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

      let uploadedImages = [];

      // ----------------------------------------
      // UPLOAD PHOTOS
      // ----------------------------------------

      if (reviewPhotos.length > 0) {
        setUploadingPhotos(true);

        const uploadResponse =
          await uploadReviewImages(
            reviewPhotos.map(
              (photo) => photo.file
            )
          );

        uploadedImages =
          uploadResponse.images || [];

        setUploadingPhotos(false);
      }

      // ----------------------------------------
      // CREATE REVIEW
      // ----------------------------------------

      await createReview({
        productId,
        orderId:
          reviewEligibility.orderId,
        rating: reviewForm.rating,
        title: reviewForm.title,
        comment: reviewForm.comment,
        images: uploadedImages,
      });

      // ----------------------------------------
      // REFRESH REVIEWS
      // ----------------------------------------

      const refreshed =
        await getProductReviews(
          productId
        );

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

      // ----------------------------------------
      // UPDATE PRODUCT RATING
      // ----------------------------------------

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

      // ----------------------------------------
      // RESET FORM
      // ----------------------------------------

      reviewPhotos.forEach((photo) => {
        if (photo.preview) {
          URL.revokeObjectURL(
            photo.preview
          );
        }
      });

      setReviewPhotos([]);

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
      setUploadingPhotos(false);
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
        await getProductReviews(
          productId
        );

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

      // Re-check eligibility
      try {
        const eligibility =
          await getReviewEligibility(
            productId
          );

        setReviewEligibility({
          eligible: Boolean(
            eligibility.eligible
          ),
          orderId:
            eligibility.orderId ||
            null,
          reason:
            eligibility.reason || "",
        });
      } catch {
        setReviewEligibility({
          eligible: true,
          orderId:
            reviewEligibility.orderId,
          reason: "",
        });
      }

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

      {/* BACK */}

      <div className="product-details-container">
        <button
          className="back-shop-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      {/* PRODUCT MAIN */}

      <section className="product-details-container product-main">

        {/* GALLERY */}

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

        {/* PRODUCT INFO */}

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

      {/* REVIEWS */}

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

          {/* WRITE REVIEW */}

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

            {/* --------------------------------
                NOT LOGGED IN
            -------------------------------- */}

            {!isLoggedIn ? (
              <div className="review-not-eligible">

                <div className="review-not-eligible-icon">
                  <Star size={24} />
                </div>

                <h4>
                  Login to share your experience
                </h4>

                <p>
                  Please login to write a
                  review for this product.
                </p>

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
            ) : hasUserReviewed ? (
              /* --------------------------------
                  ALREADY REVIEWED
              -------------------------------- */

              <div className="review-not-eligible">

                <div className="review-not-eligible-icon">
                  <Check size={24} />
                </div>

                <h4>
                  You have already reviewed this product
                </h4>

                <p>
                  Thank you for sharing your
                  experience with other riders.
                </p>

              </div>
            ) : reviewEligibility.eligible ? (
              /* --------------------------------
                  ELIGIBLE
              -------------------------------- */

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

                {/* PHOTO UPLOAD */}

                <div className="review-photo-upload">

                  <div className="review-photo-upload-heading">

                    <div>
                      <strong>
                        Add Photos
                      </strong>

                      <span>
                        Show other riders your experience
                      </span>
                    </div>

                    <span>
                      {reviewPhotos.length}/5
                    </span>

                  </div>

                  <div className="review-photo-grid">

                    {reviewPhotos.map(
                      (photo, index) => (
                        <div
                          className="review-photo-preview"
                          key={`${photo.preview}-${index}`}
                        >

                          <img
                            src={photo.preview}
                            alt={`Review preview ${
                              index + 1
                            }`}
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeReviewPhoto(
                                index
                              )
                            }
                            aria-label="Remove photo"
                          >
                            <X size={15} />
                          </button>

                        </div>
                      )
                    )}

                    {reviewPhotos.length <
                      5 && (
                      <label className="review-photo-add">

                        <ImagePlus
                          size={22}
                        />

                        <span>
                          Add Photo
                        </span>

                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          hidden
                          onChange={
                            handleReviewPhotoSelect
                          }
                        />

                      </label>
                    )}

                  </div>

                  <p className="review-photo-help">
                    Up to 5 photos · JPG, PNG,
                    WEBP · Max 5MB each
                  </p>

                </div>

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={
                    submittingReview ||
                    uploadingPhotos
                  }
                >
                  {uploadingPhotos ? (
                    <>
                      <Loader2
                        size={16}
                        className="review-spinner"
                      />
                      Uploading Photos...
                    </>
                  ) : submittingReview ? (
                    <>
                      <Loader2
                        size={16}
                        className="review-spinner"
                      />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>

              </form>
            ) : (
              /* --------------------------------
                  LOGGED IN BUT NOT ELIGIBLE
              -------------------------------- */

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

              </div>
            )}

          </div>

          {/* REVIEWS LIST */}

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

                    {/* REVIEW PHOTOS */}

                    {review.images?.length >
                      0 && (
                      <div className="review-images">

                        {review.images.map(
                          (image, index) => (
                            <button
                              type="button"
                              className="review-image-thumb"
                              key={`${image}-${index}`}
                              onClick={() =>
                                setReviewImageViewer(
                                  image
                                )
                              }
                            >
                              <img
                                src={image}
                                alt={`Review ${
                                  index + 1
                                }`}
                              />
                            </button>
                          )
                        )}

                      </div>
                    )}

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

      {/* ========================================
          REVIEW IMAGE FULLSCREEN VIEWER
      ======================================== */}

      {reviewImageViewer && (
        <div
          className="review-image-viewer"
          onClick={() =>
            setReviewImageViewer(null)
          }
        >

          <button
            type="button"
            className="review-image-viewer-close"
            onClick={(e) => {
              e.stopPropagation();
              setReviewImageViewer(null);
            }}
          >
            <X size={24} />
          </button>

          <img
            src={reviewImageViewer}
            alt="Review"
            onClick={(e) =>
              e.stopPropagation()
            }
          />

        </div>
      )}

    </main>
  );
};

export default ProductDetails;

