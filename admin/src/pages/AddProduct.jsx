import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ImagePlus,
  Plus,
  Save,
  Upload,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import "./AddProduct.css";

const DEFAULT_CATEGORIES = [
  "Saddles",
  "Bridles",
  "Rider",
  "Horse Care",
  "Leather Goods",
  "Custom",
];

const BADGES = [
  "None",
  "New",
  "Best Seller",
  "Featured",
  "Limited",
  "Sale",
];

const initialForm = {
  name: "",
  description: "",
  price: "",
  comparePrice: "",
  category: "",
  badge: "",
  sku: "",
  stock: "",
  images: [],
  featured: false,
  bestSeller: false,
  newArrival: false,
  isActive: true,
};

const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  /*
   * If Products page sends a product through
   * navigate("/add-product", { state: { product } })
   * then we are in EDIT mode.
   */
  const editingProduct = location.state?.product || null;
  const isEditMode = Boolean(editingProduct?._id);

  const [form, setForm] = useState(initialForm);

  const [categories, setCategories] =
    useState(DEFAULT_CATEGORIES);

  const [imageUrl, setImageUrl] = useState("");

  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [saving, setSaving] = useState(false);

  /*
   * ==========================================
   * NORMALIZE EXISTING PRODUCT IMAGES
   * ==========================================
   */
  const getExistingImages = (product) => {
    if (!product) {
      return [];
    }

    const images = Array.isArray(product.images)
      ? product.images.filter(Boolean)
      : [];

    /*
     * If images[] is empty but main image exists,
     * use main image.
     */
    if (!images.length && product.image) {
      return [product.image];
    }

    return images;
  };

  /*
   * ==========================================
   * FETCH CATEGORIES
   * ==========================================
   */

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);

        const data = await apiRequest("/categories");

        const backendCategories =
          Array.isArray(data?.categories)
            ? data.categories
            : Array.isArray(data)
              ? data
              : [];

        const backendNames = backendCategories
          .map((category) =>
            typeof category === "string"
              ? category
              : category?.name
          )
          .filter(Boolean);

        const merged = [
          ...DEFAULT_CATEGORIES,
          ...backendNames,
        ].filter(
          (name, index, array) =>
            array.findIndex(
              (item) =>
                item.toLowerCase() ===
                name.toLowerCase()
            ) === index
        );

        setCategories(merged);
      } catch (error) {
        console.error(
          "Failed to fetch categories:",
          error
        );

        setCategories(DEFAULT_CATEGORIES);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  /*
   * ==========================================
   * POPULATE FORM FOR EDIT MODE
   * ==========================================
   */

  useEffect(() => {
    if (!editingProduct) {
      setForm(initialForm);
      return;
    }

    const existingImages =
      getExistingImages(editingProduct);

    setForm({
      name: editingProduct.name || "",

      description:
        editingProduct.description || "",

      price:
        editingProduct.price !== undefined &&
        editingProduct.price !== null
          ? String(editingProduct.price)
          : "",

      /*
       * Backend field is salePrice.
       * UI field is comparePrice.
       */
      comparePrice:
        editingProduct.salePrice !== undefined &&
        editingProduct.salePrice !== null
          ? String(editingProduct.salePrice)
          : "",

      category:
        editingProduct.category || "",

      badge:
        editingProduct.badge || "",

      sku:
        editingProduct.sku || "",

      stock:
        editingProduct.stock !== undefined &&
        editingProduct.stock !== null
          ? String(editingProduct.stock)
          : "",

      /*
       * Existing backend URLs are represented
       * as URL images so they remain visible.
       */
      images: existingImages.map((url) => ({
        type: "url",
        url,
        preview: url,
      })),

      featured:
        Boolean(editingProduct.featured),

      bestSeller:
        Boolean(editingProduct.bestSeller),

      newArrival:
        Boolean(editingProduct.newArrival),

      isActive:
        editingProduct.isActive !== undefined
          ? Boolean(editingProduct.isActive)
          : true,
    });

    setImageUrl("");
  }, [editingProduct]);

  /*
   * ==========================================
   * INPUT CHANGE
   * ==========================================
   */

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /*
   * ==========================================
   * IMAGE FILE SELECT
   * ==========================================
   */

  const handleFileSelect = (event) => {
    const files = Array.from(
      event.target.files || []
    );

    if (!files.length) {
      return;
    }

    const imageFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    if (!imageFiles.length) {
      alert(
        "Please select valid image files."
      );

      event.target.value = "";
      return;
    }

    const availableSlots =
      10 - form.images.length;

    if (availableSlots <= 0) {
      alert(
        "Maximum 10 images are allowed."
      );

      event.target.value = "";
      return;
    }

    const selectedFiles =
      imageFiles.slice(0, availableSlots);

    const newImages = selectedFiles.map(
      (file) => ({
        type: "file",
        file,
        preview: URL.createObjectURL(file),
      })
    );

    setForm((previous) => ({
      ...previous,
      images: [
        ...previous.images,
        ...newImages,
      ],
    }));

    event.target.value = "";
  };

  /*
   * ==========================================
   * ADD IMAGE URL
   * ==========================================
   */

  const addImage = () => {
    const url = imageUrl.trim();

    if (!url) {
      alert("Please enter an image URL.");
      return;
    }

    if (form.images.length >= 10) {
      alert(
        "Maximum 10 images are allowed."
      );
      return;
    }

    try {
      new URL(url);
    } catch {
      alert(
        "Please enter a valid image URL."
      );
      return;
    }

    const alreadyExists = form.images.some(
      (image) =>
        image.type === "url" &&
        image.url === url
    );

    if (alreadyExists) {
      alert(
        "This image has already been added."
      );
      return;
    }

    setForm((previous) => ({
      ...previous,
      images: [
        ...previous.images,
        {
          type: "url",
          url,
          preview: url,
        },
      ],
    }));

    setImageUrl("");
  };

  /*
   * ==========================================
   * REMOVE IMAGE
   * ==========================================
   */

  const removeImage = (index) => {
    setForm((previous) => {
      const image = previous.images[index];

      if (
        image?.type === "file" &&
        image?.preview
      ) {
        URL.revokeObjectURL(
          image.preview
        );
      }

      return {
        ...previous,
        images: previous.images.filter(
          (_, imageIndex) =>
            imageIndex !== index
        ),
      };
    });
  };

  /*
   * ==========================================
   * CLEANUP PREVIEW URLS
   * ==========================================
   */

  useEffect(() => {
    return () => {
      form.images.forEach((image) => {
        if (
          image.type === "file" &&
          image.preview
        ) {
          URL.revokeObjectURL(
            image.preview
          );
        }
      });
    };
  }, []);

  /*
   * ==========================================
   * SUBMIT
   * ==========================================
   */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      alert(
        "Product name is required."
      );
      return;
    }

    if (!form.description.trim()) {
      alert(
        "Product description is required."
      );
      return;
    }

    if (
      !form.price ||
      Number(form.price) <= 0
    ) {
      alert("Please enter a valid price.");
      return;
    }

    if (!form.category) {
      alert(
        "Please select a category."
      );
      return;
    }

    if (!form.images.length) {
      alert(
        "Please add at least one product image."
      );
      return;
    }

    if (
      form.stock !== "" &&
      Number(form.stock) < 0
    ) {
      alert(
        "Stock quantity cannot be negative."
      );
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      /*
       * ======================================
       * BASIC FIELDS
       * ======================================
       */

      formData.append(
        "name",
        form.name.trim()
      );

      formData.append(
        "description",
        form.description.trim()
      );

      formData.append(
        "price",
        String(Number(form.price))
      );

      /*
       * Backend expects salePrice.
       */
      if (form.comparePrice !== "") {
        formData.append(
          "salePrice",
          String(Number(form.comparePrice))
        );
      } else if (isEditMode) {
        /*
         * Explicitly clear old sale price
         * when editing and field is empty.
         */
        formData.append(
          "salePrice",
          ""
        );
      }

      formData.append(
        "category",
        form.category
      );

      if (
        form.badge &&
        form.badge !== "None"
      ) {
        formData.append(
          "badge",
          form.badge
        );
      } else {
        formData.append("badge", "");
      }

      if (form.sku.trim()) {
        formData.append(
          "sku",
          form.sku.trim()
        );
      } else if (isEditMode) {
        formData.append("sku", "");
      }

      formData.append(
        "stock",
        String(
          form.stock === ""
            ? 0
            : Number(form.stock)
        )
      );

      formData.append(
        "featured",
        String(Boolean(form.featured))
      );

      formData.append(
        "bestSeller",
        String(Boolean(form.bestSeller))
      );

      formData.append(
        "newArrival",
        String(Boolean(form.newArrival))
      );

      formData.append(
        "isActive",
        String(Boolean(form.isActive))
      );

      /*
       * ======================================
       * IMAGES
       * ======================================
       *
       * EDIT MODE:
       * Existing URL images -> existingImages
       *
       * New URL images -> images
       *
       * New uploaded files -> images
       *
       * This matches your backend update
       * controller.
       */

      if (isEditMode) {
        form.images.forEach((image) => {
          if (image.type === "url") {
            /*
             * Existing Cloudinary/image URL
             * is kept as existingImages.
             */
            formData.append(
              "existingImages",
              image.url
            );
          }

          if (image.type === "file") {
            formData.append(
              "images",
              image.file
            );
          }
        });
      } else {
        /*
         * ADD MODE
         */
        form.images.forEach((image) => {
          if (image.type === "file") {
            formData.append(
              "images",
              image.file
            );
          }

          if (image.type === "url") {
            formData.append(
              "images",
              image.url
            );
          }
        });
      }

      /*
       * ======================================
       * API REQUEST
       * ======================================
       */

      let data;

      if (isEditMode) {
        data = await apiRequest(
          `/products/${editingProduct._id}`,
          {
            method: "PUT",
            body: formData,
          }
        );

        console.log(
          "Product updated:",
          data
        );

        alert(
          "Product updated successfully."
        );
      } else {
        data = await apiRequest(
          "/products",
          {
            method: "POST",
            body: formData,
          }
        );

        console.log(
          "Product created:",
          data
        );

        alert(
          "Product added successfully."
        );
      }

      /*
       * Reset only after successful request.
       */
      setForm({
        ...initialForm,
        images: [],
      });

      setImageUrl("");

      navigate("/products");
    } catch (error) {
      console.error(
        isEditMode
          ? "Update product error:"
          : "Add product error:",
        error
      );

      alert(
        error?.message ||
          (
            isEditMode
              ? "Failed to update product. Please try again."
              : "Failed to add product. Please try again."
          )
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * ==========================================
   * BACK
   * ==========================================
   */

  const handleBack = () => {
    if (saving) {
      return;
    }

    navigate("/products");
  };

  return (
    <div className="add-product-page">
      {/* =========================
          HEADER
      ========================= */}

      <div className="page-header">
        <div>
          <button
            type="button"
            className="outline-button back-button"
            onClick={handleBack}
            disabled={saving}
          >
            <ArrowLeft size={16} />
            Back to Products
          </button>

          <h1>
            {isEditMode
              ? "Edit Product"
              : "Add Product"}
          </h1>

          <p>
            {isEditMode
              ? "Update your Saddle & Crest product details."
              : "Create a new Saddle & Crest product for your store."}
          </p>
        </div>
      </div>

      {/* =========================
          FORM
      ========================= */}

      <form
        className="add-product-form"
        onSubmit={handleSubmit}
      >
        {/* =========================
            BASIC INFORMATION
        ========================= */}

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Basic Information</h2>

              <p>
                Enter the main details of
                your product.
              </p>
            </div>
          </div>

          <div className="form-grid">
            {/* NAME */}

            <div className="form-group full-width">
              <label htmlFor="name">
                Product Name{" "}
                <span>*</span>
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. The Heritage Saddle"
              />
            </div>

            {/* DESCRIPTION */}

            <div className="form-group full-width">
              <label htmlFor="description">
                Description{" "}
                <span>*</span>
              </label>

              <textarea
                id="description"
                name="description"
                rows="6"
                value={form.description}
                onChange={handleChange}
                placeholder="Write a detailed description of the product..."
              />
            </div>

            {/* PRICE */}

            <div className="form-group">
              <label htmlFor="price">
                Price (INR){" "}
                <span>*</span>
              </label>

              <div className="price-input">
                <span>₹</span>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="48500"
                />
              </div>
            </div>

            {/* COMPARE PRICE */}

            <div className="form-group">
              <label htmlFor="comparePrice">
                Compare at Price (INR)
              </label>

              <div className="price-input">
                <span>₹</span>

                <input
                  id="comparePrice"
                  name="comparePrice"
                  type="number"
                  min="0"
                  value={form.comparePrice}
                  onChange={handleChange}
                  placeholder="55000"
                />
              </div>
            </div>

            {/* CATEGORY */}

            <div className="form-group">
              <label htmlFor="category">
                Category{" "}
                <span>*</span>
              </label>

              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                disabled={
                  loadingCategories
                }
              >
                <option value="">
                  {loadingCategories
                    ? "Loading categories..."
                    : "Select category"}
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* BADGE */}

            <div className="form-group">
              <label htmlFor="badge">
                Badge
              </label>

              <select
                id="badge"
                name="badge"
                value={form.badge}
                onChange={handleChange}
              >
                {BADGES.map(
                  (badge) => (
                    <option
                      key={badge}
                      value={
                        badge === "None"
                          ? ""
                          : badge
                      }
                    >
                      {badge}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* SKU */}

            <div className="form-group">
              <label htmlFor="sku">
                SKU
              </label>

              <input
                id="sku"
                name="sku"
                type="text"
                value={form.sku}
                onChange={handleChange}
                placeholder="SC-HS-001"
              />
            </div>

            {/* STOCK */}

            <div className="form-group">
              <label htmlFor="stock">
                Stock Quantity
              </label>

              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                placeholder="10"
              />
            </div>
          </div>
        </section>

        {/* =========================
            PRODUCT IMAGES
        ========================= */}

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Product Images</h2>

              <p>
                Upload product images or
                add them using an image URL.
              </p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleFileSelect}
          />

          <button
            type="button"
            className="image-upload-box"
            onClick={() =>
              fileInputRef.current?.click()
            }
            disabled={saving}
          >
            <div className="image-upload-icon">
              <Upload size={21} />
            </div>

            <div>
              <strong>
                Add Image
              </strong>

              <span>
                Click to upload product
                images
              </span>
            </div>
          </button>

          <div className="image-url-row">
            <input
              type="url"
              value={imageUrl}
              onChange={(event) =>
                setImageUrl(
                  event.target.value
                )
              }
              placeholder="Or paste image URL..."
              disabled={saving}
            />

            <button
              type="button"
              className="add-image-button"
              onClick={addImage}
              disabled={saving}
            >
              <Plus size={16} />
              Add URL
            </button>
          </div>

          {form.images.length > 0 && (
            <div className="image-count">
              {form.images.length} / 10
              images added
            </div>
          )}

          {form.images.length > 0 && (
            <div className="image-preview-list">
              {form.images.map(
                (image, index) => (
                  <div
                    className="image-preview-item"
                    key={`${image.type}-${index}-${image.preview}`}
                  >
                    <img
                      src={image.preview}
                      alt={`Product ${
                        index + 1
                      }`}
                    />

                    <button
                      type="button"
                      className="remove-image-button"
                      onClick={() =>
                        removeImage(index)
                      }
                      disabled={saving}
                      aria-label={`Remove image ${
                        index + 1
                      }`}
                    >
                      <X size={15} />
                    </button>

                    {index === 0 && (
                      <span className="primary-image-label">
                        Main Image
                      </span>
                    )}
                  </div>
                )
              )}
            </div>
          )}

          {form.images.length === 0 && (
            <div className="empty-image-state">
              <ImagePlus size={22} />

              <span>
                No product images
                added yet.
              </span>
            </div>
          )}
        </section>

        {/* =========================
            PRODUCT STATUS
        ========================= */}

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Product Settings</h2>

              <p>
                Choose where and how this
                product should appear.
              </p>
            </div>
          </div>

          <div className="settings-grid">
            {/* FEATURED */}

            <label className="checkbox-card">
              <input
                type="checkbox"
                name="featured"
                checked={
                  form.featured
                }
                onChange={handleChange}
              />

              <div>
                <strong>
                  Featured Product
                </strong>

                <span>
                  Show this product in
                  the featured collection.
                </span>
              </div>
            </label>

            {/* BEST SELLER */}

            <label className="checkbox-card">
              <input
                type="checkbox"
                name="bestSeller"
                checked={
                  form.bestSeller
                }
                onChange={handleChange}
              />

              <div>
                <strong>
                  Best Seller
                </strong>

                <span>
                  Show this product in
                  the best sellers section.
                </span>
              </div>
            </label>

            {/* NEW ARRIVAL */}

            <label className="checkbox-card">
              <input
                type="checkbox"
                name="newArrival"
                checked={
                  form.newArrival
                }
                onChange={handleChange}
              />

              <div>
                <strong>
                  New Arrival
                </strong>

                <span>
                  Show this product in
                  new arrivals.
                </span>
              </div>
            </label>

            {/* ACTIVE */}

            <label className="checkbox-card">
              <input
                type="checkbox"
                name="isActive"
                checked={
                  form.isActive
                }
                onChange={handleChange}
              />

              <div>
                <strong>
                  Active Product
                </strong>

                <span>
                  Make this product
                  visible in the store.
                </span>
              </div>
            </label>
          </div>
        </section>

        {/* =========================
            ACTIONS
        ========================= */}

        <div className="form-actions">
          <button
            type="button"
            className="outline-button"
            onClick={handleBack}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
            disabled={saving}
          >
            <Save size={17} />

            {saving
              ? isEditMode
                ? "Updating Product..."
                : "Adding Product..."
              : isEditMode
                ? "Update Product"
                : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;