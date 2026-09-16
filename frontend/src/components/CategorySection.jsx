import React, { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../services/api";
import "./CategorySection.css";

const fallbackCategories = [
  {
    title: "Saddles",
    subtitle: "CRAFTED FOR THE INDIAN RIDE",
    image:
      "https://m.media-amazon.com/images/I/71AhHF2cz-L._AC_SL1500_.jpg",
    slug: "saddles",
  },
  {
    title: "Bridles",
    subtitle: "TRADITION & PRECISION",
    image:
      "https://www.cheval-daventure.com/photos/600x400/cheval-en-inde-11062.jpg",
    slug: "bridles",
  },
  {
    title: "Rider",
    subtitle: "ROYAL RIDER ESSENTIALS",
    image:
      "https://www.equus-journeys.com/photos/400x400/rider-and-marwari-horse-rajasthan-6526.jpg",
    slug: "rider",
  },
  {
    title: "Horse Care",
    subtitle: "CARE BEYOND THE RIDE",
    image:
      "https://c.ndtvimg.com/2024-02/3u1k306_marwar-horse-show_625x300_01_February_24.jpg?im=FitAndFill%2Calgorithm%3Ddnn%2Cwidth%3D1200%2Cheight%3D675",
    slug: "horse-care",
  },
  {
    title: "Leather Goods",
    subtitle: "RAJASTHANI LEATHER CRAFT",
    image:
      "https://www.cheval-daventure.com/photos/600x400/cheval-en-inde-11062.jpg",
    slug: "leather-goods",
  },
  {
    title: "Custom",
    subtitle: "MADE FOR YOUR LEGACY",
    image:
      "https://media.admiddleeast.com/photos/651abd627d01c0bd22201f5e/1%3A1/w_3056,h_3056,c_limit/Suryagarh%20Akshay%20Shoot-7A%20Retouched.jpg",
    slug: "custom",
  },
];

const CategorySection = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState(fallbackCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();

        const apiCategories =
          data?.categories ||
          data?.data?.categories ||
          data?.data ||
          [];

        if (Array.isArray(apiCategories) && apiCategories.length > 0) {
          const formatted = apiCategories.map((category, index) => ({
            title: category.name,
            subtitle:
              category.description ||
              "SADDLE & CREST COLLECTION",
            image:
              category.image ||
              fallbackCategories[index % fallbackCategories.length].image,
            slug:
              category.slug ||
              category.name?.toLowerCase().replace(/\s+/g, "-"),
          }));

          setCategories(formatted);
        }
      } catch (error) {
        console.error("Category fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleCategory = (category) => {
    navigate(
      `/shop?category=${encodeURIComponent(
        category.slug || category.title
      )}`
    );
  };

  return (
    <section className="category-section" id="shop">
      <div className="category-heading">
        <div>
          <span>01 — COLLECTION</span>

          <h2>
            The Art of
            <em> Equestrian Craft</em>
          </h2>
        </div>

        <p>
          Discover carefully considered essentials crafted
          for horse, rider and the pursuit of exceptional riding.
        </p>
      </div>

      {loading ? (
        <div className="category-loading">
          Loading collections...
        </div>
      ) : (
        <div className="category-grid">
          {categories.map((category, index) => (
            <article
              className={`category-card ${
                index === 0 ? "category-large" : ""
              }`}
              key={category._id || category.slug || index}
              onClick={() => handleCategory(category)}
            >
              <img
                src={category.image}
                alt={`${category.title} — Saddle & Crest`}
                loading={index === 0 ? "eager" : "lazy"}
              />

              <div className="category-overlay" />

              <div className="category-content">
                <span>{category.subtitle}</span>

                <h3>{category.title}</h3>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleCategory(category);
                  }}
                >
                  Explore
                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.5}
                  />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategorySection;