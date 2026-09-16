import React, { useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Categories from "./pages/Categories";
import AddProduct from "./pages/AddProduct";
const ProtectedLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="admin-app">
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <main className="admin-main">
        <Topbar setSidebarOpen={setSidebarOpen} />

        <div className="admin-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route
              path="/products"
              element={<Products />}
            />

            <Route
              path="/orders"
              element={<Orders />}
            />

            <Route
              path="/customers"
              element={<Customers />}
            />

            <Route
              path="/categories"
              element={<Categories />}
            />

            <Route
              path="*"
              element={<Navigate to="/" replace />}/>
              <Route path="/add-product" element={<AddProduct/>}/>
          
          </Routes>
        </div>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/*"
          element={<ProtectedLayout />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;