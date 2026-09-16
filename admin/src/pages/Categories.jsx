import React, { useEffect, useState } from "react";
import {
  RefreshCw,
  Plus,
  X,
  Loader2,
  FolderTree,
} from "lucide-react";

import { apiRequest } from "../services/api";
import "./Categories.css";

const initialForm = {
  name: "",
  slug: "",
  description: "",
};

const Categories = () => {
  const [data, setData] = useState({
    categories: [],
  });

  const [form, setForm] = useState(initialForm);

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // =========================
  // LOAD CATEGORIES
  // =========================

  const loadCategories = async () => {
    try {
      setError("");

      const result = await apiRequest("/categories");

      setData({
        categories: Array.isArray(result?.categories)
          ? result.categories
          : [],
      });
    } catch (err) {
      console.error("Categories loading error:", err);

      setError(
        err?.message || "Failed to load categories."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setError("");

        const result = await apiRequest("/categories");

        if (!mounted) return;

        setData({
          categories: Array.isArray(result?.categories)
            ? result.categories
            : [],
        });
      } catch (err) {
        console.error("Categories loading error:", err);

        if (mounted) {
          setError(
            err?.message || "Failed to load categories."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  // =========================
  // FORM FIELD UPDATE
  // =========================

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // =========================
  // CLOSE FORM
  // =========================

  const closeForm = () => {
    setShowForm(false);
    setForm(initialForm);
    setError("");
  };

  // =========================
  // CREATE CATEGORY
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const categoryName = form.name.trim();

    if (!categoryName) {
      setError("Category name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const result = await apiRequest("/categories", {
        method: "POST",

        body: JSON.stringify({
          name: categoryName,
          description: form.description.trim(),
        }),
      });

      // Add newly created category immediately
      if (result?.category) {
        setData((prev) => ({
          categories: [
            ...prev.categories,
            result.category,
          ].sort((a, b) =>
            (a.name || "").localeCompare(
              b.name || ""
            )
          ),
        }));
      } else {
        // Fallback: reload from backend
        await loadCategories();
      }

      setForm(initialForm);
      setShowForm(false);
    } catch (err) {
      console.error("Create category error:", err);

      setError(
        err?.message || "Failed to create category."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // REFRESH
  // =========================

  const handleRefresh = async () => {
    setLoading(true);
    await loadCategories();
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="categories-loading">
        <Loader2
          size={18}
          className="category-spinner"
        />

        <span>Loading categories...</span>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="categories-page">

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="categories-error">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* =========================
          HEADER
      ========================= */}

      <section className="categories-header">

        <div className="categories-title-area">

          <span className="categories-eyebrow">
            CATALOGUE STRUCTURE
          </span>

          <h1>Categories</h1>

          <p>
            Organise and manage your product catalogue.
          </p>

        </div>

        <div className="categories-actions">

          <button
            type="button"
            className="categories-refresh"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw size={15} />

            Refresh
          </button>

          <button
            type="button"
            className="categories-add"
            onClick={() =>
              setShowForm((prev) => !prev)
            }
          >
            {showForm ? (
              <X size={15} />
            ) : (
              <Plus size={15} />
            )}

            {showForm
              ? "Close"
              : "Add Category"}
          </button>

        </div>

      </section>

      {/* =========================
          ADD CATEGORY FORM
      ========================= */}

      {showForm && (
        <section className="category-form-panel">

          <div className="category-form-heading">

            <div>

              <span>NEW CATEGORY</span>

              <h2>Add Category</h2>

            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="category-form"
          >

            <div className="category-form-grid">

              {/* NAME */}

              <div className="category-field">

                <label htmlFor="category-name">
                  Category Name
                </label>

                <input
                  id="category-name"
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    updateField(
                      "name",
                      e.target.value
                    )
                  }
                  placeholder="Saddles"
                  autoComplete="off"
                  required
                />

              </div>

              {/* SLUG */}

              <div className="category-field">

                <label htmlFor="category-slug">
                  Slug
                </label>

                <input
                  id="category-slug"
                  type="text"
                  value={form.slug}
                  onChange={(e) =>
                    updateField(
                      "slug",
                      e.target.value
                    )
                  }
                  placeholder="saddles"
                  autoComplete="off"
                />

                <small>
                  Slug is generated automatically from
                  the category name.
                </small>

              </div>

              {/* DESCRIPTION */}

              <div className="category-field full">

                <label htmlFor="category-description">
                  Description
                </label>

                <textarea
                  id="category-description"
                  rows="4"
                  value={form.description}
                  onChange={(e) =>
                    updateField(
                      "description",
                      e.target.value
                    )
                  }
                  placeholder="Describe this category..."
                />

              </div>

            </div>

            {/* FORM ACTIONS */}

            <div className="category-form-actions">

              <button
                type="button"
                className="category-cancel"
                onClick={closeForm}
                disabled={saving}
              >
                <X size={15} />

                Cancel
              </button>

              <button
                type="submit"
                className="category-save"
                disabled={saving}
              >

                {saving ? (
                  <>
                    <Loader2
                      size={15}
                      className="category-spinner"
                    />

                    Saving...
                  </>
                ) : (
                  <>
                    <Plus size={15} />

                    Add Category
                  </>
                )}

              </button>

            </div>

          </form>

        </section>
      )}

      {/* =========================
          CATEGORY LIST
      ========================= */}

      <section className="categories-list-panel">

        <div className="categories-list-heading">

          <div>

            <span>LIVE DATA</span>

            <h2>All Categories</h2>

          </div>

          <div className="categories-count">

            <FolderTree size={14} />

            <strong>
              {data.categories.length}
            </strong>

          </div>

        </div>

        {/* =========================
            EMPTY STATE
        ========================= */}

        {data.categories.length === 0 ? (
          <div className="categories-empty-state">

            <div className="categories-empty-icon">
              <FolderTree size={25} />
            </div>

            <h3>No categories found</h3>

            <p>
              Create your first product category to
              organise your catalogue.
            </p>

            <button
              type="button"
              onClick={() => setShowForm(true)}
            >
              <Plus size={15} />

              Add Category
            </button>

          </div>
        ) : (

          /* =========================
             TABLE
          ========================= */

          <div className="categories-table-wrapper">

            <table className="categories-table">

              <thead>

                <tr>
                  <th>Category</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                {data.categories.map(
                  (category) => (

                    <tr
                      key={
                        category._id ||
                        category.id ||
                        category.slug ||
                        category.name
                      }
                    >

                      {/* CATEGORY */}

                      <td>

                        <div className="category-name-cell">

                          <div className="category-icon">
                            <FolderTree size={15} />
                          </div>

                          <div>

                            <strong>
                              {category.name ||
                                "Unnamed Category"}
                            </strong>

                            <span>
                              Category
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* SLUG */}

                      <td>

                        <span className="category-slug">
                          {category.slug || "—"}
                        </span>

                      </td>

                      {/* DESCRIPTION */}

                      <td>

                        <span className="category-description">

                          {category.description ||
                            "No description"}

                        </span>

                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={`category-status ${
                            category.isActive === false
                              ? "inactive"
                              : "active"
                          }`}
                        >
                          {category.isActive === false
                            ? "Disabled"
                            : "Active"}
                        </span>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  );
};

export default Categories;