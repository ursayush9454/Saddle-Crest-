import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Check,
  Truck,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useShop } from "../ShopContext/ShopContext";
import { getProduct } from "../services/api";
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

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [addingCart, setAddingCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProduct(id);

        const fetchedProduct = data.product || data;

        setProduct(fetchedProduct);

        const firstImage =
          fetchedProduct.images?.[0] ||
          fetchedProduct.image ||
          "";

        setSelectedImage(firstImage);
      } catch (err) {
        setError(err.message || "Unable to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

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
    Number(product.salePrice) < Number(product.price);

  const images =
    product?.images?.length
      ? product.images
      : product?.image
      ? [product.image]
      : [];

  const handleQuantity = (type) => {
    if (type === "increase") {
      if (quantity < (product?.stock || 1)) {
        setQuantity((prev) => prev + 1);
      }
    } else {
      setQuantity((prev) => Math.max(1, prev - 1));
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setAddingCart(true);

      await addToCart(product, quantity);

      navigate("/cart");
    } catch (err) {
      alert(err.message || "Unable to add product to cart");
    } finally {
      setAddingCart(false);
    }
  };

  const handleWishlist = async () => {
    if (!product) return;

    try {
      if (isInWishlist(product._id || product.id)) {
        await removeFromWishlist(product._id || product.id);
      } else {
        await addToWishlist(product);
      }
    } catch (err) {
      alert(err.message || "Wishlist update failed");
    }
  };

  if (loading) {
    return (
      
      <div className="product-details-loading">
        <div className="product-loader"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-error">
        <h2>Product Not Found</h2>
        <p>{error || "This product is no longer available."}</p>

        <button onClick={() => navigate("/shop")}>
          <ArrowLeft size={18} />
          Back to Shop
        </button>
      </div>
    );
  }

  const productId = product._id || product.id;

  return (
    <main className="product-details-page">
        <Navbar/>
      {/* Back */}
      <div className="product-details-container">
        <button
          className="back-shop-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      <section className="product-details-container product-main">

        {/* LEFT */}
        <div className="product-gallery">

          <div className="product-thumbnails">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                className={
                  selectedImage === image
                    ? "thumbnail active"
                    : "thumbnail"
                }
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                />
              </button>
            ))}
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

        {/* RIGHT */}
        <div className="product-info">

          {product.category && (
            <span className="product-category">
              {product.category}
            </span>
          )}

          <h1>{product.name}</h1>

          <div className="product-price-row">

            <span className="product-current-price">
              ₹{getPrice().toLocaleString("en-IN")}
            </span>

            {hasDiscount && (
              <span className="product-original-price">
                ₹{getOriginalPrice().toLocaleString("en-IN")}
              </span>
            )}

            {hasDiscount && (
              <span className="discount-label">
                {Math.round(
                  ((getOriginalPrice() - getPrice()) /
                    getOriginalPrice()) *
                    100
                )}
                % OFF
              </span>
            )}

          </div>

          {product.shortDescription && (
            <p className="product-short-description">
              {product.shortDescription}
            </p>
          )}

          {product.description && (
            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          )}

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="product-option">
              <div className="option-heading">
                <span>Size</span>
              </div>

              <div className="size-options">
                {product.sizes.map((size) => (
                  <button key={size}>
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="product-option">
              <div className="option-heading">
                <span>Color</span>
              </div>

              <div className="color-options">
                {product.colors.map((color) => (
                  <span
                    key={color}
                    className="color-option"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          <div className="stock-info">
            {product.stock > 0 ? (
              <>
                <Check size={17} />
                {product.stock <=
                (product.lowStockThreshold || 5)
                  ? `Only ${product.stock} left in stock`
                  : "In stock"}
              </>
            ) : (
              "Out of stock"
            )}
          </div>

          {/* Quantity */}
          {product.stock > 0 && (
            <div className="quantity-section">

              <span>Quantity</span>

              <div className="quantity-control">

                <button
                  onClick={() =>
                    handleQuantity("decrease")
                  }
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>

                <span>{quantity}</span>

                <button
                  onClick={() =>
                    handleQuantity("increase")
                  }
                  disabled={
                    quantity >= product.stock
                  }
                >
                  <Plus size={16} />
                </button>

              </div>

            </div>
          )}

          {/* Actions */}
          <div className="product-actions">

            <button
              className="add-cart-btn"
              onClick={handleAddToCart}
              disabled={
                product.stock <= 0 || addingCart
              }
            >
              <ShoppingBag size={20} />

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
              onClick={handleWishlist}
            >
              <Heart
                size={21}
                fill={
                  isInWishlist(productId)
                    ? "currentColor"
                    : "none"
                }
              />
            </button>

          </div>

          {/* Benefits */}
          <div className="product-benefits">

            <div>
              <Truck size={22} />
              <div>
                <strong>Reliable Delivery</strong>
                <span>
                  Carefully packed and delivered
                  to your doorstep.
                </span>
              </div>
            </div>

            <div>
              <Check size={22} />
              <div>
                <strong>Quality Assured</strong>
                <span>
                  Crafted with attention to detail.
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

    </main>
  );
};

export default ProductDetails;