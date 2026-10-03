
import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Clock3,
  CalendarDays,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./BlogDetails.css";

const blogPosts = {
  "royal-riding-traditions": {
    category: "HERITAGE",
    title: "The Royal Riding Traditions of Rajasthan",
    excerpt:
      "A journey through the royal equestrian traditions of Rajasthan, where horses, craftsmanship and heritage have been woven together for generations.",
    date: "SEPTEMBER 28, 2026",
    readTime: "8 MIN READ",

    heroImage:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1800&q=90",

    content: [
      {
        type: "text",
        heading: "A Heritage Written in the Saddle",
        paragraphs: [
          "Across Rajasthan, the relationship between horse and rider has always represented more than riding. It has been a part of royal culture, ceremony, travel and tradition.",
          "From the great forts of Jaipur and Jodhpur to the historic stables of Rajputana, horses occupied a special place in the lives of royal households. Their saddles, bridles and riding accessories were crafted with the same attention given to other royal objects.",
        ],
      },

      {
        type: "image",
        src:
          "https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?auto=format&fit=crop&w=1600&q=90",
        caption: "The timeless spirit of Rajasthan.",
      },

      {
        type: "text",
        heading: "The Art of the Indian Saddle",
        paragraphs: [
          "Traditional Indian saddlery developed around the needs of both horse and rider. Materials were selected for durability, comfort and the ability to withstand long hours in the saddle.",
          "Fine leatherwork became an important part of this tradition. Hand stitching, carefully shaped panels and detailed finishing transformed functional riding equipment into objects of lasting character.",
        ],
      },

      {
        type: "quote",
        quote:
          "True craftsmanship is not simply seen. It is felt in every ride.",
      },

      {
        type: "text",
        heading: "Where Craft Meets the Ride",
        paragraphs: [
          "The beauty of traditional equestrian equipment lies in its balance between function and artistry. Every curve, stitch and buckle has a purpose.",
          "At Saddle & Crest, this philosophy continues through a modern interpretation of Indian equestrian heritage — creating pieces designed for contemporary riders while respecting the traditions that inspired them.",
        ],
      },

      {
        type: "image",
        src:
          "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&w=1600&q=90",
        caption: "Craftsmanship inspired by generations of riding.",
      },

      {
        type: "text",
        heading: "A Tradition That Continues",
        paragraphs: [
          "Heritage is not something that belongs only in the past. It lives through the people who continue to value craftsmanship, horsemanship and the quiet rituals surrounding the ride.",
          "Today, Indian equestrian culture continues to evolve. Yet the essence remains unchanged — respect for the horse, pride in craftsmanship and a deep connection between rider and saddle.",
        ],
      },
    ],
  },

  "art-of-handcrafted-leather": {
    category: "CRAFT",
    title: "Inside the Art of Handcrafted Leather",
    excerpt:
      "Discover the patience, precision and character behind fine handcrafted equestrian leather.",
    date: "SEPTEMBER 24, 2026",
    readTime: "6 MIN READ",
    heroImage:
      "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=1800&q=90",

    content: [
      {
        type: "text",
        heading: "Leather With Character",
        paragraphs: [
          "Fine leather is more than a material. With time, care and use, it develops a character of its own.",
          "For equestrian equipment, leather must combine strength, flexibility and comfort while maintaining its appearance through years of riding.",
        ],
      },
      {
        type: "image",
        src:
          "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?auto=format&fit=crop&w=1600&q=90",
        caption: "The character of naturally finished leather.",
      },
      {
        type: "text",
        heading: "The Details Matter",
        paragraphs: [
          "From the selection of hides to the final stitching, each stage contributes to the finished piece.",
          "Hand-finishing allows subtle details to receive the attention they deserve — creating products that feel personal rather than mass produced.",
        ],
      },
    ],
  },

  "morning-at-the-stables": {
    category: "THE RIDE",
    title: "A Morning at the Stables",
    excerpt:
      "There is something timeless about the quiet rhythm of an early morning at the stables.",
    date: "SEPTEMBER 20, 2026",
    readTime: "5 MIN READ",
    heroImage:
      "https://images.unsplash.com/photo-1708916340019-98d25a1451ad?auto=format&fit=crop&w=1800&q=90",

    content: [
      {
        type: "text",
        heading: "Before the Ride Begins",
        paragraphs: [
          "The stable is different before sunrise. The world is quieter, the air cooler and every movement feels deliberate.",
          "Preparing a horse for the day is a ritual built around patience and trust.",
        ],
      },
      {
        type: "text",
        heading: "The Ritual of Preparation",
        paragraphs: [
          "Grooming, checking the tack and preparing the saddle are small routines, but they create the foundation for a good ride.",
          "For the rider, these moments are as much a part of horsemanship as the ride itself.",
        ],
      },
    ],
  },
};

