import React from "react";

import AnnouncementBar from "../components/AnnouncementBar";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import FeaturedCollection from "../components/FeaturedCollection";
import ProductSection from "../components/ProductSection";
import BrandStory from "../components/BrandStory";
import RiderHorse from "../components/RiderHorse";
import NewArrivals from "../components/NewArrivals";
import PromoBanner from "../components/PromoBanner";
import WhyUs from "../components/WhyUs";
import Reviews from "../components/Reviews";
import Journal from "../components/Journal";
import Instagram from "../components/Instagram";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";

import "./Home.css";

const Home = () => {
  return (
    <div className="home-page">

      {/* =========================================
          ANNOUNCEMENT BAR
      ========================================= */}
      {/* <AnnouncementBar /> */}

      {/* =========================================
          NAVBAR
      ========================================= */}
      <Navbar />

      <main>

        {/* =========================================
            HERO
        ========================================= */}
        <section className="home-section home-hero-section">
          <Hero />
        </section>

        {/* =========================================
            SHOP BY CATEGORY
        ========================================= */}
        <section
          id="categories"
          className="home-section"
        >
          <CategorySection />
        </section>

        {/* =========================================
            FEATURED COLLECTION
        ========================================= */}
        <section
          id="featured"
          className="home-section"
        >
          <FeaturedCollection />
        </section>

        {/* =========================================
            BEST SELLERS
        ========================================= */}
        <section
          id="best-sellers"
          className="home-section"
        >
          <ProductSection />
        </section>

        {/* =========================================
            CRAFTSMANSHIP / BRAND STORY
        ========================================= */}
        <section
          id="craftsmanship"
          className="home-section"
        >
          <BrandStory />
        </section>

        {/* =========================================
            FOR RIDER | FOR HORSE
        ========================================= */}
        <section
          id="rider-horse"
          className="home-section"
        >
          <RiderHorse />
        </section>

        {/* =========================================
            NEW ARRIVALS
        ========================================= */}
        <section
          id="new-arrivals"
          className="home-section"
        >
          <NewArrivals />
        </section>

        {/* =========================================
            PROMOTIONAL BANNER
        ========================================= */}
        <section
          id="promotion"
          className="home-section home-promo-section"
        >
          <PromoBanner />
        </section>

        {/* =========================================
            WHY SADDLE & CREST
        ========================================= */}
        <section
          id="why-saddle-crest"
          className="home-section"
        >
          <WhyUs />
        </section>

        {/* =========================================
            CUSTOMER REVIEWS
        ========================================= */}
        <section
          id="reviews"
          className="home-section"
        >
          <Reviews />
        </section>

        {/* =========================================
            JOURNAL
        ========================================= */}
        <section
          id="journal"
          className="home-section"
        >
          <Journal />
        </section>

        {/* =========================================
            INSTAGRAM / SOCIAL
        ========================================= */}
        <section
          id="instagram"
          className="home-section"
        >
          <Instagram />
        </section>

        {/* =========================================
            NEWSLETTER
        ========================================= */}
        <section
          id="newsletter"
          className="home-section home-newsletter-section"
        >
          <Newsletter />
        </section>

      </main>

      {/* =========================================
          FOOTER
      ========================================= */}
      <Footer />

    </div>
  );
};

export default Home;