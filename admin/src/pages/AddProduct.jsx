import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
  ImagePlus,
  Plus,
  Save,
  Upload,
  X,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { apiRequest } from "../services/api";

import "./AddProduct.css";

/*
|--------------------------------------------------------------------------
| DEFAULT CATEGORIES
|--------------------------------------------------------------------------
*/

const DEFAULT_CATEGORIES = [
  "Saddles",
  "Bridles",
  "Rider",
  "Horse Care",
  "Leather Goods",
  "Custom",
];

/*
|--------------------------------------------------------------------------
| PRODUCT BADGES
|--------------------------------------------------------------------------
*/

const BADGES = [
  "None",
  "New",
  "Best Seller",
  "Featured",
  "Limited",
  "Sale",
];

/*
|--------------------------------------------------------------------------
| INITIAL FORM
|--------------------------------------------------------------------------
*/

const initialForm = {
  name: "",
  description: "",
  price: "",
  salePrice: "",
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

/*
|--------------------------------------------------------------------------
| ADD PRODUCT
|--------------------------------------------------------------------------
*/

const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const fileInputRef = useRef(null);

  /*
  |--------------------------------------------------------------------------
  | EDIT MODE
  |--------------------------------------------------------------------------
  */

  const editingProduct =
    location.state?.product || null;

  const isEditMode = Boolean(
    editingProduct?._id
  );

  /*
  |--------------------------------------------------------------------------
  | STATES
  |--------------------------------------------------------------------------
  */

  const [form, setForm] =
    useState(initialForm);

  const [categories, setCategories] =
    useState(DEFAULT_CATEGORIES);

  const [imageUrl, setImageUrl] =
    useState("");

  const [
    loadingCategories,
    setLoadingCategories,
  ] = useState(true);

  const [saving, setSaving] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | EXISTING PRODUCT IMAGES
  |--------------------------------------------------------------------------
  */

  const getExistingImages = (
    product
  ) => {
    if (!product) {
      return [];
    }

    const images = Array.isArray(
      product.images
    )
      ? product.images.filter(Boolean)
      : [];

    if (
      !images.length &&
      product.image
    ) {
      return [product.image];
    }

    return images;
  };

  /*
  |--------------------------------------------------------------------------
  | FETCH CATEGORIES
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchCategories =
      async () => {
        try {
          setLoadingCategories(true);

          const data =
            await apiRequest(
              "/categories"
            );

          const backendCategories =
            Array.isArray(
              data?.categories
            )
              ? data.categories
              : Array.isArray(data)
              ? data
              : [];

          const backendNames =
            backendCategories
              .map((category) =>
                typeof category ===
                "string"
                  ? category
                  : category?.name
              )
              .filter(Boolean);

          const merged = [
            ...DEFAULT_CATEGORIES,
            ...backendNames,
          ].filter(
            (
              name,
              index,
              array
            ) =>
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

          setCategories(
            DEFAULT_CATEGORIES
          );
        } finally {
          setLoadingCategories(false);
        }
      };

    fetchCategories();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | POPULATE EDIT FORM
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!editingProduct) {
      setForm({
        ...initialForm,
        images: [],
      });

      setImageUrl("");

      return;
    }

    const existingImages =
      getExistingImages(
        editingProduct
      );

    setForm({
      name:
        editingProduct.name || "",

      description:
        editingProduct.description ||
        "",

      price:
        editingProduct.price !==
          undefined &&
        editingProduct.price !==
          null
          ? String(
              editingProduct.price
            )
          : "",

      salePrice:
        editingProduct.salePrice !==
          undefined &&
        editingProduct.salePrice !==
          null
          ? String(
              editingProduct.salePrice
            )
          : "",

      category:
        editingProduct.category ||
        "",

      badge:
        editingProduct.badge ||
        "",

      sku:
        editingProduct.sku ||
        "",

      stock:
        editingProduct.stock !==
          undefined &&
        editingProduct.stock !==
          null
          ? String(
              editingProduct.stock
            )
          : "",

      images:
        existingImages.map(
          (url) => ({
            type: "url",
            url,
            preview: url,
          })
        ),

      featured: Boolean(
        editingProduct.featured
      ),

      bestSeller: Boolean(
        editingProduct.bestSeller
      ),

      newArrival: Boolean(
        editingProduct.newArrival
      ),

      isActive:
        editingProduct.isActive !==
        undefined
          ? Boolean(
              editingProduct.isActive
            )
          : true,
    });

    setImageUrl("");
  }, [editingProduct]);

  /*
  |--------------------------------------------------------------------------
  | INPUT CHANGE
  |--------------------------------------------------------------------------
  */

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm(
      (previous) => ({
        ...previous,

        [name]:
          type === "checkbox"
            ? checked
            : value,
      })
    );
  };

  /*
  |--------------------------------------------------------------------------
  | PRICE PARSER
  |--------------------------------------------------------------------------
  |
  | Handles values like:
  |
  | 3900
  | "3900"
  | "3,900"
  |
  */

  const parsePrice = (value) => {
    if (
      value === undefined ||
      value === null ||
      String(value).trim() === ""
    ) {
      return null;
    }

    const normalizedValue =
      String(value)
        .replace(/,/g, "")
        .trim();

    const parsedValue =
      Number(normalizedValue);

    if (
      !Number.isFinite(
        parsedValue
      )
    ) {
      return null;
    }

    return parsedValue;
  };

  /*
  |--------------------------------------------------------------------------
  | SALE PRICE CALCULATION
  |--------------------------------------------------------------------------
  */

  const regularPrice =
    parsePrice(form.price);

  const salePrice =
    form.salePrice === ""
      ? null
      : parsePrice(
          form.salePrice
        );

  /*
  |--------------------------------------------------------------------------
  | VALID SALE
  |--------------------------------------------------------------------------
  */

  const hasValidSale =
    regularPrice !== null &&
    regularPrice > 0 &&
    salePrice !== null &&
    salePrice > 0 &&
    salePrice < regularPrice;

  /*
  |--------------------------------------------------------------------------
  | SALE SAVING
  |--------------------------------------------------------------------------
  */

  const saleSaving =
    hasValidSale
      ? regularPrice - salePrice
      : 0;

  /*
  |--------------------------------------------------------------------------
  | SALE PERCENTAGE
  |--------------------------------------------------------------------------
  */

  const salePercentage =
    hasValidSale
      ? (saleSaving /
          regularPrice) *
        100
      : 0;

  /*
  |--------------------------------------------------------------------------
  | IMAGE FILE SELECT
  |--------------------------------------------------------------------------
  */

  const handleFileSelect = (
    event
  ) => {
    const files = Array.from(
      event.target.files || []
    );

    if (!files.length) {
      return;
    }

    const imageFiles =
      files.filter((file) =>
        file.type.startsWith(
          "image/"
        )
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
      imageFiles.slice(
        0,
        availableSlots
      );

    const newImages =
      selectedFiles.map(
        (file) => ({
          type: "file",

          file,

          preview:
            URL.createObjectURL(
              file
            ),
        })
      );

    setForm(
      (previous) => ({
        ...previous,

        images: [
          ...previous.images,
          ...newImages,
        ],
      })
    );

    event.target.value = "";
  };

  /*
  |--------------------------------------------------------------------------
  | ADD IMAGE URL
  |--------------------------------------------------------------------------
  */

  const addImage = () => {
    const url =
      imageUrl.trim();

    if (!url) {
      alert(
        "Please enter an image URL."
      );

      return;
    }

    if (
      form.images.length >=
      10
    ) {
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

    const alreadyExists =
      form.images.some(
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

    setForm(
      (previous) => ({
        ...previous,

        images: [
          ...previous.images,

          {
            type: "url",

            url,

            preview: url,
          },
        ],
      })
    );

    setImageUrl("");
  };

  /*
  |--------------------------------------------------------------------------
  | REMOVE IMAGE
  |--------------------------------------------------------------------------
  */

  const removeImage = (
    index
  ) => {
    setForm(
      (previous) => {
        const image =
          previous.images[
            index
          ];

        if (
          image?.type ===
            "file" &&
          image?.preview
        ) {
          URL.revokeObjectURL(
            image.preview
          );
        }

        return {
          ...previous,

          images:
            previous.images.filter(
              (
                _,
                imageIndex
              ) =>
                imageIndex !==
                index
            ),
        };
      }
    );
  };

  /*
  |--------------------------------------------------------------------------
  | CLEANUP IMAGE PREVIEWS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      form.images.forEach(
        (image) => {
          if (
            image.type ===
              "file" &&
            image.preview
          ) {
            URL.revokeObjectURL(
              image.preview
            );
          }
        }
      );
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | SUBMIT
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    /*
    |--------------------------------------------------------------------------
    | PRODUCT NAME
    |--------------------------------------------------------------------------
    */

    if (!form.name.trim()) {
      alert(
        "Product name is required."
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | DESCRIPTION
    |--------------------------------------------------------------------------
    */

    if (
      !form.description.trim()
    ) {
      alert(
        "Product description is required."
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | REGULAR PRICE
    |--------------------------------------------------------------------------
    */

    const currentPrice =
      parsePrice(form.price);

    if (
      currentPrice === null ||
      currentPrice <= 0
    ) {
      alert(
        "Please enter a valid regular price."
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | SALE PRICE VALIDATION
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | ₹3900 regular
    | ₹3700 sale
    |
    | 3700 < 3900
    |
    | Therefore VALID.
    |
    */

    let currentSalePrice =
      null;

    if (
      form.salePrice !== ""
    ) {
      currentSalePrice =
        parsePrice(
          form.salePrice
        );

      /*
       * Invalid number
       */

      if (
        currentSalePrice === null ||
        currentSalePrice <= 0
      ) {
        alert(
          "Please enter a valid sale price."
        );

        return;
      }

      /*
       * Sale must be LOWER
       * than regular price.
       */

      if (
        currentSalePrice >=
        currentPrice
      ) {
        alert(
          `Sale price must be lower than the regular price.\n\nRegular Price: ₹${currentPrice.toLocaleString(
            "en-IN"
          )}\nSale Price: ₹${currentSalePrice.toLocaleString(
            "en-IN"
          )}`
        );

        return;
      }
    }

    /*
    |--------------------------------------------------------------------------
    | CATEGORY
    |--------------------------------------------------------------------------
    */

    if (!form.category) {
      alert(
        "Please select a category."
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | IMAGES
    |--------------------------------------------------------------------------
    */

    if (!form.images.length) {
      alert(
        "Please add at least one product image."
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | STOCK
    |--------------------------------------------------------------------------
    */

    const stockValue =
      form.stock === ""
        ? 0
        : parsePrice(
            form.stock
          );

    if (
      stockValue === null ||
      stockValue < 0
    ) {
      alert(
        "Stock quantity cannot be negative."
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | SAVE
    |--------------------------------------------------------------------------
    */

    try {
      setSaving(true);

      const formData =
        new FormData();

      /*
      |--------------------------------------------------------------------------
      | BASIC INFORMATION
      |--------------------------------------------------------------------------
      */

      formData.append(
        "name",
        form.name.trim()
      );

      formData.append(
        "description",
        form.description.trim()
      );

      /*
      |--------------------------------------------------------------------------
      | REGULAR PRICE
      |--------------------------------------------------------------------------
      */

      formData.append(
        "price",
        String(currentPrice)
      );

      /*
      |--------------------------------------------------------------------------
      | SALE PRICE
      |--------------------------------------------------------------------------
      |
      | Valid sale:
      |
      | 3900 -> 3700
      |
      */

      if (
        currentSalePrice !==
        null
      ) {
        formData.append(
          "salePrice",
          String(
            currentSalePrice
          )
        );
      } else if (isEditMode) {
        /*
         * Empty sale price while editing
         * means remove the existing sale.
         */

        formData.append(
          "salePrice",
          ""
        );
      }

      /*
      |--------------------------------------------------------------------------
      | CATEGORY
      |--------------------------------------------------------------------------
      */

      formData.append(
        "category",
        form.category
      );

      /*
      |--------------------------------------------------------------------------
      | BADGE
      |--------------------------------------------------------------------------
      */

      if (
        form.badge &&
        form.badge !== "None"
      ) {
        formData.append(
          "badge",
          form.badge
        );
      } else {
        formData.append(
          "badge",
          ""
        );
      }

      /*
      |--------------------------------------------------------------------------
      | SKU
      |--------------------------------------------------------------------------
      */

      if (form.sku.trim()) {
        formData.append(
          "sku",
          form.sku.trim()
        );
      } else if (isEditMode) {
        formData.append(
          "sku",
          ""
        );
      }

      /*
      |--------------------------------------------------------------------------
      | STOCK
      |--------------------------------------------------------------------------
      */

      formData.append(
        "stock",
        String(stockValue)
      );

      /*
      |--------------------------------------------------------------------------
      | SETTINGS
      |--------------------------------------------------------------------------
      */

      formData.append(
        "featured",
        String(
          Boolean(
            form.featured
          )
        )
      );

      formData.append(
        "bestSeller",
        String(
          Boolean(
            form.bestSeller
          )
        )
      );

      formData.append(
        "newArrival",
        String(
          Boolean(
            form.newArrival
          )
        )
      );

      formData.append(
        "isActive",
        String(
          Boolean(
            form.isActive
          )
        )
      );

      /*
      |--------------------------------------------------------------------------
      | IMAGES
      |--------------------------------------------------------------------------
      */

      if (isEditMode) {
        /*
         * Existing URL images
         */

        form.images.forEach(
          (image) => {
            if (
              image.type ===
              "url"
            ) {
              formData.append(
                "existingImages",
                image.url
              );
            }

            /*
             * New uploaded files
             */

            if (
              image.type ===
              "file"
            ) {
              formData.append(
                "images",
                image.file
              );
            }
          }
        );
      } else {
        /*
         * New product
         */

        form.images.forEach(
          (image) => {
            /*
             * Uploaded file
             */

            if (
              image.type ===
              "file"
            ) {
              formData.append(
                "images",
                image.file
              );
            }

            /*
             * Image URL
             */

            if (
              image.type ===
              "url"
            ) {
              formData.append(
                "images",
                image.url
              );
            }
          }
        );
      }

      /*
      |--------------------------------------------------------------------------
      | API REQUEST
      |--------------------------------------------------------------------------
      */

      let data;

      if (isEditMode) {
        /*
         * UPDATE
         */

        data =
          await apiRequest(
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
        /*
         * CREATE
         */

        data =
          await apiRequest(
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
      |--------------------------------------------------------------------------
      | RESET
      |--------------------------------------------------------------------------
      */

      setForm({
        ...initialForm,
        images: [],
      });

      setImageUrl("");

      /*
      |--------------------------------------------------------------------------
      | BACK TO PRODUCTS
      |--------------------------------------------------------------------------
      */

      navigate(
        "/products"
      );
    } catch (error) {
      console.error(
        isEditMode
          ? "Update product error:"
          : "Add product error:",
        error
      );

      alert(
        error?.message ||
          (isEditMode
            ? "Failed to update product. Please try again."
            : "Failed to add product. Please try again.")
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | BACK
  |--------------------------------------------------------------------------
  */

  const handleBack = () => {
    if (saving) {
      return;
    }

    navigate(
      "/products"
    );
  };

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="add-product-page">
      {/* HEADER */}

      <div className="page-header">
        <div>
          <button
            type="button"
            className="outline-button back-button"
            onClick={
              handleBack
            }
            disabled={saving}
          >
            <ArrowLeft
              size={16}
            />

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

      {/* FORM */}

      <form
        className="add-product-form"
        onSubmit={
          handleSubmit
        }
      >
        {/* BASIC INFORMATION */}

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>
                Basic Information
              </h2>

              <p>
                Enter the main
                details of your
                product.
              </p>
            </div>
          </div>

          <div className="form-grid">
            {/* PRODUCT NAME */}

            <div className="form-group full-width">
              <label htmlFor="name">
                Product Name{" "}
                <span>*</span>
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={
                  form.name
                }
                onChange={
                  handleChange
                }
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
                value={
                  form.description
                }
                onChange={
                  handleChange
                }
                placeholder="Write a detailed description of the product..."
              />
            </div>

            {/* REGULAR PRICE */}

            <div className="form-group">
              <label htmlFor="price">
                Regular Price
                (INR){" "}
                <span>*</span>
              </label>

              <div className="price-input">
                <span>₹</span>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    form.price
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="72500"
                />
              </div>
            </div>

            {/* SALE PRICE */}

            <div className="form-group">
              <label htmlFor="salePrice">
                Sale Price
                (INR)
              </label>

              <div className="price-input">
                <span>₹</span>

                <input
                  id="salePrice"
                  name="salePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    form.salePrice
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="64999"
                />
              </div>

              {/* VALID SALE */}

              {hasValidSale && (
                <div
                  style={{
                    marginTop:
                      "8px",

                    fontSize:
                      "13px",

                    color:
                      "#2B4433",

                    fontWeight:
                      600,
                  }}
                >
                  You save ₹
                  {saleSaving.toLocaleString(
                    "en-IN"
                  )}{" "}
                  (
                  {salePercentage.toFixed(
                    2
                  )}
                  % OFF)
                </div>
              )}

              {/* INVALID SALE */}

              {form.salePrice !==
                "" &&
                salePrice !==
                  null &&
                regularPrice !==
                  null &&
                salePrice >=
                  regularPrice && (
                  <div
                    style={{
                      marginTop:
                        "8px",

                      fontSize:
                        "13px",

                      color:
                        "#b42318",

                      fontWeight:
                        600,
                    }}
                  >
                    Sale price must
                    be lower than
                    the regular
                    price.
                  </div>
                )}
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
                value={
                  form.category
                }
                onChange={
                  handleChange
                }
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
                      key={
                        category
                      }
                      value={
                        category
                      }
                    >
                      {
                        category
                      }
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
                value={
                  form.badge
                }
                onChange={
                  handleChange
                }
              >
                {BADGES.map(
                  (badge) => (
                    <option
                      key={
                        badge
                      }
                      value={
                        badge ===
                        "None"
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
                value={
                  form.sku
                }
                onChange={
                  handleChange
                }
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
                step="1"
                value={
                  form.stock
                }
                onChange={
                  handleChange
                }
                placeholder="10"
              />
            </div>
          </div>
        </section>

        {/* PRODUCT IMAGES */}

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>
                Product Images
              </h2>

              <p>
                Upload product
                images or add
                them using an
                image URL.
              </p>
            </div>
          </div>

          <input
            ref={
              fileInputRef
            }
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={
              handleFileSelect
            }
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
              <Upload
                size={21}
              />
            </div>

            <div>
              <strong>
                Add Image
              </strong>

              <span>
                Click to upload
                product images
              </span>
            </div>
          </button>

          {/* IMAGE URL */}

          <div className="image-url-row">
            <input
              type="url"
              value={
                imageUrl
              }
              onChange={(
                event
              ) =>
                setImageUrl(
                  event.target
                    .value
                )
              }
              placeholder="Or paste image URL..."
              disabled={saving}
            />

            <button
              type="button"
              className="add-image-button"
              onClick={
                addImage
              }
              disabled={saving}
            >
              <Plus
                size={16}
              />

              Add URL
            </button>
          </div>

          {/* IMAGE COUNT */}

          {form.images.length >
            0 && (
            <div className="image-count">
              {
                form.images
                  .length
              }{" "}
              / 10 images
              added
            </div>
          )}

          {/* IMAGE PREVIEWS */}

          {form.images.length >
            0 && (
            <div className="image-preview-list">
              {form.images.map(
                (
                  image,
                  index
                ) => (
                  <div
                    className="image-preview-item"
                    key={`${image.type}-${index}-${image.preview}`}
                  >
                    <img
                      src={
                        image.preview
                      }
                      alt={`Product ${
                        index +
                        1
                      }`}
                    />

                    <button
                      type="button"
                      className="remove-image-button"
                      onClick={() =>
                        removeImage(
                          index
                        )
                      }
                      disabled={
                        saving
                      }
                      aria-label={`Remove image ${
                        index +
                        1
                      }`}
                    >
                      <X
                        size={15}
                      />
                    </button>

                    {index ===
                      0 && (
                      <span className="primary-image-label">
                        Main Image
                      </span>
                    )}
                  </div>
                )
              )}
            </div>
          )}

          {/* EMPTY IMAGE */}

          {form.images.length ===
            0 && (
            <div className="empty-image-state">
              <ImagePlus
                size={22}
              />

              <span>
                No product
                images added
                yet.
              </span>
            </div>
          )}
        </section>

        {/* PRODUCT SETTINGS */}

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>
                Product Settings
              </h2>

              <p>
                Choose where and
                how this product
                should appear.
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
                onChange={
                  handleChange
                }
              />

              <div>
                <strong>
                  Featured Product
                </strong>

                <span>
                  Show this product
                  in the featured
                  collection.
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
                onChange={
                  handleChange
                }
              />

              <div>
                <strong>
                  Best Seller
                </strong>

                <span>
                  Show this product
                  in the best sellers
                  section.
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
                onChange={
                  handleChange
                }
              />

              <div>
                <strong>
                  New Arrival
                </strong>

                <span>
                  Show this product
                  in new arrivals.
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
                onChange={
                  handleChange
                }
              />

              <div>
                <strong>
                  Active Product
                </strong>

                <span>
                  Make this product
                  visible in the
                  store.
                </span>
              </div>
            </label>
          </div>
        </section>

        {/* ACTIONS */}

        <div className="form-actions">
          <button
            type="button"
            className="outline-button"
            onClick={
              handleBack
            }
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
            disabled={saving}
          >
            <Save
              size={17}
            />

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