const relatedPosts = [
  {
    slug: "royal-riding-traditions",
    category: "HERITAGE",
    title: "The Royal Riding Traditions of Rajasthan",
  },
  {
    slug: "art-of-handcrafted-leather",
    category: "CRAFT",
    title: "Inside the Art of Handcrafted Leather",
  },
  {
    slug: "morning-at-the-stables",
    category: "THE RIDE",
    title: "A Morning at the Stables",
  },
];

const BlogDetails = () => {
  const { slug } = useParams();

  const post = blogPosts[slug];

  if (!post) {
    return (
      <>
        <Navbar navbarBackground="#171410" />

        <main className="blog-details-not-found">
          <span>THE JOURNAL</span>

          <h1>Story not found</h1>

          <p>
            The story you are looking for may have moved or is no
            longer available.
          </p>

          <Link to="/blog">
            Back to Journal
            <ArrowUpRight size={16} />
          </Link>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar navbarBackground="#171410" />

      <main className="blog-details">

        {/* Hero */}
        <header className="blog-details-hero">

          <div className="blog-details-hero-content">

            <Link
              to="/blog"
              className="blog-back-link"
            >
              <ArrowLeft size={16} />
              Back to Journal
            </Link>

            <span className="blog-details-category">
              {post.category}
            </span>

            <h1>{post.title}</h1>

            <p className="blog-details-excerpt">
              {post.excerpt}
            </p>

            <div className="blog-details-meta">

              <span>
                <CalendarDays size={15} />
                {post.date}
              </span>

              <span>
                <Clock3 size={15} />
                {post.readTime}
              </span>

            </div>

          </div>

        </header>

        {/* Hero Image */}
        <div className="blog-details-cover">

          <img
            src={post.heroImage}
            alt={post.title}
          />

        </div>

        {/* Article */}
        <article className="blog-article">

          <div className="blog-article-intro">
            <span>THE SADDLE & CREST JOURNAL</span>
          </div>

          {post.content.map((block, index) => {

            if (block.type === "image") {
              return (
                <figure
                  className="blog-article-image"
                  key={index}
                >
                  <img
                    src={block.src}
                    alt={block.caption}
                    loading="lazy"
                  />

                  <figcaption>
                    {block.caption}
                  </figcaption>
                </figure>
              );
            }

            if (block.type === "quote") {
              return (
                <blockquote
                  className="blog-article-quote"
                  key={index}
                >
                  “{block.quote}”
                </blockquote>
              );
            }

            return (
              <section
                className="blog-article-section"
                key={index}
              >
                {block.heading && (
                  <h2>{block.heading}</h2>
                )}

                {block.paragraphs?.map(
                  (paragraph, paragraphIndex) => (
                    <p key={paragraphIndex}>
                      {paragraph}
                    </p>
                  )
                )}
              </section>
            );
          })}

        </article>

        {/* Related Stories */}
        <section className="related-stories">

          <div className="related-stories-header">

            <div>
              <span>CONTINUE READING</span>

              <h2>
                More from
                <em> the Journal.</em>
              </h2>
            </div>

            <Link to="/blog">
              View all
              <ArrowUpRight size={16} />
            </Link>

          </div>

          <div className="related-stories-grid">

            {relatedPosts
              .filter((item) => item.slug !== slug)
              .map((item) => (
                <Link
                  to={`/blog/${item.slug}`}
                  className="related-story"
                  key={item.slug}
                >
                  <span>{item.category}</span>

                  <h3>{item.title}</h3>

                  <div>
                    Read story
                    <ArrowUpRight size={15} />
                  </div>
                </Link>
              ))}

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
};

export default BlogDetails;