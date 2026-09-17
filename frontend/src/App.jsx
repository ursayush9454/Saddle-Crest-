import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Rider from "./pages/Rider";
import Horse from "./pages/Horse";
import Collections from "./pages/Collections";
import JournalPage from "./pages/JournalPage";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import ProductDetails from "./pages/ProductDetails";
import Orders from "./pages/Order";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ShippingDelivery from "./pages/ShippingDelivery";
import ReturnsRefunds from "./pages/ReturnsRefunds";
import CancellationPolicy from "./pages/CancellationPolicy";
import PolicyPage from "./components/PolicyPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/Faq";
import Terms from "./pages/Terms";
import Reviews from "./pages/Reviews";
import Story from "./pages/Story";



// Context
import { ShopProvider } from "./ShopContext/ShopContext";

// Components
import ScrollToTop from "./components/Scrolltop";

const App = () => {
  return (
    <ShopProvider>

      <ScrollToTop />

      <Routes>

        {/* =========================================
            HOME
        ========================================= */}
        <Route
          path="/"
          element={<Home />}
        />

            <Route path="/About"
            element={<About/>}/>

        {/* =========================================
            SHOP
        ========================================= */}
        <Route
          path="/shop"
          element={<Shop />}
        />

        {/* =========================================
            RIDER
        ========================================= */}
        <Route
          path="/rider"
          element={<Rider />}
        />

        {/* =========================================
            HORSE
        ========================================= */}
        <Route
          path="/horse"
          element={<Horse />}
        />

        {/* =========================================
            COLLECTIONS
        ========================================= */}
        <Route
          path="/collections"
          element={<Collections />}
        />

        {/* =========================================
            JOURNAL
        ========================================= */}
        <Route
          path="/journal"
          element={<JournalPage />}
        />

        {/* =========================================
            PRODUCT DETAILS
        ========================================= */}
        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        {/* =========================================
            AUTH
        ========================================= */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =========================================
            CART
        ========================================= */}
        <Route
          path="/cart"
          element={<Cart />}
        />

        {/* =========================================
            WISHLIST
        ========================================= */}
        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        {/* =========================================
            CHECKOUT
        ========================================= */}
        <Route
          path="/checkout"
          element={<Checkout />}
        />

        {/* =========================================
            ORDERS
        ========================================= */}
        <Route
          path="/order"
          element={<Orders />}
        />

        {/* =========================================
            PROFILE
        ========================================= */}
        <Route
          path="/profile"
          element={<Profile />}
        />


       
<Route
  path="/shipping-delivery"
  element={<ShippingDelivery />}
/>

<Route
  path="/returns-refunds"
  element={<ReturnsRefunds />}
/>

<Route
  path="/cancellation-policy"
  element={<CancellationPolicy />}
/>

<Route
  path="/terms"
  element={<Terms />}
/> 

<Route
  path="/privacy-policy"
  element={<PolicyPage/>}
/> 

<Route path="/Contact" element={<Contact/>}/>

<Route path="/Faq" element={<FAQ/>}/>

 <Route
          path="/reviews"
          element={<Reviews />}/>

             <Route
          path="/story"
          element={<Story />}/>


      </Routes>

    </ShopProvider>
  );
};

export default App;