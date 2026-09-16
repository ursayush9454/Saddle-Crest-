
import React, { useEffect, useState } from "react";
import {
  Plus,
  Save,
  X,
  Loader2,
} from "lucide-react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { apiRequest } from "../services/api";
import "./AddProduct.css";

const initialForm = {
  name: "",
  description: "",
  price: "",
  salePrice: "",
  category: "",
  image: "",
  stock: "",
  lowStockThreshold: "5",
  badge: "",
  featured: false,
  bestSeller: false,
  newArrival: false,
};

const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const editingProduct =
    location.state?.product || null;

  const [form, setForm] = useState(initialForm);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const editingId =
    editingProduct?._id || null;

  useEffect(() => {
    if (!editingProduct) {
      setForm(initialForm);
      return;
    }

    setForm({
      name: editingProduct.name || "",
      description:
        editingProduct.description || "",
      price: editingProduct.price ?? "",
      salePrice:
        editingProduct.salePrice ?? "",
      category:
        editingProduct.category || "",
      image: editingProduct.image || "",
      stock: editingProduct.stock ?? "",
      lowStockThreshold:
        editingProduct.lowStockThreshold ?? "5",
      badge: editingProduct.badge || "",
      featured: Boolean(
        editingProduct.featured
      ),
      bestSeller: Boolean(
        editingProduct.bestSeller
      ),
      newArrival: Boolean(
        editingProduct.newArrival
      ),
    });
  }, [editingProduct]);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);

    navigate("/add-product", {
      replace: true,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const body = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),

        salePrice:
          form.salePrice === ""
            ? null
            : Number(form.salePrice),

        category: form.category.trim(),

        image: form.image.trim(),

        stock: Number(form.stock),

        lowStockThreshold: Number(
          form.lowStockThreshold
        ),

        badge: form.badge.trim(),

        featured: form.featured,

        bestSeller: form.bestSeller,

        newArrival: form.newArrival,
      };

      if (editingId) {
        await apiRequest(
          `/products/${editingId}`,
          {
            method: "PUT",
            body: JSON.stringify(body),
          }
        );
      } else {
        await apiRequest("/products", {
          method: "POST",
          body: JSON.stringify(body),
        });
      }

      navigate("/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="add-product-page">

      <section className="add-product-header">
        <div>
          <span className="add-product-eyebrow">
            CATALOGUE
          </span>

          <h1>
            {editingId
              ? "Edit Product"
              : "Add Product"}
          </h1>

          <p>
            {editingId
              ? "Update product information."
              : "Add a new product to your catalogue."}
          </p>
        </div>

        <button
          className="add-product-back"
          onClick={() =>
            navigate("/products")
          }
        >
          <X size={15} />
          Close
        </button>
      </section>

      {error && (
        <div className="add-product-error">
          {error}
        </div>
      )}

      <section className="add-product-panel">

        <form
          onSubmit={handleSubmit}
          className="add-product-form"
        >

          <div className="add-product-grid">

            <div className="add-product-field">
              <label>Product Name</label>

              <input
                value={form.name}
                onChange={(e) =>
                  updateField(
                    "name",
                    e.target.value
                  )
                }
                placeholder="Premium English Saddle"
                required
              />
            </div>

            <div className="add-product-field">
              <label>Category</label>

              <input
                value={form.category}
                onChange={(e) =>
                  updateField(
                    "category",
                    e.target.value
                  )
                }
                placeholder="Saddles"
                required
              />
            </div>

            <div className="add-product-field">
              <label>Price</label>

              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) =>
                  updateField(
                    "price",
                    e.target.value
                  )
                }
                placeholder="48500"
                required
              />
            </div>

            <div className="add-product-field">
              <label>Sale Price</label>

              <input
                type="number"
                min="0"
                value={form.salePrice}
                onChange={(e) =>
                  updateField(
                    "salePrice",
                    e.target.value
                  )
                }
                placeholder="45000"
              />
            </div>

            <div className="add-product-field">
              <label>Stock</label>

              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) =>
                  updateField(
                    "stock",
                    e.target.value
                  )
                }
                placeholder="10"
                required
              />
            </div>

            <div className="add-product-field">
              <label>Low Stock Threshold</label>

              <input
                type="number"
                min="0"
                value={
                  form.lowStockThreshold
                }
                onChange={(e) =>
                  updateField(
                    "lowStockThreshold",
                    e.target.value
                  )
                }
              />
            </div>

            <div className="add-product-field full">
              <label>Main Image URL</label>

              <input
                value={form.image}
                onChange={(e) =>
                  updateField(
                    "image",
                    e.target.value
                  )
                }
                placeholder="https://..."
                required
              />
            </div>

            <div className="add-product-field full">
              <label>Badge</label>

              <input
                value={form.badge}
                onChange={(e) =>
                  updateField(
                    "badge",
                    e.target.value
                  )
                }
                placeholder="New / Bestseller / Premium"
              />
            </div>

            <div className="add-product-field full">
              <label>Description</label>

              <textarea
                rows="6"
                value={form.description}
                onChange={(e) =>
                  updateField(
                    "description",
                    e.target.value
                  )
                }
                placeholder="Product description..."
                required
              />
            </div>

          </div>

          <div className="add-product-options">

            <label>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  updateField(
                    "featured",
                    e.target.checked
                  )
                }
              />

              Featured
            </label>

            <label>
              <input
                type="checkbox"
                checked={form.bestSeller}
                onChange={(e) =>
                  updateField(
                    "bestSeller",
                    e.target.checked
                  )
                }
              />

              Best Seller
            </label>

            <label>
              <input
                type="checkbox"
                checked={form.newArrival}
                onChange={(e) =>
                  updateField(
                    "newArrival",
                    e.target.checked
                  )
                }
              />

              New Arrival
            </label>

          </div>

          <div className="add-product-actions">

            <button
              type="button"
              className="add-product-cancel"
              onClick={() =>
                navigate("/products")
              }
            >
              <X size={15} />
              Cancel
            </button>

            <button
              type="submit"
              className="add-product-save"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2
                    size={15}
                    className="add-product-spinner"
                  />

                  Saving...
                </>
              ) : (
                <>
                  {editingId ? (
                    <Save size={15} />
                  ) : (
                    <Plus size={15} />
                  )}

                  {editingId
                    ? "Update Product"
                    : "Create Product"}
                </>
              )}
            </button>

          </div>

        </form>

      </section>
    </div>
  );
};

export default AddProduct;

