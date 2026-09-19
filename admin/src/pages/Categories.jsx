import React, { useEffect, useState } from "react";
import {
  RefreshCw,
  Plus,
  X,
  Loader2,
  FolderTree,
  Trash2,
} from "lucide-react";
import { apiRequest } from "../services/api";
import "./Categories.css";

const DEFAULT_CATEGORIES = [
  {
    name: "Saddles",
    description: "Premium saddles for different riding disciplines.",
  },
  {
    name: "Bridles",
    description: "Premium bridles and headgear for horses.",
  },
  {
    name: "Rider",
    description: "Riding essentials, apparel and accessories.",
  },
  {
    name: "Horse Care",
    description: "Horse grooming and care essentials.",
  },
  {
    name: "Leather Goods",
    description: "Handcrafted premium leather products.",
  },
  {
    name: "Custom",
    description: "Custom-made equestrian products.",
  },
];

const makeSlug = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const mergeCategories = (backendCategories = []) => {
  const map = new Map();

  DEFAULT_CATEGORIES.forEach((category) => {
    map.set(category.name.toLowerCase(), {
      ...category,
      slug: makeSlug(category.name),
    });
  });

  backendCategories.forEach((category) => {
    if (!category?.name) return;

    const key = category.name.toLowerCase();

    map.set(key, {
      ...category,
      slug: category.slug || makeSlug(category.name),
    });
  });

  return Array.from(map.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const result = await apiRequest("/categories");

      setCategories(
        mergeCategories(result?.categories || result || [])
      );
    } catch (error) {
      console.error("Category fetch error:", error);

      // Even if backend fails, default categories will still show
      setCategories(mergeCategories([]));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter category name.");
      return;
    }

    try {
      setSaving(true);

      await apiRequest("/categories", {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          slug: makeSlug(form.name),
          description: form.description.trim(),
        }),
      });

      setForm({
        name: "",
        description: "",
      });

      setShowForm(false);

      await fetchCategories();
    } catch (error) {
      alert(error.message || "Failed to add category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    if (!category?._id) {
      alert(
        "This is a default category. Delete is available only for categories saved in the database."
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) return;

    try {
      setDeleting(category._id);

      await apiRequest(`/categories/${category._id}`, {
        method: "DELETE",
      });

      await fetchCategories();
    } catch (error) {
      alert(error.message || "Failed to delete category.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <section className="categories-page">
      <div className="page-header">
        <div>
          <span className="page-eyebrow">Catalog</span>

          <h1>Categories</h1>

          <p>
            Manage product categories for your Saddle & Crest store.
          </p>
        </div>

        <div className="categories-actions">
          <button
            className="outline-button"
            type="button"
            onClick={fetchCategories}
            disabled={loading}
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <button
            className="primary-button"
            type="button"
            onClick={() => setShowForm(true)}
          >
            <Plus size={17} />
            Add Category
          </button>
        </div>
      </div>

      {showForm && (
        <div className="category-form-panel panel">
          <div className="panel-heading">
            <div>
              <h2>Add Category</h2>
              <p>Create a new product category.</p>
            </div>

            <button
              className="icon-button"
              type="button"
              onClick={() => setShowForm(false)}
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleAddCategory}>
            <div className="form-grid">
              <div className="form-group">
                <label>Category Name</label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Riding Accessories"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>

                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Short category description"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="outline-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 size={17} className="spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus size={17} />
                    Add Category
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="panel">
        <div className="panel-heading">
          <div>
            <h2>All Categories</h2>

            <p>
              {categories.length} categories available
            </p>
          </div>

          <FolderTree size={22} />
        </div>

        {loading ? (
          <div className="category-loading">
            <Loader2 size={25} className="spin" />
            <span>Loading categories...</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="empty-state">
            No categories found.
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category, index) => (
                  <tr key={category._id || `${category.name}-${index}`}>
                    <td>
                      <div className="category-name-cell">
                        <div className="category-icon">
                          <FolderTree size={16} />
                        </div>

                        <strong>{category.name}</strong>
                      </div>
                    </td>

                    <td>
                      <span className="category-slug">
                        {category.slug || makeSlug(category.name)}
                      </span>
                    </td>

                    <td>
                      {category.description || "—"}
                    </td>

                    <td>
                      <span className="status-pill active">
                        Active
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="category-delete-button"
                        onClick={() => handleDelete(category)}
                        disabled={
                          deleting === category._id || !category._id
                        }
                        title={
                          !category._id
                            ? "Default category"
                            : "Delete category"
                        }
                      >
                        {deleting === category._id ? (
                          <Loader2
                            size={15}
                            className="spin"
                          />
                        ) : (
                          <Trash2 size={15} />
                        )}

                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;